var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
   
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
			var increments=Math.round(((max-min)/canvasDOM.width)*100)/100;
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
    		contextOuter.drawImage(canvasDOM,0,0);
        }
    }
    var datax;
    var datay;
    var xscale;
    var yscale;
    var ymax;
    var xmin;
    
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
    
    function getValue(mouseX,mouseY,JQcanvas,dynamicCanvas,div){
    	var offset=JQcanvas.offset(); //array of left and top
		var canvasDOM=dynamicCanvas[0];
		var canvasDOMOuter=JQcanvas[0];
		var contextOuter=canvasDOMOuter.getContext('2d');
		contextOuter.fillRect(0,0,canvasDOMOuter.width,canvasDOMOuter.height);
		contextOuter.fillStyle="#ffffff";
		contextOuter.fill();
		contextOuter.drawImage(canvasDOM,0,0); //draw what was there
		contextOuter.beginPath();
		contextOuter.moveTo(mouseX,0);
		contextOuter.lineTo(mouseX,canvasDOMOuter.height);
		contextOuter.stroke();
        
        contextOuter.lineStyle="#000000";
        var xCoord; var yCoord; var output="";
        if (datax){ //if there is data, do this stuff
            xCoord=datax[parseInt(mouseX)];
            yCoord=datay[parseInt(mouseX)];
            $(div).find('.error').text(mouseX+", "+mouseY+": "+);
            output=Math.round(xCoord*100)/100+", "+Math.round(yCoord*100)/100;
            contextOuter.strokeText(output,mouseX+7,mouseY-7);
            contextOuter.beginPath();
            contextOuter.fillStyle="#00ff00";
            contextOuter.fillRect(xCoord*xscale-xmin*xscale-2,ymax*yscale-yCoord*yscale-2+10,4,4);
            contextOuter.fill();
            
        }
    }
   
    function setup(div) {
         var lineBreak=$('</br>');
         var graphCanvas=$('<canvas width="500" height="300"></canvas>',{class: 'graphCanvas'});
         var dynamicCanvas=$('<canvas width="500" height="300"></canvas>',{class: 'dynCanvas'}); //inner
         var commandBox=$('<div></div>',{id: 'commandBox'});
         var equation=$('<input></input>', {type:'text',id:'equation'});
         var equationLabel=$('<label>f(x)= </label>', {for:'equation',value:"f(x)="});
         var minLabel=$('</br></br><label>min x </label>', {for:'min', value:"min x",class:"range"});
         var min=$('<input></input>', {type:'text',id:'min'});
         var maxLabel=$('</br><label>max x </label>', {for: 'max', value:"max x",class:"range"});
         var max=$('<input></input>', {type:'text',id:'max'});
         var plotButton=$('</br></br><button>plot</button></br></br>',{value:'plot'});
         var msgLabel=$('<span>error:</span></br>');
         var msg = $('<div></div>',{class:'error'});
         
         var context=graphCanvas[0].getContext('2d');
         context.width=500;
         context.height=300;
         context.fillStyle="#ffffff";
         context.fillRect(0,0,context.width,context.height);
         context.fill();
         
         $(max).keyup(function(event){
         	if(event.keyCode==13){ plotButton.click(); }
         });
         
         $(min).keyup(function(event){
         	if(event.keyCode==13){ plotButton.click(); }
         });
         
         $(equation).keyup(function(event){
         	if(event.keyCode==13){ plotButton.click(); }
         });
         
         $(plotButton).on("click", function(){
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
         
              commandBox.append(equationLabel,equation,minLabel,min,maxLabel,max,plotButton,msgLabel,msg);
         $(div).append(graphCanvas,commandBox);
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