"use strict"


const drag_info = document.querySelector(".drop_info");
const dropfile_button = document.querySelector("#dropfile_button");
const sendmail_button = document.querySelector("#sendmail_button");
const dropcontainer = document.querySelector(".dropcontainer");
const mainContainer = document.querySelector(".Container");

const senderEmail = document.querySelector("#senderEmail");
const senderP = document.querySelector("#senderPass")

const subjectInput = document.querySelector("#subjectInput");
const mailbox = document.querySelector("#mailbox");



// To validate email, compare with regex
const validateEmail = (email)=>{

   
    try {

        if(email === ""){return true;}else{

            return String(email)
            .toLowerCase()
            .match( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            
        }
    } catch (error) {

        console.log(error);
        return;
        
    }
}


// When dragging and dropping
const draganddropFeature = ()=>{


    const onEnter = ()=>{

        drag_info.style.cssText = "color:var(--Primary-color); border-color:var(--Primary-color);"; 

    }


    const onLeave = ()=>{

        drag_info.style.cssText = "color:var(--Secondary-color); border-color:var(--Secondary-color);"; 

    }


    const prevent = (e)=>{
        e.preventDefault(); 
    }

  
    // Uses xlsx library to extract data from spreadsheet and handling

    const fileHandling = (e)=>{

    

    //    e.stopPropagation();
       let files = e.dataTransfer.files[0];
      
       let reader = new FileReader();
       reader.readAsArrayBuffer(files);

       reader.onload = (e)=>{

        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data,{type:"array"});
       

        let first_sheet_name = workbook.SheetNames[0];
     
        let worksheet = workbook.Sheets[first_sheet_name];
       
        let json = XLSX.utils.sheet_to_json(worksheet);

        console.log(json);

        const mailArray = [];
        json.forEach(each=>{


            const email = each.email || each.Email;
            
            
            if(validateEmail(email)){


                mailArray.push(each.email || each.Email) ;
                
            }else{
                console.log("Some of your email is not valid in spreadsheet, PLease Check again")
            }


        });

        // const mailObject = {...mailArray};
        // console.log(mailObject);

        console.log(mailArray);

        // Sending array of the data(mail from spreadsheet) to the server
        if(mailArray != []){
            fetch("/api/emailfile", {method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(mailArray)})
            .then(response=>response.json())
            .then(data=>console.log(data))
            .catch(error=>console.log(error));

        }else{
            console.log("Spreadsheet's email are empty")
        }

       
       };
    }
    


    ["dragenter","dragover","dragleave", "drop"].forEach(each=>{

        drag_info.addEventListener(each,prevent);

    });


//when entering
    ["dragenter", "dragover"].forEach(each=>{

        drag_info.addEventListener(each,onEnter);
    });

//on leaving or dropping
    ["dragleave", "drop"].forEach(each=>{

        drag_info.addEventListener(each,onLeave);
    });


    drag_info.addEventListener("drop", fileHandling);

};

draganddropFeature();



//Object where user input data are stored
let UserData = { fromEmail: "", fromP: "", subject:"", mail:""};


//When user input data from the input box, 
//applies in all input field
// Handle input is called from index.html, onblur event.
    const handleInput = (param)=>{

        
        if(param == "senderEmail"){

            if(validateEmail(senderEmail.value)){

                UserData.fromEmail = senderEmail.value;
                console.log(UserData);
            }else{
                console.log("Email is not valid, PLease Check again")
            }
           
        }

        if(param =="senderP"){
            UserData.fromP = senderP.value;
            console.log(UserData);
        }

        if(param =="subject"){
            UserData.subject = subjectInput.value;
            console.log(UserData);
        }

        if(param =="mail"){
            UserData.mail =  mailbox.value;
            console.log(UserData);
        }; 
    };

 

    //When clicking send mail button, it send all the user input data to the server
    sendmail_button.addEventListener("click", (e)=>{
        e.preventDefault();

        if(UserData.fromEmail != ""  && UserData.fromP != "" && UserData.subject != "" && UserData.mail != ""){


            fetch("/api/userfile" ,{method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(UserData)})
            .then(response=>response.json())
            .then(data=>console.log(data))
            .catch(error=>console.log(error));

        }else{
            console.log("No Inputs are supposed to be blank");
            return;
        }

    });






