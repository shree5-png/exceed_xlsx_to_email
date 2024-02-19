const express = require("express");
const app = express();
const router = require("./routers/index");
const errorHandle = require("./middleware/error_handle");
const notFound = require("./middleware/not_found_middleware");

//Middleware 
app.use(express.json());
app.use("/api",router);

app.use(express.static("public"));
//Error handling middleware
app.use(errorHandle);
app.use(notFound);

//Port
const PORT = process.env.PORT || 5000;

//Starting the server
const start = ()=>{

    try {

        app.listen(PORT,()=>{

            console.log(`Listening on Port ${PORT}`);
        })
        
    } catch (error) {

        console.log(error);
        
    }
  
}

start();