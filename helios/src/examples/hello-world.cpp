#include <iostream>
#include <chrono>
#include <thread>
#include <stdlib.h>
#include <math.h>
#include "helios.h"
using namespace helios;
using namespace std;

int main() {

	// Texture<unsigned char>* texture = Texture<unsigned char>::load("src/examples/hello-world/textures/test.png");
	Scene* scene = new Scene();
	srand(time(NULL));

	Geometry* sphere1 = new Geometry(std::string("src/examples/models/sphere.obj"));
	Material* material1 = new Material(new Vector3(1.0, 0.5, 0.5));
	material1->reflectivity = 0.33;
	Mesh* mesh1 = new Mesh(sphere1, material1);
	mesh1->scale->x = 0.5; mesh1->scale->y = 0.5; mesh1->scale->z = 0.5;
	mesh1->position->set(-7.5, 1.0,  0.0);
	scene->add(mesh1);

	Geometry* sphere2 = new Geometry(std::string("src/examples/models/sphere.obj"));
	Material* material2 = new Material(new Vector3(0.5, 1.0, 0.5));
	material2->reflectivity = 0.33;
	Mesh* mesh2 = new Mesh(sphere2, material2);
	mesh2->position->set(0, 1.0,  0.0);
	scene->add(mesh2);

	Geometry* sphere3 = new Geometry(std::string("src/examples/models/sphere.obj"));
	Material* material3 = new Material(new Vector3(0.5, 0.5, 1.0));
	material3->reflectivity = 0.33;
	Mesh* mesh3 = new Mesh(sphere3, material3);
	mesh3->scale->x = 0.5; mesh3->scale->y = 0.5; mesh3->scale->z = 0.5;
	mesh3->position->set(7.5, 1.0,  0.0);
	scene->add(mesh3);

	Geometry* planeGeometry = new Geometry(std::string("src/examples/models/plane.obj"));
	Material* planeMaterial = new Material();
	Mesh* planeMesh = new Mesh(planeGeometry, planeMaterial);
	planeMesh->position->set(0, -5, 0);
	scene->add(planeMesh);
	Camera* camera = new Camera();
	Renderer* renderer = new Renderer(1024, 512);
	renderer->init(scene);
	camera->position->data[0] = 0.0f;
	camera->position->data[1] = 0.0f;
	camera->position->data[2] = -25.0f;

	renderer->render(camera);
	getchar(); // pause
	return 0;

}
