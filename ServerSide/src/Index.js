import app from "./app.js";
import ConnectDB from "./DB/ConnectDB.js";
import UserRouter from "./Routes/userRouter.js";

const PORT = process.env.PORT || 3000;

app.use('/api/user' , UserRouter);
// app.use('/api/file' , FileRouter);


app.listen(PORT, () => {

    ConnectDB();
    console.log(`Server is running on port ${PORT}`);
});
