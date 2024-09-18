import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message: props => `${props.value} is not a valid email address.`
        }
    },
    password: {
        type: String, 
        required: true,
        minlength: [5, "Password must be at least 5 characters long"]
    },
});

userSchema.pre("save", async function(next){
    if(this.isModified("password") || this.isNew){
        try{
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }catch(error){
            return next(error);
        }
    }
    next();
})

userSchema.methods.comparePassword = async function(userPassword){
    return bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;