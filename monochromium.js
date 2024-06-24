
window.MonoChromium = function (url) {
	var m = new Modal();
	m.className = "webbrowser monochromium";
	m.$m.className += " webbrowser monochromium";
	m.title("Elgoog MonoChrome");
	m.content(
		"<div class='bar'>" +
		"<button class='back'>&#x2190;</button>" +
		"<button class='forwards'>&#x2192;</button>" +
		"<button class='reload'>&#x21BB;</button>" +
		"<input spellcheck='false'/>" +
		"<button class='hotdog'>&equiv;</button>" +
		"</div>" +
		"<div class='iframe-wrapper'>" +
		"<iframe nwdisable nwfaketop nwUserAgent='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) MonoChrome/41.0.2228.0 Safari/537.36'>" +
		"</div>"
	);
	var $if = m.$("iframe");
	//$if.sandbox = "allow-scripts allow-same-origin";
	var $in = m.$("input");
	$in.value = url || "http://gmail.net/";
	$in.value = $if.src = urlize($in.value);
	function validate() {
		if ($if.contentWindow.history) {
			return true;
		} else {
			console.log("no history");
			return false;
		}
	}
	function urlize(str) {
		if (str.match(/^(\w+:\/?\/?)?/)) {
			return "http://" + $in.value.replace(/^\w+:\/?\/?/, "");
		}
	}
	m.$(".back").onclick = function () {
		if (!validate()) return;
		$if.contentWindow.history.go(-1);
	};
	m.$(".forwards").onclick = function () {
		if (!validate()) return;
		$if.contentWindow.history.go(1);
	};
	m.$(".reload").onclick = function () {
		if (!validate()) return;
		$if.contentWindow.history.go(0);
	};
	$in.onkeypress = function (e) {
		if (e.keyCode == 13) {
			$if.src = "http://" + $in.value.replace(/\w+:\/?\/?/, "");
			$in.value = $if.src;
		}
	};
	return m;
};
