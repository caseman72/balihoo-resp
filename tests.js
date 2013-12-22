var request = require("supertest")
request = request("http://localhost:3030");

var tests = [
	// 0
	{
		q: ' ABCD\nA=---\nB<---\nC>---\nD-->-\n',
		a: ' ABCD\nA=><<\nB<=<<\nC>>=<\nD>>>=\n'
	},
	// 1
	{
		q: ' ABCD\nA-->-\nB-=--\nC->--\nD-<--\n',
		a: ' ABCD\nA=>>>\nB<=<>\nC<>=>\nD<<<=\n'
	},
	// 2
	{
		q: ' ABCD\nA=---\nB<---\nC--->\nD>---\n',
		a: ' ABCD\nA=><<\nB<=<<\nC>>=>\nD>><=\n'
	},
	// 3
	{
		q: ' ABCD\nA--<-\nB-->-\nC--=-\nD->--\n',
		a: ' ABCD\nA=<<<\nB>=><\nC><=<\nD>>>=\n'
	},
	// 4
	{
		q: ' ABCD\nA->--\nB-->-\nC--=-\nD--<-\n',
		a: ' ABCD\nA=>>>\nB<=>>\nC<<=>\nD<<<=\n'
	},
	// 5
	{
		q: ' ABCD\nA-<--\nB-=--\nC->--\nD-->-\n',
		a: ' ABCD\nA=<<<\nB>=<<\nC>>=<\nD>>>=\n'
	},
	// 6
	{
		q: ' ABCD\nA-->-\nB--<-\nC--=-\nD>---\n',
		a: ' ABCD\nA=>><\nB<=<<\nC<>=<\nD>>>=\n'
	},
	// 7
	{
		q: ' ABCD\nA-<--\nB-=--\nC->--\nD-->-\n',
		a: ' ABCD\nA=<<<\nB>=<<\nC>>=<\nD>>>=\n'
	},
	// 8
	{
		q: ' ABCD\nA->--\nB-=--\nC>---\nD-<--\n',
		a: ' ABCD\nA=><>\nB<=<>\nC>>=>\nD<<<=\n'
	},
	// 9
	{
		q: ' ABCD\nA-->-\nB>---\nC--=-\nD--<-\n',
		a: ' ABCD\nA=<>>\nB>=>>\nC<<=>\nD<<<=\n'
	},
	// 10
	{
		q: ' ABCD\nA--<-\nB--->\nC--=-\nD-->-\n',
		a: ' ABCD\nA=<<<\nB>=>>\nC><=<\nD><>=\n'
	},
	// 11
	{
		q: ' ABCD\nA--<-\nB--->\nC--=-\nD-->-\n',
		a: ' ABCD\nA=<<<\nB>=>>\nC><=<\nD><>=\n'
	},
	// 12
	{
		q: ' ABCD\nA--->\nB---<\nC>---\nD---=\n',
		a: ' ABCD\nA=><>\nB<=<<\nC>>=>\nD<><=\n'
	},
	// 13
	{
		q: ' ABCD\nA=---\nB>---\nC->--\nD<---\n',
		a: ' ABCD\nA=<<>\nB>=<>\nC>>=>\nD<<<=\n'
	}
];


for(var i = 0, n = tests.length; i<n; i++) {
	//console.log(i);
	//console.log(tests[i].q);
	//console.log(tests[i].a);
	request.get("/?q=Puzzle&d=Please+solve+this+puzzle%3A%0A"+encodeURIComponent(tests[i].q))
		.expect(200, tests[i].a)
		.end(function(err, res) {
			if (err) throw err;
//			console.log(decodeURIComponent(res.req.path));
//			console.log(res.text);
		});
}
