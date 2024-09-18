import express from "express";
import cors from "cors"; //Cross-Origin Resource Sharing
import dotenv from "dotenv";
import connectDB from "./config/configDB.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
connectDB();
dotenv.config();

app.use(cors({ 
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", authRoutes);

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server running on port ${process.env.PORT}`);
});