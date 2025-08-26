import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//app.use(cors());

app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routers.js"

import videoRouter from "./routes/video.router.js";

import likeRouter from "./routes/like.router.js";

import subscriberRouter from "./routes/subscriber.router.js";

//routes declaration
app.use("/api/v1/users",userRouter);

app.use("/api/v1/videos", videoRouter);

app.use("/api/v1/", subscriberRouter);

app.use("/api/v1/like", likeRouter);


export { app};