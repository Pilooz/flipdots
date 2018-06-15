// NodeJs FlipBoard Controller

var panneau = {
	width:112,
	height:48

};

// Server Side
const server = require('http').createServer();

const io = require('socket.io')(server, {
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false
});

// Init new table
var table = new Array();
for(var i=0; i < panneau.width; i++){
	table[i] = new Array();
	for(var j=0; j < panneau.height; j++){
		table[i][j] = 1;
	}

}

server.listen(1234);

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
});

function sleep(time){
	var stop = new Date().getTime();
	while(new Date().getTime() < stop + time) {
		;
	}
}

// SerialPort Handler

var SerialPort = require('serialport');
var port = new SerialPort('/dev/tty.usbmodem1421', {
	baudRate: 115200
}, function(err){
	if(err){
		return  console.log("Error on opening serial port: " + err.message);
	}
});


var buffer = new Buffer(255);
buffer = [0xBD, 0xFF, 0X00, 0xF0, 0xFE];

port.write(buffer, function(err){
	if(err){
		return console.log("Error while writing on serial port: " + err.message);
	}
});

function setBoardPixel(x, y, color){
	var buf = new Buffer(255);
	var aColor = 0x00; 

	if(color == 0)
		aColor = 0x00;
	else if(color == 1)
		aColor = 0x01;

	buf=[0xBD, 0xFF, 0x00, 0x10, x, y, aColor, 0xFE];
	port.write(buf, function(err){
		if(err){
			return console.log("Error while writing on serial port: " + err.message);
		}
	});
	port.flush();
	port.drain();
}

io.on('connection', function(socket){
	console.log('New Connection');
	socket.emit('table', table);
	socket.on('click', function(data){
		if(data.X != undefined && data.Y != undefined){
			console.log('X: ' +  data.X + '  - Y: ' + data.Y );
			if(table[data.X][data.Y] == 1){
				setBoardPixel(data.X, data.Y, 0);
				table[data.X][data.Y] = 0;
			} else if(table[data.X][data.Y] == 0){
				setBoardPixel(data.X, data.Y, 1);
				table[data.X][data.Y] = 1;
			}
			io.emit('change', {X: data.X, Y:data.Y, color: table[data.X][data.Y]});
			
		}
	});
	socket.on('pixelYellow', function(data){
		if(data.X != undefined && data.Y != undefined && table[data.X][data.Y] != 0){
			console.log('X: ' +  data.X + '  - Y: ' + data.Y );
			setBoardPixel(data.X, data.Y, 0);
			table[data.X][data.Y] = 0;
		}
		io.emit('change', {X: data.X, Y:data.Y, color: table[data.X][data.Y]});
	});
	socket.on('pixelBlack', function(data){
		if(data.X != undefined && data.Y != undefined && table[data.X][data.Y] != 1){
			console.log('X: ' +  data.X + '  - Y: ' + data.Y );
			setBoardPixel(data.X, data.Y, 1);
			table[data.X][data.Y] = 1;
		}
		io.emit('change', {X: data.X, Y:data.Y, color: table[data.X][data.Y]});
	});
	socket.on('reset', function(){
		var buffer = new Buffer(255);
		buffer = [0xBD, 0xFF, 0X00, 0xF0, 0xFE];

		port.write(buffer, function(err){
			if(err){
				return console.log("Error while writing on serial port: " + err.message);
			}
		});
		io.emit('reset');
		for(var i=0; i < panneau.width; i++){
			table[i] = new Array();
			for(var j=0; j < panneau.height; j++){
				table[i][j] = 1;
			}

		}
		setTimeout(function(){
			io.emit('reseted');
			io.emit('table', table);
		}, 30000);


	});
});
