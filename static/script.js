let lightMode = true;
let recorder = null;
let recording = false;
let voiceOption = "default";
const responses = [];
const botRepeatButtonIDToIndexMap = {};
const userRepeatButtonIDToRecordingMap = {};
const baseUrl = window.location.origin;

async function showBotLoadingAnimation() {
  await sleep(500);
  $(".loading-animation")[1].style.display = "inline-block";
}

function hideBotLoadingAnimation() {
  $(".loading-animation")[1].style.display = "none";
}

async function showUserLoadingAnimation() {
  await sleep(100);
  $(".loading-animation")[0].style.display = "flex";
}

function hideUserLoadingAnimation() {
  $(".loading-animation")[0].style.display = "none";
}

const getSpeechToText = async (userRecording) => {
  try {
    console.log("Envoi de l'audio au serveur...");
    console.log("Taille du blob audio envoyé:", userRecording.audioBlob.size);
    
    let response = await fetch(baseUrl + "/speech-to-text", {
      method: "POST",
      body: userRecording.audioBlob,
    });
    
    console.log("Statut de la réponse:", response.status);
    if (!response.ok) {
      throw new Error("Erreur de réponse du serveur: " + response.status);
    }
    
    response = await response.json();
    console.log("Réponse JSON:", response);
    
    if (!response.text) {
      console.warn("Texte non trouvé dans la réponse:", response);
      return "Désolé, je n'ai pas pu comprendre ce que vous avez dit.";
    }
    
    return response.text;
  } catch (error) {
    console.error("Erreur lors de la conversion parole-texte:", error);
    return "Erreur: " + error.message;
  }
};

const processUserMessage = async (userMessage) => {
  let response = await fetch(baseUrl + "/process-message", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ userMessage: userMessage, voice: voiceOption }),
  });
  response = await response.json();
  console.log(response);
  return response;
};

const cleanTextInput = (value) => {
  return value
    .trim() // remove starting and ending spaces
    .replace(/[\n\t]/g, "") // remove newlines and tabs
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/[<>&;]/g, ""); // sanitize inputs
};

const recordAudio = () => {
  return new Promise(async (resolve) => {
    try {
      console.log("Demande d'accès au microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Accès au microphone accordé!");
      
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        console.log("Données audio disponibles", event.data.size);
        audioChunks.push(event.data);
      });

      const start = () => {
        console.log("Début de l'enregistrement");
        mediaRecorder.start();
      };

      const stop = () =>
        new Promise((resolve) => {
          mediaRecorder.addEventListener("stop", () => {
            console.log("Enregistrement terminé, création du blob audio...");
            // Changement du format audio de mpeg à wav
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            console.log("Taille du blob audio:", audioBlob.size);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            const play = () => audio.play();
            resolve({ audioBlob, audioUrl, play });
          });

          mediaRecorder.stop();
        });

      resolve({ start, stop });
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      alert("Erreur d'accès au microphone: " + error.message);
    }
  });
};

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const toggleRecording = async () => {
  if (!recording) {
    recorder = await recordAudio();
    recording = true;
    recorder.start();
  } else {
    const audio = await recorder.stop();
    sleep(1000);
    return audio;
  }
};

const playResponseAudio = (function () {
  const df = document.createDocumentFragment();
  return function Sound(src) {
    const snd = new Audio(src);
    df.appendChild(snd); // keep in fragment until finished playing
    snd.addEventListener("ended", function () {
      df.removeChild(snd);
    });
    snd.play();
    return snd;
  };
})();

