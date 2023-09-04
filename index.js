const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const userRouter = require("./Router/userRouter");

const app = express();
const PORT = 5000;

//middlewares

app.use(express.json()); //parsing

app.use((req, res, next) => {
  // own middleware
  console.log("control passed from middleware");
  next();
});

app.use(morgan("tiny")); //logger

app.use("/api/v1/users", userRouter); //CRUD operations

//server listening
app.listen(PORT, () => console.log(`server running at port:${PORT}`));
