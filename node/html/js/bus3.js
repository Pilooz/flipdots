var panneau = {
	width: 112,
	height: 48 ,
	circleRadius:0,
	beginSeparator: 20,
	separator : 30,

};

var tool = {
	selected :"point",
	lastX: 0,
	lastY: 0,
	lineUnderSelection:0,
	mouse:"up"
};


var socket = io('http://10.169.0.245:1234/');

socket.on('connection', function(){
	// Do something because we are connected

});

var table = new Array();

function changeColor(x, y){

};

function recalDots(){
	var tableauBus = document.getElementById('tableauBusCanvas');
	var ctx_2 = tableauBus.getContext("2d");
	ctx_2.canvas.width  = document.documentElement.clientWidth;
	panneau.circleRadius = ctx_2.canvas.width/ (panneau.width*2);
	ctx_2.canvas.height = panneau.beginSeparator + panneau.separator*4 + panneau.circleRadius*16*3*2;
	var hidden_canvas = document.createElement("canvas");
	hidden_canvas.width = ctx_2.canvas.width;
	hidden_canvas.height = ctx_2.canvas.height;

	var ctx = hidden_canvas.getContext("2d");

	var width = ctx_2.canvas.width;
	var height = ctx_2.canvas.height;

	/* - Background - */

	ctx.beginPath();
	ctx.fillStyle = "rgb(90,90,90)";
	ctx.fillRect(0, 0, width, height);
	ctx.fill();

	designButtons(ctx);
	ctx.strokeStyle = "black"


	var separator = panneau.beginSeparator;

	for(var j=0; j<panneau.height; j++){
		if(j % 16 == 0){
			separator+=panneau.separator;
		}
		for(var i=0; i<panneau.width; i++){

			ctx.beginPath();
			ctx.arc(panneau.circleRadius+panneau.circleRadius*2*i, panneau.circleRadius+1+panneau.circleRadius*2*j+separator, panneau.circleRadius-1, 0, 2 * Math.PI);
			if(table[i][j] == 1){
				ctx.fillStyle = "black";
			} else if(table[i][j] == 0){
				ctx.fillStyle = "yellow";
			}
			ctx.stroke();
			ctx.fill();
		}
	}
	ctx_2.drawImage(hidden_canvas, 0, 0); 
}

