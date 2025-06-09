let players = [];
let currentIndex = -1;
let lastPlayer = null;
let partyMode = false;
let customTasks = {
  truth: [],
  dare: [],
  group: []
};

const truths = [
  "Was war dein peinlichstes Erlebnis?",
  "Hast du schon mal geschummelt?",
  "Wen aus der Runde findest du am attraktivsten?"
];

const dares = [
  "Tanze für 30 Sekunden ohne Musik.",
  "Mach 10 Liegestütze.",
  "Sprich 1 Runde mit verstellter Stimme."
];

const groupTasks = [
  "Alle müssen gleichzeitig ein Tiergeräusch machen.",
  "Alle klatschen in die Hände, wer zuletzt ist, macht 5 Kniebeugen.",
  "Gruppen-High-Five! Wer nicht mitmacht, trinkt!"
];

function addPlayer() {
  const nameInput = document.getElementById("nameInput");
  const name = nameInput.value.trim();
  if (name && !players.includes(name)) {
    players.push(name);
    updatePlayerList();
    nameInput.value = "";
  }
}

function removePlayer(index) {
  players.splice(index, 1);
  updatePlayerList();
}

function updatePlayerList() {
  const list = document.getElementById("playerList");
  list.innerHTML = "";
  players.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = p;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.className = "remove-btn";
    btn.onclick = () => removePlayer(i);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function startGame() {
  if (players.length < 2) {
    alert("Mindestens 2 Spieler erforderlich!");
    return;
  }
  partyMode = document.getElementById("partyMode").checked;
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  nextTurn();
}

function nextTurn() {
  document.getElementById("taskText").textContent = "";

  let nextPlayer;
  do {
    nextPlayer = players[Math.floor(Math.random() * players.length)];
  } while (nextPlayer === lastPlayer && players.length > 1);
  lastPlayer = nextPlayer;

  document.getElementById("currentPlayer").textContent = `${nextPlayer} ist dran!`;
}

function choose(type) {
  const allTasks = (type === 'truth' ? truths : dares).concat(customTasks[type]);
  let task = allTasks[Math.floor(Math.random() * allTasks.length)];

  if (partyMode && Math.random() < 0.2 && (groupTasks.length + customTasks.group.length) > 0) {
    const group = groupTasks.concat(customTasks.group);
    task = "[GRUPPENAUFGABE] " + group[Math.floor(Math.random() * group.length)];
  }

  document.getElementById("taskText").textContent = task;
}

function openCustomTasks() {
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("customTasks").style.display = "block";
  loadCustomTasks();
}

function closeCustomTasks() {
  document.getElementById("customTasks").style.display = "none";
  document.getElementById("mainMenu").style.display = "block";
}

function addCustomTask() {
  const type = document.getElementById("customType").value;
  const text = document.getElementById("customInput").value.trim();
  if (text) {
    customTasks[type].push(text);
    saveCustomTasks();
    loadCustomTasks();
    document.getElementById("customInput").value = "";
  }
}

function removeCustomTask(type, index) {
  customTasks[type].splice(index, 1);
  saveCustomTasks();
  loadCustomTasks();
}

function loadCustomTasks() {
  const saved = localStorage.getItem("wop_custom_tasks");
  if (saved) {
    customTasks = JSON.parse(saved);
  }
  const list = document.getElementById("customList");
  list.innerHTML = "";
  for (let type in customTasks) {
    customTasks[type].forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = `[${type}] ${task}`;
      const btn = document.createElement("button");
      btn.textContent = "❌";
      btn.className = "remove-btn";
      btn.onclick = () => removeCustomTask(type, index);
      li.appendChild(btn);
      list.appendChild(li);
    });
  }
}

function saveCustomTasks() {
  localStorage.setItem("wop_custom_tasks", JSON.stringify(customTasks));
}

window.onload = loadCustomTasks;
