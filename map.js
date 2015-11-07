
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
	
	var webglEl = m.$(".webgl");
	
	if(!Detector.webgl){
		Detector.addGetWebGLMessage(webglEl);
		return;
	}
	
	
	// Earth params
	var radius = 0.5;
	var segments = 64;
	var rotation = 6;
	
	
	var scene = new THREE.Scene();
	
	var width  = 640;
	var height = 480;
	
	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;
	
	var renderer = new THREE.WebGLRenderer({ antialias: true, depth: false });
	renderer.setSize(width, height);
	webglEl.appendChild(renderer.domElement);
	
	var controls = new THREE.TrackballControls(camera);
	
	
	var earth = createEarth(radius, segments);
	earth.rotation.y = rotation;
	scene.add(earth);
	
	var outlineMaterial = new THREE.MeshBasicMaterial({
		color: 0x00ff00,
		side: THREE.BackSide
	});
	var outline = new THREE.Mesh(
		new THREE.SphereGeometry(radius + 0.001, segments, segments),
		outlineMaterial
	);
	scene.add(outline);
	
	
	render();
	
	function render(){
		controls.update();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	
	function createEarth(radius, segments){
		var earthTexture = THREE.ImageUtils.loadTexture("images/future-earth.png");
		earthTexture.anisotropy = renderer.getMaxAnisotropy();
		var earthMaterial = new THREE.MeshBasicMaterial({
			map: earthTexture,
			color: 0x00ff00
		});
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			earthMaterial
		);
	}
	
	// TODO: add back servers
	// TODO: constrain zoom
	// TODO: find a way of normalizing the line thickness (with a shader)
	
	return m;
}
