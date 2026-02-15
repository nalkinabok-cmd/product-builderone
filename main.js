
document.addEventListener("DOMContentLoaded", () => {
  const latestResultEl = document.getElementById("latest-result");
  const generateBtn = document.getElementById("generate-btn");
  const lottoSetsContainer = document.getElementById("lotto-sets-container");
  const numberTemplate = document.getElementById("number-template");
  const themeToggle = document.getElementById("theme-toggle");

  const latestJsonpUrl = "https://api.lotto-haru.kr/win/analysis.js";
  const THEME_KEY = "theme-mode";

  function getBallRangeClass(number) {
    if (number <= 10) return "range-1";
    if (number <= 20) return "range-2";
    if (number <= 30) return "range-3";
    if (number <= 40) return "range-4";
    return "range-5";
  }

  function createNumberBall(number, extraClass = "") {
    const node = numberTemplate.content.firstElementChild.cloneNode(true);
    node.textContent = String(number);
    node.classList.add(getBallRangeClass(number));
    if (extraClass) {
      node.classList.add(extraClass);
    }
    return node;
  }

  function createLottoSet() {
    const picked = new Set();
    while (picked.size < 6) {
      picked.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(picked).sort((a, b) => a - b);
  }

  function renderRecommendedSets() {
    lottoSetsContainer.innerHTML = "";

    for (let i = 0; i < 5; i += 1) {
      const setWrapper = document.createElement("div");
      setWrapper.className = "lotto-set";

      const label = document.createElement("span");
      label.className = "set-label";
      label.textContent = `세트 ${i + 1}`;
      setWrapper.appendChild(label);

      const numbers = createLottoSet();
      numbers.forEach((num) => {
        setWrapper.appendChild(createNumberBall(num));
      });

      lottoSetsContainer.appendChild(setWrapper);
    }
  }

  async function fetchLatestResult() {
    try {
      const payload = await fetchLatestResultByJsonp();
      const latest =
        payload && Array.isArray(payload.data) ? payload.data[0] : null;

      if (!latest || !Array.isArray(latest.ball)) {
        throw new Error("Invalid response format");
      }

      latestResultEl.innerHTML = "";

      const summary = document.createElement("p");
      summary.className = "summary";
      summary.textContent = `${latest.chasu}회 (${latest.date})`;
      latestResultEl.appendChild(summary);

      const numbersRow = document.createElement("div");
      numbersRow.className = "numbers-row";

      latest.ball.forEach((num) => {
        numbersRow.appendChild(createNumberBall(num));
      });

      const plus = document.createElement("span");
      plus.className = "plus-sign";
      plus.textContent = "+";
      numbersRow.appendChild(plus);

      numbersRow.appendChild(createNumberBall(latest.bonusBall, "bonus"));
      latestResultEl.appendChild(numbersRow);
    } catch (error) {
      latestResultEl.innerHTML =
        "<p class='error'>최신 당첨번호를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>";
      console.error("Failed to load latest lotto result:", error);
    }
  }

  function fetchLatestResultByJsonp() {
    return new Promise((resolve, reject) => {
      const callbackName = `lottoCb_${Date.now()}`;
      const script = document.createElement("script");
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("JSONP request timeout"));
      }, 8000);

      function cleanup() {
        clearTimeout(timer);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete window[callbackName];
      }

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error("Failed to load JSONP script"));
      };

      script.src = `${latestJsonpUrl}?callback=${callbackName}`;
      document.body.appendChild(script);
    });
  }

  function applyTheme(theme) {
    document.body.classList.toggle("day-mode", theme === "day");
    themeToggle.textContent = theme === "day" ? "Night" : "Day";
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const currentTheme = savedTheme || (prefersLight ? "day" : "night");
    applyTheme(currentTheme);
  }

  themeToggle.addEventListener("click", () => {
    const isDay = document.body.classList.contains("day-mode");
    const nextTheme = isDay ? "night" : "day";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });

  generateBtn.addEventListener("click", renderRecommendedSets);

  initTheme();
  fetchLatestResult();
  renderRecommendedSets();
});
