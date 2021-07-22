#pragma once

namespace Huntard {
	struct Kernel {
		float* entries;
		int width;
		int height;
		static Kernel Laplace();
		static Kernel HorizontalSobel();
		static Kernel VerticalSobel();
		static Kernel BoxBlur(int radius);
	};
}