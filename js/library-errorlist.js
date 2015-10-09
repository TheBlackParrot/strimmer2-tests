var strimmer_host = 'https://strimmer2.theblackparrot.us/api/1.0/';

var api = [];
api[0] = "";
api[1] = "";

function getStrimmerLibrary(callback) {
	var url = strimmer_host + 'fetch/tracks.php';
	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		dataType: 'json',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			library_data = data;
			if(typeof callback === "function") {
				callback(data);
			}
		},
		error: function() {
			console.log("error");
		}
	});
}

getStrimmerLibrary(function(data){
	var main_db = data.RETURN_DATA;

	var goodCodes = [302, 200, 201, 203];
	var serviceCodes = [500, 502, 503, 504];

	var check = "✓";
	var xmark = "✗";

	for(i in main_db) {
		var row = main_db[i];

		var responseCode = parseInt(row.LAST_API_RESPONSE_CODE);

		var isValid = 0;
		if(!isNaN(responseCode)) {
			if(goodCodes.indexOf(responseCode) == -1) {
				if(serviceCodes.indexOf(responseCode) != -1) {
					isValid = 2;
				} else {
					isValid = 0;
				}
			} else {
				isValid = 1;
			}
		} else {
			responseCode = "N/A";
			isValid = 3;
		}

		if(responseCode == null) {
			responseCode = "N/A";
			isValid = 3;
		}

		var element = $("<tr></tr>");
		switch(isValid) {
			case 0:
				element.css("color", "#F44336");
				element.css("background-color", "#FFEBEE");
				element.addClass("error");
				element.append('<td>' + xmark + " " + responseCode + '</td>');
				break;

			case 1:
				element.css("color", "#4CAF50");
				element.css("background-color", "#E8F5E9");
				element.addClass("good");
				element.append('<td>' + check + " " + responseCode + '</td>');
				break;

			case 2:
				element.css("color", "#2196F3");
				element.css("background-color", "#E3F2FD");
				element.addClass("service");
				element.append('<td>! ' + responseCode + '</td>');
				break;

			case 3:
				element.css("color", "#bbb");
				element.addClass("unknown");
				element.append('<td>? ' + responseCode + '</td>');
				break;
		}

		var index = parseInt(i)+1;
		element.append('<td>' + index + '</td>');
		element.append('<td>' + row.STRIMMER_ID + '</td>');
		element.append('<td>' + row.ARTIST + '</td>');
		element.append('<td>' + row.TITLE + '</td>');

		element.attr("code", responseCode);
		element.attr("s_id", row.STRIMMER_ID);
		element.attr("svc", row.SERVICE);

		$(".main_table").append(element);
	}
});

function removeStrimmerEntry(id, callback) {
	if(typeof id === "undefined") {
		return;
	}
	if(id == null) {
		return;
	}

	var url = strimmer_host + 'functions/remove.php?ID=' + encodeURI(id) + '&' + api[0] + '=' + api[1];
	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		dataType: 'text',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			if(typeof callback === "function") {
				callback(data);
			}
		},
		error: function(data) {
			console.log("error: unable to remove track??, AJAX error");
		}
	});
}

function addStrimmerReplacement(new_url, callback) {
	if(typeof new_url === "undefined") {
		return;
	}
	if(new_url == null) {
		return;
	}
	if(new_url == "") {
		return;
	}

	var tmp = document.createElement('a');
	tmp.href = new_url;
	var tmp_fix = tmp.hostname.replace("www.", "");

	var url = "";
	switch(tmp_fix) {
		case "soundcloud.com":
			url = strimmer_host + 'functions/add_soundcloud_track.php?url=' + encodeURI(new_url) + '&' + api[0] + '=' + api[1];
			break;

		case "youtu.be":
		case "youtube.com":
			url = strimmer_host + 'functions/add_youtube_track.php?url=' + encodeURI(new_url) + '&' + api[0] + '=' + api[1];
			break;
	}

	if(url == "") {
		return;
	}

	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		dataType: 'text',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			if(typeof callback === "function") {
				callback(data, 0);
			}
		},
		error: function(data) {
			if(typeof callback === "function") {
				callback(data.responseText, 1);
			}
		}
	});
}