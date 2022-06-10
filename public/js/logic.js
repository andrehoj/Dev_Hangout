console.log("Script is reloaded");

if (window.io) {
  console.log("io now exists");

  let room = document.location.pathname.replace("/", "");

  var socket = io();

  getAllUsersData().then((userData) => {
    listAllUsers(userData);
  });

  getCurrentSession().then((session) => {
    displayCurrentUser(session);
  });

  getAllMessages(room).then((messages) => {
    appendMessages(messages);
  });

  getCurrentSession().then((session) => {
    console.log(`${session.username} is joining room ${room}`);
    socket.emit("joinRoom", {
      room: room,
      username: session.username,
    });
  });

  socket.on("chat message", function ({ msg, username, userId }) {
    let currentTime = getCurrentTime();
    appendCurrentMessage(msg, username, userId, currentTime);

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

//handles room changes
$("#room-list").click(function (event) {
  $("#room-list")
    .children()
    .each(function () {
      $(this).removeClass("active-room");
    });

  $(event.target).addClass("active-room");

  let room = $(event.target).text().toLowerCase();

  loadRoom(room);

  getCurrentSession().then((session) => {
    socket.emit("joinRoom", { username: session.username, room: room });
  });
});

//handles chat message saving
$("#chat-form").submit(function (event) {
  event.preventDefault();
  getCurrentSession().then((session) => {
    const message = $("#chat-input").val().trim();
    if (message) {
      socket.emit("chat message", {
        msg: message,
        username: session.username,
        userId: session.user_id,
        room: document.location.pathname.replace("/", ""),
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
  $("#current-user-pfp").attr("src", `${session.pfp}`)
  $("#slideout-username").text(session.username);
}

function listAllUsers(usersData) {
  getCurrentSession().then((session) => {
    usersData.forEach((user) => {
      if (user.username === session.username) {
        return;
      }

      if ($(`[data-id-${user.id}]`)) {
        $(`[data-id-${user.id}]`).remove();
      }

      $("#user-list").append(
        `<li data-id-${user.id} class="user-list-item" >
        <img class='active-list-pfp' src='${user.pfp}'></img>
        <span>${
          user.username
        } <span class="${checkIfActive(user.isActive)}">●</span></li>`
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

  return recentMessagesData;
}

function appendMessages(messages) {
  $("#messages").empty();
  messages.forEach((Message) => {
    $("#messages").append(`<li>
    <img src='${Message.pfp}' class='profile-image'></img>
    <span><strong>${Message.userName}</strong>: ${Message.message}</span>
    <span class="message-date" id="message-time">     ${Message.timeOfMsg}</span>
    </li>`);
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
  });
}

async function getCurrentSession() {
  let session = await fetch("/api/users/id", {
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

function appendCurrentMessage(msg, username, userId, currentTime) {
  $("#messages").append(
    `<li><span data-id-${userId}><strong>${username}</strong>: ${msg}</span>
    <span class="message-date" id="message-time">     ${currentTime}</span></li>`
  );
}

function loadRoom(room) {
  document.location.href = `/${room}`;
}

$("body").on("click", "#account-btn", function () {
  $("#settings-slide").removeClass("active");
  $("#explore-slide").toggleClass("active");
  $(".hamburger").toggleClass("is-active");
});

$("body").on("click", "#settings-link", function () {
  $("#explore-slide").removeClass("active");
  $(".hamburger").removeClass("is-active");
  $("#settings-slide").toggleClass("active");
});

$("body").on("click", ".accordion-heading", function () {
  $(".list-container, .accordion-heading").each(function () {
    $(this).removeClass("active");
  });
  $(this).addClass("active");
  $(this).next(".list-container").addClass("active");
});
