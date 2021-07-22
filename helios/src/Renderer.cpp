using namespace helios;
using namespace std;
using namespace std::chrono;

Renderer::Renderer(int width, int height) {
  this->width = width; this->height = height;
}

Renderer::~Renderer() {
  // ...
}

const char* Renderer::glErrorString(GLenum err)
{
  switch (err)
  {
    case GL_NO_ERROR:
      return "GL_NO_ERROR";
    case GL_INVALID_ENUM:
      return "GL_INVALID_ENUM";
    case GL_INVALID_VALUE:
      return "GL_INVALID_VALUE";
    case GL_INVALID_OPERATION:
      return "GL_INVALID_OPERATION";
    case GL_STACK_OVERFLOW:
      return "GL_STACK_OVERFLOW";
    case GL_STACK_UNDERFLOW:
      return "GL_STACK_UNDERFLOW";
    case GL_OUT_OF_MEMORY:
      return "GL_OUT_OF_MEMORY";
    case GL_TABLE_TOO_LARGE:
      return "GL_TABLE_TOO_LARGE";
    case GL_INVALID_FRAMEBUFFER_OPERATION:
      return "GL_INVALID_FRAMEBUFFER_OPERATION";
    default:
      return "Unknown error";
  }
}

int Renderer::initializeRenderingContext() {
  int argv = 1;
  char* argc[1] = {(char*)" "};
  glutInit(&argv, argc);
  glutInitDisplayMode(GLUT_RGBA);
  glutInitWindowSize(this->width, this->height);
  glutCreateWindow("Helios");
  GLenum err = glewInit(); // create GL context
  if (GLEW_OK != err) {
    fprintf(stderr, "Error: %s\n", glewGetErrorString(err));
    return -1;
  } else return 0;
}

int Renderer::createShaderPrograms() {
  std::map<std::string, GLuint> programs;
  int programError = 0;
  GLuint sceneProgram = createShaderProgram(
    readFile("src/shaders/fragment/scene.glsl"),
    readFile("src/shaders/vertex/default.glsl"),
    &programError
  );
  programs.insert(std::make_pair("scene", sceneProgram));
  GLuint displayProgram = createShaderProgram(
    readFile("src/shaders/fragment/display.glsl"),
    readFile("src/shaders/vertex/default.glsl"),
    &programError
  );
  programs.insert(std::make_pair("display", displayProgram));
  if (programError < 0) {
    printf("Error compiling shader programs.\n");
    return -1;
  }
  this->programs = programs;
  return 0;
}

int Renderer::createQuads(int widthPartitions, int heightPartitions) {
  this->widthPartitions = widthPartitions;
  this->heightPartitions = heightPartitions;
  // bind vertex array object
  GLuint vao;
  glGenVertexArrays(1, &vao);
  glBindVertexArray(vao);
  // Create the quad grid
  float aspect_ratio = this->width / ((float)this->height);
  float vertices[widthPartitions * heightPartitions * 12];
  float w =  2.0 / widthPartitions;
  // Todo: figure out line artifacts
  float h = 2.0 / heightPartitions;
  for (int i = 0; i < widthPartitions; i++) {
    for (int j = 0; j < heightPartitions; j++) {
      float offsetx = -1.0 + w*i;
      float offsety = -1.0 + h*j;
      int index = 12*(i + j*widthPartitions);
      vertices[index + 0] =  0 + offsetx;
      vertices[index + 1] =  0 + offsety;
      vertices[index + 2] =  w + offsetx;
      vertices[index + 3] =  0 + offsety;
      vertices[index + 4] =  0 + offsetx;
      vertices[index + 5] =  h + offsety;
      vertices[index + 6] =  0 + offsetx;
      vertices[index + 7] =  h + offsety;
      vertices[index + 8] =  w + offsetx;
      vertices[index + 9] =  0 + offsety;
      vertices[index + 10] = w + offsetx;
      vertices[index + 11] = h + offsety;
    }
  }
  // upload vertices to GPU
  GLuint vbo;
  glGenBuffers(1, &vbo); // Generate 1 buffer
  glBindBuffer(GL_ARRAY_BUFFER, vbo);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
  // link vertex data to attribute
  GLint posAttrib = glGetAttribLocation(this->programs["display"], "position");
  glVertexAttribPointer(posAttrib, 2, GL_FLOAT, GL_FALSE, 0, 0);
  glEnableVertexAttribArray(posAttrib);
  return 0;
}

