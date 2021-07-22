#pragma once
#include "./Image.h"
#include "./Color.h"
#include "./Kernel.h"

namespace Huntard {
	class ImageUtils {
	public:
		static Image* Capture(HWND windowHandle, int x0, int y0, int x1, int y1);
		static Image* ReadBitmap(const char* filename);
		static Image* Clone(Image* img);
		static Color AvgColor(Image* img);
		static float AvgBrightness(Image* img);
		static float NormAbs(Image* a, Image* b);
		static float DotRad(Image* a, Image* b);
		static void CopyToClipboard(Image* img);
		static void Grayscale(Image* img);
		static void Radicalize(Image* img, unsigned char threshold);
		static void Convolve(Image* img, Kernel kernel);
	};
}
