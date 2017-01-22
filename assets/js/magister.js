$(function () {
	$.ajaxSetup({beforeSend: function(xhr){
		if (xhr.overrideMimeType)
		{
			xhr.overrideMimeType("application/json");
		}
	}
	}); //Changes JSON MIME-type to text/JSON instead of text/plain

	var dim = false;

	var work = false;
	var time;

	var preLabcoat = "assets/images/kurisu_labcoat/CRS_B";
	var preJacket = "assets/images/kurisu_jacket/CRS_A";

	var timeUpdate = function() {
		var curTime = new Date().getHours();
		var curMin = new Date().getMinutes();
		var day = new Date().getDay();
		if(curTime >= 6 && curTime < 10) {
			time = "dawn";
		} else if(curTime >= 10 && curTime < 18) {
			time = "day";
		} else if(curTime >= 18 && curTime < 22) {
			time = "dusk";
		} else if(curTime >= 22 || curTime < 6) {
			time = "night";
		}

		if(day >= 1 && day <= 5 && curTime > 7 && curTime < 18) {
			work = true;
		} else {
			work = false;
		}

		console.log(day+ " " +curTime + ":" + curMin);

		if(day == 6 || day == 7) {
			work = false
		} else if(day == 1 && curTime >= 8 && curTime <= 15) {
			work = true;
		} else if(day == 2 && curTime >= 8 && curTime <= 15) {
			work = true;
		} else if(day == 3 && curTime >= 8 && curTime <= 13) {
			work = true;
		} else if(day == 4 && curTime >= 8 && curTime <= 16) {
			work = true;
		} else if(day == 5 && curTime >= 8 && curTime <= 17 && dim) {
			work = true;
		} else {
			work = false;
		}
	}

	var spriteUpdate = function(mood) {

		$.getJSON("assets/data/sprites.json", function(data) {
			console.log("mood: " + mood);
			var sprites;
			if(mood == "happy") {
				sprites = data.happy;
			} else if(mood == "angry") {
				sprites = data.angry;
			} else if(mood == "disappointed") {
				sprites = data.disappointed;
			} else if(mood == "shy") {
				sprites = data.shy;
			} else if(mood == "surprised") {
				sprites = data.surprised;
			} else if(mood == "worried") {
				sprites = data.worried;
			} else {
				sprites = data.happy;
			}
			var pre;
			if(work) {
				pre = preLabcoat;
			} else {
				pre = preJacket;
			}

			$("#christina").css("background-image", "url(" + pre + sprites[getRandomInt(0, sprites.length-1)] + ")");
		});
	}

	var getIP = function(first) {

		$("#country").html("Неизвестный");
		$("#ip").html("Неизвестный");

		$.getJSON("http://ip-api.com/json", function(response){

			$.getJSON("assets/data/ipWarning.json", function(data) {
				var safe;
				if(response.country == "") {
					safe = data.good;
					$("#country").html("不明");
					$(".api").css("color", "green");
					if(!first) {spriteUpdate("happy");}
					// Enter your country here, to be warned we you browse from there!
					// This is for poeple using a VPN or Tor.
				} else if(response.country == "USA") {
					safe = data.bad;
					$("#country").html(response.country);
					$(".api").css("color", "red");
					spriteUpdate("worried");
					first = false;
				} else {
					safe = data.good;
					$("#country").html(response.country);
					$(".api").css("color", "green");
					if(!first) {spriteUpdate("happy");}
				}
				if(!first) {$("#phrase").html(safe[getRandomInt(0, safe.length-1)]);}
			});

			$("#ip").html(response.query);
		});
	}

	$("#btnCheckIp").click(function() {
			getIP();
	});

	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	var greet = function() {
		timeUpdate();
		$.getJSON("assets/data/greetings.json", function(data) {
			var greetings;
			if(time == "dawn") {
				greetings = data.dawn;
			} else if(time == "day") {
				greetings = data.day;
			} else if(time == "dusk") {
				greetings = data.dusk;
			} else if(time == "night") {
				greetings = data.night;
			}
			$(".greetingHeader").html(greetings.headline);
			$("#phrase").html(greetings.texts[getRandomInt(0, greetings.texts.length-1)]);
		});
		if(time == "night") {
			spriteUpdate("disappointed");
		} else {
			spriteUpdate("happy");
		}
	}

	$("#christina").click(function() {

		if($("#links").hasClass("disabled")) {

			$("#conversation").toggleClass("kakureta");

			setTimeout(function() {
				$("#conversation").toggleClass("disabled");
				$("#links").toggleClass("disabled");
				setTimeout(function() {
					$("#links").toggleClass("kakureta");
				}, 500);

			}, 500);
		} else {
			$("#links").toggleClass("kakureta");
			setTimeout(function() {
				$("#links").toggleClass("disabled");
				$("#conversation").toggleClass("disabled");
				setTimeout(function() {
					$("#conversation").toggleClass("kakureta");
				}, 500);
			}, 500);
		}





	});

	greet();
	getIP(true);

});
