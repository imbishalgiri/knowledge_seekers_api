import transporter from "app/config/nodemailer";
import UserMessage from "app/models/userMessages";
import { Request, Response } from "express";

// 1) controller to create post
const createMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // create new post here
    const requestedMessage = new UserMessage({ ...req.body });
    await transporter.sendMail({
      from: '"NSU TECHFEST" <noreply@nsutechfest.com>',
      to: req.body.email,
      subject: "Message Acknowledgememt",
      html: `We received your message <br /> thank you for your message`,
      headers: { "x-myheader": "test header" },
    });
    const messageAdded = await requestedMessage.save();
    return res.status(201).send({
      status: "success",
      message: messageAdded,
    });
  } catch (err) {
    res.status(400).send({ status: "failed", error: err });
  }
};
interface reqParams {
  page: number;
  limit: number;
}

const getAllMessages = async (
  req: Request<{}, {}, {}, reqParams>,
  res: Response
) => {
  const page = req.query.page;
  const limit = req.query.limit || 1000;
  try {
    const users = await UserMessage.find({})
      .limit(limit)
      .skip(limit * page)
      .select("-__v");
    const total = await UserMessage.count({});
    return res.status(200).send({
      status: "success",
      message: "Here are list of all messages",
      data: users,
      totalMessages: total,
    });
  } catch (error) {
    res.send({
      status: "failed",
      error: error,
    });
  }
};

// delete single message
const deleteSingleMessage = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let deletedMessage = await UserMessage.findByIdAndDelete(id);
    if (deletedMessage) {
      return res.status(200).send({
        status: "success",
        message: deletedMessage,
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: "failed",
      error,
    });
  }
};

export { createMessage, getAllMessages, deleteSingleMessage };
