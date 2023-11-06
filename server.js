const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messegeRoute = require("./routes/messeges");
const path = require("path");
const cors = require("cors");
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(fileUpload({ useTempFiles: true }));
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

//our rest api
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/messeges", messegeRoute);
app.use("/api/conversations", conversationRoute);

const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`Backend server is running on on port ${port}`);
});