int Renderer::createTextures() {
  // Render texture
  this->renderBufferName = 0;
  glGenFramebuffers(1, &this->renderBufferName);
  glBindFramebuffer(GL_FRAMEBUFFER, this->renderBufferName);
  GLuint renderTexture;
  glGenTextures(1, &renderTexture);
  glBindTexture(GL_TEXTURE_2D, renderTexture);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
    this->width,
    this->height,
    0, GL_RGBA, GL_UNSIGNED_BYTE, 0);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
  this->renderTexture = renderTexture;
  // Scene texture
  this->sceneBufferName = 0;
  glGenFramebuffers(1, &this->sceneBufferName);
  glBindFramebuffer(GL_FRAMEBUFFER, this->sceneBufferName);
  GLuint sceneTexture;
  glGenTextures(1, &sceneTexture);
  glBindTexture(GL_TEXTURE_2D, sceneTexture);
  glTexImage2D(
    GL_TEXTURE_2D, 0, GL_RGBA32F,
    (int)sqrt(this->scene->vertexSerial.size()/4), //width
    (int)sqrt(this->scene->vertexSerial.size()/4), //height
    0, GL_RGBA, GL_FLOAT, &(this->scene->vertexSerial[0]));
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
  this->sceneTexture = sceneTexture;
  // Diffuse texture
  this->diffuseBufferName = 0;
  glGenFramebuffers(1, &this->diffuseBufferName);
  glBindFramebuffer(GL_FRAMEBUFFER, this->diffuseBufferName);
  GLuint diffuseTexture;
  glGenTextures(1, &diffuseTexture);
  glBindTexture(GL_TEXTURE_2D, diffuseTexture);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
  this->diffuseTexture = diffuseTexture;
  // Color attachments
  GLenum DrawBuffers[1] = {GL_COLOR_ATTACHMENT0};
  glDrawBuffers(1, DrawBuffers);
  return 0;
}

char* Renderer::readFile(const char* path) {
  FILE* file = fopen(path, "r");
	if (!file) {
			fprintf(stderr, "Failed to load file %s.\n", path);
			exit(1);
	}
  fseek(file, 0, SEEK_END);
  size_t fileSize = ftell(file);
  char* content = new char[fileSize+1];
  rewind(file);
  fread(content, sizeof(char), fileSize, file);
  fclose(file);
  content[fileSize] = '\0';
  return content;
}

GLuint Renderer::createShaderProgram(char* fragmentShaderSource, char* vertexShaderSource, int* err) {
  // compile vertex shader
  GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
  glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
  glCompileShader(vertexShader);
  GLint vstatus;
  glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &vstatus);
  char vlogBuffer[512];
  glGetShaderInfoLog(vertexShader, 512, NULL, vlogBuffer);
  if (vstatus != GL_TRUE) {
     fprintf(stderr, "GLSL Vertex shader error:\n---------\n\x1B[34m%s\033[0m\n", vlogBuffer);
     (*err) = -1;
  }
  // compile fragment/scene.glsl
  GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
  glCompileShader(fragmentShader);
  GLint fstatus;
  glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &fstatus);
  char flogBuffer[512];
  glGetShaderInfoLog(fragmentShader, 512, NULL, flogBuffer);
  if (fstatus != GL_TRUE) {
     fprintf(stderr, "GLSL Fragment shader error:\n\x1B[34m%s\033[0m\n", flogBuffer);
     (*err) = -1;
  }
  // create program
  GLuint shaderProgram = glCreateProgram();
  glAttachShader(shaderProgram, vertexShader);
  glAttachShader(shaderProgram, fragmentShader);
  glBindFragDataLocation(shaderProgram, 0, "fragmentColor");
  glLinkProgram(shaderProgram);
  GLint pstatus;
  glGetProgramiv(shaderProgram, GL_LINK_STATUS, &pstatus);
  char infoBuffer[512];
  glGetProgramInfoLog(shaderProgram, 512, NULL, infoBuffer);
  if (pstatus != GL_TRUE) {
     fprintf(stderr, "GLSL Program error:\n\x1B[34m%s\033[0m\n", infoBuffer);
     (*err) = -1;
  }
  return shaderProgram;
}

