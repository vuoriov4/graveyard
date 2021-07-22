#define MAX_SOURCE_SIZE (0x100000)
#define TINYOBJLOADER_IMPLEMENTATION
#define STB_IMAGE_IMPLEMENTATION

#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <algorithm>
#include <chrono>
#include <GL/glew.h>
#include <GL/glut.h>
#include "tiny_obj_loader.h"
#include "stb_image.h"
#include "helios.h"

#include "Texture.cpp"
#include "Matrix.cpp"
#include "Geometry.cpp"
#include "Material.cpp"
#include "Mesh.cpp"
#include "Renderer.cpp"
#include "Vertex.cpp"
#include "Scene.cpp"
#include "Camera.cpp"
#include "Vector3.cpp"
