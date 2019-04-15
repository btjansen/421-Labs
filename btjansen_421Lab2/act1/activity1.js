//Variable for checking if this is the name question
var firstTime = true;
//Variable for checking if this is the fist question
var firstQuestion = true;
//Variable for storing the JSON
var inputMap;
//Variables for storing the cleaned up answer
var cleanedAnswer;
var wordArray;
//Variable to store an array tracking where matches occur
var matches;
//Boolean variables for quitting, ignoring the 2min interval and logging
var notQuit = true;
var TMT = false;
var logSwitch = false;
//Variable for storing the conversation log as a string
var logString = "";
//Variable to store the user name
var name;
//Variables for storing the time
var hour;
var min;
var sec;
//Variable storing and logging the current response and question
var elizaQuestion;
var elizaAnswer;
//Requirements variables, os is only used to write a new line in the log
var os = require('os');
const readline = require('readline');
const rl = readline.createInterface({
    
   input: process.stdin,
   output: process.stdout
    
});

//Setting up a readFile to open the JSON
var fs = require('fs');

var options = {encoding:'utf8', flag:'r'};
fs.readFile('./default.json', options, function(err, data){
  if (err){
    console.log("Failed to open Config File.");
  } 
  else {
    console.log("Config Loaded.");
    //Imports the JSON file to a variable and sets up the matches array
    inputMap = JSON.parse(data);
    matches = [false,false,false,false,false,false];
    
    //Starts the 2 minutes interval timer
    var twoMinTimer = setInterval(twoMinutes, 120000);

    //Function used to ask a question and respond recursively
    var recursiveQuestion = function(){
        
    	//Checks the notQuit boolean to end the program
        if(!notQuit) {
        	process.exit();
        }
        
        //Checks the logSwitch boolean to see if the last question should be repeated after saving the log
        else if(logSwitch) {
        	logSwitch = false;
        	console.log("The log was saved as " + name + "_"  + hour + "-" + min + "-" + sec + ".log");
        	logString += os.EOL + elizaQuestion;    
        	rl.question(elizaQuestion, (answer) =>{
        		
        		//Adds the response to the log then parses it for the recursion call and clears the current 20 sec timer
        		logString += os.EOL + answer;
        		getMatches(answer);
        		clearTimeout(twentySecTimer);
        		recursiveQuestion();
        	});
        }

        //Else block to ask a question
        else{
        	//Sets up the 20 second timer for responses
        	var twentySecTimer = setTimeout(twentySec, 20000);
    	  
        	//Checks firstTime boolean to see if Eliza should ask for the user name
        	if(firstTime){
			  logString += "Hi, I'm Eliza! What is your name?";
			  rl.question("Hi, I'm Eliza! What is your name?", (answer) =>{
		       
				  //Saves the response as the user name, and adds it to the log
				  name = answer;
				  logString += os.EOL + name;
				  //stops the current 20 second timer
				  clearTimeout(twentySecTimer);
				  firstTime = false;
				  recursiveQuestion();
		    
		    
			  });
        	}
      
		  //Checks if the first normal question should be asked
		  else if(firstQuestion){
	    	
			  //Randomly chooses a question from the "other" category to start the conversation
			  elizaQuestion = inputMap.entries[5].question[Math.trunc(Math.random()*inputMap.entries[5].question.length)];
			  
			  //Logs the question then asks it
			  logString += os.EOL + elizaQuestion;    
			  rl.question(elizaQuestion, (answer) =>{
				
				//Logs the response then parses it. Then clears the 20 sec timer
				logString += os.EOL + answer;
				getMatches(answer);
				clearTimeout(twentySecTimer);
				firstQuestion = false;
				recursiveQuestion();
			});
	        
		  }
		  //Else block for asking and responding for the rest of the conversation
		  else{
			  
			  //trueCounter counts how many words in the response were valid keywords
			  var trueCounter = 0;
	   
			  for(var z = 0; z < matches.length; z++){   
	            if(matches[z] == true){    
	                trueCounter++;    
	            }    
			  }
	
			  //If no words in the response were keywords then chooses a random answer and question from the "other" category
			  if(trueCounter == 0){
	        	
				  //Chooses a random answer from the "other" category
				  elizaAnswer = inputMap.entries[5].answer[Math.trunc(Math.random()*inputMap.entries[5].answer.length)];
	        	
	        	//Responds with the chosen answer and logs it
	            console.log(elizaAnswer);
	            logString += os.EOL + elizaAnswer;
	            
	            //Chooses a random question from the "other" category
	            elizaQuestion = inputMap.entries[5].question[Math.trunc(Math.random()*inputMap.entries[5].question.length)];
	            
	            //Asks the chosen question and logs it
	            logString += os.EOL + elizaQuestion;
	            rl.question(elizaQuestion, (answer) =>{
	
	            	//Logs the response then parses it for recursion, clears 20 sec timer
	            	logString += os.EOL + answer;
	                getMatches(answer);
	                clearTimeout(twentySecTimer);
	                recursiveQuestion();
	            });
			  }
			  
			  //If response contained exactly 1 valid keyword
			  else if(trueCounter == 1){
	    
				  //Searches the matches array to find which dictionary the keyword referred to
				  var entryNum = 0;
				  for(var i = 0; i < matches.length; i++){
	    
	                if(matches[i] == true){
	                    entryNum = i;
	                }
	    
				  }
				  
				  //Chooses a random answer from the corresponding category, then writes and logs it
				  elizaAnswer = inputMap.entries[entryNum].answer[Math.trunc(Math.random()*inputMap.entries[entryNum].answer.length)];
				  console.log(elizaAnswer);
				  logString += os.EOL + elizaAnswer;
	            
				  //Chooses a random question from the corresponding category, then asks and logs it
				  elizaQuestion = inputMap.entries[entryNum].question[Math.trunc(Math.random()*inputMap.entries[entryNum].question.length)];
				  logString += os.EOL + elizaQuestion;
				  rl.question(elizaQuestion, (answer) =>{
	            	
					//Logs the response then parses it for recursion, clears 20 sec timer
	            	logString += os.EOL + answer;
	                getMatches(answer);
	                clearTimeout(twentySecTimer);
	                recursiveQuestion();
				  });    
			  } 
			  
			  //Else block for when the response contains more than 1 valid keyword
			  else{
	    
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
	    
	                   //Located answer is returned and logged
	                   else{
	                	   elizaAnswer = inputMap.entries[i].answer[answerChoice];
	                       console.log(elizaAnswer);
	                       logString += os.EOL + elizaAnswer;
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
	    
	                   //Located question is asked and logged, then answer is used for recursion
	                   else{
	                       
	                	   elizaQuestion = inputMap.entries[i].question[questionChoice];
	                	   logString += os.EOL + elizaQuestion;
	                	   rl.question(elizaQuestion, (answer) =>{                   
	                		   
	                		   //Logs the response then parses it for recursion, clears 20 sec timer
	                		   logString += os.EOL + answer;
	                		   getMatches(answer);
	                    	   clearTimeout(twentySecTimer);
	                           recursiveQuestion();    
	                        });
	                       questionChoice = -1;    
	                   }    
	               	}    
				  }    
			  }
		  }
	 }
    }
  }
recursiveQuestion();

//Function called if the user does not respond to a question within 20 seconds
function twentySec(){
	
	//Chooses a random response of the 4 possible
	qChoice = Math.trunc(Math.random() * 4);
	
	//Opens another readline to ask and log the wake-up question
	const r3 = readline.createInterface({
	    
		   input: process.stdin,
		   output: process.stdout
		    
		});
	
	if(qChoice == 1) {
		logString += os.EOL + "Hey! " + name + " did you fall asleep?!";
		r3.question(os.EOL + "Hey! " + name + " did you fall asleep?!", (answer) =>{
	        });
	}
	
	if(qChoice == 2) {
		logString += os.EOL + "What's wrong? Cat got your tongue " + name + "?";
		r3.question(os.EOL + "What's wrong? Cat got your tongue " + name + "?", (answer) =>{
	        });
	}
	
	if(qChoice == 3) {
		logString += os.EOL + "Are you ignoring me, " + name + "?";
		r3.question(os.EOL + "Are you ignoring me, " + name + "?", (answer) =>{
	        });
	}
	
	if(qChoice == 4) {
		logString += os.EOL + "Are you still there " + name + "?";
		r3.question(os.EOL + "Are you still there " + name + "?", (answer) =>{
	        });
	}
	
	return null;
}

//Function called at 2 minute intervals during the conversation
function twoMinutes(){
	
	//If the user has already responded 'maybe' to a previous twoMinutes call then do not do anything
	if(TMT) {
		return null;
	}
	
	//Opens another readline to ask and log the twoMinute question
	else {
		const r2 = readline.createInterface({		    
			   input: process.stdin,
			   output: process.stdout			    
			});
		
		logString += os.EOL + "You sure can talk. I need some coffee - join me at Dunkin, " + name + "?";
		r2.question(os.EOL + "You sure can talk. I need some coffee - join me at Dunkin, " + name + "?", (answer) =>{
	        
			//If user answers 'maybe' then flip TMT boolean so no further twoMinute questions are asked
	        if(answer == 'maybe') {
	        	TMT = true;
	        }
	          
	          return null;
	        	        
	        });
	}
    
}

});

