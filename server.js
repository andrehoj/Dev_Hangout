const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const sequelize = require("./config/connection");

//session setup
const SequelizeStore = require("connect-session-sequelize")(session.Store);

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

//" io.on" takes two arguments, the first is an event and second is a callback funtion
// the "connection" event fires when a user goes to localhost3001
//when a user visits the site a socket.id is generated maybe use to identify current users
io.on("connection", (socket) => {
  console.log(`A new user has connected. Their id is ${socket.id}`);

  //here we recieve the chat message from the client
  socket.on("chat message", (msg) => {
    console.log(`User ${socket.id} says:${msg}`);
    // emit sends to the browser
    io.emit("chat message", msg);
  });

  //disconnect fires when a user exits the localhost server
  socket.on("disconnect", (socket) => {
    console.log("A user has disconnected.");
  });
});

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(3001, () => {
    console.log("listening on *:3001");
  });
});
