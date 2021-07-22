import torch

class BinaryTree:
    
    def __init__(self, max_depth, num_features):
        """
        Initialize the binary tree.
        
        Args:
            max_depth (int): Maximum depth.
            num_features (int or list of ints): Number of features for each node.
        """
        self.max_depth = max_depth
        self.num_features = num_features
        self.nodes = []
        for k in range(0, max_depth):
            self.nodes.append(torch.randn(2 ** k, num_features))
    
    def get_paths(self, leaf_indices):
        """
        Find the path(s) from leaf index to base.
        
        Args:
            leaf_indices (list of ints): List of leaf indices.
        """
        paths = torch.zeros(len(leaf_indices), self.max_depth, self.num_features)
        for i, idx in enumerate(leaf_indices):
            path = torch.zeros((self.max_depth, self.num_features))
            c_idx = idx
            for k in range(self.max_depth - 1, -1, -1):
                path[k] = self.nodes[k][c_idx]
                c_idx = c_idx // 2
            paths[i] = path
        return paths