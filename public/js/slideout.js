//this file is used to handle all things in the aside slide out
//It handles the slide out on click, appending the users info to the slideout,listing the active users and all the users,the rooms and active rooms and the dm list and all the click events on the lists

$(document).ready(async function () {
  if (window.io) {
    console.log("slideout.js is connected");

    const userList = $("#user-list");
    const roomList = $("#room-list");
    const dmList = $("#direct-msg-list");

    socket.on("user connected", async () => {
      console.log("bonjour");
      const usersData = await getAllUsersData();
      const dms = await getAllDms(currentUser);
      const activeDms = filterActiveDms(dms);
      appendActiveDms(activeDms);
      listAllUsers(usersData);
    });

    socket.on("user disconnected", async () => {
      console.log("bonjour");
      const usersData = await getAllUsersData();
      listAllUsers(usersData);
      const dms = await getAllDms(currentUser);
      const activeDms = filterActiveDms(dms);
      appendActiveDms(activeDms);
      listAllUsers(usersData);
    });

    const currentUser = await getCurrentUsersInfo();
    const usersData = await getAllUsersData();
    const dms = await getAllDms(currentUser);
    const activeDms = filterActiveDms(dms);

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
    function filterActiveDms(dms) {
      console.log(dms);
      const usersWithDms = dms.map((dm, i) => {
        const dmObj = {};

        dmObj.msgId = dm.id;
        dmObj.receiverId = dm.receiver.id;
        dmObj.receiver = dm.receiver.username;
        dmObj.pfp = dm.receiver.pfp;
        dmObj.isActive = dm.receiver.isActive;

        return dmObj;
      });

      const uniqueUsers = [];
      console.log(usersWithDms);
      const filteredUsers = usersWithDms.filter((user) => {
        const isDuplicate = uniqueUsers.includes(user.receiver);

        if (!isDuplicate) {
          uniqueUsers.push(user.receiver);
          return true;
        }
        return false;
      });
      console.log(filteredUsers);
      return filteredUsers;
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
            user.receiver
          }</span> <span class="${checkIfActive(user.isActive)}">●</span></li>`
        );
      });
    }

    //handles room change
    roomList.click(function (event) {
      const room = $(event.target).text();

      loadRoom(room);

      socket.emit("join room", { username: currentUser.username, room: room });
    });

    function loadRoom(room) {
      document.location.href = `/room/${room}`;
    }

    //Dms
    $("#direct-msg-form").submit(async function (e) {
      e.preventDefault();

      const directMsg = $("#direct-msg-input").val().trim();
      const receiver = $("#modal-username").text().trim();

      if (directMsg && receiver) {
        const receiverData = await getReceiverUsername(receiver);
        const res = await saveDm(directMsg, receiverData, currentUser);

        if (res) {
          $("#userInfoModal").hide();
          $("#direct-msg-input").val("");

          // socket.emit("dm started", {
          //   directMsg, receiver
          // });

          const dms = await getAllDms(currentUser);
          const userDmList = await filterActiveDms(dms);
          appendActiveDms(userDmList);
        }
      } else {
        //error :(
      }
    });

    async function saveDm(...args) {
      try {
        const response = await fetch("/api/dm/save-dm-message", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(args),
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

    $("#direct-msg-list").on("click", "li span", async function () {
      loadDmRoom($(this).text());
    });

    async function getDm(dmUserId, { user_id }) {
      let res = await fetch(
        `/api/dm/get-dms-by-userid/${dmUserId}/${user_id}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.json();
    }

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
