#include <vector>
#include <torch/extension.h>

// Forward declaration
torch::Tensor get_paths_cuda(
    std::vector<int> &leaf_indices,
    std::vector<torch::Tensor> &nodes,
    int num_features,
    int max_depth);

PYBIND11_MODULE(TORCH_EXTENSION_NAME, m) {
  m.def("get_paths_cuda", &get_paths_cuda, "Get paths (CUDA)");
}
