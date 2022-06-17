import * as THREE from 'https://cdn.skypack.dev/three@0.136';


    import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
    import { Water } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/objects/Water.js';
    import { Sky } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/objects/Sky.js';
    import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';

    let SCALE = 100000;
    let CameraLock = 1;
    let camera, scene, renderer;
    let controls, water, sun;
    var Boatscene, Islandscene;
    let cloud, cloudsList = [];
    let cloudCount = 120;
    let materials= [];
    let Parameters;

    class Boat{
        constructor(){
            const loader = new GLTFLoader();
            loader.load("assets/Boat/scene.gltf", (gltf) => {
            Boatscene = gltf.scene
            scene.add(gltf.scene);
            gltf.scene.scale.set(30, 30, 30);
            gltf.scene.position.set(100, 7, 0);
            gltf.scene.rotation.y = Math.PI/2;
            this.boat = gltf.scene;
            this.speed = {
                rot: 0,
                vel: 0
            }
    })
        }
        update(){
            if(this.boat){
            this.boat.translateZ(this.speed.vel);
            this.boat.rotation.y += this.speed.rot;
            }
        }

        stop(){
            this.speed.rot = 0;
            this.speed.vel = 0; 

        }
    }

    class Island{
        constructor(){
            const loader = new GLTFLoader();
            loader.load("assets/Island/scene.gltf", (gltf) => {
            Islandscene = gltf.scene;
            scene.add(gltf.scene);
            gltf.scene.scale.set(300, 300, 300);
            gltf.scene.position.set(10000, 1000, 0);
            gltf.scene.rotation.y = -180;
            this.island = gltf.scene;
            })
    }
}




const island = new Island();
const boat = new Boat();


function isCameraColliding(obj2) {
    if (camera) {
      if (obj2) {
        if (Math.abs(camera.position.x - obj2.position.x) < 300 && Math.abs(camera.position.z - obj2.position.z) < 300) {
          camera.position.x = camera.position.x > 0 ? camera.position.x++ : camera.position.x--;
          camera.position.z = camera.position.z > 0 ? camera.position.z++ : camera.position.z--;
        }
      }
    }
  }

