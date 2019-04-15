//Value used to store calculator data
var value = 0;

//Example calculations
var calculation1 = '{"op" : "add", "number": 5}';
var calculation2 = '{"op" : "subtract", "number" : 2}';
var calculation3 = '{"op" : "add", "number" : 19}';

//Function for reading JSON string and calculating
function calc(str){
    
    var object = JSON.parse(str);

        if(object.op == "add"){
            
            value = value + object.number;
            return value;
            
        }
        
        if(object.op == "subtract") {
            
            value = value - object.number;
            return value;
            
        }
        
}

//Running and displaying the example calculations
console.log(calc(calculation1));
console.log(calc(calculation2));
console.log(calc(calculation3));
