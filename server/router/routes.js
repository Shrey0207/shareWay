import mongoose from "mongoose";
import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import dotenv from "dotenv";
import authenticate from "../middleware/Authenticate.js";
import Ride from "../model/rideSchema.js";

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
  const { UID, password } = req.body;
  console.log("UID : " + UID);
  try {
    const user = await User.findOne({ UID });
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        console.log("Successful sign in");
        const token = await user.generateAuthToken();
        console.log("Token /routes/ -> " + token);
        res.status(200).send({ user, token });
      } else {
        console.log("Wrong Password");
        res.status(401).send("Wrong Password");
      }
    } else {
      res.status(401).send("INVALID UID");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.post("/users/:UID/rides", async (req, res) => {
  const { UID } = req.params;
  const { from, to, no_of_pass, doj, price } = req.body;
  try {
    const ride = new Ride({
      PublisherID: UID,
      from,
      to,
      no_of_pass,
      doj,
      price,
      _id,
    });
    await ride.save();
    console.log(ride);
    res.send("RIDE PUBLISHED successfully");
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:UID/rides", authenticate, async (req, res) => {
  const { UID } = req.params;
  try {
    const userRides = await Ride.find({ PublisherID: UID });
    res.status(200).json(userRides);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch rides" });
  }
});

router.get("/rides/all", async (req, res) => {
  try {
    const allRides = await Ride.find();
    res.status(200).json(allRides);
  } catch (e) {
    console.log(e);
  }
});

router.get("/user/dashboard", authenticate, function (req, res) {
  console.log("Hello from GET / user / dashboard");
  console.log(req.rootUser);
  res.send(req.rootUser);
});

router.get("/user/data/:UID", async (req, res) => {
  const UID = req.params.UID;
  try {
    const data = await User.findOne({ UID });
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

export default router;
