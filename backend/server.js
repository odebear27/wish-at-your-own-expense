require("dotenv").config();
const express = require("express");

//SAFEGUARDS
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const user = require("./src/routers/users");
const admin = require("./src/routers/admins");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", user, admin);

const PORT = process.env.SERVER_PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
