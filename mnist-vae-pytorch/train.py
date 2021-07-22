import torch
import torch.optim as optim
import matplotlib.pyplot as plt
from itertools import chain
from torch import nn
from torch.distributions.normal import Normal
from torch.nn import functional as F
from torch.utils.data import DataLoader
from model import Encoder, Decoder, Discriminator
from dataset import CatDataset

epochs = 10
nz = 200
batch_size = 64
num_workers = 10
device = "cuda:0" if (torch.cuda.is_available()) else "cpu"
dataset = CatDataset("data")
loader = DataLoader(dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
encoder = Encoder(nz).to(device)
decoder = Decoder(nz).to(device)
#discriminator = Discriminator(nz).to(device)
encoder_optimizer = optim.AdamW(encoder.parameters(), lr=0.0001)
decoder_optimizer = optim.AdamW(decoder.parameters(), lr=0.0001)
#discriminator_optimizer = optim.AdamW(discriminator.parameters(), lr=0.0001)

def main():
    for n in range(0, epochs):
        for batch_ndx, sample in enumerate(loader):
            encoder.zero_grad()
            decoder.zero_grad()
            image_in = sample.to(device)
            lat = encoder(image_in)
            image_gen = decoder(lat)
            #p = discriminator(image_gen)
            loss = nn.MSELoss()(image_in, image_gen)
            #+ torch.mean(F.binary_cross_entropy(p, torch.full(p.shape, 1.0).to(device))) + torch.mean(F.binary_cross_entropy(p, torch.full(p.shape, 0.0).to(device)))
            loss.backward()
            decoder_optimizer.step()
            encoder_optimizer.step()
            #discr_loss = torch.mean(F.binary_cross_entropy(p, torch.full(p.shape, 0).to(device))) + torch.mean(F.binary_cross_entropy(p, torch.full(p.shape, 1).to(device)))
            #discr_loss.backward()
            #discriminator_optimizer.step()
            if (batch_ndx == 0):
                image_display = torch.squeeze(image_in[0].permute(1, 2, 0)).detach().cpu().numpy()
                image_display = (image_display + 1) / 2
                plt.imshow(image_display, vmin=0.0, vmax=1.0)
                plt.show()
                image_display = torch.squeeze(image_gen[0].permute(1, 2, 0)).detach().cpu().numpy()
                image_display = (image_display + 1) / 2
                plt.imshow(image_display, vmin=0.0, vmax=1.0)
                plt.show()
            print('[%d, %5d] loss: %.3f' % (n + 1, batch_ndx + 1, loss.item()))
    save(encoder, decoder, n)
    
def save(encoder, decoder, n):
    torch.save(
        {'epoch': n, 'state_dict': encoder.state_dict(), 'nz': nz}, 
        "checkpoints/encoder_checkpoint.pth")
    torch.save(
        {'epoch': n, 'state_dict': decoder.state_dict(), 'nz': nz}, 
        "checkpoints/decoder_checkpoint.pth")

if __name__ == '__main__':
    main()
