
var BR = "<br>";

/* 
	replace #[0-9A-F]{2}([0-9A-F]{2})[0-9A-F]{2}
	with #00\100
	
	replace #[0-9A-F]([0-9A-F])[0-9A-F]\b
	with #00\1\100

*/

function MosPad(file){
	var m = new Modal();
	m.className = "MosPad";
	m.$m.className += " MosPad";
	m.title((file&&file.name||"New")+" - MosPad");
	m.content("<div class='editor'></div>");
	var a=ace.edit(m.$(".editor"));
	a.renderer.setShowGutter(false);
	a.setShowPrintMargin(false);
	a.getSession().setUseSoftTabs(false);
	if(file&&file.content){
		a.setValue(file_get_contents(file.fname));
		a.gotoLine(0);
	}
	m.resizable();
	a.commands.addCommands([{
		name: "find",
		bindKey: {
			win: "Ctrl-F",
			mac: "Command-F"
		},
		exec: function(editor, line) {
			var find = gui.prompt("Find",a.session.getTextRange(a.getSelectionRange()),function(needle){
				
			});
			
			return false;
		},
		readOnly: true
	},{
		name: "save",
		bindKey: {
			win: "Ctrl-S",
			mac: "Command-S"
		},
		exec: save,
		readOnly: true
	},{
		name: "replace",
		bindKey: {
			win: "Ctrl-H",
			mac: "Command-H"
		},
		exec: function(editor, line) {
			return false;
		},
		readOnly: true
	}]);
	m.onclose = function(){
		if(file? (file_get_contents(file.fname) !== a.getValue()): a.getValue()){
			var us=new Modal();
			us.title("Unsaved");
			us.content("The file is unsaved.<br><button class='save'>Save</button><button class='close'>Close</button><button class='cancel'>Cancel</button>");
			us.$(".save").onclick = function(){
				save();
				if(file)m.close();
				us.close();
			};
			us.$(".close").onclick = function(){
				m.close();
				us.close();
			};
			us.$(".cancel").onclick = function(){
				us.close();
			};
			us.position(m.x+100,m.y+100);
			return false;
		}
		return true;
	};
	function save(){
		if(file&&file.fname){
			file_put_contents(file.fname, a.getValue());
		}else{
			gui.prompt("Save As","",function(newname){
				file = file || {};
				file.fname=newname;
				m.title(file.fname+" - MosPad");
				file_put_contents(file.fname, a.getValue());
			}).position("center");
		}
	}
	return m;
}

