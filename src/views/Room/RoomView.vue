<template>
    <div>
        <div id="canvas"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

export default defineComponent({
    setup() {
        let mixers: any = []
        let meshList: any = [0,0]
        let camera: any = ""
        let controls: any = ""
        let renderer: any = ""
        let flag: string = "stop"
        let direction: string = "z"
        let angleFlag: boolean = true
        const scene = new THREE.Scene();
        const clock = new THREE.Clock();
        
        function loadRender() {
            const renderer_tmp = new THREE.WebGLRenderer({ alpha: false });
            renderer_tmp.setSize(window.innerWidth, window.innerHeight);
            renderer_tmp.outputColorSpace = THREE.SRGBColorSpace;
            renderer_tmp.shadowMap.enabled = true;
            renderer_tmp.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer = renderer_tmp
        }

        function createMesh(type: string) { // 模型
            if (type == '1') { // 方块
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const cube = new THREE.Mesh(geometry, material);
                scene.add(cube);
                return cube
            } else if (type == '2') { // 平面
                const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
                const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xbfbfbf, side: THREE.DoubleSide })
                const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.rotateX(Math.PI / 2)
                plane.receiveShadow = true;
                scene.add(plane);
                return plane
            }
        }

        function createPerspectiveCamera() { // 透视相机
            const camera_tmp = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera_tmp.rotation.order = 'YXZ';
            camera_tmp.position.set(4, 3, 5)
            camera = camera_tmp
        }

        function createOrbitControls() { // 控制器
            const controls_tmp = new OrbitControls(camera, renderer.domElement);
            controls_tmp.update();
            controls = controls_tmp
        }

        function createLight() { // 平行光
            const directionalLight = new THREE.DirectionalLight(0xffffd0, 2);
            directionalLight.position.set(10, 10, 8)
            directionalLight.castShadow = true;
            directionalLight.shadow.camera.far = 500;
            const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
            scene.add(directionalLight);
            scene.add(helper);
        }

        function loadMesh() {
            const loader = new GLTFLoader();
            loader.load(
                'a/namaqualand_boulder_02_1k.gltf',
                function (gltf) {
                    gltf.scene.traverse((obj) => {
                        obj.castShadow = true
                    })
                    scene.add(gltf.scene);
                    // gltf.animations; // Array<THREE.AnimationClip>
                    // gltf.scene; // THREE.Group
                    // gltf.scenes; // Array<THREE.Group>
                    // gltf.cameras; // Array<THREE.Camera>
                    // gltf.asset; // Object
                    meshList[1] = gltf.scene
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function () {
                    console.log('An error happened');
                }
            );
            loader.load(
                'didelta_spinosa_1k.gltf/didelta_spinosa_1k.gltf',
                function (gltf) {
                    gltf.scene.traverse((obj) => {
                        obj.castShadow = true
                    })
                    gltf.scene.position.x = 3
                    scene.add(gltf.scene);
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function () {
                    console.log('An error happened');
                }
            );
            loader.load(
                'namaqualand_boulder_04_1k.gltf/namaqualand_boulder_04_1k.gltf',
                function (gltf) {
                    gltf.scene.traverse((obj) => {
                        obj.castShadow = true
                    })
                    gltf.scene.position.x = 6
                    scene.add(gltf.scene);
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function () {
                    console.log('An error happened');
                }
            );
            loader.load(
                'wooden_table_02_1k.gltf/wooden_table_02_1k.gltf',
                function (gltf) {
                    gltf.scene.traverse((obj) => {
                        obj.castShadow = true
                    })
                    gltf.scene.position.z = 3
                    scene.add(gltf.scene);
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function () {
                    console.log('An error happened');
                }
            );
            loader.load(
                'street_lamp_01_2k.gltf/street_lamp_01_2k.gltf',
                function (gltf) {
                    gltf.scene.traverse((obj) => {
                        obj.castShadow = true
                    })
                    gltf.scene.position.z = 6
                    scene.add(gltf.scene);
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function () {
                    console.log('An error happened');
                }
            );
            loader.load('a/Xbot.glb', function (gltf) {
                gltf.scene.traverse((obj) => {
                    obj.castShadow = true
                })
                gltf.scene.position.z = 2
                const mixer1 = new THREE.AnimationMixer( gltf.scene )
                mixer1.timeScale = 0.7;
                mixer1.clipAction( gltf.animations[6] ).play()
                const mixer2 = new THREE.AnimationMixer( gltf.scene )
                mixer2.clipAction( gltf.animations[2] ).play()
                mixers.push(mixer1)
                mixers.push(mixer2)
                meshList[0] = gltf.scene
                scene.add(gltf.scene);
            });
        }

        function areObjectsTouching(objectA: any, objectB: any) { // 碰撞检测
            let aabb = new THREE.Box3().setFromObject(objectA);
            return aabb.intersectsBox(new THREE.Box3().setFromObject(objectB));
        }

        var rgbeLoader = new RGBELoader();
        rgbeLoader.load('qwantani_dusk_2_2k.hdr', function (texture: any) {
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            // 设备为背景（也可以用其他的的场景背景）
            scene.background = envMap;
            // 设为场景中所有物理材质的环境贴图
            scene.environment = envMap;
            texture.dispose();
            pmremGenerator.dispose();
        });

        function animate() {
            controls.update()
            const delta = clock.getDelta();
            if(mixers.length == 2) {
                if(flag == 'start') {
                    mixers[0].update( delta );
                    if(meshList[0]) {
                        switch(direction) {
                            case 'w': 
                                meshList[0].position.z += 0.014
                                camera.position.z += 0.014
                                break
                            case 's':
                                meshList[0].position.z -= 0.014
                                camera.position.z -= 0.014
                                break
                            case 'a':
                                meshList[0].position.x += 0.014
                                camera.position.x += 0.014
                                break
                            case 'd':
                                meshList[0].position.x -= 0.014
                                camera.position.x -= 0.014
                                break
                        }
                        camera.lookAt(meshList[0].position)
                    }
                }else if(flag == 'stop') {
                    mixers[1].update( delta );
                    camera.lookAt(meshList[0].position)
                }
            }
            renderer.render(scene, camera);
            renderer.setAnimationLoop( animate );
        }

        async function loadScene() {
            loadRender()
            createPerspectiveCamera()
            createOrbitControls()
            createMesh('2')
            createLight()
            loadMesh()
            animate();
        }

        loadScene()
        onMounted(() => {
            const canvas: any = document.getElementById('canvas')
            canvas.appendChild(renderer.domElement);
            window.onresize = function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
            document.onkeydown = function(event) {
                if(angleFlag) {
                    if(['w', 's', 'a', 'd'].includes(event.key)) {
                        flag = "start"
                    }
                    if(event.key == 'w') {
                        meshList[0].rotation.y = 0
                    }else if(event.key == 'a') {
                        meshList[0].rotation.y = Math.PI / 2
                    }else if(event.key == 's') {
                        meshList[0].rotation.y = Math.PI
                    }else if(event.key == 'd') {
                        meshList[0].rotation.y = (Math.PI * 3 )/ 2
                    }
                    direction = event.key
                    angleFlag = false
                }
            }
            document.onkeyup = function(event) {
                if(['w', 's', 'a', 'd'].includes(event.key)) {
                    flag = "stop"
                }
                angleFlag = true
            }
        })
        return {}
    }
})
</script>

<style scoped>
#canvas {
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>