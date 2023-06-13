const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dburl = "mongodb+srv://user:user@cluster0.6vi8s2m.mongodb.net/";

let Message = mongoose.model("Message", { name: String, message: String });

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  let message = new Message(req.body);

  message.save((err) => {
    if (err) sendStatus(500);

    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", (socket) => {
  console.log("an user connected");
});

// const connectToMongo = async () => {
//   mongoose.connect(dburl, await console.log("connected"));
// };

mongoose.connect(dburl, (err) => {
  console.log("mongo db cibb", err);
});

const server = http.listen(3000, () => {
  console.log("server is listening on port", server.address().port);
});
