import User from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.getUser(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!")
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
