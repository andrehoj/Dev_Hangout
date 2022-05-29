//must include the io function to communicate from the browser to the server
//the io function comes from the script linked in main
var socket = io();

//get the ul, form and input in a variable
// var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    //.emit sends a request 
    //send to the server with the socket.on('chat message')
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

//here we recieve the emit.('chat message') and append the msg
socket.on("chat message", function (msg) {
  $('#messages').append(`<li><img class="profile-image" 
  src="../images/gitusericon1.png"/><span>User: ${msg}</span></li>`);
});
