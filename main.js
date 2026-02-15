
document.addEventListener("DOMContentLoaded", () => {
  const latestResultEl = document.getElementById("latest-result");
  const generateBtn = document.getElementById("generate-btn");
  const lottoSetsContainer = document.getElementById("lotto-sets-container");
  const numberTemplate = document.getElementById("number-template");

  const latestApiUrl = "https://api.lotto-haru.kr/win/analysis.json";

  function createNumberBall(number, extraClass = "") {
    const node = numberTemplate.content.firstElementChild.cloneNode(true);
    node.textContent = String(number);
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
      const response = await fetch(latestApiUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const latest = Array.isArray(data) ? data[0] : null;

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

  generateBtn.addEventListener("click", renderRecommendedSets);

  fetchLatestResult();
  renderRecommendedSets();
});
