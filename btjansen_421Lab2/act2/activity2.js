//Variable to require http
var http = require('http');
//Variables to save the name and current response
var name;
var response;
//Variable to track when a new conversation starts
var newCounter = true;
//Variable to save the JSON
var inputMap;
//Variables to save the cleaned up response
var cleanedAnswer;
var wordArray;
//Variable tracking if 2 minutes have passed
var twoMinBool = false;
//Array to track which keywords were found in the last response
var matches = [false,false,false,false,false,false];
//Variable to count how many keywords were found in the last response
var trueCounter;
//Variables to save the currently chosen answer and question as strings
var chosenAnswer = "";
var chosenQuestion = "";
//Variable for storing the conversation log as a string
var logString = "";
//Variable for the two minute timer
var twoMinTimer;
//Variable required for reading in the JSON file
var fs = require('fs');
var options = {encoding:'utf8', flag:'r'};

//Reads in the default JSON file and saves it
fs.readFile('./default.json', options, function(err, data){
  if (err){
    console.log("Failed to open Config File.");
  } 
  else {
    console.log("Config Loaded.");
    inputMap = JSON.parse(data);
	}
});

//Creates the server listening on port 8001
http.createServer(function(req, res) {
	
	//Opens the /new page when a GET request is received
	if (req.method == "GET") {
		res.writeHead(200,{Location:'http://localhost:8001/new'});
    	res.end("<html><head></head><body><p>Hi, my name is Eliza! What is your name?</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>");
    } 
	
	//Else block for when a POST request is received
	else {
        var reqContent = "";
        req.on('data', function (chunk) {
            reqContent += chunk;
        });
        
        req.on('end', function (chunk) {

        	//Checks if a new conversation should be started
            if(newCounter){
            	
            	//Logs the opening question, then saves the input name and logs it
            	logString += "Hi, my name is Eliza! What is your name?";
            	name = reqContent.substring(5,reqContent.length);
            	logString += "<br />" + name;
                newCounter = false;
                
                //Sets up the two minute interval timer
            	twoMinTimer = setInterval(twoMinutes, 120000);
                
                //Responds with a random question from the 'other' category and logs it
                res.writeHead(200);
            	chosenQuestion = inputMap.entries[5].question[Math.trunc(Math.random()*inputMap.entries[5].question.length)];
            	logString +=  "<br />" + chosenQuestion;            	
                res.end("<html><head></head><h1>Hi " + name + "</h1><body><p>" + chosenQuestion + "</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>")
            }
            
            //Else block for continuing the conversation
            else {
            	
            	//Cleans the response of the 'name=' then parses and logs it
            	response = reqContent.substring(5,reqContent.length);
            	getMatches(response);
            	numMatches();

            	//If the response contained no valid keywords
            	if (trueCounter == 0) {
            		
            		//Chose a random answer from the 'other' block then log it
            		chosenAnswer = inputMap.entries[5].answer[Math.trunc(Math.random()*inputMap.entries[5].answer.length)];
            		logString +=  "<br />" + chosenAnswer;
            		
            		//Chose a random question from the 'other' block
            		chosenQuestion = inputMap.entries[5].question[Math.trunc(Math.random()*inputMap.entries[5].question.length)];
            		//logString +=  "<br />" + chosenQuestion;
            		
            		//Checks if 2 minutes have passed and asks the appropriate question
            		if(twoMinBool) {
            			chosenQuestion = "You sure can talk. I need some coffee - join me at Dunkin, " + name + "?";
            			logString +=  "<br />" + chosenQuestion; 
            			twoMinBool = false;
            			res.end("<html><head></head><h1>Hi " + name + "</h1><body><p>" + chosenAnswer + "</p><p>" + chosenQuestion + "</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>")
            		}
            		
            		//Logs the chosen question then returns a new page with the chosen answer and question
            		else {
            			logString +=  "<br />" + chosenQuestion; 
            			//Writes a new page back with the name, and chosen answer and question
                        res.end("<html><head></head><h1>Hi " + name + "</h1><body><p>" + chosenAnswer + "</p><p>" + chosenQuestion + "</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>");
            		}            			
            	}
            	
            	//If the response contained 1 valid keyword
            	else if (trueCounter == 1) {
            		
            		//Searches the matches array to find which dictionary the keyword referred to
            		var entryNum = 0;
                    for(var i = 0; i < matches.length; i++){           
                        if(matches[i] == true){
                            entryNum = i;            
                        }            
                    }
                    
                    //Chose a random answer from the category of the response keyword and log it
                    chosenAnswer = inputMap.entries[entryNum].answer[Math.trunc(Math.random()*inputMap.entries[entryNum].answer.length)];
                    logString +=  "<br />" + chosenAnswer;
                    
                    //Chose a random question from the category of the response keyword
                    chosenQuestion = inputMap.entries[entryNum].question[Math.trunc(Math.random()*inputMap.entries[entryNum].question.length)];
                    //logString +=  "<br />" + chosenQuestion;
                    
            		//Checks if 2 minutes have passed and asks the appropriate question
            		if(twoMinBool) {
            			chosenQuestion = "You sure can talk. I need some coffee - join me at Dunkin, " + name + "?";
            			logString +=  "<br />" + chosenQuestion; 
            			twoMinBool = false;
            			res.end("<html><head></head><h1>Hi " + name + "</h1><body><p>" + chosenAnswer + "</p><p>" + chosenQuestion + "</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>")
            		}
            		
            		//Logs the chosen question then returns a new page with the chosen answer and question
            		else {
            			logString +=  "<br />" + chosenQuestion; 
            			//Writes a new page back with the name, and chosen answer and question
                        res.end("<html><head></head><h1>Hi " + name + "</h1><body><p>" + chosenAnswer + "</p><p>" + chosenQuestion + "</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>");
            		}
            	}
            	
            	//Else block for when the response contains more than 1 valid keyword
            	else {
            		
            		//Loop to count up the total possible answers based on the specific keywords in the response
            		var numPossibleAnswers = 0;
                    var numPossibleQuestions = 0;
                    for(var i = 0; i < matches.length; i++){             
                        if(matches[i] == true){             
                           numPossibleAnswers += inputMap.entries[i].answer.length;
                           numPossibleQuestions += inputMap.entries[i].question.length;             
                        }             
                    }
             
                    //Chooses a random answer and question from the list of all possible based on valid keywords
                    var answerChoice = Math.trunc(Math.random() * numPossibleAnswers);
                    var questionChoice = Math.trunc(Math.random() * numPossibleQuestions);
             
                    //Loops through possible answers to locate the one chosen
                    for(var i = 0; i < matches.length; i++){
             
                        if(matches[i] == true){             
                            if(answerChoice >= inputMap.entries[i].answer.length){             
                                 answerChoice -= inputMap.entries[i].answer.length;            
                            }
                            
                            //Else if block to stop duplicate answers
                            else if(answerChoice == -1) {
                         	   //do nothing
                            }
             
                            //Located answer is saved and logged
                            else{
                            	chosenAnswer = inputMap.entries[i].answer[answerChoice];
                            	logString +=  "<br />" + chosenAnswer;
                            	answerChoice = -1;             
                            }             
                        }             
                    }
             
                    //Loops through possible questions to find the chosen one
                    for(var i = 0; i < matches.length; i++){
             
                        if(matches[i] == true){             
                            if(questionChoice >= inputMap.entries[i].question.length){             
                                questionChoice -= inputMap.entries[i].question.length;             
                            }
                            
                          //Else if block to stop duplicate questions
                            else if(questionChoice == -1) {
                         	   //do nothing
                            }
                          //Located question is saved
                            else{
                            	chosenQuestion = inputMap.entries[i].question[questionChoice];
                            	//logString +=  "<br />" + chosenQuestion;
                                questionChoice = -1;
                            }             
                        }             
                    }
                    
            		//Checks if 2 minutes have passed and asks the appropriate question
            		if(twoMinBool) {
            			chosenQuestion = "You sure can talk. I need some coffee - join me at Dunkin, " + name + "?";
            			logString +=  "<br />" + chosenQuestion;
            			twoMinBool = false;
            			res.end("<html><head></head><h1>Hi " + name + "</h1><body><p>" + chosenAnswer + "</p><p>" + chosenQuestion + "</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>")
            		}
            		
            		//Logs the chosen question then returns a new page with the chosen answer and question
            		else {
            			logString +=  "<br />" + chosenQuestion;
            			//Saved answer and question are returned on a new page
                        res.end("<html><head></head><h1>Hi " + name + "</h1><body><p>" + chosenAnswer + "</p><p>" + chosenQuestion + "</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>");            		
            		}
                    
            	}            	
            }            
        });
    }
	
	//Function called every two minutes to ask the specified question
	function twoMinutes(){		
		//console.log("two minutes");
		twoMinBool = true;
	}
	
	//Function called to parse the response and check for valid keywords
	var getMatches = function(string) {
		
		//Clears the previous version of the matches array
	    for (var i = 0; i < matches.length; i++){	        
	        matches[i] = false;
	    }
	    
	    //If response is 'quit' then sends the user back to the /new page to start a new conversation, also clears the log of the previous conversation
	    if(string == 'quit') {
	        //notQuit = false;
	    	newCounter = true;
	    	logString = "";
	        res.writeHead(301,{Location:'http://localhost:8001/new'});
	    }
	    
	    //Clears the two minute interval timer if 'maybe' is the response
	    else if(string == 'maybe') {
	    	clearInterval(twoMinTimer);
	    }
	    
	    //If the response is 'log' then sends the user a page with the current conversation log and asks a new random question from the 'other' category
	    else if(string == 'log') {
	    	logString +=  "<br />" + "log";
	    	chosenQuestion = inputMap.entries[5].question[Math.trunc(Math.random()*inputMap.entries[5].question.length)];
	    	res.writeHead(200);
	    	res.end("<html><head></head><h1>Hi " + name + " here is the log:</h1><body><p>" + logString + "</p><p>" + chosenQuestion + "</p><form action=\"/chat\" method=\"POST\"><input type=\"text\" name=\"name\"/><input type=\"submit\" value=\"OK\"></form></body></html>")
	    }
	    
	    //If the response is neither 'quit' nor 'log' then prepares to continue the conversation
	    else{	        
	        res.writeHead(200);	        
	    }
		
	    //Cleans the response and logs it, then stores it in an array to compare to the valid keywords
		cleanedAnswer = string.replace(/[!"#$%&'()*+,\\.\/:;<=>?@[\]^_`{|}~]+/g," ");
		logString +=  "<br />" + cleanedAnswer;
	    wordArray = cleanedAnswer.split(" ");
	    for(var i = 0; i < wordArray.length; i++){	              
	      for(var y = 0; y < 6; y++){	                  
	        for(var x in inputMap.entries[y].key){           
	          if(inputMap.entries[y].key[x] == wordArray[i]){         
	              matches[y] = true;	                          
	          }	                      
	        }	                  
	      }	              
	    }
	}	
}).listen(8001);

//Function to count the number of keywords found in the response and store it in trueCounter
var numMatches = function() {
	trueCounter = 0;
    for(var z = 0; z < matches.length; z++){
        if(matches[z] == true){
            trueCounter++;
        }
    }
}

