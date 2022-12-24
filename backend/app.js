const express = require("express");
const cookieParser = require("cookie-parser");
var app = express();
const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());

// Route Import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1",product)
app.use("/api/v1", user)
app.use("/api/v1", order)


// Middleware for Errors

app.use(errorMiddleware);

module.exports = app;