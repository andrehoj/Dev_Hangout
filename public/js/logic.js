getUserData();
//
let currentUserName;
//

$("body").on("click", "#account-btn", function () {
  $(".account-slideout").toggleClass("active");
});
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
  $("#messages").append(`<li><img class="profile-image" 
  src="../images/gitusericon1.png"/><span>${socket.username}: ${msg}</span></li>`);
});

async function getUserData() {
  let response = await fetch("/api/users", {
    method: "get",
    "Content-type": "application/json",
  });

  if (response.ok) {
    let data = await response.json();
    console.log(data);
    displayCurrentUser(data);
    listAllUsers(data);
  } else console.log(response);
}

function displayCurrentUser(data) {
  if (data[1].username) {
    socket.username = data[1].username;
    currentUserName = data[1].username;
    $("#slideout-username").text(currentUserName);
  }
}

function listAllUsers(data) {
  data[0].forEach((user) => {
    if (user.username === currentUserName) {
      return;
    }
    $("#user-list").append(
      `<li id="user${user.id}" class="user-list-item" ><span>${
        user.username
      } <span class="${checkIfActive(user.is_active)}">●</span></li>`
    );
  });
}

function checkIfActive(loggedIn) {
  if (loggedIn) {
    return "logged-in";
  } else return "logged-out";
}
