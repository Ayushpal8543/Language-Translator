
const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("#transfer");
const inputBox = document.querySelector("#fromLang");
const outputBox = document.querySelector("#toLang");
const icons = document.querySelectorAll("img");

// Populate Language Dropdown
selectTag.forEach((tag, id) => {
  for (const code in countries) {
    let selected = "";
    if (id === 0 && code === "en-GB") selected = "selected";
    if (id === 1 && code === "hi-IN") selected = "selected";
    let option = `<option value="${code}" ${selected}>${countries[code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Translation API
translateBtn.addEventListener("click", () => {
  let text = inputBox.value;
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;
  if (!text.trim()) return alert("Please enter text to translate!");

  let apiURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      outputBox.value = data.responseData.translatedText;
    })
    .catch(() => {
      outputBox.value = "Translation failed!";
    });
});

// 🎤 Hold-to-Speak Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

const micBtn = document.querySelector("#micBtn");

micBtn.addEventListener("mousedown", () => {
  recognition.lang = selectTag[0].value;
  recognition.start();
  micBtn.classList.add("listening");
});

micBtn.addEventListener("mouseup", () => {
  recognition.stop();
  micBtn.classList.remove("listening");
});

micBtn.addEventListener("mouseleave", () => {
  recognition.stop();
  micBtn.classList.remove("listening");
});

/*recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  inputBox.value = transcript;
};*/
recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  const text = transcript.trim();
  inputBox.value = text.charAt(0).toLowerCase() + text.slice(1);
};


// Speak & Copy Buttons
icons.forEach(icon => {
  icon.addEventListener("click", (e) => {
    const id = e.target.id;

    if (e.target.classList.contains("copy")) {
      const text = id === "from" ? inputBox.value : outputBox.value;
      navigator.clipboard.writeText(text);
      return;
    }
    if (e.target.classList.contains("speak")) {
      const text = id === "from" ? inputBox.value : outputBox.value;
      if (!text.trim()) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = id === "from" ? selectTag[0].value : selectTag[1].value;
      speechSynthesis.speak(utter);
    }
  });
});

