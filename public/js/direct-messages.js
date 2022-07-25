$(document).ready(async function () {
  if (window.io) {
    console.log("direct-messages is linked!");

    const chatForm = $("#chat-form");
    const chatInput = $("#chat-input");
    const roomName = $("#room-name");

    const currentUser = await getCurrentUsersInfo();
    currentUser.socketId = socket.id;

    const receiver = await getRecieverUsername(
      document.location.pathname.split("/")[2]
    );

    socket.on("user connected", async (socketId) => {
      receiver.socketId = socketId;
    });

    const dms = await getCurrentDms(receiver, currentUser);

    roomName.text(
      `Your chat with  ${document.location.pathname.split("/")[2]}`
    );

    appendDms(dms);

    chatForm.submit(async function (event) {
      try {
        event.preventDefault();

        const message = chatInput.val().trim();

        if (message) {
          socket.emit("direct message", {
            message: message,
            receiver: receiver,
            sender: currentUser,
          });
          saveDm(message, receiver, currentUser);
          console.log("cleared");
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

    async function saveDm(...args) {
      try {
        const res = await fetch("/api/dm/save-dm-message", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(args),
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

    async function getUserIdByUsername(name) {
      try {
        const res = await fetch(`/api/users/${name}`);
        return res.json();
      } catch (error) {}
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

      dms.forEach((dm) => {
        messageContainer.append(
          `<li>
        <img src='${dm.sender.pfp}' class='profile-image'></img>
        <span><strong>${dm.sender.username}</strong>: ${dm.message}</span>
        <span class="message-date" id="message-time">     ${dm.createdAt}</span>
        </li>`
        );
      });
      messageContainer.scrollTop(messageContainer[0].scrollHeight);
    }

    function appendDm(message) {
      const messageContainer = $("#messages");

      messageContainer.append(
        `<li>
      <img src='${message.sender.pfp}' class='profile-image'></img>
      <span><strong>${message.sender.username}</strong>: ${
          message.message
        }</span>
      <span class="message-date" id="message-time">     ${"placeholder time"}</span>
      </li>`
      );
      messageContainer.scrollTop(messageContainer[0].scrollHeight);
    }
  }
});
