var sack=(function(){
    var exports={};
    var openImg=new Image();
    var closeImg=new Image();
    var items=[];
    var maxWeight;
    var dp=0;
    var money=0;
    
    function dropped(event, ui){
        var image=$(ui.draggable).find('img');
        var index=parseInt(image.attr("data-index"));
        var data=items[index];
        dp=parseInt(dp)+parseInt(data.value);
        money=parseInt(money)+parseInt(data.weight);
        updateData();
        //put in next empty cell in belly
        $(ui.draggable).draggable("disable");
        nextEmptyCell(ui.draggable,'.belly');
    }
    
    function foodClicked(food){
        var image=$(food).find('img');
        var index=parseInt(image.attr("data-index"));
        var data=items[index];
        console.log(data);
        dp=parseInt(dp)-parseInt(data.value);
        money=parseInt(money)-parseInt(data.weight);
        updateData();
        
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
                console.log("clicked");
                foodClicked(this)
            });
        }
        else{
            $(item).find('img').css("width","100px");
        }
    }
    
    function updateData(){
        $('.dp').text("dp: "+dp);
        $('.money').text("money: "+money);
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
            +"  <div class='data'>"
            +"      <p class='dp'>dp: 0</p>"
            +"      <p class='money'>money: 0</p>"
            +"  </div>"
            +"  <div class='gui'>"
            +"      <div class='foodbox'></div>"
            +"      <div class='person'></div>"
            +"      <div class='break'>"
            +"          <span class='instructions'>drag items to the mouth"
            +"              , click to regurgitate</span></div>"
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
        
        var personTemplate=""
            +"<div class='mouth'></div>"
            +"<div class='belly'></div>";
        div.append(template);
        
        div.find('.foodbox').append(tableTemplate);
        div.find('.person').append(personTemplate);
        div.find('.belly').append(tableTemplate);
        div.find('.belly .item').remove();
        
        maxWeight=div.attr('data-max-weight');
        openImg.src="img/open.png";
        closeImg.src="img/closed.png";
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
            items.push({image:newImg, value:val, weight:weight, name:name});
        });
        
        var i=0;
        $('.item').each(function(){ //put all images into the table
            $(this).html("<img src='"+items[i].image.src+"'><br>");
            $(this).find('img').attr("width","100");
            $(this).find('img').attr("data-index",i);
            $(this).append("dp: "+items[i].value+",  $"+items[i].weight);
            $(this).draggable({containment: ".gui",revert:"invalid", revertDuration:"100",zIndex:100});
            i++;
            if (i>=items.length) return false;
        });
        
            
        
    }
    
    exports.setup=setup;
    return exports;
})();

$(document).ready(function() {
    $('.knapsack').each(function() {
	    sack.setup($(this));
    });
});
