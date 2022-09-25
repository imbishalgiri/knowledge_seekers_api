import { Response, Request } from "express";
export const UploadImageController = (req: Request, res: Response) => {
  const image = req.file.path;

  return res.status(200).json({
    status: "success",
    image,
  });
};
