#include "../headers/ImageUtils.h"
#define STB_IMAGE_IMPLEMENTATION
#include "../lib/stb_image.h"
#include <iostream>
#include "../headers/Image.h"

namespace Huntard {
	Image* ImageUtils::Capture(HWND hWnd, int x0, int y0, int x1, int y1) {
		SetForegroundWindow(hWnd); //Bring the  window to the front.
		HDC hScreen = GetDC(hWnd);
		BITMAP structBitmapHeader;
		memset(&structBitmapHeader, 0, sizeof(BITMAP));
		HGDIOBJ hgdiobj = GetCurrentObject(hScreen, OBJ_BITMAP);
		GetObject(hgdiobj, sizeof(BITMAP), &structBitmapHeader);
		int frameWidth = structBitmapHeader.bmWidth;
		int frameHeight = structBitmapHeader.bmHeight;
		HDC hDC = CreateCompatibleDC(hScreen);
		HBITMAP hBitmap = CreateCompatibleBitmap(hScreen, x1 - x0, y1 - y0);
		HGDIOBJ old_obj = SelectObject(hDC, hBitmap);
		BOOL ret = BitBlt(hDC, 0, 0, x1 - x0, y1 - y0, hScreen, x0, y0, SRCCOPY);
		if (ret == 0) std::cout << "[Error] Runtime error! BitBlt failed." << std::endl;
		BITMAPINFO BMInfo = { 0 };
		BMInfo.bmiHeader.biSize = sizeof(BMInfo.bmiHeader);
		//BMInfo.bmiHeader.biBitCount = 32;
		ret = GetDIBits(hDC, hBitmap, 0, 0, NULL, &BMInfo, DIB_RGB_COLORS);
		if (ret == 0) std::cout << "[Error] Runtime error! GetDIBits failed." << std::endl;
		BYTE * lpPixels = new BYTE[BMInfo.bmiHeader.biSizeImage];
		// if w(BMInfo.bmiHeader.biSizeImage != 4 * (x1 - x0) * (y1 - y0)) std::cout << "[Error] Runtime error! Captured image does not match dimensions." << std::endl;
		BMInfo.bmiHeader.biBitCount = 32;
		BMInfo.bmiHeader.biCompression = BI_RGB;
		ret = GetDIBits(hDC, hBitmap, 0, BMInfo.bmiHeader.biHeight, (LPVOID)lpPixels, &BMInfo, DIB_RGB_COLORS);
		if (ret == 0) std::cout << "[Error] Runtime error! GetDiBits failed." << std::endl;
		DeleteObject(hBitmap);
		DeleteDC(hDC);
		DeleteDC(hScreen);
		ReleaseDC(NULL, hDC);
		ReleaseDC(NULL, hScreen);
		Image* img = new Image();
		img->bytes = lpPixels;
		img->width = x1 - x0;
		img->height = y1 - y0;
		img->bmi = BMInfo;
		return img;
	}
	void ImageUtils::CopyToClipboard(Image * img) {
		HDC hdc = ::GetDC(NULL);
		HBITMAP hbmp = CreateDIBitmap(hdc, &img->bmi.bmiHeader, CBM_INIT, img->bytes, &img->bmi, DIB_RGB_COLORS);
		if (hbmp == NULL) {
			::MessageBox(NULL, L"Couldnotloadthedesiredimageimage", L"Error", MB_OK);
			return;
		}
		::ReleaseDC(NULL, hdc);
		OpenClipboard(NULL);
		EmptyClipboard();
		SetClipboardData(CF_BITMAP, hbmp);
		CloseClipboard();
		DeleteObject(hbmp);
	}
	Image* ImageUtils::ReadBitmap(const char* filename) {
		int width, height, bpp;
		uint8_t* rgb_image = stbi_load(filename, &width, &height, &bpp, 3);
		if (rgb_image == NULL) throw std::runtime_error("Failed to read bitmap.");
		Image* img = new Image();
		img->width = width;
		img->height = height;
		img->bytes = new unsigned char[4 * width * height];
		int j = 0;
		for (int i = 0; i < width * height * 3; i += 3) {
			unsigned char b = rgb_image[i + 0];
			unsigned char g = rgb_image[i + 1];
			unsigned char r = rgb_image[i + 2];
			img->bytes[j + 0] = r;
			img->bytes[j + 1] = g;
			img->bytes[j + 2] = b;
			img->bytes[j + 3] = 255;
			j += 4;
		}
		img->bmi = { 0 };
		img->bmi.bmiHeader.biBitCount = 32;
		img->bmi.bmiHeader.biClrImportant = 0;
		img->bmi.bmiHeader.biClrUsed = 0;
		img->bmi.bmiHeader.biCompression = 0;
		img->bmi.bmiHeader.biHeight = height;
		img->bmi.bmiHeader.biPlanes = 1;
		img->bmi.bmiHeader.biSize = 40;
		img->bmi.bmiHeader.biSizeImage = width * height * 4;
		img->bmi.bmiHeader.biWidth = width;
		img->bmi.bmiHeader.biXPelsPerMeter = 0;
		img->bmi.bmiHeader.biYPelsPerMeter = 0;
		img->bmi.bmiColors->rgbRed = 0;
		img->bmi.bmiColors->rgbGreen = 0;
		img->bmi.bmiColors->rgbBlue = 0;
		img->bmi.bmiColors->rgbReserved = 0;
		stbi_image_free(rgb_image);
		return img;
	}
	Color ImageUtils::AvgColor(Image * img) {
		Color result;
		float R = 0;
		float G = 0;
		float B = 0;
		for (int i = 0; i < img->width * img->height * 4; i += 4)
		{
			unsigned char r = img->bytes[i + 0];
			unsigned char g = img->bytes[i + 1];
			unsigned char b = img->bytes[i + 2];
			unsigned char a = img->bytes[i + 3];
			R += r;
			G += g;
			B += b;
		};
		R /= img->width * img->height; result.r = (unsigned char)R;
		G /= img->width * img->height; result.g = (unsigned char)G;
		B /= img->width * img->height; result.b = (unsigned char)B;
		return result;
	}
	float ImageUtils::AvgBrightness(Image * img) {
		float result = 0.0;
		for (int i = 0; i < img->width * img->height * 4; i += 4)
		{

			unsigned char r = img->bytes[i + 0];
			unsigned char g = img->bytes[i + 1];
			unsigned char b = img->bytes[i + 2];
			unsigned char a = img->bytes[i + 3];
			result += (r + b + g) / (3 * 255.0f);
		};
		result /= img->width * img->height;
		return result;
	}
	void ImageUtils::Grayscale(Image * img) {
		for (int i = 0; i < img->width * img->height * 4; i += 4)
		{
			int gray = (img->bytes[i + 0] + img->bytes[i + 1] + img->bytes[i + 2]) / 3;
			img->bytes[i + 0] = img->bytes[i + 1] = img->bytes[i + 2] = (unsigned char)gray;
		};
	}
	void ImageUtils::Radicalize(Image * img, unsigned char threshold) {
		for (int i = 0; i < img->width * img->height * 4; i += 4)
		{
			int gray = (img->bytes[i + 0] + img->bytes[i + 1] + img->bytes[i + 2]) / 3;
			img->bytes[i + 0] = img->bytes[i + 1] = img->bytes[i + 2] = (unsigned char)(gray > threshold ? 255 : 0);
		};
	}
	Image* ImageUtils::Clone(Image * img) {
		Image* result = new Image();
		result->width = img->width;
		result->height = img->height;
		result->bmi = img->bmi;
		result->bytes = new unsigned char[img->width * img->height * 4];
		for (int i = 0; i < img->width * img->height * 4; i += 1) result->bytes[i] = img->bytes[i];
		return result;
	}
	void ImageUtils::Convolve(Image * img, Kernel kernel) {
		Image* cln = Clone(img);
		for (int i = 0; i < img->width * img->height * 4; i += 4)
		{
			float sr = 0.0; float sg = 0.0; float sb = 0.0;//floatsa=0.0;
			for (int j = 0; j < kernel.width * kernel.height; j += 1)
			{
				int dx = j % kernel.width - (kernel.width / 2);
				int dy = j / kernel.width - (kernel.height / 2);
				try {
					int index = i + dx * 4 + dy * 4 * img->width;
					unsigned char kr = cln->bytes[min(cln->width * cln->height * 4, max(0, index))];
					index++;
					unsigned char kg = cln->bytes[min(cln->width * cln->height * 4, max(0, index))];
					index++;
					unsigned char kb = cln->bytes[min(cln->width * cln->height * 4, max(0, index))];
					// index++;
					// unsigned char ka = img->bytes[...];
					sr += kr * kernel.entries[j];
					sg += kg * kernel.entries[j];
					sb += kb * kernel.entries[j];
					//sa += ka * kernel.entries[j];
				}
				catch (...) {
					std::cout << "[Error] Detected corrupted image: Pretending nothing serious happened..." << std::endl;
					return;
				}
			}
			img->bytes[i + 0] = (unsigned char)min(255.0f, max(0.0f, sr));
			img->bytes[i + 1] = (unsigned char)min(255.0f, max(0.0f, sg));
			img->bytes[i + 2] = (unsigned char)min(255.0f, max(0.0f, sb));
			img->bytes[i + 3] = 255; //(unsignedchar)sa;
		};
		delete cln;
	}
	float ImageUtils::NormAbs(Image * a, Image * b)
	{
		float result = 0.0f;
		for (int i = 0; i < a->width * a->height * 4; i += 4) {
			float ar = a->bytes[i + 0] / 255.0f;
			float ab = a->bytes[i + 1] / 255.0f;
			float ag = a->bytes[i + 2] / 255.0f;
			float br = b->bytes[i + 0] / 255.0f;
			float bb = b->bytes[i + 1] / 255.0f;
			float bg = b->bytes[i + 2] / 255.0f;
			float rr = (abs(ar - br) + abs(ag - bg) + abs(ab - bb)) / 3.0f;
			result += rr;
		}
		result = result / (a->width * a->height);
		return result;
	}
	float ImageUtils::DotRad(Image* a, Image* b) {
		float result = 0.0f;
		for (int i = 0; i < a->width * a->height * 4; i += 4) {
			float ar = a->bytes[i + 0];
			float br = b->bytes[i + 0];
			if (ar > 0 && br > 0) result += 1;
			else if (abs(ar - br) > 0) result -= 1;
		}
		result = result / (a->width * a->height);
		return result;
	}
}
