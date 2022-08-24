$(document).ready(function () {
  $("#theme-toggle").click(() => {
    $("body").toggleClass("darktheme");
  });
  if (window.io) {
    const chatForm = $("#chat-form");
    const chatBox = $("#messages");
    const chatInput = $("#chat-input");

    class Room {
      constructor(name) {
        this.name = name;
      }

      joinRoom() {
        socket.emit("join room", {
          room: this.name,
        });
      }

      async getMessages() {
        try {
          const response = await fetch(`/api/messages/${this.name}`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          });
          return response.json();
        } catch (error) {
          console.log(error);
        }
      }

      appendMessages(msg) {
        const { username, pfp } = msg.user;
        const { message, timeOfMessage } = msg;

        $("#messages").append(`<li class="list-group-item d-flex">
        <div class="">
          <img src="${pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
        </div>
        <div class="ms-2 d-flex flex-column text-start">
          <div class="d-flex gap-1">
            <p class=""><u>${username}</u></p>
            <span class="blockquote-footer">${timeOfMessage}</span>
          </div>
          <span class="">
           ${message}
          </span>
        </div>
      </li>`);
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
      }

      async saveMessage(username, msg, currentTime, room, user) {
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
              userId: user.user_id,
            }),
          });
        } catch (error) {
          console.log(error);
        }
      }

      appendMessage(message, timeOfMessage, username, pfp) {
        chatBox.append(`<li class="list-group-item d-flex">
        <div class="">
          <img src="${pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
        </div>
        <div class="ms-2 d-flex flex-column text-start">
          <div class="d-flex gap-1">
            <p class=""><u>${username}</u></p>
            <span class="blockquote-footer">${timeOfMessage}</span>
          </div>
          <span class="">
           ${message}
          </span>
        </div>
      </li>`);

        $("#messages").scrollTop($("#messages")[0].scrollHeight);
      }

      getCurrentTime() {
        return new Date().toLocaleDateString("en-us", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      async getUsersInfo() {
        try {
          let userInfo = await fetch("/api/users/session");
          return userInfo.json();
        } catch (error) {
          console.log(error);
        }
      }
    }

    //gets the messages by room name and append them
    const room = document.location.pathname.replace("/room/", "");

    const testRoom = new Room(document.location.pathname.replace("/room/", ""));

    testRoom.joinRoom();

    testRoom.getMessages().then((messages) => {
      messages.forEach((msg) => {
        testRoom.appendMessages(msg);
      });
    });

    testRoom.getUsersInfo().then((userInfo) => {
      const socketId = socket.id;

      const { username, user_id } = userInfo;

      socket.emit("pushing", { username, user_id, socketId });
    });

    socket.on("pushed", (users) => {
      console.log(users);
    });

    //on chat message append it and save it to the db
    socket.on("chat message", function ({ message, username, pfp }) {
      const timeOfMessage = testRoom.getCurrentTime();

      testRoom.appendMessage(message, timeOfMessage, username, pfp);

      testRoom.getUsersInfo().then((user) => {
        if (user.username === username) {
          testRoom.saveMessage(username, message, timeOfMessage, room, user);
        }
      });
    });

    //on chat message emit the chat message event
    chatForm.submit(function (event) {
      event.preventDefault();

      const message = chatInput.val().trim();

      testRoom.getUsersInfo().then(function (user) {
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
  } else document.location.replace("/login");
});
