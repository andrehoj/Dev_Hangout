$(document).ready(async function () {
  if (window.io) {
    const chatForm = $("#chat-form");
    const roomName = $("#room-name");

    roomName.text(
      `Your chat with  ${document.location.pathname
        .split("/")[2]
        .replace(/%20/g, " ")}`
    );

    $("#chat-input").attr(
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
      receiver.socketId = socketId;
    });

    chatForm.submit(async function (event) {
      try {
        event.preventDefault();

        const message = $("#chat-input").val().trim();

        const timeOfMessage = getCurrentTime();

        let isCodeBlock;

        $("#chat-input").attr("placeholder") === "Enter your code block"
          ? (isCodeBlock = true)
          : (isCodeBlock = false);

        if (message) {
          socket.emit("direct message", {
            message: message,
            receiver: receiver,
            sender: currentUser,
            timeOfMessage: timeOfMessage,
            isCodeBlock: isCodeBlock,
          });

          saveDm(message, receiver, currentUser, isCodeBlock);

          $("#chat-input").val("");
        }
      } catch (error) {
        //error:(
      }
    });

    socket.on("direct message", (message, receiver, sender, isCodeBlock) => {
      appendDm(message, receiver, sender, isCodeBlock);
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

    async function saveDm(message, receiver, sender, isCodeBlock) {
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
            isCodeBlock: isCodeBlock,
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

      dms.forEach((dm) => {
        if (dm.isCodeBlock) {
          messageContainer.append(
            `<li class="list-group-item d-flex w-90">
         
            <img src="${dm.sender.pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
         
          <div class="ms-2 d-flex flex-column text-start w-100">
            <div class="d-flex gap-1 w-100">
              <p style='color: ${dm.sender.favColor};'><u>${dm.sender.username}</u></p>
              <span class="blockquote-footer">${dm.timeOfMessage}</span>
            </div>
            <div class="d-flex gap-1 w-100">
            <span class="break-word w-90 me-2"><pre><code class="javascript">${dm.message}</code></pre></span>
          </div>
          </div>
        </li>`
          );
        } else {
          messageContainer.append(
            `<li class="list-group-item d-flex w-90">
         
            <img src="${dm.sender.pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
         
          <div class="ms-2 d-flex flex-column text-start w-100">
            <div class="d-flex gap-1 w-100">
              <p style='color: ${dm.sender.favColor};'><u>${dm.sender.username}</u></p>
              <span class="blockquote-footer">${dm.timeOfMessage}</span>
            </div>
            <div class="d-flex gap-1 w-100">
              <span class="break-word w-90 me-2">${dm.message}</span>
            </div>
          </div>
        </li>`
          );
        }
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

      if (message.isCodeBlock) {
        messageContainer.append(`<li class="list-group-item d-flex w-90">
     
        <img src="${message.sender.pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
     
      <div class="ms-2 d-flex flex-column text-start w-100">
        <div class="d-flex gap-1 w-100">
          <p style='color: ${message.sender.favColor};'><u>${message.sender.username}</u></p>
          <span class="blockquote-footer d-none d-sm-block">${message.timeOfMessage}</span>
        </div>
        <div class="d-flex gap-1 w-100">
          <span class="break-word w-90 me-2"><pre><code class="javascript">${message.message}</code></pre></span>
        </div>
      </div>
    </li>`);
      } else {
        messageContainer.append(`<li class="list-group-item d-flex w-90">
     
        <img src="${message.sender.pfp}" alt="profile cover" class="rounded-5 chat-pfp" />
     
      <div class="ms-2 d-flex flex-column text-start w-100">
        <div class="d-flex gap-1 w-100">
          <p style='color: ${message.sender.favColor};'><u>${message.sender.username}</u></p>
          <span class="blockquote-footer d-none d-sm-block">${message.timeOfMessage}</span>
        </div>
        <div class="d-flex gap-1 w-100">
          <span class="break-word w-90 me-2">${message.message}</span>
        </div>
      </div>
    </li>`);
      }

      //   messageContainer.append(
      //     `<li class="list-group-item d-flex w-90">

      //     <img src="${message.sender.pfp}" alt="profile cover" class="rounded-5 chat-pfp" />

      //   <div class="ms-2 d-flex flex-column text-start w-100">
      //     <div class="d-flex gap-1 w-100">
      //       <p style='color: ${message.sender.favColor};'><u>${message.sender.username}</u></p>
      //       <span class="blockquote-footer">${message.timeOfMessage}</span>
      //     </div>
      //     <div class="d-flex gap-1 w-100">
      //       <span class="break-word w-90 me-2">${message.message}</span>
      //     </div>
      //   </div>
      // </li>`
      //   );
      messageContainer.scrollTop(messageContainer[0].scrollHeight);
    }

    // $("#code-block").click(() => {
    //   if ($("#chat-input").attr("placeholder") === "Enter your code block") {
    //     $("#chat-input").attr(
    //       "placeholder",
    //       "message # " +
    //         `${document.location.pathname.split("/")[2].replace(/%20/g, " ")}`
    //     );
    //   } else {
    //     $("#chat-input").attr("placeholder", "Enter your code block");
    //   }
    // });

    $("#code-block").click(() => {
      if ($("#chat-input").attr("placeholder") === "Enter your code block") {
        $("#code-block").css("color", "");

        $("#chat-input").replaceWith(
          `<input type='text' class='p-3 ps-4 border-0 input-styles w-90' placeholder='message # ${document.location.pathname
            .split("/")[2]
            .replace(/%20/g, " ")}'
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
  }
});
