using namespace helios;
using namespace std;

Vector3::Vector3(float x, float y, float z) {
	this->data = new float[3];
	this->data[0] = x;
	this->data[1] = y;
	this->data[2] = z;
	this->x = x; this->y = y; this->z = z;
}

Vector3::~Vector3() {
	delete this->data;
}

void Vector3::set(float x, float y, float z) {
	this->x = x; this->data[0] = x;
	this->y = y; this->data[1] = y;
	this->z = z; this->data[2] = z;
}
