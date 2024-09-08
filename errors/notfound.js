import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customerror.js";
class notfound extends CustomAPIError{
    constructor(message){
        super(message);
        this.StatusCodes=StatusCodes.NOT_FOUND

    }
}
export default notfound;