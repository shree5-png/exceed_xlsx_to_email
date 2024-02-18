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

       const file = e.dataTransfer.files[0]
       console.log(file);

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







