var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
    
    var datax;
    var datay;
    var xscale;
    var yscale;
    var ymax;
    var xmin;
    
    //generates data arrays and necessary parameters for graphing based on input of equation box
    //after generating data, calls drawData to actually put it on the canvas
    function graph(canvas,expression,x1,x2,div,dynamicCanvas) {
    	var canvasDOM=dynamicCanvas[0]; //everything happens on background canvas
    	var context=canvasDOM.getContext('2d');
    	var min=parseFloat(x1);
    	var max=parseFloat(x2);
        if (max<min){
        	$(div).find('.error').text("bad range");
        	return;
        }
        else if (isNaN(min) || isNaN(max)){
        	$(div).find('.error').text("range must be numbers");
        	return;
        }
        else{
        	var tree;
        	try{
        		tree = calculator.parse(expression);
        	} catch(err){
        		$(div).find('.error').text(err);
        		return;
        	}
        	var y=[];
			var x=[];
			var ymin;
			xscale=canvasDOM.width/(max-min);
			var increments=Math.round(((max-min)/canvasDOM.width)*1000)/1000;
			var i=min;
			while(i<=max){
				var val;
				try{ 
					val=Math.round(calculator.evaluate(tree,{x:i})*100)/100;
				} catch(err){
					$(div).find('.error').text(err);
					return;
				}
				if (i==min){
					ymin=val;
					ymax=val;
				}
				else{
					if (val<ymin) ymin=val;
					if (val>ymax) ymax=val;
				}
				x.push(i);
				y.push(val);
				i=i+increments;
			}
		    datax=x;
            datay=y;
            xmin=min;
			yscale=(canvasDOM.height-20)/(ymax-ymin);
            
        	drawData(canvasDOM,x,y,min,max,ymin);
        	
        	var canvasDOMOuter=canvas[0];
    		var contextOuter=canvasDOMOuter.getContext('2d');
    		contextOuter.drawImage(canvasDOM,0,0); //puts it on outer canvas
        }
    }

    
    //actually graphs stuff.
    function drawData(canvasDOM,x,y,min,max,ymin){
    	var context=canvasDOM.getContext('2d');
    	context.fillRect(0,0,canvasDOM.width,canvasDOM.height);
    	context.fillStyle="#ffffff";
    	context.fill();
    	context.lineWidth=1;
    	context.strokeStyle="#ff0000";
    	context.beginPath();
    	context.moveTo(x[0]*xscale-min*xscale,ymax*yscale-y[0]*yscale+10);
    	for(var i=1; i<x.length; i++){
    		var yVal=y[i];
    		var xVal=x[i];
    		context.lineTo(xVal*xscale-min*xscale, ymax*yscale-yVal*yscale+10);
    	}
    	context.stroke();
    }
    
    //for mouseover, getting the data point where the mouse x value is
    function getValue(mouseX,mouseY,JQcanvas,dynamicCanvas,div){
    	var offset=JQcanvas.offset(); //array of left and top
		var canvasDOM=dynamicCanvas[0];
		var canvasDOMOuter=JQcanvas[0];
		var contextOuter=canvasDOMOuter.getContext('2d');
		contextOuter.fillRect(0,0,canvasDOMOuter.width,canvasDOMOuter.height);
		contextOuter.fillStyle="#ffffff";
		contextOuter.fill();
		contextOuter.drawImage(canvasDOM,0,0); //draw what was there
        var x=mouseX; var y=mouseY;
        contextOuter.lineStyle="#000000";
        var xCoord; var yCoord;
        if (datax){ //if there is data, do this stuff
            xCoord=datax[parseInt(mouseX)];
            yCoord=datay[parseInt(mouseX)];
            y=ymax*yscale-yCoord*yscale+10;
            x=xCoord*xscale-xmin*xscale;
            var output=Math.round(xCoord*100)/100+", "+Math.round(yCoord*100)/100;
            contextOuter.fillStyle="#333333";
            if(mouseX>425){
                contextOuter.textAlign="right";
                var offset=-5;
            }
            else{
                contextOuter.textAlign="left";
                var offset=5;
            }
            contextOuter.fillText(output,x+offset,y-5);
            contextOuter.beginPath();
            contextOuter.fillRect(x-2,y-2,4,4);
            contextOuter.fill();
        }
        contextOuter.beginPath();
        contextOuter.moveTo(x,0);
        contextOuter.lineTo(x,canvasDOMOuter.height);
        contextOuter.moveTo(0,y);
        contextOuter.lineTo(canvasDOMOuter.width,y);
        contextOuter.strokeStyle="#cccccc";
        contextOuter.stroke();
    }
   
    function setup(div) {
        var graphCanvas=$('<canvas width="500" height="500"></canvas>',{class: 'graphCanvas'});
        var dynamicCanvas=$('<canvas width="500" height="500"></canvas>',{class: 'dynCanvas'}); //inner
        var commandBox=$('<div></div>',{id: 'commandBox'});
        var box="<div id='commandBox'>"
            + "     <label for='equation' value='f(x)='>f(x)= </label>"
            + "     <input type='text' id='equation'></input>"
            + "     </br></br>"
            + "     <label for='min' value='min x' class='range'>min x </label>"
            + "     <input type='text' id='min'></input>"
            + "     </br>"
            + "     <label for='max' value='max x' class='range'>max x</label>"
            + "     <input type='text' id='max'></input>"
            + "     </br></br>"
            + "     <button id='plotButton' value='plot'>plot</button>"
            + "     </br></br>"
            + "     <span>error:</span>"
            + "     </br>"
            + "     <div class='error'></div>"
            + "</div>";
        
         var context=graphCanvas[0].getContext('2d');
         context.width=500;
         context.height=500;
         context.fillStyle="#ffffff";
         context.fillRect(0,0,context.width,context.height);
         context.fill();
        
        commandBox.append(box); 
        $(div).append(graphCanvas,commandBox);
        
        var max=commandBox.find('#max');
        var min=commandBox.find('#min');
        var equation=commandBox.find('#equation');
        max.keyup(function(event){
         	if(event.keyCode==13){ plotButton.click(); }
         });
         
         min.keyup(function(event){
         	if(event.keyCode==13){ plotButton.click(); }
         });
         
         equation.keyup(function(event){
         	if(event.keyCode==13){ plotButton.click(); }
         });
         
         $('#plotButton').on("click", function(){
            $(div).find('.error').text("");
         	graph(graphCanvas,equation.val(),min.val(),max.val(),div,dynamicCanvas);
         });
         
         graphCanvas.on("mousemove",function(event){
			var mx=event.pageX;
			var my=event.pageY;
		
			var offset=graphCanvas.offset(); //array of left and top
			mx=Math.round(mx-offset.left);
			my=Math.round(my-offset.top);
         	getValue(mx,my,graphCanvas,dynamicCanvas,div);
         });
         
              //commandBox.append(equationLabel,equation,minLabel,min,maxLabel,max,plotButton,msgLabel,msg);
        
    }
    exports.setup = setup;
   
    return exports;
}());
// setup all the graphcalc divs in the document
$(document).ready(function() {
    $('.graphcalc').each(function() {
        graphcalc.setup(this);  
    });
});