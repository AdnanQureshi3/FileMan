import app from "./app.js";

import UserRouter from "./Routes/userRouter.js";
import FileRouter from "./Routes/fileRouter.js";
import newRouter from "./Routes/new.js";
import razorpayRoutes from "./Routes/razorpay.js";
import express from "express";
import path from "path";

const PORT = process.env.PORT || 3000;

// app.get('/login', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
// });
const __dirname = path.resolve();
console.log(__dirname , "yes this is my directory")
app.use('/api/user' , UserRouter);
app.use('/api/file' , FileRouter);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/new", newRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {

   
    console.log(`Server is running on port ${PORT}`);
});
