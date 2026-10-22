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

  assistantHistory.push({ role: "user", content: question });
  addAssistantMessage(question, "user");
  assistantInput.value = "";
  assistantInput.disabled = true;
  assistantSend.disabled = true;
  assistantStatus.textContent = "Preparing a response…";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const answer = await askHostedModel(
      window.getHeatAssistantContext(),
      assistantHistory,
      controller.signal
    );

    assistantHistory.push({ role: "assistant", content: answer });
    addAssistantMessage(answer, "bot");
    assistantStatus.textContent = "Forecast guidance only—not an official warning or a guarantee of safety.";
  } catch (error) {
    assistantHistory.pop();
    const message = error.name === "AbortError"
      ? "The AI request timed out. Please try again."
      : error instanceof TypeError
        ? "The browser could not reach the AI service. Check that the Worker is deployed and allows this site's origin."
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
