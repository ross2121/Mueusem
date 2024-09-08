import mongoose from "mongoose"
const bookedticket=new mongoose.Schema({
    userid:{
        type:String
    },
    adult:{
        type:Number,
    },
    child:{
        type:Number,
    }
})
export default mongoose.model("booked",bookedticket);