document.querySelectorAll('.like-button').forEach(button => {
  button.addEventListener('click', function () {
    const productId = this.getAttribute('data-id');
    const isLiked = this.getAttribute('data-liked') === "1";

    fetch('/toggle-favorite/' + productId, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.setAttribute('data-liked', data.isLiked ? "1" : "0");
          this.querySelector('i').classList.toggle('liked', data.isLiked);

          if (data.isLiked) {
            window.location.href = "/favorites";
          }
        }
      })
      .catch(error => console.error('Error:', error));
  });
});
function toggleChat() {
  let chatBox = document.getElementById("chatBox");
  chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
}

function sendMessage() {
  let input = document.getElementById("chatInput");
  let messageText = input.value.trim();
  if (messageText === "") return;

  let chatBody = document.getElementById("chatBody");

  let message = document.createElement("div");
  message.classList.add("message", "customer");
  message.innerText = messageText;
  chatBody.appendChild(message);

  input.value = "";

  setTimeout(() => {
    let response = document.createElement("div");
    response.classList.add("message", "support");
    response.innerText = "Tack! Vi återkommer snart.";
    chatBody.appendChild(response);

    chatBody.scrollTop = chatBody.scrollHeight;
  }, 2000);

  chatBody.scrollTop = chatBody.scrollHeight;
}