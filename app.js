require("string-utils-cwm");
var express = require("express");

// this app's secret config values - don't print/log
var config = {
	server_port: process.env.VCAP_APP_PORT || "3030",
	node_debug: process.env.NODE_DEBUG ? true : false
};

// apache log format
var short_month = function(index) {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months[index].slice(0,3);
};

var pad_zeros = function(int) {
	return ((+int < 10 ? "0" : "")+int);
};

var apache_log = function(req, res, len) {
	var time_stamp = new Date();
	var combined_log = '{ip} - - [{day}/{mon}/{year}:{hour}:{min}:{sec} {tz}] \"{method} {url} HTTP{s}/{v}" {code} {len} "{referer}" "{ua}"'.format({
		ip: req.headers["x-forwarded-for"] && req.headers["x-forwarded-for"].replace(/[ ]+|(?:,\s*127\.0\.0\.1)/g, "") || req.connection.remoteAddress || "127.0.0.1",
		day: pad_zeros(time_stamp.getUTCDate()),
		mon: short_month(time_stamp.getMonth()),
		year: time_stamp.getUTCFullYear(),
		hour: pad_zeros(time_stamp.getUTCHours()),
		min: pad_zeros(time_stamp.getUTCMinutes()),
		sec: pad_zeros(time_stamp.getUTCSeconds()),
		tz: "+0000",
		method: req.method,
		url: req.url,
		s: req.connection.encrypte ? "S" : "",
		v: req.httpVersion,
		code: res.statusCode,
		len: len || "-",
		referer: req.headers["referer"] || req.headers["referrer"] || "-",
		ua: req.headers["user-agent"]
	});

	// log to stdout
	console.log( combined_log );
};


var app = express();
app.configure(function() {
	app
		.use(express.errorHandler({dumbExceptions: true}))
		.disable("etag");
});

app.get("*", function(req, res) {
	res.set("Content-Type", "text/plain");

	var q = req.query.q || "";

	if (q === "Ping") {
		res.send("OK");
	}
	else if (q === "Status") {
		res.send("YES");
	}
	else if (q === "Referrer") {
		res.send("http://careers.stackoverflow.com/jobs/45751/senior-scala-software-developer-on-an-incredible-balihoo");
	}
	else if (q === "Source") {
		res.send("https://github.com/caseman72/balihoo-resp");
	}
	else if (q === "Email Address") {
		res.send("casey@manion.com");
	}
	else if (q === "Name") {
		res.send("Casey Manion");
	}
	else if (q === "Phone") {
		res.send("425-214-3464");
	}
	else if (q === "Years") {
		res.send("7");
	}
	else if (q === "Position") {
		res.send("Senior Software Developer");
	}
	else if (q === "Degree") {
		var degrees = [
			"Oregon State University Corvallis, Oregon                            ",
			"Bachelor of Science, Computer Science, summa cum laude, 2003–2005    ",
			"Bachelor of Science, Chemical Engineering, magna cum laude, 1990–1994"
		];
		res.send(degrees.join("\n"));
	}
	else if (q === "Puzzle") {
		var answer = [
			["A", "=", "-", "-", "-"],
			["B", "-", "=", "-", "-"],
			["C", "-", "-", "=", "-"],
			["D", "-", "-", "-", "="]
		];

		var letter_char = {A: "=", B: "=", C: "=", D: "="};
		var rev_char = {"<":">", ">":"<", "=": "="};

		//q: 'Puzzle',
		//d: 'Please solve this puzzle:\n ABCD\nA=---\nB>---\nC->--\nD<---\n'
		var d = req.query.d || "";
		var parts = d.split("\n").slice(2,6);

		// find char and lock in position
		for (var i=0; i<4; i++) {
			var letter = answer[i][0];
			for (var j=1; j<5; j++) {
				var char = parts[i][j];
				if (char === ">" || char === "<") {
					letter_char[letter] = char; //{char: char, pos: j};
					answer[i][j] = char + "$";
				}
			}
		}

		// do all the other chars 
		for (var i=0; i<4; i++) {
			var letter = answer[i][0];
			for (var j=1; j<5; j++) {
				if (answer[i][j] !== "=" && answer[i][j].length === 1) {
					var char = letter_char[ answer[j-1][0] ];
					answer[i][j] = char === "=" ? letter_char[letter] : rev_char[ char ]; 
				}
			}
		}

		// send anaser
		res.send(" ABCD\n{0}\n{1}\n{2}\n{3}\n".format(answer[0].join(""), answer[1].join(""), answer[2].join(""), answer[3].join("")).replace(/\$/g, ""));
	}
	else {
		var host = req.headers.host || "localhost";
		res.send("Hello World! ({0})".format(host));
	}

	console.log(req.headers);
	console.log(req.query);

	// log - always 200's
	apache_log(req, res, res._headers["content-length"]);
});

app.listen(config.server_port, function(){ console.log("Listening on {0}".format(config.server_port)); });

