module.exports = class Renderer {
	constructor() {
		this.uniformLocations = {};
		this.indices = null;
		this.time = Date.now();
		this.domElement = document.createElement('canvas');
		this.gl = this.domElement.getContext('webgl');
	}
	init(scene, camera) {
		let vertex_buffer, Index_Buffer, fragShader, vertShader, shaderProgram;
		const frag = new RAY.Compiler({verbose: true}).compile(scene);
		const vertices = [
		  -1.0,1.0,0.0,
		  -1.0,-1.0,0.0,
		  1.0,-1.0,0.0,
		  1.0,1.0,0.0
		];
		this.indices = [3,2,1,3,1,0];
		vertex_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		Index_Buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		const vertCode =
		  'attribute vec3 coordinates;' +
		  'void main(void) {' +
		     'gl_Position = vec4(coordinates, 1.0);' +
		  '}';
		vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.gl.shaderSource(vertShader, vertCode);
		this.gl.compileShader(vertShader);
		fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.gl.shaderSource(fragShader, frag);
		this.gl.compileShader(fragShader);
		shaderProgram = this.gl.createProgram();
		this.gl.attachShader(shaderProgram, vertShader);
		this.gl.attachShader(shaderProgram, fragShader);
		this.gl.linkProgram(shaderProgram);
		this.uniformLocations.time = this.gl.getUniformLocation(shaderProgram, "time");
		this.uniformLocations.width = this.gl.getUniformLocation(shaderProgram, "width");
		this.uniformLocations.height = this.gl.getUniformLocation(shaderProgram, "height");
		scene.meshes.forEach(mesh => {
		this.uniformLocations[`_o${mesh.id}_position`] = this.gl.getUniformLocation(shaderProgram, `_o${mesh.id}_position`);
			Object.keys(mesh.geometry.uniforms).forEach(key => {
				this.uniformLocations[`_o${mesh.id}_${key}`] = this.gl.getUniformLocation(shaderProgram, `_o${mesh.id}_${key}`);
			});
			Object.keys(mesh.material.uniforms).forEach(key => {
				this.uniformLocations[`_o${mesh.id}_${key}`] = this.gl.getUniformLocation(shaderProgram, `_o${mesh.id}_${key}`);
			});
		});
		scene.lights.forEach(light => {
			this.uniformLocations[`_l${light.id}_position`] = this.gl.getUniformLocation(shaderProgram, `_l${light.id}_position`);
			Object.keys(light.uniforms).forEach(key => {
				this.uniformLocations[`_l${light.id}_${key}`] = this.gl.getUniformLocation(shaderProgram, `_l${light.id}_${key}`);
			});
		});
		this.uniformLocations.cameraPosition = this.gl.getUniformLocation(shaderProgram, "cameraPosition");
		this.uniformLocations.cameraDirection = this.gl.getUniformLocation(shaderProgram, "cameraDirection");
		this.uniformLocations.cameraRotation = this.gl.getUniformLocation(shaderProgram, "cameraRotation");
		this.uniformLocations.cameraFov = this.gl.getUniformLocation(shaderProgram, "cameraFov");
		this.gl.useProgram(shaderProgram);
		const error = this.gl.getShaderInfoLog(fragShader);
		if (error) console.error(error);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
		const coord = this.gl.getAttribLocation(shaderProgram, "coordinates");
		this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(coord);
		if (this.domElement.parentNode) {
			this.domElement.width = this.domElement.parentNode.clientWidth;
			this.domElement.height = this.domElement.parentNode.clientHeight;
			this.domElement.style.width = this.domElement.width + "px";
			this.domElement.style.height = this.domElement.height + "px";
		}
		this.gl.viewport(0,0,this.domElement.width,this.domElement.height);
		this.gl.clearColor(0, 0, 0, 1);
		this.uploadStaticUniforms();
		this.uploadDynamicUniforms();
	}
	uploadStaticUniforms() {
		return;
	}
	uploadDynamicUniforms() {
		this.gl.uniform1f(this.uniformLocations.time, this.time);
		this.gl.uniform1f(this.uniformLocations.width, this.domElement.width);
		this.gl.uniform1f(this.uniformLocations.height, this.domElement.height);
		this.gl.uniform3f(
			this.uniformLocations['cameraPosition'],
			camera.position.x, camera.position.y, camera.position.z
		);
		this.gl.uniform3f(
			this.uniformLocations['cameraDirection'],
			camera.direction.x, camera.direction.y, camera.direction.z
		);
		this.gl.uniform1f(
			this.uniformLocations['cameraRotation'], camera.rotation
		);
		this.gl.uniform1f(
			this.uniformLocations['cameraFov'], camera.fov
		);
		scene.meshes.forEach(mesh => {
			this.gl.uniform3f(
				this.uniformLocations[`_o${mesh.id}_position`],
				mesh.position.x, mesh.position.y, mesh.position.z
			);
			Object.keys(mesh.geometry.uniforms).forEach(key => {
				var uniform = mesh.geometry.uniforms[key];
				switch(uniform.type) {
					case 'vec3':
						this.gl.uniform3f(
							this.uniformLocations[`_o${mesh.id}_${key}`],
							uniform.value.x, uniform.value.y, uniform.value.z
						);
						break;
					case 'float':
						this.gl.uniform1f(this.uniformLocations[`_o${mesh.id}_${key}`], uniform.value);
						break;
				}
			});
			// Todo: smh about this shit
			Object.keys(mesh.material.uniforms).forEach(key => {
				const uniform = mesh.material.uniforms[key];
				switch(uniform.type) {
					case 'vec3':
						this.gl.uniform3f(
							this.uniformLocations[`_o${mesh.id}_${key}`],
							uniform.value.x, uniform.value.y, uniform.value.z
						);
						break;
					case 'float':
						this.gl.uniform1f(this.uniformLocations[`_o${mesh.id}_${key}`], uniform.value);
						break;
				}
			});
		});
		scene.lights.forEach(light => {
			this.gl.uniform3f(
				this.uniformLocations[`_l${light.id}_position`],
				light.position.x, light.position.y, light.position.z
			);
			Object.keys(light.uniforms).forEach(key => {
				let uniform = light.uniforms[key];
				switch(uniform.type) {
					case 'vec3':
						this.gl.uniform3f(
							this.uniformLocations[`_l${light.id}_${key}`],
							uniform.value.x, uniform.value.y, uniform.value.z
						);
						break;
					case 'float':
						this.gl.uniform1f(this.uniformLocations[`_l${light.id}_${key}`], uniform.value);
						break;
				}
			});
		});
	}
	render(scene, camera) {
		this.gl.uniform3f(
			this.uniformLocations['cameraPosition'],
			camera.position.x, camera.position.y, camera.position.z
		);
		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT,0);
		let dt = Date.now() - this.time;
		//console.log(dt + "ms");
		this.time = Date.now();
	};
};
