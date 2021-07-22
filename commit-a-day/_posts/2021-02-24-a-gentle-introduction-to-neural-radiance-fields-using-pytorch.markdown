---
layout: single
title:  "A gentle introduction to novel view synthesis with Neural Radiance Fields (NeRF)"
date:   2021-02-24
categories: neural-volume-rendering pytorch 
read_time: false
excerpt: "A practical guide to start training your own NeRFs from first principles."
header:
    overlay_color: "#333"
---

## Introduction 

Novel view synthesis is a long-standing topic at the intersection of computer vision and computer graphics. The fundamental goal of novel view synthesis is simple - synthesize an image from a novel viewpoint given a sparse set of reference images. 

![alt text]({{site.url}}/assets/images/illustration.png "Novel view synthesis. [1]")

<div class="caption">Novel view synthesis. (<a href="https://shaohua0116.github.io/Multiview2Novelview/">Source</a>)</div>

Although the problem statement is simple, the problem itself is by nature ill-posed which makes it quite difficult to solve with traditional computer vision methods. Early methods have struggled to produce realistic images, suffering from visual distortions. However, recent advancements in deep learning have made great contributions towards solving the problem, making it possible to synthesize images that are indistinguishable from real photographs (and recently, in real-time!). 

## Neural radiance fields

The paper that revolutionized the field was <a href="https://arxiv.org/abs/2003.08934">NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis</a>. It was not the first to introduce neural volume rendering, but it outperformed previous work and also solved it in a surprisingly simple and elegant way. The model is essentially a multi-layer perceptron (MLP) that takes in a position $$(x, y, z)$$ along with view direction $$(\theta, \phi)$$ and outputs the predicted color and density $$(\textbf{c}, \sigma)$$ at that point, hence the name *radiance field*. The MLP is a relatively simple series of fully connected layers with mostly ReLU activation.  

How do we render an image from a radiance field, then? Similar to ray tracing, for each pixel we find the camera ray  $$\textbf{r}(t)$$ and then use an age-old method from classical volume rendering to obtain the color:

$$C = \int_0^{\infty} T(t) \sigma(\textbf{r}(t)) \textbf{c}(\textbf{r}(t)) dt $$

where

$$T(t) = e^{-\int_0^t \sigma(\textbf{r}(t))dt}  $$

Both of these integrals can be approximated with a finite sampling scheme and hence the method is trivially end-to-end differentiable. The parameters of the model are optimized with gradient descent against ground truth pixel values.

$$Loss = || C - C_{gt} ||^2 $$

Below is an overview of the rendering process and the MLP architecture.

![alt text]({{site.url}}/assets/images/model2.jpg "Model")

<div class="caption">The rendering process. (Adapted from the original <a href="https://arxiv.org/abs/2003.08934">paper</a>)</div>

![alt text]({{site.url}}/assets/images/model3.jpg "Model")

<div class="caption">The MLP model. (Adapted from the original <a href="https://arxiv.org/abs/2003.08934">paper</a>)</div>

Overall it's a remarkably simple method for the amazing results it can produce. Before we can implement this however, there's a few details to cover.

## Approximating the ray integral

The most straightforward way is to approximate the integral with a riemann sum: Take $$N$$ equally spaced samples $$t_i$$ along some boundary $$[a, b]$$ and denote the 
distance between adjacent samples as $$\delta = \frac{b-a}{N-1}$$, then we have 

$$C \approx \sum_{i=1}^N T(t_i) \sigma(\textbf{r}(t_i)) \textbf{c}(\textbf{r}(t_i)) \delta $$

Furthermore, the authors use the following approximation:

$$C \approx \sum_{i=1}^N T(t_i) \alpha_i \textbf{c}(\textbf{r}(t_i))  $$

$$ \alpha_i = 1 - e^{-\sigma(\textbf{r}(t_i)) \delta } $$

$$T(t_i) = \prod_{j=1}^i 1 - \alpha_i $$

If you recall that $$e^{-x} \approx 1-x$$ for infinitesimal $$x$$ and write it out, you should see that both are the same. I'd guess
 the latter one is numerically more stable.

## Stratified sampling and inverse transform sampling

The equally spaced sampling scheme leaves much to be improved on:

