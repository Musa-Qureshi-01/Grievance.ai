import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';


dotenv.config();
const app = express();
app.use(express.json());

// Ensure the database connection is established before handling requests
await connectDB();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/complaints", complaintRoutes);



app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});