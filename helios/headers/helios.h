#pragma once
#include <vector>
#include <map>
#include <GL/glew.h>

namespace helios {
	template <class T> class Texture;
	template <class T> class Matrix;
	class Mesh;
	class Geometry;
	class Renderer;
	class Scene;
	class Vertex;
	class Camera;
	class Vector3;
	class Material;
}

template <class T> class helios::Texture {
public:
	Texture<T>(int width, int height);
	~Texture<T>();
	Texture<T>* clone();
	static Texture<T>* load(const char* filename);
	int width;
	int height;
	T* data;
};
template class helios::Texture<float>;
template class helios::Texture<unsigned char>;

template <class T> class helios::Matrix {
public:
	Matrix<T>() = default;
	Matrix<T>(int width, int height);
	~Matrix<T>();
	Matrix<T>* clone();
	T get(int j, int i);
	void set(int j, int i, T value);
	static Matrix<T>* identity(int size);
	int width;
	int height;
	T* data;
};
template class helios::Matrix<float>;

class helios::Vector3 {
public:
	Vector3(float x, float y, float z);
	~Vector3();
	float x; float y; float z;
	float* data;
	void set(float x, float y, float z);
};

class helios::Geometry {
public:
	Geometry(std::string filename);
	~Geometry();
	std::vector<float> vertices;
	std::vector<float> vertexNormals;
	std::vector<float> uvs;
	Vector3* boundingBoxMin;
	Vector3* boundingBoxMax;
};

enum DiffuseType {
	COLOR = 0,
	TEXTURE = 1,
	CHECKERBOARD = 2
};

class helios::Material {
public:
	Material(Texture<unsigned char>* diffuseMap);
	Material(Vector3* diffuseColor);
	Material();
	~Material();
	Texture<unsigned char>* diffuseMap;
	Vector3* diffuseColor;
	float reflectivity;
	int diffuseType;
};

class helios::Mesh {
public:
	Mesh(Geometry* geometry, Material* material);
	Geometry* geometry;
	Material* material;
	Vector3* position;
	Vector3* scale;
	Matrix<float>* orientation;
};

class helios::Renderer {
public:
	Renderer(int width, int height);
	~Renderer();
	int init(helios::Scene* scene);
	int render(helios::Camera* camera);
	int width;
	int height;
private:
	Scene* scene;
	int initializeRenderingContext();
	int createShaderPrograms();
	int createQuads(int widthPartitions, int heightPartitions);
	int createTextures();
	int renderToTexture(helios::Camera* camera);
	int renderDisplay();
	void uploadDynamicUniforms();
	void uploadStaticUniforms();
	char* readFile(const char* path);
	const char* glErrorString(GLenum err);
	std::map<std::string, GLuint> programs;
	GLuint createShaderProgram(char* fragmentShaderSource, char* vertexShaderSource, int* err);
	GLuint renderBufferName;
	GLuint renderTexture;
	GLuint sceneBufferName;
	GLuint sceneTexture;
	GLuint diffuseBufferName;
	GLuint diffuseTexture;
	int widthPartitions;
	int heightPartitions;
	int tileRenderIndex;
	int antialiasQuality;
};

class helios::Vertex {
public:
	Vertex(float x, float y, float z, float nx, float ny, float nz, float u, float v, int triangleIndex, int meshIndex);
	float x;
	float y;
	float z;
	float nx;
	float ny;
	float nz;
	float u;
	float v;
	int triangleIndex;
	int meshIndex;
	helios::Vertex clone();
};

class helios::Scene {
public:
	Scene();
	~Scene();
	std::vector<helios::Mesh*> meshes;
	std::vector<helios::Vertex> vertices;
	std::vector<float> vertexSerial;
	std::vector<int> meshStartingIndices;
	std::vector<int> meshTotalVertices;
	void add(helios::Mesh* mesh);
	void serialize();
};

class helios::Camera {
public:
	Camera();
	~Camera();
	Vector3* position;
	Matrix<float>*orientation;
};
