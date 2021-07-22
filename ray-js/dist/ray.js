(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RAY = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	function Camera() {
		var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Camera);

		this.position = opts.position || new RAY.Vec3();
		this.direction = opts.direction || new RAY.Vec3(0, 0, 1);
		this.rotation = opts.rotation || 0.0;
		this.fov = opts.fov || Math.PI / 3;
	}

	_createClass(Camera, [{
		key: "lookAt",
		value: function lookAt(position) {
			this.direction.x = position.x - this.position.x;
			this.direction.y = position.y - this.position.y;
			this.direction.z = position.z - this.position.z;
		}
	}]);

	return Camera;
}();

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	function Compiler() {
		var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Compiler);

		this.verbose = opts.verbose === undefined ? false : opts.verbose;
	}

	_createClass(Compiler, [{
		key: 'compile',
		value: function compile(scene) {
			var frag = "";
			frag += require('./glsl/constants.js');
			frag += require('./glsl/precision.js');
			frag += require('./glsl/uniforms.js')(scene);
			frag += require('./glsl/structs.js');
			frag += require('./glsl/utilities.js');
			frag += require('./glsl/objects.js')(scene);
			frag += require('./glsl/global.js')(scene);
			frag += require('./glsl/lights.js')(scene);
			frag += require('./glsl/raymarch.js');
			frag += require('./glsl/shade.js');
			frag += require('./glsl/main.js');
			frag = frag.replace(/\t/g, '');
			if (this.verbose) {
				console.log("Compilation result: ");
				var lines = frag.split('\n');
				for (var i = 0; i < lines.length; i++) {
					console.log(i + ": " + lines[i]);
				}
			}
			return frag;
		}
	}]);

	return Compiler;
}();

},{"./glsl/constants.js":15,"./glsl/global.js":16,"./glsl/lights.js":17,"./glsl/main.js":18,"./glsl/objects.js":19,"./glsl/precision.js":20,"./glsl/raymarch.js":21,"./glsl/shade.js":22,"./glsl/structs.js":23,"./glsl/uniforms.js":24,"./glsl/utilities.js":25}],3:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function Geometry(uniforms, glsl) {
	_classCallCheck(this, Geometry);

	this.uniforms = uniforms === undefined ? {} : uniforms;
	this.glsl = glsl;
};

},{}],4:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function Light() {
	var uniforms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var glsl = arguments[1];

	_classCallCheck(this, Light);

	this.id = RAY.lightId;
	RAY.lightId += 1;
	this.uniforms = uniforms === undefined ? {} : uniforms;
	this.glsl = glsl;
	this.position = new RAY.Vec3();
};

},{}],5:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function Material(uniforms, glsl) {
	_classCallCheck(this, Material);

	this.uniforms = uniforms === undefined ? {} : uniforms;
	this.glsl = glsl;
};

},{}],6:[function(require,module,exports){
'use strict';

var _Vec = require('./math/Vec3.js');

var _Vec2 = _interopRequireDefault(_Vec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function Mesh(geometry, material) {
	_classCallCheck(this, Mesh);

	this.id = RAY.objectId;
	RAY.objectId += 1;
	this.geometry = geometry;
	this.material = material;
	this.position = new _Vec2.default();
};

},{"./math/Vec3.js":30}],7:[function(require,module,exports){
'use strict';

var RAY = {};
RAY.objectId = 0;
RAY.lightId = 0;
RAY.Vec3 = require('./math/Vec3');
RAY.Vec4 = require('./math/Vec4');
RAY.Geometry = require('./Geometry');
RAY.BoxGeometry = require('./geometries/BoxGeometry');
RAY.LineGeometry = require('./geometries/LineGeometry');
RAY.PlaneGeometry = require('./geometries/PlaneGeometry');
RAY.SphereGeometry = require('./geometries/SphereGeometry');
RAY.TorusGeometry = require('./geometries/TorusGeometry');
RAY.Material = require('./Material.js');
RAY.BasicMaterial = require('./materials/BasicMaterial.js');
RAY.CheckerboardMaterial = require('./materials/CheckerboardMaterial.js');
RAY.Light = require('./Light');
RAY.DirectionalLight = require('./lights/DirectionalLight');
RAY.AmbientLight = require('./lights/AmbientLight');
RAY.Mesh = require('./Mesh');
RAY.Scene = require('./Scene');
RAY.Camera = require('./Camera');
RAY.Compiler = require('./Compiler');
RAY.Renderer = require('./Renderer');
module.exports = RAY;

},{"./Camera":1,"./Compiler":2,"./Geometry":3,"./Light":4,"./Material.js":5,"./Mesh":6,"./Renderer":8,"./Scene":9,"./geometries/BoxGeometry":10,"./geometries/LineGeometry":11,"./geometries/PlaneGeometry":12,"./geometries/SphereGeometry":13,"./geometries/TorusGeometry":14,"./lights/AmbientLight":26,"./lights/DirectionalLight":27,"./materials/BasicMaterial.js":28,"./materials/CheckerboardMaterial.js":29,"./math/Vec3":30,"./math/Vec4":31}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	function Renderer() {
		_classCallCheck(this, Renderer);

		this.uniformLocations = {};
		this.indices = null;
		this.time = Date.now();
		this.domElement = document.createElement('canvas');
		this.gl = this.domElement.getContext('webgl');
	}

	_createClass(Renderer, [{
		key: 'init',
		value: function init(scene, camera) {
			var _this = this;

			var vertex_buffer = void 0,
			    Index_Buffer = void 0,
			    fragShader = void 0,
			    vertShader = void 0,
			    shaderProgram = void 0;
			var frag = new RAY.Compiler({ verbose: true }).compile(scene);
			var vertices = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0];
			this.indices = [3, 2, 1, 3, 1, 0];
			vertex_buffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
			Index_Buffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
			var vertCode = 'attribute vec3 coordinates;' + 'void main(void) {' + 'gl_Position = vec4(coordinates, 1.0);' + '}';
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
			scene.meshes.forEach(function (mesh) {
				_this.uniformLocations['_o' + mesh.id + '_position'] = _this.gl.getUniformLocation(shaderProgram, '_o' + mesh.id + '_position');
				Object.keys(mesh.geometry.uniforms).forEach(function (key) {
					_this.uniformLocations['_o' + mesh.id + '_' + key] = _this.gl.getUniformLocation(shaderProgram, '_o' + mesh.id + '_' + key);
				});
				Object.keys(mesh.material.uniforms).forEach(function (key) {
					_this.uniformLocations['_o' + mesh.id + '_' + key] = _this.gl.getUniformLocation(shaderProgram, '_o' + mesh.id + '_' + key);
				});
			});
			scene.lights.forEach(function (light) {
				_this.uniformLocations['_l' + light.id + '_position'] = _this.gl.getUniformLocation(shaderProgram, '_l' + light.id + '_position');
				Object.keys(light.uniforms).forEach(function (key) {
					_this.uniformLocations['_l' + light.id + '_' + key] = _this.gl.getUniformLocation(shaderProgram, '_l' + light.id + '_' + key);
				});
			});
			this.uniformLocations.cameraPosition = this.gl.getUniformLocation(shaderProgram, "cameraPosition");
			this.uniformLocations.cameraDirection = this.gl.getUniformLocation(shaderProgram, "cameraDirection");
			this.uniformLocations.cameraRotation = this.gl.getUniformLocation(shaderProgram, "cameraRotation");
			this.uniformLocations.cameraFov = this.gl.getUniformLocation(shaderProgram, "cameraFov");
			this.gl.useProgram(shaderProgram);
			var error = this.gl.getShaderInfoLog(fragShader);
			if (error) console.error(error);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
			var coord = this.gl.getAttribLocation(shaderProgram, "coordinates");
			this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
			this.gl.enableVertexAttribArray(coord);
			if (this.domElement.parentNode) {
				this.domElement.width = this.domElement.parentNode.clientWidth;
				this.domElement.height = this.domElement.parentNode.clientHeight;
				this.domElement.style.width = this.domElement.width + "px";
				this.domElement.style.height = this.domElement.height + "px";
			}
			this.gl.viewport(0, 0, this.domElement.width, this.domElement.height);
			this.gl.clearColor(0, 0, 0, 1);
			this.uploadStaticUniforms();
			this.uploadDynamicUniforms();
		}
	}, {
		key: 'uploadStaticUniforms',
		value: function uploadStaticUniforms() {
			return;
		}
	}, {
		key: 'uploadDynamicUniforms',
		value: function uploadDynamicUniforms() {
			var _this2 = this;

			this.gl.uniform1f(this.uniformLocations.time, this.time);
			this.gl.uniform1f(this.uniformLocations.width, this.domElement.width);
			this.gl.uniform1f(this.uniformLocations.height, this.domElement.height);
			this.gl.uniform3f(this.uniformLocations['cameraPosition'], camera.position.x, camera.position.y, camera.position.z);
			this.gl.uniform3f(this.uniformLocations['cameraDirection'], camera.direction.x, camera.direction.y, camera.direction.z);
			this.gl.uniform1f(this.uniformLocations['cameraRotation'], camera.rotation);
			this.gl.uniform1f(this.uniformLocations['cameraFov'], camera.fov);
			scene.meshes.forEach(function (mesh) {
				_this2.gl.uniform3f(_this2.uniformLocations['_o' + mesh.id + '_position'], mesh.position.x, mesh.position.y, mesh.position.z);
				Object.keys(mesh.geometry.uniforms).forEach(function (key) {
					var uniform = mesh.geometry.uniforms[key];
					switch (uniform.type) {
						case 'vec3':
							_this2.gl.uniform3f(_this2.uniformLocations['_o' + mesh.id + '_' + key], uniform.value.x, uniform.value.y, uniform.value.z);
							break;
						case 'float':
							_this2.gl.uniform1f(_this2.uniformLocations['_o' + mesh.id + '_' + key], uniform.value);
							break;
					}
				});
				// Todo: smh about this shit
				Object.keys(mesh.material.uniforms).forEach(function (key) {
					var uniform = mesh.material.uniforms[key];
					switch (uniform.type) {
						case 'vec3':
							_this2.gl.uniform3f(_this2.uniformLocations['_o' + mesh.id + '_' + key], uniform.value.x, uniform.value.y, uniform.value.z);
							break;
						case 'float':
							_this2.gl.uniform1f(_this2.uniformLocations['_o' + mesh.id + '_' + key], uniform.value);
							break;
					}
				});
			});
			scene.lights.forEach(function (light) {
				_this2.gl.uniform3f(_this2.uniformLocations['_l' + light.id + '_position'], light.position.x, light.position.y, light.position.z);
				Object.keys(light.uniforms).forEach(function (key) {
					var uniform = light.uniforms[key];
					switch (uniform.type) {
						case 'vec3':
							_this2.gl.uniform3f(_this2.uniformLocations['_l' + light.id + '_' + key], uniform.value.x, uniform.value.y, uniform.value.z);
							break;
						case 'float':
							_this2.gl.uniform1f(_this2.uniformLocations['_l' + light.id + '_' + key], uniform.value);
							break;
					}
				});
			});
		}
	}, {
		key: 'render',
		value: function render(scene, camera) {
			this.gl.uniform3f(this.uniformLocations['cameraPosition'], camera.position.x, camera.position.y, camera.position.z);
			this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
			var dt = Date.now() - this.time;
			//console.log(dt + "ms");
			this.time = Date.now();
		}
	}]);

	return Renderer;
}();

},{}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	function Scene() {
		_classCallCheck(this, Scene);

		this.meshes = [];
		this.lights = [];
		this.compiled = false;
	}

	_createClass(Scene, [{
		key: "add",
		value: function add(x) {
			if (x.constructor === RAY.Mesh) {
				this.meshes.push(x);
			} else if (x.constructor === RAY.DirectionalLight || x.constructor === RAY.AmbientLight) {
				this.lights.push(x);
			}
		}
	}, {
		key: "remove",
		value: function remove(obj) {
			var index = this.meshes.indexOf(mesh);
			if (index > -1) {
				this.meshes.splice(index, 1);
			}
			// TODO : LIGHTS DELETION
		}
	}]);

	return Scene;
}();

},{}],10:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geometry = require('../Geometry.js');
module.exports = function (_Geometry) {
	_inherits(BoxGeometry, _Geometry);

	function BoxGeometry() {
		_classCallCheck(this, BoxGeometry);

		var uniforms = {};
		var glsl = '\n\t\t\tfloat main(vec3 pos) {\n\t\t\t\tvec3 d = abs(pos) - vec3(10.0, 10.0, 10.0);\n\t    \t\treturn min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (BoxGeometry.__proto__ || Object.getPrototypeOf(BoxGeometry)).call(this, uniforms, glsl));
	}

	return BoxGeometry;
}(Geometry);

},{"../Geometry.js":3}],11:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
float line2(vec3 a, vec3 b, float thickness, vec3 pos) {
  return max(0.0, length((pos-a) - clamp(dot(pos-a, b-a), 0.0, dot(b-a,b-a)) * (b-a)/dot(b-a,b-a)) - thickness);
}
*/

