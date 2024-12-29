import { successResponse } from "../helper/successResponse.js";

// Create a new File
export const createFile = async (req, res) => {
  //   console.log(req.file);
  let link = `localhost:8000/${req.file.filename}`;
  //   console.log("hello");
  successResponse(res, 201, "File successfully created", link);
};

export const createMultipleFile = async (req, res) => {
  //   console.log(req.files);
  // {
  //     fieldname: 'file',
  //     originalname: 'MacbookAirM1.jpeg',
  //     encoding: '7bit',
  //     mimetype: 'image/jpeg',
  //     destination: './uploads',
  //     filename: '1735374624980MacbookAirM1.jpeg',
  //     path: 'uploads\\1735374624980MacbookAirM1.jpeg',
  //     size: 17281
  //   }
  let links = req.files.map((value, i) => {
    let link = `localhost:8000/${value.filename}`;
    return link;
  });
  console.log(links);
};
