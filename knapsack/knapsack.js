var sack=(function(){
    var exports={};
    var openImg=new Image();
    var closeImg=new Image();
    var items=[];
    
    function setup(div){
        div.find("img").css("display","none");
        var template=""
            +"<div class='main'>"
            +"  <div class='info'>"
            +"      <p>oh no, there's too much delicious food!"
            +"      we want to maximize the amount of DELICIOUS POINTS (dp) in our belly"
            +"      but we only have so much money! what's the right combination"
            +"      of food to eat to get the most DELICIOUS POINTS??</p>"
            +"  </div>"
            +"  <div class='data'>"
            +"      <p class='dp'>dp: </p>"
            +"      <p class='money'>money: </p>"
            +"  </div>"
            +"  <div class='gui'>"
            +"      <canvas class='sack'></canvas>"
            +"      <div class='foodbox'>"
            +"      </div>"
            +"  </div>"
            +""
            +"</div>";
        div.append(template);
        
        var canvas=div.find('canvas.sack')[0];
        canvas.height=400;
        canvas.width=850;
        var context=canvas.getContext('2d');
        openImg.src="img/open.png";
        closeImg.src="img/closed.png";
        openImg.onload=function(){
            context.drawImage(openImg,500,0);
        }
        
        $('img').each(function(){
            var val=$(this).attr("data-value");
            var weight=$(this).attr("data-weight");
            var name=$(this).attr("data-name");
            var newImg=new Image();
            newImg.src=this.src;
            items.push({image:newImg, value:val, weight:weight, name:name});
        });
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
                context.fillStyle="#fff";
                context.fillText(text,80+colCount*140,120+rowCount*120);
                colCount++;
                if (colCount>=3) {
                    colCount=0;
                    rowCount++;
                }                
            }
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
