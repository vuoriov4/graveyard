#include <iostream>
#include "../headers/Kernel.h"

namespace Huntard {
	Kernel Kernel::BoxBlur(int radius) {
		Kernel blur;
		blur.width = 1 + 2 * radius;
		blur.height = 1 + 2 * radius;
		blur.entries = new float[blur.width * blur.height];
		for (int i = 0; i < blur.width * blur.height; i++) {
			blur.entries[i] = 1.0f / (blur.width * blur.height);
		}
		return blur;
	}
	Kernel Kernel::HorizontalSobel() {
		Kernel laplace; laplace.width = 3; laplace.height = 3;
		laplace.entries = new float[laplace.width * laplace.height]{ -1.0f, 0.0f, 1.0f, -2.0f, 0.0f, 2.0f, -1.0f, 0.0f, 1.0f };
		return laplace;
	}
	Kernel Kernel::VerticalSobel() {
		Kernel laplace; laplace.width = 3; laplace.height = 3;
		laplace.entries = new float[laplace.width * laplace.height]{ -1.0f, -2.0f, -1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 2.0f, 1.0f };
		return laplace;
	}
	Kernel Kernel::Laplace() {
		Kernel laplace; laplace.width = 3; laplace.height = 3;
		laplace.entries = new float[laplace.width * laplace.height]{ 0.0f, 1.0f, 0.0f, 1.0f, -4.0f, 1.0f, 0.0f, 1.0f, 0.0f };
		return laplace;
	}
}
