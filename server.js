const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bcrypt = require("bcrypt");
const routes = require("./routes");
const { engine } = require("express-handlebars");

const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
  socket.broadcast.emit("user connected", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);

    socket.on("chat message", ({ msg, username, userId, pfp }) => {
      io.to(room).emit("chat message", { msg, username, userId, pfp });
    });

    socket.on("direct message", ({ message, to, session }) => {
      socket.join(to);
      console.log("got it");
      io.to(to).emit("direct message", {
        message,
        to,
        session
      });
    });

    socket.on("disconnect", (socket) => {
      io.emit("user disconnect");
    });
  });
});

sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("🚀 live on localhost:3001");
  });
});

//res.redirect

//Notes to self
//order of middleware and router/routes matter
//
