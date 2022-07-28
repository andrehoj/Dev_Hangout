//this file is used to handle all things in the aside slide out
//It handles the slide out on click, appending the users info to the slideout,listing the active users and all the users,the rooms and active rooms and the dm list and all the click events on the lists

$(document).ready(async function () {
  if (window.io) {
    const userList = $("#user-list");
    const roomList = $("#room-list");
    const dmList = $("#direct-msg-list");

    const currentUser = await getCurrentUsersInfo();
    const usersData = await getAllUsersData();
    const dms = await getAllDms(currentUser);
    console.log(dms);
    const activeDms = filterActiveDms(dms, currentUser);

    socket.on("user connected", async () => {
      const usersData = await getAllUsersData();
      const dms = await getAllDms(currentUser);
      const activeDms = filterActiveDms(dms, currentUser);
      appendActiveDms(activeDms);
      listAllUsers(usersData);
    });

    socket.on("user disconnected", async () => {
      const usersData = await getAllUsersData();
      listAllUsers(usersData);
      const dms = await getAllDms(currentUser);
      const activeDms = filterActiveDms(dms, currentUser);
      appendActiveDms(activeDms);
      listAllUsers(usersData);
    });

    listAllUsers(usersData);
    displayCurrentUser(currentUser);

    appendActiveDms(activeDms);

    addActiveRoom();

    function listAllUsers(usersData) {
      userList.empty();

      usersData.forEach((user) => {
        if (user.username === currentUser.username) return;

        userList.append(
          `<li data-user-id="${user.id}" class="user-list-item" >
                <img class='active-list-pfp' src='${user.pfp}'></img>
                <span>${user.username} <span class="${checkIfActive(
            user.isActive
          )}">●</span></li>`
        );
      });

      if ($("#user-list").length < 1) {
        const noUsers = $(
          "<p class='m-0 text-center'>Your the only one! So lonely...</p>"
        );
        userList.append(noUsers);
      }
    }

    function displayCurrentUser({ username, pfp }) {
      $("#current-user-pfp").attr("src", `${pfp}`);
      $("#slideout-username").text(username);
    }

    async function getAllUsersData() {
      try {
        const response = await fetch("/api/users", {
          method: "get",
          "Content-type": "application/json",
        });
        return response.json();
      } catch (error) {
        //error:(
      }
    }

    function checkIfActive(isActive) {
      if (isActive) return "logged-in";
      return "logged-out";
    }

    async function getCurrentUsersInfo() {
      try {
        const userInfo = await fetch("/api/users/session");
        return userInfo.json();
      } catch (error) {
        //error:(
      }
    }

    function addActiveRoom() {
      const currentRoom = $(".room-title").text().replace("#", "").trim();
      roomList.children().each(function () {
        if ($(this).text() === currentRoom) {
          $(this).addClass("active-room");
        } else $(this).removeClass("active-room");
      });
    }

    async function getAllDms({ user_id }) {
      try {
        const response = await fetch(`/api/dm/get-all-dms/${user_id}`, {
          method: "get",
          headers: { "Content-Type": "application/json" },
        });
        return response.json();
      } catch (error) {
        //error:(
      }
    }

    //gets a list of usernames to show active dms
    function filterActiveDms(dms, currentUser) {
      const userNames = [];

      dms.forEach((dm) => {
        userNames.push(dm.receiver);
        userNames.push(dm.sender);
      });

      let activeDms = userNames.filter((user) => {
        return user.username != currentUser.username;
      });

      activeDms = activeDms.filter(
        (user, index, self) =>
          index ===
          self.findIndex(
            (key) => key.username === user.username && key.name === user.name
          )
      );

      return activeDms;
    }

    function appendActiveDms(users) {
      dmList.empty();
      if (!users.length) {
        dmList.append(
          "<li class='empty-dms'>You have no dms, to start a dm click on a users name<li/>"
        );
        return;
      }
      users.forEach((user) => {
        dmList.append(
          `<li data-dm-user-id="${user.receiverId}" class="user-list-item" >
          <img class='active-list-pfp' src='${user.pfp}'></img>
          <span class="username-dm">${
            user.username
          }</span> <span class="${checkIfActive(user.isActive)}">●</span></li>`
        );
      });
    }

    //handles room change on click of room list item
    roomList.click(function (event) {
      const room = $(event.target).text();

      loadRoom(room);

      socket.emit("join room", { username: currentUser.username, room: room });
    });

    function loadRoom(room) {
      document.location.href = `/room/${room}`;
    }

    //handles starting dms when a user clicks on a users name and sends a message throught the modal
    $("#direct-msg-form").submit(async function (e) {
      e.preventDefault();

      const directMsg = $("#direct-msg-input").val().trim();
      const receiver = $("#modal-username").text().trim();

      if (directMsg && receiver) {
        const receiverData = await getReceiverUsername(receiver);
        const res = await saveDm(directMsg, receiverData, currentUser);

        if (res) {
          socket.emit("dm started", {
            directMsg,
            receiver,
          });

          $("#userInfoModal").hide();
          $("#direct-msg-input").val("");

          const dms = await getAllDms(currentUser);
          const userDmList = filterActiveDms(dms, currentUser);
          appendActiveDms(userDmList);
        }
      } else {
        //error :(
      }
    });

    async function saveDm(directMsg, receiverData, currentUser) {
      try {
        const response = await fetch("/api/dm/save-dm-message", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: directMsg,
            receiver: receiverData,
            sender: currentUser,
          }),
        });
        return response;
      } catch (error) {
        //error:(
      }
    }

    async function getReceiverUsername(receiverUsername) {
      try {
        const res = await fetch(`/api/users/user-id/${receiverUsername}`, {
          method: "get",
        });
        return res.json();
      } catch (error) {
        //error:(
      }
    }

    //on click on dms list load the dm chat room
    $("#direct-msg-list").on("click", "li span", async function () {
      loadDmRoom($(this).text());
    });

    function loadDmRoom(username) {
      document.location.href = `/directmessages/${username}`;
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
  }
});
