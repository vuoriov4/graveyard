#include "csd.h"
#include <algorithm>
using namespace csd;
using namespace std;

Vector3::Vector3() {
	this->x = 0; this->y = 0; this->z = 0;
}

Vector3::Vector3(double x, double y, double z) {
	this->x = x; this->y = y; this->z = z;
}

void Vector3::set(double x, double y, double z) {
	this->x = x; this->y = y; this->z = z;
}

Vector3 Vector3::add(Vector3 w) {
	return Vector3(this->x + w.x, this->y + w.y, this->z + w.z);
}

Vector3 Vector3::sub(Vector3 w) {
	return Vector3(this->x - w.x, this->y - w.y, this->z - w.z);
}

Vector3 Vector3::scale(double s) {
	return Vector3(this->x * s, this->y * s, this->z * s);
}

Vector3 Vector3::mult(Vector3 w) {
	return Vector3(this->x * w.x, this->y * w.y, this->z * w.z);
}

Vector3 Vector3::cross(Vector3 w) {
	return Vector3(
		this->y * w.z - this->z * w.y,
		this->z * w.x - this->x * w.z,
		this->x * w.y - this->y * w.x
		);
}

double Vector3::dot(Vector3 w) {
	return this->x * w.x + this->y * w.y + this->z * w.z;
}

double Vector3::mdot(Vector3 w) {
	return std::max(0.0, this->x * w.x + this->y * w.y + this->z * w.z);
}

double Vector3::adot(Vector3 w) {
	return std::abs(this->x * w.x + this->y * w.y + this->z * w.z);
}

double Vector3::length() {
	return sqrt(this->dot(*this));
}

double Vector3::min() {
	return std::min(std::min(this->x, this->y), this->z);
}

double Vector3::max() {
	return std::max(std::max(this->x, this->y), this->z);
}

Vector3 Vector3::normalize() {
	double len = sqrt(this->dot(*this));
	return Vector3(this->x / len, this->y / len, this->z / len);
}

Vector3 Vector3::reflect(Vector3 normal) {
	return this->scale(-1).add(normal.scale(2.0 * normal.dot(*this)));
}