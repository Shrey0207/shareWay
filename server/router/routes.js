import mongoose from "mongoose";
import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import dotenv from "dotenv";
dotenv.config();

router.get("/", (req, res) => {
  res.send("Welcome to NATIONAL INSTITUTE OF TECHNOLOGY's CAR POOL SYSTEM");
});

router.post("/user/register", async (req, res) => {
  const { UID, user_type, fname, lname, email, designation, phone, password } =
    req.body;
  console.log(req.body);
  try {
    const user = new User({
      UID,
      user_type,
      fname,
      lname,
      email,
      designation,
      phone,
      password,
    });
    await user.save();
    console.log(user);
    res.status(201).send("USER registered successfully");
  } catch (error) {
    console.log(error);
  }
});
router.post("/user/login", async (req, res) => {
  console.log(req.body);
  const { UID, password } = req.body;
  console.log("UID : " + UID);
  var token;
  try {
    const user = await User.findOne({ UID });
    if (user) {
      if (password == user.password) {
        console.log("Successfullsignin");
        console.log(user);
        JSON.stringify(user);
        token = await user.generateAuthToken();
        console.log("Tokenn /routes/ -> " + token);
        console.log(user);
        res.status(200).send({ user, token });
      } else {
        console.log("Wrong Password");
        res.status(401).send("Wrong Password");
      }
    } else {
      res.status(401).send("INVALID EMAIL");
    }
  } catch (err) {
    console.log(err);
  }
});
export default router;
