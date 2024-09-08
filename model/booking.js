import mongoose from "mongoose"
const bookedticket=new mongoose.Schema({
    seatno:{
       type:Number,
       default:0,
    }
})
export default mongoose.model("booked",bookedticket);