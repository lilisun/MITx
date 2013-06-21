var sack=(function(){
    var exports={};
    var openImg=new Image();
    var closeImg=new Image();
    var munchImg=new Image();
    var munch2Img=new Image();
    var items=[];
    var maxWeight;
    var maxDP=0;
    var dp=0;
    var money=0;
    var moneyChart;
    var dpChart;
    
    function dropped(event, ui){
        $('audio.eat')[0].pause();
        $('audio.eat')[0].play();
        $('.person').css("background-image","url("+munchImg.src+")");
        $('.mouth').droppable("disable");
        setTimeout(function(){
            $('.person').css("background-image","url("+munch2Img.src+")");
        },200);
        setTimeout(function(){
            $('.person').css("background-image","url("+munchImg.src+")");
        },400);
        setTimeout(function(){
            $('.person').css("background-image","url("+munch2Img.src+")");
        },600);
        setTimeout(function(){
            $('.person').css("background-image","url("+openImg.src+")");
        },1000);
        var image=$(ui.draggable).find('img');
        var index=parseInt(image.attr("data-index"));
        var data=items[index];
        dp=parseInt(dp)+parseInt(data.value);
        money=parseInt(money)+parseInt(data.weight);
        updateData();
        
        //put in next empty cell in belly
        $(ui.draggable).draggable("disable");
        setTimeout(function(){
            nextEmptyCell(ui.draggable,'.belly');
        },1010);
    }
    
    function foodClicked(food){
        var image=$(food).find('img');
        var index=parseInt(image.attr("data-index"));
        var data=items[index];
        dp=parseInt(dp)-parseInt(data.value);
        money=parseInt(money)-parseInt(data.weight);
        updateData();
        
        $('audio.out')[0].play();
        nextEmptyCell(food,'.foodbox');
        $(food).draggable("enable");
        
        $(food).off("click");
    }
    
    function nextEmptyCell(item,tableClass){
        for(var i=0;i<9;i++){
            var cell=$(tableClass).find('td')[i];
            if ($(cell).html()=="") {
                break;
            }
        }
        $(item).css("left","0px").css("top","0px").css("opacity","1");
        $(item).appendTo($(cell));
        
        if (tableClass=='.belly'){
            $(item).find('img').css("width","50px");
            $(item).on("click",function(){
                foodClicked(this)
            });
        }
        else{
            $(item).find('img').css("width","100px");
        }
    }
    
    function updateData(){
        $('.dp').text("delicious points: "+dp);
        $('.money').text("money: $"+money+"/$"+maxWeight);
        var offset=2;
        $('.moneyData text').css('fill','#0a3');
        $('.dpData text').css('fill','#D35548');
        if (money*175/maxWeight+offset > 150){
            offset=-30;
            $('.moneyData text').css('fill','#9d8');
        }
        moneyChart.selectAll('rect').data([money])
            .transition()
                .duration(100)
                .attr('width',money*175/maxWeight);
        
        moneyChart.selectAll('text').data([money])
            .transition()
                .duration(100)
                .attr('x',money*175/maxWeight+offset)
                .attr('y',14)
                .text("$"+money);
        
        offset=2;
        if (dp*175/maxDP+offset > 130){
            offset=-30;
            $('.dpData text').css('fill','#adf');
        }
        
        dpChart.selectAll('rect').data([dp])
            .transition()
                .duration(100)
                .attr('width',dp*175/maxDP);
        
        dpChart.selectAll('text').data([dp])
            .transition()
                .duration(100)
                .attr('x',dp*175/maxDP+offset)
                .attr('y',14)
                .text(dp+" dp");
    }
    
    function checkMax(event, ui){
        var image=$(ui.helper).find('img');
        var index=parseInt(image.attr("data-index"));
        var data=items[index];
        if((parseInt(money)+parseInt(data.weight))>maxWeight){ //exeeds money
            $('audio.toomuch')[0].play();
            $('.person').css("background-image","url("+closeImg.src+")");
            $('.mouth').droppable("disable");
            $(ui.helper).on("dragstop",function(event,ui){
                $('.person').css("background-image","url("+openImg.src+")");
                $('.mouth').droppable("enable");
            });
            return; 
        }
        $('.mouth').droppable("enable");
    }
    
    function setup(div){
        div.find("img").css("display","none");
        var template=""
            +"<div class='main'>"
            +"  <div class='info'>"
            +"      <p>oh no, there's too much delicious food!<br>"
            +"      we want the maximum amount of DELICIOUS POINTS (dp) in our belly,"
            +"      <br>but we only have so much money! <br><br>"
            +"      what's the right combination"
            +"      of food to eat to get the most DELICIOUS POINTS??</p>"
            +"  </div>"
            +"  <div class='data'>limit: $"
//            +"      <p class='dp'>delicious points: 0</p>"
  //          +"      <p class='money'>money: 0</p>"
            +"  </div>"
            +"  <div class='gui'>"
            +"      <div class='foodbox'><span class='instructions'>drag food to the mouth!</span></div>"
            +"      <div class='person'></div>"
            +"      <div class='break'>"
            +"          <span class='instructions'>click food to regurgitate and get a refund</span>"
            +"</div>"
            +"  </div>"
            +""
            +"</div>";
        var tableTemplate=""
            +"<table>"
            +"<tr>"
            +"  <td><div class='item'></div></td>"
            +"  <td><div class='item'></div></td>"
            +"  <td><div class='item'></div></td>"
            +"</tr>"
            +"<tr>"
            +"  <td><div class='item'></div></td>"
            +"  <td><div class='item'></div></td>"
            +"  <td><div class='item'></div></td>"
            +"</tr>"
            +"<tr>"
            +"  <td><div class='item'></div></td>"
            +"  <td><div class='item'></div></td>"
            +"  <td><div class='item'></div></td>"
            +"</tr>"
            +""
            +"</table>";
        
        var soundTemplate=""
            +"<audio preload='auto' class='eat'>"
            +"  <source src='sound/eat.mp3' type='audio/mpeg'></audio>"
            +"<audio preload='auto' class='out'>"
            +"  <source src='sound/out.wav' type='audio/wav'></audio>"
            +"<audio preload='auto' class='toomuch'>"
            +"  <source src='sound/toomuch.wav' type='audio/wav'></audio>"
            +"";
        
        var personTemplate=""
            +"<div class='mouth'></div>"
            +"<div class='belly'></div>";
        div.append(template);
        
        div.find('.foodbox').append(tableTemplate);
        div.find('.person').append(personTemplate);
        div.find('.belly').append(tableTemplate);
        div.find('.belly .item').remove();
        div.find('.break').append(soundTemplate);
        
        maxWeight=div.attr('data-max-weight');
        $('.data').append(maxWeight);
        openImg.src="img/open.png";
        closeImg.src="img/closed.png";
        munchImg.src="img/munch.png";
        munch2Img.src="img/munch2.png";
        openImg.onload=function(){
            div.find('.person').css("background-image","url("+openImg.src+")");
            div.find('.person').css("background-size","auto 400");
            div.find('.person').css("background-repeat","no-repeat");
        }
        
        div.find('.mouth').droppable({drop: function(event, ui){dropped(event, ui)}});
        
        $('img').each(function(){ //get all images that were supplied in html
            var val=$(this).attr("data-value");
            var weight=$(this).attr("data-weight");
            var name=$(this).attr("data-name");
            var newImg=new Image();
            newImg.src=this.src;
            maxDP=parseInt(maxDP)+parseInt(val);
            items.push({image:newImg, value:val, weight:weight, name:name});
        });
        
        var i=0;
        $('.item').each(function(){ //put all images into the table
            $(this).html("<img src='"+items[i].image.src+"'><br>");
            $(this).find('img').attr("width","100");
            $(this).find('img').attr("data-index",i);
            $(this).append("dp: "+items[i].value+",  $"+items[i].weight);
            $(this).draggable({containment: ".gui",revert:"invalid", revertDuration:"100",zIndex:100,start:function(event,ui){checkMax(event,ui)}});
            i++;
            if (i>=items.length) return false;
        });
        
        $('.data').append('<br>');
        moneyChart=d3.select('.data').append("svg")
            .attr('class','moneyData')
            .attr('width',175)
            .attr('height',20);
        moneyChart.selectAll('rect').data([money])
            .enter().append('rect')
                .attr('width',money*175/maxWeight)
                .attr('height',20);
        moneyChart.selectAll('text').data([money])
            .enter().append('text')
                .attr('x',money*175/maxWeight+3)
                .attr('y',14)
                .text("$"+money);
        
        $('.data').append('<br><br>');
        dpChart=d3.select('.data').append("svg")
            .attr('class','dpData')
            .attr('width',175)
            .attr('height',20);
        dpChart.selectAll('rect').data([dp])
            .enter().append('rect')
                .attr('width',dp*175/maxDP)
                .attr('height',20);
        dpChart.selectAll('text').data([dp])
            .enter().append('text')
                .attr('x',dp*175/maxDP+3)
                .attr('y',14)
                .text(dp+" dp");
        
        
    }
    
    exports.setup=setup;
    return exports;
})();

$(document).ready(function() {
    $('.knapsack').each(function() {
	    sack.setup($(this));
    });
});
