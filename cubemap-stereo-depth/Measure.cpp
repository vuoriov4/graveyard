#include "csd.h"
#include "assert.h"
#include <algorithm>
using namespace csd;
using namespace std;

CubeMap* Measure::RMSE(CubeMap* cm1, CubeMap* cm2) {
	assert(cm1->image->width == cm2->image->width && cm1->image->height == cm2->image->height);
	CubeMap* result = new CubeMap(new Image(cm1->image->width, cm1->image->height));
	for (int i = 0; i < cm1->image->width; i++) {
		for (int j = 0; j < cm1->image->height; j++) {
			Vector3 color1 = cm1->image->getColor(i, j);
			Vector3 color2 = cm2->image->getColor(i, j);
			double e = (color1.x - color2.x) * (color1.x - color2.x)
				+ (color1.y - color2.y) * (color1.y - color2.y)
				+ (color1.z - color2.z) * (color1.z - color2.z);
			e = sqrt(e / 3.0);
			result->image->setColor(i, j, Vector3(e, e, e));
		}
	}
	return result;
};

CubeMap* Measure::depth(CubeMap* target, CubeMap* source, Vector3 sourcePosition, Vector3 targetPosition) {
	assert(target->image->width == source->image->width && target->image->height == source->image->height);
	Vector3 v = targetPosition.sub(sourcePosition);
	double step = 1.0;
	double minRadius = v.length() + step;
	double maxRadius = 10.0;
	double r = minRadius;
	CubeMap* result = new CubeMap(new Image(target->image->width, target->image->height));
	CubeMap* confidence = new CubeMap(new Image(target->image->width, target->image->height));
	while (r <= maxRadius) {
		printf("r = %f\n", r);
		CubeMap* sph = View::spherical(source, targetPosition.sub(sourcePosition), r);
		CubeMap* error = Measure::RMSE(sph, target);
		for (int i = 0; i < result->image->width; i++) {
			for (int j = 0; j < result->image->height; j++) {
				Vector3 c0 = confidence->image->getColor(i, j);
				Vector3 c1 = Vector3(1, 1, 1).sub(error->image->getColor(i, j));
				if (c1.x > c0.x) {
					confidence->image->setColor(i, j, c1);
					double ir = (r - minRadius) / (maxRadius - minRadius);
					result->image->setColor(i, j, Vector3(ir, ir, ir));
				}
			}
		}
		r += step;
	}
	return result;
};