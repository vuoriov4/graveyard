import torch
import torch.optim as optim
import matplotlib.pyplot as plt
from torch import nn
from dataset import CatDataset

i = 0
dataset = CatDataset("D:\\")
while True:
    image = dataset[i]
    if (image == None): 
        i += 1
        continue
    plt.imshow(image.permute(1, 2, 0), vmin=-1.0, vmax=1.0)
    plt.show()
    i += 1