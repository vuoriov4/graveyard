let sphere, line, renderer, scene, camera;

function init() {
	renderer = new RAY.Renderer();
	document.getElementById('ray').append(renderer.domElement);
	scene = new RAY.Scene();
	camera = new RAY.Camera({fov: Math.PI / 6});
	camera.position.x = 200;
	camera.position.y = 300;
	camera.position.z = -200;
	camera.direction.y = -0.5;
	camera.direction.z = 1.0;
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(0,100,100),
			b: new RAY.Vec3(0,250,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(1.0, 0.5, 0.5), reflectivity: 0.5})
	));
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(0,250,100),
			b: new RAY.Vec3(100,250,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(1.0, 0.5, 0.5), reflectivity: 0.5})
	));
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(100,250,100),
			b: new RAY.Vec3(50,175,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(1.0, 0.5, 0.5), reflectivity: 0.5})
	));
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(50,175,100),
			b: new RAY.Vec3(100,100,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(1.0, 0.5, 0.5), reflectivity: 0.5})
	));
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(150,100,100),
			b: new RAY.Vec3(225,250,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(0.5, 1.0, 0.5), reflectivity: 0.5})
	));
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(225,250,100),
			b: new RAY.Vec3(300,100,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(0.5, 1.0, 0.5), reflectivity: 0.5})
	));
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(375,100,100),
			b: new RAY.Vec3(375,175,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(0.5, 0.5, 1.0), reflectivity: 0.5})
	));
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(375,175,100),
			b: new RAY.Vec3(325,250,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(0.5, 0.5, 1.0), reflectivity: 0.5})
	));
	scene.add(new RAY.Mesh(
		new RAY.LineGeometry({
			thickness: 15,
			a: new RAY.Vec3(375,175,100),
			b: new RAY.Vec3(425,250,100)
		}),
		new RAY.BasicMaterial({color: new RAY.Vec3(0.5, 0.5, 1.0), reflectivity: 0.5})
	));
	// Checkerboard
	const plane = new RAY.Mesh(
		new RAY.PlaneGeometry(10.0, 10.0),
		new RAY.CheckerboardMaterial({})
	);
	plane.position.y = 80.0;
	scene.add(plane);
	// Light
	const directionalLight = new RAY.DirectionalLight({
		color: new RAY.Vec3(1.0, 1.0, 1.0),
		intensity: 1000.0,
		falloff: 1.0
	});
	directionalLight.position.z = 1;
	scene.add(directionalLight);
	const ambientLight = new RAY.AmbientLight({
		intensity: 0.5
	});
	scene.add(ambientLight);
	renderer.init(scene, camera);
}

function render() {
	renderer.render(scene, camera);
	camera.position.y -= 0.5;
	//requestAnimationFrame(render);
}

init();
render();
