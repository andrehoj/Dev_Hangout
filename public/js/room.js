//READ: This file is used to: Get all messages from the data base for the current room and append the messages to the chat box, handle saving new messages to the database and using the socket to live append messages to the chat box.

//this file should only be linked in the room.handlebars html page
//it should be linked before the 'slideout.js file"

$(document).ready(async function () {
  socket.on("dm started", (directMsg, receiver) => {
    console.log(directMsg, receiver);
    // $(".alert").text(`You recieved a message from ${receiver.username}`);
    $(".alert")
      .css("opacity", 0, "top", "30px")
      .animate({ opacity: 1, top: "+=25" }, { queue: false });
  });

  console.log("room.js is connected");
  if (window.io) {
    const currentUser = await getCurrentUsersInfo();
    const chatForm = $("#chat-form");
    const chatBox = $("#messages");
    const chatInput = $("#chat-input");
    const room = document.location.pathname.replace("/room/", "");

    socket.emit("join room", {
      room: room,
      username: currentUser.username,
    });

    getAllMessagesByRoom(room).then((messages) => {
      chatBox.empty();
      messages.forEach((msg) => {
        const { username, pfp } = msg.user;
        const { message, timeOfMessage } = msg;
        appendMessage(message, timeOfMessage, username, pfp);
      });
    });

    socket.on("chat message", function ({ message, username, pfp }) {
      const timeOfMessage = getCurrentTime();

      appendMessage(message, timeOfMessage, username, pfp);
      if (currentUser.username === username) {
        saveMessage(username, message, timeOfMessage, room);
      }
    });

    chatForm.submit(function (event) {
      event.preventDefault();

      let message = chatInput.val().trim();
      const { username, pfp } = currentUser;

      if (message) {
        socket.emit("chat message", {
          message,
          username,
          pfp,
          room,
        });
        chatInput.val("");
      }
    });

    async function getCurrentUsersInfo() {
      try {
        let userInfo = await fetch("/api/users/session");
        return userInfo.json();
      } catch (error) {
        //error:(
      }
    }

    async function getAllMessagesByRoom(room) {
      try {
        const response = await fetch(`/api/messages/${room}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.json();
      } catch (error) {
        //error:(
      }
    }

    async function saveMessage(username, msg, currentTime, room) {
      const { user_id } = currentUser;
      try {
        let response = await fetch("/api/messages/save", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            msg,
            currentTime,
            room,
            userId: user_id,
          }),
        });
      } catch (error) {
        //error:(
      }
    }

    function appendMessage(message, timeOfMessage, username, pfp) {
      chatBox.append(`<li>
        <img src='${pfp}' class='profile-image'></img>
        <span><strong>${username}</strong>: ${message}</span>
        <span class="message-date" id="message-time">     ${timeOfMessage}</span>
        </li>`);
      chatBox.scrollTop(chatBox[0].scrollHeight);
    }

    function getCurrentTime() {
      return new Date().toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }
});
