#include "csd.h"
#include <algorithm>
using namespace csd;
using namespace std;

CubeMap::CubeMap(Image* image) {
	this->image = image;
}

CubeMap::~CubeMap() {
	delete this->image;
}

Vector3 CubeMap::texCoord(Vector3 dir) {
    double x = dir.x;
    double y = dir.y;
    double z = dir.z;
    double absX = abs(x);
    double absY = abs(y);
    double absZ = abs(z);
    double isXPositive = x > 0.0 ? 1.0 : 0.0;
    double isYPositive = y > 0.0 ? 1.0 : 0.0;
    double isZPositive = z > 0.0 ? 1.0 : 0.0;
    if (isXPositive > 0.5 && absX >= absY && absX >= absZ) {
        double uc = 1.0 - 0.5 * (-z / absX + 1.0);
        double vc = 0.5 * (-y / absX + 1.0);
        double i = 1.0;
        double j = 0.0;
        double iu = (uc + i) / 3.0;
        double iv = 1.0 - (vc + j) / 2.0;
        return Vector3(iu, iv, 0);
    }
    if (isXPositive < 0.5 && absX >= absY && absX >= absZ) {
        double uc = 1.0 - 0.5 * (z / absX + 1.0);
        double vc = 1.0 - 0.5 * (y / absX + 1.0);
        double i = 0.0;
        double j = 0.0;
        double iu = (uc + i) / 3.0;
        double iv = 1.0 - (vc + j) / 2.0;
        return Vector3(iu, iv, 0);
    }
    if (isYPositive > 0.5 && absY >= absX && absY >= absZ) {
        double uc = 0.5 * (-x / absY + 1.0);
        double vc = 0.5 * (z / absY + 1.0);
        double i = 2.0;
        double j = 0.0;
        double iu = (uc + i) / 3.0;
        double iv = 1.0 - (vc + j) / 2.0;
        return Vector3(iu, iv, 0);
    }
    if (isYPositive < 0.5 && absY >= absX && absY >= absZ) {
        double uc = 1.0 - 0.5 * (x / absY + 1.0);
        double vc = 1.0 - 0.5 * (z / absY + 1.0);
        double i = 0.0;
        double j = 1.0;
        double iu = (uc + i) / 3.0;
        double iv = 1.0 - (vc + j) / 2.0;
        return Vector3(iu, iv, 0);
    }
    if (isZPositive > 0.5 && absZ >= absX && absZ >= absY) {
        double uc = 1.0 - 0.5 * (x / absZ + 1.0);
        double vc = 1.0 - 0.5 * (y / absZ + 1.0);
        double i = 1.0;
        double j = 1.0;
        double iu = (uc + i) / 3.0;
        double iv = 1.0 - (vc + j) / 2.0;
        return Vector3(iu, iv, 0);
    }
    if (isZPositive < 0.5 && absZ >= absX && absZ >= absY) {
        double uc = 1.0 - 0.5 * (-x / absZ + 1.0);
        double vc = 1.0 - 0.5 * (y / absZ + 1.0);
        double i = 2.0;
        double j = 1.0;
        double iu = (uc + i) / 3.0;
        double iv = 1.0 - (vc + j) / 2.0;
        return Vector3(iu, iv, 0);
    }
}

Vector3 CubeMap::direction(double u, double v) {
    Vector3 uv = Vector3(u, v, 0.0);
    // compute block wise i, j
    double i;
    double j;
    if (uv.x < 1.0 / 3.0) i = 0.0;
    else if (uv.x < 2.0 / 3.0) i = 1.0;
    else i = 2.0;
    if (uv.y < 1.0 / 2.0) j = 1.0;
    else j = 0.0;
    // convert range to -1 to 1
    double uc = 2.0 * fmod(uv.x, 1.0 / 3.0) * 3.0 - 1.0;
    double vc = 2.0 * fmod(uv.y, 1.0 / 2.0) * 2.0 - 1.0;
    Vector3 dir = Vector3(0, 0, 0);
    if (i == 0.0 && j == 0.0) {
        dir.x = -1.0; dir.y = vc; dir.z = -uc; // left
    }
    if (i == 1.0 && j == 0.0) {
        dir.x = 1.0; dir.y = vc; dir.z = uc; // right
    }
    if (i == 2.0 && j == 0.0) {
        dir.x = -uc; dir.y = 1.0; dir.z = -vc; // top
    }
    if (i == 0.0 && j == 1.0) {
        dir.x = uc; dir.y = -1.0; dir.z = vc; // down
    }
    if (i == 1.0 && j == 1.0) {
        dir.x = -uc; dir.y = vc; dir.z = 1.0; // back
    }
    if (i == 2.0 && j == 1.0) {
        dir.x = uc; dir.y = vc; dir.z = -1.0; // front
    }
    return dir.normalize();
}

CubeMap CubeMap::clone() {
	Image cImage = this->image->clone();
	CubeMap result(&cImage);
	return result;
}