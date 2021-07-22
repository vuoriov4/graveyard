using namespace helios;
using namespace std;

Camera::Camera() {
  this->position    = new Vector3(0,0,0);
  this->orientation = Matrix<float>::identity(3);
}
