const usernameDisplay = document.getElementById("usernameDisplay");

const username = prompt("Ingresa tu nombre de usuario:");
usernameDisplay.textContent = username;

const socket = new WebSocket("ws://localhost:3000");

const chatDiv = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Objeto para almacenar los mensajes de cada sala
const rooms = {
  general: [],
};

// Sala actual
let currentRoom = "General";

const currentRoomDisplay = document.getElementById("currentRoomDisplay");
currentRoomDisplay.textContent = currentRoom;

// Función para convertir códigos de atajos de emoji en emojis visuales
function convertShortcodesToEmoji(message) {
  const shortcodeMap = {
    ":)": "😊",
    ":(": "😞",
    ":D": "😃",
    ":O": "😲",
    ";)": "😉",
    ":P": "😛",
    ":|": "😐",
    ":*": "😘",
    "<3": "❤️",
    ":thumbsup:": "👍",
    ":thumbsdown:": "👎",
    ":heart:": "❤️",
    ":rocket:": "🚀",
    ":smile_cat:": "😺",
    ":laughing:": "😆",
    ":sunglasses:": "😎",
    ":thinking:": "🤔",
    ":angry:": "😠",
    ":fire:": "🔥",
    ":moneybag:": "💰",
    ":cake:": "🍰",
    ":beer:": "🍺",
    ":pizza:": "🍕",
    ":tada:": "🎉",
    ":100:": "💯",
    ":sunny:": "☀️",
    ":rain_cloud:": "🌧️",
    ":snowflake:": "❄️",
    ":star:": "⭐",
    ":thumbsup_light_skin_tone:": "👍🏻",
    ":thumbsup_medium_light_skin_tone:": "👍🏼",
    ":thumbsup_medium_skin_tone:": "👍🏽",
    ":thumbsup_medium_dark_skin_tone:": "👍🏾",
    ":thumbsup_dark_skin_tone:": "👍🏿",
    ":thumbsdown_light_skin_tone:": "👎🏻",
    ":thumbsdown_medium_light_skin_tone:": "👎🏼",
    ":thumbsdown_medium_skin_tone:": "👎🏽",
    ":thumbsdown_medium_dark_skin_tone:": "👎🏾",
    ":thumbsdown_dark_skin_tone:": "👎🏿",
    ":muscle:": "💪",
    ":nerd:": "🤓",
    ":alien:": "👽",
    ":robot:": "🤖",
    ":diamond_shape_with_a_dot_inside:": "💠",
    ":gem:": "💎",
    ":cherry_blossom:": "🌸",
    ":maple_leaf:": "🍁",
    ":dog:": "🐶",
    ":cat:": "🐱",
    ":fish:": "🐟",
    ":horse:": "🐴",
    ":penguin:": "🐧",
    ":hatching_chick:": "🐣",
    ":party_popper:": "🎉",
    ":balloon:": "🎈",
    ":bamboo:": "🎍",
    ":christmas_tree:": "🎄",
    ":fireworks:": "🎆",
  };

  Object.keys(shortcodeMap).forEach((shortcode) => {
    const emoji = shortcodeMap[shortcode];
    const regex = new RegExp(
      shortcode.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "g"
    );
    message = message.replace(regex, emoji);
  });

  return message;
}

// Manejo de mensajes recibidos
socket.onmessage = function (event) {
  event.data
    .text()
    .then(function (data) {
      const { room, username, message } = JSON.parse(data);
      if (room === currentRoom) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message__receive");
        messageElement.textContent = `${username}: ${convertShortcodesToEmoji(
          message
        )}`;
        chatDiv.appendChild(messageElement);
      }
    })
    .catch(function (error) {
      console.error("Error al leer el mensaje recibido:", error);
    });
};

const badWordsMap = {
  puta: "p***",
  cabró: "c****",
  merda: "m****",
  collons: "c******",
  cony: "c***",
  fillputa: "f*******",
  pendejo: "p*****o",
  puto: "p***",
  coño: "c***",
  cabrón: "c*****",
  mierda: "m*****",
  marica: "m*****",
  hijoputa: "h*******",
  mamón: "m****",
  gilipollas: "g*********",
  imbécil: "i******",
  idiota: "i*****",
  estúpido: "e*******",
  capullo: "c******",
  subnormal: "s********",
  retrasado: "r*********",
  mongolo: "m******o",
  maricón: "m******n",
  cabronazi: "c*********",
  soplapollas: "s***********",
  mamalón: "m*******n",
  mamalona: "m********a",
  fillet: "f*****",
  filldeputamare: "f***************",
  malparit: "m*******t",
  capdeburro: "c**********",
  carabassa: "c*********",
  babau: "b****",
  xarneguito: "x*********o",
  panoli: "p*****i",
  pallasso: "p*******o",
  pallús: "p*****s",
  guarra: "g*****",
  zorra: "z****",
  cabrona: "c******a",
  gilipuertas: "g**********",
  gilipollez: "g*********z",
  subnormalidad: "s*************",
  inútil: "i*****",
  desgraciado: "d**********o",
  miserable: "m********e",
  payaso: "p*****o",
  payasa: "p*****a",
  pringado: "p********o",
  pringada: "p********a",
  chupapollas: "c***********",
  chupapijas: "c**********",
  cabronchupapijas: "c*****************",
  mariconchupapollas: "m********************",
  malparido: "m*********o",
  comemierda: "c**********a",
  verga: "v****",
  mamada: "m*****",
};

function censorBadWords(message) {
  Object.keys(badWordsMap).forEach((word) => {
    const regex = new RegExp("\\b" + word + "\\b", "gi");
    message = message.replace(regex, badWordsMap[word]);
  });
  return message;
}

// Envío de mensajes al servidor
function sendMessage() {
  let message = messageInput.value.trim();
  message = censorBadWords(message);

  if (message !== "") {
    const messageWithEmojis = convertShortcodesToEmoji(message);

    const messageElement = document.createElement("div");
    messageElement.classList.add("message__me");
    messageElement.textContent = `${username}: ${messageWithEmojis}`;
    chatDiv.appendChild(messageElement);

    messageInput.value = "";

    rooms[currentRoom].push({ username, message });
    socket.send(JSON.stringify({ room: currentRoom, username, message }));
  }
}

// Función para crear una nueva sala
function createRoom() {
  const roomName = prompt("Ingresa el nombre de la nueva sala:");
  if (roomName && roomName.trim() !== "") {
    const sanitizedRoomName = roomName.trim().toLowerCase();
    if (!rooms[sanitizedRoomName]) {
      rooms[sanitizedRoomName] = [];
      currentRoom = sanitizedRoomName;
      currentRoomDisplay.textContent = currentRoom;
      chatDiv.innerHTML = "";
      alert(`Sala "${sanitizedRoomName}" creada. Ahora estás en esta sala.`);
    } else {
      alert(`La sala "${sanitizedRoomName}" ya existe. Elige otro nombre.`);
    }
  }
}

// Evento al presionar el botón de enviar
sendButton.addEventListener("click", sendMessage);

// Evento al presionar Enter en el campo de entrada
messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// Evento para crear una nueva sala (utilizando el botón existente)
const createRoomButton = document.querySelector(".room > button:last-child");
createRoomButton.addEventListener("click", createRoom);
