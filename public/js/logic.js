if (window.io) {
  const room = document.location.pathname.replace("/room/", "");

  if (room === "/") room = "General";

  
  console.log(socket);
  socket.on("connect", () => {
    getCurrentSession().then(async (session) => {
      let res = await saveSocketId(session, socket.id);
    });
  });

  // getting all the neccessary data for current room/user
  getAllUsersData().then((userData) => {
    listAllUsers(userData);
  });

  getCurrentSession().then((session) => {
    displayCurrentUser(session);
  });

  if (document.location.pathname.includes("/directmessages")) {
    getCurrentSession().then(async (session) => {
      let receiver = document.location.pathname.split("/")[2];

      let { socketId, id } = await getUserIdByUsername(receiver);

      fetch(`/api/dm/get-dms-by-userid/${id}/${session.user_id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json(res).then((dms) => {
          appendDms(dms);
          //socket.join(socketid)
        });
      });
    });
  } else {
    getAllMessages(room).then((messages) => {
      appendMessages(messages);
    });
  }

  getCurrentSession().then((session) => {
    getAllDms(session).then(async (dms) => {
      let userDmList = await activeDms(dms);
      appendDmUsers(userDmList);
    });
  });

  addActiveRoom();

  getCurrentSession().then((session) => {
    console.log(session, room);
    socket.emit("joinRoom", {
      room: room,
      username: session.username,
    });
  });

  socket.on("user connected", function (socketId) {
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

  socket.on("direct message", function ({ message, id, session }) {
    appendCurrentMessage(
      message,
      session.username,
      session.id,
      session.currentTime,
      session.pfp
    );
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
  });

  socket.on("user disconnect", () => {
    getAllUsersData().then((usersData) => {
      listAllUsers(usersData);
    });
  });
}

//handles room change
$("#room-list").click(function (event) {
  let room = $(event.target).text();

  loadRoom(room);

  getCurrentSession().then((session) => {
    socket.emit("joinRoom", { username: session.username, room: room });
  });
});

//handles chat message saving
$("#chat-form").submit(function (event) {
  if (!document.location.pathname.includes("/directmessages")) {
    let roomName = document.location.pathname.replace("/room/", "");
    event.preventDefault();
    getCurrentSession().then((session) => {
      const message = $("#chat-input").val().trim();
      console.log(roomName);
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
  } else {
    getCurrentSession().then(async (session) => {
      let receiver = document.location.pathname.split("/")[2];

      let { socketId, id } = await getUserIdByUsername(receiver);
      const message = $("#chat-input").val().trim();
      socket.emit("direct message", {
        message,
        to: socketId,
        session,
      });
      $("#chat-input").val("");
    });
  }
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
  $("#user-list").empty();

  getCurrentSession().then((session) => {
    usersData.forEach((user) => {
      if (user.username === session.username) {
        return;
      }

      $("#user-list").append(
        `<li data-user-id="${user.id}" class="user-list-item" >
        <img class='active-list-pfp' src='${user.pfp}'></img>
        <span>${user.username} <span class="${checkIfActive(
          user.isActive
        )}">●</span></li>`
      );
    });
  });

  if ($("#user-list").length < 1) {
    let noUsers = $(
      "<p class='m-0 text-center'>Your the only one! So lonely...</p>"
    );
    $("#user-list").append(noUsers);
  }
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
  return new Date().toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
      if ($(this).text() === currentRoom) {
        $(this).addClass("active-room");
      } else $(this).removeClass("active-room");
    });
}

$("body").on("click", "#account-btn", function () {
  $("#explore-slide").toggleClass("active");
  $(".hamburger-menu").toggleClass("is-active");
});

$("body").on("click", ".accordion-heading", function () {
  $(".list-container, .accordion-heading").each(function () {
    $(this).removeClass("active");
  });
  $(this).addClass("active");
  $(this).next(".list-container").addClass("active");
});

// DIRECT MESSAGES
$("#direct-msg-form").submit(async function (e) {
  e.preventDefault();

  let directMsg = $("#direct-msg-input").val().trim();
  let reciever = $("#modal-username").text().trim();

  if (directMsg && reciever) {
    let session = await getCurrentSession();
    let recieverData = await getRecieverUsername(reciever);
    let res = await saveDm(directMsg, recieverData, session);

    if (res) {
      $("#userInfoModal").hide();
      $("#direct-msg-input").val("");
      getCurrentSession().then((session) => {
        getAllDms(session).then(async (dms) => {
          let userDmList = await activeDms(dms);
          appendDmUsers(userDmList);
        });
      });
    }
  } else {
    //error message if something goes wrong
  }
});

async function saveDm(...args) {
  let response = await fetch("/api/dm/save-dm-message", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  return response;
}

async function getRecieverUsername(username) {
  let res = await fetch(`/api/users/user-id/${username}`, {
    method: "get",
  });
  res = await res.json();
  return res;
}

async function getAllDms({ user_id }) {
  try {
    let response = await fetch(`/api/dm/get-all-dms/${user_id}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });

    let dms = await response.json();

    return dms;
  } catch (error) {
    console.log(error);
  }
}

async function activeDms(dms) {
  let usersWithDms = dms.map((dm, i) => {
    let dmObj = {};

    dmObj.msgId = dm.id;
    dmObj.recieverId = dm.receiver.id;
    dmObj.reciever = dm.receiver.username;
    dmObj.pfp = dm.receiver.pfp;
    dmObj.isActive = dm.receiver.isActive;

    return dmObj;
  });

  const uniqueUsers = [];

  const filteredUsers = usersWithDms.filter((user) => {
    const isDuplicate = uniqueUsers.includes(user.reciever);

    if (!isDuplicate) {
      uniqueUsers.push(user.reciever);

      return true;
    }

    return false;
  });

  return filteredUsers;
}

function appendDmUsers(users) {
  $("#direct-msg-list").empty();
  users.forEach((user) => {
    $("#direct-msg-list").append(
      `<li data-dm-user-id="${user.recieverId}" class="user-list-item" >
    <img class='active-list-pfp' src='${user.pfp}'></img>
    <span>${user.reciever} <span class="${checkIfActive(
        user.isActive
      )}">●</span></li>`
    );
  });
}

$("#direct-msg-list").on("click", "li", function () {
  let { dmUserId } = $(this).data();
  getCurrentSession().then((session) => {
    fetch(`/api/dm/get-dms-by-userid/${dmUserId}/${session.user_id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json(res).then((dms) => {
        loadDmRoom(dms);
      });
    });
  });
});

function loadDmRoom(dms) {
  document.location.href = `/directmessages/${dms[0].receiver.username}`;
}

async function saveSocketId(session, socketId) {
  session.socketId = socketId;
  let res = await fetch("/api/users/socket", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
  });

  if (res.ok) {
    return res;
  }
}

async function getUserIdByUsername(name) {
  try {
    let res = await fetch(`/api/users/${name}`);
    return res.json();
  } catch (error) {}
}

function appendDms(dms) {
  $("#room-name").text("Your chat with " + dms[0].receiver.username);
  $("#messages").empty();
  dms.forEach((dm) => {
    $("#messages").append(`<li>
    <img src='${dm.sender.pfp}' class='profile-image'></img>
    <span><strong>${dm.sender.username}</strong>: ${dm.message}</span>
    <span class="message-date" id="message-time">     ${dm.createdAt}</span>
    </li>`);
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
  });
}
