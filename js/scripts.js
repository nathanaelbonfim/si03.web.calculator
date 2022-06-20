const configs = {
    charLimit: 36,
    operationsLimit: 1
}

let displayContent = "";

$(".btn").click(function(event) {
    btnClick(event);
});

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
            calculatePercentage();
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

function displayError() {
    $('.calculator-body').shake(3, 100);
}

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
        if (!operands[1]) {
            operands = [operands[0]]
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

function validateExpression(expression) {
    const overCharLimit = expression.length > configs.charLimit;
    const splitedExpression = splitExpression(expression);
    const operationsLimit = splitedExpression.operators.length > configs.operationsLimit;
    const validDecimalPoinsts = validateDecimalPoints(splitedExpression.operands)

    if (overCharLimit || operationsLimit || !validDecimalPoinsts)
        return false;

    return true;
}

function updateDisplay(newChar) {
    const display = $('#display');
    const newExpression = $(display).text() + newChar;

    if (!validateExpression(newExpression))
        return displayError();

    $(display).text(newExpression);
}

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


function calculateExpression() {
    const expression = $('#display').text();
    const splitedExpression = splitExpression(expression);

    const insuficientOperands = splitedExpression.operands.length < 2;
    const divisionByZero =
        splitedExpression.operators[0] == '/'
        && parseFloat(splitedExpression.operands[1]) == 0

    if (insuficientOperands || divisionByZero)
        displayError();

    return eval(
        splitedExpression.operands[0]
            + splitedExpression.operators[0]
            + splitedExpression.operands[1]
    );
}

function calculatePercentage() {
}

