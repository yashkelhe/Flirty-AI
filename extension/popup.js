document.addEventListener("DOMContentLoaded", function () {
  const jokes = document.querySelector(".jokes");
  const button = document.getElementById("generate");

  async function fetchJoke() {
    try {
      const response = await fetch("https://flirty-ai.onrender.com");
      const joke = await response.text();
      console.log(joke);
      jokes.innerText = joke;
    } catch (error) {
      jokes.innerText = "Failed to fetch joke!";
      console.error("Error fetching joke:", error);
    }
  }

  button.addEventListener("click", fetchJoke);
});