- A better strategy is to draw the samples from a stratified uniform distribution. This will increase coverage over multiple training iterations.

- Most of the samples are just empty space which do not contribute to the integral. To allocate more samples to regions that matter, the authors sample from a distribution that is proportional to previously obtained weights, i.e. $$p_i = \frac{T_i \sigma_i}{\sum_i T_i \sigma_i}$$. 

(For the sake of simplicity, I'll leave these out from the implementation below.)

## Positional encoding: A bugfix for coordinate-based MLPs

A roadblock in training  MLPs is that they are inefficient at modeling high frequency functions when using low-dimensional inputs.
In other words the network struggles to capture sharp details.
To counter this issue the authors of the NeRF devised a "bugfix" to the model, in which each input coordinate $$x$$ is mapped to frequency domain $$\gamma(x)$$ before feeding it to the MLP. 

\begin{equation}  \label{eq:1}
\gamma(x) = (\cos(2^0\pi x), \sin(2^0\pi x), \cdot\cdot\cdot , \cos(2^{L-1}\pi x), \sin(2^{L-1}\pi x))
\end{equation}

Note that here the $$x$$ should lie between $$[-1, 1]$$.  If you are interested in the theoretical justification of the trick, read <a href="https://arxiv.org/abs/2006.10739">this</a>. 

## Implementation Part 1: The dataset

Note: you can find the complete source code for this example <a href="https://github.com/vuoriov4/minimal-nerf">here</a>.

The dataset here consists of 400 synthetic images of the "Stanford Dragon" rendered at random viewpoints, along with the camera pose (a 4x4 matrix).

![alt text]({{site.url}}/assets/images/gts.png "Sample images")

<div class="caption">Sample images from the dataset.</div>

For real-world data you might want to look into [COLMAP](https://colmap.github.io/m), [OpenMVG](https://github.com/openMVG/openMVG) or any other SfM library for getting the camera poses. The key thing here is to ensure the coordinate system is consistent with the model: x+ right, y+ up and z- forward. This can be a little tricky to verify since we don't have a ground truth radiance field.

![alt text]({{site.url}}/assets/images/camera.png "Camera system")
<div class="caption">To make things clear, this is how the pose matrix should relate to the camera coordinate system.</div>

And here's the code.

```python
class StanfordDragonDataset(Dataset):

    def __init__(self, root_dir="./dataset"):
        self.root_dir = root_dir
        self.poses = torch.from_numpy(np.load(root_dir + "/poses.npy"))
        self.focal = 220.836477965
    
    def __len__(self):
        filenames = [f for f in os.listdir(self.root_dir) if (f[-3:] in ["jpg", "png"])]
        return len(filenames)

    def __getitem__(self, idx):
        if torch.is_tensor(idx): idx = idx.tolist()[0]
        img_path = self.root_dir + "/gt-%d.png" % (idx % self.__len__())
        image = Image.open(img_path) # (h, w, ch)
        image = torch.from_numpy(np.array(image)) / (256.0 - 1.0)
        pose = self.poses[idx]
        focal = self.focal
        return [image[:,:,:-1], pose, focal]
```
## Implementation Part 2: The Model

As for the model, you might wonder how to get the bounds of integration $$[a, b]$$.
It's a matter of taste, but I opted to use a bounding box for the scene and intersect the camera ray with it via the slab method [4]. The bounding box also gives a convenient way to normalize the coordinates for the encoding trick.

```python
class NeRF(nn.Module):

    def __init__(self, device, min_bounds, max_bounds, num_enc_p=10, num_enc_d=4, num_channels=256):
        super(NeRF, self).__init__()
        self.device = device
        self.num_enc_p = num_enc_p
        self.num_enc_d = num_enc_d
        self.num_channels = num_channels
        self.min_bounds = min_bounds
        self.max_bounds = max_bounds
        self.layers = nn.ModuleList([
            self.layer(6 * num_enc_p, num_channels),
            self.layer(num_channels, num_channels),
            self.layer(num_channels, num_channels),
            self.layer(num_channels, num_channels),
            self.layer(num_channels, num_channels),
            self.layer(6 * num_enc_p + num_channels, num_channels),
            self.layer(num_channels, num_channels),
            self.layer(num_channels, num_channels),
            self.layer(num_channels, num_channels + 1, act_fn = torch.nn.Identity),
            self.layer(6 * num_enc_d + num_channels, num_channels // 2),
            self.layer(num_channels // 2, 3, act_fn = torch.nn.Sigmoid)
        ])
    
    def layer(self, in_features, out_features, act_fn = torch.nn.ReLU):
        return nn.Sequential(
            torch.nn.Linear(in_features, out_features),
            act_fn()
        )

    def get_rays(self, image, camera_pose, focal):
        W = image.shape[1]
        H = image.shape[0]
        i, j = torch.meshgrid(torch.linspace(0, W-1, W), torch.linspace(0, H-1, H))
        dirs = torch.stack([(i - (W - 1) * 0.5) / focal, -(j - (H - 1) * 0.5) / focal, -torch.ones_like(i)], -1)
        rays_d = torch.sum(dirs[..., np.newaxis, :] * camera_pose[:3,:3], -1)
        rays_d = rays_d.permute((1, 0, 2)) # (w, h, ch) -> (h, w, ch)
        rays_d = torch.reshape(rays_d, [-1,3])
        rays_d = rays_d / torch.sqrt(torch.sum(torch.square(rays_d), dim=1))[:,None]
        rays_o = camera_pose[:3,-1].expand(rays_d.shape)
        gt_colors = image.reshape([-1, 3])
        return [rays_o, rays_d, gt_colors]

    def box_intersection(self, positions, directions): 
        inv_directions = 1 / directions
        t0 = (self.min_bounds - positions) * inv_directions
        t1 = (self.max_bounds - positions) * inv_directions
        tmax, _ = torch.min(torch.max(t0, t1), dim=1)
        return tmax
    
    def render_rays(self, positions, directions, num_samples, noise=True):
        batch_size = positions.shape[0]
        path_length = self.box_intersection(positions, directions)
        samples = torch.arange(1, num_samples + 1).to(device) / num_samples
        p = positions[:,None,:] + directions[:,None,:] * samples[None,:,None] * path_length[:,None,None]
        p_flat = torch.reshape(p, (-1, 3)).float()
        d = directions.expand((num_samples, batch_size, 3)).permute((1, 0, 2))
        d_flat = torch.reshape(d, (-1, 3)).float()
        colors, densities = self.forward(p_flat, d_flat)
        colors = colors.reshape((batch_size, num_samples, 3))
        densities = densities.reshape(d.shape[:-1])
        delta = path_length / num_samples
        batch_ones = torch.ones((batch_size, 1)).to(device)
        alpha = 1.0 - torch.exp(-1.0 * densities * delta[:,None])          
        T = torch.cumprod(torch.cat([batch_ones, 1.0 - alpha], -1), -1)[:, :-1]
        weights = T * alpha
        projected_colors = torch.sum(weights[:,:,None] * colors, dim=1)
        depth = torch.sum(weights * samples, dim=1) 
        return [projected_colors, depth, weights]
            
    def encode(self, x, L):
        batch_size = x.shape[0]
        f = ((2.0 ** torch.arange(0, L))).to(device)
        f = f.expand((batch_size, 3, L))
        f = torch.cat([torch.cos(math.pi * f * x[:,:,None]), torch.sin(math.pi * f * x[:,:,None])], dim=2)
        return f.reshape((batch_size, -1))

    def forward(self, p, d):
        p_normalized = -1. + 2. * (p - self.min_bounds) / (self.max_bounds - self.min_bounds)
        p_enc = self.encode(p_normalized, self.num_enc_p);
        d_enc = self.encode(d, self.num_enc_d);
        res1 = self.layers[0](p_enc)
        res2 = self.layers[1](res1)
        res3 = self.layers[2](res2)
        res4 = self.layers[3](res3)
        res5 = self.layers[4](res4)
        res6 = self.layers[5](torch.cat([p_enc, res5], dim=1))
        res7 = self.layers[6](res6)
        res8 = self.layers[7](res7)
        res9 = self.layers[8](res8)
        density = F.relu(res9[:,0])
        res10 = self.layers[9](torch.cat([res9[:,1:], d_enc], dim=1))
        color = self.layers[10](res10)
        return [color, density]
```

## Implementation Part 3: Training

The training process entails pooling a total of $$256*256*400 = 26214400$$ rays into one giant tensor.
The tensor is shuffled and then split into mini-batches for training. A single iteration takes about an hour with a Tesla V100.

```python
# Instantiate dataset & model 
dataset = StanfordDragonDataset()
cuda = True
device = torch.device("cuda") if (cuda) else torch.device("cpu")
min_bounds = torch.Tensor([-10,-10,-10]).to(device)
max_bounds = torch.Tensor([10, 10, 10]).to(device)
model = NeRF(device, min_bounds, max_bounds)
if (cuda): model.cuda()
total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print("Total model parameters: %d" % total_params)
print("Total images: %d" % len(dataset))
```

```python
# Training variables
optimizer = torch.optim.Adam(model.parameters(), lr=5e-4)
iterations = 1000
rays_per_batch = 2**11
num_samples = 256
all_positions = []
all_directions = []
all_gt_colors = []

# Gather all rays
for i in range(len(dataset)):
    image, pose, focal = dataset[i]
    positions, directions, gt_colors = model.get_rays(image, pose, focal)
    all_positions.append(positions)
    all_directions.append(directions)
    all_gt_colors.append(gt_colors)

# Concatenate all rays
all_positions = torch.cat(all_positions, dim=0)
all_directions = torch.cat(all_directions, dim=0)
all_gt_colors = torch.cat(all_gt_colors, dim=0)

# Shuffle rays
shuffle = torch.randperm(all_positions.shape[0])
all_positions = all_positions[shuffle]
all_directions = all_directions[shuffle]
all_gt_colors = all_gt_colors[shuffle]

rays_per_iteration = all_positions.shape[0]
```

```python
# Training loop
for i in range(iterations):
    current_idx = 0
    losses = []
    while(current_idx < rays_per_iteration):
        optimizer.zero_grad()
        indices = torch.arange(current_idx, min(all_positions.shape[0], current_idx + rays_per_batch))
        positions = all_positions[indices].to(device)
        directions = all_directions[indices].to(device)
        colors, depths, weights = model.render_rays(positions, directions, num_samples)
        gt = all_gt_colors[indices].to(device)
        loss = torch.mean(torch.square(colors - gt))
        loss.backward()
        current_idx += rays_per_batch
        optimizer.step()
        print('iteration: %d, loss: %.4f, ray count: %.2f%%' % (i, loss.item(), 100 * current_idx / rays_per_iteration))
    torch.save(model.state_dict(), "model-%d.pth" % i)  
```

## Implementation Part 4: Testing

I trained the model for a single hour, but it takes about 1-2 days for the model to fully converge. 
That being said I rendered a video with the trained model and here are the results:

<p><video style="width: calc(50% - 5px); height: calc(50% - 5px);" src="{{site.url}}/assets/webm/color.webm" autoplay loop></video></p>
<p><video style="width: calc(50% - 5px); height: calc(50% - 5px);" src="{{site.url}}/assets/webm/depth.webm" autoplay loop></video></p>

Not bad for a single iteration, notice how the model succesfully captures specular highlights and depth.
The clutter around the borders is likely caused by the bounding box stopping rays prematurely. 

## Conclusion

So there you have it, the most basic NeRF implementation. It's slow to train, slow to render and needs huge amounts of training data. Since the inception of NeRF, there's been numerous papers that address various issues with the original model.  This <a href="https://dellaert.github.io/NeRF/">blog post</a> by Frank Dellaert is a good compilation some of these papers. In addition, I stumbled on a couple of recent NeRF-inspired papers that already achieve real-time rendering: 
<ul>
    <li><a href="https://arxiv.org/abs/2103.03231">DONeRF: Towards Real-Time Rendering of Neural Radiance Fields using Depth Oracle Networks</a></li>
    <li><a href="https://arxiv.org/pdf/2103.05606.pdf">NeX: Real-time View Synthesis with Neural Basis Expansion</a></li>
</ul>
The field is advancing fast, so go out there and make your own variation!

## References

[1] https://shaohua0116.github.io/Multiview2Novelview/

[2] https://arxiv.org/abs/2006.10739

[3] https://arxiv.org/abs/2003.08934

[4] https://tavianator.com/2011/ray_box.html