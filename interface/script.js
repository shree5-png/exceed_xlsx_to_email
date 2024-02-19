"use strict"


const drag_info = document.querySelector(".drop_info");
const dropfile_button = document.querySelector("#dropfile_button");
const sendmail_button = document.querySelector("#sendmail_button");
const dropcontainer = document.querySelector(".dropcontainer");
const mainContainer = document.querySelector(".Container");
//for drop box


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

        json.forEach(each=>{


            const actualEmail = each.email || each.Email;
            console.log(actualEmail);
        })
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



