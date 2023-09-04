const fs = require("fs");
const data = require("./../data.json");

//validation of id(function for middleware)
exports.validateId = (req, res, next, val) => {
  if (val > data.length) {
    return res.status(404).json({ message: `user not found with id:${val}` });
  }
  next();
};

//validate whether all feilds are present or not On post request
exports.validateFeilds = (req, res, next) => {
  if (req.body.first_name==null || req.body.last_name==null || req.body.gender==null) {
    return res.status(404).json({ message: "missing some feilds please check" });
  }
  next();
};

//Read data
exports.getUsers = (req, res) => {
  res.json(data);
};
exports.getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  //Use find() for one match, or filter() for all matches.
  const result = data.find((user) => user.id === id);
  res.json(result);
};

//Write data
exports.postUser = (req, res) => {
  const newData = { id: data.length + 1, ...req.body };
  data.push(newData);
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    if (err) {
      return res.status(500).send({ status: "error" });
    }
    return res.status(201).send({ status: "success", id: data.length });
  });
};

//Update data
exports.updateUserById = (req, res) => {
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
};

//Delete data
exports.deleteUserById = (req, res) => {
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
};
