import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { password, secretKey } from "../constant.js";
import { Register } from "../schema/model.js";
import { sendMail } from "../utils/sendMail.js";

export let createRegister = async (req, res) => {
  try {
    let data = req.body;
    //   data = {
    //     "name": "Siddhanta Shrestha",
    //     "email":"sidmarkys2004@gmail.com",
    //     "password":"Password@123",
    //     "dob":"2004-01-16",
    //     "gender":"Male",
    //     "role":"customer"
    // }
    let hashPassword = await bcrypt.hash(data.password, 10);

    data = {
      ...data,
      isVerifiedEmail: false,
      password: hashPassword,
    };
    let result = await Register.create(data);

    //send email with link

    //generate token
    let infoObj = {
      _id: result._id,
    };

    let expiryInfo = {
      expiresIn: "5d",
    };

    let token = await jwt.sign(infoObj, secretKey, expiryInfo);
    //link => frontend link

    //send mail
    await sendMail({
      from: "'Club House' sidmarkys2004@gmail.com",
      to: [data.email],
      subject: "account create",
      html: `
    <h1>Your account has been created successfully. </h1>
    <a href="http://localhost3000/verify-email?token=${token}">
    http://localhost3000/verify-email?token=${token}
    </a>
    `,
    });

    res.status(201).json({
      success: true,
      message: "register created successfully",
      // data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    let tokenString = req.headers.authorization;
    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1];
    // console.log(token);

    //verify token
    let infoObj = await jwt.verify(token, secretKey);
    let userId = infoObj._id;

    //Code to verify email
    let result = await Register.findByIdAndUpdate(
      userId,
      {
        isVerifiedEmail: true,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "email verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let user = await Register.findOne({ email: email });

    if (user) {
      if (user.isVerifiedEmail) {
        let isValidpassword = await bcrypt.compare(password, user.password);
        if (isValidpassword) {
          let infoObj = {
            _id: user._id,
          };
          let expiryInfo = {
            expiresIn: "365d",
          };
          let token = await jwt.sign(infoObj, secretKey, expiryInfo);

          res.json({
            success: true,
            message: "user login successful.",
            data: user,
            token: token,
          });
        } else {
          let error = new Error("credential does not match");
          throw error;
        }
      } else {
        let error = new Error("credential does not match");
        throw error;
      }
    } else {
      let error = new Error("credential does not match.");
      throw error;
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const myProfile = async (req, res, next) => {
  let userId = req._id;
  try {
    let result = await Register.findById(userId);
    res.status(200).json({
      success: true,
      message: "register read successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to read profile",
    });
  }
};
