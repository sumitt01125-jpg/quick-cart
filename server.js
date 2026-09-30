import "dotenv/config";
import express from "express";
const app = express();

const PORT = process.env.PORT||3000;

//Middleware
app.use(express.json());

//Get Route 
app.get("/",(req,res)=>{
    res.end("Quick-Cart API is runnig on server!!!");
});

//POST Route 
app.post("/users",(req,res)=>{
    console.log(req.body);

    res.json({
        message: "User Recieved",
        data: res.body,
    });
});

//Server Running
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});
