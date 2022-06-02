getAllMessages();

//random image for users, cors issue i couldnt solve:(
// fetch("https://avatars.dicebear.com/api/:initials?background=%230000ff", {
//   method: "GET",
//   mode: "no-cors",
//   headers: { "Content-Type": "image/svg+xml" },
// }).then((res) => {
//   res.json().then((data) => {
//     console.log(data);
//   });
// });

//
let currentUserName = {};
//

$("body").on("click", "#account-btn", function () {
  $(".account-slideout").toggleClass("active");
  $(".hamburger").toggleClass("is-active");
});

$("body").on("click", ".accordion-heading", function () {
  $(".list-container, .accordion-heading").each(function () {
    $(this).removeClass("active");
  });
  $(this).addClass("active");
  $(this).next(".list-container").addClass("active");
});

if (window.io) {
  var socket = io();

  socket.on("chat message", function ({ msg, username, userId }) {
    let currentTime = new Date().toLocaleString();
    $("#messages").append(
      `<li><span data-id-${userId}><strong>${username}</strong>: ${msg}</span>
      <span class="message-date" id="message-time">     ${currentTime}</span></li>`
    );
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
    getCurrentUsersSessionInfo().then((session) => {
      console.log(msg, username, userId, session.user_id);
      if (session.user_id === userId) {
        saveMessage(username, msg, userId, currentTime);
      }
    });
  });

  //other rooms
  // $("#second-room").on("click", () => {
  //   console.log("click");
  //   getCurrentUsersSessionInfo().then((sessionData) => {
  //     socket.emit("join second room", { sessionData });
  //     socket.on("questions", () => {
  //       console.log("joined");
  //     });
  //   });
  // });

  //if a user connects or disconnects update if they are online or not
  socket.on("user connected", () => {
    getUserData();
  });
  socket.on("user disconnect", () => {
    getUserData();
    getAllMessages();
  });
}

//get the ul, form and input in a variable
// var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", {
      msg: input.value,
      username: currentUserName.username,
      userId: currentUserName.userId,
    });
    input.value = "";
  }
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
    currentUserName = {
      username: data[1].username,
      userId: data[1].user_id,
      loggedIn: data[1].loggedIn,
    };
    console.log(currentUserName);
    $("#slideout-username").text(currentUserName.username);
  }
}

function listAllUsers(data) {
  data[0].forEach((user) => {
    if (user.username === currentUserName.username) {
      return;
    }
    if ($(`[data-id-${user.id}]`)) {
      $(`[data-id-${user.id}]`).remove();
    }
    $("#user-list").append(
      `<li data-id-${user.id} class="user-list-item" ><span>${
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

async function saveMessage(username, msg, userId, currentTime) {
  let response = await fetch("/api/posts/save", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      msg,
      currentTime,
    }),
  });
  if (response.ok) {
    return;
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

function appendRecentMessages(messages) {
  $("#messages").empty();
  messages.forEach((Message) => {
    $("#messages").append(`<li>
    <span><strong>${Message.username}</strong>: ${Message.message}</span>
    <span class="message-date" id="message-time">     ${Message.timeOfMessage}</span>
    </li>`);
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
  });
}

async function getCurrentUsersSessionInfo() {
  let session = await fetch("/api/users/id", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  session = await session.json();
  return session;
}

// let s = new Date().toLocaleString();
// console.log(s);

//
