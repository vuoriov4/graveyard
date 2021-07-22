from setuptools import setup
from torch.utils.cpp_extension import BuildExtension, CppExtension, CUDAExtension

setup(
    name='btree',
    ext_modules = [
        CppExtension('btree_cpu', ['btree_cpu.cpp']),
        CUDAExtension('btree_cuda', ['btree_cuda.cpp', 'btree_kernel.cu'])
    ],
    cmdclass = { 'build_ext': BuildExtension }
)
