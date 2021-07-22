#pragma once
#include <windows.h>

namespace Huntard {
	struct Image {
		unsigned char* bytes;
		int width;
		int height;
		BITMAPINFO bmi;
		~Image()
		{
			if (bytes) delete[] bytes;
			bytes = nullptr;
			//if (&bmi) delete &bmi;
		}
	};
}