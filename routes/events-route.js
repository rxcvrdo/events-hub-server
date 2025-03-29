import express from 'express';

import validateToken from '../middlewares/validate-token.js';

import EventModel from '../models/event-model.js';
const router = express.Router();

router.post('/create-event', validateToken, async (req, res) => {
  try {
   const event = await EventModel.create(req.body);
   return res
   .status(201)
   .json({message: 'Event created successfully', event});
  } catch (error) {
    res.status(500).send('An error occurred while creating the event');
    console.log("the following error occure:", error)
  }
}
);

router.put('/edit-event/:id', validateToken, async (req, res) => {
    try {
        const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res
        .json({message: 'Event updated successfully', event});
    } catch (error) {
        res.status(500).send('An error occurred while updating the event');
    }
}
);

router.delete('/delete-event/:id', validateToken, async (req, res) => {
    try {
        await
        EventModel.findByIdAndDelete(req.params.id);
        return res
        .json({message: 'Event deleted successfully'});
    } catch (error) {
        res.status(500).send('An error occurred while deleting the event');
    }
}
);

router.get('/get-events', async (req, res) => {
    try {
      const searchText = req.query.searchText;

      const date = req.query.date;

      const events = await EventModel.find({
        name: { $regex: new RegExp(searchText, "i") },
        ...(date && { date }),
      }).sort({ createdAt: -1 });
      res.json({ message: "Events retrieved successfully", events });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: 'Error getting events' });
    }
  });
  

router.get('/get-event/:id', validateToken, async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        return res
        .json({message: 'Event retrieved successfully', event});
    } catch (error) {
        res.status(500).send('An error occurred while retrieving the event');
    }
}
);


export default router;