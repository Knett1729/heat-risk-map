const assistantPanel = document.getElementById("heat-assistant");
const assistantToggle = document.getElementById("assistant-toggle");
const assistantClose = document.getElementById("assistant-close");
const assistantForm = document.getElementById("assistant-form");
const assistantInput = document.getElementById("assistant-input");
const assistantMessages = document.getElementById("assistant-messages");
const assistantStatus = document.getElementById("assistant-status");
const assistantSend = document.getElementById("assistant-send");
const assistantHistory = [];

document.querySelectorAll(".assistant-suggestion").forEach(button => {
  button.addEventListener("click", () => {
    assistantInput.value = button.textContent;
    assistantForm.requestSubmit();
  });
});

function addAssistantMessage(text, role) {
  const message = document.createElement("p");
  message.className = `assistant-message assistant-message--${role}`;
  message.textContent = text;
  assistantMessages.append(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
  return message;
}

function setAssistantOpen(open) {
  assistantPanel.hidden = !open;
  assistantToggle.setAttribute("aria-expanded", String(open));
  if (open) assistantInput.focus({ preventScroll: true });
  else assistantToggle.focus();
}

assistantToggle.addEventListener("click", () => setAssistantOpen(true));
assistantClose.addEventListener("click", () => setAssistantOpen(false));

assistantInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    assistantForm.requestSubmit();
  }
});

assistantForm.addEventListener("submit", async event => {
  event.preventDefault();
  const question = assistantInput.value.trim();
  if (!question) return;

  const { API_URL, API_KEY, MODEL } = CONFIG.AI;
  if (!API_URL || !MODEL || MODEL === "YOUR_LOCAL_MODEL") {
    assistantStatus.textContent = "Configure the local model URL and model name in js/config.js before asking a question.";
    return;
  }

  assistantHistory.push({ role: "user", content: question });
  addAssistantMessage(question, "user");
  assistantInput.value = "";
  assistantInput.disabled = true;
  assistantSend.disabled = true;
  assistantStatus.textContent = "Preparing a response…";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const messages = [
      {
        role: "system",
        content: "You are a cautious heat-safety assistant for families. Use only the provided heat forecast context for local conditions. Explain that heat index is a town-level estimate, not a school-site measurement, and that actual safety depends on shade, exertion, hydration, health, and school precautions. Avoid giving a definitive guarantee that an activity is safe. Offer practical heat precautions, and advise checking official PAGASA advisories and school guidance. If the user does not name a town, ask which town they mean. Be concise and clear."
      },
      { role: "system", content: `Selected map forecast context:\n${window.getHeatAssistantContext()}` },
      ...assistantHistory
    ];
    const headers = { "Content-Type": "application/json" };
    if (API_KEY && API_KEY !== "YOUR_API_KEY") headers.Authorization = `Bearer ${API_KEY}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.4 }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Local model returned HTTP ${response.status}.`);

    const result = await response.json();
    const answer = result.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      throw new Error("The local model response did not contain a chat answer.");
    }

    assistantHistory.push({ role: "assistant", content: answer });
    addAssistantMessage(answer, "bot");
    assistantStatus.textContent = "Forecast guidance only—not an official warning or a guarantee of safety.";
  } catch (error) {
    assistantHistory.pop();
    const message = error.name === "AbortError"
      ? "The local model request timed out. Check that your model is running, then try again."
      : error instanceof TypeError
        ? "The browser could not access the local model. It may be blocking this page's origin with CORS; allow the map's exact origin and OPTIONS requests in your model server."
        : error.message;
    assistantStatus.textContent = message;
    addAssistantMessage(message, "bot");
    console.error("Assistant request failed:", error);
  } finally {
    clearTimeout(timeout);
    assistantInput.disabled = false;
    assistantSend.disabled = false;
    assistantInput.focus();
  }
});
