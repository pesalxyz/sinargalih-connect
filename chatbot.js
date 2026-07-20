const chatbotState = {
  open: false,
  busy: false,
  messages: [
    {
      role: "model",
      text: "Halo, saya Kang Galih. Ada yang bisa saya bantu?"
    }
  ]
};

function createChatbot() {
  const root = document.createElement("section");
  root.className = "chatbot-widget";
  root.setAttribute("aria-label", "Kang Galih, chatbot Desa Sinargalih");
  root.innerHTML = `
    <button class="chatbot-toggle" type="button" aria-label="Buka chatbot">
      <img src="./assets/images/maskot-chatbot.png" alt="" />
    </button>
    <div class="chatbot-panel" hidden>
      <header class="chatbot-header">
        <div>
          <span class="eyebrow">Chatbot Desa</span>
          <h2>Kang Galih</h2>
        </div>
        <button class="chatbot-close" type="button" aria-label="Tutup chatbot">x</button>
      </header>
      <div class="chatbot-messages" aria-live="polite"></div>
      <form class="chatbot-form">
        <input name="message" type="text" autocomplete="off" placeholder="Tulis pertanyaan..." required />
        <button class="primary-button" type="submit">Kirim</button>
      </form>
      <p class="chatbot-footnote">Jawaban chatbot bisa perlu dicek ulang ke perangkat desa.</p>
    </div>
  `;

  document.body.appendChild(root);

  const toggle = root.querySelector(".chatbot-toggle");
  const toggleImage = root.querySelector(".chatbot-toggle img");
  const panel = root.querySelector(".chatbot-panel");
  const close = root.querySelector(".chatbot-close");
  const form = root.querySelector(".chatbot-form");
  const input = root.querySelector(".chatbot-form input");
  const messages = root.querySelector(".chatbot-messages");

  toggleImage.addEventListener("error", () => {
    toggleImage.src = "./assets/images/logo-sinargalih-transparent.png";
  });

  function renderMessages() {
    messages.innerHTML = "";
    chatbotState.messages.forEach((message) => {
      const bubble = document.createElement("article");
      bubble.className = `chatbot-message chatbot-message-${message.role === "user" ? "user" : "bot"}`;
      bubble.textContent = message.text;
      messages.appendChild(bubble);
    });
    messages.scrollTop = messages.scrollHeight;
  }

  function setOpen(nextOpen) {
    chatbotState.open = nextOpen;
    panel.hidden = !nextOpen;
    toggle.setAttribute("aria-label", nextOpen ? "Tutup chatbot" : "Buka chatbot");
    if (nextOpen) {
      renderMessages();
      input.focus();
    }
  }

  async function sendMessage(text) {
    chatbotState.busy = true;
    form.classList.add("is-loading");
    chatbotState.messages.push({ role: "user", text });
    chatbotState.messages.push({ role: "model", text: "Sedang menyiapkan jawaban..." });
    renderMessages();

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          history: chatbotState.messages.slice(0, -1)
        })
      });

      if (!response.ok) {
        throw new Error("Chatbot belum dapat dihubungi.");
      }

      const result = await response.json();
      chatbotState.messages[chatbotState.messages.length - 1] = {
        role: "model",
        text: result.reply || "Maaf, saya belum punya jawaban untuk itu."
      };
    } catch (error) {
      chatbotState.messages[chatbotState.messages.length - 1] = {
        role: "model",
        text: "Maaf, chatbot belum bisa menjawab sekarang. Pastikan API sudah aktif saat deploy."
      };
    } finally {
      chatbotState.busy = false;
      form.classList.remove("is-loading");
      renderMessages();
    }
  }

  toggle.addEventListener("click", () => setOpen(!chatbotState.open));
  close.addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (chatbotState.busy) {
      return;
    }

    const text = input.value.trim();
    if (!text) {
      return;
    }

    input.value = "";
    sendMessage(text);
  });

  renderMessages();
}

document.addEventListener("DOMContentLoaded", createChatbot);
