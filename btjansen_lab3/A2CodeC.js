"use strict";

var PreCalc = function (input) {
    if (input == null) {
        this.calcStack = [0];
    } else {
        this.calcStack = [input];
    }
};

// push the element at the top of stack
PreCalc.prototype.push = function (item) {
    this.calcStack.push(item)
};

//pop item from top
PreCalc.prototype.pop = function () {
    if (this.isEmpty()) {
        return 'Stack is Empty!';
    }
    return this.calcStack.pop();
};

// print stack
PreCalc.prototype.print = function () {
    if (this.isEmpty()) {
        return 'Stack is Empty!';
    }

    var newArr = this.calcStack.slice(0);
    return '[' + newArr.reverse().toString().replace(/,/g, ' ') + ']';
};

//return Top of Stack
PreCalc.prototype.peek = function () {
    if (this.isEmpty()) {
        return 'Stack is Empty!';
    }
    return this.calcStack[this.calcStack.length - 1];
};

//is Empty function.
PreCalc.prototype.isEmpty = function () {
    if (this.calcStack.length > 0)
        return false;
    else
        return true;
};

PreCalc.prototype.calc = function (input) {
    try {
        var obj = JSON.parse(input);
        return this.engine(obj);
    } catch (error) {
        return 'Invalid JSON Passed!';
    }
};

PreCalc.prototype.engine = function (jsonString) {
    try {
        switch (jsonString.op) {
            case "add":
                var sum = 0;
                if (jsonString.expr) {
                    let res = this.engine(jsonString.expr);
                    sum = this.peek() + res;
                } else {
                    sum = this.peek() + jsonString.number;
                }
                return sum;
            case "subtract":
                var diff = 0;
                if (jsonString.expr) {
                    let res = this.engine(jsonString.expr);
                    diff = this.peek() - res;
                } else {
                    diff = this.peek() - jsonString.number;
                }
                return diff;
            case "push":
                if (jsonString.expr) {
                    let exprRes = this.engine(jsonString.expr);
                    this.push(exprRes);
                    return exprRes;
                } else if (jsonString.number) {
                    this.push(jsonString.number);
                    return jsonString.number;
                }
                break;
            case "pop":
                var ret = this.pop();
                return ret;
                break;
            case "print":
                return this.print();
        }
    } catch (error) {
        return "Unable to perform the operation";
    }
}

var exec = new PreCalc();
//(Optional)PreCalc takes values too.