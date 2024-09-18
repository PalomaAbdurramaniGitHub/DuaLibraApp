import jwt from "jsonwebtoken";
import StatusCodes from "http-status-codes";
import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");

    if(!token){
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "No token, authorization denied."});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    }catch(error){
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid token."});
    }
}

export default auth;