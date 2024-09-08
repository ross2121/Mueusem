import ticket from "../model/ticket";
import notfound from "../errors/notfound"
export const createticket=async(req,res)=>{
    const {ticketid,ticketnumber}=req.body;
   if(!ticketid||!ticketnumber){
    throw new notfound("ticket not found");
   }
    const bookticket=await ticket.create(req.body);
    bookticket.save();
}