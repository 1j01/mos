
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
			var cmd = editor.getValue().replace(/[\n\r]/gim,"");
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