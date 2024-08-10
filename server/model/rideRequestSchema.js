import mongoose from "mongoose";

const rideRequestSchema = new mongoose.Schema({
  requestee_id: { type: String, required: true }, // UID of the user requesting the ride
  ride_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
  }, // ID of the ride
  publisher_id: { type: String, required: true }, // UID of the ride publisher
});

const RideRequest = mongoose.model("RideRequest", rideRequestSchema);
export default RideRequest;
