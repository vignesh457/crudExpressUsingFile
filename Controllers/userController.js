const data = require("./../data.json");

//Read data
const getUsers = (req, res) => {
  res.json(data);
};
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  //Use find() for one match, or filter() for all matches.
  const result = data.find((user) => user.id === id);
  if (!result) {
    return res.status(404).json({ message: `user not found with id:${id}` });
  }
  res.json(result);
};
//Write data
const postUserById = (req, res) => {
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
const updateUserById = (req, res) => {
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
const deleteUserById = (req, res) => {
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

module.exports = {
  getUsers,
  getUserById,
  postUserById,
  updateUserById,
  deleteUserById,
};
