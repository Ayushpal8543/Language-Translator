/*const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("#transfer");
const fromLang = document.querySelector("#fromLang");
const toLang = document.querySelector("#toLang");


selectTag.forEach((tag, id)=>{
    for(const countriesCode in countries){
        let selected;
        if(id == 0 && countriesCode == "en-GB"){
            selected=" selected";
        }
        else if(id == 1 && countriesCode == "hi-IN"){
            selected=" selected";
        }
        let option = `<option value="${countriesCode}" ${selected}>${countries[countriesCode]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

translateBtn.addEventListener(("click"), ()=> {
   let lang = fromLang.value,
   translateFrom = selectTag[0].value,
   translateTo = selectTag[1].value,
   
   let apiURL = `https://api.mymemory.translated.net/get?q=${lang}&langpair=${ translateFrom}|${translateTo}`;

   fetch(apiURL).then(res => res.json()).then(data =>{
    toLang.value = data.responseData.translatedText;
   });



});*/
const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("#transfer");
const inputBox = document.querySelector("#fromLang");   // make sure this is your input textarea id
const outputBox = document.querySelector("#toLang");    // make sure this is your output textarea/id
const icons = document.querySelectorAll("img");

selectTag.forEach((tag, id) => {
  for (const countriesCode in countries) {
    let selected = "";

    if (id === 0 && countriesCode === "en-GB") selected = "selected";
    if (id === 1 && countriesCode === "hi-IN") selected = "selected";

    let option = `<option value="${countriesCode}" ${selected}>${countries[countriesCode]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

translateBtn.addEventListener("click", () => {
  let text = inputBox.value;
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;

  if (!text.trim()) return alert("Please enter text to translate!");

  let apiURL =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      outputBox.value = data.responseData.translatedText;
    })
    .catch(() => {
      outputBox.value = "Translation failed!";
    });
});


icons.forEach(icon => {
  icon.addEventListener("click", (e) => {
    const target = e.target;

    // COPY feature
    if (target.classList.contains("copy")) {
      const text = target.id === "from" ? inputBox.value : outputBox.value;
      navigator.clipboard.writeText(text);
      return;
    }

    // SPEAK feature
    if (target.classList.contains("speak")) {
      const textToSpeak = target.id === "from" ? inputBox.value : outputBox.value;
      if (!textToSpeak.trim()) return;

      const utter = new SpeechSynthesisUtterance(textToSpeak);

      // Dynamic language
      utter.lang = target.id === "from"
        ? selectTag[0].value
        : selectTag[1].value;

      speechSynthesis.speak(utter);
      return;
    }
  });
});
