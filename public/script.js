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

const drop_mail_box = document.querySelector(".drop_mail_box");
const drop_mail_list = document.querySelector(".mail_list");

const brandingP = document.querySelector(".brandingP");
const info_container = document.querySelector(".info_container");
const info_dropdown = document.querySelector(".info_dropdown");

const dropclass = document.querySelector(".dropclass");
const info_text = document.querySelector(".info_text");


let mailArray = [];
// To validate email, compare with regex on NOTE client side
const validateEmail = (email)=>{

   
    try {
        // return true;
            return String(email)
            .toLowerCase()
            .match( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            
        
    } catch (error) {

        console.log(error);
        return;
        
    }
};


// Timeout function

const backto_normal = (param= "dropbox",time=1500)=>{

    function setTimeFn(elem, info, time){

    setTimeout(()=>{
        
        elem.style.cssText = info;

        if(param == "error"){
            info_text.textContent =`Information will be shown here`;
            info_dropdown.classList.add("hidden");
        }

        

       }, time);

       
    }

    if(param == "dropbox"){
        setTimeFn(drag_info,"color:var(--Secondary-color); border-color:var(--Primary-color);",time)

    }

    if(param == "error"){
        setTimeFn(info_dropdown, "box-shadow: 5px 5px var(--Secondary-color);" ,time);
        
    }

    }

   
        

const showMessageBox = ()=>{
    info_dropdown.classList.remove("hidden");
    backto_normal("error",7900);
}


const showError= (status,message)=>{


    info_text.textContent =`Info: ${message}`;

    if(status == "error"){

        info_dropdown.style.cssText = "box-shadow: 5px 5px var(--error-color);";
    }
    showMessageBox();

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
       
       if(files.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

        
        // NOTE
        console.log("File format doesnot matches, Try again");
        showError("error","File format doesnot matches, Try again");
        clearDropFiled();
        return;
       }
      
       let reader = new FileReader();
       reader.readAsArrayBuffer(files);

       reader.onload = (e)=>{

        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data,{type:"array"});
       

        let first_sheet_name = workbook.SheetNames[0];
     
        let worksheet = workbook.Sheets[first_sheet_name];
       
        let json = XLSX.utils.sheet_to_json(worksheet);

        // NOTE
        console.log(json);

        // const mailArray = [];
        json.forEach(each=>{


            const email = each.email || each.Email; 

            if(!email){
                return;
            }
            if(validateEmail(email)){

                mailArray.push(each.email || each.Email) ;
                
            }else{
                // NOTE
                console.log("Some of your email is not valid in spreadsheet and are skipped, PLease Check again");
                showError("error","Some of your email is not valid in spreadsheet and are skipped, PLease Check again");
                
            }
        }
        );

    

        console.log(mailArray);

        if(!mailArray){
            // NOTE
            console.log("File is not dropped yet!");
            showError("error","File is not dropped yet!")
            return;
        }

        // Sending array of the data(mail from spreadsheet) to the server
        if(mailArray.length != 0 && mailArray){

            // For showing To and emails in the front end
            drag_info.classList.add("hidden");
            drop_mail_box.classList.remove("hidden");
            drop_mail_list.textContent = mailArray.toString().split(",").join("  ,  ").toString();
            // 

            fetch("/api/emailfile", {method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(mailArray)})
            .then(response=>{

                if(!response.ok){
                    return response.json().then(data=>{throw data});
                }

                  return response.json();

                }
            )
            .then(data=>{
                 // NOTE
                 console.log("data", data);
        
                 showError("info",`${data.Message}`);}
                )
            .catch(error=>{
                
                console.log("error",error);
                 showError("error",`${error.Message}`)
            }
                );

        }else{
            // NOTE
            showError("error","Spreadsheet's Email not found, Title should be: [email or Email]");
            console.log("Spreadsheet's Email not found, Title should be: [email or Email]")
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
                // NOTE
                console.log(UserData);

                senderEmail.style.cssText = "box-shadow: 5px 5px var(--Secondary-color);";
                backto_normal("error",0);
            }else{
                 // NOTE
            showError("error","Email is not valid, PLease Check again");
                console.log("Email is not valid, PLease Check again")
                senderEmail.style.cssText = "box-shadow: 5px 5px var(--error-color);";
               
            }
           
        }

        if(param =="senderP"){
            UserData.fromP = senderP.value;
            // NOTE
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

        if(UserData.fromEmail != ""  && UserData.fromP != "" && UserData.subject != "" && UserData.mail != "" && mailArray.length != 0){


            fetch("/api/userfile" ,{method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(UserData)})
            .then(response=>{

                if(!response.ok){
                    return response.json().then(data=>{throw data});
                }
               return response.json()
            })
        .then(data=>{
             // NOTE
             console.log(data)
            showError("info",`${data.Message}`)
        })
            .catch(error=>{

                console.log(error);
                 // NOTE
                 showError("error",`${error.Message}`)
              }
                );

        }else{
          
        
                 // NOTE
                 showError("error","No Inputs are supposed to be blank");
            // console.log("No Inputs are supposed to be blank");
            return;
        }

    });



// Onclicking drop file button
    const clearDropFiled = ()=>{
        if(mailArray.length != 0 ){

              mailArray.length = 0;
              drag_info.classList.remove("hidden");
              drop_mail_box.classList.add("hidden");
           
        }else{
            drag_info.style.cssText = "color:var(--error-color); border-color:var(--error-color);";
            backto_normal();
                  // NOTE
                  showError("error","Drag and Drop your file first");
            console.log("Drag and Drop your file first");
        }
    
    }


    dropfile_button.addEventListener("click",clearDropFiled);



    //for interactive headlines in navigation bar
    const punchLine = ()=>{
        

       const lines =  ["like never before", "hard as you can", "till brains out", "like ex deeds ", "like good seed"];
    
       const randomNumber = Math.floor(Math.random() * (lines.length - 0));

       brandingP.textContent = lines[randomNumber];


    }

   document.addEventListener("DOMContentLoaded", punchLine);



const MakeInfoStall = ()=>{

    let currentTop = info_container.getBoundingClientRect().top;
    info_container.style.cssText = `position:absolute; top:${currentTop + window.scrollY}px`
   }


const manageInfo = ()=>{

    // console.log(scrollY)
if( scrollY >= 110 && scrollY <= 410){

    MakeInfoStall();
    
}else if(scrollY >=540 && scrollY <= 850){

    MakeInfoStall();
}
else{
    info_container.style.cssText = "position:fixed;"
}
    
}

window.addEventListener("scroll", manageInfo);




info_container.addEventListener("click",()=>{
    info_dropdown.classList.toggle("hidden");
})





