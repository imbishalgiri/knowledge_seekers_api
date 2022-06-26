import { validateError } from "app/utils/validator";
import { Request, Response } from "express";
import { User } from "app/models";
import ExcelToJson from "convert-excel-to-json";
import fs from "fs";

export const getAllUsers = (req: Request, res: Response) => {
  res.send({
    status: "success",
    message: "This is get all users",
  });
};

// this controller adds single user to the database
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
    res.send(userAdded);
  } catch (err) {
    res.status(400).send(validateError(err));
  }
};

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
