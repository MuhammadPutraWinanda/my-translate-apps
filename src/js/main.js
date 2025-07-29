const states = {
  inputLang: "id",
  outputLang: "en",
};

const getTranslate = (text) => {
  return fetch(
    `https://api.mymemory.translated.net/get?q=${text}&langpair=${states.inputLang}|${states.outputLang}`
  )
    .then((res) => res.json())
    .then((res) => res.responseData.translatedText);
};

const copyText = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => console.log("Teks berhasil di salin!"))
    .catch((e) => alert(e));
};

const speakText = (text, lang) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = lang;

    speechSynthesis.speak(utterance);
  } else {
    alert("Maaf browser kamu tidak mendukung text-to-speech");
  }
};

const displayOutput = async (useAPI, text) => {
  const outputDisplay = document.getElementById("outputText");
  let translateRes = null;
  if (useAPI) {
    translateRes = await getTranslate(text);
  } else {
    translateRes = text;
  }
  outputDisplay.innerHTML = "";
  outputDisplay.value = translateRes;
};

document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  inputText.addEventListener("input", () => {
    document.getElementById("characterCounter").innerText =
      inputText.value.length;
  });

  const form = document.getElementById("inputTextForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const getText = document.getElementById("inputText").value;
    const needTranslation =
      getText.length > 1 && states.inputLang !== states.outputLang;
    displayOutput(needTranslation, getText);
  });

  document.addEventListener("change", (e) => {
    if (e.target.closest("div")?.getAttribute("id") === "langListInput") {
      states.inputLang = e.target.value;
    }

    if (e.target.closest("div")?.getAttribute("id") === "langListOutput") {
      states.outputLang = e.target.value;
    }
  });

  document.addEventListener("click", (e) => {
    const targetId = e.target.getAttribute("id");

    switch (targetId) {
      case "toggleContainer":
        document.querySelector("html").classList.toggle("dark");
        break;
      case "btnCopyInput":
        const inputText = document.getElementById("inputText").value;
        if (inputText.length > 1) {
          copyText(inputText);
        }
        break;
      case "btnCopyOutput":
        const outputText = document.getElementById("outputText").value;
        if (outputText.length > 1) {
          copyText(outputText);
        }
        break;
      case "btnSpeechInput":
        const textInput = document.getElementById("inputText").value;
        if (textInput.length > 1) {
          speakText(textInput, states.inputLang);
        }
        break;
      case "btnSpeechOutput":
        const textOutput = document.getElementById("outputText").value;
        if (textOutput.length > 1) {
          speakText(textOutput, states.outputLang);
        }
        break;
    }
  });
});
