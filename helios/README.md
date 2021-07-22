# Helios


Experimental raytracer written with OpenGL/C++. This is mainly a learning project for me to learn about OpenGL, C++ and raytracing techniques.

# Outline of current features

- Wavefront import

- Class system for constructing scenes

- Perspective camera

- Blinn-Phong shading with smooth/flat normals

- Reflections and basic shadows

- Antialiasing (sub-pixel rendering)

![Demo](/demo-30-08-2019.png)
<i>Render result from the demo program (30.08.2019)</i>

# Todolist

- Smooth shadows

- Volume hierarchy

- Fix memory leaks

# How can I run this thing?

    git clone https://github.com/vuoriov4/helios
    cd helios
    ./build_library.sh && ./build_examples.sh && ./bin/examples/hello-world

# External libraries

- tiny_obj_loader.h
- sbt_image.h
