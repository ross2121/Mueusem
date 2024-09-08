import CustomAPIError from "./customerror.js";
import { StatusCodes } from "http-status-codes";
class unauthonticated extends CustomAPIError{
    constructor(message){
        super(message)
        this.StatusCodes=StatusCodes.UNAUTHORIZED
    }
}
export default unauthonticated;