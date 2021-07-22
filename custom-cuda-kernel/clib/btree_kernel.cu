#include <vector>
#include <torch/extension.h>
#include <cuda.h>
#include <cuda_runtime.h>

template <typename scalar_t>
__global__ void get_paths_kernel(
    const int* leaf_indices,
    const torch::PackedTensorAccessor32<scalar_t, 2, torch::RestrictPtrTraits>* nodes,
    const int num_leaf_indices,
    const int num_features,
    const int max_depth,
    torch::PackedTensorAccessor32<scalar_t, 3, torch::RestrictPtrTraits> paths) {
  const int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i < num_leaf_indices) {
    const int idx = leaf_indices[i];
    int c_idx = idx;
    for (int k = max_depth - 1; k >= 0; k--) {
      for (int n = 0; n < num_features; n++) {
        paths[i][k][n] = nodes[k][c_idx][n];
      }
      c_idx = c_idx / 2;
    }
  }
}

torch::Tensor get_paths_cuda(
    std::vector<int> &leaf_indices,
    std::vector<torch::Tensor> &nodes,
    int num_features,
    int max_depth) {
  int num_leaf_indices = leaf_indices.size();
  torch::Tensor paths = torch::zeros({num_leaf_indices, max_depth, num_features}).to(nodes[0].device());
  const int threads = 1024;
  const dim3 blocks(leaf_indices.size() / threads);
  AT_DISPATCH_FLOATING_TYPES(nodes[0].type(), "get_paths_cuda", ([&] {
    // Create accessor array from nodes
    std::vector<torch::PackedTensorAccessor32<scalar_t, 2, torch::RestrictPtrTraits>> nodes_a;
    for (int i = 0; i < max_depth; i++) {
      nodes_a.push_back(nodes[i].packed_accessor32<scalar_t, 2, torch::RestrictPtrTraits>());
    }
    // Launch kernel
    get_paths_kernel<scalar_t><<<blocks, threads>>>(
        leaf_indices.data(),
        nodes_a.data(),
        num_leaf_indices,
        num_features,
        max_depth,
        paths.packed_accessor32<scalar_t, 3, torch::RestrictPtrTraits>());
  }));
  return paths;
}

