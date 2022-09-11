$(document).ready(function () {
  if (window.io) {
    const chatForm = $("#chat-form");

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
        const { username, pfp, favColor } = msg.user;
        const { message, timeOfMessage, isCodeBlock } = msg;

        if (isCodeBlock) {
          $("#messages").append(`<li class="list-group-item d-flex w-90">
       
          <img src="${pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
       
        <div class="ms-2 d-flex flex-column text-start w-100">
          <div class="d-flex gap-1 w-100">
            <p style='color: ${favColor};'><u>${username}</u></p>
            <span class="blockquote-footer d-none d-sm-block">${timeOfMessage}</span>
          </div>
          <div class="d-flex gap-1 w-100">
            <span class="break-word w-90 me-2"><pre><code class="javascript">${message}</code></pre></span>
          </div>
        </div>
      </li>`);
        } else {
          $("#messages").append(`<li class="list-group-item d-flex w-90">
       
          <img src="${pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
       
        <div class="ms-2 d-flex flex-column text-start w-100">
          <div class="d-flex gap-1 w-100">
            <p style='color: ${favColor};'><u>${username}</u></p>
            <span class="blockquote-footer d-none d-sm-block">${timeOfMessage}</span>
          </div>
          <div class="d-flex gap-1 w-100">
            <span class="break-word w-90 me-2">${message}</span>
          </div>
        </div>
      </li>`);
        }

        $("#messages").scrollTop($("#messages")[0].scrollHeight);
      }

      async saveMessage(username, msg, currentTime, room, user, isCodeBlock) {
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
              isCodeBlock,
            }),
          });
        } catch (error) {
          console.log(error);
        }
      }

      appendMessage(message, timeOfMessage, username, pfp, favColor) {
        console.log(message, timeOfMessage, username, pfp, favColor);
        if ($("#chat-input").attr("placeholder") === "Enter your code block") {
          $("#messages").append(`<li class="list-group-item d-flex w-90">
       
          <img src="${pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
       
        <div class="ms-2 d-flex flex-column text-start w-100">
          <div class="d-flex gap-1 w-100">
            <p style='color: ${favColor};'><u>${username}</u></p>
            <span class="blockquote-footer d-none d-sm-block">${timeOfMessage}</span>
          </div>
          <div class="d-flex gap-1 w-100">
            <span class="break-word w-90 me-2"><pre><code class="javascript">${message}</code></pre></span>
          </div>
        </div>
      </li>`);
        } else {
          $("#messages").append(`<li class="list-group-item d-flex w-90">
            <img src="${pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
              <div class="ms-2 d-flex flex-column text-start w-100">
                 <div class="d-flex gap-1 w-100">
                   <p style='color: ${favColor};'><u>${username}</u></p>
                   <span class="blockquote-footer  d-none d-sm-block">${timeOfMessage}</span>
                 </div>
                 <div class="d-flex gap-1 w-100">
                  <span class="break-word w-90 me-2">${message}</span>
                  </div>
                 </div>
                  </li>`);
        }

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

    socket.on("pushed", (users) => {});

    //on chat message append it and save it to the db
    socket.on("chat message", function ({ message, username, pfp, favColor }) {
      const timeOfMessage = testRoom.getCurrentTime();

      testRoom.appendMessage(message, timeOfMessage, username, pfp, favColor);

      testRoom.getUsersInfo().then((user) => {
        if (user.username === username) {
          if (
            $("#chat-input").attr("placeholder") === "Enter your code block"
          ) {
            const isCodeBlock = true;
            testRoom.saveMessage(
              username,
              message,
              timeOfMessage,
              room,
              user,
              isCodeBlock
            );
          } else {
            const isCodeBlock = false;
            testRoom.saveMessage(
              username,
              message,
              timeOfMessage,
              room,
              user,
              isCodeBlock
            );
          }
        }
      });
    });

    //on chat message emit the chat message event
    chatForm.submit(function (event) {
      event.preventDefault();

      const message = $("#chat-input").val().trim();

      testRoom.getUsersInfo().then(function (user) {
        const { username, pfp, favColor } = user;

        if (message) {
          socket.emit("chat message", {
            message,
            username,
            pfp,
            room,
            favColor,
          });
          $("#chat-input").val("");
        }
      });
    });

    $("#code-block").click(() => {
      if ($("#chat-input").attr("placeholder") === "Enter your code block") {
        $("#code-block").css("color", "");

        $("#chat-input").replaceWith(
          `<input type='text' class='p-3 ps-4 border-0 input-styles w-90' placeholder='message # ${room}'
          aria-label="Recipient's username" aria-describedby="basic-addon2" id="chat-input"/>`
        );
      } else {
        $("#code-block").css("color", "#d19a66");
        $("#chat-input").replaceWith(
          "<textarea class='p-3 ps-4 border-0 input-styles w-90' rows='1' cols='40' id='chat-input' placeholder='Enter your code block'></textarea>"
        );
        $("#chat-input").attr("placeholder", "Enter your code block");
      }
    });
  } else document.location.replace("/login");
});
