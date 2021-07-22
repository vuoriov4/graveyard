using namespace helios;
using namespace std;

template <class T> Matrix<T>::Matrix(int width, int height) {
	this->width = width; this->height = height;
	this->data = new T[width * height];
	for (int i = 0; i < this->width * this->height; i++) {
		// note: entries are flatmapped in column first order
		this->data[i] = (T) 0;
	}
}

template <class T> Matrix<T>::~Matrix() {
	delete[] this->data;
}

template <class T> Matrix<T>* Matrix<T>::clone() {
	Matrix<T>* result = new Matrix<T>(this->width, this->height);
	for (int i = 0; i < result->width * result->height; i++) {
		result->data[i] = this->data[i];
	}
	return result;
}

template <class T> Matrix<T>* Matrix<T>::identity(int size) {
	Matrix<T>* result = new Matrix<T>(size, size);
	for (int i = 0; i < size; i++) {
		result->data[size*i + i] = (T) 1;
	}
	return result;
}

template <class T> void Matrix<T>::set(int j, int i, T value) {
	this->data[j + i * this->height] = value;
}

template <class T> T Matrix<T>::get(int j, int i) {
	return this->data[j + i * this->height];
}
