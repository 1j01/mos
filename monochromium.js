
window.MonoChromium = function(url){
	var m=new Modal();
	m.className = "webbrowser monochromium";
	m.$m.className += " webbrowser monochromium";
	m.title("Google MonoChrome");
	m.content("<iframe/>");
	var $if = m.$("iframe");
	$if.src = ("http://"+(url||"1j01.koding.com")).replace();
	return m;
};
