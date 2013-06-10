/*
    evaluates arithmetic expression in the input field
    executed when calculate button is clicked
*/
function calculate(text){
    var pattern = /\d+|\+|\-|\*|\/|\(|\)/g; //this pattern will match numbers, +-*/, and ()
    var tokens = text.match(pattern); //returns an array
    return JSON.stringify(tokens); //converts any data structure into string
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
    
    $(d).append(input,button,output);
}

$(document).ready(function(){
    $('.calculator').each(function(){
        setup_calc(this);
    });
});