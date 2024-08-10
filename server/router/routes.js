import mongoose from "mongoose";
import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import dotenv from "dotenv";
import authenticate from "../middleware/Authenticate.js";
import Ride from "../model/rideSchema.js";
import RideRequest from "../model/rideRequestSchema.js";

dotenv.config();

router.get("/", (req, res) => {
  res.send("Welcome to NATIONAL INSTITUTE OF TECHNOLOGY's CAR POOL SYSTEM");
});

router.post("/user/register", async (req, res) => {
  const { UID, user_type, fname, lname, email, designation, phone, password } =
    req.body;
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ UID });
    if (existingUser) {
      return res
        .status(400)
        .send("UID already exists. Please contact the administrator.");
    }
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

router.get("/rides/all", async (req, res) => {
  try {
    const query = {};
    if (req.query.from_location) query.from_location = req.query.from_location;
    if (req.query.to_location) query.to_location = req.query.to_location;
    if (req.query.doj) query.doj = req.query.doj;
    if (req.query.price) query.price = req.query.price;

    // Fetch rides
    const rides = await Ride.find(query);

    // Fetch publisher details for each ride
    const ridesWithPublisherDetails = await Promise.all(
      rides.map(async (ride) => {
        const user = await User.findOne({ UID: ride.PublisherID });
        return {
          ...ride.toObject(),
          publisher_fname: user ? user.fname : "Unknown",
          publisher_lname: user ? user.lname : "Unknown",
        };
      })
    );

    res.status(200).json(ridesWithPublisherDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Request to be added to a ride by another user
router.post("/users/:uid/requests", async (req, res) => {
  try {
    const { publisher_id, ride_id } = req.body;
    const { uid } = req.params;

    // Check if the ride exists and fetch the number of available seats
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({ message: "Seats not available" });
    }

    // Check if the requestee has already requested this ride
    const existingRequest = await RideRequest.findOne({
      requestee_id: uid,
      ride_id,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Ride already requested" });
    }

    // Create a new ride request
    const newRequest = new RideRequest({
      requestee_id: uid,
      ride_id,
      publisher_id,
    });
    await newRequest.save();

    res.status(200).json({ message: "Ride requested successfully" });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

export default router;
