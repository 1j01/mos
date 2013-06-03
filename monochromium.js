
window.MonoChromium = function(url){
	var m=new Modal();
	m.className = "webbrowser monochromium";
	m.$m.className += " webbrowser monochromium";
	m.title("Google MonoChrome");
	m.content("<div>"
		+"<button class='back'>&#x2190;</button>"
		+"<button class='forwards'>&#x2192;</button>"
		+"<button class='reload'>&#x21BB;</button>"
		+"<input/><button class='hotdog'>&equiv;</button>"
		+"</div><iframe>");
	var $if = m.$("iframe");
	var $in = m.$("input"); $in.value=url||"1j01.koding.com";
	$in.style.width="calc(100% - 112px)";
	$if.src = "http://"+$in.value.replace(/\w+:\/?\/?/,"");
	m.$(".back").onclick=function(){
		$if.contentWindow.history.go(-1);
	};
	m.$(".forwards").onclick=function(){
		$if.contentWindow.history.go(1);
	};
	m.$(".reload").onclick=function(){
		$if.contentWindow.history.go(0);
	};
	$in.onkeypress=function(e){
		if(e.keyCode==13){
			$if.src = "http://"+$in.value.replace(/\w+:\/?\/?/,"");
			$in.value="";
		}
	};
	return m;
};
