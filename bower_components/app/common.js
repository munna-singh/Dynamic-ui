$(document)
    .ready(function() {
		
		Storage.prototype.setObject = function(key, value) {
			window.localStorage.setItem(key, JSON.stringify(value));
		},

		Storage.prototype.getObject = function(key) {
					var value = window.localStorage.getItem(key);
					return value && JSON.parse(value);
		}
	});

function btnSpin(q) {
    var spinclass = "\"fa fa-spinner fa-spin\"";
    var spin = "<i class= " + spinclass + "></i>";
    var a = $("#" + q);

    a.append(spin);
    document.getElementById(q).disabled = true;
}


