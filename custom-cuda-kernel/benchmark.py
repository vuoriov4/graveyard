import torch
from python.btree import BinaryTree
from time import process_time
from btree_cpu import get_paths_cpu
from btree_cuda import get_paths_cuda

max_depth = 14
num_features = 4
btree = BinaryTree(max_depth, num_features)
leaf_indices = range(0, 2**(max_depth - 1))

# Python
start = process_time()
paths = btree.get_paths(leaf_indices)
end = process_time()
print("Python: %.2f seconds" % (end - start))

# C++
start = process_time()
paths_cpu = get_paths_cpu(leaf_indices, btree.nodes, btree.num_features, btree.max_depth)
end = process_time()
print("C++: %.2f seconds" % (end - start))

# CUDA
nodes_cuda = list(map(lambda t: t.cuda(), btree.nodes))
start = process_time()
paths_cuda = get_paths_cuda(leaf_indices, nodes_cuda, btree.num_features, btree.max_depth)
print(paths_cuda)

end = process_time()
print("CUDA: %.2f seconds" % (end - start))

# Validity check
assert(torch.sum(torch.square(paths - paths_cpu)).item() == 0.0)
assert(torch.sum(torch.square(paths - paths_cuda.cpu())).item() == 0.0)
