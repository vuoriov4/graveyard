using namespace helios;
using namespace std;

template <class T> Texture<T>::Texture(int width, int height) {
	this->width = width; this->height = height;
	this->data = new T[width * height * 4];
	for (int i = 0; i < this->width * this->height * 4; i += 4) {
		this->data[i+0] = (T) 0;
		this->data[i+1] = (T) 0;
		this->data[i+2] = (T) 0;
		this->data[i+3] = (T) 0;
	}
}

template <class T> Texture<T>::~Texture() {
	delete[] this->data;
}

template <class T> Texture<T>* Texture<T>::clone() {
	Texture<T>* result = new Texture<T>(this->width, this->height);
	for (int i = 0; i < result->width * result->height * 4; i++) {
		result->data[i] = this->data[i];
	}
	return result;
}

template <class T> Texture<T>* Texture<T>::load(const char* filename) {
	int width, height, bpp;
	// todo: throw error if path does not exist
	uint8_t* rgb_Texture = stbi_load(filename, &width, &height, &bpp, 3);
	Texture* result = new Texture<T>(width, height);
	int j = 0;
	for (int i = 0; i < width*height * 3; i += 3) {
		uint8_t r = rgb_Texture[i + 0];
		uint8_t g = rgb_Texture[i + 1];
		uint8_t b = rgb_Texture[i + 2];
		result->data[j+0] = (T) r;
		result->data[j+1] = (T) g;
		result->data[j+2] = (T) b;
		result->data[j+3] = (T) 255;
		j += 4;
	}
	return result;
}
