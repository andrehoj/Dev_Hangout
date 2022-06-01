getUserData();
//
let currentUserName;
//

$("body").on("click", "#account-btn", function () {
  $(".account-slideout").toggleClass("active");
});
//must include the io function to communicate from the browser to the server
var socket = io();

//get the ul, form and input in a variable
// var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function (e) {
  getUserId();
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", {
      msg: input.value,
      username: currentUserName,
    });
    input.value = "";
  }
});

//here we recieve the emit.('chat message') and append the msg
socket.on("chat message", function ({ msg, username }) {
  $("#messages").append(`<li><img class="profile-image" 
  src="../images/gitusericon1.png"/><span>${username}: ${msg}</span></li>`);
  saveMessage(username, msg);
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

async function saveMessage(username, msg) {
  let response = await fetch("/api/posts/save", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      msg,
    }),
  });
  if (response.ok) {
    console.log(`message saved! ${response}`);
  } else console.log(`error: ${response}`);
}

async function getAllMessages() {
  let response = await fetch("/api/posts", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const recentMessages = await response.json();
  appendRecentMessages(recentMessages);
}

getAllMessages();

function appendRecentMessages(messages) {
  messages.forEach((Message) => {
    $("#messages").append(`<li><img class="profile-image" 
    src="../images/gitusericon1.png"/><span>${Message.username}: ${Message.message}</span></li>`);
  });
}

//for every message appended to the dom get the message content, username
//send to the message and userto the modal model
