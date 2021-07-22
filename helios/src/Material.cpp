using namespace helios;
using namespace std;

Material::Material(Texture<unsigned char>* diffuseMap) {
	this->diffuseMap = diffuseMap;
	this->reflectivity = 0.0;
	this->diffuseType = DiffuseType::TEXTURE;
	this->diffuseColor = new Vector3(0, 0, 0);
}

Material::Material(Vector3* diffuseColor) {
	this->diffuseColor = diffuseColor;
	this->reflectivity = 0.0;
	this->diffuseType = DiffuseType::COLOR;
}

Material::Material() {
	this->reflectivity = 0.0;
	this->diffuseType = DiffuseType::CHECKERBOARD;
	this->diffuseColor = new Vector3(0, 0, 0);
}

Material::~Material() {
	// delete
}
