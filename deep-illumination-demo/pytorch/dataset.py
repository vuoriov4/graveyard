import os
import torch
import numpy as np
from torch.utils.data import Dataset

class StanfordDragonDataset(Dataset):

    def __init__(self):
        self.root_dir = "./datasets/dragon"
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