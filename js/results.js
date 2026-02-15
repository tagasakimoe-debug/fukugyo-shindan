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
        responsive: true,
        maintainAspectRatio: false,
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

    dom.lineLink.href = data.links.lineOfficialUrl;
    dom.googleFormLink.href = data.links.googleFormUrl;

    return {
      shareText: buildShareText(result, data)
    };
  }

  window.ResultsView = {
    renderResult
  };
})();
