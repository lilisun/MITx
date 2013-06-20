var sack=(function(){
    var exports={};
    var openImg=new Image();
    var closeImg=new Image();
    var items=[];
    var maxWeight;
    
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
            +"      <p class='dp'>dp: </p>"
            +"      <p class='money'>money: </p>"
            +"  </div>"
            +"  <div class='gui'>"
            +"      <div class='foodbox'></div>"
            +"      <div class='person'></div>"
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
        div.append(template);
        
        div.find('.foodbox').append(tableTemplate);
        
        maxWeight=div.attr('data-max-weight');
        openImg.src="img/open.png";
        closeImg.src="img/closed.png";
        openImg.onload=function(){
            div.find('.person').html("<img src='"+openImg.src+"'>");
        }
        
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
            $(this).append("dp: "+items[i].value+",  $"+items[i].weight);
            i++;
        });
        
        /*
        var rowCount=0; //3 cols per row
        var colCount=0;
        $.each(items,function(index,val){
            var currentImage=val.image;
            currentImage.onload=function(){
                context.drawImage(this,30+colCount*140,30+rowCount*120,
                                  100,this.height*100/this.width); //scale to be 100px wide
                var text="dp: "+val.value+",  $"+val.weight;
                context.font='9pt verdana';
                context.textAlign='center';
                context.fillStyle="#aaddff";
                context.fillText(text,80+colCount*140,120+rowCount*120);
                colCount++;
                if (colCount>=3) {
                    colCount=0;
                    rowCount++;
                }                
            }
        });
        */
    }
    
    exports.setup=setup;
    return exports;
})();

$(document).ready(function() {
    $('.knapsack').each(function() {
	    sack.setup($(this));
    });
});
