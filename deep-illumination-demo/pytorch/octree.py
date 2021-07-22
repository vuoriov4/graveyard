import numpy as np

class Octree:
    def __init__(self, depth, min_bounds, max_bounds):
        self.depth = depth
        self.min_bounds = min_bounds
        self.max_bounds = max_bounds
        self.data = []
        self.blocks = [[-1, -1, -1, -1, -1, -1, -1, -1]]
    
    def insert(position, f):
        c_min_bounds = self.min_bounds 
        c_max_bounds = self.max_bounds 
        for i in range(self.depth):
            np.all(position > c_min_bounds) and np.all(position < c_max_bounds)
        
        
