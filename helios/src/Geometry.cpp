using namespace helios;
using namespace std;

Geometry::Geometry(std::string filename) {
	// Load obj file
	tinyobj::attrib_t attrib;
	std::vector<tinyobj::shape_t> shapes;
	std::vector<tinyobj::material_t> materials;
	std::string warn;
	std::string err;
	bool ret = tinyobj::LoadObj(&attrib, &shapes, &materials, &warn, &err, filename.c_str());
	if (!err.empty()) std::cerr << err << std::endl;
	if (!ret) exit(1);
	// init bounding box
	this->boundingBoxMin = new Vector3(attrib.vertices[0], attrib.vertices[1], attrib.vertices[2]);
	this->boundingBoxMax = new Vector3(attrib.vertices[0], attrib.vertices[1], attrib.vertices[2]);
	// Loop over shapes
	for (size_t s = 0; s < shapes.size(); s++) {
	  // Loop over faces(polygon)
	  size_t index_offset = 0;
	  for (size_t f = 0; f < shapes[s].mesh.num_face_vertices.size(); f++) {
	    int fv = shapes[s].mesh.num_face_vertices[f];
	    // Loop over vertices in the face.
	    for (size_t v = 0; v < fv; v++) {
	      // vertex coords
	      tinyobj::index_t idx = shapes[s].mesh.indices[index_offset + v];
	      tinyobj::real_t vx = attrib.vertices[3*idx.vertex_index+0];
	      tinyobj::real_t vy = attrib.vertices[3*idx.vertex_index+1];
	      tinyobj::real_t vz = attrib.vertices[3*idx.vertex_index+2];
				// vertex normal
	      tinyobj::real_t nx = attrib.normals[3*idx.normal_index+0];
	      tinyobj::real_t ny = attrib.normals[3*idx.normal_index+1];
	      tinyobj::real_t nz = attrib.normals[3*idx.normal_index+2];
				// uv coords
				tinyobj::real_t tx;
				tinyobj::real_t ty;
				if (idx.texcoord_index > 0) {
					tx = attrib.texcoords[2*idx.texcoord_index+0];
					ty = attrib.texcoords[2*idx.texcoord_index+1];
				} else {
					tx = 0.0; ty = 0.0;
				}
	      // Optional: vertex colors
	      // tinyobj::real_t red = attrib.colors[3*idx.vertex_index+0];
	      // tinyobj::real_t green = attrib.colors[3*idx.vertex_index+1];
	      // tinyobj::real_t blue = attrib.colors[3*idx.vertex_index+2];
				this->vertices.push_back(vx);
				this->vertices.push_back(vy);
				this->vertices.push_back(vz);
				this->vertexNormals.push_back(nx);
				this->vertexNormals.push_back(ny);
				this->vertexNormals.push_back(nz);
				this->uvs.push_back(tx);
				this->uvs.push_back(ty);
				this->boundingBoxMin->x = min(this->boundingBoxMin->x, vx);
				this->boundingBoxMin->y = min(this->boundingBoxMin->y, vy);
				this->boundingBoxMin->z = min(this->boundingBoxMin->z, vz);
				this->boundingBoxMax->x = max(this->boundingBoxMax->x, vx);
				this->boundingBoxMax->y = max(this->boundingBoxMax->y, vy);
				this->boundingBoxMax->z = max(this->boundingBoxMax->z, vz);
			}
	    index_offset += fv;
	    // per-face material
	    // shapes[s].mesh.material_ids[f];
	  }
	}
}
