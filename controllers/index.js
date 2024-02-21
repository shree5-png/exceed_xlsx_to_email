const __async = require("../middleware/async_handler");
const nodemailer = require("nodemailer");

//@method : POST
//access public

let sender_mail; //sender mail
let sender_pass; //sender pass
let subject;
let mail; //actual mail data
let user_name;

// spreadsheet mail
let receivers_mail;



// To validate email, compare with regex NOTE server side
const validateEmail = (email)=>{

   
  try {
        return String(email)
        .toLowerCase()
        .match( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        
  } catch (error) {

     res.status(400);
     throw new Error("Bad request, Please Check!")
      
  }
}

const getMailFile =__async( async (req,res)=>{



  //checking if the req from client is empty
  console.log(req.body)
  if(req.body == undefined || req.body == ""){

    res.status(404);
    throw new Error("Your request Not found : Empty request. Try again");
    
  }

  //checking for each email client sent by is valid
  req.body.forEach(each=>{

    if(!each){
      return;
    }
  
    //validating email in server side also
    if(!validateEmail(each)){

      res.status(403);
      throw new Error("Some emails in spreadsheet did not satisfy the standard");
    }
  })

  receivers_mail = req.body;
  console.log(receivers_mail);

  res.status(200).json({Message:"Spreadsheet validation : OK", ok:true});
});

//@method POST
//access public
const getUserData = __async(async (req,res,next)=>{

  const user_info = req.body;
  sender_mail = user_info.fromEmail; 
  sender_pass = user_info.fromP;

  subject = user_info.subject
  mail = user_info.mail;

  if(!user_info || !sender_mail || !sender_pass || !subject || !mail || !receivers_mail){
    res.status(400);
    throw new Error("Some input fields found empty!, Try again");
  }

  // res.status(200).json({message: "Got user Data"})     //response is sent in next middleware
  next();

});



const sendMail = (req,res)=>{


//NodeMailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender_mail,
    pass: sender_pass
  }
});

var mailOptions = {
  from: sender_mail,
  // to:`${receivers_mail.toString()}`,
  bcc: `${receivers_mail.toString()}`,
  subject: subject,
  // html: 'That was easy!'
  text : mail
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
  
    res.status(403).json({Message:"Authentication Failed, Please check your password or email"});
   
  } else {
    res.status(200).json({Message: "Email sent : OK"})
   
  }
});

}
module.exports = {getMailFile,getUserData,sendMail};