//PreCalc object
function PreCalc(stackVal){

  //Setting up an array to be used as the stack
  this.calcStack = [stackVal];
  
  //Setting the calc function as a method of PreCalc
  this.calc = calc;
  
}

//Declares a new PreCalc object
var stack = new PreCalc(0);

//Boolean used for checking string input during recursion
var isParsed = false;

//Running and displaying the example calculations
console.log(stack.calc('{"op": "add", "number": 5}'));
console.log(stack.calc('{"op" : "push", "expr" : {"op" : "subtract", "number" : 2}}'));
console.log(stack.calc('{"op" : "push", "expr" : {"op" : "add", "number" : 19}}'));
console.log(stack.calc('{"op" : "pop"}'));
console.log(stack.calc('{"op" : "print"}'));
console.log(stack.calc('{"op" : "push", "expr" : {"op" : "add", "expr": {"op" :  "pop"}}}'));
console.log(stack.calc('{"op" : "print"}'));
console.log(stack.calc('{"op" : "pop"}'));
console.log(stack.calc('{"op" : "pop"}'));
console.log(stack.calc('{"op" : "pop"}'));

//Function for reading JSON string and performing the requested operation
function calc(str){

  //Check on input string used during recursion
  if(!isParsed){
      
    str = JSON.parse(str);
    isParsed = true;
      
  }
    
  //Check for nested expressions
  if(str.hasOwnProperty("expr")){
        
    //Recursion used when there are nested expressions
    str.expr = this.calc(str.expr);
        
    //Calculations used on upper levels of recursion
    if(str.op == "add"){
            
      value = this.calcStack[0] + str.expr;
      isParsed = false;
      return value;
            
    }
        
    if(str.op == "subtract") {
            
      value = this.calcStack[0] - str.expr;
      isParsed = false;
      return value;
            
    }
        
    //Push method using unshift to push value to top of stack
    if(str.op == "push"){
            
      isParsed = false;
      this.calcStack.unshift(str.expr);
      return this.calcStack[0];
            
    }
        
  }
    
  //Calculations used on 1 nested expressions, and base level of recursion
  else{

    if(str.op == "add"){
            
      value = this.calcStack[0] + str.number;
      isParsed = false;
      return value;
            
    }
        
    if(str.op == "subtract") {
          
      value = this.calcStack[0] - str.number;
      isParsed = false;
      return value;
            
    }
    
    //Pop method using shift to pop off the top of the stack    
    if(str.op == "pop"){
      
      //If stack is empty returns null and an error message    
      if(this.calcStack.length == 0){
                
        isParsed = false;
        console.log("Stack is empty. Unable to pop.");
        return null;
                
      }
            
      else{
                
        isParsed = false;
        return this.calcStack.shift();
                
      }
            
    }
    
    //Print method to print current contents of the stack    
    if(str.op == "print"){
            
      isParsed = false;
      console.log(this.calcStack);
            
    }
   
  }
}