function UrlExists(fileLocation)
{
	var exists = false;
	$.ajaxSetup({
		async: false
	});
	$.getJSON(fileLocation, function() {
	  exists = true;
	})
	.error(function() { /*fancy error reporting goes here*/ });
	return exists;
};