import torch
from torch import nn

class NeRF(nn.Module):

    def __init__(self, device, min_bounds, max_bounds, num_enc_p=10, num_enc_d=4, num_ch_p=384, num_ch_d=128, num_factors=6):
        super(NeRF, self).__init__()
        self.device = device
        self.num_enc_p = num_enc_p
        self.num_enc_d = num_enc_d
        self.num_ch_p = num_ch_p
        self.num_ch_d = num_ch_d
        self.num_factors = num_factors
        self.min_bounds = min_bounds
        self.max_bounds = max_bounds
        self.layers_p = nn.ModuleList([
            self.layer(6 * num_enc_p, num_ch_s),
            self.layer(num_ch_p, num_ch_p),
            self.layer(num_ch_p, num_ch_p),
            self.layer(num_ch_p, num_ch_p),
            self.layer(num_ch_p, num_ch_p),
            self.layer(6 * num_enc_p + num_ch_p, num_ch_p),
            self.layer(num_ch_p, num_ch_p),
            self.layer(num_ch_p, num_ch_p),
            self.layer(num_ch_p, num_ch_p + 1, act_fn = torch.nn.Identity),
            self.layer(num_ch_p, num_ch_p // 2),
            self.layer(num_ch_p // 2, 3 * num_factors, act_fn = torch.nn.Sigmoid)
        ])
        self.layers_d = nn.ModuleList([
            self.layer(6 * num_enc_d, num_ch_d),
            self.layer(num_ch_d, num_ch_d),
            self.layer(num_ch_d, num_ch_d),
            self.layer(num_ch_d, num_ch_d),
            self.layer(num_ch_d, num_factors, act_fn = torch.nn.Softmax)
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
        lat = (i - W/2) / W
        lon = (j - H/2) / H
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
        p_res1 = self.layers_p[0](p_enc)
        p_res2 = self.layers_p[1](p_res1)
        p_res3 = self.layers_p[2](p_res2)
        p_res4 = self.layers_p[3](p_res3)
        p_res5 = self.layers_p[4](p_res4)
        p_res6 = self.layers_p[5](torch.cat([p_enc, p_res5], dim=1))
        p_res7 = self.layers_p[6](p_res6)
        p_res8 = self.layers_p[7](p_res7)
        p_res9 = self.layers_p[8](p_res8)
        density = F.relu(p_res9[:,0])
        res10 = self.layers_p[9](p_res9[:,1:])
        p_factors = self.layers_p[10](p_res10)
        p_factors = p_factors.reshape([p.shape[0], 3, num_factors])
        d_res1 = self.layers_d[0](d_enc)
        d_res2 = self.layers_d[1](d_res1)
        d_res3 = self.layers_d[2](d_res2)
        d_res4 = self.layers_d[3](d_res3)
        d_factors = self.layers_d[4](d_res4)
        d_factors = d_factors.reshape([d.shape[0], num_factors, 1])
        color = torch.squeeze(torch.bmm(d_factors, p_factors))
        return [color, density]