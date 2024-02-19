const __async = require("../middleware/async_handler");


const SendMail =__async( async (req,res)=>{

  res.status(200).json({message:"Sending Mail"})
});


module.exports = {SendMail};