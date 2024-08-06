import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
// Load environment variables from .env file
dotenv.config();

//db connection
import "./db/conn.js";

//routes
import router from "./router/routes.js";

const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(router);
app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/`);
});
