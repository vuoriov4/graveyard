import torch
from torch import nn

class Generator(nn.Module):

    def __init__(self, nz):
        super(Generator, self).__init__()
        self.nz = nz
        self.seq = nn.Sequential(
            nn.Linear(in_features=(nz), out_features=(256*2*2)),
            nn.Unflatten(1, (256, 2, 2)),
            self.convTransposeLayer(256, 128),
            self.convTransposeLayer(128, 64),
            self.convTransposeLayer(64, 32),
            self.convTransposeLayer(32, 16),
            self.convTransposeLayer(16, 8),
            self.convTransposeLayer(8, 3),
            nn.ConvTranspose2d(3, 3, kernel_size=3, stride=1, padding=1, output_padding=0),
            nn.Tanh()
        )

    def convTransposeLayer(self, in_channels, out_channels):
        return nn.Sequential(
            nn.ConvTranspose2d(in_channels, out_channels, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(),
            nn.ConvTranspose2d(out_channels, out_channels, kernel_size=3, stride=1, padding=1, output_padding=0),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(),
        )

    def forward(self, z):
        image = self.seq(z)
        return image
        
class Discriminator(nn.Module):

    def __init__(self, nz):
        super(Discriminator, self).__init__()
        self.nz = nz
        self.seq = nn.Sequential(
            self.convLayer(3, 8),
            self.convLayer(8, 16),
            self.convLayer(16, 32),
            self.convLayer(32, 64),
            self.convLayer(64, 128),
            self.convLayer(128, 256),
            nn.Flatten(),
            nn.Linear(in_features=(256*2*2), out_features=(1)),
            nn.Sigmoid()
        )
    
    def convLayer(self, in_channels, out_channels):
        return nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(),
        )

    def forward(self, image):
        p = self.seq(image)
        return p
     
        