import bcrypt from "bcrypt";
import path from "path";
import { ReqPostUser } from "./../postController/index";
import { validateError } from "app/utils/validator";
import { Request, Response } from "express";
import { User } from "app/models";
import ExcelToJson from "convert-excel-to-json";
import fs from "fs";

// 1) to get list of all users from database
interface reqParams {
  page: number;
  limit: number;
}
export const getAllUsers = async (
  req: Request<{}, {}, {}, reqParams>,
  res: Response
) => {
  const page = req.query.page;
  const limit = req.query.limit;
  try {
    const users = await User.find({})
      .limit(limit)
      .skip(limit * page)
      .select("-__v");
    const total = await User.count({});
    return res.status(200).send({
      status: "success",
      message: "Here are list of all users",
      data: users,
      totalUsers: total,
    });
  } catch (error) {
    res.send({
      status: "failed",
      error: error,
    });
  }
};

// 2) this controller adds single user to the database
export const addToUsers = async (req: Request, res: Response) => {
  try {
    // if user already exists do not add them to the database
    if (await User.findOne({ email: req.body.email })) {
      return res.status(400).send({
        status: "failed",
        message: `${req.body.email} is already registered.`,
      });
    }
    // if not add them to the database
    const requestedUser = new User(req.body);
    const userAdded = await requestedUser.save();
    res.status(200).send({
      status: "success",
      user: userAdded,
    });
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

// 3)_ this accepts xlsx file with users to add into database
export const addUsersFromExcel = async (req: Request, res: Response) => {
  const excelData = ExcelToJson({
    sourceFile: path.join(__dirname, "../../public/") + req.file.filename,
    columnToKey: {
      A: "email",
      B: "firstName",
      C: "lastName",
      D: "faculty",
      E: "semester",
    },
  });
  const formattedExcelData = excelData?.Sheet1?.slice(1);
  const newData = formattedExcelData?.map((el) => ({
    ...el,
    password: el?.email,
    role: "user",
  }));
  let fileError = {};
  try {
    const users = await User.insertMany(newData, { ordered: false });
    fs.unlink(
      path.join(__dirname, "../../public/") + req.file.filename,
      (err) => {
        fileError = err;
      }
    );
    res.send({
      status: "bulk addition success",
      data: users,
      fileError,
    });
  } catch (err) {
    fs.unlink(
      path.join(__dirname, "../../public/") + req.file.filename,
      (err) => {
        fileError = err;
      }
    );
    return res.status(400).send({
      status: "error",
      totalDataInserted: err.result.nInserted,
      insertedDatas: err.insertedDocs,
      fileError,
    });
  }
};

// 4) update single user -->

export const updateSingleUser = async (req: ReqPostUser, res: Response) => {
  const image = req.file?.path;
  const user = req.body?._id;
  const submitData = image ? { ...req.body, avatar: image } : req.body;

  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    const userUpdated = await User.findByIdAndUpdate(user, submitData);
    if (userUpdated) {
      return res.status(200).send({
        status: "success",
        user: userUpdated,
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: "failed",
      error: error,
    });
  }
};

// 5) To get single user
export const getSingleUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let singleUser = await User.findById(id).select("-__v -password");
    if (singleUser) {
      return res.status(200).send({
        status: "success",
        user: singleUser,
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: "failed",
      error,
    });
  }
};

// 6) delete single user
export const deleteSingleUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let deletedUser = await User.findByIdAndDelete(id).select("-__V -password");
    if (deletedUser) {
      return res.status(200).send({
        status: "success",
        user: deletedUser,
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: "failed",
      error,
    });
  }
};
