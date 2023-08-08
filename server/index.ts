import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

//import userRouter from "./routes/user";
import { authenticator_middleWare } from './middleware/auth';

const app = express();

app.use(cors());
app.use(authenticator_middleWare);
app.use(express.json());
import {router as adminRoute} from "./routes/admin";
import {router as userRoute} from "./routes/user";
import {router as utilityRoute} from "./routes/utility";
app.use("/admin", adminRoute);
app.use("/users", userRoute);
app.use("/util", utilityRoute);

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
// mongoose.connect('mongodb://localhost:27017/courses', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });
mongoose.connect('mongodb+srv://vikasbashu:Cb21DWHdt02WyvIc@tycers.o6r8vsu.mongodb.net/CourseBay?retryWrites=true&w=majority'
// , {
//   useNewUrlParser: true, useUnifiedTopology: true}
  );

app.listen(3000, () => console.log('Server running on port 3000'));
