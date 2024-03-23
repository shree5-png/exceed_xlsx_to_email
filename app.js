
import express from "express";
const app = express();
import { router } from "./routers/index.js";
import { errorHandle } from "./middleware/error_handle.js";
import { notFound } from "./middleware/not_found_middleware.js";
import open from "open";


//Middleware 
app.use(express.json());
app.use("/api", router);

app.use(express.static("public"));
//Error handling middleware
app.use(errorHandle);
app.use(notFound);

//Port
const PORT = process.env.PORT || 5000;

//Starting the server
const start = () => {

    try {

        app.listen(PORT, async () => {

            console.log(`Listening on Port ${PORT}`);
            await open(`http://localhost:${PORT}`, { wait: false });

        })

    } catch (error) {

        console.log(error);

    }

}

start();