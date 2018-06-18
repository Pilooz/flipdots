var panneau = { width: 112, height: 48 };
var socket = io('http://localhost:1234');

socket.on('connection', function(){
	alert('Connected');
});

function changeColor(x, y){

  var button = $("#button_"+ x + "_" + y );
  if(button.attr("src") == "img/yellow.png"){
    button.attr("src", "img/black.png");
	socket.emit('click', {X: x, Y: y, color:'black'});
  } else if(button.attr("src") == "img/black.png"){
    button.attr("src", "img/yellow.png");
	socket.emit('click', {X: x, Y: y, color: 'yellow'});
  }
};

function recalDots(){
  document.getElementById("panneauTable").innerHTML = "";
  var panneauTable = $("#panneauTable");
  for(i = 0; i < panneau.height; i+=1){
    panneauTable.append("<tr id=\"line_"+ i + "\" style=\"height:30%;\"></tr>");
    var line = $("#line_"+ i);
    for(j = 0; j < panneau.width; j++){
      line.append("<td style=\"text-align:center; margin:0px; padding:0px;\" onclick=\"changeColor(" + j + "," + i + ")\">\n\
      <img id=\"button_" + j + "_" + i + "\" class=\"rounded-circle\" style=\"margin:0px; padding:0px; height:" + (window.innerHeight-20)/panneau.height + "px;\" src=\"img/black.png\"/>\n\
      </td>\n");
    }
  }

}

$("document").ready(function(){
  recalDots();
});