var Geometry = require('../Geometry.js');
module.exports = function (_Geometry) {
	_inherits(LineGeometry, _Geometry);

	function LineGeometry() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$thickness = _ref.thickness,
		    thickness = _ref$thickness === undefined ? 1.0 : _ref$thickness,
		    _ref$a = _ref.a,
		    a = _ref$a === undefined ? new RAY.Vec3(0, 0, 0) : _ref$a,
		    _ref$b = _ref.b,
		    b = _ref$b === undefined ? new RAY.Vec3(0, 0, 1) : _ref$b;

		_classCallCheck(this, LineGeometry);

		var uniforms = {
			thickness: {
				type: 'float',
				value: thickness
			},
			a: {
				type: 'vec3',
				value: a
			},
			b: {
				type: 'vec3',
				value: b
			}
		};
		var glsl = '\n\t\t\tfloat main(vec3 pos) {\n\t\t\t\tvec3 a = this.position + this.a;\n\t\t\t\tvec3 b = this.position + this.b;\n\t\t\t\tfloat d = dot(b-a, b-a);\n\t\t\t\treturn max(0.0, length((pos-a) - clamp(dot(pos-a, b-a), 0.0, d) * (b-a)/d) - this.thickness);\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (LineGeometry.__proto__ || Object.getPrototypeOf(LineGeometry)).call(this, uniforms, glsl));
	}

	return LineGeometry;
}(Geometry);

},{"../Geometry.js":3}],12:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geometry = require('../Geometry.js');
module.exports = function (_Geometry) {
	_inherits(PlaneGeometry, _Geometry);

	function PlaneGeometry() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$width = _ref.width,
		    width = _ref$width === undefined ? 1.0 : _ref$width,
		    _ref$height = _ref.height,
		    height = _ref$height === undefined ? 1.0 : _ref$height;

		_classCallCheck(this, PlaneGeometry);

		var uniforms = {
			width: {
				type: 'float',
				value: width
			},
			height: {
				type: 'float',
				value: height
			}
		};
		var glsl = '\n\t\t\tfloat main(vec3 pos) {\n\t\t\t\treturn pos.y - this.position.y;\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (PlaneGeometry.__proto__ || Object.getPrototypeOf(PlaneGeometry)).call(this, uniforms, glsl));
	}

	return PlaneGeometry;
}(Geometry);

},{"../Geometry.js":3}],13:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geometry = require('../Geometry.js');
module.exports = function (_Geometry) {
	_inherits(SphereGeometry, _Geometry);

	function SphereGeometry() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$radius = _ref.radius,
		    radius = _ref$radius === undefined ? 1.0 : _ref$radius;

		_classCallCheck(this, SphereGeometry);

		var uniforms = {
			radius: {
				type: 'float',
				value: radius
			}
		};
		var glsl = '\n\t\t\tfloat main(vec3 pos) {\n\t\t\t\treturn length(pos - this.position) - this.radius;\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (SphereGeometry.__proto__ || Object.getPrototypeOf(SphereGeometry)).call(this, uniforms, glsl));
	}

	return SphereGeometry;
}(Geometry);

},{"../Geometry.js":3}],14:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geometry = require('../Geometry.js');
module.exports = function (_Geometry) {
	_inherits(TorusGeometry, _Geometry);

	function TorusGeometry() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$radius = _ref.radius,
		    radius = _ref$radius === undefined ? 1.0 : _ref$radius,
		    _ref$tubeRadius = _ref.tubeRadius,
		    tubeRadius = _ref$tubeRadius === undefined ? 1.0 : _ref$tubeRadius;

		_classCallCheck(this, TorusGeometry);

		var uniforms = {
			radius: {
				type: 'float',
				value: radius
			},
			tubeRadius: {
				type: 'float',
				value: tubeRadius
			}
		};
		var glsl = '\n\t\t\tfloat main(vec3 pos) {\n\t\t\t\tvec2 t = vec2(this.radius, this.tubeRadius);\n\t\t\t\tvec3 p = pos - this.position;\n\t\t\t\treturn length(vec2(length(p.xz) - t.x, p.y)) - t.y;\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (TorusGeometry.__proto__ || Object.getPrototypeOf(TorusGeometry)).call(this, uniforms, glsl));
	}

	return TorusGeometry;
}(Geometry);

},{"../Geometry.js":3}],15:[function(require,module,exports){
"use strict";

module.exports = "\n\t#define STEPS 200\n\t#define RAYMARCH_EPSILON 0.1\n\t#define GRADIENT_EPSILON 0.001\n\t#define SCATTER_EPSILON 0.0001\n\t#define SHADOW_EPSILON 0.11\n\t#define INFINITY 10000.0\n\t#define PI 3.14159265359\n";

},{}],16:[function(require,module,exports){
"use strict";

var global = function global(scene) {
	var d = void 0,
	    g = void 0;
	if (scene.meshes.length == 0) {
		d = "INFINITY";
		g = "mesh";
	} else if (scene.meshes.length == 1) {
		d = "sdist_0(pos)";
		g = "mesh_0(pos)";
	} else {
		for (var i = 0; i < scene.meshes.length; i++) {
			var id = scene.meshes[i].id;
			if (i == 0) {
				d = "sdist_" + id + "(pos)";
				g = "mesh_" + id + "(pos)";
			} else {
				d = "smin(" + d + ", sdist_" + id + "(pos))";
				g = "mmin(" + g + ", mesh_" + id + "(pos))";
			}
		}
	}
	return "\n\t\tfloat distance(vec3 pos) {\n\t\t\treturn " + d + ";\n\t\t}\n\t\tmesh global(vec3 pos) {\n\t\t\treturn " + g + ";\n\t\t}\n\t\tvec3 normal(vec3 pos) {\n\t\t\treturn normalize(vec3(\n\t\t\t\tdistance(vec3(pos.x + GRADIENT_EPSILON, pos.y, pos.z)) - distance(vec3(pos.x - GRADIENT_EPSILON, pos.y, pos.z)),\n\t\t\t\tdistance(vec3(pos.x, pos.y + GRADIENT_EPSILON, pos.z)) - distance(vec3(pos.x, pos.y - GRADIENT_EPSILON, pos.z)),\n\t\t\t\tdistance(vec3(pos.x, pos.y, pos.z + GRADIENT_EPSILON)) - distance(vec3(pos.x, pos.y, pos.z - GRADIENT_EPSILON))\n\t\t\t));\n\t\t}\n\t\t";
};

module.exports = global;

},{}],17:[function(require,module,exports){
'use strict';

var lights = function lights(scene) {
	var result = scene.lights.map(function (light) {
		return light.glsl.replace('vec3 main', 'vec3 light_' + light.id).replace(/this./g, '_l' + light.id + '_');
	}).join('');
	return result;
};

module.exports = lights;

},{}],18:[function(require,module,exports){
"use strict";

module.exports = "\n\tvec3 color(vec2 fragCoord) {\n\t\tvec3 u = cos(cameraRotation) * vec3(1.0, 0.0, 0.0) + sin(cameraRotation) * vec3(0.0, 1.0, 0.0);\n\t\tvec3 v = cos(cameraRotation) * vec3(0.0, 1.0, 0.0) - sin(cameraRotation) * vec3(1.0, 0.0, 0.0);\n\t\tvec3 ncd = normalize(cameraDirection);\n\t\tu = applyQuat(quatFromUnitVectors(vec3(0.0, 0.0, 1.0), ncd), u);\n\t\tv = applyQuat(quatFromUnitVectors(vec3(0.0, 0.0, 1.0), ncd), v);\n\t\tfloat scale = 1.0;\n\t\tvec3 z = (0.5*scale/tan(cameraFov*0.5)) * ncd;\n\t\tvec3 rayPosition = cameraPosition\n\t\t\t+ scale * 2.0 * (fragCoord.x - width/2.0) * u / height\n\t\t\t+ scale * 2.0 * (fragCoord.y - height/2.0)  * v / height\n\t\t\t+ z;\n\t\tvec3 rayDirection = normalize(rayPosition - cameraPosition);\n\t\treturn shade(raymarch(rayPosition, rayDirection));\n\t}\n\tvoid main() {\n\t\tvec3 c = color(gl_FragCoord.xy);\n\t\tgl_FragColor = vec4(c, 1.0);\n\t}\n";

},{}],19:[function(require,module,exports){
'use strict';

var objects = function objects(scene) {
	var result = scene.meshes.map(function (mesh) {
		return mesh.geometry.glsl.replace('float main', 'float sdist_' + mesh.id).replace(/this./g, '_o' + mesh.id + '_') + mesh.material.glsl.replace('material main', 'material shade_' + mesh.id).replace(/this./g, '_o' + mesh.id + '_') + ('\n\t\t\t\tmesh mesh_' + mesh.id + '(vec3 pos) {\n\t\t\t\t\tmesh result;\n\t\t\t\t\tresult.distance = sdist_' + mesh.id + '(pos);\n\t\t\t\t\tresult.id = ' + mesh.id + '.0;\n\t\t\t\t\t// note: 5.0 factor because of sdf smoothing\n\t\t\t\t\t// todo: do something about that shit\n\t\t\t\t\tif (result.distance < 5.0 * RAYMARCH_EPSILON) {\n\t\t\t\t\t\tmaterial mat = shade_' + mesh.id + '(pos);\n\t\t\t\t\t\tresult.color = mat.color;\n\t\t\t\t\t\tresult.reflectivity = mat.reflectivity;\n\t\t\t\t\t\tresult.transparency = mat.transparency;\n\t\t\t\t\t\tresult.scattering = mat.scattering;\n\t\t\t\t\t}\n\t\t\t\t\treturn result;\n\t\t\t\t}\n\t\t\t');
	}).join('');
	return result;
};

module.exports = objects;

},{}],20:[function(require,module,exports){
"use strict";

module.exports = "\n\tprecision highp float;\n";

},{}],21:[function(require,module,exports){
"use strict";

module.exports = "\n\tmarch raymarch(vec3 rayPosition, vec3 rayDirection) {\n\t\tfloat td = 0.0;\n\t\tvec3 pos = rayPosition;\n\t\tvec3 dir = rayDirection;\n\t\tfloat hit = 0.0;\n\t\tint iterations = 0;\n\t\tfloat shadow = 1.0;\n\t\tfloat ss = 20.0;\n\t\tfor (int i = 0; i < STEPS; i++) {\n\t\t\t// Distance estimation\n\t\t\tfloat d = distance(pos);\n\t\t\tif (d < RAYMARCH_EPSILON) {\n\t\t\t\thit = 1.0;\n\t\t\t\tshadow = 0.0;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tshadow = min(shadow, ss * d / td);\n\t\t\ttd += d;\n\t\t\tpos = pos + dir*d;\n\t\t\titerations++;\n\t\t}\n\t\tmarch result;\n\t\tresult.iterations = iterations;\n\t\tresult.distance = td;\n\t\tresult.position = pos;\n\t\tresult.direction = dir;\n\t\tresult.shadow = shadow;\n\t\tresult.hit = hit;\n\t\treturn result;\n\t}\n";

},{}],22:[function(require,module,exports){
"use strict";

module.exports = "\n\tvec3 shade(march result) {\n\t\tmesh m = global(result.position);\n\t\tvec3 n = normal(result.position);\n\t\tvec3 diffuseColor = m.color;\n\t\tvec3 specularColor = vec3(1);\n\t\tvec3 lightDirection = normalize(vec3(0, 1, -0.5)); // Todo: uniform\n\t\tvec3 h = normalize(lightDirection - normalize(result.position));\n\t\tfloat diffuseRatio = 0.85;\n\t\tfloat shininess = 10.0;\n\t\tfloat occlusion = 1.0 - float(result.iterations) / float(STEPS);\n\t\tmarch sm = raymarch(result.position + n * SHADOW_EPSILON, lightDirection);\n\t\tfloat fog = exp(-0.0005 * result.distance);\n\t\tfloat envAmbience = 0.1;\n\t\tfloat diffuseAmbience = 0.1;\n\t\treturn vec3(0) * (1.0 - fog) + max(envAmbience, fog * occlusion * sm.shadow) * result.hit * (\n\t\t\t(1.0 - diffuseAmbience) * diffuseRatio * diffuseColor * light_0(result.position, n)\n\t\t\t+ (1.0 - diffuseRatio) * pow(max(0.0, dot(n, h)), shininess)\n\t\t\t+ diffuseAmbience * diffuseColor\n\t\t);\n\t}\n";

},{}],23:[function(require,module,exports){
"use strict";

module.exports = "\n\tstruct mesh {\n\t\tfloat distance;\n\t\tvec3 color;\n\t\tfloat id;\n\t\tfloat transparency;\n\t\tfloat reflectivity;\n\t\tfloat scattering;\n\t} Mesh;\n\tstruct material {\n\t\tvec3 color;\n\t\tfloat transparency;\n\t\tfloat reflectivity;\n\t\tfloat scattering;\n\t};\n\tstruct march {\n    int iterations;\n    float distance;\n    vec3 position;\n    vec3 direction;\n    float shadow;\n    float hit;\n  };\n";

},{}],24:[function(require,module,exports){
"use strict";

var uniforms = function uniforms(scene) {
	var result = "\n\t\tuniform float width;\n\t\tuniform float height;\n\t\tuniform float time;\n\t\tuniform vec3 cameraPosition;\n\t\tuniform vec3 cameraDirection;\n\t\tuniform float cameraRotation;\n\t\tuniform float cameraFov;\n\t";
	scene.meshes.forEach(function (mesh) {
		result += "uniform vec3 _o" + mesh.id + "_position;\n";
		Object.keys(mesh.geometry.uniforms).forEach(function (key) {
			result += "uniform " + mesh.geometry.uniforms[key].type + " _o" + mesh.id + "_" + key + ";\n";
		});
		Object.keys(mesh.material.uniforms).forEach(function (key) {
			result += "uniform " + mesh.material.uniforms[key].type + " _o" + mesh.id + "_" + key + ";\n";
		});
	});
	scene.lights.forEach(function (light) {
		result += "uniform vec3 _l" + light.id + "_position;\n";
		Object.keys(light.uniforms).forEach(function (key) {
			result += "uniform " + light.uniforms[key].type + " _l" + light.id + "_" + key + ";\n";
		});
	});
	return result;
};

module.exports = uniforms;

},{}],25:[function(require,module,exports){
"use strict";

module.exports = "\n\tfloat smin(float a, float b) {\n\t\tfloat k = 1.0;\n    float h = max( k-abs(a-b), 0.0 )/k;\n    return min( a, b ) - h*h*h*k*(1.0/6.0);\n\t}\n\tfloat when_eq(float x, float y) {\n\t\t\treturn 1.0 - abs(sign(x - y));\n\t}\n\tfloat when_neq(float x, float y) {\n\t\treturn abs(sign(x - y));\n\t}\n\tfloat when_gt(float x, float y) {\n\t\treturn max(sign(x - y), 0.0);\n\t}\n\tfloat when_lt(float x, float y) {\n\t\treturn max(sign(y - x), 0.0);\n\t}\n\tfloat when_ge(float x, float y) {\n\t\treturn 1.0 - when_lt(x, y);\n\t}\n\tfloat when_le(float x, float y) {\n\t\treturn 1.0 - when_gt(x, y);\n\t}\n\tmesh mmin(mesh a, mesh b) {\n\t\tmesh result;\n\t\tfloat ca = when_lt(a.distance, b.distance);\n\t\tfloat cb = 1.0 - ca;\n\t\tresult.distance = ca * a.distance + cb * b.distance;\n\t\tresult.color = ca * a.color + cb * b.color;\n\t\tresult.reflectivity = ca * a.reflectivity + cb * b.reflectivity;\n\t\tresult.transparency = ca * a.transparency + cb * b.transparency;\n\t\tresult.scattering = ca * a.scattering + cb * b.scattering;\n\t\treturn result;\n\t}\n\tvec4 quatFromAxisAngle(float angle, vec3 axis) {\n\t\tfloat half_sin = sin(0.5 * angle);\n\t\tfloat half_cos = cos(0.5 * angle);\n\t\treturn vec4(half_sin * axis.x,\n\t\t\t\t\thalf_sin * axis.y,\n\t\t\t\t\thalf_sin * axis.z,\n\t\t\t\t\thalf_cos);\n\t}\n\tvec4 quatFromUnitVectors(vec3 u, vec3 v) {\n\t\tvec3 w = cross(u, v);\n\t\tvec4 q = vec4(w.x, w.y, w.z, 1.0 + dot(u, v));\n\t\treturn normalize(q);\n\t}\n\tvec4 multQuats(vec4 q, vec4 p) {\n\t\treturn vec4(\n\t\t\tvec3(q.w * p.xyz + p.w * q.xyz + cross(q.xyz, p.xyz)),\n\t\t\tq.w * p.w - dot(q.xyz, p.xyz)\n\t\t);\n\t}\n\tvec3 applyQuat(vec4 q, vec3 v) {\n\t\treturn multQuats(q, multQuats(vec4(v, 1.0), vec4(vec3(-q.xyz), q.w))).xyz;\n\t}\n";

},{}],26:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Light = require('../Light.js');
module.exports = function (_Light) {
	_inherits(DirectionalLight, _Light);

	function DirectionalLight() {
		var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, DirectionalLight);

		var uniforms = {
			intensity: {
				type: 'float',
				value: opts.intensity === undefined ? 1.0 : opts.intensity
			},
			color: {
				type: 'vec3',
				value: opts.color === undefined ? new RAY.Vec3(1.0, 1.0, 1.0) : opts.color
			}
		};
		var glsl = '\n\t\t\tvec3 main(vec3 pos, vec3 normal) {\n\t\t\t\treturn this.color * this.intensity;\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (DirectionalLight.__proto__ || Object.getPrototypeOf(DirectionalLight)).call(this, uniforms, glsl));
	}

	return DirectionalLight;
}(Light);

},{"../Light.js":4}],27:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Light = require('../Light.js');
module.exports = function (_Light) {
	_inherits(DirectionalLight, _Light);

	function DirectionalLight() {
		var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, DirectionalLight);

		var uniforms = {
			intensity: {
				type: 'float',
				value: opts.intensity === undefined ? 1.0 : opts.intensity
			},
			color: {
				type: 'vec3',
				value: opts.color === undefined ? new RAY.Vec3(1.0, 1.0, 1.0) : opts.color
			},
			falloff: {
				type: 'float',
				value: opts.falloff === undefined ? 2.0 : opts.falloff
			}
		};
		var glsl = '\n\t\t\tvec3 main(vec3 pos, vec3 normal) {\n\t\t\t\treturn this.color * max(0.0, dot(normal, vec3(0.0, 1.0, -0.5)));\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (DirectionalLight.__proto__ || Object.getPrototypeOf(DirectionalLight)).call(this, uniforms, glsl));
	}

	return DirectionalLight;
}(Light);

},{"../Light.js":4}],28:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Material = require('../Material.js');
module.exports = function (_Material) {
	_inherits(BasicMaterial, _Material);

	function BasicMaterial() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$color = _ref.color,
		    color = _ref$color === undefined ? new RAY.Vec3(1.0, 1.0, 1.0) : _ref$color,
		    _ref$reflectivity = _ref.reflectivity,
		    reflectivity = _ref$reflectivity === undefined ? 0.0 : _ref$reflectivity,
		    _ref$transparency = _ref.transparency,
		    transparency = _ref$transparency === undefined ? 0.0 : _ref$transparency,
		    _ref$scattering = _ref.scattering,
		    scattering = _ref$scattering === undefined ? 0.0 : _ref$scattering;

		_classCallCheck(this, BasicMaterial);

		var uniforms = {
			color: {
				type: 'vec3',
				value: color
			},
			reflectivity: {
				type: 'float',
				value: reflectivity
			},
			transparency: {
				type: 'float',
				value: transparency
			},
			scattering: {
				type: 'float',
				value: scattering
			}
		};
		var glsl = '\n\t\t\tmaterial main(vec3 pos) {\n\t\t\t\tmaterial basicMaterial;\n\t\t\t\tbasicMaterial.color = this.color;\n\t\t\t\tbasicMaterial.reflectivity = this.reflectivity;\n\t\t\t\tbasicMaterial.transparency = this.transparency;\n\t\t\t\tbasicMaterial.scattering = this.scattering;\n\t\t\t\treturn basicMaterial;\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (BasicMaterial.__proto__ || Object.getPrototypeOf(BasicMaterial)).call(this, uniforms, glsl));
	}

	return BasicMaterial;
}(Material);

},{"../Material.js":5}],29:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Material = require('../Material.js');
module.exports = function (_Material) {
	_inherits(CheckerboardMaterial, _Material);

	function CheckerboardMaterial() {
		var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, CheckerboardMaterial);

		var uniforms = {};
		var glsl = '\n\t\t\tmaterial main(vec3 pos) {\n\t\t\t\tmaterial mat;\n\t\t\t\tmat.reflectivity = 0.0;\n\t\t\t\tfloat scale = 0.005;\n\t\t\t\tif (mod(pos.x*scale, 1.0) < 0.5 && mod(pos.z*scale, 1.0) < 0.5\n\t\t\t\t\t|| mod(pos.x*scale, 1.0) > 0.5 && mod(pos.z*scale, 1.0) > 0.5) {\n\t\t\t\t\tmat.color = vec3(0.8);\n\t\t\t\t} else {\n\t\t\t\t\tmat.color = vec3(0.2);\n\t\t\t\t}\n\t\t\t\treturn mat;\n\t\t\t}\n\t\t';
		return _possibleConstructorReturn(this, (CheckerboardMaterial.__proto__ || Object.getPrototypeOf(CheckerboardMaterial)).call(this, uniforms, glsl));
	}

	return CheckerboardMaterial;
}(Material);

},{"../Material.js":5}],30:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function Vec3() {
	var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	_classCallCheck(this, Vec3);

	this.x = x;this.y = y;this.z = z;
};

},{}],31:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function Vec4() {
	var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	_classCallCheck(this, Vec4);

	this.x = x;this.y = y;this.z = z;this.w = 0;
};

},{}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FtZXJhLmpzIiwic3JjL0NvbXBpbGVyLmpzIiwic3JjL0dlb21ldHJ5LmpzIiwic3JjL0xpZ2h0LmpzIiwic3JjL01hdGVyaWFsLmpzIiwic3JjL01lc2guanMiLCJzcmMvUkFZLmpzIiwic3JjL1JlbmRlcmVyLmpzIiwic3JjL1NjZW5lLmpzIiwic3JjL2dlb21ldHJpZXMvQm94R2VvbWV0cnkuanMiLCJzcmMvZ2VvbWV0cmllcy9MaW5lR2VvbWV0cnkuanMiLCJzcmMvZ2VvbWV0cmllcy9QbGFuZUdlb21ldHJ5LmpzIiwic3JjL2dlb21ldHJpZXMvU3BoZXJlR2VvbWV0cnkuanMiLCJzcmMvZ2VvbWV0cmllcy9Ub3J1c0dlb21ldHJ5LmpzIiwic3JjL2dsc2wvY29uc3RhbnRzLmpzIiwic3JjL2dsc2wvZ2xvYmFsLmpzIiwic3JjL2dsc2wvbGlnaHRzLmpzIiwic3JjL2dsc2wvbWFpbi5qcyIsInNyYy9nbHNsL29iamVjdHMuanMiLCJzcmMvZ2xzbC9wcmVjaXNpb24uanMiLCJzcmMvZ2xzbC9yYXltYXJjaC5qcyIsInNyYy9nbHNsL3NoYWRlLmpzIiwic3JjL2dsc2wvc3RydWN0cy5qcyIsInNyYy9nbHNsL3VuaWZvcm1zLmpzIiwic3JjL2dsc2wvdXRpbGl0aWVzLmpzIiwic3JjL2xpZ2h0cy9BbWJpZW50TGlnaHQuanMiLCJzcmMvbGlnaHRzL0RpcmVjdGlvbmFsTGlnaHQuanMiLCJzcmMvbWF0ZXJpYWxzL0Jhc2ljTWF0ZXJpYWwuanMiLCJzcmMvbWF0ZXJpYWxzL0NoZWNrZXJib2FyZE1hdGVyaWFsLmpzIiwic3JjL21hdGgvVmVjMy5qcyIsInNyYy9tYXRoL1ZlYzQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxPQUFPLE9BQVA7QUFDQyxtQkFBdUI7QUFBQSxNQUFYLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDdEIsT0FBSyxR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Ozs7Ozs7O0FDREEsSUFBTSxXQUFXLFFBQVEsZ0JBQVIsQ0FBakI7QUFDQSxPQUFPLE9BQVA7QUFBQTs7QUFDQyxpQ0FBdUI7QUFBQSxNQUFYLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDdEIsTUFBTSxXQUFXLEVBQWpCO0FBQ0EsTUFBTSx5WkFBTjtBQUZzQixxSUFnQmhCLFFBaEJnQixFQWdCTixJQWhCTTtBQWlCdEI7O0FBbEJGO0FBQUEsRUFBb0QsUUFBcEQ7Ozs7Ozs7QUNEQSxPQUFPLE9BQVAsR0FDQyxnQkFBaUM7QUFBQSxLQUFyQixDQUFxQix1RUFBakIsQ0FBaUI7QUFBQSxLQUFkLENBQWMsdUVBQVYsQ0FBVTtBQUFBLEtBQVAsQ0FBTyx1RUFBSCxDQUFHOztBQUFBOztBQUNoQyxNQUFLLENBQUwsR0FBUyxDQUFULENBQVksS0FBSyxDQUFMLEdBQVMsQ0FBVCxDQUFZLEtBQUssQ0FBTCxHQUFTLENBQVQ7QUFDeEIsQ0FIRjs7Ozs7OztBQ0FBLE9BQU8sT0FBUCxHQUNDLGdCQUF3QztBQUFBLEtBQTVCLENBQTRCLHVFQUF4QixDQUF3QjtBQUFBLEtBQXJCLENBQXFCLHVFQUFqQixDQUFpQjtBQUFBLEtBQWQsQ0FBYyx1RUFBVixDQUFVO0FBQUEsS0FBUCxDQUFPLHVFQUFILENBQUc7O0FBQUE7O0FBQ3ZDLE1BQUssQ0FBTCxHQUFTLENBQVQsQ0FBWSxLQUFLLENBQUwsR0FBUyxDQUFULENBQVksS0FBSyxDQUFMLEdBQVMsQ0FBVCxDQUFZLEtBQUssQ0FBTCxHQUFTLENBQVQ7QUFDcEMsQ0FIRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENhbWVyYSB7XG5cdGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuXHRcdHRoaXMucG9zaXRpb24gPSBvcHRzLnBvc2l0aW9uIHx8IG5ldyBSQVkuVmVjMygpO1xuXHRcdHRoaXMuZGlyZWN0aW9uID0gb3B0cy5kaXJlY3Rpb24gfHwgbmV3IFJBWS5WZWMzKDAsIDAsIDEpO1xuXHRcdHRoaXMucm90YXRpb24gPSBvcHRzLnJvdGF0aW9uIHx8IDAuMDtcblx0XHR0aGlzLmZvdiA9IG9wdHMuZm92IHx8IE1hdGguUEkvMztcblx0fVxuXHRsb29rQXQocG9zaXRpb24pIHtcblx0XHR0aGlzLmRpcmVjdGlvbi54ID0gcG9zaXRpb24ueCAtIHRoaXMucG9zaXRpb24ueDtcblx0XHR0aGlzLmRpcmVjdGlvbi55ID0gcG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueTtcblx0XHR0aGlzLmRpcmVjdGlvbi56ID0gcG9zaXRpb24ueiAtIHRoaXMucG9zaXRpb24uejtcblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDb21waWxlciB7XG5cdGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuXHRcdHRoaXMudmVyYm9zZSA9IG9wdHMudmVyYm9zZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBvcHRzLnZlcmJvc2U7XG5cdH1cblx0Y29tcGlsZShzY2VuZSkge1xuXHRcdGxldCBmcmFnID0gXCJcIjtcblx0XHRmcmFnICs9IHJlcXVpcmUoJy4vZ2xzbC9jb25zdGFudHMuanMnKTtcblx0XHRmcmFnICs9IHJlcXVpcmUoJy4vZ2xzbC9wcmVjaXNpb24uanMnKTtcblx0IFx0ZnJhZyArPSByZXF1aXJlKCcuL2dsc2wvdW5pZm9ybXMuanMnKShzY2VuZSlcblx0XHRmcmFnICs9IHJlcXVpcmUoJy4vZ2xzbC9zdHJ1Y3RzLmpzJyk7XG5cdFx0ZnJhZyArPSByZXF1aXJlKCcuL2dsc2wvdXRpbGl0aWVzLmpzJyk7XG5cdFx0ZnJhZyArPSByZXF1aXJlKCcuL2dsc2wvb2JqZWN0cy5qcycpKHNjZW5lKTtcblx0XHRmcmFnICs9IHJlcXVpcmUoJy4vZ2xzbC9nbG9iYWwuanMnKShzY2VuZSk7XG5cdFx0ZnJhZyArPSByZXF1aXJlKCcuL2dsc2wvbGlnaHRzLmpzJykoc2NlbmUpO1xuXHRcdGZyYWcgKz0gcmVxdWlyZSgnLi9nbHNsL3JheW1hcmNoLmpzJyk7XG5cdFx0ZnJhZyArPSByZXF1aXJlKCcuL2dsc2wvc2hhZGUuanMnKTtcblx0XHRmcmFnICs9IHJlcXVpcmUoJy4vZ2xzbC9tYWluLmpzJyk7XG5cdFx0ZnJhZyA9IGZyYWcucmVwbGFjZSgvXFx0L2csICcnKTtcblx0XHRpZiAodGhpcy52ZXJib3NlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkNvbXBpbGF0aW9uIHJlc3VsdDogXCIpO1xuXHRcdFx0bGV0IGxpbmVzID0gZnJhZy5zcGxpdCgnXFxuJyk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSBjb25zb2xlLmxvZyhpICsgXCI6IFwiICsgbGluZXNbaV0pO1xuXHRcdH1cblx0XHRyZXR1cm4gZnJhZztcblx0fVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2VvbWV0cnkge1xuXHRjb25zdHJ1Y3Rvcih1bmlmb3JtcywgZ2xzbCkge1xuXHRcdHRoaXMudW5pZm9ybXMgPSB1bmlmb3JtcyA9PT0gdW5kZWZpbmVkID8ge30gOiB1bmlmb3Jtcztcblx0XHR0aGlzLmdsc2wgPSBnbHNsO1xuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIExpZ2h0IHtcblx0Y29uc3RydWN0b3IodW5pZm9ybXMgPSB7fSwgZ2xzbCkge1xuXHRcdHRoaXMuaWQgPSBSQVkubGlnaHRJZDtcblx0XHRSQVkubGlnaHRJZCArPSAxO1xuXHRcdHRoaXMudW5pZm9ybXMgPSB1bmlmb3JtcyA9PT0gdW5kZWZpbmVkID8ge30gOiB1bmlmb3Jtcztcblx0XHR0aGlzLmdsc2wgPSBnbHNsO1xuXHRcdHRoaXMucG9zaXRpb24gPSBuZXcgUkFZLlZlYzMoKTtcblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBNYXRlcmlhbCB7XG5cdGNvbnN0cnVjdG9yKHVuaWZvcm1zLCBnbHNsKSB7XG5cdFx0dGhpcy51bmlmb3JtcyA9IHVuaWZvcm1zID09PSB1bmRlZmluZWQgPyB7fSA6IHVuaWZvcm1zO1xuXHRcdHRoaXMuZ2xzbCA9IGdsc2w7XG5cdH1cbn1cbiIsImltcG9ydCBWZWMzIGZyb20gJy4vbWF0aC9WZWMzLmpzJztcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTWVzaMKge1xuXHRjb25zdHJ1Y3RvcihnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHR0aGlzLmlkID0gUkFZLm9iamVjdElkO1xuXHRcdFJBWS5vYmplY3RJZCArPSAxO1xuXHRcdHRoaXMuZ2VvbWV0cnkgPSBnZW9tZXRyeTtcblx0XHR0aGlzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWMzKCk7XG5cdH1cbn1cbiIsImNvbnN0IFJBWSA9IHt9O1xuUkFZLm9iamVjdElkID0gMDtcblJBWS5saWdodElkID0gMDtcblJBWS5WZWMzID0gcmVxdWlyZSgnLi9tYXRoL1ZlYzMnKTtcblJBWS5WZWM0ID0gcmVxdWlyZSgnLi9tYXRoL1ZlYzQnKTtcblJBWS5HZW9tZXRyeSA9IHJlcXVpcmUoJy4vR2VvbWV0cnknKTtcblJBWS5Cb3hHZW9tZXRyeSA9IHJlcXVpcmUoJy4vZ2VvbWV0cmllcy9Cb3hHZW9tZXRyeScpO1xuUkFZLkxpbmVHZW9tZXRyeSA9IHJlcXVpcmUoJy4vZ2VvbWV0cmllcy9MaW5lR2VvbWV0cnknKTtcblJBWS5QbGFuZUdlb21ldHJ5ID0gcmVxdWlyZSgnLi9nZW9tZXRyaWVzL1BsYW5lR2VvbWV0cnknKTtcblJBWS5TcGhlcmVHZW9tZXRyeSA9IHJlcXVpcmUoJy4vZ2VvbWV0cmllcy9TcGhlcmVHZW9tZXRyeScpO1xuUkFZLlRvcnVzR2VvbWV0cnkgPSByZXF1aXJlKCcuL2dlb21ldHJpZXMvVG9ydXNHZW9tZXRyeScpO1xuUkFZLk1hdGVyaWFsID0gcmVxdWlyZSgnLi9NYXRlcmlhbC5qcycpO1xuUkFZLkJhc2ljTWF0ZXJpYWwgPSByZXF1aXJlKCcuL21hdGVyaWFscy9CYXNpY01hdGVyaWFsLmpzJyk7XG5SQVkuQ2hlY2tlcmJvYXJkTWF0ZXJpYWwgPSByZXF1aXJlKCcuL21hdGVyaWFscy9DaGVja2VyYm9hcmRNYXRlcmlhbC5qcycpO1xuUkFZLkxpZ2h0ID0gcmVxdWlyZSgnLi9MaWdodCcpO1xuUkFZLkRpcmVjdGlvbmFsTGlnaHQgPSByZXF1aXJlKCcuL2xpZ2h0cy9EaXJlY3Rpb25hbExpZ2h0Jyk7XG5SQVkuQW1iaWVudExpZ2h0ID0gcmVxdWlyZSgnLi9saWdodHMvQW1iaWVudExpZ2h0Jyk7XG5SQVkuTWVzaCA9IHJlcXVpcmUoJy4vTWVzaCcpO1xuUkFZLlNjZW5lID0gcmVxdWlyZSgnLi9TY2VuZScpO1xuUkFZLkNhbWVyYSA9IHJlcXVpcmUoJy4vQ2FtZXJhJyk7XG5SQVkuQ29tcGlsZXIgPSByZXF1aXJlKCcuL0NvbXBpbGVyJyk7XG5SQVkuUmVuZGVyZXIgPSByZXF1aXJlKCcuL1JlbmRlcmVyJyk7XG5tb2R1bGUuZXhwb3J0cyA9IFJBWTtcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUmVuZGVyZXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnMgPSB7fTtcblx0XHR0aGlzLmluZGljZXMgPSBudWxsO1xuXHRcdHRoaXMudGltZSA9IERhdGUubm93KCk7XG5cdFx0dGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0dGhpcy5nbCA9IHRoaXMuZG9tRWxlbWVudC5nZXRDb250ZXh0KCd3ZWJnbCcpO1xuXHR9XG5cdGluaXQoc2NlbmUsIGNhbWVyYSkge1xuXHRcdGxldCB2ZXJ0ZXhfYnVmZmVyLCBJbmRleF9CdWZmZXIsIGZyYWdTaGFkZXIsIHZlcnRTaGFkZXIsIHNoYWRlclByb2dyYW07XG5cdFx0Y29uc3QgZnJhZyA9IG5ldyBSQVkuQ29tcGlsZXIoe3ZlcmJvc2U6IHRydWV9KS5jb21waWxlKHNjZW5lKTtcblx0XHRjb25zdCB2ZXJ0aWNlcyA9IFtcblx0XHQgIC0xLjAsMS4wLDAuMCxcblx0XHQgIC0xLjAsLTEuMCwwLjAsXG5cdFx0ICAxLjAsLTEuMCwwLjAsXG5cdFx0ICAxLjAsMS4wLDAuMFxuXHRcdF07XG5cdFx0dGhpcy5pbmRpY2VzID0gWzMsMiwxLDMsMSwwXTtcblx0XHR2ZXJ0ZXhfYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcblx0XHR0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZlcnRleF9idWZmZXIpO1xuXHRcdHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuXHRcdHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XG5cdFx0SW5kZXhfQnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcblx0XHR0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgSW5kZXhfQnVmZmVyKTtcblx0XHR0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5KHRoaXMuaW5kaWNlcyksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuXHRcdHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcblx0XHRjb25zdCB2ZXJ0Q29kZSA9XG5cdFx0ICAnYXR0cmlidXRlIHZlYzMgY29vcmRpbmF0ZXM7JyArXG5cdFx0ICAndm9pZCBtYWluKHZvaWQpIHsnICtcblx0XHQgICAgICdnbF9Qb3NpdGlvbiA9IHZlYzQoY29vcmRpbmF0ZXMsIDEuMCk7JyArXG5cdFx0ICAnfSc7XG5cdFx0dmVydFNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XG5cdFx0dGhpcy5nbC5zaGFkZXJTb3VyY2UodmVydFNoYWRlciwgdmVydENvZGUpO1xuXHRcdHRoaXMuZ2wuY29tcGlsZVNoYWRlcih2ZXJ0U2hhZGVyKTtcblx0XHRmcmFnU2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xuXHRcdHRoaXMuZ2wuc2hhZGVyU291cmNlKGZyYWdTaGFkZXIsIGZyYWcpO1xuXHRcdHRoaXMuZ2wuY29tcGlsZVNoYWRlcihmcmFnU2hhZGVyKTtcblx0XHRzaGFkZXJQcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XG5cdFx0dGhpcy5nbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdmVydFNoYWRlcik7XG5cdFx0dGhpcy5nbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZnJhZ1NoYWRlcik7XG5cdFx0dGhpcy5nbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcblx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnMudGltZSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwidGltZVwiKTtcblx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnMud2lkdGggPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcIndpZHRoXCIpO1xuXHRcdHRoaXMudW5pZm9ybUxvY2F0aW9ucy5oZWlnaHQgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImhlaWdodFwiKTtcblx0XHRzY2VuZS5tZXNoZXMuZm9yRWFjaChtZXNoID0+IHtcblx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbYF9vJHttZXNoLmlkfV9wb3NpdGlvbmBdID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgYF9vJHttZXNoLmlkfV9wb3NpdGlvbmApO1xuXHRcdFx0T2JqZWN0LmtleXMobWVzaC5nZW9tZXRyeS51bmlmb3JtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbYF9vJHttZXNoLmlkfV8ke2tleX1gXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sIGBfbyR7bWVzaC5pZH1fJHtrZXl9YCk7XG5cdFx0XHR9KTtcblx0XHRcdE9iamVjdC5rZXlzKG1lc2gubWF0ZXJpYWwudW5pZm9ybXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdFx0dGhpcy51bmlmb3JtTG9jYXRpb25zW2BfbyR7bWVzaC5pZH1fJHtrZXl9YF0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBgX28ke21lc2guaWR9XyR7a2V5fWApO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0c2NlbmUubGlnaHRzLmZvckVhY2gobGlnaHQgPT4ge1xuXHRcdFx0dGhpcy51bmlmb3JtTG9jYXRpb25zW2BfbCR7bGlnaHQuaWR9X3Bvc2l0aW9uYF0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBgX2wke2xpZ2h0LmlkfV9wb3NpdGlvbmApO1xuXHRcdFx0T2JqZWN0LmtleXMobGlnaHQudW5pZm9ybXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdFx0dGhpcy51bmlmb3JtTG9jYXRpb25zW2BfbCR7bGlnaHQuaWR9XyR7a2V5fWBdID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgYF9sJHtsaWdodC5pZH1fJHtrZXl9YCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnMuY2FtZXJhUG9zaXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImNhbWVyYVBvc2l0aW9uXCIpO1xuXHRcdHRoaXMudW5pZm9ybUxvY2F0aW9ucy5jYW1lcmFEaXJlY3Rpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImNhbWVyYURpcmVjdGlvblwiKTtcblx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnMuY2FtZXJhUm90YXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImNhbWVyYVJvdGF0aW9uXCIpO1xuXHRcdHRoaXMudW5pZm9ybUxvY2F0aW9ucy5jYW1lcmFGb3YgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImNhbWVyYUZvdlwiKTtcblx0XHR0aGlzLmdsLnVzZVByb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XG5cdFx0Y29uc3QgZXJyb3IgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coZnJhZ1NoYWRlcik7XG5cdFx0aWYgKGVycm9yKSBjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHR0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZlcnRleF9idWZmZXIpO1xuXHRcdHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBJbmRleF9CdWZmZXIpO1xuXHRcdGNvbnN0IGNvb3JkID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImNvb3JkaW5hdGVzXCIpO1xuXHRcdHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcihjb29yZCwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXHRcdHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoY29vcmQpO1xuXHRcdGlmICh0aGlzLmRvbUVsZW1lbnQucGFyZW50Tm9kZSkge1xuXHRcdFx0dGhpcy5kb21FbGVtZW50LndpZHRoID0gdGhpcy5kb21FbGVtZW50LnBhcmVudE5vZGUuY2xpZW50V2lkdGg7XG5cdFx0XHR0aGlzLmRvbUVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5kb21FbGVtZW50LnBhcmVudE5vZGUuY2xpZW50SGVpZ2h0O1xuXHRcdFx0dGhpcy5kb21FbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5kb21FbGVtZW50LndpZHRoICsgXCJweFwiO1xuXHRcdFx0dGhpcy5kb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuZG9tRWxlbWVudC5oZWlnaHQgKyBcInB4XCI7XG5cdFx0fVxuXHRcdHRoaXMuZ2wudmlld3BvcnQoMCwwLHRoaXMuZG9tRWxlbWVudC53aWR0aCx0aGlzLmRvbUVsZW1lbnQuaGVpZ2h0KTtcblx0XHR0aGlzLmdsLmNsZWFyQ29sb3IoMCwgMCwgMCwgMSk7XG5cdFx0dGhpcy51cGxvYWRTdGF0aWNVbmlmb3JtcygpO1xuXHRcdHRoaXMudXBsb2FkRHluYW1pY1VuaWZvcm1zKCk7XG5cdH1cblx0dXBsb2FkU3RhdGljVW5pZm9ybXMoKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHVwbG9hZER5bmFtaWNVbmlmb3JtcygpIHtcblx0XHR0aGlzLmdsLnVuaWZvcm0xZih0aGlzLnVuaWZvcm1Mb2NhdGlvbnMudGltZSwgdGhpcy50aW1lKTtcblx0XHR0aGlzLmdsLnVuaWZvcm0xZih0aGlzLnVuaWZvcm1Mb2NhdGlvbnMud2lkdGgsIHRoaXMuZG9tRWxlbWVudC53aWR0aCk7XG5cdFx0dGhpcy5nbC51bmlmb3JtMWYodGhpcy51bmlmb3JtTG9jYXRpb25zLmhlaWdodCwgdGhpcy5kb21FbGVtZW50LmhlaWdodCk7XG5cdFx0dGhpcy5nbC51bmlmb3JtM2YoXG5cdFx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbJ2NhbWVyYVBvc2l0aW9uJ10sXG5cdFx0XHRjYW1lcmEucG9zaXRpb24ueCwgY2FtZXJhLnBvc2l0aW9uLnksIGNhbWVyYS5wb3NpdGlvbi56XG5cdFx0KTtcblx0XHR0aGlzLmdsLnVuaWZvcm0zZihcblx0XHRcdHRoaXMudW5pZm9ybUxvY2F0aW9uc1snY2FtZXJhRGlyZWN0aW9uJ10sXG5cdFx0XHRjYW1lcmEuZGlyZWN0aW9uLngsIGNhbWVyYS5kaXJlY3Rpb24ueSwgY2FtZXJhLmRpcmVjdGlvbi56XG5cdFx0KTtcblx0XHR0aGlzLmdsLnVuaWZvcm0xZihcblx0XHRcdHRoaXMudW5pZm9ybUxvY2F0aW9uc1snY2FtZXJhUm90YXRpb24nXSwgY2FtZXJhLnJvdGF0aW9uXG5cdFx0KTtcblx0XHR0aGlzLmdsLnVuaWZvcm0xZihcblx0XHRcdHRoaXMudW5pZm9ybUxvY2F0aW9uc1snY2FtZXJhRm92J10sIGNhbWVyYS5mb3Zcblx0XHQpO1xuXHRcdHNjZW5lLm1lc2hlcy5mb3JFYWNoKG1lc2ggPT4ge1xuXHRcdFx0dGhpcy5nbC51bmlmb3JtM2YoXG5cdFx0XHRcdHRoaXMudW5pZm9ybUxvY2F0aW9uc1tgX28ke21lc2guaWR9X3Bvc2l0aW9uYF0sXG5cdFx0XHRcdG1lc2gucG9zaXRpb24ueCwgbWVzaC5wb3NpdGlvbi55LCBtZXNoLnBvc2l0aW9uLnpcblx0XHRcdCk7XG5cdFx0XHRPYmplY3Qua2V5cyhtZXNoLmdlb21ldHJ5LnVuaWZvcm1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRcdHZhciB1bmlmb3JtID0gbWVzaC5nZW9tZXRyeS51bmlmb3Jtc1trZXldO1xuXHRcdFx0XHRzd2l0Y2godW5pZm9ybS50eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSAndmVjMyc6XG5cdFx0XHRcdFx0XHR0aGlzLmdsLnVuaWZvcm0zZihcblx0XHRcdFx0XHRcdFx0dGhpcy51bmlmb3JtTG9jYXRpb25zW2BfbyR7bWVzaC5pZH1fJHtrZXl9YF0sXG5cdFx0XHRcdFx0XHRcdHVuaWZvcm0udmFsdWUueCwgdW5pZm9ybS52YWx1ZS55LCB1bmlmb3JtLnZhbHVlLnpcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdmbG9hdCc6XG5cdFx0XHRcdFx0XHR0aGlzLmdsLnVuaWZvcm0xZih0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbYF9vJHttZXNoLmlkfV8ke2tleX1gXSwgdW5pZm9ybS52YWx1ZSk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQvLyBUb2RvOiBzbWggYWJvdXQgdGhpcyBzaGl0XG5cdFx0XHRPYmplY3Qua2V5cyhtZXNoLm1hdGVyaWFsLnVuaWZvcm1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRcdGNvbnN0IHVuaWZvcm0gPSBtZXNoLm1hdGVyaWFsLnVuaWZvcm1zW2tleV07XG5cdFx0XHRcdHN3aXRjaCh1bmlmb3JtLnR5cGUpIHtcblx0XHRcdFx0XHRjYXNlICd2ZWMzJzpcblx0XHRcdFx0XHRcdHRoaXMuZ2wudW5pZm9ybTNmKFxuXHRcdFx0XHRcdFx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbYF9vJHttZXNoLmlkfV8ke2tleX1gXSxcblx0XHRcdFx0XHRcdFx0dW5pZm9ybS52YWx1ZS54LCB1bmlmb3JtLnZhbHVlLnksIHVuaWZvcm0udmFsdWUuelxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2Zsb2F0Jzpcblx0XHRcdFx0XHRcdHRoaXMuZ2wudW5pZm9ybTFmKHRoaXMudW5pZm9ybUxvY2F0aW9uc1tgX28ke21lc2guaWR9XyR7a2V5fWBdLCB1bmlmb3JtLnZhbHVlKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRzY2VuZS5saWdodHMuZm9yRWFjaChsaWdodCA9PiB7XG5cdFx0XHR0aGlzLmdsLnVuaWZvcm0zZihcblx0XHRcdFx0dGhpcy51bmlmb3JtTG9jYXRpb25zW2BfbCR7bGlnaHQuaWR9X3Bvc2l0aW9uYF0sXG5cdFx0XHRcdGxpZ2h0LnBvc2l0aW9uLngsIGxpZ2h0LnBvc2l0aW9uLnksIGxpZ2h0LnBvc2l0aW9uLnpcblx0XHRcdCk7XG5cdFx0XHRPYmplY3Qua2V5cyhsaWdodC51bmlmb3JtcykuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0XHRsZXQgdW5pZm9ybSA9IGxpZ2h0LnVuaWZvcm1zW2tleV07XG5cdFx0XHRcdHN3aXRjaCh1bmlmb3JtLnR5cGUpIHtcblx0XHRcdFx0XHRjYXNlICd2ZWMzJzpcblx0XHRcdFx0XHRcdHRoaXMuZ2wudW5pZm9ybTNmKFxuXHRcdFx0XHRcdFx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbYF9sJHtsaWdodC5pZH1fJHtrZXl9YF0sXG5cdFx0XHRcdFx0XHRcdHVuaWZvcm0udmFsdWUueCwgdW5pZm9ybS52YWx1ZS55LCB1bmlmb3JtLnZhbHVlLnpcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdmbG9hdCc6XG5cdFx0XHRcdFx0XHR0aGlzLmdsLnVuaWZvcm0xZih0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbYF9sJHtsaWdodC5pZH1fJHtrZXl9YF0sIHVuaWZvcm0udmFsdWUpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cdHJlbmRlcihzY2VuZSwgY2FtZXJhKSB7XG5cdFx0dGhpcy5nbC51bmlmb3JtM2YoXG5cdFx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbJ2NhbWVyYVBvc2l0aW9uJ10sXG5cdFx0XHRjYW1lcmEucG9zaXRpb24ueCwgY2FtZXJhLnBvc2l0aW9uLnksIGNhbWVyYS5wb3NpdGlvbi56XG5cdFx0KTtcblx0XHR0aGlzLmdsLmRyYXdFbGVtZW50cyh0aGlzLmdsLlRSSUFOR0xFUywgdGhpcy5pbmRpY2VzLmxlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwwKTtcblx0XHRsZXQgZHQgPSBEYXRlLm5vdygpIC0gdGhpcy50aW1lO1xuXHRcdC8vY29uc29sZS5sb2coZHQgKyBcIm1zXCIpO1xuXHRcdHRoaXMudGltZSA9IERhdGUubm93KCk7XG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTY2VuZcKge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLm1lc2hlcyA9IFtdO1xuXHRcdHRoaXMubGlnaHRzID0gW107XG5cdFx0dGhpcy5jb21waWxlZCA9IGZhbHNlO1xuXHR9XG5cdGFkZCh4KSB7XG5cdFx0aWYgKHguY29uc3RydWN0b3IgPT09IFJBWS5NZXNoKSB7XG5cdFx0XHR0aGlzLm1lc2hlcy5wdXNoKHgpO1xuXHRcdH0gZWxzZSBpZiAoeC5jb25zdHJ1Y3RvciA9PT0gUkFZLkRpcmVjdGlvbmFsTGlnaHQgfHwgeC5jb25zdHJ1Y3RvciA9PT0gUkFZLkFtYmllbnRMaWdodCkge1xuXHRcdFx0dGhpcy5saWdodHMucHVzaCh4KTtcblx0XHR9XG5cdH07XG5cdHJlbW92ZShvYmopIHtcblx0XHR2YXIgaW5kZXggPSB0aGlzLm1lc2hlcy5pbmRleE9mKG1lc2gpO1xuXHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHR0aGlzLm1lc2hlcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdH1cblx0XHQvLyBUT0RPIDogTElHSFRTIERFTEVUSU9OXG5cdH07XG59O1xuIiwiY29uc3QgR2VvbWV0cnkgPSByZXF1aXJlKCcuLi9HZW9tZXRyeS5qcycpO1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCb3hHZW9tZXRyeSBleHRlbmRzIEdlb21ldHJ5IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Y29uc3QgdW5pZm9ybXMgPSB7fTtcblx0XHRjb25zdCBnbHNsID0gYFxuXHRcdFx0ZmxvYXQgbWFpbih2ZWMzIHBvcykge1xuXHRcdFx0XHR2ZWMzIGQgPSBhYnMocG9zKSAtIHZlYzMoMTAuMCwgMTAuMCwgMTAuMCk7XG5cdCAgICBcdFx0cmV0dXJuIG1pbihtYXgoZC54LG1heChkLnksZC56KSksMC4wKSArIGxlbmd0aChtYXgoZCwwLjApKTtcblx0XHRcdH1cblx0XHRgO1xuXHRcdHN1cGVyKHVuaWZvcm1zLCBnbHNsKTtcblx0fVxufVxuIiwiLypcbmZsb2F0IGxpbmUyKHZlYzMgYSwgdmVjMyBiLCBmbG9hdCB0aGlja25lc3MsIHZlYzMgcG9zKSB7XG4gIHJldHVybiBtYXgoMC4wLCBsZW5ndGgoKHBvcy1hKSAtIGNsYW1wKGRvdChwb3MtYSwgYi1hKSwgMC4wLCBkb3QoYi1hLGItYSkpICogKGItYSkvZG90KGItYSxiLWEpKSAtIHRoaWNrbmVzcyk7XG59XG4qL1xuXG5jb25zdCBHZW9tZXRyeSA9IHJlcXVpcmUoJy4uL0dlb21ldHJ5LmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIExpbmVHZW9tZXRyeSBleHRlbmRzIEdlb21ldHJ5IHtcblx0Y29uc3RydWN0b3Ioe3RoaWNrbmVzcyA9IDEuMCwgYSA9IG5ldyBSQVkuVmVjMygwLDAsMCksIGIgPSBuZXcgUkFZLlZlYzMoMCwwLDEpfSA9IHt9KSB7XG5cdFx0Y29uc3QgdW5pZm9ybXMgPSB7XG5cdFx0XHR0aGlja25lc3M6IHtcblx0XHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdFx0dmFsdWU6IHRoaWNrbmVzc1xuXHRcdFx0fSxcblx0XHRcdGE6IHtcblx0XHRcdFx0dHlwZTogJ3ZlYzMnLFxuXHRcdFx0XHR2YWx1ZTogYVxuXHRcdFx0fSxcblx0XHRcdGI6IHtcblx0XHRcdFx0dHlwZTogJ3ZlYzMnLFxuXHRcdFx0XHR2YWx1ZTogYlxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3QgZ2xzbCA9IGBcblx0XHRcdGZsb2F0IG1haW4odmVjMyBwb3MpIHtcblx0XHRcdFx0dmVjMyBhID0gdGhpcy5wb3NpdGlvbiArIHRoaXMuYTtcblx0XHRcdFx0dmVjMyBiID0gdGhpcy5wb3NpdGlvbiArIHRoaXMuYjtcblx0XHRcdFx0ZmxvYXQgZCA9IGRvdChiLWEsIGItYSk7XG5cdFx0XHRcdHJldHVybiBtYXgoMC4wLCBsZW5ndGgoKHBvcy1hKSAtIGNsYW1wKGRvdChwb3MtYSwgYi1hKSwgMC4wLCBkKSAqIChiLWEpL2QpIC0gdGhpcy50aGlja25lc3MpO1xuXHRcdFx0fVxuXHRcdGA7XG5cdFx0c3VwZXIodW5pZm9ybXMsIGdsc2wpO1xuXHR9XG59XG4iLCJjb25zdCBHZW9tZXRyeSA9IHJlcXVpcmUoJy4uL0dlb21ldHJ5LmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBsYW5lR2VvbWV0cnkgZXh0ZW5kcyBHZW9tZXRyeSB7XG5cdGNvbnN0cnVjdG9yKHt3aWR0aCA9IDEuMCwgaGVpZ2h0ID0gMS4wfSA9IHt9KSB7XG5cdFx0Y29uc3QgdW5pZm9ybXMgPSB7XG5cdFx0XHR3aWR0aDoge1xuXHRcdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0XHR2YWx1ZTogd2lkdGhcblx0XHRcdH0sXG5cdFx0XHRoZWlnaHQ6IHtcblx0XHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdFx0dmFsdWU6IGhlaWdodFxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3QgZ2xzbCA9IGBcblx0XHRcdGZsb2F0IG1haW4odmVjMyBwb3MpIHtcblx0XHRcdFx0cmV0dXJuIHBvcy55IC0gdGhpcy5wb3NpdGlvbi55O1xuXHRcdFx0fVxuXHRcdGA7XG5cdFx0c3VwZXIodW5pZm9ybXMsIGdsc2wpO1xuXHR9XG59XG4iLCJjb25zdCBHZW9tZXRyeSA9IHJlcXVpcmUoJy4uL0dlb21ldHJ5LmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNwaGVyZUdlb21ldHJ5IGV4dGVuZHMgR2VvbWV0cnkge1xuXHRjb25zdHJ1Y3Rvcih7cmFkaXVzID0gMS4wfSA9IHt9KSB7XG5cdFx0Y29uc3QgdW5pZm9ybXMgPSB7XG5cdFx0XHRyYWRpdXM6IHtcblx0XHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdFx0dmFsdWU6IHJhZGl1c1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3QgZ2xzbCA9IGBcblx0XHRcdGZsb2F0IG1haW4odmVjMyBwb3MpIHtcblx0XHRcdFx0cmV0dXJuIGxlbmd0aChwb3MgLSB0aGlzLnBvc2l0aW9uKSAtIHRoaXMucmFkaXVzO1xuXHRcdFx0fVxuXHRcdGA7XG5cdFx0c3VwZXIodW5pZm9ybXMsIGdsc2wpO1xuXHR9XG59XG4iLCJjb25zdCBHZW9tZXRyeSA9IHJlcXVpcmUoJy4uL0dlb21ldHJ5LmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRvcnVzR2VvbWV0cnkgZXh0ZW5kcyBHZW9tZXRyeSB7XG5cdGNvbnN0cnVjdG9yKHtyYWRpdXMgPSAxLjAsIHR1YmVSYWRpdXMgPSAxLjB9ID0ge30pIHtcblx0XHRjb25zdCB1bmlmb3JtcyA9IHtcblx0XHRcdHJhZGl1czoge1xuXHRcdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0XHR2YWx1ZTogcmFkaXVzXG5cdFx0XHR9LFxuXHRcdFx0dHViZVJhZGl1czoge1xuXHRcdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0XHR2YWx1ZTogdHViZVJhZGl1c1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3QgZ2xzbCA9IGBcblx0XHRcdGZsb2F0IG1haW4odmVjMyBwb3MpIHtcblx0XHRcdFx0dmVjMiB0ID0gdmVjMih0aGlzLnJhZGl1cywgdGhpcy50dWJlUmFkaXVzKTtcblx0XHRcdFx0dmVjMyBwID0gcG9zIC0gdGhpcy5wb3NpdGlvbjtcblx0XHRcdFx0cmV0dXJuIGxlbmd0aCh2ZWMyKGxlbmd0aChwLnh6KSAtIHQueCwgcC55KSkgLSB0Lnk7XG5cdFx0XHR9XG5cdFx0YDtcblx0XHRzdXBlcih1bmlmb3JtcywgZ2xzbCk7XG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gYFxuXHQjZGVmaW5lIFNURVBTIDIwMFxuXHQjZGVmaW5lIFJBWU1BUkNIX0VQU0lMT04gMC4xXG5cdCNkZWZpbmUgR1JBRElFTlRfRVBTSUxPTiAwLjAwMVxuXHQjZGVmaW5lIFNDQVRURVJfRVBTSUxPTiAwLjAwMDFcblx0I2RlZmluZSBTSEFET1dfRVBTSUxPTiAwLjExXG5cdCNkZWZpbmUgSU5GSU5JVFkgMTAwMDAuMFxuXHQjZGVmaW5lIFBJIDMuMTQxNTkyNjUzNTlcbmBcbiIsImNvbnN0IGdsb2JhbCA9IChzY2VuZSkgPT4ge1xuXHRsZXQgZCwgZztcblx0aWYgKHNjZW5lLm1lc2hlcy5sZW5ndGggPT0gMCkge1xuXHRcdGQgPSBgSU5GSU5JVFlgO1xuXHRcdGcgPSBgbWVzaGA7XG5cdH0gZWxzZSBpZiAoc2NlbmUubWVzaGVzLmxlbmd0aCA9PSAxKSB7XG5cdFx0ZCA9IGBzZGlzdF8wKHBvcylgO1xuXHRcdGcgPSBgbWVzaF8wKHBvcylgO1xuXHR9IGVsc2Uge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2NlbmUubWVzaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgaWQgPSBzY2VuZS5tZXNoZXNbaV0uaWQ7XG5cdFx0XHRpZiAoaSA9PSAwKSB7XG5cdFx0XHRcdGQgPSBgc2Rpc3RfJHtpZH0ocG9zKWA7XG5cdFx0XHRcdGcgPSBgbWVzaF8ke2lkfShwb3MpYDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGQgPSBgc21pbigke2R9LCBzZGlzdF8ke2lkfShwb3MpKWA7XG5cdFx0XHRcdGcgPSBgbW1pbigke2d9LCBtZXNoXyR7aWR9KHBvcykpYDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGBcblx0XHRmbG9hdCBkaXN0YW5jZSh2ZWMzIHBvcykge1xuXHRcdFx0cmV0dXJuICR7ZH07XG5cdFx0fVxuXHRcdG1lc2ggZ2xvYmFsKHZlYzMgcG9zKSB7XG5cdFx0XHRyZXR1cm4gJHtnfTtcblx0XHR9XG5cdFx0dmVjMyBub3JtYWwodmVjMyBwb3MpIHtcblx0XHRcdHJldHVybiBub3JtYWxpemUodmVjMyhcblx0XHRcdFx0ZGlzdGFuY2UodmVjMyhwb3MueCArIEdSQURJRU5UX0VQU0lMT04sIHBvcy55LCBwb3MueikpIC0gZGlzdGFuY2UodmVjMyhwb3MueCAtIEdSQURJRU5UX0VQU0lMT04sIHBvcy55LCBwb3MueikpLFxuXHRcdFx0XHRkaXN0YW5jZSh2ZWMzKHBvcy54LCBwb3MueSArIEdSQURJRU5UX0VQU0lMT04sIHBvcy56KSkgLSBkaXN0YW5jZSh2ZWMzKHBvcy54LCBwb3MueSAtIEdSQURJRU5UX0VQU0lMT04sIHBvcy56KSksXG5cdFx0XHRcdGRpc3RhbmNlKHZlYzMocG9zLngsIHBvcy55LCBwb3MueiArIEdSQURJRU5UX0VQU0lMT04pKSAtIGRpc3RhbmNlKHZlYzMocG9zLngsIHBvcy55LCBwb3MueiAtIEdSQURJRU5UX0VQU0lMT04pKVxuXHRcdFx0KSk7XG5cdFx0fVxuXHRcdGA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsO1xuIiwiY29uc3QgbGlnaHRzID0gKHNjZW5lKSA9PiB7XG5cdGxldCByZXN1bHQgPSBzY2VuZS5saWdodHMubWFwKGxpZ2h0ID0+IHtcblx0XHRyZXR1cm4gbGlnaHQuZ2xzbC5yZXBsYWNlKCd2ZWMzIG1haW4nLCAndmVjMyBsaWdodF8nICsgbGlnaHQuaWQpLnJlcGxhY2UoL3RoaXMuL2csIGBfbCR7bGlnaHQuaWR9X2ApO1xuXHR9KS5qb2luKCcnKTtcblx0cmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGlnaHRzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAgYFxuXHR2ZWMzIGNvbG9yKHZlYzIgZnJhZ0Nvb3JkKSB7XG5cdFx0dmVjMyB1ID0gY29zKGNhbWVyYVJvdGF0aW9uKSAqIHZlYzMoMS4wLCAwLjAsIDAuMCkgKyBzaW4oY2FtZXJhUm90YXRpb24pICogdmVjMygwLjAsIDEuMCwgMC4wKTtcblx0XHR2ZWMzIHYgPSBjb3MoY2FtZXJhUm90YXRpb24pICogdmVjMygwLjAsIDEuMCwgMC4wKSAtIHNpbihjYW1lcmFSb3RhdGlvbikgKiB2ZWMzKDEuMCwgMC4wLCAwLjApO1xuXHRcdHZlYzMgbmNkID0gbm9ybWFsaXplKGNhbWVyYURpcmVjdGlvbik7XG5cdFx0dSA9IGFwcGx5UXVhdChxdWF0RnJvbVVuaXRWZWN0b3JzKHZlYzMoMC4wLCAwLjAsIDEuMCksIG5jZCksIHUpO1xuXHRcdHYgPSBhcHBseVF1YXQocXVhdEZyb21Vbml0VmVjdG9ycyh2ZWMzKDAuMCwgMC4wLCAxLjApLCBuY2QpLCB2KTtcblx0XHRmbG9hdCBzY2FsZSA9IDEuMDtcblx0XHR2ZWMzIHogPSAoMC41KnNjYWxlL3RhbihjYW1lcmFGb3YqMC41KSkgKiBuY2Q7XG5cdFx0dmVjMyByYXlQb3NpdGlvbiA9IGNhbWVyYVBvc2l0aW9uXG5cdFx0XHQrIHNjYWxlICogMi4wICogKGZyYWdDb29yZC54IC0gd2lkdGgvMi4wKSAqIHUgLyBoZWlnaHRcblx0XHRcdCsgc2NhbGUgKiAyLjAgKiAoZnJhZ0Nvb3JkLnkgLSBoZWlnaHQvMi4wKSAgKiB2IC8gaGVpZ2h0XG5cdFx0XHQrIHo7XG5cdFx0dmVjMyByYXlEaXJlY3Rpb24gPSBub3JtYWxpemUocmF5UG9zaXRpb24gLSBjYW1lcmFQb3NpdGlvbik7XG5cdFx0cmV0dXJuIHNoYWRlKHJheW1hcmNoKHJheVBvc2l0aW9uLCByYXlEaXJlY3Rpb24pKTtcblx0fVxuXHR2b2lkIG1haW4oKSB7XG5cdFx0dmVjMyBjID0gY29sb3IoZ2xfRnJhZ0Nvb3JkLnh5KTtcblx0XHRnbF9GcmFnQ29sb3IgPSB2ZWM0KGMsIDEuMCk7XG5cdH1cbmA7XG4iLCJjb25zdCBvYmplY3RzID0gKHNjZW5lKSA9PiB7XG5cdGxldCByZXN1bHQgPSBzY2VuZS5tZXNoZXMubWFwKG1lc2ggPT4ge1xuXHRcdHJldHVybiBtZXNoLmdlb21ldHJ5Lmdsc2wucmVwbGFjZSgnZmxvYXQgbWFpbicsICdmbG9hdCBzZGlzdF8nICsgbWVzaC5pZCkucmVwbGFjZSgvdGhpcy4vZywgYF9vJHttZXNoLmlkfV9gKVxuXHRcdFx0KyBtZXNoLm1hdGVyaWFsLmdsc2wucmVwbGFjZSgnbWF0ZXJpYWwgbWFpbicsICdtYXRlcmlhbCBzaGFkZV8nICsgbWVzaC5pZCkucmVwbGFjZSgvdGhpcy4vZywgYF9vJHttZXNoLmlkfV9gKVxuXHRcdFx0KyBgXG5cdFx0XHRcdG1lc2ggbWVzaF8ke21lc2guaWR9KHZlYzMgcG9zKSB7XG5cdFx0XHRcdFx0bWVzaCByZXN1bHQ7XG5cdFx0XHRcdFx0cmVzdWx0LmRpc3RhbmNlID0gc2Rpc3RfJHttZXNoLmlkfShwb3MpO1xuXHRcdFx0XHRcdHJlc3VsdC5pZCA9ICR7bWVzaC5pZH0uMDtcblx0XHRcdFx0XHQvLyBub3RlOiA1LjAgZmFjdG9yIGJlY2F1c2Ugb2Ygc2RmIHNtb290aGluZ1xuXHRcdFx0XHRcdC8vIHRvZG86IGRvIHNvbWV0aGluZyBhYm91dCB0aGF0IHNoaXRcblx0XHRcdFx0XHRpZiAocmVzdWx0LmRpc3RhbmNlIDwgNS4wICogUkFZTUFSQ0hfRVBTSUxPTikge1xuXHRcdFx0XHRcdFx0bWF0ZXJpYWwgbWF0ID0gc2hhZGVfJHttZXNoLmlkfShwb3MpO1xuXHRcdFx0XHRcdFx0cmVzdWx0LmNvbG9yID0gbWF0LmNvbG9yO1xuXHRcdFx0XHRcdFx0cmVzdWx0LnJlZmxlY3Rpdml0eSA9IG1hdC5yZWZsZWN0aXZpdHk7XG5cdFx0XHRcdFx0XHRyZXN1bHQudHJhbnNwYXJlbmN5ID0gbWF0LnRyYW5zcGFyZW5jeTtcblx0XHRcdFx0XHRcdHJlc3VsdC5zY2F0dGVyaW5nID0gbWF0LnNjYXR0ZXJpbmc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblx0XHRcdGA7XG5cdH0pLmpvaW4oJycpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBgXG5cdHByZWNpc2lvbiBoaWdocCBmbG9hdDtcbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gYFxuXHRtYXJjaCByYXltYXJjaCh2ZWMzIHJheVBvc2l0aW9uLCB2ZWMzIHJheURpcmVjdGlvbikge1xuXHRcdGZsb2F0IHRkID0gMC4wO1xuXHRcdHZlYzMgcG9zID0gcmF5UG9zaXRpb247XG5cdFx0dmVjMyBkaXIgPSByYXlEaXJlY3Rpb247XG5cdFx0ZmxvYXQgaGl0ID0gMC4wO1xuXHRcdGludCBpdGVyYXRpb25zID0gMDtcblx0XHRmbG9hdCBzaGFkb3cgPSAxLjA7XG5cdFx0ZmxvYXQgc3MgPSAyMC4wO1xuXHRcdGZvciAoaW50IGkgPSAwOyBpIDwgU1RFUFM7IGkrKykge1xuXHRcdFx0Ly8gRGlzdGFuY2UgZXN0aW1hdGlvblxuXHRcdFx0ZmxvYXQgZCA9IGRpc3RhbmNlKHBvcyk7XG5cdFx0XHRpZiAoZCA8IFJBWU1BUkNIX0VQU0lMT04pIHtcblx0XHRcdFx0aGl0ID0gMS4wO1xuXHRcdFx0XHRzaGFkb3cgPSAwLjA7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0c2hhZG93ID0gbWluKHNoYWRvdywgc3MgKiBkIC8gdGQpO1xuXHRcdFx0dGQgKz0gZDtcblx0XHRcdHBvcyA9IHBvcyArIGRpcipkO1xuXHRcdFx0aXRlcmF0aW9ucysrO1xuXHRcdH1cblx0XHRtYXJjaCByZXN1bHQ7XG5cdFx0cmVzdWx0Lml0ZXJhdGlvbnMgPSBpdGVyYXRpb25zO1xuXHRcdHJlc3VsdC5kaXN0YW5jZSA9IHRkO1xuXHRcdHJlc3VsdC5wb3NpdGlvbiA9IHBvcztcblx0XHRyZXN1bHQuZGlyZWN0aW9uID0gZGlyO1xuXHRcdHJlc3VsdC5zaGFkb3cgPSBzaGFkb3c7XG5cdFx0cmVzdWx0LmhpdCA9IGhpdDtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5gO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBgXG5cdHZlYzMgc2hhZGUobWFyY2ggcmVzdWx0KSB7XG5cdFx0bWVzaCBtID0gZ2xvYmFsKHJlc3VsdC5wb3NpdGlvbik7XG5cdFx0dmVjMyBuID0gbm9ybWFsKHJlc3VsdC5wb3NpdGlvbik7XG5cdFx0dmVjMyBkaWZmdXNlQ29sb3IgPSBtLmNvbG9yO1xuXHRcdHZlYzMgc3BlY3VsYXJDb2xvciA9IHZlYzMoMSk7XG5cdFx0dmVjMyBsaWdodERpcmVjdGlvbiA9IG5vcm1hbGl6ZSh2ZWMzKDAsIDEsIC0wLjUpKTsgLy8gVG9kbzogdW5pZm9ybVxuXHRcdHZlYzMgaCA9IG5vcm1hbGl6ZShsaWdodERpcmVjdGlvbiAtIG5vcm1hbGl6ZShyZXN1bHQucG9zaXRpb24pKTtcblx0XHRmbG9hdCBkaWZmdXNlUmF0aW8gPSAwLjg1O1xuXHRcdGZsb2F0IHNoaW5pbmVzcyA9IDEwLjA7XG5cdFx0ZmxvYXQgb2NjbHVzaW9uID0gMS4wIC0gZmxvYXQocmVzdWx0Lml0ZXJhdGlvbnMpIC8gZmxvYXQoU1RFUFMpO1xuXHRcdG1hcmNoIHNtID0gcmF5bWFyY2gocmVzdWx0LnBvc2l0aW9uICsgbiAqIFNIQURPV19FUFNJTE9OLCBsaWdodERpcmVjdGlvbik7XG5cdFx0ZmxvYXQgZm9nID0gZXhwKC0wLjAwMDUgKiByZXN1bHQuZGlzdGFuY2UpO1xuXHRcdGZsb2F0IGVudkFtYmllbmNlID0gMC4xO1xuXHRcdGZsb2F0IGRpZmZ1c2VBbWJpZW5jZSA9IDAuMTtcblx0XHRyZXR1cm4gdmVjMygwKSAqICgxLjAgLSBmb2cpICsgbWF4KGVudkFtYmllbmNlLCBmb2cgKiBvY2NsdXNpb24gKiBzbS5zaGFkb3cpICogcmVzdWx0LmhpdCAqIChcblx0XHRcdCgxLjAgLSBkaWZmdXNlQW1iaWVuY2UpICogZGlmZnVzZVJhdGlvICogZGlmZnVzZUNvbG9yICogbGlnaHRfMChyZXN1bHQucG9zaXRpb24sIG4pXG5cdFx0XHQrICgxLjAgLSBkaWZmdXNlUmF0aW8pICogcG93KG1heCgwLjAsIGRvdChuLCBoKSksIHNoaW5pbmVzcylcblx0XHRcdCsgZGlmZnVzZUFtYmllbmNlICogZGlmZnVzZUNvbG9yXG5cdFx0KTtcblx0fVxuYDtcbiIsIm1vZHVsZS5leHBvcnRzID0gYFxuXHRzdHJ1Y3QgbWVzaCB7XG5cdFx0ZmxvYXQgZGlzdGFuY2U7XG5cdFx0dmVjMyBjb2xvcjtcblx0XHRmbG9hdCBpZDtcblx0XHRmbG9hdCB0cmFuc3BhcmVuY3k7XG5cdFx0ZmxvYXQgcmVmbGVjdGl2aXR5O1xuXHRcdGZsb2F0IHNjYXR0ZXJpbmc7XG5cdH0gTWVzaDtcblx0c3RydWN0IG1hdGVyaWFsIHtcblx0XHR2ZWMzIGNvbG9yO1xuXHRcdGZsb2F0IHRyYW5zcGFyZW5jeTtcblx0XHRmbG9hdCByZWZsZWN0aXZpdHk7XG5cdFx0ZmxvYXQgc2NhdHRlcmluZztcblx0fTtcblx0c3RydWN0IG1hcmNoIHtcbiAgICBpbnQgaXRlcmF0aW9ucztcbiAgICBmbG9hdCBkaXN0YW5jZTtcbiAgICB2ZWMzIHBvc2l0aW9uO1xuICAgIHZlYzMgZGlyZWN0aW9uO1xuICAgIGZsb2F0IHNoYWRvdztcbiAgICBmbG9hdCBoaXQ7XG4gIH07XG5gO1xuIiwiY29uc3QgdW5pZm9ybXMgPSAoc2NlbmUpID0+IHtcblx0bGV0IHJlc3VsdCA9IGBcblx0XHR1bmlmb3JtIGZsb2F0IHdpZHRoO1xuXHRcdHVuaWZvcm0gZmxvYXQgaGVpZ2h0O1xuXHRcdHVuaWZvcm0gZmxvYXQgdGltZTtcblx0XHR1bmlmb3JtIHZlYzMgY2FtZXJhUG9zaXRpb247XG5cdFx0dW5pZm9ybSB2ZWMzIGNhbWVyYURpcmVjdGlvbjtcblx0XHR1bmlmb3JtIGZsb2F0IGNhbWVyYVJvdGF0aW9uO1xuXHRcdHVuaWZvcm0gZmxvYXQgY2FtZXJhRm92O1xuXHRgO1xuXHRzY2VuZS5tZXNoZXMuZm9yRWFjaChtZXNoID0+IHtcblx0XHRyZXN1bHQgKz0gYHVuaWZvcm0gdmVjMyBfbyR7bWVzaC5pZH1fcG9zaXRpb247XFxuYDtcblx0XHRPYmplY3Qua2V5cyhtZXNoLmdlb21ldHJ5LnVuaWZvcm1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRyZXN1bHQgKz0gYHVuaWZvcm0gJHttZXNoLmdlb21ldHJ5LnVuaWZvcm1zW2tleV0udHlwZX0gX28ke21lc2guaWR9XyR7a2V5fTtcXG5gO1xuXHRcdH0pO1xuXHRcdE9iamVjdC5rZXlzKG1lc2gubWF0ZXJpYWwudW5pZm9ybXMpLmZvckVhY2goa2V5ID0+IHtcblx0XHRcdHJlc3VsdCArPSBgdW5pZm9ybSAke21lc2gubWF0ZXJpYWwudW5pZm9ybXNba2V5XS50eXBlfSBfbyR7bWVzaC5pZH1fJHtrZXl9O1xcbmA7XG5cdFx0fSk7XG5cdH0pO1xuXHRzY2VuZS5saWdodHMuZm9yRWFjaChsaWdodCA9PiB7XG5cdFx0cmVzdWx0ICs9IGB1bmlmb3JtIHZlYzMgX2wke2xpZ2h0LmlkfV9wb3NpdGlvbjtcXG5gO1xuXHRcdE9iamVjdC5rZXlzKGxpZ2h0LnVuaWZvcm1zKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRyZXN1bHQgKz0gYHVuaWZvcm0gJHtsaWdodC51bmlmb3Jtc1trZXldLnR5cGV9IF9sJHtsaWdodC5pZH1fJHtrZXl9O1xcbmA7XG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmlmb3JtcztcbiIsIm1vZHVsZS5leHBvcnRzID0gYFxuXHRmbG9hdCBzbWluKGZsb2F0IGEsIGZsb2F0IGIpIHtcblx0XHRmbG9hdCBrID0gMS4wO1xuICAgIGZsb2F0IGggPSBtYXgoIGstYWJzKGEtYiksIDAuMCApL2s7XG4gICAgcmV0dXJuIG1pbiggYSwgYiApIC0gaCpoKmgqayooMS4wLzYuMCk7XG5cdH1cblx0ZmxvYXQgd2hlbl9lcShmbG9hdCB4LCBmbG9hdCB5KSB7XG5cdFx0XHRyZXR1cm4gMS4wIC0gYWJzKHNpZ24oeCAtIHkpKTtcblx0fVxuXHRmbG9hdCB3aGVuX25lcShmbG9hdCB4LCBmbG9hdCB5KSB7XG5cdFx0cmV0dXJuIGFicyhzaWduKHggLSB5KSk7XG5cdH1cblx0ZmxvYXQgd2hlbl9ndChmbG9hdCB4LCBmbG9hdCB5KSB7XG5cdFx0cmV0dXJuIG1heChzaWduKHggLSB5KSwgMC4wKTtcblx0fVxuXHRmbG9hdCB3aGVuX2x0KGZsb2F0IHgsIGZsb2F0IHkpIHtcblx0XHRyZXR1cm4gbWF4KHNpZ24oeSAtIHgpLCAwLjApO1xuXHR9XG5cdGZsb2F0IHdoZW5fZ2UoZmxvYXQgeCwgZmxvYXQgeSkge1xuXHRcdHJldHVybiAxLjAgLSB3aGVuX2x0KHgsIHkpO1xuXHR9XG5cdGZsb2F0IHdoZW5fbGUoZmxvYXQgeCwgZmxvYXQgeSkge1xuXHRcdHJldHVybiAxLjAgLSB3aGVuX2d0KHgsIHkpO1xuXHR9XG5cdG1lc2ggbW1pbihtZXNoIGEsIG1lc2ggYikge1xuXHRcdG1lc2ggcmVzdWx0O1xuXHRcdGZsb2F0IGNhID0gd2hlbl9sdChhLmRpc3RhbmNlLCBiLmRpc3RhbmNlKTtcblx0XHRmbG9hdCBjYiA9IDEuMCAtIGNhO1xuXHRcdHJlc3VsdC5kaXN0YW5jZSA9IGNhICogYS5kaXN0YW5jZSArIGNiICogYi5kaXN0YW5jZTtcblx0XHRyZXN1bHQuY29sb3IgPSBjYSAqIGEuY29sb3IgKyBjYiAqIGIuY29sb3I7XG5cdFx0cmVzdWx0LnJlZmxlY3Rpdml0eSA9IGNhICogYS5yZWZsZWN0aXZpdHkgKyBjYiAqIGIucmVmbGVjdGl2aXR5O1xuXHRcdHJlc3VsdC50cmFuc3BhcmVuY3kgPSBjYSAqIGEudHJhbnNwYXJlbmN5ICsgY2IgKiBiLnRyYW5zcGFyZW5jeTtcblx0XHRyZXN1bHQuc2NhdHRlcmluZyA9IGNhICogYS5zY2F0dGVyaW5nICsgY2IgKiBiLnNjYXR0ZXJpbmc7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXHR2ZWM0IHF1YXRGcm9tQXhpc0FuZ2xlKGZsb2F0IGFuZ2xlLCB2ZWMzIGF4aXMpIHtcblx0XHRmbG9hdCBoYWxmX3NpbiA9IHNpbigwLjUgKiBhbmdsZSk7XG5cdFx0ZmxvYXQgaGFsZl9jb3MgPSBjb3MoMC41ICogYW5nbGUpO1xuXHRcdHJldHVybiB2ZWM0KGhhbGZfc2luICogYXhpcy54LFxuXHRcdFx0XHRcdGhhbGZfc2luICogYXhpcy55LFxuXHRcdFx0XHRcdGhhbGZfc2luICogYXhpcy56LFxuXHRcdFx0XHRcdGhhbGZfY29zKTtcblx0fVxuXHR2ZWM0IHF1YXRGcm9tVW5pdFZlY3RvcnModmVjMyB1LCB2ZWMzIHYpIHtcblx0XHR2ZWMzIHcgPSBjcm9zcyh1LCB2KTtcblx0XHR2ZWM0IHEgPSB2ZWM0KHcueCwgdy55LCB3LnosIDEuMCArIGRvdCh1LCB2KSk7XG5cdFx0cmV0dXJuIG5vcm1hbGl6ZShxKTtcblx0fVxuXHR2ZWM0IG11bHRRdWF0cyh2ZWM0IHEsIHZlYzQgcCkge1xuXHRcdHJldHVybiB2ZWM0KFxuXHRcdFx0dmVjMyhxLncgKiBwLnh5eiArIHAudyAqIHEueHl6ICsgY3Jvc3MocS54eXosIHAueHl6KSksXG5cdFx0XHRxLncgKiBwLncgLSBkb3QocS54eXosIHAueHl6KVxuXHRcdCk7XG5cdH1cblx0dmVjMyBhcHBseVF1YXQodmVjNCBxLCB2ZWMzIHYpIHtcblx0XHRyZXR1cm4gbXVsdFF1YXRzKHEsIG11bHRRdWF0cyh2ZWM0KHYsIDEuMCksIHZlYzQodmVjMygtcS54eXopLCBxLncpKSkueHl6O1xuXHR9XG5gO1xuIiwiY29uc3QgTGlnaHQgPSByZXF1aXJlKCcuLi9MaWdodC5qcycpO1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEaXJlY3Rpb25hbExpZ2h0IGV4dGVuZHMgTGlnaHQge1xuXHRjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcblx0XHRjb25zdCB1bmlmb3JtcyA9IHtcblx0XHRcdGludGVuc2l0eToge1xuXHRcdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0XHR2YWx1ZTogb3B0cy5pbnRlbnNpdHkgPT09IHVuZGVmaW5lZCA/IDEuMCA6IG9wdHMuaW50ZW5zaXR5XG5cdFx0XHR9LFxuXHRcdFx0Y29sb3I6IHtcblx0XHRcdFx0dHlwZTogJ3ZlYzMnLFxuXHRcdFx0XHR2YWx1ZTogb3B0cy5jb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IFJBWS5WZWMzKDEuMCwgMS4wLCAxLjApIDogb3B0cy5jb2xvclxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3QgZ2xzbCA9IGBcblx0XHRcdHZlYzMgbWFpbih2ZWMzIHBvcywgdmVjMyBub3JtYWwpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29sb3IgKiB0aGlzLmludGVuc2l0eTtcblx0XHRcdH1cblx0XHRgO1xuXHRcdHN1cGVyKHVuaWZvcm1zLCBnbHNsKTtcblx0fVxufVxuIiwiY29uc3QgTGlnaHQgPSByZXF1aXJlKCcuLi9MaWdodC5qcycpO1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEaXJlY3Rpb25hbExpZ2h0IGV4dGVuZHMgTGlnaHQge1xuXHRjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcblx0XHRjb25zdCB1bmlmb3JtcyA9IHtcblx0XHRcdGludGVuc2l0eToge1xuXHRcdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0XHR2YWx1ZTogb3B0cy5pbnRlbnNpdHkgPT09IHVuZGVmaW5lZCA/IDEuMCA6IG9wdHMuaW50ZW5zaXR5XG5cdFx0XHR9LFxuXHRcdFx0Y29sb3I6IHtcblx0XHRcdFx0dHlwZTogJ3ZlYzMnLFxuXHRcdFx0XHR2YWx1ZTogb3B0cy5jb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IFJBWS5WZWMzKDEuMCwgMS4wLCAxLjApIDogb3B0cy5jb2xvclxuXHRcdFx0fSxcblx0XHRcdGZhbGxvZmY6IHtcblx0XHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdFx0dmFsdWU6IG9wdHMuZmFsbG9mZiA9PT0gdW5kZWZpbmVkID8gMi4wIDogb3B0cy5mYWxsb2ZmXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRjb25zdCBnbHNsID0gYFxuXHRcdFx0dmVjMyBtYWluKHZlYzMgcG9zLCB2ZWMzIG5vcm1hbCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb2xvciAqIG1heCgwLjAsIGRvdChub3JtYWwsIHZlYzMoMC4wLCAxLjAsIC0wLjUpKSk7XG5cdFx0XHR9XG5cdFx0YDtcblx0XHRzdXBlcih1bmlmb3JtcywgZ2xzbCk7XG5cdH1cbn1cbiIsImNvbnN0IE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vTWF0ZXJpYWwuanMnKTtcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFzaWNNYXRlcmlhbCBleHRlbmRzIE1hdGVyaWFsIHtcblx0Y29uc3RydWN0b3Ioe1xuXHRcdGNvbG9yID0gbmV3IFJBWS5WZWMzKDEuMCwgMS4wLCAxLjApLFxuXHRcdHJlZmxlY3Rpdml0eSA9IDAuMCxcblx0XHR0cmFuc3BhcmVuY3kgPSAwLjAsXG5cdFx0c2NhdHRlcmluZyA9IDAuMFxuXHR9ID0ge30pIHtcblx0XHRjb25zdCB1bmlmb3JtcyA9IHtcblx0XHRcdGNvbG9yOiB7XG5cdFx0XHRcdHR5cGU6ICd2ZWMzJyxcblx0XHRcdFx0dmFsdWU6IGNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0cmVmbGVjdGl2aXR5OiB7XG5cdFx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRcdHZhbHVlOiByZWZsZWN0aXZpdHlcblx0XHRcdH0sXG5cdFx0XHR0cmFuc3BhcmVuY3k6IHtcblx0XHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdFx0dmFsdWU6IHRyYW5zcGFyZW5jeVxuXHRcdFx0fSxcblx0XHRcdHNjYXR0ZXJpbmc6IHtcblx0XHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdFx0dmFsdWU6IHNjYXR0ZXJpbmdcblx0XHRcdH1cblx0XHR9O1xuXHRcdGNvbnN0IGdsc2wgPSBgXG5cdFx0XHRtYXRlcmlhbCBtYWluKHZlYzMgcG9zKSB7XG5cdFx0XHRcdG1hdGVyaWFsIGJhc2ljTWF0ZXJpYWw7XG5cdFx0XHRcdGJhc2ljTWF0ZXJpYWwuY29sb3IgPSB0aGlzLmNvbG9yO1xuXHRcdFx0XHRiYXNpY01hdGVyaWFsLnJlZmxlY3Rpdml0eSA9IHRoaXMucmVmbGVjdGl2aXR5O1xuXHRcdFx0XHRiYXNpY01hdGVyaWFsLnRyYW5zcGFyZW5jeSA9IHRoaXMudHJhbnNwYXJlbmN5O1xuXHRcdFx0XHRiYXNpY01hdGVyaWFsLnNjYXR0ZXJpbmcgPSB0aGlzLnNjYXR0ZXJpbmc7XG5cdFx0XHRcdHJldHVybiBiYXNpY01hdGVyaWFsO1xuXHRcdFx0fVxuXHRcdGA7XG5cdFx0c3VwZXIodW5pZm9ybXMsIGdsc2wpO1xuXHR9XG59XG4iLCJjb25zdCBNYXRlcmlhbCA9IHJlcXVpcmUoJy4uL01hdGVyaWFsLmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENoZWNrZXJib2FyZE1hdGVyaWFsIGV4dGVuZHMgTWF0ZXJpYWwge1xuXHRjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcblx0XHRjb25zdCB1bmlmb3JtcyA9IHt9O1xuXHRcdGNvbnN0IGdsc2wgPSBgXG5cdFx0XHRtYXRlcmlhbCBtYWluKHZlYzMgcG9zKSB7XG5cdFx0XHRcdG1hdGVyaWFsIG1hdDtcblx0XHRcdFx0bWF0LnJlZmxlY3Rpdml0eSA9IDAuMDtcblx0XHRcdFx0ZmxvYXQgc2NhbGUgPSAwLjAwNTtcblx0XHRcdFx0aWYgKG1vZChwb3MueCpzY2FsZSwgMS4wKSA8IDAuNSAmJiBtb2QocG9zLnoqc2NhbGUsIDEuMCkgPCAwLjVcblx0XHRcdFx0XHR8fCBtb2QocG9zLngqc2NhbGUsIDEuMCkgPiAwLjUgJiYgbW9kKHBvcy56KnNjYWxlLCAxLjApID4gMC41KSB7XG5cdFx0XHRcdFx0bWF0LmNvbG9yID0gdmVjMygwLjgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1hdC5jb2xvciA9IHZlYzMoMC4yKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbWF0O1xuXHRcdFx0fVxuXHRcdGA7XG5cdFx0c3VwZXIodW5pZm9ybXMsIGdsc2wpO1xuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFZlYzMge1xuXHRjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHogPSAwKSB7XG5cdFx0dGhpcy54ID0geDsgdGhpcy55ID0geTsgdGhpcy56ID0gejtcblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBWZWM0IHtcblx0Y29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB6ID0gMCwgdyA9IDApIHtcblx0XHR0aGlzLnggPSB4OyB0aGlzLnkgPSB5OyB0aGlzLnogPSB6OyB0aGlzLncgPSAwO1xuXHR9XG59XG4iXX0=