//Function for parsing the response string and setting the matches array to show which keyword groups were found
var getMatches = function(string) {

	//Clears the matches array from the last response
    for (var i = 0; i < matches.length; i++){       
        matches[i] = false;
    }
    
    //If user responded 'quit' then flip notQuit boolean to end program
    if(string == 'quit') {
        notQuit = false;        
    }
    
    //If user responded 'log' then flip the logSwitch boolean and create a log file and repeat the question
    if(string == 'log') {
    	logSwitch = true;
    	
    	//Used to get the current time
        var date = new Date();
        hour = date.getHours();
        min = date.getMinutes();
        sec = date.getSeconds();
        
        //Writes the logString to a new file named <name>_<hours>-<minutes>-<seconds>
        var options = {encoding:'utf8', flag:'w'};
        fs.writeFile("./" + name + "_"  + hour + "-" + min + "-" + sec + ".log", logString, options, function(err) {
        	if(err) {
        		return console.log(err);
        	}
        }); 
        
    }
	
    //Cleans the response of symbols and places the words into an array to be compared to the keywords
	cleanedAnswer = string.replace(/[!"#$%&'()*+,\\.\/:;<=>?@[\]^_`{|}~]+/g,"");
    wordArray = cleanedAnswer.split(" ");
    
    //Loops through the words in the response to compare to valid keywords, marking the matches array when a valid keyword is found
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