function Terminal(cb){
	if(!cb)cb=EXECUTE_MALICIOUS;
	var m = new Modal();
	m.className = "terminal";
	m.$m.className += " terminal";
	m.title("Terminal");
	m.content("<div class='lines'></div><span class='PS1'>&gt;</span><div class='cmd'></div>");
	var $lines = m.$(".lines");
	var $cmd = m.$(".cmd");
	var a = ace.edit($cmd);
	a.renderer.setShowGutter(false);
	a.setShowPrintMargin(false);
	a.getSession().setUseSoftTabs(false);
	a.focus();
	m.terminal = {
		log: function(str){
			$lines.innerHTML+=str.replace(/\n/g,BR)+BR;
		},
		write: function(str){
			$lines.innerHTML+=str.replace(/\n/g,BR);
		},
		clear: function(str){
			$lines.innerHTML=(str||"").replace(/\n/g,BR);
		},
		focus: function(){
			a.focus();
		},
		a:a,m:m
	};
	//console.log(a.commands);
	var cmds=[],cmdi=null;
	m.$m.addEventListener("click", function(){a.focus();}, true);
	a.commands.addCommands([{
		name: "execute",
		bindKey: {
			win: "Enter",
			mac: "Enter"
		},
		exec: function(editor, line) {
			var cmd = editor.getValue().replace(/[\n\r\s]/gim,"");
			editor.removeLines();
			setTimeout(function(){editor.removeLines();},0);
			if(cmd){
				m.terminal.log("<span class='PS2'>&gt;</span> "+cmd);
				if(cmds.indexOf(cmd)!=-1){
					cmds.splice(cmds.indexOf(cmd),1);
				}
				cmds.push(cmd);
				cmdi=cmds.length;
				cb(cmd, m.terminal);
			}
			return false;
		},
		readOnly: true
	}]);
	a.commands.addCommands([{
		name: "previous command",
		bindKey: {
			win: "Up",
			mac: "Up"
		},
		exec: function(editor, line) {
			editor.setValue((--cmdi<0)?((cmdi=-1)&&""):cmds[cmdi].replace(/\n/,""));
			return false;
		},
		readOnly: true
	}]);
	a.commands.addCommands([{
		name: "next command",
		bindKey: {
			win: "Down",
			mac: "Down"
		},
		exec: function(editor, line) {
			editor.setValue((++cmdi>=cmds.length)?((cmdi=cmds.length)&&""):cmds[cmdi].replace(/\n/,""));
			return false;
		},
		readOnly: true
	}]);
	/*a.on("change",function(e){
		if(a.getValue().indexOf("\n")){
			//return false;
			//a.setValue(a.getValue().replace(/\n/,""));
		}
	});*/
	/*
	$cmd.onkeypress = function(e){
		m.$c.scrollTop = m.$c.scrollHeight+5000;
	};
	$cmd.onkeydown = function(e){
		if(e.keyCode==38){//up
			a.setValue((--cmdi<0)?((cmdi=-1)&&""):cmds[cmdi]);
		}else if(e.keyCode==40){//down
			a.setValue((++cmdi>=cmds.length)?((cmdi=cmds.length)&&""):cmds[cmdi]);
		}
		console.log(e.keyCode);
	};*/
	return m;
}
function WebBrowser(url){
	var m = new Modal();
	m.className = "webbrowser";
	m.$m.className += " webbrowser";
	m.title("Web Browser");
	m.content("<iframe/>");
	var $if = m.$("iframe");
	$if.src = url;
	return m;
}

function FileBrowser(path){
	var m = new Modal();
	m.onclose=function(){
		fv.destroy();
		return true;
	};
	m.className = "filebrowser";
	m.$m.className += " filebrowser";
	m.title("File Browser");
	m.content("<div style='margin-top:2px' class='input path'></div><div class='files'></div>");
	var $path = m.$(".path");
	var $files = m.$(".files");
	var fv = new FolderView($files, path);
	$path.contentEditable=true;
	$path.innerText=path;
	$path.focus();
	$path.onkeypress=function(e){
		if(e.keyCode===13){
			fv.path = $path.innerText;
			return false;
		}
	};
	/*
	var a = ace.edit($path);
	a.renderer.setShowGutter(false);
	a.setShowPrintMargin(false);
	a.getSession().setUseSoftTabs(false);
	a.setValue(path);
	a.commands.addCommands([{
		name: "execute",
		bindKey: {
			win: "Enter",
			mac: "Enter"
		},
		exec: function(editor, line) {
			var path = editor.getValue().replace(/[\n\r\s]/gim,"");
			return false;
		},
		readOnly: true
	}]);*/
	return m;
}
function FolderView($cont, path){
	path = path || "";
	var fv = {
		$view: document.createElement("div"),
		destroy: function(){
			folderviews.splice(folderviews.indexOf(fv),1);
		},
		_path: path,
		set path(to){
			this._path=to;
			while(this.$view.firstChild)this.$view.removeChild(this.$view.firstChild);
			addFiles();
		},
		get path(){
			return this._path;
		}
	};
	$cont.appendChild(fv.$view);
	addFiles();
	
	folderviews.push(fv);
	return fv;
	
	function addFiles(){
		try{
			var folder = filepath(fv.path);
			if(!folder.files){
				fv.$view.innerHTML = "That's no folder.";
			}
			for(var i in folder.files){
				var ic=new Icon(folder.files[i],fv.$view);
				ic.name=i;
				ic.fname=fv.path+"/"+i;
			}
		}catch(e){
			fv.$view.innerHTML = "Folder not found.";
		}
	}
}

function EXECUTE_MALICIOUS(str, terminal){
	if(str.match(/\s*[\w\-]*\s*\?\s*/)){
		terminal.log(help(str.replace("?","")));
		return;
	}
	var tmp = open(str);
	if(tmp){
		return tmp;
	}
	
	terminal.log("ERROR");
}

