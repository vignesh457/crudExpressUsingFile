const express = require("express");
const morgan = require("morgan");
const data = require("./data.json");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
  console.log("control passed from middleware");
  next();
});

app.use(morgan("tiny")); //logger

//CRUD operations in express using RESTFUL API(Client Side Rendering(CSR))

//Read data
app.get("/api/v1/users", (req, res) => {
  res.json(data);
});

app.get("/api/v1/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  //Use find() for one match, or filter() for all matches.
  const result = data.find((user) => user.id === id);
  if (!result) {
    return res.status(404).json({ message: `user not found with id:${id}` });
  }
  res.json(result);
});

//Write data
app.post("/api/v1/users", (req, res) => {
  const newData = { id: data.length + 1, ...req.body };
  data.push(newData);
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    if (err) {
      return res.status(500).send({ status: "error" });
    }
    return res.status(201).send({ status: "success", id: data.length });
  });
});

//Update data
//PUT replaces the entire resource, while PATCH updates part of the resource.
app.patch("/api/v1/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  data.map((user, userIndex) => {
    if (user.id === id) {
      data[userIndex] = { ...user, ...req.body };
    }
  });
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    if (err) {
      return res.status(500).send({ status: "error" });
    }
    return res.send({ status: "success", id: id });
  });
});

//Delete data
app.delete("/api/v1/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  data.map((user, userIndex) => {
    if (user.id === id) {
      //splice is used for deleting because it can modify the existing array without creating a new array
      data.splice(userIndex, 1);
    }
  });
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    if (err) {
      return res.status(500).send({ status: "error" });
    }
    return res.send({ status: "success", id: id });
  });
});

app.listen(PORT, () => console.log(`server running at port:${PORT}`));
