module.exports = class Camera {
	constructor(opts = {}) {
		this.position = opts.position || new RAY.Vec3();
		this.direction = opts.direction || new RAY.Vec3(0, 0, 1);
		this.rotation = opts.rotation || 0.0;
		this.fov = opts.fov || Math.PI/3;
	}
	lookAt(position) {
		this.direction.x = position.x - this.position.x;
		this.direction.y = position.y - this.position.y;
		this.direction.z = position.z - this.position.z;
	}
}