$("#tableauBusCanvas").click(function(e){
	var x, y;
	var separator = panneau.beginSeparator;

	var xclick = e.pageX-$("#tableauBusCanvas").offset().left;
	var yclick = e.pageY-$("#tableauBusCanvas").offset().top

	if(yclick > 3 && yclick < 23){
		if(xclick > 3 && xclick < 23){
			tool.selected = "point";
			document.onmousemove = "";
			var tableauBus = document.getElementById('tableauBusCanvas');
			var ctx = tableauBus.getContext("2d");
			designButtons(ctx);
		} else if(xclick > 26 && xclick < 46){
			tool.selected = "line";
			var tableauBus = document.getElementById('tableauBusCanvas');
			var ctx = tableauBus.getContext("2d");
			designButtons(ctx);
		} else if(xclick > 49 && xclick < 69){
			tool.selected = "handYellow";
			var tableauBus = document.getElementById('tableauBusCanvas');
			var ctx = tableauBus.getContext("2d");
			designButtons(ctx);
			document.onmousemove = handleMouseMoveHand;
			$('#tableauBusCanvas').mouseup(function(){tool.mouse= "up";});
			$('#tableauBusCanvas').mousedown( function(){tool.mouse="down";});
		} else if(xclick > 72 && xclick < 92){
			tool.selected = "handBlack";
			var tableauBus = document.getElementById('tableauBusCanvas');
			var ctx = tableauBus.getContext("2d");
			designButtons(ctx);
			document.onmousemove = handleMouseMoveHand;
			$('#tableauBusCanvas').mouseup(function(){tool.mouse= "up";});
			$('#tableauBusCanvas').mousedown( function(){tool.mouse="down";});
		}
	}

	if(yclick > panneau.beginSeparator + panneau.separator && yclick < panneau.beginSeparator + panneau.separator+ 16* panneau.circleRadius*2){
		x = Math.floor((xclick)/(panneau.circleRadius*2));
		y = Math.floor((yclick - panneau.beginSeparator - panneau.separator)/(panneau.circleRadius*2));
		separator += panneau.separator;
	}

	if(yclick > panneau.beginSeparator + 2*panneau.separator+ 16* panneau.circleRadius*2 && yclick <panneau.beginSeparator + 2*panneau.separator+ 16* panneau.circleRadius*4){
		x = Math.floor((xclick)/(panneau.circleRadius*2));
		y = Math.floor((yclick - panneau.beginSeparator - 2*panneau.separator)/(panneau.circleRadius*2));
		separator += 2*panneau.separator;
	}

	if(yclick > panneau.beginSeparator + 3*panneau.separator+ 16* panneau.circleRadius*4 && yclick <panneau.beginSeparator + 3*panneau.separator+ 16* panneau.circleRadius*6){
		x = Math.floor((xclick)/(panneau.circleRadius*2));
		y = Math.floor((yclick - panneau.beginSeparator - 3*panneau.separator)/(panneau.circleRadius*2));
		separator += 3*panneau.separator;
	}

	if(tool.selected == "point"){
		socket.emit('click', {X:x, Y:y});
	}else if( tool.selected == "line" && x != undefined && y != undefined && tool.lineUnderSelection != 1){
		tool.lastX = x;
		tool.lastY = y;
		tool.lastColor = table[x][y];
		reversePoint(x, y);
		tool.lineUnderSelection = 1;
		document.onmousemove = handleMouseMove;
	} else if(tool.selected == "line" && tool.lineUnderSelection == 1 && x != undefined && y != undefined){
		drawLine(x, y);
		tool.lineUnderSelection = 0;
		document.onmousemove = "";
	}


});

function drawLine(x,y){
	recalDots();
	var a = (tool.lastY - y)/(tool.lastX - x);
	var b = tool.lastY - a*tool.lastX;
	if(Math.abs(x - tool.lastX) > Math.abs(y- tool.lastY)){
		if(tool.lastX < x){
			for(var i = tool.lastX; i<= x; i++){
				var ay = a*i + b;
				socket.emit('click', {X:i, Y:Math.round(ay)});
			}
		} else {
			for(var i = x; i<= tool.lastX; i++){
				var ay = a*i + b;
				socket.emit('click', {X:i, Y:Math.round(ay)});
			}
		}
	} else if(Math.abs(x - tool.lastX) <= Math.abs(y- tool.lastY)){
		if(x == tool.lastX){
			if(y>tool.lastY){
				for(var i = tool.lastY; i<=y; i++){
					socket.emit('click', {X:x, Y:i});
				}
			}
			if(y<tool.lastY){
				for(var i = y; i<= tool.lastY; i++){
					socket.emit('click', {X:x, Y:i});
				}
			}
		}else if(tool.lastY < y){
			for(var i = tool.lastY; i<= y; i++){
				var ax = (i-b)/a;
				socket.emit('click', {X:Math.round(ax),Y:i});
			}
		} else {
			for(var i = y; i<= tool.lastY; i++){
				var ax = (i-b)/a;
				socket.emit('click', {X:Math.round(ax), Y:i});
			}
		}
	}
}

function reversePoint(x, y){
	var tableauBus = document.getElementById('tableauBusCanvas');
	var ctx = tableauBus.getContext("2d");
	var separator = panneau.beginSeparator + panneau.separator * (Math.floor(y/16)+1);

	ctx.beginPath();
	ctx.arc(panneau.circleRadius+panneau.circleRadius*2*x, panneau.circleRadius+1+panneau.circleRadius*2*y+separator, panneau.circleRadius-1, 0, 2 * Math.PI);
	ctx.strokeStyle = "black"
	ctx.stroke();
	if(table[x][y] == 1){
		ctx.fillStyle = "yellow";
	} else if(table[x][y] == 0){
		ctx.fillStyle = "black";
	}
	ctx.fill();
}

