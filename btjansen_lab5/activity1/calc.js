class PreCalc {
	// Initialize PreCalc object with stack and current value
	constructor() {
		this.calcStack = [];
		this.currVal = 0;
	}

	push(val) {
		this.calcStack.push(val);
	}

	pop() {
		var rtrn = this.calcStack.pop();
		if(rtrn.operation == '+') {
			this.subtract(rtrn.operand);
		} else if(rtrn.operation == '-') {
			this.add(rtrn.operand);
		}
		return rtrn;
	}

	/* Function: calc 
	 * Parameters: dictionary
	 * 
	 * Takes in a dictionary of information to add to the calculator stack.
	 *
	 * Dictionary must be structured as:
	 *
	 * {operation:op, operand:num, ip:ipAddr, user:userAgent}
	 */
	calc(dict) {
		if(dict.operation == '+') {
			this.add(dict.operand);
		} else if(dict.operation == '-') {
			this.subtract(dict.operand);
		}
		this.push(dict);
	}

	reset() {
		this.currVal = 0;
		this.calcStack = [];
	}

	add(val) {
		this.currVal += val;
	}

	subtract(val) {
		this.currVal -= val;
	}

	getStack() {
		return this.calcStack;
	}

	getCurrVal() {
		return this.currVal;
	}
}

module.exports = PreCalc;