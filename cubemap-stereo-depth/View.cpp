#include "csd.h"
#include "assert.h"
#include <algorithm>
using namespace csd;
using namespace std;

CubeMap* View::spherical(CubeMap* cm, Vector3 position, double radius) {
	assert(position.length() < radius);
	Image* image = new Image(cm->image->width, cm->image->height);
	CubeMap* result = new CubeMap(image);
	for (int j = 0; j < image->height; j++) {
		for (int i = 0; i < image->width; i++) {
			double u = i / (1.0 * image->width);
			double v = 1.0 - j / (1.0 * image->height);
			Vector3 direction = CubeMap::direction(u, v);
			Vector3 oc = position;
			double b = oc.dot(direction);
			double c = oc.dot(oc) - radius * radius;
			double h = b * b - c;
			assert(h >= 0.0); // should have intersection
			h = sqrt(h);
			double t = max(-b - h, -b + h);
			Vector3 newDirection = (position.add(direction.scale(t))).normalize();
			Vector3 texCoord = CubeMap::texCoord(newDirection);
			int ib = min((int)(texCoord.x * image->width), image->width - 1);
			int jb = min((int)((1.0 - texCoord.y) * image->height), image->height - 1);
			Vector3 color = cm->image->getColor(ib, jb);
			result->image->setColor(i, j, color);
		}
	}
	return result;
};