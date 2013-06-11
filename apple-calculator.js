/*
    evaluates arithmetic expression in the input field
    executed when calculate button is clicked
*/
function calculate(text){
    var pattern = /\d+\.?\d*|\.\d+|\+|\-|\*|\/|\(|\)/g; //this pattern will match numbers, +-*/, and ()
    var tokens = text.match(pattern); //returns an array
    if (tokens.length===0) return " ";
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
        var operator=tokens[0];//tokens.shift();
        var operatorPattern=/\+|\-|\*|\//g;
        if (operator == ")") break;
        if (operator.match(operatorPattern) === null ) throw "unrecognized operator";
        if (operator == "+" || operator =="-") break;
        else tokens.shift();
        
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

function setup_calc(div){
    var buttonNames=["MC","M+","M-","MR",
                    "C","&plusmn","&divide","x",
                    "7","8","9","-",
                    "4","5","6","+",
                    "1","2","3","=",
                    "0","."];
    var buttons=new Array();
    var counter=0;
    
    $.each(buttonNames, function(){
        if (counter==19) buttons[counter]=$("<button class='equals buttn'>"+buttonNames[counter]+"</button>");
        else if (counter==20)buttons[counter]=$("<button class='zero buttn'>"+buttonNames[counter]+"</button>"); 
        else buttons[counter]=$("<button class='buttn'>"+buttonNames[counter]+"</button>");
        counter=counter+1;
    });
    
    var divRow1=$('<div></div>',{class:"row"});
    var divRow2=$('<div></div>',{class:"row"});
    var divRow3=$('<div></div>',{class:"row"});
    var divRow4=$('<div></div>',{class:"row"});
    var divRow5=$('<div></div>',{class:"row"});
    var divRow6=$('<div></div>',{class:"row"});
    $(divRow1).append(buttons[0],buttons[1],buttons[2],buttons[3]);
    $(divRow2).append(buttons[4],buttons[5],buttons[6],buttons[7]);
    $(divRow3).append(buttons[8],buttons[9],buttons[10],buttons[11]);
    $(divRow4).append(buttons[12],buttons[13],buttons[14],buttons[15]);
    $(divRow5).append(buttons[16],buttons[17],buttons[18],buttons[19]);
    $(divRow6).append(buttons[20],buttons[21]);

    var input = $('<input></input>',{type:"Text"});
    
    var output = $('<span class="output"></span>');
    
    ///////////////// Button Functions////////////////////////
    
    input.keyup(function(event){
        if (event.keyCode==13){ //clicks "=" button if someone presses enter
            buttons[19].click();
        }
    });
    
    buttons[19].bind("click", function(){
        output.text(String(calculate(input.val())));
    });
    
    buttons[4].bind("click",function(){
        input.val("");
        output.text("");
    });
    
    $(".buttn").bind("click",function(){
          output.text("12");
     });
    
    
    $(div).append(input,output,divRow1,divRow2,divRow3,divRow4,divRow5,divRow6);
}

$(document).ready(function(){
   $('.Calculator').each(function(){
       setup_calc(this);
   })
});
