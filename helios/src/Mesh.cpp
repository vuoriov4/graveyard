using namespace helios;
using namespace std;

Mesh::Mesh(Geometry* geometry, Material* material) {
	this->geometry = geometry;
	this->material = material;
	this->position = new Vector3(0, 0, 0);
	this->scale = new Vector3(1, 1, 1);
	this->orientation = Matrix<float>::identity(3);
}
