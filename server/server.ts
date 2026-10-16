import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import ConnectDb from "./config/db.js";
import authRouter from "./Routes/authRoutes.js";

const app = express();

/// connect db
await ConnectDb()

// Middleware
app.use(cors())
app.use(express.json());

app.use('/api/auth', authRouter)

app.use((err:Error, req:Request, res: Response, next:NextFunction) => {
     console.error('Unhandle Error', err);
     res.status(500).json({
        message:err.message || "Internal Server Error",
        stack:process.env.NODE_ENV === 'production' ? undefined : err.stack
     })
})

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!!!!!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

