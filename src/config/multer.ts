import multer from "multer";
import path from "path";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    const arrayForNewName = fileName.split(".");
    cb(null, arrayForNewName[0] + Date.now() + "." + arrayForNewName[1]);
  },
});

const appStorage = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".xlsx") {
      return callback(new Error("only file with extension xlsx is allowed"));
    }
    callback(null, true);
  },
});

export default appStorage;
