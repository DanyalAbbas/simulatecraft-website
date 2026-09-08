(() => {
  /* ========================================================
     CONFIG — paste your Google Apps Script web app URL here
     ======================================================== */
  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwo9LwIobmbQB6ZrsX79Q7rX9GHTEdCGAY4Ni6T8DQofouvma_NvTUrBtE2B2sNpiuc/exec";

  /* ========================================================
     BIG FIVE PERSONALITY QUIZ (20 questions, 4 per trait)
     ======================================================== */
  const QUESTIONS = [
    // Openness (O)
    { id: "o1", trait: "O", text: "I have a vivid imagination.", reverse: false },
    { id: "o2", trait: "O", text: "I enjoy trying new things.", reverse: false },
    { id: "o3", trait: "O", text: "I prefer routine over variety.", reverse: true },
    { id: "o4", trait: "O", text: "I am curious about many different things.", reverse: false },
    // Conscientiousness (C)
    { id: "c1", trait: "C", text: "I always keep my promises.", reverse: false },
    { id: "c2", trait: "C", text: "I like to keep things neat and organized.", reverse: false },
    { id: "c3", trait: "C", text: "I often forget to put things back in their place.", reverse: true },
    { id: "c4", trait: "C", text: "I pay attention to details.", reverse: false },
    // Extraversion (E)
    { id: "e1", trait: "E", text: "I feel comfortable around people.", reverse: false },
    { id: "e2", trait: "E", text: "I am the life of the party.", reverse: false },
    { id: "e3", trait: "E", text: "I prefer to stay in the background.", reverse: true },
    { id: "e4", trait: "E", text: "I talk to a lot of different people at parties.", reverse: false },
    // Agreeableness (A)
    { id: "a1", trait: "A", text: "I am interested in people's stories.", reverse: false },
    { id: "a2", trait: "A", text: "I make people feel at ease.", reverse: false },
    { id: "a3", trait: "A", text: "I tend to be critical of others.", reverse: true },
    { id: "a4", trait: "A", text: "I sympathize with others' feelings.", reverse: false },
    // Neuroticism (N)
    { id: "n1", trait: "N", text: "I get stressed out easily.", reverse: false },
    { id: "n2", trait: "N", text: "I remain calm in tense situations.", reverse: true },
    { id: "n3", trait: "N", text: "I worry about things.", reverse: false },
    { id: "n4", trait: "N", text: "I am easily unsettled.", reverse: false },
  ];

  const TRAIT_LABELS = ["O", "C", "E", "A", "N"];
  const TRAIT_NAMES = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"];

  const answers = {};

  function renderQuiz() {
    const container = document.getElementById("quiz-container");
    QUESTIONS.forEach((q) => {
      const div = document.createElement("div");
      div.className = "quiz-question";
      div.innerHTML = `
        <p class="quiz-text">${q.text}</p>
        <div class="quiz-scale">
          <span class="scale-label">Disagree</span>
          <div class="quiz-options">
            ${[1, 2, 3, 4, 5].map((v) => `
              <label class="quiz-opt">
                <input type="radio" name="q_${q.id}" value="${v}" required />
                <span class="quiz-num">${v}</span>
              </label>
            `).join("")}
          </div>
          <span class="scale-label">Agree</span>
        </div>
      `;
      div.querySelectorAll("input").forEach((input) => {
        input.addEventListener("change", () => {
          answers[q.id] = parseInt(input.value);
          updateChart();
        });
      });
      container.appendChild(div);
    });
  }

  function scoreTrait(trait) {
    const items = QUESTIONS.filter((q) => q.trait === trait);
    let sum = 0;
    items.forEach((q) => {
      let v = answers[q.id] || 3;
      if (q.reverse) v = 6 - v;
      sum += v;
    });
    return Math.round(((sum - items.length) / (items.length * 4)) * 100);
  }

  let chart = null;
  function initChart() {
    const ctx = document.getElementById("personality-chart");
    chart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: TRAIT_NAMES,
        datasets: [
          {
            label: "You",
            data: [0, 0, 0, 0, 0],
            backgroundColor: "rgba(93, 156, 61, 0.3)",
            borderColor: "#5d9c3d",
            borderWidth: 2,
            pointBackgroundColor: "#f1c232",
            pointRadius: 4,
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { display: false },
            grid: { color: "rgba(255,255,255,0.15)" },
            angleLines: { color: "rgba(255,255,255,0.15)" },
            pointLabels: {
              color: "#e0c090",
              font: { family: "Pixelify Sans", size: 14 },
            },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  function updateChart() {
    const totalAnswered = Object.keys(answers).length;
    if (totalAnswered < 8) return;

    const scores = TRAIT_LABELS.map((t) => scoreTrait(t));
    const label = document.querySelector(".chart-label");

    if (chart) {
      chart.data.datasets[0].data = scores;
      chart.update();
      if (label) label.textContent = "Your personality profile";
    }
  }

  /* ========================================================
     SKIN POOL — ~100 skins split by gender
     ======================================================== */
  const SKINS = {
    male: [
      "https://mc-heads.net/skin/Notch",
      "https://mc-heads.net/skin/jeb_",
      "https://mc-heads.net/skin/dinnerbone",
      "https://mc-heads.net/skin/Herobrine",
      "https://mc-heads.net/skin/Entity303",
      "https://mc-heads.net/skin/Deadpool",
      "https://mc-heads.net/skin/Spiderman",
      "https://mc-heads.net/skin/Batman",
      "https://mc-heads.net/skin/Superman",
      "https://mc-heads.net/skin/Ironman",
      "https://mc-heads.net/skin/Thor",
      "https://mc-heads.net/skin/Captainamerica",
      "https://mc-heads.net/skin/Hulk",
      "https://mc-heads.net/skin/Wolverine",
      "https://mc-heads.net/skin/Punisher",
      "https://mc-heads.net/skin/Venom",
      "https://mc-heads.net/skin/Joker",
      "https://mc-heads.net/skin/Mario",
      "https://mc-heads.net/skin/Luigi",
      "https://mc-heads.net/skin/Link",
      "https://mc-heads.net/skin/Masterchief",
      "https://mc-heads.net/skin/Gordonfreeman",
      "https://mc-heads.net/skin/Cloudstrife",
      "https://mc-heads.net/skin/Leonkennedy",
      "https://mc-heads.net/skin/Solidus",
      "https://mc-heads.net/skin/Grayfox",
      "https://mc-heads.net/skin/Bigboss",
      "https://mc-heads.net/skin/Snake",
      "https://mc-heads.net/skin/Ryu",
      "https://mc-heads.net/skin/Ken",
      "https://mc-heads.net/skin/Scorpion",
      "https://mc-heads.net/skin/Subzero",
      "https://mc-heads.net/skin/Pikachu",
      "https://mc-heads.net/skin/Sonic",
      "https://mc-heads.net/skin/Megaman",
      "https://mc-heads.net/skin/Samus",
      "https://mc-heads.net/skin/Bomberman",
      "https://mc-heads.net/skin/Pacman",
      "https://mc-heads.net/skin/Donkeykong",
      "https://mc-heads.net/skin/Yoshi",
    ],
    female: [
      "https://mc-heads.net/skin/Alex",
      "https://mc-heads.net/skin/Harleyquinn",
      "https://mc-heads.net/skin/Chunli",
      "https://mc-heads.net/skin/Samus",
      "https://mc-heads.net/skin/Zelda",
      "https://mc-heads.net/skin/Pikachu",
      "https://mc-heads.net/skin/Sonic",
      "https://mc-heads.net/skin/Megaman",
      "https://mc-heads.net/skin/Bomberman",
      "https://mc-heads.net/skin/Pacman",
      "https://mc-heads.net/skin/Donkeykong",
      "https://mc-heads.net/skin/Yoshi",
      "https://mc-heads.net/skin/Toad",
      "https://mc-heads.net/skin/Notch",
      "https://mc-heads.net/skin/jeb_",
      "https://mc-heads.net/skin/Herobrine",
      "https://mc-heads.net/skin/Deadpool",
      "https://mc-heads.net/skin/Batman",
      "https://mc-heads.net/skin/Superman",
      "https://mc-heads.net/skin/Ironman",
      "https://mc-heads.net/skin/Thor",
      "https://mc-heads.net/skin/Captainamerica",
      "https://mc-heads.net/skin/Hulk",
      "https://mc-heads.net/skin/Wolverine",
      "https://mc-heads.net/skin/Venom",
      "https://mc-heads.net/skin/Joker",
      "https://mc-heads.net/skin/Mario",
      "https://mc-heads.net/skin/Luigi",
      "https://mc-heads.net/skin/Link",
      "https://mc-heads.net/skin/Masterchief",
    ],
    other: [
      "https://mc-heads.net/skin/Notch",
      "https://mc-heads.net/skin/jeb_",
      "https://mc-heads.net/skin/Alex",
      "https://mc-heads.net/skin/dinnerbone",
      "https://mc-heads.net/skin/Herobrine",
      "https://mc-heads.net/skin/Entity303",
      "https://mc-heads.net/skin/Pikachu",
      "https://mc-heads.net/skin/Sonic",
      "https://mc-heads.net/skin/Megaman",
      "https://mc-heads.net/skin/Samus",
      "https://mc-heads.net/skin/Bomberman",
      "https://mc-heads.net/skin/Pacman",
      "https://mc-heads.net/skin/Donkeykong",
      "https://mc-heads.net/skin/Yoshi",
      "https://mc-heads.net/skin/Toad",
      "https://mc-heads.net/skin/Mario",
      "https://mc-heads.net/skin/Luigi",
      "https://mc-heads.net/skin/Deadpool",
      "https://mc-heads.net/skin/Batman",
      "https://mc-heads.net/skin/Superman",
    ],
  };

  /* ========================================================
     3D SKIN VIEWER
     ======================================================== */
  let skinViewer = null;
  let currentGender = "male";
  let currentSkinUrl = "";

  function initSkinViewer() {
    const canvas = document.getElementById("skin-viewer");
    skinViewer = new skinview3d.SkinViewer({
      canvas: canvas,
      width: 300,
      height: 400,
      skin: SKINS.male[0],
    });
    skinViewer.autoRotate = true;
    skinViewer.autoRotateSpeed = 2;
    skinViewer.animation = new skinview3d.WalkingAnimation();
    skinViewer.zoom = 0.8;
    currentSkinUrl = SKINS.male[0];
    document.getElementById("skin-url").value = currentSkinUrl;
    document.getElementById("skin-name").textContent = "Notch (default)";
  }

  function rollSkin() {
    const pool = SKINS[currentGender] || SKINS.male;
    const idx = Math.floor(Math.random() * pool.length);
    const url = pool[idx];
    currentSkinUrl = url;
    skinViewer.loadSkin(url);
    document.getElementById("skin-url").value = url;
    const name = url.split("/skin/")[1] || "Unknown";
    document.getElementById("skin-name").textContent = name;
  }

  /* ========================================================
     GENDER SWITCH — reroll skin on change
     ======================================================== */
  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      currentGender = radio.value;
      rollSkin();
    });
  });

  document.getElementById("reroll-skin").addEventListener("click", rollSkin);

  /* ========================================================
     FORM SUBMISSION
     ======================================================== */
  document.getElementById("agent-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    status.hidden = false;
    status.textContent = "Submitting...";
    status.className = "form-status";

    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      gender: form.gender.value,
      role: form.role.value,
      department: form.department.value.trim(),
      personality: {
        O: scoreTrait("O"),
        C: scoreTrait("C"),
        E: scoreTrait("E"),
        A: scoreTrait("A"),
        N: scoreTrait("N"),
      },
      skin_url: currentSkinUrl,
      fun_fact: form.fun_fact.value.trim(),
      timestamp: new Date().toISOString(),
    };

    // Validate
    if (!data.name || !data.gender || !data.role) {
      status.textContent = "Please fill in all required fields.";
      status.className = "form-status form-error";
      return;
    }
    if (Object.keys(answers).length < 10) {
      status.textContent = "Please answer at least 10 personality questions.";
      status.className = "form-status form-error";
      return;
    }

    try {
      const resp = await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      status.textContent = "Agent submitted!";
      status.className = "form-status form-success";
      form.reset();
      // Reset skin to default
      currentGender = "male";
      rollSkin();
    } catch (err) {
      status.textContent = "Error submitting. Please try again.";
      status.className = "form-status form-error";
      console.error(err);
    }
  });

  /* ========================================================
     INIT
     ======================================================== */
  renderQuiz();
  initChart();
  initSkinViewer();
})();
