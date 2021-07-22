using namespace helios;
using namespace std;

Scene::Scene() {

}

void Scene::add(Mesh* mesh) {
	int size = this->vertices.size();
	for (int i = 0; i < mesh->geometry->vertices.size() / 3; i++) {
		Vertex* v = new Vertex(
			mesh->geometry->vertices[i*3+0] * mesh->scale->x,	// x
			mesh->geometry->vertices[i*3+1] * mesh->scale->y,	// y
			mesh->geometry->vertices[i*3+2] * mesh->scale->z, // z
			mesh->geometry->vertexNormals[i*3+0],					 		// nx
			mesh->geometry->vertexNormals[i*3+1],					 		// ny
			mesh->geometry->vertexNormals[i*3+2],				 	 		// nz
			mesh->geometry->uvs[i*2+0],										 		// u
			mesh->geometry->uvs[i*2+1],										 		// v
			size + ((i % 3 < 2) ? i + 1 : i - 2),	 				 		// triangle index
			this->meshes.size()										 				 		// mesh index
		);
		this->vertices.push_back(*v);
	}
	this->meshes.push_back(mesh);
}

void Scene::serialize() {
	std::vector<float> result;
	this->meshStartingIndices.push_back(0);
	int currentTotalVertices = 0;
	for (int i = 0; i < this->vertices.size(); i++) {
		if (i > 0 && this->vertices[i].meshIndex != this->vertices[i-1].meshIndex) {
			this->meshStartingIndices.push_back(i*3);
			this->meshTotalVertices.push_back(currentTotalVertices);
			currentTotalVertices = 0;
		}
		result.push_back(this->vertices[i].x); 									// r0 vertex coordinate x
		result.push_back(this->vertices[i].y); 									// g0 vertex coordinate y
		result.push_back(this->vertices[i].z);									// b0 vertex coordinate z
		result.push_back(1.0);																	// a0 reserved
		result.push_back(this->vertices[i].nx); 								// r1 vertex normal x
		result.push_back(this->vertices[i].ny); 								// g1 vertex normal y
		result.push_back(this->vertices[i].nz);									// b1 vertex normal z
		result.push_back(1.0);																	// a1 reserved
		result.push_back(this->vertices[i].u);									// r2 texture coordinate u
		result.push_back(this->vertices[i].v);									// g2 texture coordinate v
		result.push_back(this->vertices[i].triangleIndex * 3);	// b2 triangle index
		result.push_back(this->vertices[i].meshIndex);					// a2 mesh index
		currentTotalVertices++;
	}
	this->meshTotalVertices.push_back(currentTotalVertices);
	bool padding = true;
	while (padding) {
		bool powerOfTwo = ceil(log2(result.size()/4)) == floor(log2(result.size()/4));
		bool hasSquareRoot =  ceil(sqrt(result.size()/4)) == floor(sqrt(result.size()/4));
		padding = !(powerOfTwo && hasSquareRoot);
		if (padding) result.push_back(0);
	}
	this->vertexSerial = result;
}
