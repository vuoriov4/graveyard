import Vue from 'vue'
import { INSTANCES, EXPLOSIONS } from '@/Constants.js'

let latestServerState = null;

const assetType = {
	UNIT: 0,
	PARTICLE: 1,
	EXPLOSION: 2
}

export const state = {
	engine: null,
	scene: null,
	camera: null,
	assets: {
		base: null,
		fighter: null,
		laser: null
	},
	instances: {
		base: [],
		fighter: [],
		laser: []
	},
	collisionAssets: {
		xplLaser: null
	},
	collisionInstances: {
		xplLaser: []
	},
	energyLoad: 0,
	selectedUnit: null,
	selectedUnitIndex: null,
	resolveTicks: 0,
	cameraScale: 10.0,
	cameraZoomSpeed: 1.0,
	finished: false,
	renderTime: 0.0,
	sessionTime: 0.0,
	playerEnergy: 0.0
}

export const resolve = (serverState, networkDelay) => {
	state.finished = serverState.finished;
	state.sessionTime = serverState.time;
	state.playerEnergy = serverState.player.energy;
	state.energyLoad = (state.playerEnergy % 1) * 250;
	// Resolve units
	let instanceIndices = {};
	const resolveUnit = (unit) => {
		let ln = unit.name.toLowerCase();
		if (ln in instanceIndices) instanceIndices[ln] += 1;
		else instanceIndices[ln] = 0;
		if (instanceIndices[ln] >= state.instances[ln].length) { /*console.warn("Instance overflow");*/ return; }
		const instance = state.instances[ln][instanceIndices[ln]];
		instance.setEnabled(true); // performance?
		// Stats
		instance.health = unit.health;
		instance.radius = unit.radius;
		instance.side = unit.side;
		// Position
		const positionError = Math.sqrt(
			(unit.position[0] - instance.position.x) * (unit.position[0] - instance.position.x) +
			(unit.position[1] - instance.position.y) * (unit.position[1] - instance.position.y) +
			(unit.position[2] - instance.position.z) * (unit.position[2] - instance.position.z));
		const errorRatio = 0.9;
		if (false && state.resolveTicks > 0 && positionError < 2.5) {
			instance.position.x = (errorRatio) * instance.position.x + (1 - errorRatio) * unit.position[0];
			instance.position.y = (errorRatio) * instance.position.y + (1 - errorRatio) * unit.position[1];
			instance.position.z = (errorRatio) * instance.position.z + (1 - errorRatio) * unit.position[2];
		} else {
			instance.position.x = unit.position[0];
			instance.position.y = unit.position[1];
			instance.position.z = unit.position[2];
		}
		// Velocity
		instance.velocity[0] = unit.velocity[0];
		instance.velocity[1] = unit.velocity[1];
		instance.velocity[2] = unit.velocity[2];
		const forward = (new BABYLON.Vector3(unit.velocity[0], unit.velocity[1], unit.velocity[2])).normalize();
		if (forward.lengthSquared() === 0) return;
		const up = BABYLON.Vector3.Up();
		const right = BABYLON.Vector3.Cross(forward, up);
		instance.rotation = BABYLON.Vector3.RotationFromAxis(forward, up, right);
		// Screen coords
		if (!state.assets[ln].isProjectile) {
			const screenCoords = getScreenCoordinates(instance);
			instance.screenX = screenCoords.x;
			instance.screenY = screenCoords.y;
		}
	}
	traverse(serverState, resolveUnit);
	// Collisions
	let collisionIndices = {};
	serverState.collisions.forEach(coll => {
		let ln = coll.collisionType;
		if (ln in collisionIndices) collisionIndices[ln] += 1;
		else collisionIndices[ln] = 0;
		const instance = state.collisionInstances[ln][collisionIndices[ln]];
		instance.setEnabled(true); // performance?
		instance.position.x = coll.position[0];
		instance.position.y = coll.position[1];
		instance.position.z = coll.position[2];
		instance.startTime = coll.startTime;
		instance.expireTime = coll.expireTime;
	});
	// Disable unused instances
	Object.keys(instanceIndices).forEach(key => {
		for (let i = instanceIndices[key] + 1; i < INSTANCES[key]; i++) {
			if (state.instances[key][i] === undefined) {
				console.warn("Undefined instance");
				continue;
			}
			state.instances[key][i].setEnabled(false);
		}
	});
	Object.keys(collisionIndices).forEach(key => {
		for (let i = collisionIndices[key] + 1; i < EXPLOSIONS[key]; i++) {
			if (state.collisionInstances[key][i] === undefined) {
				console.warn("Undefined explosion");
				continue;
			}
			state.collisionInstances[key][i].setEnabled(false);
		}
	});
	latestServerState = serverState;
	state.resolveTicks++;
}

export const interpolate = (renderDelta) => {
	if (latestServerState === null) return;
	let instanceIndices = {};
	state.sessionTime += renderDelta;
	const interpolateUnit = (unit, i) => {
		let ln = unit.name.toLowerCase();
		if (ln in instanceIndices) instanceIndices[ln] += 1;
		else instanceIndices[ln] = 0;
		const instance = state.instances[ln][instanceIndices[ln]];
		if (instance.collided) return;
		// Position
		if (instanceIndices[ln] >= state.instances[ln].length) { /*console.warn("Instance overflow");*/ return; }
		if ('velocity' in instance) {
			instance.position.x += instance.velocity[0] * renderDelta;
			instance.position.y += instance.velocity[1] * renderDelta;
			instance.position.z += instance.velocity[2] * renderDelta;
		}
		// Screen coords
		if (!state.assets[ln].isProjectile) {
			const screenCoords = getScreenCoordinates(instance);
			instance.screenX = screenCoords.x;
			instance.screenY = screenCoords.y;
		}
	}
	traverse(latestServerState, interpolateUnit)
}

export const collide = (renderDelta) => {
	if (latestServerState === null) return;
	let instanceIndices = {};
	const collideUnit = (unit, i) => {
		let ln = unit.name.toLowerCase();
		if (ln in instanceIndices) instanceIndices[ln] += 1;
		else instanceIndices[ln] = 0;
		if (state.instanceMetaData[ln].isParticle) {
			const instance = state.instances[ln][instanceIndices[ln]];
			// Position
			Object.keys(state.instances).filter(key => { return !state.instanceMetaData[key].isParticle }).forEach(key => {
				state.instances[key].forEach((ins, i) => {
					const dd = (instance.position.x - ins.position.x) * (instance.position.x - ins.position.x)
						+ (instance.position.y - ins.position.y) * (instance.position.y - ins.position.y)
						+ (instance.position.z - ins.position.z) * (instance.position.z - ins.position.z);
					if (dd < (instance.radius + ins.radius) * (instance.radius + ins.radius)) {
						instance.setEnabled(false);
						instance.collided = true;
					}
				});
			});
		}
	}
	traverse(latestServerState, collideUnit)
}

const traverse = (s, callback) => {
	s.player.units.forEach(u => {
		callback(u);
		u.projectiles.forEach(p => callback(p));
	});
	s.opponent.units.forEach(u => {
		callback(u);
		u.projectiles.forEach(p => callback(p));
	});
}

const getScreenCoordinates = (instance) => {
    return BABYLON.Vector3.Project(
        // sphere.getAbsolutePosition(),
		instance.position,
        BABYLON.Matrix.IdentityReadOnly,
        state.scene.getTransformMatrix(),
        state.camera.viewport.toGlobal(
            state.engine.getRenderWidth(),
            state.engine.getRenderHeight(),
        ),
    );
}
