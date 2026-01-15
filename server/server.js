import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()

await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Server is Live!'))

// app.use(requireAuth()) - Removed to allow custom API auth handling

app.use('/api/ai', (req, res, next) => {
    console.log(`AI Route hit: ${req.method} ${req.url}`);
    next();
}, aiRouter)
app.use('/api/user', userRouter)

// 404 Handler for API routes
app.use('/api', (req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, message: "API Endpoint not found", path: req.originalUrl });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
    console.log('AI Routes mounted at /api/ai');
    console.log('User Routes mounted at /api/user');
})