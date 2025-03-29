import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    organiser: {
        type:String,
        required:true 
    },
    guests: {   
        type: Array,
        required:false
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    media:{
        type: Array,
        required: false,
        default:[]
    },
    ticketTypes: {
        type: Array,
        required: false,
        default: []
    }
},{timestamps: true})

const EventModel = mongoose.model("events", eventSchema);
export default EventModel;