<template>
<div id="game">
  <Interface/>
  <canvas id="renderCanvas"></canvas>
</div>
</template>

<script>
import '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Loading/loadingScreen';
import '@babylonjs/core/Culling/ray'
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { GridMaterial } from '@babylonjs/materials'
import { load, assets } from '@/Assets.js'
import { state, interpolate, collide } from '@/State.js'
import { INSTANCES, EXPLOSIONS } from '@/Constants.js'
import { setPayload } from '@/Network.js'
import Interface from '@/components/Interface';
export default {
    name: 'Game',
    data() { return { canvas: null } },
    mounted() {
        this.initialize();
    },
    beforeDestroy() {
        // state.engine.unRegisterView(document.getElementById("renderCanvas"));
        state.engine.stopRenderLoop();
        state.engine.dispose();
    },
    components: { Interface },
    methods: {
        initialize() {
            const canvas = document.getElementById('renderCanvas');
            state.engine = new Engine(canvas);
            state.scene = new Scene(state.engine);
            state.scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            const y = 500;
            const s = 5.0;
            state.camera = new FreeCamera("camera1", new Vector3(-y, y, -y), state.scene);
            state.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
            const aspect = window.innerWidth / window.innerHeight;
            state.camera.orthoTop = state.cameraScale;
            state.camera.orthoBottom = -state.cameraScale;
            state.camera.orthoLeft = -state.cameraScale * aspect;
            state.camera.orthoRight = state.cameraScale * aspect;
            state.camera.setTarget(new Vector3(0, 0, 0));
            // camera.attachControl(this.canvas, true);
            const light = new HemisphericLight("light1", new Vector3(0, 1, 0), state.scene);
            light.intensity = 0.7;
            const material = new GridMaterial("grid", state.scene);
            const ground = Mesh.CreateGround("ground1", window.innerWidth, window.innerHeight, 0, state.scene);
            ground.isPickable = true;
            ground.material = material;
            this.handleEvents(ground);
            load(state.scene).then(() => {
                state.clientInitialized = true;
                this.render();
            });
        },
        render() {
            state.engine.runRenderLoop(() => {
                if (state.finished) return;
                interpolate(state.engine.getDeltaTime() / 1000.0);
                // collide(state.engine.getDeltaTime() / 1000.0);
                state.scene.render();
                // Uniforms
                const startTimes = [];
                for (let i = 0; i < EXPLOSIONS["xplLaser"]; i++) {
                    const cInstance = state.collisionInstances["xplLaser"][i];
                    if (cInstance === undefined) {
                        startTimes[i*2 + 0] = 0;
                        startTimes[i*2 + 1] = 0;
                    } else {
                        startTimes[i*2 + 0] = state.collisionInstances["xplLaser"][i].startTime;
                        startTimes[i*2 + 1] = state.collisionInstances["xplLaser"][i].expireTime;
                    }
                }
                state.collisionAssets.xplLaser.material.setArray2("startTimes", startTimes);
                state.collisionAssets.xplLaser.material.setFloat("time", state.sessionTime);
                state.renderTime += state.engine.getDeltaTime() / 1000.0;
                // Update dynamic UI elements
                Object.keys(state.assets).forEach(key => {
                    if (state.assets[key] === null || state.assets[key].isProjectile) return;
                    for (let i = 0; i < INSTANCES[key]; i++) {
                        if (state.instances[key][i] === undefined || !state.instances[key][i].isEnabled()) {
                            document.getElementById("unit-bar-" + key + "-" + i).style.display = "none";
                            continue;
                        }
                        document.getElementById("unit-bar-" + key + "-" + i).style.display = "initial";
                        document.getElementById("unit-bar-" + key + "-" + i).style.left = state.instances[key][i].screenX + "px";
                        document.getElementById("unit-bar-" + key + "-" + i).style.top = state.instances[key][i].screenY + "px";
                        document.getElementById("unit-bar-hp-" + key + "-" + i).style.width = (60 * state.instances[key][i].health / 100.0).toFixed(2)+ "px";
                        const color = state.instances[key][i].side == 1 ? "#ff0088" : "#00aaff";
                        document.getElementById("unit-bar-" + key + "-" + i).style.background = color
                    }
                });
            });
        },
        handleEvents(ground) {
            const canvas = document.getElementById('renderCanvas');
            canvas.addEventListener("click", (event) => {
                if (state.selectedUnit === null) return;
                let p = state.scene.pick(state.scene.pointerX, state.scene.pointerY);
                const pl = {
                    eventId: "mouseup",
                    name: state.selectedUnit,
                    x: p.pickedPoint.x, y: p.pickedPoint.y + 1, z: p.pickedPoint.z
                };
                setPayload(pl);
                state.selectedUnit = null;
                state.selectedUnitIndex = null;
            });
            window.onresize = () => {
                const aspect = window.innerWidth / window.innerHeight;
                state.camera.orthoTop = state.cameraScale;
                state.camera.orthoBottom = -state.cameraScale;
                state.camera.orthoLeft = -state.cameraScale * aspect;
                state.camera.orthoRight = state.cameraScale * aspect;
            };
            window.addEventListener('wheel', function(e) {
                if (e.wheelDelta > 0) state.cameraScale -= state.cameraZoomSpeed;
                else state.cameraScale += state.cameraZoomSpeed;
                const aspect = window.innerWidth / window.innerHeight;
                state.camera.orthoTop = state.cameraScale;
                state.camera.orthoBottom = -state.cameraScale;
                state.camera.orthoLeft = -state.cameraScale * aspect;
                state.camera.orthoRight = state.cameraScale * aspect;
            });
            let startingPoint = null;
            const getGroundPosition = () => {
                var pickinfo = state.scene.pick(state.scene.pointerX, state.scene.pointerY, function (mesh) { return mesh == ground; });
                if (pickinfo.hit) return pickinfo.pickedPoint;
                return null;
            }
            const pointerDown = () => {
                startingPoint = getGroundPosition();
            }
            const pointerUp = () => {
                startingPoint = null;
            }
            const pointerMove = () => {
                const moveSpeed = 0.66;
                if (!startingPoint)  return;
                const current = getGroundPosition();
                if (!current) return;
                const diff = current.subtract(startingPoint).scaleInPlace(-moveSpeed);
                state.camera.position.addInPlace(diff);
                startingPoint = current;
            }
            state.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    pointerDown()
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    pointerUp();
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    pointerMove();
                    break;
                }
            });
        }
    }
}
</script>

<style scoped>
#game {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
}
#renderCanvas {
    width: 100%;
    height: 100%;
    display: block;
    font-size: 0;
    z-index: 1;
}
</style>
