(() => {
  /* ========================================================
     CONFIG — paste your Google Apps Script web app URL here
     ======================================================== */
  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwHcQEowQjnF4XdxuFecSzxmL14un7FMefK-rh1O5A0nBZRzk9IYTLU_5EYKJxF6atQ/exec";

  const QUESTIONS = [
    { id: "o1", trait: "O", text: "I have a vivid imagination.", reverse: false },
    { id: "o2", trait: "O", text: "I enjoy trying new things.", reverse: false },
    { id: "o3", trait: "O", text: "I prefer routine over variety.", reverse: true },
    { id: "o4", trait: "O", text: "I am curious about many different things.", reverse: false },
    { id: "c1", trait: "C", text: "I always keep my promises.", reverse: false },
    { id: "c2", trait: "C", text: "I like to keep things neat and organized.", reverse: false },
    { id: "c3", trait: "C", text: "I often forget to put things back in their place.", reverse: true },
    { id: "c4", trait: "C", text: "I pay attention to details.", reverse: false },
    { id: "e1", trait: "E", text: "I feel comfortable around people.", reverse: false },
    { id: "e2", trait: "E", text: "I am the life of the party.", reverse: false },
    { id: "e3", trait: "E", text: "I prefer to stay in the background.", reverse: true },
    { id: "e4", trait: "E", text: "I talk to a lot of different people at parties.", reverse: false },
    { id: "a1", trait: "A", text: "I am interested in people's stories.", reverse: false },
    { id: "a2", trait: "A", text: "I make people feel at ease.", reverse: false },
    { id: "a3", trait: "A", text: "I tend to be critical of others.", reverse: true },
    { id: "a4", trait: "A", text: "I sympathize with others' feelings.", reverse: false },
    { id: "n1", trait: "N", text: "I get stressed out easily.", reverse: false },
    { id: "n2", trait: "N", text: "I remain calm in tense situations.", reverse: true },
    { id: "n3", trait: "N", text: "I worry about things.", reverse: false },
    { id: "n4", trait: "N", text: "I am easily unsettled.", reverse: false },
  ];

  const TRAIT_LABELS = ["O", "C", "E", "A", "N"];
  const TRAIT_NAMES = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"];
  const QUIZ_TOTAL = QUESTIONS.length;

  const SPEECH_LABELS = {
    formal: "formal and polite",
    casual: "casual and chill",
    witty: "witty / lightly sarcastic",
    quiet: "quiet — few words",
    enthusiastic: "enthusiastic and energetic",
    mix: "a natural mix of Urdu and English",
  };

  const PRESSURE_LABELS = {
    freeze: "freeze up for a moment",
    joke: "defuse with a joke",
    ask_help: "ask someone for help",
    push_harder: "push harder and grind through it",
    avoid: "step away / avoid the situation",
  };

  const SOCIAL_LABELS = {
    lead: "take the lead",
    follow: "follow someone else's plan",
    help: "help whoever needs it",
    solo: "prefer working alone",
    observe: "quietly observe before jumping in",
  };

  const DAY_LABELS = {
    library: "hang in the library",
    canteen: "live in the canteen",
    late: "show up late",
    office_hours: "do office hours / meetings",
    lab: "stay in the lab",
    sports: "play or watch sports",
    events: "join events / societies",
    alone_walk: "take quiet walks",
  };

  const answers = {};

  function scoreTrait(trait) {
    const items = QUESTIONS.filter((q) => q.trait === trait);
    let sum = 0;
    let counted = 0;
    items.forEach((q) => {
      if (answers[q.id] == null) return;
      let v = answers[q.id];
      if (q.reverse) v = 6 - v;
      sum += v;
      counted += 1;
    });
    if (!counted) return 0;
    return Math.round(((sum - counted) / (counted * 4)) * 100);
  }

  function updateQuizProgress() {
    const n = Object.keys(answers).length;
    const el = document.getElementById("quiz-progress");
    if (el) el.textContent = `${n} / ${QUIZ_TOTAL} answered`;
  }

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
          answers[q.id] = parseInt(input.value, 10);
          updateQuizProgress();
          updateChart();
        });
      });
      container.appendChild(div);
    });
    updateQuizProgress();
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
    if (Object.keys(answers).length < QUIZ_TOTAL) return;
    const scores = TRAIT_LABELS.map((t) => scoreTrait(t));
    const label = document.querySelector(".chart-label");
    if (chart) {
      chart.data.datasets[0].data = scores;
      chart.update();
      if (label) label.textContent = "Your personality profile";
    }
  }

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

  let skinViewer = null;
  let currentGender = "male";
  let currentSkinUrl = "";

  function sizeSkinViewer() {
    if (!skinViewer) return;
    const wrap = document.querySelector(".skin-viewer-wrap");
    if (!wrap) return;
    const maxW = 300;
    const avail = Math.max(180, Math.floor(wrap.clientWidth - 8));
    const width = Math.min(maxW, avail);
    const height = Math.round(width * (400 / 300));
    skinViewer.width = width;
    skinViewer.height = height;
  }

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
    sizeSkinViewer();
  }

  function rollSkin() {
    const pool = SKINS[currentGender] || SKINS.male;
    const idx = Math.floor(Math.random() * pool.length);
    const url = pool[idx];
    currentSkinUrl = url;
    skinViewer.loadSkin(url);
    document.getElementById("skin-url").value = url;
    document.getElementById("skin-name").textContent = url.split("/skin/")[1] || "Unknown";
  }

  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      currentGender = radio.value;
      rollSkin();
    });
  });
  document.getElementById("reroll-skin").addEventListener("click", rollSkin);

  function syncRoleDetails() {
    const role = document.querySelector('input[name="role"]:checked')?.value || "";
    document.querySelectorAll(".role-detail").forEach((el) => {
      const match = !!role && el.dataset.role === role;
      el.hidden = !match;
      el.classList.toggle("is-active", match);
      el.querySelectorAll("input, select, textarea").forEach((input) => {
        input.disabled = !match;
        input.required = match;
        if (!match) {
          input.value = "";
          input.removeAttribute("aria-invalid");
        }
      });
      if (!match) el.classList.remove("is-invalid");
    });
  }
  document.querySelectorAll('input[name="role"]').forEach((radio) => {
    radio.addEventListener("change", syncRoleDetails);
  });

  function clearFieldErrors() {
    document.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    document.querySelectorAll("[aria-invalid='true']").forEach((el) => {
      el.removeAttribute("aria-invalid");
    });
  }

  function markInvalid(el) {
    if (!el) return;
    const group = el.closest(".form-group, .quiz-question, .role-detail") || el;
    group.classList.add("is-invalid");
    if (el.matches && el.matches("input, select, textarea")) {
      el.setAttribute("aria-invalid", "true");
    }
  }

  function radioGroupFilled(form, name) {
    return !!form.querySelector(`input[name="${name}"]:checked`);
  }

  function validateAndHighlight(form, data) {
    clearFieldErrors();
    const problems = [];

    const requireText = (selector, label) => {
      const el = form.querySelector(selector);
      if (!el || el.disabled) return;
      if (!String(el.value || "").trim()) {
        markInvalid(el);
        problems.push(label);
      }
    };

    const requireRadio = (name, label) => {
      if (!radioGroupFilled(form, name)) {
        const sample = form.querySelector(`input[name="${name}"]`);
        markInvalid(sample);
        problems.push(label);
      }
    };

    requireText("#agent-name", "Name");
    requireRadio("gender", "Gender");
    requireRadio("role", "Role");

    // Only the active role-detail is enabled/required.
    const activeDetail = form.querySelector(".role-detail.is-active input");
    if (activeDetail && !activeDetail.value.trim()) {
      markInvalid(activeDetail);
      const role = data.role;
      problems.push(
        role === "teacher" ? "Courses you teach"
          : role === "staff" ? "Office / desk"
            : "Year / batch",
      );
    }

    requireText("#speech-style", "Speech style");
    requireText("#campus-goal", "Campus goal");
    requireRadio("under_pressure", "Under pressure");
    requireRadio("with_others", "With other people");

    QUESTIONS.forEach((q) => {
      if (answers[q.id] == null) {
        const input = form.querySelector(`input[name="q_${q.id}"]`);
        markInvalid(input);
        problems.push(`Quiz: ${q.text}`);
      }
    });

    if (!problems.length) return null;

    const first = form.querySelector(".is-invalid");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });

    const shown = problems.slice(0, 4).join(" · ");
    const more = problems.length > 4 ? ` (+${problems.length - 4} more)` : "";
    return `Please fill the highlighted fields: ${shown}${more}`;
  }

  function traitBand(score) {
    if (score < 35) return "low";
    if (score < 65) return "moderate";
    return "high";
  }

  function roleDetailValue(form) {
    const role = form.role.value;
    if (role === "student") return form.student_year.value.trim();
    if (role === "teacher") return form.courses_taught.value.trim();
    if (role === "staff") return form.office.value.trim();
    return "";
  }

  function dayLifeValues(form) {
    return [...form.querySelectorAll('input[name="day_life"]:checked')].map((el) => el.value);
  }

  function collectPayload(form) {
    const personality = {
      O: scoreTrait("O"),
      C: scoreTrait("C"),
      E: scoreTrait("E"),
      A: scoreTrait("A"),
      N: scoreTrait("N"),
    };
    const dayLife = dayLifeValues(form);
    const roleDetail = roleDetailValue(form);
    const data = {
      name: form.name.value.trim(),
      gender: form.gender.value,
      role: form.role.value,
      department: form.department.value.trim(),
      role_detail: roleDetail,
      speech_style: form.speech_style.value,
      campus_goal: form.campus_goal.value.trim(),
      under_pressure: form.under_pressure.value,
      with_others: form.with_others.value,
      pet_peeve: form.pet_peeve.value.trim(),
      soft_spot: form.soft_spot.value.trim(),
      catchphrase: form.catchphrase.value.trim(),
      day_life: dayLife,
      day_life_text: dayLife.map((k) => DAY_LABELS[k] || k).join("; "),
      personality,
      openness: personality.O,
      conscientiousness: personality.C,
      extraversion: personality.E,
      agreeableness: personality.A,
      neuroticism: personality.N,
      skin_url: currentSkinUrl,
      fun_fact: form.fun_fact.value.trim(),
      timestamp: new Date().toISOString(),
    };
    data.persona = buildPersonaPrompt(data);
    data.goal = data.campus_goal;
    return data;
  }

  function buildPersonaPrompt(data) {
    const identity = [`You are ${data.name || "Agent"}`];
    if (data.gender) identity.push(data.gender);
    if (data.role) identity.push(`working as a ${data.role}`);
    if (data.department) identity.push(`in ${data.department}`);
    if (data.role_detail) {
      if (data.role === "student") identity.push(`(${data.role_detail})`);
      else if (data.role === "teacher") identity.push(`teaching ${data.role_detail}`);
      else if (data.role === "staff") identity.push(`based at ${data.role_detail}`);
    }

    const lines = [
      "## Identity",
      `${identity.join(", ")}.`,
      "You live inside a Minecraft recreation of NED University. Stay in character at all times.",
      "",
      "## Personality (Big Five)",
    ];

    const scores = data.personality || {};
    TRAIT_LABELS.forEach((key, i) => {
      const score = scores[key] ?? 0;
      lines.push(`- ${TRAIT_NAMES[i]}: ${score} (${traitBand(score)})`);
    });

    lines.push("", "## How you act");
    if (data.speech_style) {
      lines.push(`- Speech: ${SPEECH_LABELS[data.speech_style] || data.speech_style}.`);
    }
    if (data.campus_goal) {
      lines.push(`- Current campus goal: ${data.campus_goal}.`);
    }
    if (data.under_pressure) {
      lines.push(`- Under pressure you ${PRESSURE_LABELS[data.under_pressure] || data.under_pressure}.`);
    }
    if (data.with_others) {
      lines.push(`- With others you ${SOCIAL_LABELS[data.with_others] || data.with_others}.`);
    }
    if (data.pet_peeve) lines.push(`- Pet peeve: ${data.pet_peeve}.`);
    if (data.soft_spot) lines.push(`- Soft spot: ${data.soft_spot}.`);
    if (data.catchphrase) lines.push(`- Verbal quirk / catchphrase: ${data.catchphrase}.`);
    if (data.day_life_text) lines.push(`- A typical campus day: ${data.day_life_text}.`);
    if (data.fun_fact) lines.push(`- Fun fact: ${data.fun_fact}.`);

    lines.push(
      "",
      "## Behaviour in Minecraft",
      "- Choose exactly one action each tick.",
      "- Prefer short in-character chat when something noteworthy happens.",
      "- Let your role, goal, and personality shape priorities and tone.",
      "",
      "## Style",
      "- Speak in first person.",
      "- Keep chat under ~120 characters when possible.",
      "- Never break character or mention being an AI / language model.",
    );

    return lines.join("\n");
  }

  function showPersonaPreview(text) {
    const panel = document.getElementById("persona-preview-panel");
    const pre = document.getElementById("persona-preview");
    if (!panel || !pre) return;
    pre.textContent = text;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function validateForm(form, data) {
    return validateAndHighlight(form, data);
  }

  function bindClearOnEdit(form) {
    form.addEventListener("input", (e) => {
      const t = e.target;
      if (!t) return;
      t.removeAttribute("aria-invalid");
      t.closest(".form-group, .quiz-question, .role-detail")?.classList.remove("is-invalid");
    });
    form.addEventListener("change", (e) => {
      const t = e.target;
      if (!t) return;
      t.removeAttribute("aria-invalid");
      t.closest(".form-group, .quiz-question, .role-detail")?.classList.remove("is-invalid");
      // Completing a radio group clears the whole group highlight.
      if (t.type === "radio") {
        form.querySelectorAll(`input[name="${t.name}"]`).forEach((r) => {
          r.removeAttribute("aria-invalid");
          r.closest(".form-group, .quiz-question")?.classList.remove("is-invalid");
        });
      }
    });
  }

  document.getElementById("btn-preview-persona")?.addEventListener("click", () => {
    const form = document.getElementById("agent-form");
    const data = collectPayload(form);
    const err = validateForm(form, data);
    const status = document.getElementById("form-status");
    if (err) {
      status.hidden = false;
      status.textContent = err;
      status.className = "form-status form-error";
      return;
    }
    status.hidden = true;
    showPersonaPreview(data.persona);
  });

  document.getElementById("btn-copy-persona")?.addEventListener("click", async () => {
    const text = document.getElementById("persona-preview")?.textContent || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const btn = document.getElementById("btn-copy-persona");
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => { btn.textContent = prev; }, 1200);
      }
    } catch {
      /* ignore */
    }
  });

  document.getElementById("agent-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    const form = e.target;
    const data = collectPayload(form);
    const err = validateForm(form, data);
    status.hidden = false;

    if (err) {
      status.textContent = err;
      status.className = "form-status form-error";
      return;
    }

    status.textContent = "Submitting…";
    status.className = "form-status";
    showPersonaPreview(data.persona);

    const body = JSON.stringify(data);

    try {
      // Prefer CORS so we can detect real failures. Apps Script must allow it
      // (see GOOGLE_SHEETS_SETUP.md). Fall back to no-cors if blocked.
      let ok = false;
      try {
        const resp = await fetch(SHEETS_URL, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body,
        });
        ok = resp.ok;
        if (!ok) {
          const text = await resp.text().catch(() => "");
          throw new Error(text || `HTTP ${resp.status}`);
        }
      } catch (corsErr) {
        console.warn("CORS submit failed, falling back to no-cors:", corsErr);
        await fetch(SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body,
        });
        status.textContent = "Sent (can't confirm from browser — check the Google Sheet for your row).";
        status.className = "form-status form-success";
        form.reset();
        Object.keys(answers).forEach((k) => delete answers[k]);
        updateQuizProgress();
        syncRoleDetails();
        currentGender = "male";
        rollSkin();
        return;
      }

      if (ok) {
        status.textContent = "Agent submitted!";
        status.className = "form-status form-success";
        form.reset();
        Object.keys(answers).forEach((k) => delete answers[k]);
        updateQuizProgress();
        syncRoleDetails();
        currentGender = "male";
        rollSkin();
      }
    } catch (err2) {
      status.textContent = "Error submitting. Please try again.";
      status.className = "form-status form-error";
      console.error(err2);
    }
  });

  renderQuiz();
  initChart();
  initSkinViewer();
  syncRoleDetails();
  bindClearOnEdit(document.getElementById("agent-form"));
  window.addEventListener("resize", () => {
    sizeSkinViewer();
  });
})();
