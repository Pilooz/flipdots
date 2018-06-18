var panneau = {
	width: 112,
	height: 48 ,
	circleRadius:0,
	beginSeparator: 20,
	separator : 30,

};

var socket = io('http://10.169.0.245:1234/');

socket.on('connection', function(){
	// Do something because we are connected

});


$("document").ready(function(){
	socket.emit('reset');
});

socket.on('reset', function(data){
	var tableauBus = document.getElementById('tableauBusCanvas');
	var ctx = tableauBus.getContext("2d");
	
	var width = ctx.canvas.width;
	var height = ctx.canvas.height;

	/* - Background - */

	ctx.beginPath();
	ctx.fillStyle = "rgb(90,90,90)";
	ctx.fillRect(0, 0, width, height);
	ctx.fill();

	//ctx.font = "50px Arial";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("Reseting... Please Wait ...", tableauBus.width/2, tableauBus.height/2);
});


socket.on('reseted', function(data){
	var tableauBus = document.getElementById('tableauBusCanvas');
	var ctx = tableauBus.getContext("2d");
	
	var width = ctx.canvas.width;
	var height = ctx.canvas.height;

	/* - Background - */

	ctx.beginPath();
	ctx.fillStyle = "rgb(90,90,90)";
	ctx.fillRect(0, 0, width, height);
	ctx.fill();

	ctx.font = "50px Arial";
	ctx.fillStyle = "green";
	ctx.textAlign = "center";
	ctx.fillText("Done ..", tableauBus.width/2, tableauBus.height/2);
});
