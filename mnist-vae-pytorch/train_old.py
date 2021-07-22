import torch
import torch.optim as optim
import matplotlib.pyplot as plt
from itertools import chain
from torch import nn
from torch.distributions.normal import Normal
from torch.nn import functional as F
from torch.utils.data import DataLoader
from model import Encoder, Decoder
from dataset import MnistDataset

epochs = 1
nz = 2
batch_size = 16 #5000
num_workers = 0 #10
device = "cuda:0" if (torch.cuda.is_available()) else "cpu"

def main():
    dataset = MnistDataset("./data", validation=False)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    encoder = Encoder(nz).to(device)
    decoder = Decoder(nz).to(device)
    total_enc_params = sum(p.numel() for p in encoder.parameters())
    total_dec_params = sum(p.numel() for p in decoder.parameters())
    print("Total encoder parameters = %s" % total_enc_params)
    print("Total decoder parameters = %s" % total_dec_params)
    for n in range(0, epochs):
        for batch_ndx, sample in enumerate(loader):
            image_real = sample.to(device)
            z_mean, z_logvar = encoder(image_real)
            eps = torch.randn_like(z_logvar)
            z = z_mean + eps * torch.exp(0.5 * z_logvar)
            image_gen = decoder(z)
            rl = recon_loss(image_real, image_gen) 
            kll = kl_loss(z_mean, z_logvar)
            loss = rl + kll
            encoder_optimizer = optim.AdamW(encoder.parameters(), lr=0.0005)
            decoder_optimizer = optim.AdamW(decoder.parameters(), lr=0.0005)
            loss.backward()
            decoder_optimizer.step()
            encoder_optimizer.step()
            encoder.zero_grad()
            decoder.zero_grad()
            loss_hist.insert(0, loss.item())
            print('[%d, %5d] r-loss: %.3f kl-loss: %.3f' % (n + 1, batch_ndx + 1, rl.item(), kll.item()))
    save(encoder, decoder, n)

def kl_loss(z_mean, z_logvar):
    kl_loss = torch.mean(0.5 * (torch.sum(z_mean ** 2 + z_logvar.exp() - 1 - z_logvar, dim = 1)), dim = 0)
    return kl_loss
    
def recon_loss(image_real, image_gen):
    return F.mse_loss(image_gen, image_real)

def save(encoder, decoder, n):
    torch.save(
        {'epoch': n, 'state_dict': encoder.state_dict(), 'nz': nz}, 
        "checkpoints/encoder_checkpoint.pth")
    torch.save(
        {'epoch': n, 'state_dict': decoder.state_dict(), 'nz': nz}, 
        "checkpoints/decoder_checkpoint.pth")
    
if __name__ == '__main__':
    main()
