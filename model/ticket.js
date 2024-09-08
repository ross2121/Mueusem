import mongoose from "mongoose"
const ticket=new mongoose.Schema({
    bookedticket:{
        type:Number,
        require:true,
        default:0,
    },
    Availablerticket:{
        type:Number,
        require:true,

    },

})
export  default mongoose.model("Tickets",ticket);