//Value used to store calculator data
var value = 0;

//Boolean used for checking string input during recursion
var isParsed = false;

//Example calculations
var calculation1 = '{"op" : "add", "number": 5}';
var calculation2 = '{"op" : "subtract", "number" : 2}';
var calculation3 = '{"op" : "add", "number" : 19}';
var calculation4 = '{"op": "subtract", "expr" : {"op" : "add", "number" : 15}}';
var calculation5 = '{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}}'

//Function for reading JSON string and calculating
function calc(string){
  
    //Check on input string used during recursion
    if(!isParsed){
      
      string = JSON.parse(string);
      isParsed = true;
      
    }
    
    //Check for nested expressions
    if(string.hasOwnProperty("expr")){
      
        //Recursion used when there are nested expressions
        string.expr = calc(string.expr);
        
        //Calculations used on upper levels of recursion
        if(string.op == "add"){
            
            value = value + string.expr;
            isParsed = false;
            return value;
            
        }
        
        if(string.op == "subtract") {
            
            value = value - string.expr;
            isParsed = false;
            return value;
            
        }
        
    }
    
    //Calculations used on 1 nested expressions, and base level of recursion
    else{
        
        if(string.op == "add"){
            
            value = value + string.number;
            isParsed = false;
            return value;
            
        }
        
        if(string.op == "subtract") {
            
            value = value - string.number;
            isParsed = false;
            return value;
            
        }
        
        
        
    }
}

//Running and displaying the example calculations
console.log(calc(calculation1));
console.log(calc(calculation2));
console.log(calc(calculation3));
console.log(calc(calculation4));
console.log(calc(calculation5));