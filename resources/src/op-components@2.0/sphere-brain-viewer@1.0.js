
riot.tag2('sphere-brain-viewer', '<div ref="container" class="viewer-webgl-container"></div> <div class="watermark"> <div class="text"> <div class="software">Brain connectivity viewer</div> <div class="institute">Biostatistics Group at KAUST</div> </div> <img src="./src/img/BK01.png"> </div>', 'sphere-brain-viewer .viewer-webgl-container,[data-is="sphere-brain-viewer"] .viewer-webgl-container{ position: absolute; top: 0; bottom: 0; left: 0; right: 0; z-index: 1000; background: radial-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url("./src/img/neurons.jpg"); background-size: cover; overflow: hidden; } sphere-brain-viewer .watermark img,[data-is="sphere-brain-viewer"] .watermark img{ height: 50px; display: block; float: right; margin: 18px; opacity: 0.9; } sphere-brain-viewer .watermark .text .software,[data-is="sphere-brain-viewer"] .watermark .text .software{ opacity: 0.85; font-size: 120%; } sphere-brain-viewer .watermark .text .institute,[data-is="sphere-brain-viewer"] .watermark .text .institute{ opacity: 0.5; } sphere-brain-viewer .watermark .text,[data-is="sphere-brain-viewer"] .watermark .text{ padding-top: 20px; color: white; display: inline-block; } sphere-brain-viewer .watermark,[data-is="sphere-brain-viewer"] .watermark{ position: absolute; top: 20px; right: 20px; z-index: 1001; background: transparent; width: 270px; }', '', function(opts) {


        const dom_width = (component) => (component.innerWidth || component.clientWidth);
        const dom_height = (component) => (component.innerHeight || component.clientHeight);

        const re_render_objects = (scene, camera, renderer) => renderer.render(scene, camera);

        function setup_scene(container) {
            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(10, dom_width(container) / dom_height(container), 1, 1000);
            camera.position.set(-5, 12, 10);
            camera.lookAt(scene.position);
            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(dom_width(container), dom_height(container));
            container.appendChild(renderer.domElement);

            window.addEventListener('resize', () => {
                camera.aspect = dom_width(container) / dom_height(container);
                camera.updateProjectionMatrix();
            }, false);
            return [scene, camera, renderer];
        }

        function create_control(scene, camera, renderer, container) {
            const controls = new THREE.TrackballControls(camera, container);
            controls.rotateSpeed = 5.0;
            controls.zoomSpeed = 3.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = true;
            controls.staticMoving = false;
            controls.dynamicDampingFactor = 0.2;

            controls.addEventListener('change', () => {
                re_render_objects(scene, camera, renderer);
            });

            window.addEventListener('resize', () => {
                renderer.setSize(dom_width(container), dom_height(container));
                controls.handleResize();
                re_render_objects(scene, camera, renderer);
            }, false);
            return controls;
        }

        function add_light_to_scene(scene, ambient_light, component_light) {
            const ambientLight = new THREE.AmbientLight(ambient_light);
            scene.add(ambientLight);
            const hemiLight = new THREE.HemisphereLight(component_light, component_light, 0);
            hemiLight.position.set(0, 50, 0);
            scene.add(hemiLight);
            const light = new THREE.PointLight(component_light, 1, 100);
            light.position.set(0, 20, 10);
            scene.add(light);
        }

        function add_axes(scene) {
            const axisHelper = new THREE.AxisHelper(1.25);
            scene.add(axisHelper);
        }

        function animationLoop(controls) {
            const _animation_loop = () => {
                requestAnimationFrame(_animation_loop);
                controls.update();
            };
            _animation_loop();
        }

        function default_electrode_locations() {

            return [
                ["Cz", 0.0000, 0.0000, 1.0000],
                ["Fpz", 0.0000, 0.9511, 0.3090],
                ["Fz", 0.0000, 0.5878, 0.8090],
                ["Pz", 0.0000, -0.5878, 0.8090],
                ["Oz", 0.0000, -0.9511, 0.3090],
                ["T7", -0.9511, 0.0000, 0.3090],
                ["C3", -0.5878, 0.0000, 0.8090],
                ["C4", 0.5878, 0.0000, 0.8090],
                ["T8", 0.9511, 0.0000, 0.3090],
                ["Fp2", 0.2939, 0.9045, 0.3090],
                ["F8", 0.7695, 0.5590, 0.3090],
                ["P8", 0.7695, -0.5590, 0.3090],
                ["O2", 0.2939, -0.9045, 0.3090],
                ["Fp1", -0.2939, 0.9045, 0.3090],
                ["F7", -0.7695, 0.5590, 0.3090],
                ["P7", -0.7695, -0.5590, 0.3090],
                ["O1", -0.2939, -0.9045, 0.3090],
                ["F3", -0.4591, 0.5800, 0.6730],
                ["F4", 0.4591, 0.5800, 0.6730],
                ["P3", -0.4591, -0.5800, 0.6730],
                ["P4", 0.4591, -0.5800, 0.6730],
            ];
        }

        function create_brain(model_path, scene, camera, renderer) {
            const brain_material = new THREE.MeshPhongMaterial({
                color: 0xb47f6f,
                specular: 0x111111,
                shininess: 2000
            });
            var brain_mesh;
            new THREE.STLLoader().load(model_path, (geometry) => {
                brain_mesh = new THREE.Mesh(geometry, brain_material);
                brain_mesh.scale.set(0.01, 0.01, 0.01);
                brain_mesh.translateX(1.1);
                brain_mesh.translateY(0.81);
                brain_mesh.translateZ(0.91);
                geometry.center();

                brain_mesh.position.set(0, 0, 0);
                brain_mesh.rotation.set(3.1416 * 0.5, -3.1416, 0);
                brain_mesh.scale.set(0.015, 0.015, 0.015);

                brain_mesh.castShadow = true;
                brain_mesh.receiveShadow = true;
                scene.add(brain_mesh);
                re_render_objects(scene, camera, renderer);
            });
            return [brain_material, brain_mesh];
        }

        function map_locations_to_spheres(electrode_locations, scene, camera, renderer) {
            const electrode_spheres = {};
            electrode_locations.forEach(electrode_location_data => {
                var electrode_geometry = new THREE.SphereGeometry(1, 32, 24);
                var electrode_material = new THREE.MeshPhongMaterial({
                    color: 0x333333,
                    specular: 0x111111,
                    shininess: 200,
                });
                var sphere = new THREE.Mesh(electrode_geometry, electrode_material);
                sphere.scale.set(0.1, 0.1, 0.1);
                sphere.position.set(
                    electrode_location_data[1] * 0.78,
                    electrode_location_data[3] - 0.309,
                    electrode_location_data[2]);

                if (electrode_location_data.length <= 4 || electrode_location_data[4] == 1) {
                    scene.add(sphere);
                }
                electrode_spheres[electrode_location_data[0].toLowerCase().trim()] = sphere;
            });
            re_render_objects(scene, camera, renderer);
            return electrode_spheres;
        }

        const self = this;
        const config = opts;
        config.component_light = config.component_light !== undefined ? config.component_light : '#FAFAFA';
        config.ambient_light = config.ambient_light !== undefined ? config.ambient_light : '#EEEEEE';
        config.electrode_locations = config.electrode_locations !== undefined ? config.electrode_locations :
            default_electrode_locations();

        self.on("mount", () => {
            const container = this.refs.container;
            const [scene, camera, renderer] = setup_scene(container);
            const controls = create_control(scene, camera, renderer, container);
            add_light_to_scene(scene, config.ambient_light, config.component_light);
            add_axes(scene);
            animationLoop(controls);

            create_brain('./models/brain2.stl', scene, camera, renderer);

            let electrode_spheres = [];

            self.create_show_electrode_layout = (layout) => {

                config.electrode_locations = layout;
                self.show_electrodes();
            };
            self.show_electrodes = () => {
                if (electrode_spheres.length > 0) {
                    console.error("Electrodes already displayed");
                    return;
                }
                electrode_spheres = map_locations_to_spheres(config.electrode_locations, scene, camera,
                    renderer);
            };
            self.show_electrode_map = (electrode_names, vector, reference_index, color_callback) => {
                vector.forEach((v, j) => {
                    if (j == reference_index) return;
                    const identical_value = v == vector[reference_index];
                    const color = color_callback(identical_value);
                    self.change_electrode_color(electrode_names[j], color[0], color[1], color[2]);
                });
            };
            self.change_electrode_color = (electrode_name, r, g, b) => {
                electrode_name = electrode_name.toLowerCase().trim();
                if (!!electrode_spheres[electrode_name]) {
                    electrode_spheres[electrode_name].material.color = new THREE.Color(r, g, b);
                    re_render_objects(scene, camera, renderer);
                } else {
                    console.error("Electrode does not exist: " + electrode_name);
                }
            };
            this.update();
        });
});