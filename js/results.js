(function () {
  let radarChart = null;

  function renderScoreList(scoreListEl, ranked, data) {
    scoreListEl.innerHTML = "";

    ranked.forEach((item) => {
      const typeInfo = data.types[item.type];
      const li = document.createElement("li");
      li.className = "score-item";
      li.innerHTML = `
        <span class="score-name">${typeInfo.name}</span>
        <span class="score-value">${item.percent}%</span>
        <div class="score-bar"><span style="width:${item.percent}%"></span></div>
      `;
      scoreListEl.appendChild(li);
    });
  }

  function drawFallbackRadar(canvasEl, labels, values) {
    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      return;
    }

    const size = Math.min(canvasEl.clientWidth || 320, canvasEl.clientHeight || 320);
    const ratio = window.devicePixelRatio || 1;

    canvasEl.width = Math.floor(size * ratio);
    canvasEl.height = Math.floor(size * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.34;
    const count = values.length;
    const levels = 5;
    const angleStep = (Math.PI * 2) / count;

    ctx.strokeStyle = "rgba(18,52,90,0.16)";
    ctx.lineWidth = 1;

    for (let level = 1; level <= levels; level += 1) {
      const r = (radius * level) / levels;
      ctx.beginPath();
      for (let i = 0; i < count; i += 1) {
        const angle = -Math.PI / 2 + angleStep * i;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let i = 0; i < count; i += 1) {
      const angle = -Math.PI / 2 + angleStep * i;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0; i < count; i += 1) {
      const angle = -Math.PI / 2 + angleStep * i;
      const valueRadius = radius * (values[i] / 100);
      const x = centerX + valueRadius * Math.cos(angle);
      const y = centerY + valueRadius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(18, 52, 90, 0.24)";
    ctx.strokeStyle = "#12345a";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0f1d33";
    ctx.font = "700 10px 'Noto Sans JP', sans-serif";
    labels.forEach((label, i) => {
      const angle = -Math.PI / 2 + angleStep * i;
      const textRadius = radius + 16;
      const x = centerX + textRadius * Math.cos(angle);
      const y = centerY + textRadius * Math.sin(angle);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y);
    });
  }

  function renderRadarChart(canvasEl, ranked, data) {
    const labels = data.typeOrder.map((typeId) => data.types[typeId].name);
    const values = data.typeOrder.map((typeId) => {
      const found = ranked.find((item) => item.type === typeId);
      return found ? found.percent : 0;
    });

    if (radarChart) {
      radarChart.destroy();
      radarChart = null;
    }

    if (window.Chart) {
      radarChart = new Chart(canvasEl, {
        type: "radar",
        data: {
          labels,
          datasets: [
            {
              label: "適性スコア",
              data: values,
              borderColor: "#12345a",
              backgroundColor: "rgba(18, 52, 90, 0.24)",
              pointBackgroundColor: "#f38b1f",
              pointBorderColor: "#fff",
              pointRadius: 3
            }
          ]
        },
        options: {
          animation: false,
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1,
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: {
                stepSize: 20,
                backdropColor: "transparent"
              },
              grid: {
                color: "rgba(18, 52, 90, 0.15)"
              },
              pointLabels: {
                color: "#0f1d33",
                font: {
                  size: 11,
                  weight: 700
                }
              },
              angleLines: {
                color: "rgba(18, 52, 90, 0.15)"
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      return;
    }

    drawFallbackRadar(canvasEl, labels, values);
  }

  function buildShareText(result, data) {
    const main = data.types[result.mainType];
    const sub = data.types[result.subType];
    return `副業適性診断の結果\nメイン: ${main.name}\nサブ: ${sub.name}\n#副業診断 #キャリア診断`;
  }

  function renderResult(dom, result, data) {
    const main = data.types[result.mainType];
    const sub = data.types[result.subType];

    dom.mainName.textContent = main.name;
    dom.mainCopy.textContent = main.catchCopy;
    dom.mainDesc.textContent = main.description;

    dom.subName.textContent = sub.name;
    dom.subCopy.textContent = sub.catchCopy;
    dom.subDesc.textContent = sub.description;

    renderScoreList(dom.scoreList, result.ranked, data);
    renderRadarChart(dom.radarChart, result.ranked, data);

    const lineUrl = data.links.lineOfficialUrl;
    if (lineUrl && lineUrl !== "#" && !lineUrl.includes("xxxxxxxx")) {
      dom.lineLink.href = lineUrl;
      dom.lineLink.removeAttribute("aria-disabled");
      dom.lineLink.classList.remove("is-disabled-link");
    } else {
      dom.lineLink.href = "#";
      dom.lineLink.setAttribute("aria-disabled", "true");
      dom.lineLink.classList.add("is-disabled-link");
    }

    const formUrl = data.links.googleFormUrl;
    if (formUrl && formUrl !== "#" && !formUrl.includes("xxxxxxxx")) {
      dom.googleFormLink.href = formUrl;
      dom.googleFormLink.removeAttribute("aria-disabled");
      dom.googleFormLink.classList.remove("is-disabled-link");
    } else {
      dom.googleFormLink.href = "#";
      dom.googleFormLink.setAttribute("aria-disabled", "true");
      dom.googleFormLink.classList.add("is-disabled-link");
    }

    return {
      shareText: buildShareText(result, data)
    };
  }

  window.ResultsView = {
    renderResult
  };
})();
