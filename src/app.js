const express = require("express");
const app = express();
const User = require("./models/user");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const http = require("http");

const authRouter = require("./routes/auth");
const reqRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/userRouter");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

const cors = require("cors");
const { initializeSocket } = require("./utils/socket1.js");
require("dotenv").config();

/* -------------------- MIDDLEWARES -------------------- */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://34.236.153.241:5173",

  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

/* -------------------- HEALTH CHECK -------------------- */

app.get("/", (req, res) => {
  res.send("DevTinder backend is live 🚀");
});

/* -------------------- ROUTES -------------------- */

app.use("/", authRouter);
app.use("/", reqRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

/* -------------------- CUSTOM ROUTES -------------------- */

app.get("/getData", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      return res.status(400).send("No user found!");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;

  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    if (data?.skills && data.skills.length > 10) {
      throw new Error("Dont add more than 10 skills!");
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      data,
      { runValidators: true }
    );

    if (!user) {
      return res.status(404).send("User not found!");
    }

    res.send("User updated successfully!");
  } catch (err) {
    res.status(400).send(err.message || "Something went wrong!");
  }
});

/* -------------------- SERVER + SOCKET -------------------- */

const server = http.createServer(app);
initializeSocket(server);

/* -------------------- DATABASE + START -------------------- */

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    const PORT = process.env.PORT_NUMBER || 3000;
    server.listen(PORT, "0.0.0.0", () => {
      console.log("Backend running on port", PORT);
    });
  })
  .catch(err => {
    console.error("Database cannot be connected!", err);
  });

/* -------------------- GLOBAL SAFETY -------------------- */

process.on("unhandledRejection", err => {
  console.error("Unhandled Promise Rejection:", err);
});
