
// http://en.wikipedia.org/wiki/Server_(computing)#Types_of_servers

servers = [{
	domain: "ftp.zi-xen.info",
	ip: "139.28.60.34",
	type: "files",
	x:500, y:6250,
},{	
	domain: "db.zi-xen.info",
	ip: "139.28.60.34",
	type: "database",
	x:1340, y:4450,
},{
	domain: "pro.xyz",
	ip: "133.46.26.85",
	type: "proxy",
	security: "hallpass required",
	x:50, y:3550,
},{
	domain: "auth.faceboo.kr",
	ip: "136.27.47.11",
	type: "authentification",
	x:1350, y:8350,
}];

function WorldMap(){
	var m = new Modal()
		.title("World Map")
		.content("<div class='webgl'/>");
	// console.log(m);
	var webglEl = m.$(".webgl");
	// 	var ctx=$c.getContext('2d');
	// 	var rot=0,rots=0;
	// 	var d=$c.width=$c.height=450;
	// 	var dragging=false;
	
	// m.mx=m.my=m.hover=null;
	
	// var iid = setInterval(function(){
	// 	draw(ctx,d,rot+=rots*=!dragging*0.2+0.7,servers,m);
	// 	$c.style.cursor = m.hover?'url("cursors/pointer.png") 5 2, pointer':'';
	// },30);
	
	// function weeeeeeeeeeeeeee(ev){
	// 	var newmx = ev.clientX-$c.getBoundingClientRect().left;
	// 	rots+=dragging*(newmx-m.mx)*3;
	// 	m.mx=newmx;
	// 	m.my=ev.clientY-$c.getBoundingClientRect().top;
	// }
	// addEventListener("mousemove",weeeeeeeeeeeeeee,true);
	// $c.onmousedown=function(ev){
	// 	if(m.hover){
	// 		return!
	// 			new Modal()
	// 			.position(20+m.hover.cx+m.x,m.y+m.hover.cy+20)
	// 			.title("Server")
	// 			.content("<pre>"+JSON.stringify(m.hover, null, "```.").replace(/["{}]|```./g,""));
	// 	}
	// 	document.documentElement.className="dragging-somewhere";
	// 	dragging=true;
	// };
	// addEventListener("mouseup",function(){
	// 	document.documentElement.className="";
	// 	dragging=false;
	// },true);
	
	// return m;
	
	if(!Detector.webgl){
		Detector.addGetWebGLMessage(webglEl);
		return;
	}
	
	var width  = 640;
	var height = 480;
	
	// Earth params
	var radius = 0.5;
	var segments = 64;
	var rotation = 6;
	
	var scene = new THREE.Scene();
	
	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;
	
	var renderer = new THREE.WebGLRenderer({ antialias: true, depth: false });
	renderer.setSize(width, height);
	
	// scene.add(new THREE.AmbientLight(0xffffff));
	
	// var light = new THREE.DirectionalLight(0xffffff, 1);
	// light.position.set(5,3,5);
	// scene.add(light);
	
	var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation;
	scene.add(sphere);
	
	// var clouds = createClouds(radius, segments);
	// clouds.rotation.y = rotation;
	// scene.add(clouds);
	
	var outlineMaterial = new THREE.MeshBasicMaterial({
		color: 0x00ff00,
		side: THREE.BackSide
	});
	// outlineMaterial.depthTest = false;
	var outline = new THREE.Mesh(
		new THREE.SphereGeometry(radius + 0.001, segments, segments),
		outlineMaterial
	);
	scene.add(outline);
	
	// scene.sortObjects = false;
	// sphere.renderOrder = 1;
	// outline.renderOrder = -5;
	
	// var stars = createStars(90, 64);
	// scene.add(stars);
	
	var controls = new THREE.TrackballControls(camera);
	
	webglEl.appendChild(renderer.domElement);
	
	render();
	
	function render(){
		controls.update();
		// sphere.rotation.y += 0.0005;
		// clouds.rotation.y += 0.0005;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	
	function createSphere(radius, segments){
		var earthTexture = THREE.ImageUtils.loadTexture("earth-outlines.png");
		earthTexture.anisotropy = renderer.getMaxAnisotropy();
		var earthMaterial = new THREE.MeshBasicMaterial({
			map: earthTexture,
			color: 0x00ff00
		});
		// earthMaterial.depthTest = false;
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			// new THREE.MeshPhongMaterial({
			// 	map: THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
			// 	bumpMap: THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
			// 	bumpScale: 0.005,
			// 	specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
			// 	specular: new THREE.Color('grey')
			// })
			earthMaterial
		);
	}
	
	// function createClouds(radius, segments){
	// 	return new THREE.Mesh(
	// 		new THREE.SphereGeometry(radius + 0.003, segments, segments),
	// 		new THREE.MeshPhongMaterial({
	// 			map: THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
	// 			transparent: true
	// 		})
	// 	);		
	// }
	
	// function createStars(radius, segments){
	// 	return new THREE.Mesh(
	// 		new THREE.SphereGeometry(radius, segments, segments), 
	// 		new THREE.MeshBasicMaterial({
	// 			map: THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
	// 			side: THREE.BackSide
	// 		})
	// 	);
	// }
	
	// TODO: add back servers
	// TODO: constrain zoom
	
	return m;
}
