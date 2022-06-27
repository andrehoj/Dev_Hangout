console.log("Script is reloaded");

if (window.io) {
  console.log("io now exists");

  let room = document.location.pathname.replace("/room/", "");

  if (room === "/") room = "general";

  var socket = io();

  // getting all the neccessary data for current room
  getAllUsersData().then((userData) => {
    listAllUsers(userData);
  });
  getCurrentSession().then((session) => {
    displayCurrentUser(session);
  });
  getAllMessages(room).then((messages) => {
    appendMessages(messages);
  });
  addActiveRoom();

  getCurrentSession().then((session) => {
    console.log(`${session.username} is joining room ${room}`);
    socket.emit("joinRoom", {
      room: room,
      username: session.username,
    });
  });

  socket.on("user connected", function () {
    console.log("a user connected");
    getAllUsersData().then((userData) => {
      listAllUsers(userData);
    });
  });

  socket.on("chat message", function ({ msg, username, userId, pfp }) {
    let currentTime = getCurrentTime();
    appendCurrentMessage(msg, username, userId, currentTime, pfp);

    $("#messages").scrollTop($("#messages")[0].scrollHeight);

    getCurrentSession().then((session) => {
      if (session.user_id === userId) {
        saveMessage(username, msg, userId, currentTime, room);
      }
    });
  });

  socket.on("user disconnect", () => {
    getAllUsersData().then((usersData) => {
      listAllUsers(usersData);
    });
  });
}

//handles room change
$("#room-list").click(function (event) {
  let room = $(event.target).text().toLowerCase();

  loadRoom(room);

  getCurrentSession().then((session) => {
    socket.emit("joinRoom", { username: session.username, room: room });
  });
});

//handles chat message saving
$("#chat-form").submit(function (event) {
  let roomName = document.location.pathname.replace("/room/", "");
  event.preventDefault();
  getCurrentSession().then((session) => {
    const message = $("#chat-input").val().trim();
    if (message) {
      socket.emit("chat message", {
        msg: message,
        username: session.username,
        userId: session.user_id,
        pfp: session.pfp,
        room: roomName,
      });
      $("#chat-input").val("");
    }
  });
});

async function getAllUsersData() {
  let response = await fetch("/api/users", {
    method: "get",
    "Content-type": "application/json",
  });

  if (response.ok) {
    let userData = await response.json();
    return userData;
  } else console.log(`Error: ${response}`);
}

function displayCurrentUser(session) {
  $("#current-user-pfp").attr("src", `${session.pfp}`);
  $("#slideout-username").text(session.username);
}

function listAllUsers(usersData) {
  $("#user-list").children().remove();

  getCurrentSession().then((session) => {
    usersData.forEach((user) => {
      if (user.username === session.username) {
        return;
      }

      $("#user-list").append(
        `<li data-user-id-${user.id} class="user-list-item" >
        <img class='active-list-pfp' src='${user.pfp}'></img>
        <span>${user.username} <span class="${checkIfActive(
          user.isActive
        )}">●</span></li>`
      );
    });
  });
}

function checkIfActive(isActive) {
  if (isActive) {
    return "logged-in";
  } else return "logged-out";
}

async function saveMessage(username, msg, userId, currentTime, room) {
  let response = await fetch("/api/messages/save", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      username,
      msg,
      currentTime,
      room,
    }),
  });
  if (response.ok) {
    return;
  } else console.log(`error: ${response}`);
}

async function getAllMessages(room) {
  const response = await fetch(`/api/messages/${room}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const recentMessagesData = await response.json();
  console.log(recentMessagesData);
  return recentMessagesData;
}

function appendMessages(messages) {
  $("#messages").empty();
  messages.forEach((message) => {
    $("#messages").append(`<li>
    <img src='${message.user.pfp}' class='profile-image'></img>
    <span><strong>${message.user.username}</strong>: ${message.message}</span>
    <span class="message-date" id="message-time">     ${message.timeOfMessage}</span>
    </li>`);
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
  });
}

async function getCurrentSession() {
  let session = await fetch("/api/users/session", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  session = await session.json();

  return session;
}

function getCurrentTime() {
  return new Date().toLocaleString();
}

function appendCurrentMessage(msg, username, userId, currentTime, pfp) {
  $("#messages").append(
    `<li>
    <img src='${pfp}' class='profile-image'></img>
    <span data-id-${userId}><strong>${username}</strong>: ${msg}</span>
    <span class="message-date" id="message-time">     ${currentTime}</span></li>`
  );
}

function loadRoom(room) {
  document.location.href = `/room/${room}`;
}

function addActiveRoom() {
  let currentRoom = $(".room-title").text().replace("#", "").trim();

  $("#room-list")
    .children()
    .each(function () {
      if ($(this).text().toLowerCase() === currentRoom) {
        $(this).addClass("active-room");
      } else $(this).removeClass("active-room");
    });
}

//

$("body").on("click", "#account-btn", function () {
  $("#settings-slide").removeClass("active");
  $("#explore-slide").toggleClass("active");
  $(".hamburger").toggleClass("is-active");
});

$("body").on("click", ".accordion-heading", function () {
  $(".list-container, .accordion-heading").each(function () {
    $(this).removeClass("active");
  });
  $(this).addClass("active");
  $(this).next(".list-container").addClass("active");
});

//to do:
//make a user constructor
