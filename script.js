/**
 * Calculator Class: Handles all core arithmetic and display logic.
 */
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    // Clears all values
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    // Deletes the last digit
    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    // Appends a number to the current operand
    appendNumber(number) {
        // Prevent multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Handle initial '0' replacement
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    // Sets the operation
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute(); // Perform chained calculation
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    // Performs the calculation
    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Error: Division by zero');
                    this.clear();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = result.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    // Formats numbers for display (e.g., adding commas)
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Uses locale string for comma formatting
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Updates the display elements
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// --- DOM Element Selection ---
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const subMenu = document.getElementById('subMenu');

// --- Calculator Initialization ---
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// --- Event Listeners for Number Buttons ---
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
    });
});

// --- Event Listeners for Operator Buttons ---
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operation'));
    });
});

// --- Menu Navigation Functionality ---
window.toggleMenu = function() {
    subMenu.classList.toggle('open');
}

// Close sub-menu if user clicks outside of it
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-container') && subMenu.classList.contains('open')) {
        subMenu.classList.remove('open');
    }
});

// Expose the calculator to global scope for the AC/DEL/EQUALS buttons defined with 'onclick' in HTML
window.calculator = calculator;