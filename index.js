import dotenv from "dotenv";
dotenv.config();

console.log("Stripe key:", process.env.STRIPE_SECRET_KEY);
import cookieParser from "cookie-parser";
import express from "express";
import { connectMongoDB } from "./config/db-config.js";
import usersRoute from "./routes/users-route.js";
import eventsRoute from "./routes/events-route.js";
import paymentsRoute from "./routes/payments-route.js";
import bookingsRoute from "./routes/bookings-route.js";






const app = express();
app.use(express.json());
app.use(cookieParser());



connectMongoDB();

app.use("/api/users", usersRoute);
app.use('/api/events', eventsRoute);
app.use("/api/payments", paymentsRoute);
app.use("/api/bookings", bookingsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Node + Express Server is running on port ${port}`);
});
