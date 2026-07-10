const WEBHOOK = "https://TU-N8N/webhook/chat";

async function sendMessage() {

    const input = document.getElementById("question");

    if(input.value=="") return;

    const messages = document.getElementById("messages");

    messages.innerHTML += `<div class="user">${input.value}</div>`;

    const question = input.value;

    input.value="";

    messages.scrollTop=messages.scrollHeight;

    try{

        const response = await fetch(WEBHOOK,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                message:question
            })

        });

        const data = await response.json();

        messages.innerHTML += `<div class="bot">${data.reply}</div>`;

    }catch{

        messages.innerHTML += `<div class="bot">⚠️ No se pudo conectar con el asistente.</div>`;

    }

    messages.scrollTop=messages.scrollHeight;

}

document.getElementById("question").addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});