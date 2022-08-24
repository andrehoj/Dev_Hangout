$(document).ready(async function () {
  if (window.io) {
    const chatForm = $("#chat-form");
    const chatInput = $("#chat-input");
    const roomName = $("#room-name");

    roomName.text(
      `Your chat with  ${document.location.pathname
        .split("/")[2]
        .replace(/%20/g, " ")}`
    );

    chatInput.attr(
      "placeholder",
      `message ${document.location.pathname.split("/")[2].replace(/%20/g, " ")}`
    );

    const currentUser = await getCurrentUsersInfo();

    currentUser.socketId = socket.id;

    await saveSocketId(currentUser);

    const receiver = await getRecieverUsername(
      document.location.pathname.split("/")[2]
    );

    const dms = await getCurrentDms(receiver, currentUser);

    appendDms(dms);

    socket.on("user connected", async (socketId) => {
      console.log(
        "user connected as fired, the users socket id is: ",
        socketId
      );
      receiver.socketId = socketId;
    });

    chatForm.submit(async function (event) {
      try {
        event.preventDefault();

        const message = chatInput.val().trim();
        const timeOfMessage = getCurrentTime();

        if (message) {
          socket.emit("direct message", {
            message: message,
            receiver: receiver,
            sender: currentUser,
            timeOfMessage: timeOfMessage,
          });

          saveDm(message, receiver, currentUser);

          chatInput.val("");
        }
      } catch (error) {
        //error:(
      }
    });

    socket.on("direct message", (message, receiver, sender) => {
      appendDm(message, receiver, sender);
    });

    async function getCurrentDms({ id }, { user_id }) {
      const senderId = user_id;
      const receiverId = id;
      try {
        const res = await fetch(
          `/api/dm/get-dms-by-userid/${receiverId}/${senderId}`,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return res.json();
      } catch (error) {
        //error:(
      }
    }

    async function saveDm(message, receiver, sender, timeOfMessage) {
      try {
        const res = await fetch("/api/dm/save-dm-message", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            receiver: receiver,
            sender: sender,
            timeOfMessage: timeOfMessage,
          }),
        });
        return res.json();
      } catch (error) {
        //error:(
      }
    }

    async function getRecieverUsername(username) {
      try {
        const res = await fetch(`/api/users/user-id/${username}`, {
          method: "get",
        });
        return res.json();
      } catch (error) {
        //error:(
      }
    }

    async function getCurrentUsersInfo() {
      try {
        const userInfo = await fetch("/api/users/session");
        return userInfo.json();
      } catch (error) {
        //error:(
      }
    }

    function appendDms(dms) {
      const messageContainer = $("#messages");

      messageContainer.empty();
      console.log(dms);
      dms.forEach((dm) => {
        messageContainer.append(
          `<li class="list-group-item d-flex">
        <div class="">
          <img src="${dm.sender.pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
        </div>
        <div class="ms-2 d-flex flex-column text-start">
          <div class="d-flex gap-1">
            <p class=""><u>${dm.sender.username}</u></p>
            <span class="blockquote-footer">${dm.timeOfMessage}</span>
          </div>
          <span class="">
           ${dm.message}
          </span>
        </div>
      </li>`
        );
      });
      messageContainer.scrollTop(messageContainer[0].scrollHeight);
    }

    async function saveSocketId(currentUser) {
      try {
        const res = await fetch("/api/users/socket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUser: currentUser,
          }),
        });
        return res.json();
      } catch (error) {
        //error:(
        console.log(error);
      }
    }

    function getCurrentTime() {
      return new Date().toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    function appendDm(message) {
      const messageContainer = $("#messages");

      messageContainer.append(
        `<li class="list-group-item d-flex">
        <div class="">
          <img src="${message.sender.pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
        </div>
        <div class="ms-2 d-flex flex-column text-start">
          <div class="d-flex gap-1">
            <p class=""><u>${message.sender.username}</u></p>
            <span class="blockquote-footer">${message.timeOfMessage}</span>
          </div>
          <span class="">
           ${message.message}
          </span>
        </div>
      </li>`
      );
      messageContainer.scrollTop(messageContainer[0].scrollHeight);
    }
  }
});
