require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require("./services/db.js");
function createServer() {
    const app = express();

    app.use(cors({
        origin: "*",
    }));


    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use("/api/sales", require("./routes/saleRoutes"));

    return app;
}

module.exports = { createServer };


if (require.main === module) {
    (async () => {
        await connectDB();

        const app = createServer();
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })();
}
