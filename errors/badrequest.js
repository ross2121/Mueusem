import  { StatusCodes } from "http-status-codes"
import CustomAPIError from "./customerror.js"

class badrequest extends CustomAPIError{
    constructor(message){
        super(message)
        this.statuscode=StatusCodes.BAD_REQUEST
    }
}
export default badrequest;