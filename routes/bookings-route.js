import express from "express";
const router = express.Router();
import validateToken from "../middlewares/validate-token.js";
import BookingModel from "../models/booking-model.js";
import EventModel from "../models/event-model.js";
import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51R7JcpFQCb3azoPOA3EKPYPf9j4xjcYs42ssulZO3kk1VP9tgzwX2i4mwxeZqDL6yv4WnR4lMcYqc1kO4M1Yp6aS00yWjjnDSZ");

router.post("/create-booking", validateToken, async (req, res) => {
    try {
        req.body.user= req.user._id
        const booking = await BookingModel.create(req.body);

        const event =  await EventModel.findById(req.body.event);
        const ticketTypes = event.ticketTypes;
        const updatedTicketTypes = ticketTypes.map(ticketType => {
            if(ticketType.name === req.body.ticketType){
                ticketType.booked = Number(ticketType.booked ?? 0) + Number(req.body.ticketsCount);
                ticketType.available = Number(ticketType.available ?? ticketType.limit) - Number(req.body.ticketsCount);
            } 
            return ticketType;
        }
        )

        await EventModel.findByIdAndUpdate(req.body.event, {ticketTypes: updatedTicketTypes});
        return res.status(201).json({ message: "Booking created successfully", booking });

    } catch (error) {
        res.status(500).send("An error occurred while creating the booking");
        console.log("the following error occured:", error);
    }
})

router.get("/get-user-bookings", validateToken, async (req, res) => {
    try {
        const bookings = await BookingModel.find({ user: req.user._id }).populate("event").sort({ createdAt: -1 });
        if (!bookings) {
            return res.status(404).json({ message: "No bookings found" });
        }
        return res.status(200).json({ data:bookings });
    } catch (error) {
        return res.status(500).send("An error occurred while fetching bookings");
        console.log("the following error occured:", error);
    }
})

router.get("/get-all-bookings", validateToken, async (req, res) => {
    try {
        const bookings = await BookingModel.find().populate("user").populate("event").populate('user').sort({ createdAt: -1 });
        if (!bookings) {
            return res.status(404).json({ message: "No bookings found" });
        }
        return res.status(200).json({ data: bookings });
    } catch (error) {

        console.log("the following error occured:", error);
        return res.status(500).send("An error occurred while fetching bookings");
       
    }
})

router.post("/cancel-booking", validateToken, async (req, res) => {
    try {
      const { eventId, paymentId, bookingId, ticketsCount, ticketTypeName } = req.body;
  
      
      const booking = await BookingModel.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      
      if (booking.totalAmount > 0 && paymentId) {
        const refund = await stripe.refunds.create({
          payment_intent: paymentId,
        });
  
        if (refund.status !== "succeeded") {
          return res.status(500).send("Refund failed");
        }
      }
  
     
      await BookingModel.findByIdAndUpdate(bookingId, { status: "cancelled" });
  
    
      const event = await EventModel.findById(eventId);
      
      const updatedTicketTypes = event.ticketTypes.map((ticketType) => {
        
        if (ticketType.name.trim() === ticketTypeName.trim()) {
          ticketType.booked =
            Number(ticketType.booked ?? 0) - Number(ticketsCount);
          ticketType.available =
            Number(ticketType.available ?? ticketType.limit) + Number(ticketsCount);
        }
        return ticketType;
      });
  
      await EventModel.findByIdAndUpdate(eventId, { ticketTypes: updatedTicketTypes });
  
      return res.status(200).json({ message: "Booking cancelled successfully" });
  
    } catch (error) {
      console.log("the following error occurred:", error);
      return res.status(500).send("An error occurred while canceling the booking");
    }
  });

export default router;