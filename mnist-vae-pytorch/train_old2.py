import torch
import torch.optim as optim
import matplotlib.pyplot as plt
from itertools import chain
from torch import nn
from torch.distributions.normal import Normal
from torch.nn import functional as F
from torch.utils.data import DataLoader
from model import Generator, Discriminator
from dataset import CatDataset

epochs = 10
nz = 100
batch_size = 64
num_workers = 0
device = "cuda:0" if (torch.cuda.is_available()) else "cpu"
dataset = CatDataset("data")
loader = DataLoader(dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
discriminator = Discriminator(nz, 256).to(device)
generator = Generator(nz, 256).to(device)
gen_optimizer = optim.Adam(generator.parameters(), lr=0.00001, betas=(0.5, 0.999))
discr_optimizer = optim.Adam(discriminator.parameters(), lr=0.00005, betas=(0.5, 0.999))

def main():
    for n in range(0, epochs):
        for batch_ndx, sample in enumerate(loader):
            # discriminator update
            discriminator.zero_grad()
            # real kittie
            image_real = sample.to(device)
            p_real = discriminator(image_real)
            d_loss_real = torch.mean(F.binary_cross_entropy(p_real, torch.full(p_real.shape, 0.95).to(device)))
            d_loss_real.backward()
            # fake kittie
            z = torch.randn((batch_size, nz)).to(device)
            image_gen = generator(z)
            noise = 0.1 * torch.randn((batch_size, 3, 128, 128)).to(device)
            p_fake = discriminator(image_gen + noise)
            d_loss_fake = torch.mean(F.binary_cross_entropy(p_fake, torch.full(p_fake.shape, 0.05).to(device)))
            d_loss_fake.backward()
            discr_optimizer.step()
            d_loss = d_loss_fake + d_loss_real
            # generator update
            generator.zero_grad()
            # fake kittie
            image_gen = image_gen.detach()
            p_fake = discriminator(image_gen)
            g_loss_fake = torch.mean(F.binary_cross_entropy(p_fake, torch.full(p_fake.shape, 0.95).to(device)))
            g_loss_fake.backward()
            gen_optimizer.step()
            g_loss = g_loss_fake 
            if (batch_ndx == 0):
                image_display = torch.squeeze(image_gen[0].permute(1, 2, 0)).detach().cpu().numpy()
                image_display = (image_display + 1) / 2
                plt.imshow(image_display, vmin=0.0, vmax=1.0)
                plt.show()
            print('[%d, %5d] g-loss: %.3f d-loss: %.3f' % (n + 1, batch_ndx + 1, g_loss.item(), d_loss.item()))
    
if __name__ == '__main__':
    main()
