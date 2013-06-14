
function test_clear(){
    var JQcanvas= $('#test:first');
    var DOMcanvas=JQcanvas[0];
    var ctx=DOMcanvas.getContext('2d');
    
    ctx.clearRect(0,0,JQcanvas.width(),JQcanvas.height());
    
}

function test_line(){
	var JQcanvas= $('#test:first');
    var DOMcanvas=JQcanvas[0];
    var ctx=DOMcanvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(50,50);
    ctx.lineTo(150,150);
    
    ctx.lineWidth=10;
    ctx.strokeStyle='#ffbbbb';
    ctx.lineCap="round";
    
    ctx.stroke();
}

function test_square(){
	var JQcanvas= $('#test:first');
    var DOMcanvas=JQcanvas[0];
    var ctx=DOMcanvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(50,50);
    ctx.lineTo(150,50);
    ctx.lineTo(150,150);
    ctx.lineTo(50,150);
    ctx.lineTo(50,50);
    
    ctx.lineWidth=10;
    ctx.strokeStyle='#ffaaaa';
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.fillStyle='#ffffff';
    
    ctx.fill();
    ctx.stroke();
}

function test_rect(){
	var JQcanvas= $('#test:first');
    var DOMcanvas=JQcanvas[0];
    var ctx=DOMcanvas.getContext('2d');
    
    ctx.beginPath();
    ctx.fillStyle='#ffaaaa';
    ctx.fillRect(25,25,100,100);
    
    ctx.fill();
}

function test_smiley(){
	var JQcanvas= $('#test:first');
    var DOMcanvas=JQcanvas[0];
    var ctx=DOMcanvas.getContext('2d');
    
    ctx.beginPath();
    ctx.arc(100,100,75,0,2*Math.PI);
    ctx.fillStyle='#00aaaa';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(100,115,20,1/4*Math.PI, 3/4*Math.PI);
    ctx.strokeStyle='#e1edee';
    ctx.lineWidth=3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(100,100,7,1/4*Math.PI, 3/4*Math.PI);
    ctx.strokeStyle='#e1edee';
    ctx.lineWidth=2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(60,75,7,0,2*Math.PI);
    ctx.arc(140,75,7,0,2*Math.PI);
    ctx.fillStyle='#e1edee';
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(45,100);
    ctx.lineTo(55,110);
    ctx.moveTo(55,100);
    ctx.lineTo(65,110);
    ctx.moveTo(65,100);
    ctx.lineTo(75,110);
    ctx.moveTo(125,100);
    ctx.lineTo(135,110);
    ctx.moveTo(135,100);
    ctx.lineTo(145,110);
    ctx.moveTo(145,100);
    ctx.lineTo(155,110);
    ctx.strokeStyle='#ffaaaa';
    ctx.stroke();
}

function test_text(){
	var JQcanvas= $('#test:first');
    var DOMcanvas=JQcanvas[0];
    var ctx=DOMcanvas.getContext('2d');
    
    ctx.textAlign="center";
    ctx.font='12pt helvetica';
    ctx.fillText("hello",100,50);
}

function test_mouse(){
	var JQcanvas= $('#test:first');
    var DOMcanvas=JQcanvas[0]; //gets DOM object
    var ctx=DOMcanvas.getContext('2d');
    
    var bg_img=$("<canvas></canvas>")[0]; //separate standalone canvas
    bg_img.width=200;
    bg_img.height=200;
    var bg_ctx=bg_img.getContext('2d');
    bg_ctx.fillStyle='#e1edee';
    bg_ctx.fillRect(0,0,200,200); //draws "existing" background image
    bg_ctx.drawImage(DOMcanvas,0,0);
    //more complicated: save all drawn things on a bg canvas, just display it when u want
    //so it's always saved
    
    
	JQcanvas.on("mousemove",function(event){
		var mx=event.pageX;
		var my=event.pageY;
		
    	var offset=JQcanvas.offset(); //array of left and top
		mx=Math.round(mx-offset.left);
		my=Math.round(my-offset.top);
		
		//ctx.fillStyle='#e1edee';
		//ctx.fillRect(0,0,200,200);
		
    	ctx.drawImage(bg_img,0,0);
		
		ctx.beginPath();
		ctx.moveTo(mx-10,my);
		ctx.lineTo(mx+10,my);
		ctx.moveTo(mx,my-10);
		ctx.lineTo(mx,my+10);
		ctx.strokeStyle='#ffffff';
		ctx.lineWidth=1;
		ctx.stroke();
	});
}

/*
var calculator=(function(){
	var exports={}; //array
	
	function bar(a){
		return a+1
	}
	
	function foo(a,b){
		return bar(a)+b;
	}
	
	exports.foo=foo;
	
	return exports;
	});
	
then you can do
<script src="blahblah.js"></script>

.... calculator.foo(3,4) .....
*/

