#pragma once
#include <vector>
#include <map>

namespace csd {
	class Vector3;
	class Image;
	class CubeMap;
	class View;
	class Measure;
}


class csd::Vector3 {
public:
	Vector3();
	Vector3(double x, double y, double z);
	double x; double y; double z;
	void set(double x, double y, double z);
	double dot(Vector3 w);
	double mdot(Vector3 w);
	double adot(Vector3 w);
	double min();
	double max();
	double length();
	Vector3 add(Vector3 w);
	Vector3 sub(Vector3 w);
	Vector3 mult(Vector3 w);
	Vector3 cross(Vector3 w);
	Vector3 scale(double s);
	Vector3 normalize();
	Vector3 reflect(Vector3 normal);
};


class csd::Image {
public:
	Image();
	Image(int width, int height);
	Image(Vector3 color);
	~Image();
	int width;
	int height;
	Image clone();
	Vector3 getColor(int i, int j);
	void setColor(int i, int j, Vector3 color);
	static Image* load(const char* filename);
	void writeJPG(const char* path);
	double* data;
};

class csd::CubeMap {
public:
	CubeMap(Image* image);
	~CubeMap();
	Image* image;
	static Vector3 texCoord(Vector3 direction);
	static Vector3 direction(double u, double v);
	CubeMap clone();
};

class csd::View {
public:
	static CubeMap* spherical(CubeMap* cm, Vector3 position, double radius);
};

class csd::Measure {
public:
	static CubeMap* RMSE(CubeMap* cm1, CubeMap* cm2);
	static CubeMap* depth(CubeMap* source, CubeMap* target, Vector3 sourcePosition, Vector3 targetPosition);
};