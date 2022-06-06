const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const sequelize = require("./config/connection");
const User = require("./models/User");
//session setup
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cors = require("cors");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "secret that no one knows",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

//DB, API routes import

const routes = require("./routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// turn on routes

//handlebars setup
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//have to use the http module to get the server running
const server = require("http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

//enable the use of static html and css/js
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

// app.use(
//   cors({
//     origin: "*",
//   })
// );

//" io.on" takes two arguments, the first is an event and second is a callback funtion
// the "connection" event fires when a user goes to localhost3001
//when a user visits the site a socket.id is generated maybe use to identify current users
io.on("connection", (socket) => {
  io.emit("user connected");
  console.log(
    `\n A User has signed or logged in. Their socket id is ${socket.id} \n`
  );

  socket.on("chat message", ({ msg, username, userId }) => {
    io.emit("chat message", { msg, username, userId });
  });

  //disconnect fires when a user exits the localhost server
  socket.on("disconnect", (socket) => {
    console.log("\n A user has disconnected. \n");
    io.emit("user disconnect");
  });

  socket.on("join second room", (sessionData) => {
    console.log(sessionData);
  });
});

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("listening on *:3001");
  });
});

//on connect we want to refresh the users that are logged
//when a user connects emit a event
//when we emit that event get the signed up users
//send them to the client
//reappend them to the document
