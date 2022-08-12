$(document).ready(function () {
  if (window.io) {
    const chatForm = $("#chat-form");
    const chatBox = $("#messages");
    const chatInput = $("#chat-input");

    //gets the messages by room name and append them
    const room = document.location.pathname.replace("/room/", "");
    getAllMessagesByRoom(room).then((messages) => {
      chatBox.empty();

      messages.forEach((msg) => {
        const { username, pfp } = msg.user;
        const { message, timeOfMessage } = msg;

        appendMessage(message, timeOfMessage, username, pfp);
      });
    });

    //joins the current room
    socket.emit("join room", {
      room: room,
    });

    //on chat message append it and save it to the db
    socket.on("chat message", function ({ message, username, pfp }) {
      const timeOfMessage = getCurrentTime();

      appendMessage(message, timeOfMessage, username, pfp);

      getCurrentUsersInfo().then((user) => {
        if (user.username === username) {
          saveMessage(user, username, message, timeOfMessage, room);
        }
      });
    });

    //on chat message emit the chat message event
    chatForm.submit(function (event) {
      event.preventDefault();

      const message = chatInput.val().trim();

      getCurrentUsersInfo().then(function (user) {
        const { username, pfp } = user;

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

    async function saveMessage(user, username, msg, currentTime, room) {
      const { user_id } = user;
      try {
        await fetch("/api/messages/save", {
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
  } else document.location.replace("/login");
});
