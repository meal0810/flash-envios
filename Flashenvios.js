const WEBHOOK = "https://jossmedina.app.n8n.cloud/webhook/flash-envios-chat";

async function sendMessage() {

    const input = document.getElementById("question");

    if (input.value.trim() === "") return;

    const messages = document.getElementById("messages");

    const question = input.value;

    messages.innerHTML += `<div class="user">${question}</div>`;

    input.value = "";

    // Indicador de carga
    messages.innerHTML += `
        <div class="bot loading" id="loading">
            ⏳ Asistente Flash está escribiendo...
        </div>
    `;

    messages.scrollTop = messages.scrollHeight;

    try {

        const response = await fetch(WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: question,
                sessionId: localStorage.getItem("flashSession") || crypto.randomUUID()
            })
        });

        const data = await response.json();

        // Guarda la sesión para mantener memoria
        if (!localStorage.getItem("flashSession")) {
            localStorage.setItem("flashSession", crypto.randomUUID());
        }

        document.getElementById("loading").remove();

        const reply =
            data.reply ??
            data.output ??
            data.text ??
            data.response ??
            "No recibí respuesta del asistente.";

        messages.innerHTML += `
            <div class="bot">
                ${reply}
            </div>
        `;

    } catch (error) {

        if (document.getElementById("loading")) {
            document.getElementById("loading").remove();
        }

        messages.innerHTML += `
            <div class="bot">
                ⚠️ Error al conectar con el asistente.
            </div>
        `;
    }

    messages.scrollTop = messages.scrollHeight;
}

document.getElementById("question").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});