int Renderer::init(Scene* scene) {
  this->scene = scene;
  scene->serialize();
  this->tileRenderIndex = 0;
  this->antialiasQuality = 3;
  printf("GL_MAX_TEXTURE_SIZE = %d\n", GL_MAX_TEXTURE_SIZE);
  printf("Scene serial size: %ld\n", this->scene->vertexSerial.size());
  int e = 0;
  e += this->initializeRenderingContext();
  e += this->createShaderPrograms();
  e += this->createQuads(32,32);
  e += this->createTextures();
  glUseProgram(this->programs["scene"]);
  this->uploadStaticUniforms();
  // gl error check
  GLenum err = glGetError();
  if (GL_NO_ERROR != err) {
    fprintf(stderr, "Error: %s\n", glErrorString(err));
    return -1;
  } else return e;

}

void Renderer::uploadStaticUniforms() {
  glUniform1f(glGetUniformLocation(this->programs["scene"], "uWidth"), (float) this->width);
  glUniform1f(glGetUniformLocation(this->programs["scene"], "uHeight"), (float) this->height);
  glUniform1f(glGetUniformLocation(this->programs["scene"], "uAspectRatio"), (float) this->width / (float) this->height);
  glUniform1iv(glGetUniformLocation(this->programs["scene"], "uMeshStartingIndices"), this->scene->meshStartingIndices.size(), &(this->scene->meshStartingIndices[0]));
  glUniform1iv(glGetUniformLocation(this->programs["scene"], "uMeshTotalVertices"), this->scene->meshTotalVertices.size(), &(this->scene->meshTotalVertices[0]));
  glUniform1i(glGetUniformLocation(this->programs["scene"], "uTotalVertices"), this->scene->vertices.size());
  glUniform1i(glGetUniformLocation(this->programs["scene"], "uTotalMeshes"), this->scene->meshes.size());
  glUniform1i(glGetUniformLocation(this->programs["scene"], "uSceneTextureSize"), this->scene->vertexSerial.size() / 4);
  // scene texture
  glActiveTexture(GL_TEXTURE0);
  glBindTexture(GL_TEXTURE_2D, sceneTexture);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA32F, (int)sqrt(this->scene->vertexSerial.size() / 4), (int)sqrt(this->scene->vertexSerial.size() / 4), 0, GL_RGBA, GL_FLOAT, &(this->scene->vertexSerial[0]));
  glUniform1i(glGetUniformLocation(this->programs["scene"], "sceneTexture"), 0);
}

