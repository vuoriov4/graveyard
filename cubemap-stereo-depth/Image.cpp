#include "csd.h"
#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image.h"
#include "stb_image_write.h"
#include <algorithm>
using namespace csd;
using namespace std;

Image::Image() {}

Image::Image(int width, int height) {
	this->width = width; this->height = height;
	this->data = new double[width * height * 4];
	for (int i = 0; i < this->width * this->height * 4; i++) {
		this->data[i] = (double)0;
	}
}

Image::Image(Vector3 color) {
	this->width = 1;
	this->height = 1;
	this->data = new double[4];
	this->data[0] = color.x;
	this->data[1] = color.y;
	this->data[2] = color.z;
	this->data[3] = 1.0;
}

Image::~Image() {
	delete this->data;
}

Image Image::clone() {
	Image result(this->width, this->height);
	for (int i = 0; i < result.width * result.height * 4; i++) {
		result.data[i] = this->data[i];
	}
	return result;
}

Vector3 Image::getColor(int i, int j) {
	assert(i >= 0 && i < this->width  && j >= 0 && j < this->height);
	int idx = (i + j * this->width) * 4;
	return Vector3(
		this->data[idx + 0],
		this->data[idx + 1],
		this->data[idx + 2]
		);
}

void Image::setColor(int i, int j, Vector3 color) {
	assert(i >= 0 && i < this->width && j >= 0 && j < this->height);
	int idx = (i + j * this->width) * 4;
	this->data[idx + 0] = color.x;
	this->data[idx + 1] = color.y;
	this->data[idx + 2] = color.z;
	this->data[idx + 3] = 1.0;
}

Image* Image::load(const char* filename) {
	int width, height, bpp;
	uint8_t* rgb_Image = stbi_load(filename, &width, &height, &bpp, 3);
	Image* result = new Image(width, height);
	int j = 0;
	for (int i = 0; i < width * height * 3; i += 3) {
		uint8_t r = rgb_Image[i + 0];
		uint8_t g = rgb_Image[i + 1];
		uint8_t b = rgb_Image[i + 2];
		result->data[j + 0] = (double)(r / 255.0);
		result->data[j + 1] = (double)(g / 255.0);
		result->data[j + 2] = (double)(b / 255.0);
		result->data[j + 3] = (double)(1.0);
		j += 4;
	}
	delete[] rgb_Image;
	return result;
}

void Image::writeJPG(const char* path) {
	int len = this->width * this->height * 4;
	unsigned char* udata = new unsigned char[len];
	for (int i = 0; i < this->width * this->height * 4; i++) {
		udata[i] = (unsigned char)(this->data[i] * 255);
	}
	stbi_write_jpg(path, this->width, this->height, 4, udata, this->width * 4);
	delete[] udata;
	printf("OUT: %s\n", path);
}

