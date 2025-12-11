import express from 'express'
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';


const app = express(); // create an express app
app.use(express.json()); //middleware to parse json

//routes declaration

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);


//example route http://localhost:5000/api/v1/users/register




export default app;