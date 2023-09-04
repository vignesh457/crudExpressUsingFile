const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const userRouter = require("./Router/userRouter");

dotenv.config({path: "./config.env"})

const app = express();
const PORT = process.env.PORT;

// console.log(process.env) //It displays both default and user-declared environmental variables from config.env.

//middlewares
app.use(express.json()); //parsing
app.use((req, res, next) => { // own middleware
  console.log("control passed from middleware");
  next();
}); 
app.use(morgan("tiny")); //logger
app.use("/api/v1/users", userRouter); //CRUD operations


//server listening
app.listen(PORT, () => console.log(`server running at port:${PORT}`));
