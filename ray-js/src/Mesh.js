import Vec3 from './math/Vec3.js';
module.exports = class Mesh {
	constructor(geometry, material) {
		this.id = RAY.objectId;
		RAY.objectId += 1;
		this.geometry = geometry;
		this.material = material;
		this.position = new Vec3();
	}
}
