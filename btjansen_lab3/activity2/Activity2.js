//Required declarations
var express = require('express'),
    ejs = require('ejs');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var options = {encoding:'utf8', flag:'r'};
//var read1 = false;
//var read2 = false;
//Array for storing the answers of the current survey
var answers = [null];
//Array for storing the questions and answers loaded in
var questions;
//JSON object that stores all previous user answers
var allAnswersObj;
//Boolean for the one minute timer
var oneMinBool = false;

//Required declarations and setting up the session
app.use(cookieParser());
app.use(session({
	secret: 'SECRETKEY',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

//Reads in the survey file and saves it
function readQuestionsPromise() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./survey.txt', options, function(err, data){
			  if (err){
				 reject();
			    console.log("Failed to open Config File.");
			  } 
			  else {
			        questions = data.split("\r\n\r\n");
			        for(var i = 0; i < questions.length;i++){
			            
			            questions[i] = questions[i].split("\r\n");
			            
			        }
			        resolve();			      
				}
			});
	});
}

//Reads in stored responses file and saves it
function readJSONPromise() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./answers.txt', options, function(err, data){
		    
		    if(err){
		        
		        reject();
		        console.log("Failed to open Config File.");
		        
		    }
		    else{
		        allAnswersObj = JSON.parse(data);
		        
		    }
		});
	});
}

//Promises to ensure the questions are read in before the server starts listening
var questionsPromise = readQuestionsPromise();
var jsonPromise = readJSONPromise();
questionsPromise.then(function() {
		app.locals.name = null;
		app.listen(8001);
		console.log("Server listening on port 8001");
});
jsonPromise;

//app.get for the '/' homepage, renders homepage.ejs and sets the session questionCount to 0
app.get('/', function(req, res){
	req.session.questionCount = 0;
	res.render('homepage');	
	
	//Sets default rendering to horizontal
	app.locals.rendering = 0;
    
});

//app.post for the '/' homepage, returns the correct error status code and error page error.ejs
app.post('/',function(req, res) {
	res.status(405);
	app.locals.errorMsg = 'Error 405 Method not allowed!';
	res.render('error');
});

//app.post for the /survey page, where users will answer survey questions
app.post('/survey', function(req, res) {
	req.session.questionCount++;
	
	//If this is the 1st question being asked
	if(req.session.questionCount == 1) {
		
		//If block for when the rendering options are changed
		if(req.body.option != undefined) {
			app.locals.rendering = req.body.option;
			req.session.questionCount--;
		};
		
		//Stores the username
		app.locals.name = req.body.username;
		
		//Set one minute timer and reset timer boolean from any previous attempt
		oneMinTimer = setTimeout(oneMinute, 60000);
		oneMinBool = false;		
		
		//Reads the current question, question number and possible responses
		app.locals.question = questions[req.session.questionCount-1].shift();
		app.locals.answers = questions[req.session.questionCount-1];
		app.locals.pageNum = req.session.questionCount;	
		
		//If block for if one minute has passed, renders the survey timeout page timeout.ejs
		if(oneMinBool) {
			res.render('timeout');
			questions[req.session.questionCount-1].unshift(app.locals.question);
		}
		
		//Else block if the one minute timer has not passed yet, renders the first question page surveyQuestion1.ejs
		else {
			res.render('surveyQuestion1');
			questions[req.session.questionCount-1].unshift(app.locals.question);
		}
	}
	
	//Else if block for questions 2 - final
	else if(req.session.questionCount <= questions.length) {
		
		//If block for when the rendering options are changed
		if(req.body.option != undefined) {
			app.locals.rendering = req.body.option;
			req.session.questionCount--;
		};
		
		//Stores answer to previous question
		answers[req.session.questionCount -2] = req.body.answer;
		
		//Reads the current question, question number and possible responses
		app.locals.question = questions[req.session.questionCount-1].shift();
		app.locals.answers = questions[req.session.questionCount-1];
		app.locals.pageNum = req.session.questionCount;		
		
		//If block for if one minute has passed, renders the survey timeout page timeout.ejs
		if(oneMinBool) {
			res.render('timeout');
			questions[req.session.questionCount-1].unshift(app.locals.question);
		}
		
		//Else block if the one minute timer has not passed yet, renders the question page surveyQuestion.ejs
		else {
			res.render('surveyQuestion');
			questions[req.session.questionCount-1].unshift(app.locals.question);
		}
	}
	
	//Else block for after the last question has been answered
	else {	
		
		//Stores answer to previous question
		answers[req.session.questionCount -2] = req.body.answer;
		
		//Boolean used to search for the same username
		var isFound = false;
		
		//If block for if one minute has passed, renders the survey timeout page timeout.ejs
		if(oneMinBool) {
			res.render('timeout');
		}
		
		//Else block that clears the timer then saves the users responses
		else {
			clearTimeout(oneMinTimer);
			
			//Loops through saved responsed looking for the identical username and updates their responses
			for(var i = 0; i < allAnswersObj.answers.length; i++){			    
			    if(allAnswersObj.answers[i].name == app.locals.name){			        
			        allAnswersObj.answers[i].response = answers;
			        isFound = true;			        
			    }			    
			}
			
			//If username is not found then write a new entry
			if(!isFound){			    
			    allAnswersObj.answers.push(JSON.parse('{"name": "' + app.locals.name + '", "response":[' + answers  + ']}'));			    
			}	
			
			//Writes to the file answers.txt to keep a record of all completed surveys
			fs.writeFile("./answers.txt", JSON.stringify(allAnswersObj), function(err) {
	            if (err) {
	                console.log(err);
	            }
	        });
			
			//Renders the survey completed page finalpage.ejs
			res.render('finalpage');
		}
	}	 		       	
});

