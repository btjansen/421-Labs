/* SER 421 Lab 3
 *
 * Reference Attributes: Kevin Gary, Brad Dayley
 *
 * EJS Views referenced from:
 * https://github.com/kgary/ser421public/blob/master/NodeExpress/templates/express_templates.js
 *
 * Body-parser referenced from:
 * https://github.com/kgary/ser421public/blob/master/NodeExpress/express_post.js
 */

//Required Declarations
var express = require('express');
var bParse = require('body-parser');
var calc = require('./calc.js');

var calc = new calc();
var app = express();
app.set('views', 'html');
app.use(bParse.urlencoded({ extended: true }));

//Local variables
app.locals.calcValue = 0;
app.locals.opStack = [];

//Start Server listening on port 8088
app.listen(8088);
console.log("Server listening on 8088");


app.get('/', function(req, res) {

	//console.log("ran /")

});


// Post and Get methods for pop, response contains a JSON with the current calc value after the pop
app.get('/pop', function(req, res) {
	if(calc.getStack().length > 0) {
		calc.pop();
		app.locals.calcValue = calc.getCurrVal();
		app.locals.opStack = calc.getStack();

		var jsonData = "";

		req.on('data', function (chunk) {

	    	jsonData += chunk;

	  	});


	  req.on('end', function () {

	    var reqObj = JSON.parse(jsonData);

	    var resObj = {

	      value: app.locals.calcValue

	    };

	    res.writeHead(200);

	    res.end(JSON.stringify(resObj));


	  });
	} else {
		var resObj = {

	      error: "Stack is empty"

	    };

	    res.writeHead(500);

	    res.end(JSON.stringify(resObj));
	}
});

app.post('/pop', function(req, res) {
	if(calc.getStack().length > 0) {
		calc.pop();
		app.locals.calcValue = calc.getCurrVal();
		app.locals.opStack = calc.getStack();

		var jsonData = "";

		req.on('data', function (chunk) {

	    	jsonData += chunk;

	  	});


	  req.on('end', function () {

	    var reqObj = JSON.parse(jsonData);

	    var resObj = {

	      value: app.locals.calcValue

	    };

	    res.writeHead(200);

	    res.end(JSON.stringify(resObj));


	  });
	} else {

		var resObj = {

	      error: "Stack is empty"

	    };

	    res.writeHead(500);

	    res.end(JSON.stringify(resObj));
	}
});


//Post method for /add response returns a JSON with the calculator value after the add is complete
app.post('/add', function(req, res) {
	var userAgent = req.get('User-Agent');
	var op = '+';
	var ipAddr = req.ip;

	  var jsonData = "";

	  req.on('data', function (chunk) {

	    jsonData += chunk;

	  });

	  req.on('end', function () {

	    var reqObj = JSON.parse(jsonData);

	    calcOperation({operation:op, operand:parseInt(reqObj.number), ip:ipAddr, user:userAgent});

	    var resObj = {

	      value: app.locals.calcValue

	    };

	    res.writeHead(200);

	    res.end(JSON.stringify(resObj));


	  });

});

//Post method for /subtract response returns a JSON with the calculator value after the subtract is complete
app.post('/subtract', function(req, res) {
	var userAgent = req.get('User-Agent');
	var op = '-';
	var ipAddr = req.ip;
	var jsonData = "";

	req.on('data', function (chunk) {

	jsonData += chunk;

	});

	req.on('end', function () {

	var reqObj = JSON.parse(jsonData);

	calcOperation({operation:op, operand:parseInt(reqObj.number), ip:ipAddr, user:userAgent});

	var resObj = {

	  value: app.locals.calcValue

	};

	res.writeHead(200);

	res.end(JSON.stringify(resObj));


	});
});

//Get method for /reset returns the 200 status code after clearing the stack
app.get('/reset', function(req, res) {
	app.locals.calcValue = 0;
	app.locals.opStack = [];
	calc.reset();

	res.status(200);
	res.type('html');
	res.end();

});

//Get method for /history returns the current stack as a JSON
app.get('/history', function(req, res) {
	var resObj = {

	      stack: calc.getStack()

	   	};    

	res.status(200);
	res.type('html');
	res.end(JSON.stringify(resObj));
});

// 405 and 404 error handlers for incorrect method requests
app.get('/subtract', function(req, res) {

    var resObj = {

      error: "Cannot get /subtract"

    };

	res.status(405);
	res.type('html');
	res.end(JSON.stringify(resObj));
});

app.get('/add', function(req, res) {

    var resObj = {

      error: "Cannot get /add"

    };

	res.status(405);
	res.type('html');
	res.end(JSON.stringify(resObj));
});

app.post('/reset', function(req, res) {

    var resObj = {

      error: "Cannot post /reset"

    };

	res.status(405);
	res.type('html');
	res.end(JSON.stringify(resObj));	
});

app.all('/*', function(req, res) {

    var resObj = {

      error: "Cannot use the requested verb here!"

    };

	res.status(404);
	res.type('html');
	res.end(JSON.stringify(resObj));	
});

//runs a calculator operation
function calcOperation(dict) {
	calc.calc(dict);
	app.locals.calcValue = calc.getCurrVal();
	app.locals.opStack = calc.getStack();
}

function successPage(req, res) {
	app.render('success_page.html', function(error, data) {
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(200);
		res.type('html');
		res.send(data);
	});
}

function error500(req, res) {
	app.render('error_500.html', function(error, data) {
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(500);
		res.type('html');
		res.send(data);
	});
}

function error404(req, res) {
	app.render('error_404.html', function(error, data) {
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(404);
		res.type('html');
		res.send(data);
	});
}

function error405(req, res) {
	app.render('error_405.html', function(error, data) {
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(405);
		res.type('html');
		res.send(data);
	});
}
