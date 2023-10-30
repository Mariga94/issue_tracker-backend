import Message from "../models/messageModel.js";

export const createMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { issueId, workspaceId, content } = req.body;
    console.log(req.body, userId);

    const message = await Message.createMessage(
      userId,
      issueId,
      workspaceId,
      content
    );
    res.status(201).send(message);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.getMessages(req.params.id);
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send("Something is wrong!");
  }
};

export const getMessage = async (req, res) => {};
