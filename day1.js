/*
    evaluates arithmetic expression in the input field
    executed when calculate button is clicked
*/
function calculate(text){
    var pattern = /\d+\.?\d*|\.\d+|\+|\-|\*|\/|\(|\)/g; //this pattern will match numbers, +-*/, and ()
    var tokens = text.match(pattern); //returns an array
    
    try{
        var val=evaluate(tokens);
        if (tokens.length!==0) throw "ill-formed expression";
        return String(val);
    } catch (err){
        return err;
    }
    
    return JSON.stringify(tokens); //converts any data structure into string
}

/*
    reads the next item in the array of tokens and returns it as a number
    assumes the item is a number. if not, throws error
    handles negative numbers
    if it gets a (, evaluates expression inside and returns that
*/
function read_operand(tokens){
    var num= tokens.shift();
    var neg = false;
    if (num=="-") {
        neg=true; //it's negative
        num=tokens.shift(); //grab the number
    }
    else if (num=="("){
        var operandInParen=evaluate(tokens);
        if (tokens[0]==")"){
            tokens.shift(); //remove close parenthesis
            return operandInParen;
        }
        else throw "parenthesis not closed";
    }
    
    try{
        var numInt=parseFloat(num);
        if (isNaN(numInt)) throw "number expected";
        if(neg) numInt=0-numInt; //if it's negative, make the number reflect that
        return numInt;
    } catch (err){
        return err;
    }
}

function read_term(tokens){
    if (tokens.length===0){
        throw "missing operand";
    }
    var val1= read_operand(tokens);
    while (tokens.length!==0){
        var operator=tokens.shift();
        if (operator == "+" || operator =="-") break;
        else if(operator != "*" && operator != "/") throw "unrecognized operator";
        if (tokens.length===0) throw "missing operand";
        var val2=read_operand(tokens);
        if (operator == "*") val1=val1*val2;
        else if (operator =="/") val1=val1/val2;
    }
    return val1;
}

/*
    actually evaluates the function
*/
function evaluate(tokens){
    if (tokens.length===0){
        throw "missing operand";
    }
    //var val1 = read_operand(tokens);
    var val1 = read_term(tokens);
    var ans;
    while (tokens.length!==0){
        var operator = tokens.shift();
        var operatorPattern=/\+|\-|\*|\//g;
        if (operator.match(operatorPattern) === null ) throw "unrecognized operator";
        if (tokens.length===0) throw "missing operand";
        //var val2 = read_operand(tokens);
        var val2=read_term(tokens);
        if (operator == "+") ans= parseFloat(val1) + parseFloat(val2);
        else if (operator == "-") ans= val1 - val2;
        //else if (operator == "*") ans= val1 * val2;
        //else ans= val1 / val2;
        val1=ans;
        if (tokens[0]==")") break;
    }
    return val1;
}

/*
    sets up the calculator with input field, calculate button, and output field
    makes it so that when the button is clicked, output displays what calculate() returns
*/
function setup_calc(d){
    var input = $('<input></input>',{type:"text",size:50});
    var output = $('<div></div>');
    var button = $('<button>calculate</button>');
    button.bind("click",function () {
        output.html(String(calculate(input.val())));
    });
    
    input.keyup(function(event){
        if (event.keyCode==13){
            button.click();
        }
    });
    
    $(d).append(input,button,output);
}

$(document).ready(function(){
    $('.calculator').each(function(){
        setup_calc(this);
    });
});