function help(on){
	switch(on){
		case "":
		return "MOS v2.1 General Help"
			+"\n"
			+"\nFor help on a specific command, enter the command name with a ? after it."
			+"\nPress the up and down arrow keys to scroll through command history."
			+"\nFor a list of commands/programs, enter \"p list all\"";
		case "?": return "? gives help information. ";
		case "d": return;
	}
	return "No help found for \""+on+"\". (Enter \"?\" for general help.)";
}
function open(prg,arg){
	var m = null;
	switch(prg.toLowerCase()){
		case "terminal":
			m = new Terminal();
			break;
		case "mospad":
			m = new MosPad(arg && filepath(arg));
			break;
		case "filebrowser":
			m = new FileBrowser();
			break;
		case "webbrowser":
			m = new WebBrowser(arg);
			break;
		case "worldmap":
			m = new WorldMap();
			break;
		case "monochromium":
			m = new MonoChromium();
			break;
		default:
			return false;
	}
	m.position("center");
	return m;
}


function Icon(ob, parent){
	parent = parent || $desktop;
	var o = {};
	o.$div = document.createElement("div");
	o.$img = document.createElement("img");
	o.$name = document.createElement("span");
	o.$div.appendChild(o.$img);
	o.$div.appendChild(o.$name);
	parent.appendChild(o.$div);
	
	for(var k in ob){
		if(ob.hasOwnProperty(k)){
			o[k]=ob[k];
		}
	}
	o.name = ob.name || (ob.cmd && o.cmd.replace(/\b\w/,function(m){return m.toUpperCase();}));
	
	o.$name.innerText = o.name;
	o.$div.onclick = function(){
		if(o.cmd){
			o.ret=EXECUTE_MALICIOUS(o.cmd,openTerminalIfUsed);
		}else if(o.type=="text"){
			new MosPad(o);
		}else if(o.type=="folder"){
			new FileBrowser(o.fname);
		}else{
			gui.msg("Unknown file type.");
		}
	};
	o.$div.className="icon";
	o.$name.className="name";
	o.$img.onerror=function(){};
	if(o.cmd==="worldmap"){
		o.$img.src=worldMapIconURI;
	}else{
		o.$img.src="icons/"+((o.type=="link"&&o.cmd&&o.cmd.match(/^[\w\-]+$/))?o.cmd:o.type)+"";
	}
	o.$img.draggable=false;
	
	return o;
}
function file_put_contents(fname,str){
	//gui.msg("file_put_contents");
	
	var fna=fname.split("/"),folder={files:files};
	if(fna[0]==="")fna.splice(0,1);
	for(var i=0;i<fna.length-1;i++){
		if(!folder.files){
			throw new Error("Not a folder!");
		}
		folder=folder.files[fna[i]];
		if(!folder){
			throw new Error("Not found!"+folder+", "+fna);
		}
	}
	if(!folder.files){
		throw new Error("Not a folder!");
	}
	var file=folder.files[fna[i]];
	//console.log(fna[i],folder.files);
	//var file = filepath(fname);
	if(file && file.files){
		throw new Error("Can't write to a folder!");
	}
	if(!file){
		file={type:"text",name:fna[i]};
		folder.files[fna[i]]=file;
		if(folder.files==files){
			var o={fname:fname};
			for(var k in file){
				if(file.hasOwnProperty(k)){
					o[k]=file[k];
				}
			}
			addToFolderViews(o);
		}
	}
	file.content=str;
	try{
		localStorage.mosfiles=JSON.stringify(files);
	}finally{}
}
function file_get_contents(fname){
	//throw new Error("FLAKE");
	var folder={files:files,type:"folder"};
	if(fname==="")throw new Error("Can't read a folder! (desktop)");
	var fna=fname.split("/");
	if(fna[0]==="")fna.splice(0,1);
	
	for(var i=0;i<fna.length-1;i++){
		if(!folder.files){
			throw new Error("Not a folder!");
		}
		folder=folder.files[fna[i]];
		if(!folder){
			throw new Error("Not found!");
		}
	}
	if(!folder.files){
		throw new Error("Not a folder!");
	}
	var file=folder.files[fna[i]];
	if(file && file.files){
		throw new Error("Can't read a folder!");
	}
	if(!file){
		return null;
	}
	return file.content;
}
function filepath(fname){
	var folder={files:files,type:"folder"};
	if(fname==="")return folder;
	var fna=fname.split("/");
	if(fna[0]==="")fna.splice(0,1);
	for(var i=0;i<fna.length;i++){
		if(!folder.files){
			throw new Error("Not a folder!");
		}
		folder=folder.files[fna[i]];
		if(!folder){
			throw new Error("Not found! ="+fna);
		}
	}
	return folder;
}
function addToFolderViews(o){
	if(!o.fname)throw new Error("um Whut tdo i dio!");
	for(var i in folderviews){
		if(folderviews[i].path === o.fname.replace(/\/?[^\/]+$/,"")){
			new Icon(o, folderviews[i].$view);
		}
	}
}
function drawPipes(ctx){
	ctx.lineWidth=5;
	for(var i=0;i<gui.modals.length;i++){
		var m=gui.modals[i];
		for(var j=0;j<gui.modals.length;j++){
			if(i===j)continue;
			var m2=gui.modals[j];
			drawPipe(m.x,m.y,m2.x,m2.y);
		}
	}
}

