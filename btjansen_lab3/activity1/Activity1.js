//Required declarations
var express = require('express'),
    ejs = require('ejs');

var url = require('url');
var bodyParser = require('body-parser');
var app = express();
var tempVal;

//Variable to store the stack of operations, operands, ips and uas
var stack = new Array ();

//More required declarations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

//Start server listening on port 8001
app.listen(8001);
console.log("Server listening on port 8001");

//app.locals for the input number, current value, error message and operations stack
app.locals.number = null;
app.locals.currentVal = 0;
app.locals.errorMsg = '';
app.locals.stackEJS = stack;

//app.get for the homepage, renders the homepage with form.ejs
app.get('/', function(req, res){    
	res.render('form');    
});

//app.post for the / homepage to return correct status code and render error page error.ejs
app.post('/',function(req, res) {
	res.status(405);
	app.locals.errorMsg = 'Error 405 Method not allowed!';
	res.render('error');
});

//app.post for the /add page
app.post('/add',function(req, res){
	
	//Parses input as an integer, then adds it to the current value
	if(parseInt(req.body.value)) {
	    tempVal = parseInt(req.body.value);
	    app.locals.currentVal += tempVal;
	    
	    //reads the user agent and IP address from the request 
	    res.locals.ua = req.get('User-Agent');
	    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	    
	    //pushes the operation, operand, IP address and user agent to the stack then renders the success page add.ejs
	    stack.push(['add', tempVal, ip, res.locals.ua]);
	    app.locals.stackEJS = stack;
	    res.render('add');
	}
	
	//If input was not a number returns correct error status code and error page error.ejs
	else {
		app.locals.errorMsg = 'Error 400 Input was not an integer!';
		res.status(400);
		res.render('error');
	} 	
});

//app.get for /add page to return correct error status code and page
app.get('/add',function(req, res) {
	res.status(405);
	app.locals.errorMsg = 'Error 405 Method not allowed!';
	res.render('error');
});

//app.post for the /subtract page
app.post('/subtract',function(req, res){

	//Parses input as an integer, then subtracts it from the current value
	if(parseInt(req.body.value)) {
		tempVal = parseInt(req.body.value);
	    app.locals.currentVal -= tempVal;
	    
	    //reads the user agent and IP address from the request 
	    res.locals.ua = req.get('User-Agent');
	    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	    
	    //pushes the operation, operand, IP address and user agent to the stack then renders the success page add.ejs
	    stack.push(['subtract', tempVal, ip, res.locals.ua]);
	    app.locals.stackEJS = stack;
		res.render("add");
	}
	
	//If input was not a number returns correct error status code and error page error.ejs
	else {
		app.locals.errorMsg = 'Error 400 Input was not an integer!';
		res.status(400);
		res.render('error');
	}

});

//app.get for /subtract page to return correct error status code and page
app.get('/subtract',function(req, res) {
	res.status(405);
	app.locals.errorMsg = 'Error 405 Method not allowed!';
	res.render('error');
})

//app.post for the /pop page
app.post('/pop',function(req, res){
	
	//If the stack is not empty then pop
	if(stack.length > 0) {
		
		//Set calc to the operation and value to the operand that will be popped from the stack, then pop
	    var calc = stack[stack.length-1][0];
	    var value = stack[stack.length-1][1];
	    stack.pop();
	    
	    //Do the opposite operation from what was popped off the stack and render the success page add.ejs
	    if(calc == 'add') {
	    	app.locals.currentVal -= value;
	    }
	    else if(calc == 'subtract') {
	    	app.locals.currentVal += value;
	    }
		res.render("add");
	}
	
	//If stack is empty return correct error status code and error page error.ejs
	else {
		res.status(405);
		app.locals.errorMsg = 'Stack is empty!';
		res.render('error');
	}

});

//app.get for the /pop page
app.get('/pop',function(req, res){
	
	//If the stack is not empty then pop
	if(stack.length > 0) {
		
		//Set calc to the operation and value to the operand that will be popped from the stack, then pop
	    var calc = stack[stack.length-1][0];
	    var value = stack[stack.length-1][1];
	    stack.pop();
	    
	    //Do the opposite operation from what was popped off the stack and render the success page add.ejs
	    if(calc == 'add') {
	    	app.locals.currentVal -= value;
	    }
	    else if(calc == 'subtract') {
	    	app.locals.currentVal += value;
	    }
		res.render("add");
	}
	
	//If stack is empty return correct error status code and error page error.ejs
	else {
		res.status(405);
		app.locals.errorMsg = 'Stack is empty!';
		res.render('error');
	}
});

//app.get for the /reset page
app.get('/reset',function(req, res){
	
	//clear the stack and current value then render the homepage with form.ejs
	stack = [];
	app.locals.stackEJS = stack;
	app.locals.currentVal = 0;
	res.render('form');
});

//app.post for the /reset page to return the correct error status code and error page error.ejs
app.post('/reset',function(req, res) {
	res.status(405);
	app.locals.errorMsg = 'Error 405 Method not allowed!';
	res.render('error');
});
