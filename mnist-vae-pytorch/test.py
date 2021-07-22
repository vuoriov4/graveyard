import torch
import torch.optim as optim
import matplotlib.pyplot as plt
from torch import nn
from model import Encoder, Decoder
from torch.distributions.normal import Normal
from dataset import MnistDataset

device = "cuda:0" if (torch.cuda.is_available()) else "cpu"
dataset = MnistDataset("./data", validation=True)
encoder_state = torch.load("checkpoints/encoder_checkpoint.pth")
decoder_state = torch.load("checkpoints/decoder_checkpoint.pth")
nz = encoder_state['nz']
encoder = Encoder(nz).to(device)
encoder.load_state_dict(encoder_state['state_dict'])
encoder.eval()
decoder = Decoder(nz).to(device)
decoder.load_state_dict(decoder_state['state_dict'])
decoder.eval()
i = 5000

<<<<<<< HEAD
image_real = dataset[0]
plt.imshow(image_real,  cmap='gray', vmin=0, vmax=1.0)
plt.show()
image_gen = encoder(decoder(image_real))
plt.imshow(image_gen,  cmap='gray', vmin=0, vmax=1.0)
plt.show()

#while True:
    #n_dist = Normal(torch.tensor([0.0]), torch.tensor([2.0]))
    #z = n_dist.sample((1,nz)).to(device)
    #z = z.squeeze(2)
    #output_image = decoder(z)
    #output_image = torch.squeeze(output_image).detach().cpu().numpy()
    #plt.imshow(output_image,  cmap='gray', vmin=0, vmax=1.0)
    #plt.show()
=======
while True:
    image_real = torch.unsqueeze(dataset[i].to(device), 0)
    z_mean, z_logvar = encoder(image_real)
    n_dist = Normal(torch.tensor([0.0]), torch.tensor([1.0]))
    eps = torch.randn_like(z_logvar)
    z = z_mean + eps * torch.exp(0.5 * z_logvar)
    image_gen = decoder(z)
    plt.imshow(torch.squeeze(image_real.cpu()), cmap='gray', vmin=-1.0, vmax=1.0)
    plt.show()
    plt.imshow(torch.squeeze(image_gen.detach().cpu()), cmap='gray', vmin=-1.0, vmax=1.0)
    plt.show()
    i += 1
>>>>>>> 6a82884cec21ae7ec4becba8c38a1f68aef76703

