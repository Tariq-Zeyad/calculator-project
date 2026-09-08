const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector('[data-action="calculate"]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');

let currentNumber = "";
let previousNumber = "";
let operation = null;
let shouldResetDisplay = false;

function updateDisplay() {
    currentDisplay.textContent = currentNumber || "0";

    if (previousNumber && operation) {
        previousDisplay.textContent = `${previousNumber} ${operation}`;
    } else {
        previousDisplay.textContent = "";
    }
}

function isValidNumber(value) {
    return value !== "" && Number.isFinite(Number(value));
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentNumber = "";
        shouldResetDisplay = false;
    }

    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    if (number === "." && currentNumber === "") {
        currentNumber = "0";
    }

    currentNumber += number;
    updateDisplay();
}

function chooseOperation(selectedOperation) {
    if (currentNumber === "" || !isValidNumber(currentNumber)) {
        return;
    }

    if (previousNumber !== "" && operation) {
        calculate();
    }

    previousNumber = currentNumber;
    currentNumber = "";
    operation = selectedOperation;

    updateDisplay();
}

function calculate() {
    if (previousNumber === "" || currentNumber === "" || !operation) {
        return;
    }

    if (!isValidNumber(previousNumber) || !isValidNumber(currentNumber)) {
        showError("Invalid input");
        return;
    }

    const firstNumber = Number(previousNumber);
    const secondNumber = Number(currentNumber);

    let result;

    switch (operation) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                showError("Cannot divide by zero");
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    if (!Number.isFinite(result)) {
        showError("Invalid result");
        return;
    }

    currentNumber = String(result);
    previousNumber = "";
    operation = null;
    shouldResetDisplay = true;

    updateDisplay();
}

function showError(message) {
    currentNumber = message;
    previousNumber = "";
    operation = null;
    shouldResetDisplay = true;

    updateDisplay();
}

function clearCalculator() {
    currentNumber = "";
    previousNumber = "";
    operation = null;
    shouldResetDisplay = false;

    updateDisplay();
}

function deleteNumber() {
    if (shouldResetDisplay) {
        clearCalculator();
        return;
    }

    currentNumber = currentNumber.slice(0, -1);
    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.textContent);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operation);
    });
});

equalsButton.addEventListener("click", calculate);

clearButton.addEventListener("click", clearCalculator);

deleteButton.addEventListener("click", deleteNumber);

updateDisplay();