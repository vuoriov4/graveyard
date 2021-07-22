import os
import torch
import math
import numpy as np
from PIL import Image
from skimage import io, transform
from torchvision import transforms
from torch.utils.data import Dataset, DataLoader

class MnistDataset(Dataset):

    def __init__(self, root_dir, validation=False):
        self.root_dir = root_dir + "/" + ("testing" if validation else "training")
        self.transform = transforms.Compose([transforms.Grayscale(), transforms.ToTensor(), transforms.Normalize(0.5, 0.5)])
        self.filenames = []
        for i in range(0, 10): 
            self.filenames.append([])
            folder_path = self.root_dir + "/" + str(i)
            img_names = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))] 
            self.filenames[i] = img_names
            
    def __len__(self):
        result = 0
        for i in range(0, 10): result += len(self.filenames[i])
        return result

    def __getitem__(self, idx):
        if torch.is_tensor(idx): idx = idx.tolist()[0]
        digit = 0
        idx_max = len(self.filenames[digit])
        while (idx >= idx_max):
            digit += 1
            idx_max += len(self.filenames[digit])
        index = math.floor(idx / 10)
        folder_path = self.root_dir + "/" + str(digit)
        img_name = folder_path + "/" + self.filenames[digit][(idx % len(self.filenames[digit]))]
        image = Image.fromarray(io.imread(img_name))
        image = self.transform(image)
        return image

class CatDataset(Dataset):

    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.transform = transforms.Compose([
            transforms.Resize((64,64)), 
            transforms.ToTensor(), 
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
        ])
        self.filenames = []
        for i in range(0, 7): 
            self.filenames.append([])
            folder_path = self.root_dir + "/cats/CAT_0" + str(i)
            img_names = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))] 
            self.filenames[i] = img_names
            
    def __len__(self):
        result = 0
        for i in range(0, 7): result += len(self.filenames[i])
        return result

    def __getitem__(self, idx):
        if torch.is_tensor(idx): idx = idx.tolist()[0]
        folder_idx = 0
        max_image_idx = len(self.filenames[folder_idx])
        while (idx >= max_image_idx):
            folder_idx += 1
            max_image_idx += len(self.filenames[folder_idx])
        img_folder_path = "/cats/CAT_0" + str(folder_idx)
        annotation_folder_path = "/annotations/CAT_0" + str(folder_idx)
        img_path = self.root_dir + img_folder_path + "/" + self.filenames[folder_idx][(idx % len(self.filenames[folder_idx]))]
        annotation_path = self.root_dir + annotation_folder_path + "/" + self.filenames[folder_idx][(idx % len(self.filenames[folder_idx]))] + ".cat"
        image = Image.fromarray(io.imread(img_path))
        image_dim = np.array([image.size[0], image.size[1]])
        annotation = np.genfromtxt(annotation_path)
        a_eye_x0 = annotation[1]
        a_eye_y0 = annotation[2]
        a_eye_x1 = annotation[3]
        a_eye_y1 = annotation[4]
        a_eye_diam = math.sqrt((a_eye_x0 - a_eye_x1) * (a_eye_x0 - a_eye_x1) + (a_eye_y0 - a_eye_y1) * (a_eye_y0 - a_eye_y1))
        a_eye_center_x = (a_eye_x1 + a_eye_x0) / 2.0
        a_eye_center_y = (a_eye_y1 + a_eye_y0) / 2.0
        a_crop_x0 = a_eye_center_x - a_eye_diam * 2
        a_crop_y0 = a_eye_center_y - a_eye_diam * 2
        a_crop_x1 = a_eye_center_x + a_eye_diam * 2
        a_crop_y1 = a_eye_center_y + a_eye_diam * 2
        a_eye_angle = math.atan2(a_eye_y1 - a_eye_y0, a_eye_x1 - a_eye_x0)
        # skip bad kitties
        #if (a_crop_x0 < 0 or a_crop_x1 >= image_dim[0]): return None
        #if (a_crop_y0 < 0 or a_crop_y1 >= image_dim[1]): return None
        #if (abs(a_eye_angle) > math.pi/4 or a_eye_diam < 100): return None
        image = image.rotate(360 * a_eye_angle / (math.pi*2), center=(a_eye_center_x, a_eye_center_y))
        image = image.crop((a_crop_x0, a_crop_y0, a_crop_x1, a_crop_y1))
        image = self.transform(image)
        return image