function drawPipe(ctx,x1,y1,x2,y2){
	var path=[{x:x1,y:y1},{x:x2,y:y2}];
	for(var mi=0;mi<gui.modals.length;mi++){
		//console.log(p1,p2,mi);
		var r=gui.modals[mi].$m.getBoundingClientRect();
		if(lineXrect(path[0].x,path[0].y,path[1].x,path[1].y, r.left,r.top,r.width,r.height)){
			
			path.splice(1,0,{x:path[0].x,y:path[1].y});
			
		}
	}
	var win=true;
	for(var p1=0,p2=1;p2<path.length;p1++,p2++){
		for(var mi=0;mi<gui.modals.length;mi++){
			var r=gui.modals[mi].$m.getBoundingClientRect();
			if(lineXrect(path[p1].x,path[p1].y,path[p2].x,path[p2].y, r.left,r.top,r.width,r.height)){
				
				win = false;
				break;
			}
		}
		if(!win) break;
	}
	//if(!win) return;
	ctx.lineWidth=5*Math.random();
	ctx.beginPath();
	for(var p1=0,p2=1;p2<path.length;p1++,p2++){
		ctx.moveTo(path[p1].x,path[p1].y);
		ctx.lineTo(path[p2].x,path[p2].y);
	}
	ctx.stroke();
}
/*
function drawPipe(ctx,x1,y1,x2,y2){
	var x=x1, y=y1;
	var path=[{x:x,y:y}];
	var fwd=1,siar=0;
	var g=10;
	ctx.strokeStyle="#500";
	ctx.beginPath();
	for(var i=0;i<100;i++){
		var xf=Math.max(Math.min((x2-x)/g,1),-1)*g;
		var yf=Math.max(Math.min((y2-y)/g,1),-1)*g;
		if(fwd>0){
			//go forwards
			path.push({x:x+xf,y:y+yf});
		}else{
			//go sidewards?
			console.log("s");
			if(Math.random()<0){
				if(Math.random()<0.5){
					path.push({x:x+xf,y:y-yf});
				}else{
					path.push({x:x-xf,y:y+yf});
				}
			}else{
				if(Math.random()<0.5){
					path.push({x:x,y:y+yf});
				}else{
					path.push({x:x+xf,y:y});
				}
			}
		}
		var coll=false;
		var pad=10;
		for(var mi=0;mi<gui.modals.length;mi++){
			var r=gui.modals[mi].$m.getBoundingClientRect();
			if(lineXrect(x,y,path[path.length-1].x,path[path.length-1].y, r.left-pad,r.top-pad,r.width+pad+pad,r.height+pad+pad)){
				fwd-=2;
				coll=true;
				break;
			}
		}
		if(coll){
			ctx.moveTo(path[path.length-2].x,path[path.length-2].y);
			ctx.lineTo(path[path.length-1].x,path[path.length-1].y);
			ctx.stroke();
			path.splice(path.length-1,1);
			siar++;
			if(siar>12){
				fwd=1;
			}
		}else{
			siar=0;
			x=path[path.length-1].x;
			y=path[path.length-1].y;
			fwd+=1;
			if(fwd>1) fwd=1;
		}
	}
	//path.push({x:x2,y:y2});
	ctx.lineWidth=2;
	ctx.strokeStyle="#0F0";
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	for(var p1=0,p2=1;p2<path.length;p1++,p2++){
		ctx.lineTo(path[p2].x,path[p2].y);
	}
	ctx.stroke();
	ctx.strokeStyle="#500";
	ctx.beginPath();
	ctx.moveTo(path[path.length-1].x,path[path.length-1].y);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}
*/
function drawCursor(ctx, mx, my){
	ctx.fillRect(mx,my,4,4);
}
function lineXrect(x1,y1,x2,y2, x,y,w,h){
	for(var i=0;i<1;i+=0.1){
		if(pointXrect(x1+(x2-x1)*i,y1+(y2-y1)*i, x,y,w,h)) return true;
	}
	return false;
}
function pointXrect(x1,y1, x,y,w,h){
	return (x1>=x && y1>=y && x1<=x+w && y1<=y+h);
}
openTerminalIfUsed = {
	log: function(str){
		//if(!this.m)
		this.m=new Terminal();
		this.m.$(".lines").innerHTML+=str.replace(/\n/g,BR)+BR;
	},
	write: function(str){
		//if(!this.m)
		this.m=new Terminal();
		this.m.$(".lines").innerHTML+=str.replace(/\n/g,BR);
	},
	clear: function(str){
		//if(!this.m)
		this.m=new Terminal();
		this.m.$(".lines").innerHTML=(str||"").replace(/\n/g,BR);
	},
	/*get m(){
		//if(this.m)return this.m;
		Terminal();
		return this.m;
	}*/
};