void Renderer::uploadDynamicUniforms() {
  float* meshPositions = new float[this->scene->meshes.size() * 3];
  float* materialDiffuseColors = new float[this->scene->meshes.size() * 3];
  float* materialProperties = new float[this->scene->meshes.size() * 3];
  float* boundingBoxMinima = new float[this->scene->meshes.size() * 3];
  float* boundingBoxMaxima = new float[this->scene->meshes.size() * 3];
  for (int i = 0; i < this->scene->meshes.size(); i++) {
    meshPositions[i*3 + 0] = this->scene->meshes[i]->position->x;
    meshPositions[i*3 + 1] = this->scene->meshes[i]->position->y;
    meshPositions[i*3 + 2] = this->scene->meshes[i]->position->z;
    materialDiffuseColors[i*3 + 0] = this->scene->meshes[i]->material->diffuseColor->x;
    materialDiffuseColors[i*3 + 1] = this->scene->meshes[i]->material->diffuseColor->y;
    materialDiffuseColors[i*3 + 2] = this->scene->meshes[i]->material->diffuseColor->z;
    materialProperties[i*3 + 0] = this->scene->meshes[i]->material->reflectivity;
    materialProperties[i*3 + 1] = this->scene->meshes[i]->material->diffuseType;
    materialProperties[i*3 + 2] = 0; // reserved
    boundingBoxMinima[i*3 + 0] = this->scene->meshes[i]->geometry->boundingBoxMin->x;
    boundingBoxMinima[i*3 + 1] = this->scene->meshes[i]->geometry->boundingBoxMin->y;
    boundingBoxMinima[i*3 + 2] = this->scene->meshes[i]->geometry->boundingBoxMin->z;
    boundingBoxMaxima[i*3 + 0] = this->scene->meshes[i]->geometry->boundingBoxMax->x;
    boundingBoxMaxima[i*3 + 1] = this->scene->meshes[i]->geometry->boundingBoxMax->y;
    boundingBoxMaxima[i*3 + 2] = this->scene->meshes[i]->geometry->boundingBoxMax->z;
  }
  glUniform3fv(glGetUniformLocation(this->programs["scene"], "uMeshPositions"), this->scene->meshes.size(), meshPositions);
  glUniform3fv(glGetUniformLocation(this->programs["scene"], "uMaterialDiffuseColors"), this->scene->meshes.size(), materialDiffuseColors);
  glUniform3fv(glGetUniformLocation(this->programs["scene"], "uMaterialProperties"), this->scene->meshes.size(), materialProperties);
  glUniform3fv(glGetUniformLocation(this->programs["scene"], "uBoundingBoxMinima"), this->scene->meshes.size(), boundingBoxMinima);
  glUniform3fv(glGetUniformLocation(this->programs["scene"], "uBoundingBoxMaxima"), this->scene->meshes.size(), boundingBoxMaxima);
  // scene texture
  glActiveTexture(GL_TEXTURE0);
  glBindTexture(GL_TEXTURE_2D, sceneTexture);
  glUniform1i(glGetUniformLocation(this->programs["scene"], "sceneTexture"), 0);
}

int Renderer::renderToTexture(Camera* camera) {
  glUseProgram(this->programs["scene"]);
  this->uploadDynamicUniforms();
  glActiveTexture(GL_TEXTURE0);
  glBindTexture(GL_TEXTURE_2D, sceneTexture);
  glUniform3f(glGetUniformLocation(this->programs["scene"], "uCameraPosition"), camera->position->data[0], camera->position->data[1], camera->position->data[2]);
  glUniformMatrix3fv(glGetUniformLocation(this->programs["scene"], "uCameraOrientation"), 1, GL_FALSE, camera->orientation->data);
  glBindFramebuffer(GL_FRAMEBUFFER, this->renderBufferName);
  glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, renderTexture, 0);
  glDrawArrays(GL_TRIANGLES, this->tileRenderIndex * 6, 6);
  return 0;
}

int Renderer::renderDisplay() {
  glBindFramebuffer(GL_FRAMEBUFFER, 0); // need this call after doing offscreen rendering
  glUseProgram(this->programs["display"]);
  glActiveTexture(GL_TEXTURE0);
  glBindTexture(GL_TEXTURE_2D, renderTexture);
  glUniform1i(glGetUniformLocation(this->programs["display"], "renderTexture"), 0);
  glDrawArrays(GL_TRIANGLES, this->tileRenderIndex * 6, 6);
  glFinish();
  return 0;
}

int Renderer::render(Camera* camera) {
  printf("Rendering...\n");
  int64_t ms0 = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
  glViewport(0, 0, this->width, this->height);
  std::vector<int> tileRenderIndices;
  for (int i = 0; i < this->widthPartitions * this->heightPartitions; i++) tileRenderIndices.push_back(i);
  std::random_shuffle(tileRenderIndices.begin(), tileRenderIndices.end());
  for (int i = 0; i < this->widthPartitions * this->heightPartitions; i++) {
    this->tileRenderIndex = tileRenderIndices[i];
    this->renderToTexture(camera);
    this->renderDisplay();
  }
  int64_t ms_delta = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count() - ms0;
  printf("Finished <%ld ms>\n", ms_delta);
}
