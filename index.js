const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require('dotenv').config();
const db = require("./model");
const job = require("./helper/job");
const users = require("./routes/users.route");
const bookings = require("./routes/bookings.route");
const properties = require("./routes/properties.route");
const notifications = require("./routes/notifications.route");
const groups = require("./routes/groups.route");

const app = express();
app.use(cors({
    "origin": "*",
    "methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", users);
app.use("/api/v1", bookings);
app.use("/api/v1", properties);
app.use("/api/v1", notifications);
app.use("/api/v1", groups);

db.sequelize.sync().then(() => {
    console.log("connect with data and sync db...");
    job.cronJob();
}).catch((err) => {
    console.log(`Unable to sync the database: ${err}`);
});

/* Node server start with PORT:3001 */
app.listen(3001, () => {
    console.log("Server is up and running on port number: 3001");
});