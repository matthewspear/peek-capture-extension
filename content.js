const button = document.createElement("img");
button.src = chrome.runtime.getURL("peek.webp");
button.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform 0.2s;
`;

button.addEventListener("mouseover", () => {
  button.style.transform = "scale(1.1)";
});
button.addEventListener("mouseout", () => {
  button.style.transform = "scale(1)";
});

button.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "getLatestToken" }, function (response) {
    if (response && response.token) {
      navigator.clipboard
        .writeText(response.token)
        .then(() => {
          showNotification("Session token copied to clipboard!");
          setTimeout(() => {
            navigator.clipboard.writeText("").catch(() => {});
          }, 30000);
        })
        .catch(() => {});
    } else {
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 9999;
      `;
      notification.textContent = "No token available, try refreshing the page!";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  });
});

document.body.appendChild(button);

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : "#f44336"};
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 9999;
    max-width: 300px;
  `;

  notification.textContent = message;
  if (type === "success") {
    notification.textContent +=
      "\nWarning: Token will be cleared from clipboard in 30 seconds for security.";
  }

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Show only on OpenAI usage page

const observer = new MutationObserver(() => {
  button.style.display = window.location.pathname.includes("/usage")
    ? "block"
    : "none";
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

button.style.display = window.location.pathname.includes("/usage")
  ? "block"
  : "none";
