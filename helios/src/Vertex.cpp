using namespace helios;
using namespace std;

Vertex::Vertex(float x, float y, float z, float nx, float ny, float nz, float u, float v, int triangleIndex, int meshIndex) {
	this->x = x; this->y = y; this->z = z;
	this->nx = nx; this->ny = ny; this->nz = nz;
	this->u = u; this->v = v;
	this->triangleIndex = triangleIndex;
	this->meshIndex = meshIndex;
}

Vertex Vertex::clone() {
	Vertex* result = new Vertex(
		this->x, this->y, this->z, this->nx, this->ny, this->nz, this->u, this->v,
		this->triangleIndex, this->meshIndex);
	return *result;
}
