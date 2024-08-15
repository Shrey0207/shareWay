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
    const user = await User.findOne({ UID: UID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ride = new Ride({
      PublisherID: UID,
      from,
      to,
      no_of_pass,
      doj,
      price,
    });
    await ride.save();
    // Add the ride to the user's postedRides array
    user.postedRides.push(ride._id);
    await user.save();
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
  try {
    console.log("Hello from GET /user/dashboard");

    // Extract only the necessary information you want to send
    const userInfo = {
      UID: req.rootUser.UID,
      fname: req.rootUser.fname.trim(),
      lname: req.rootUser.lname.trim(),
      email: req.rootUser.email,
      phone: req.rootUser.phone,
      user_type: req.rootUser.user_type,
      postedRides: req.rootUser.postedRides,
      requestedRides: req.rootUser.requestedRides,
    };

    // Send the structured response
    res.status(200).json({ success: true, user: userInfo });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
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

    // Debug: Log the UID to ensure it's being received correctly
    // console.log("UID from params:", uid);

    // Query the user by the correct field name
    const user = await User.findOne({ UID: uid }); // Adjust field name based on your schema
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
      status: "pending",
    });
    await newRequest.save();

    // Add the request to the user's requestedRides array
    user.requestedRides.push(newRequest._id);
    await user.save();

    res.status(200).json({ message: "Ride requested successfully" });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// Backend route to get requested rides
router.get("/users/:uid/requests", async (req, res) => {
  try {
    const { uid } = req.params;
    // console.log("UID from params:", uid);

    // Find the user by UID
    const user = await User.findOne({ UID: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the ride requests where the user is the requestee
    const requests = await RideRequest.find({
      requestee_id: uid,
    }).populate("ride_id");
    // console.log("Requests found:", requests);

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

router.get("/users/:uid/requeststatus", async (req, res) => {
  try {
    const { uid } = req.params;

    // Step 1: Find the user by UID
    const user = await User.findOne({ UID: uid }).populate("requestedRides");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Find all ride requests of the user
    const rideRequests = await RideRequest.find({
      _id: { $in: user.requestedRides },
    }).populate("ride_id"); // Populate ride_id to get ride details

    // Step 3: Prepare a list to store detailed information
    const detailedRequests = [];

    for (const rideRequest of rideRequests) {
      // Get ride details
      const ride = await Ride.findById(rideRequest.ride_id);

      if (!ride) {
        console.log(`Ride not found for request ${rideRequest._id}`);
        continue;
      }

      // Get publisher details
      const publisher = await User.findOne({ UID: ride.PublisherID });

      if (!publisher) {
        console.log(`Publisher not found for ride ${ride._id}`);
        continue;
      }

      // Prepare the detailed information
      const requestDetail = {
        requestID: rideRequest._id,
        rideID: ride._id,
        from: ride.from,
        to: ride.to,
        doj: ride.doj,
        seatsAvailable: ride.no_of_pass,
        price: ride.price,
        requestStatus: rideRequest.status,
        publisherName: `${publisher.fname} ${publisher.lname}`,
        publisherEmail: publisher.email, // Add email
        publisherPhone: publisher.phone, // Add phone
      };

      detailedRequests.push(requestDetail);
    }

    // Log detailed requests to the console
    console.log("Detailed Requests:", detailedRequests);

    // Send the detailed requests as a response
    res.status(200).json(detailedRequests);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});
// Route to get ride details by slug (MongoDB ObjectId)
router.get("/rides/:slug/requests", async (req, res) => {
  try {
    const { slug } = req.params;

    // Validate the MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(slug)) {
      return res.status(400).json({ message: "Invalid ride ID" });
    }

    // Find the ride by ObjectId
    const ride = await Ride.findById(slug);

    // If the ride is not found
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Return the ride details
    res.status(200).json(ride);
  } catch (error) {
    console.error("Error fetching ride details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/rides/:rideId/requesters", async (req, res) => {
  const { rideId } = req.params;

  try {
    // Find all ride requests with the specified ride_id
    const rideRequests = await RideRequest.find({ ride_id: rideId });

    // Log ride requests for debugging
    console.log("Ride Requests:", rideRequests);

    // If no requests found, return an empty array
    if (rideRequests.length === 0) {
      return res.json({ requests: [] });
    }

    // Iterate over rideRequests to fetch user details based on UID
    const requestsWithUserDetails = await Promise.all(
      rideRequests.map(async (request) => {
        const user = await User.findOne({ UID: request.requestee_id });

        return {
          ...request._doc,
          requesteeName: `${user?.fname || "N/A"} ${user?.lname || "N/A"}`,
          requesteeEmail: user?.email || "N/A",
          requesteePhone: user?.phone || "N/A",
        };
      })
    );

    // Send the combined data to the frontend
    res.json({ requests: requestsWithUserDetails });
  } catch (error) {
    console.error("Error fetching ride requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
