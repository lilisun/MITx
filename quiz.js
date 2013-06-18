var quiz = (function(){
    var exports={};
    
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
        //[{"questionText": "blah blah", "options": "blahblah", "solutionIndex":0}]
    var answers=[]; //answers from student
    var score =0;
    var currentQuestionIndex=0;
    var local=true;
    var quizScore;
    
    //input: takes in a question index and a student's answers
    //output: true if answer is correct
    function processAnswer(result,ans){
        $("body").find(".check").attr("disabled",true);
        $("body").find(".next").attr("disabled",false);
        if (result=="true"){
            incrementScore();
            $("body").find(".score").text("current score: "+getScore());
            $("body").find("label[for="+ans+"]").append(" -- this is correct!");
        }
        else {
            $("body").find("label[for="+ans+"]").append(" -- wrong");
        }
        nextQues();
    }
    
    function checkAnswer(q,ans){
        var req =$.ajax({
        async:false,
        url:"http://localhost:8080/checkAnswer",
        data:{ques:q,
             answer:ans}
        });
        req.done(function(msg){
            console.log(msg);
            processAnswer(msg,ans);
        });
    }
    
    //displays whatever question at currentQuestionIndex
    //if no more questions to display, ends the quiz
    function displayQuestion(){
        $("body").find(".check").attr("disabled",false);
        $("body").find(".next").attr("disabled",true);
        if (currentQuestionIndex==questions.length){
            quizDone();
            return;
        }
        var currentQues=questions[currentQuestionIndex];
        $("body").find(".question").text((parseInt(currentQuestionIndex)+1)+". "+currentQues.questionText);
        $("body").find(".options").html("");
        for(var i=0;i<4;i++){
            var opt=$("<input>",{class:"option",
                                 name:"choice"+currentQuestionIndex,
                                 type:"radio",
                                 id:i,
                                 value:i});
            var text=$("<label></label>",{for:i+"",
                                          text:currentQues.options[i]});
            
            $("body").find(".options").append(opt,text,"</br>");
        }
        
        
    }
    
    //ends quiz
    function quizDone(){
        if (local){
            localStorage['currentQuestionIndex']=0;
            localStorage['score']=0;
        }
        else{
            quizScore.save(null,{
                success: function(quizScore){
                    quizScore.set("currentQuestionIndex",0);
                    quizScore.set("score",0);
                    quizScore.save();
                }
            });
        }
        $("body").find(".question").html("you finished!<br> your final score: "+getScore()+"/"+questions.length);
        $("body").find(".options").html(""); //no more answer options
        $("body").find(".score").html(""); //gets rid of score count
        $("body").find(".check").attr("disabled",true); //can't use any buttons
    }
    
    //shows next question (increments currentQuestionIndex)
    function nextQues(){
        currentQuestionIndex++;
        if (local){ 
            localStorage['currentQuestionIndex']=currentQuestionIndex;
        }
        else{
            console.log(quizScore);
            quizScore.save(null,{
                success: function(quizScore){
                    quizScore.increment("currentQuestionIndex");
                    quizScore.save();
                }
            });
        }
        //displayQuestion();
    }
    
    function incrementScore(){
        //score++;
        var temp=0;
        var req =$.ajax({
        async:false,
        url:"http://localhost:8080/incrementScore",
        data:{score:1}
        });
        req.done(function(msg){
            temp=parseInt(msg);
            console.log(msg);
        });
        
        if (local){
            localStorage['score']=getScore();
        }
        else{
            console.log(quizScore);
            quizScore.save(null,{
                success: function(quizScore){
                    quizScore.increment("score");
                    quizScore.save();
                }
            });
            
        }
    }
    
    function getScore(){
        var temp=0;
        var req =$.ajax({
            async:false,
            url:"http://localhost:8080/getScore",
            data:{score:1}
        });
        req.done(function(msg){
            temp=parseInt(msg);
            console.log(msg);
        });
        return temp;
    }
    
    function setScore(x){
        var req =$.ajax({
            async:false,
            url:"http://localhost:8080/getScore",
            data:{score:x}
        });
        req.done(function(msg){
            //console.log(msg);
        });
    }
    
    function changeStorage(){
        var buttonText=$("body").find(".storage").text();
        if (buttonText=="localStorage"){
            $("body").find(".storage").text("parse");
            local=true;
            localStorage['currentQuestionIndex']=currentQuestionIndex;
            localStorage['score']=getScore();
        }else {
            $("body").find(".storage").text("localStorage");
            local=false;
            quizScore.set("score",getScore());
            var temp=parseInt(currentQuestionIndex);
            quizScore.set("currentQuestionIndex",temp);
            quizScore.save(null,{
                           success:function(gameScore){
                            //
                            },
                            error:function(gameScore,error){}
            });
        }
        
    }
    
    
    function setup(){
        Parse.initialize("lLt9WsvInV5HPgHNQueq4ls16Jphnw9D8d528DtW", "1u3hsL9uIos24UtWVkAUqSEACT0fcAxnTqRljInF");
        var QuizScore=Parse.Object.extend("QuizScore");
        quizScore=new QuizScore();
        
        if (local&&localStorage['score']!==undefined){
            score=localStorage['score'];
            setScore(localStorage['score']);
        //} if else { //read from parse 
        } else {score=0}
        if (local&&localStorage['currentQuestionIndex']!==undefined){
            currentQuestionIndex=localStorage['currentQuestionIndex'];
        //} if else { //read from parse
        } else {currentQuestionIndex=0}
        
        var quesBox=$("<div></div>",{class:"question"});
        var quesOptBox=$("<form></form>",{class:"options"});
        var score=$("<div></div>",{class:"score"}).append("current score: "+score);
        var check=$("<button></button>",{class:"check"}).append("check answer");
        var next=$("<button></button>",{class:"next"}).append("next ques");
        var storageToggle=$("<button></button>",{class:"storage",text:"parse"});
        $("body").find(".quiz").append(quesBox,quesOptBox,check,next,score);
        $("body").find(".quiz").append("<br> store data in ",storageToggle);
        
        displayQuestion();
        $("body").find(".check").on("click",function(){
            var choices=$('input[name=choice'+currentQuestionIndex+']');
            var studAnswer=choices.filter(':checked').val();
            checkAnswer(currentQuestionIndex,studAnswer);
        });
        $("body").find(".next").on("click",displayQuestion);
        $("body").find(".storage").on("click",changeStorage);
    }
    exports.setup=setup;
    
    return exports;
})();



$(document).ready(function(){
    quiz.setup();
    
    var req =$.ajax({
        async:false,
        url:"http://localhost:8080/",
        //data:{id:10}
    });
    req.done(function(msg){
        console.log(msg);
    });
    console.log("what");
});