function cameraPositionLimit() {
    isCameraColliding(Islandscene);
    if(Boatscene && Islandscene){
    if (CameraLock) {
      camera.position.x = Boatscene.position.x;
      camera.position.y = Boatscene.position.y +15;
      camera.position.z = Boatscene.position.z;
      camera.rotation.x = Boatscene.rotation.x;
      camera.rotation.y = Boatscene.rotation.y - Math.PI;
      camera.rotation.z = Boatscene.rotation.z ;
      camera.translateX(0);
      camera.translateY(20);
      camera.translateZ(120);
      //camera.rotateX(Math.PI/2);
      //camera.rotateX(Math.PI/2);
      //camera.rotateOnWorldAxis((0,0,0), 7);
    } else {
      if (camera.position.x > SCALE / 4) {
        camera.position.x = SCALE / 4;
      }
  
      if (camera.position.x < -SCALE / 4) {
        camera.position.x = SCALE / 4;
      }
  
      if (camera.position.z > SCALE / 4) {
        camera.position.z = SCALE / 4;
      }
  
      if (camera.position.z < -SCALE / 4) {
        camera.position.z = SCALE / 4;
      }
  
      if (camera.position.y > SCALE * 0.09) {
        camera.position.y = SCALE * 0.09;
      }
    }
  }
  }

  function BoatPositionLimit() {
    if (Boatscene && Islandscene){
      if (Boatscene.position.x > SCALE / 4) {
          Boatscene.position.x = SCALE / 4;
      }
    
      if (Boatscene.position.x < -SCALE / 4) {
          Boatscene.position.x = -SCALE / 4;
      }
    
      if (Boatscene.position.z > SCALE / 4) {
          Boatscene.position.z = SCALE / 4;
      }
    
      if (Boatscene.position.z < -SCALE / 4) {
          Boatscene.position.z = -SCALE / 4;
      }
      let xd = Islandscene.position.x - Boatscene.position.x
      let zd = Islandscene.position.z - Boatscene.position.z
      let theta =  Math.atan(zd/xd)
      let d = Math.sqrt(xd*xd + zd*zd)
      if (d<7500) {
        Boatscene.position.x = Math.cos(theta)*7500;
      }
      if (d<7500) {
        Boatscene.position.z = Math.sin(theta)*7500;
      }

      } 
     }

     function animateClouds(cloudsList) {
      cloudsList.forEach((clouds) => {
        clouds.position.x += 3;
        clouds.position.z -= 3;
        if (clouds.position.x > SCALE / 2) {
          clouds.position.x = -SCALE / 2;
        }
        if (clouds.position.z < -SCALE / 2) {
          clouds.position.z = SCALE / 2;
        }
      });
    }

    init();
    animate();

    function init() {


        //

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        document.body.appendChild( renderer.domElement );


      
        // camera

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
        camera.position.set( 5, 13, 110);

  

        // sun light

        sun = new THREE.Vector3();
        // 
        
				const Geometry = new THREE.BufferGeometry();
				const vertices = [];

				const textureLoader = new THREE.TextureLoader();

				const rain = textureLoader.load( 'assets/snow.png' );
        

        for ( let i = 0; i < SCALE; i ++ ) {

					const x = Math.random() * SCALE - SCALE/2;
					const y = Math.random() * SCALE - SCALE/2;
					const z = Math.random() * SCALE - SCALE/2;

					vertices.push( x, y, z );

				}
        Geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        
				Parameters = [
					[[ 1.0, 0.2, 0.5 ], rain, SCALE/1000 ],
					[[ 0.95, 0.1, 0.5 ], rain, SCALE/1250 ],
					[[ 0.90, 0.05, 0.5 ], rain, SCALE/1300 ],
					[[ 0.85, 0, 0.5 ], rain, 8 ],
					[[ 0.80, 0, 0.5 ], rain, 5 ]
				];
        
				for ( let i = 0; i < Parameters.length; i ++ ) {

					const color = Parameters[ i ][ 0 ];
					const sprite = Parameters[ i ][ 1 ];
					const size = Parameters[ i ][ 2 ];

					materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
					materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

					const particles = new THREE.Points( Geometry, materials[ i ] );

					particles.rotation.x = Math.random() * 6;
					particles.rotation.y = Math.random() * 6;
					particles.rotation.z = Math.random() * 6;

					scene.add( particles );

				}


        
        const waterGeometry = new THREE.PlaneGeometry( 100000, 100000 );

        water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {
                  
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                } ),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x004a7e,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );

        water.rotation.x = - Math.PI / 2;

        scene.add( water );
      


      // Clouds
      
      const cloudLoader = new GLTFLoader();
      cloudLoader.load('assets/Clouds/scene.gltf', function (cloud) {
      for (let p = 0; p < cloudCount; p++) {
      let currCloud = cloud.scene.clone().children[0];


      currCloud.position.x = Math.random() * SCALE - SCALE/2 ;
      currCloud.position.y = 5000;
      currCloud.position.z = Math.random() * SCALE - SCALE/2 ;

      const scaleMultiplier = Math.random();
      currCloud.scale.setX(700);
      currCloud.scale.setY(700);
      currCloud.scale.setZ(700);

      scene.add(currCloud);

      cloudsList.push(currCloud);
    }
    });
      

        // Skybox

        const sky = new Sky();
        sky.scale.setScalar( 100000 );
        scene.add( sky );

        const skyUniforms = sky.material.uniforms;

        skyUniforms[ 'turbidity' ].value = 7.7;
        skyUniforms[ 'rayleigh' ].value = 0.8;
        skyUniforms[ 'mieCoefficient' ].value = 0.025;
        skyUniforms[ 'mieDirectionalG' ].value = 0.545;


        const parameters = {
            elevation: 90,
            azimuth: -120
        };

        const pmremGenerator = new THREE.PMREMGenerator( renderer );

        function updateSun() {

            const phi = THREE.MathUtils.degToRad( parameters.elevation -20  );
            const theta = THREE.MathUtils.degToRad( parameters.azimuth +180 );

            sun.setFromSphericalCoords( 1, phi, theta );

            sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
            water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

            scene.environment = pmremGenerator.fromScene( sky ).texture;

        }

        updateSun();


        // Sound Effects

        var AudioListener = new THREE.AudioListener();
        camera.add(AudioListener);
        var Sound = new THREE.Audio(AudioListener);
        var AudioLoader = new THREE.AudioLoader();

        AudioLoader.load('sound/boat.mp3', function (buffer) {
          Sound.setBuffer(buffer);
          Sound.setLoop(true);
          Sound.setVolume(1.5);
          Sound.play();
        });


        // Boat light

        scene.add(new THREE.AmbientLight(0xffffff));
        const light1 = new THREE.DirectionalLight(0xffffff, 4.5);
        light1.position.set(1, 500, 1);
        scene.add(light1);
        const posLight = new THREE.PointLight(0xffffff);
        posLight.position.set(1, 500, 1);
        scene.add(posLight);

        //

        const geometry = new THREE.BoxGeometry( 30, 30, 30 );
        const material = new THREE.MeshStandardMaterial( { roughness: 0 } );



        //

        controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI / 2;
        controls.target.set( 0, 10, 0 );
        controls.minDistance = 0;
        controls.maxDistance = Infinity;
        controls.update();


        const waterUniforms = water.material.uniforms;
        

        // keybinds

        window.addEventListener( 'resize', onWindowResize );
        window.addEventListener('keydown', function(e){
            if (e.key == 'w'){
                boat.speed.vel = 20;
            }
           if (e.key == 's'){
                boat.speed.vel = -20;
            }
            if (e.key == 'd'){
                boat.speed.rot = -0.02;
            }
            if (e.key == 'a'){
                boat.speed.rot = 0.02;
            }
        })
        window.addEventListener('keyup', (e) =>{
          if (e.key == 'w'){
            boat.speed.vel = 0;
        }
          if (e.key == 's'){
            boat.speed.vel = 0;
        }
        if (e.key == 'd'){
          boat.speed.rot = 0.0;
        }
        if (e.key == 'a'){
            boat.speed.rot = 0.0;
        }
        })
      }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {
        requestAnimationFrame( animate );
        render();
        boat.update();

    }

    function render() {
        const time = Date.now() * 0.00005;
        BoatPositionLimit();
        cameraPositionLimit();
        water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        animateClouds(cloudsList);
        
				for ( let i = 0; i < scene.children.length; i ++ ) {

					const object = scene.children[ i ];

					if ( object instanceof THREE.Points ) {

						object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

					}

				}

				for ( let i = 0; i < materials.length; i ++ ) {

					const color = Parameters[ i ][ 0 ];

					const h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
					materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );

				}

        renderer.render( scene, camera );

    }
