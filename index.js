import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './Routes/users.js'
import authRouter from './Routes/auth.js'
import postRouter from './Routes/posts.js'
import commentRouter from './Routes/comment.js'
import config from 'config'
import cors from 'cors'



const app = express();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log("there is an error", err));

app.use(express.json());

if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwt key is not defined')
  process.exit(1)
}

app.use(cors({
    exposedHeaders: ['x-auth-token'],
    origin: ['http://localhost:5173', 'https://jazzy-tartufo-3ef89f.netlify.app/'],
}))
app.use('/users' , userRouter)
app.use('/auth' , authRouter)
app.use('/posts' , postRouter)
app.use('/posts' , commentRouter)

app.listen(3000, () => {
  console.log("listening on port 3000...");
});
