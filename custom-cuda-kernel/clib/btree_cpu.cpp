#include <vector>
#include <torch/extension.h>
using namespace torch::indexing;

torch::Tensor get_paths_cpu(
    std::vector<int> &leaf_indices, 
    std::vector<torch::Tensor> &nodes, 
    int num_features,
    int max_depth) { 
  torch::Tensor paths = torch::zeros({(int)leaf_indices.size(), max_depth, num_features});
  for (int i = 0; i < leaf_indices.size(); i++) {
    int idx = leaf_indices[i];
    torch::Tensor path = torch::zeros({max_depth, num_features});
    int c_idx = idx;
    for (int k = max_depth - 1; k >= 0; k--) {
      path.index_put_({k}, nodes[k].index({c_idx}));
      c_idx = c_idx / 2;
    }
    paths.index_put_({i}, path);
  }
  return paths;
}

PYBIND11_MODULE(TORCH_EXTENSION_NAME, m) {
  m.def("get_paths_cpu", &get_paths_cpu, "Get paths (CPU)");
}