function handleMouseMoveHand(e){
	if(tool.mouse == "down"){
		var xclick = e.pageX-$("#tableauBusCanvas").offset().left;
		var yclick = e.pageY-$("#tableauBusCanvas").offset().top
		//y = ax + b
		var x, y;
		var separator = panneau.beginSeparator;
		if(yclick > panneau.beginSeparator + panneau.separator && yclick < panneau.beginSeparator + panneau.separator+ 16* panneau.circleRadius*2){
			x = Math.floor((xclick)/((panneau.circleRadius)*2));
			y = Math.floor((yclick - panneau.beginSeparator - panneau.separator)/(panneau.circleRadius*2));
			separator += panneau.separator;
		}

		if(yclick > panneau.beginSeparator + 2*panneau.separator+ 16* panneau.circleRadius*2 && yclick <panneau.beginSeparator + 2*panneau.separator+ 16* panneau.circleRadius*4){
			x = Math.floor((xclick)/((panneau.circleRadius)*2));
			y = Math.floor((yclick - panneau.beginSeparator - 2*panneau.separator)/(panneau.circleRadius*2));
			separator += 2*panneau.separator;
		}

		if(yclick > panneau.beginSeparator + 3*panneau.separator+ 16* panneau.circleRadius*4 && yclick <panneau.beginSeparator + 3*panneau.separator+ 16* panneau.circleRadius*6){
			x = Math.floor((xclick)/((panneau.circleRadius)*2));
			y = Math.floor((yclick - panneau.beginSeparator - 3*panneau.separator)/(panneau.circleRadius*2));
			separator += 3*panneau.separator;
		}

		if(x != undefined && y != undefined){
			if(tool.selected == "handYellow")
				socket.emit('pixelYellow', {X:x, Y:y});
			if(tool.selected == "handBlack")
				socket.emit('pixelBlack', {X:x, Y:y});
		}

		recalDots();
	}
}


function handleMouseMove(e){
	var xclick = e.pageX-$("#tableauBusCanvas").offset().left;
	var yclick = e.pageY-$("#tableauBusCanvas").offset().top
	//y = ax + b
	var x, y;
	var separator = panneau.beginSeparator;
	if(yclick > panneau.beginSeparator + panneau.separator && yclick < panneau.beginSeparator + panneau.separator+ 16* panneau.circleRadius*2){
		x = Math.floor((xclick)/(panneau.circleRadius*2));
		y = Math.floor((yclick - panneau.beginSeparator - panneau.separator)/(panneau.circleRadius*2));
		separator += panneau.separator;
	}

	if(yclick > panneau.beginSeparator + 2*panneau.separator+ 16* panneau.circleRadius*2 && yclick <panneau.beginSeparator + 2*panneau.separator+ 16* panneau.circleRadius*4){
		x = Math.floor((xclick)/(panneau.circleRadius*2));
		y = Math.floor((yclick - panneau.beginSeparator - 2*panneau.separator)/(panneau.circleRadius*2));
		separator += 2*panneau.separator;
	}

	if(yclick > panneau.beginSeparator + 3*panneau.separator+ 16* panneau.circleRadius*4 && yclick <panneau.beginSeparator + 3*panneau.separator+ 16* panneau.circleRadius*6){
		x = Math.floor((xclick)/(panneau.circleRadius*2));
		y = Math.floor((yclick - panneau.beginSeparator - 3*panneau.separator)/(panneau.circleRadius*2));
		separator += 3*panneau.separator;
	}

	recalDots();

	var a = (tool.lastY - y)/(tool.lastX - x);
	var b = tool.lastY - a*tool.lastX;

	if(Math.abs(x - tool.lastX) > Math.abs(y- tool.lastY)){
		if(tool.lastX < x){
			for(var i = tool.lastX; i<= x; i++){
				var ay = a*i + b;
				reversePoint(i, Math.round(ay));
			}
		} else {
			for(var i = x; i<= tool.lastX; i++){
				var ay = a*i + b;
				reversePoint(i, Math.round(ay));
			}
		}
	} else if(Math.abs(x - tool.lastX) <= Math.abs(y- tool.lastY)){
		if(x == tool.lastX){
			if(y>tool.lastY){
				for(var i = tool.lastY; i<=y; i++){
					reversePoint(x, i);
				}
			}
			if(y<tool.lastY){
				for(var i = y; i<= tool.lastY; i++){
					reversePoint(x, i);
				}
			}
		}else if(tool.lastY < y){
			for(var i = tool.lastY; i<= y; i++){
				var ax = (i-b)/a;
				reversePoint( Math.round(ax),i);
			}
		} else {
			for(var i = y; i<= tool.lastY; i++){
				var ax = (i-b)/a;
				reversePoint(Math.round(ax), i);
			}
		}
	}
}

