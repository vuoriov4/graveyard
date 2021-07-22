import torch
from torch import nn

class Decoder(nn.Module):

    def __init__(self, nz):
        super(Decoder, self).__init__()
        self.nz = nz
        self.nf = 16
        self.nc = 3
        self.seq = nn.Sequential(
            nn.ConvTranspose2d(nz, self.nf * 8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(self.nf * 8),
            nn.LeakyReLU(0.2, inplace=True),
            nn.ConvTranspose2d(self.nf * 8, self.nf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf * 4),
            nn.LeakyReLU(0.2, inplace=True),
            nn.ConvTranspose2d(self.nf * 4, self.nf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf * 2),
            nn.LeakyReLU(0.2, inplace=True),
            nn.ConvTranspose2d(self.nf * 2, self.nf, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf),
            nn.LeakyReLU(0.2, inplace=True),
            nn.ConvTranspose2d(self.nf, self.nc, 4, 2, 1, bias=False),
            nn.Tanh()
        )
    
    def forward(self, z):
        image = self.seq(z)
        return image
        
class Encoder(nn.Module):

    def __init__(self, nz):
        super(Encoder, self).__init__()
        self.nz = nz
        self.nc = 3
        self.nf = 16
        self.seq = nn.Sequential(
            nn.Conv2d(self.nc, self.nf, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(self.nf, self.nf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf * 2),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(self.nf * 2, self.nf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf * 4),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(self.nf * 4, self.nf * 8, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf * 8),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(self.nf * 8, nz, 4, 1, 0, bias=False),
            nn.LeakyReLU(0.2, inplace=True),
        )

    def forward(self, image):
        z = self.seq(image)
        return z
     

class Discriminator(nn.Module):

    def __init__(self, nz):
        super(Discriminator, self).__init__()
        self.nc = 3
        self.nf = 64
        self.seq = nn.Sequential(
            nn.Conv2d(self.nc, self.nf, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(self.nf, self.nf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf * 2),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(self.nf * 2, self.nf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf * 4),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(self.nf * 4, self.nf * 8, 4, 2, 1, bias=False),
            nn.BatchNorm2d(self.nf * 8),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(self.nf * 8, 1, 4, 1, 0, bias=False),
            nn.Sigmoid()
        )

    def forward(self, image):
        p = self.seq(image)
        return p