//app.get for the /survey page, returns the correct error status code and error page error.ejs
app.get('/survey',function(req, res) {
	res.status(405);
	app.locals.errorMsg = 'Error 405 Method not allowed!';
	res.render('error');
});

//app.post for the /prev page which is used by the 'previous' button
app.post('/prev', function(req, res) {
	
	//Renders the previous /survey page as a /prev page if it is the first question page
	req.session.questionCount = req.session.questionCount - 1;	
	if(req.session.questionCount == 1) {
		app.locals.question = questions[req.session.questionCount-1].shift();
		app.locals.answers = questions[req.session.questionCount-1];
		app.locals.pageNum = req.session.questionCount;		
		
		//If block for if one minute has passed, renders the survey timeout page timeout.ejs
		if(oneMinBool) {
			res.render('timeout');
			questions[req.session.questionCount-1].unshift(app.locals.question);
		}
		
		//Else block if the one minute timer has not passed yet, renders the previous question page surveyQuestion1.ejs
		else {
			res.render('surveyQuestion1');
			questions[req.session.questionCount-1].unshift(app.locals.question);
		}
	}
	
	//Renders the previous /survey page as a /prev page if it is not the first question page
	else if(req.session.questionCount <= questions.length) {
		app.locals.question = questions[req.session.questionCount-1].shift();
		app.locals.answers = questions[req.session.questionCount-1];
		app.locals.pageNum = req.session.questionCount;		
		
		//If block for if one minute has passed, renders the survey timeout page timeout.ejs
		if(oneMinBool) {
			res.render('timeout');
			questions[req.session.questionCount-1].unshift(app.locals.question);
		}
		
		//Else block if the one minute timer has not passed yet, renders the previous question page surveyQuestion.ejs
		else {
			res.render('surveyQuestion');
			questions[req.session.questionCount-1].unshift(app.locals.question);
		}
	}
});

//app.get for the /prev page, returns the correct error status code and error page error.ejs
app.get('/prev',function(req, res) {
	res.status(405);
	app.locals.errorMsg = 'Error 405 Method not allowed!';
	res.render('error');
});

//app.post for the /match page to show potential matches in order
app.post('/match', function(req, res) {

	//reads the updated answers.txt file to store all the previous user answers
	fs.readFile('./answers.txt', options, function(err, data){		    
        if(err){		        
		    reject();
		    console.log("Failed to open Config File.");		        
		}
		else{
		    allAnswersObj = JSON.parse(data);		        
		}
    });
	
	//Loops through all the previous user surveys to compare them to the most recently completed survey
    var matchCounter = 0;
    var matchList = [];
    for(var i = 0; i < allAnswersObj.answers.length; i++){                
        if(app.locals.name != allAnswersObj.answers[i].name){
            for(var x = 0; x < allAnswersObj.answers[i].response.length; x++){
                if(allAnswersObj.answers[i].response[x] == answers[x]){
                    
                    matchCounter++;
                    
                }
                
            }
            matchList.push([allAnswersObj.answers[i].name,matchCounter]);
            matchCounter = 0;
            
        }
    }
    
    //sorts the list of users by how many questions they answered the same from highest to lowest
    matchList.sort(function(a, b){return b[1] - a[1]});
    app.locals.matches = matchList;
    
    //renders the /match page populated with the data using matches.ejs
    res.render('matches');
});

//app.get for /match page, returns the correct error status code and error page error.ejs
app.get('/match',function(req, res) {
	res.status(405);
	app.locals.errorMsg = 'Error 405 Method not allowed!';
	res.render('error');
});

//app.get for the /render page to render the page showing horizontal or vertical rendering options with render.ejs
app.get('/render',function(req, res) {
	res.render('render');
});

//Function called at the one minute mark to fail the survey
function oneMinute(){	
	oneMinBool = true;
}
