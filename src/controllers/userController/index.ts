import { validateError } from "app/utils/validator";
import { Request, Response } from "express";
import { User } from "app/models";
import ExcelToJson from "convert-excel-to-json";
import fs from "fs";

// 1) to get list of all users from database
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("-__v");
    return res.status(200).send({
      status: "success",
      message: "Here are list of all users",
      data: users,
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
    sourceFile: "public/" + req.file.filename,
    columnToKey: {
      A: "email",
      B: "firstName",
      C: "lastName",
    },
  });
  const formattedExcelData = excelData?.Sheet1?.slice(1);
  let fileError = {};
  try {
    const users = await User.insertMany(formattedExcelData, { ordered: false });
    fs.unlink("public/" + req.file.filename, (err) => {
      fileError = err;
    });
    res.send({
      status: "bulk addition success",
      data: users,
      fileError,
    });
  } catch (err) {
    fs.unlink("public/" + req.file.filename, (err) => {
      fileError = err;
    });
    return res.status(207).send({
      status: "error",
      totalDataInserted: err.result.nInserted,
      insertedDatas: err.insertedDocs,
      fileError,
    });
  }
};
