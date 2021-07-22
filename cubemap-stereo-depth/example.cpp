#include "csd.h"
#include "assert.h"
#include <algorithm>
using namespace csd;
using namespace std;


int main() {
    printf("Hello World!\n");
    CubeMap* source = new CubeMap(Image::load("HET_0060_render_resize.jpg"));
    Vector3 sourcePosition = Vector3(0, 0, 0);
    CubeMap* target = new CubeMap(Image::load("HET_0061_render_resize.jpg"));
    Vector3 targetPosition = Vector3(1, 0, 0);
    CubeMap* depth = Measure::depth(source, target, sourcePosition, targetPosition);
    depth->image->writeJPG("out.jpg");
    delete source;
    delete target;
    delete depth;
}
