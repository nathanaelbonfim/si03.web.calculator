const configs = {
    charLimit: 36,
    operationsLimit: 1
}

let displayContent = "";

$(".btn").click(function(event) {
    btnClick(event);
});

/**
 * Listens to clicks in any button on the page
 *
 * @param {event} event - The click event
 */
function btnClick(event) {
    const btnElement = event.target;
    const operation = $(btnElement).attr('data-action');
    let result = null;

    switch (operation) {
        case 'digit':
            updateDisplay(
                parseInt(btnElement.innerText)
            );
            break;

        case 'decimal':
            updateDisplay('.');
            break;

        case 'addition':
            updateDisplay('+');
            break;

        case 'subtraction':
            updateDisplay('-');
            break;

        case 'multiplication':
            updateDisplay('*');
            break;

        case 'division':
            updateDisplay('/');
            break;

        case 'percentage':
            result = calculatePercentage();
            clearDisplay({mode: 'all'})

            updateDisplay(result);
            break;

        case 'equals':
            result = calculateExpression();
            clearDisplay({mode: 'all'})

            updateDisplay(result);
            break;

        case 'clear_all':
            clearDisplay({mode: 'all'});
            break;

        case 'clear_last':
            clearDisplay({mode: 'last'});
            break;
    }
}

/**
 * Shake the calculator to demonstrate
 * an error
 *
 */
function displayError() {
    $('.calculator-body').shake(3, 100);
}

/**
 * Process the expression and breaks down into
 * its fundamental elements: operands and operators
 *
 * @param {string} expression - The expression to be processed
 *
 * @returns {object} {[operands], [operators]}
 */
function splitExpression(expression) {
    const regexGetOperands = /([-+/*])/g;
    let result = null;
    let operands = null;

    result = regexGetOperands.exec(expression);

    if (result) {
        operands = [
            expression.slice(0, result.index),
            expression.slice(result.index + 1)
        ]

        // HACK
        let secondOperandFound = operands[1];
        if (!secondOperandFound) {
            operands = [operands[0]];
        }
    } else {
        operands = [expression]
    }

    let operators = expression.match(regexGetOperands) ?? 0

    return {
        operands,
        operators,
    }
}

/**
 * Verify if there is more than one decimal point ('.') in
 * the operands list
 *
 * @param {Array} operands - The array of strings to be evaluated
 *
 * @returns {boolean}
 */
function validateDecimalPoints(operands) {
    const regexGetDecimalPoints = /([.])/g;
    let validDecimalPoinsts = true;
 
    operands.forEach(element => {
        decimalPoints = element.match(regexGetDecimalPoints);

        if (decimalPoints && decimalPoints.length > 1) {
            validDecimalPoinsts = false;
        }
    });

    return validDecimalPoinsts;
}

/**
 * Validates if a given expression is able to be calculated
 *
 * @param {string} expression - The expression to be checked
 *
 * @returns {boolean}
 */
function validateExpression(expression) {
    const overCharLimit = expression.length > configs.charLimit;
    const splitedExpression = splitExpression(expression);
    const operationsLimit = splitedExpression.operators.length > configs.operationsLimit;
    const validDecimalPoinsts = validateDecimalPoints(splitedExpression.operands)

    if (overCharLimit || operationsLimit || !validDecimalPoinsts)
        return false;

    return true;
}

/**
 * Appends to the display of the calculator, but validates the expression
 * before puting it into the screen
 *
 * @param {string} newChar - The new thing to be appended
 */
function updateDisplay(newChar) {
    const display = $('#display');
    const newExpression = $(display).text() + newChar;

    if (!validateExpression(newExpression))
        return displayError();

    $(display).text(newExpression);
}

/**
 * Clears the display
 * 
 * PARAMS:
 * - mode:
 *     'all' : clears the entire display
 *     'last': remove only the last char
 *
 * @param {object} params - The mode which will be used
 */
function clearDisplay(params) {
    const display = $('#display');

    switch (params.mode) {
        case 'all':
            $(display).text('');
            break;

        case 'last':
            $(display).text(
                $(display).text().slice(0, -1)
            );
            break;
    }
}


/**
 * Calculate the 4 basic expression using eval
 * and the splitExpression() results in
 * 
 * @returns {string} - The result of the expression
 */
function calculateExpression() {
    const expression = $('#display').text();
    const splitedExpression = splitExpression(expression);

    const insuficientOperands = splitedExpression.operands.length < 2;
    const divisionByZero =
        splitedExpression.operators[0] == '/'
        && parseFloat(splitedExpression.operands[1]) == 0

    if (insuficientOperands || divisionByZero) {
        displayError();
        return expression;
    }

    return eval(
        splitedExpression.operands[0]
            + splitedExpression.operators[0]
            + splitedExpression.operands[1]
    );
}

/**
 * Calculate the value of a percentage
 * 
 * @returns {string} - The result of the expression
 */
function calculatePercentage() {
    const expression = $('#display').text();
    const splitedExpression = splitExpression(expression);
    let initialValue, operator, percentage, divisionByZero = null;

    switch (splitedExpression.operators[0]) {
        case '+':
        case '-':
            initialValue = splitedExpression.operands[0]
            operator = splitedExpression.operators[0];
            percentage = splitedExpression.operands[1] / 100;
            return eval(
                initialValue
                + operator
                + (initialValue * percentage)
            )

        case '*':
        case '/':
            initialValue = splitedExpression.operands[0]
            operator = splitedExpression.operators[0];
            percentage = splitedExpression.operands[1] / 100;

            divisionByZero = operator == '/' && parseFloat(percentage) == 0;
            if (divisionByZero) {
                displayError()
                return expression;
            }
                
            return eval(
                initialValue
                + operator
                + (percentage)
            )
    }

    return eval(
        splitedExpression.operands[0]
            + splitedExpression.operators[0]
            + splitedExpression.operands[1]
    );
}