function designButtons(ctx){

	//point
	ctx.beginPath();
	ctx.rect(3, 3, 20, 20);
	ctx.fillStyle = "rgb(200,200,200)";
	ctx.lineWidth = "3";
	if(tool.selected == "point"){
		ctx.strokeStyle = "green";
	} else {
		ctx.strokeStyle = "black";
	}
	ctx.stroke();
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.moveTo(12, 5);
	ctx.lineWidth = "2";
	ctx.lineTo(12, 20);
	ctx.stroke();
	ctx.moveTo(5, 12);
	ctx.lineWidth = "2";
	ctx.lineTo(20, 12);
	ctx.stroke();

	// line tool
	ctx.beginPath();
	ctx.rect(26, 3, 20, 20);
	ctx.fillStyle = "rgb(200,200,200)";
	ctx.lineWidth = "3";
	if(tool.selected == "line"){
		ctx.strokeStyle = "green";
	} else {
		ctx.strokeStyle = "black";
	}
	ctx.stroke();
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.strokeStyle = "line";
	ctx.moveTo(26, 3);
	ctx.lineWidth = "2";
	ctx.lineTo(46, 23);
	ctx.stroke();

	// tool hand
	ctx.beginPath();
	ctx.rect(49, 3, 20, 20);
	ctx.fillStyle = "yellow";
	ctx.lineWidth = "3";
	if(tool.selected == "handYellow"){
		ctx.strokeStyle = "green";
	} else {
		ctx.strokeStyle = "black";
	}
	ctx.stroke();
	ctx.fill();
	ctx.drawImage(img, 50, 4, 18, 18);
	
	// tool hand black
	ctx.beginPath();
	ctx.rect(72, 3, 20, 20);
	ctx.fillStyle = "rgb(40,40,40)";
	ctx.lineWidth = "3";
	if(tool.selected == "handBlack"){
		ctx.strokeStyle = "green";
	} else {
		ctx.strokeStyle = "black";
	}
	ctx.stroke();
	ctx.fill();
	ctx.drawImage(img, 73, 4, 18, 18);
}

var img = new Image();
img.src = '/img/hand.png';

$("document").ready(function(){
	for(var i=0; i<panneau.width; i++){
		table[i]=new Array();
		for(var j=0; j<panneau.height; j++){
			table[i][j] = 0;
		}
	}
});

socket.on('table', function(aTable){
	for(var i=0; i<panneau.width; i++){
		for(var j=0; j<panneau.height; j++){
			table[i][j] = aTable [i][j];
		}
	}

	recalDots();
});

socket.on('change', function(data){
	var tableauBus = document.getElementById('tableauBusCanvas');
	var ctx = tableauBus.getContext("2d");
	var separator = panneau.beginSeparator + panneau.separator * (Math.floor(data.Y/16)+1)
	ctx.beginPath();
	ctx.arc(panneau.circleRadius+panneau.circleRadius*2*data.X, panneau.circleRadius+1+panneau.circleRadius*2*data.Y+separator, panneau.circleRadius-1, 0, 2 * Math.PI);
	ctx.strokeStyle = "black";
	ctx.stroke();
	if(data.color == 1){
		ctx.fillStyle = "black";
		table[data.X][data.Y] = 1;
	} else if(data.color == 0){
		ctx.fillStyle = "yellow";
		table[data.X][data.Y]=0;
	}
	ctx.fill();


});


