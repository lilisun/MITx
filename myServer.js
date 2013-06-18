var sys = require("sys"),  
my_http = require("http");  
var url = require('url');
my_http.createServer(function(request,response){  
    sys.puts("I got kicked");  
    response.writeHeader(200, {"Content-Type": "text/plain",
                              "Access-Control-Allow-Origin":'*'});
    var path=url.parse(request.url).pathname;
    var params=url.parse(request.url,true).query;
    if (path=="/checkAnswer"){
        response.write(JSON.stringify(checkAnswer(params.ques,params.answer)));
    } else if (path=="/incrementScore"){
        response.write(JSON.stringify(incrementScore()));
    } else if (path=="/getScore"){
        response.write(JSON.stringify(getScore()));
    } else if (path=="/setScore"){
        setScore(params.score);
    }
    response.end();  
}).listen(8080);  
sys.puts("Server Running on 8080");   

var questions=[{"questionText":"Sam thinks y=2x is going to ___ as x goes from 1 to 10.",
                    "options": ["increase","decrease","inc then dec", "dec then inc"],
                    "solutionIndex":0},
                   {"questionText":"test question2",
                    "options": ["not the answer","not this one","pick me", "no"],
                    "solutionIndex":2},
                  {"questionText":"test question3",
                    "options": ["not the answer","maybe this one","or this one", "just kidding it's this one"],
                    "solutionIndex":3},
                  {"questionText":"test question4",
                    "options": ["not the answer","answer","pick me", "no"],
                    "solutionIndex":1}];
var score=0;

function incrementScore(){
    score++;
    return score;
}

function getScore(){
    return score;
}

function setScore(x){
    score=x;
}

function checkAnswer(ques,answer){
    var currentQues=questions[ques];
    var correct;
    if (currentQues.solutionIndex==answer){
        correct= true;
    }
    else {
        correct= false;
    }
    return correct;
}