const getRandomID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const scrollToBottom = () => {
  // Scroll the chat window to the bottom
  $("#chat-window").animate({
    scrollTop: $("#chat-window")[0].scrollHeight,
  });
};
const populateUserMessage = (userMessage, userRecording) => {
  // Clear the input field
  $("#message-input").val("");

  // Append the user's message to the message list

  if (userRecording) {
    const userRepeatButtonID = getRandomID();
    userRepeatButtonIDToRecordingMap[userRepeatButtonID] = userRecording;
    hideUserLoadingAnimation();
    $("#message-list").append(
      `<div class='message-line my-text'><div class='message-box my-text${
        !lightMode ? " dark" : ""
      }'><div class='me'>${userMessage}</div></div>
            <button id='${userRepeatButtonID}' class='btn volume repeat-button' onclick='userRepeatButtonIDToRecordingMap[this.id].play()'><i class='fa fa-volume-up'></i></button>
            </div>`
    );
  } else {
    $("#message-list").append(
      `<div class='message-line my-text'><div class='message-box my-text${
        !lightMode ? " dark" : ""
      }'><div class='me'>${userMessage}</div></div></div>`
    );
  }

  scrollToBottom();
};

const populateBotResponse = async (userMessage) => {
  await showBotLoadingAnimation();
  const response = await processUserMessage(userMessage);
  responses.push(response);

  const repeatButtonID = getRandomID();
  botRepeatButtonIDToIndexMap[repeatButtonID] = responses.length - 1;
  hideBotLoadingAnimation();
  // Append the random message to the message list
  $("#message-list").append(
    `<div class='message-line'><div class='message-box${
      !lightMode ? " dark" : ""
    }'>${
      response.openaiResponseText
    }</div><button id='${repeatButtonID}' class='btn volume repeat-button' onclick='playResponseAudio("data:audio/wav;base64," + responses[botRepeatButtonIDToIndexMap[this.id]].openaiResponseSpeech);console.log(this.id)'><i class='fa fa-volume-up'></i></button></div>`
  );

  playResponseAudio("data:audio/wav;base64," + response.openaiResponseSpeech);

  scrollToBottom();
};

$(document).ready(function () {
  // Listen for the "Enter" key being pressed in the input field
  $("#message-input").keyup(function (event) {
    let inputVal = cleanTextInput($("#message-input").val());

    if (event.keyCode === 13 && inputVal != "") {
      const message = inputVal;

      populateUserMessage(message, null);
      populateBotResponse(message);
    }

    inputVal = $("#message-input").val();

    if (inputVal == "" || inputVal == null) {
      $("#send-button")
        .removeClass("send")
        .addClass("microphone")
        .html("<i class='fa fa-microphone'></i>");
    } else {
      $("#send-button")
        .removeClass("microphone")
        .addClass("send")
        .html("<i class='fa fa-paper-plane'></i>");
    }
  });

  // When the user clicks the "Send" button
  $("#send-button").click(async function () {
    if ($("#send-button").hasClass("microphone") && !recording) {
      toggleRecording();
      $(".fa-microphone").css("color", "#f44336");
      console.log("start recording");
      recording = true;
    } else if (recording) {
      toggleRecording().then(async (userRecording) => {
        console.log("stop recording");
        await showUserLoadingAnimation();
        const userMessage = await getSpeechToText(userRecording);
        populateUserMessage(userMessage, userRecording);
        populateBotResponse(userMessage);
      });
      $(".fa-microphone").css("color", "#125ee5");
      recording = false;
    } else {
      // Get the message the user typed in
      const message = cleanTextInput($("#message-input").val());

      populateUserMessage(message, null);
      populateBotResponse(message);

      $("#send-button")
        .removeClass("send")
        .addClass("microphone")
        .html("<i class='fa fa-microphone'></i>");
    }
  });

  // handle the event of switching light-dark mode
  $("#light-dark-mode-switch").change(function () {
    $("body").toggleClass("dark-mode");
    $(".message-box").toggleClass("dark");
    $(".loading-dots").toggleClass("dark");
    $(".dot").toggleClass("dark-dot");
    lightMode = !lightMode;
  });

  $("#voice-options").change(function () {
    voiceOption = $(this).val();
    console.log(voiceOption);
  });
});
