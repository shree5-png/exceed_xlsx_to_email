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

const getMailFile =__async( async (req,res)=>{

  //  to_user_data = req.body;

  receivers_mail = req.body;
  console.log(receivers_mail);

  res.status(200).json({message:"got Mails"})
});

//@method POST
//access public
const getUserData = __async( async (req,res)=>{

  //  from_user_data = req.body;
  //  console.log(from_user_data);

  
  const user_info = req.body;
  sender_mail = user_info.fromEmail; 
  sender_pass = user_info.fromP;

  subject = user_info.subject
  mail = user_info.mail;
  console.log(mail)


  user_name = sender_mail.split("@")[0];
 
  sendMail();
  res.status(200).json({message: "Got user Data"})

});



const sendMail = ()=>{


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
  bcc: `${receivers_mail.toString()}`,
  subject: subject,
  // text: 'That was easy!'
  text : mail
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}
module.exports = {getMailFile,getUserData,};