files={};
try{
	if(localStorage.mosfiles)
		files=JSON.parse(localStorage.mosfiles);
}catch(e){}if(!files)files={};

folderviews = [];

$desktop=document.createElement("div");
$desktop.id="desktop";
document.body.appendChild($desktop);


$canvasOverlay = document.createElement("canvas");
document.body.appendChild($canvasOverlay);
$canvasOverlay.border = 0;
$canvasOverlay.id = "pipes";

new FolderView($desktop);

new Icon({type:"link",cmd:"terminal",name:"Terminal"});
new Icon({type:"link",cmd:"mospad"});
new Icon({type:"link",cmd:"worldmap",name:"World Map"});
new Icon({type:"link",cmd:"monochromium",name:"MonoChrome"});
/*link("terminal");
link("mospad");
//link("webbrowser");
link("world Map");
link("monochromium");*/

addEventListener("keydown",function(e){
	if(e.altKey && e.keyCode==84){
		new Terminal().position("center");
		e.preventDefault();
		return false;
	}
},true);
addEventListener('contextmenu', function(e){
	e.preventDefault();return!1;
}, true);

mouse={x:-50,y:-50};

/*requestAnimationFrame(function animate(){
	requestAnimationFrame(animate);
	if($canvasOverlay.width!=innerWidth){
		$canvasOverlay.width=innerWidth;
	}
	if($canvasOverlay.height!=innerHeight){
		$canvasOverlay.height=innerHeight;
	}
	var ctx=$canvasOverlay.getContext("2d");
	ctx.clearRect(0,0,$canvasOverlay.width,$canvasOverlay.height);
	ctx.fillStyle="#0F0";
	//ctx.fillRect(500+Math.random()*50,500,100,100);
	ctx.strokeStyle="#0F0";
	drawPipe(ctx,100,100,500,500);
	//drawPipes(ctx);
	//drawCursor(ctx, mouse.x, mouse.y);
});*/

(function() {
	window.onmousemove = handleMouseMove;
	function handleMouseMove(event) {
		event = event || window.event; // IE-ism
		mouse = {
			x:event.clientX,
			y:event.clientY,
			$:document.elementFromPoint(event.clientX,event.clientY)
		};
		//console.log($over.style);
		//console.log(getComputedStyle($over).cursor);
	}
})();

