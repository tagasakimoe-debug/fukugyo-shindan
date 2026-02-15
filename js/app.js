(function () {
  const data = window.DIAGNOSIS_DATA;
  const scoring = window.ScoringEngine;

  if (!data || !scoring) {
    return;
  }

  const views = {
    home: document.getElementById("view-home"),
    profile: document.getElementById("view-profile"),
    quiz: document.getElementById("view-quiz"),
    lead: document.getElementById("view-lead"),
    result: document.getElementById("view-result")
  };

  const dom = {
    startButton: document.getElementById("start-button"),
    profileForm: document.getElementById("profile-form"),
    profileFields: document.getElementById("profile-fields"),
    profileError: document.getElementById("profile-error"),
    profileCancel: document.getElementById("profile-cancel"),

    quizProgressText: document.getElementById("quiz-progress-text"),
    quizProgressBar: document.getElementById("quiz-progress-bar"),
    quizAxis: document.getElementById("quiz-axis"),
    quizQuestion: document.getElementById("quiz-question"),
    quizOptions: document.getElementById("quiz-options"),
    quizBack: document.getElementById("quiz-back"),

    leadForm: document.getElementById("lead-form"),
    leadName: document.getElementById("lead-name"),
    leadEmail: document.getElementById("lead-email"),
    leadLineName: document.getElementById("lead-line-name"),
    leadConsent: document.getElementById("lead-consent"),
    leadError: document.getElementById("lead-error"),
    leadBack: document.getElementById("lead-back"),
    leadSubmit: document.getElementById("lead-submit"),
    policyLink: document.querySelector(".policy-link"),

    resultCard: document.getElementById("result-card"),
    mainName: document.getElementById("main-type-name"),
    mainCopy: document.getElementById("main-type-copy"),
    mainDesc: document.getElementById("main-type-desc"),
    subName: document.getElementById("sub-type-name"),
    subCopy: document.getElementById("sub-type-copy"),
    subDesc: document.getElementById("sub-type-desc"),
    scoreList: document.getElementById("score-list"),
    radarChart: document.getElementById("radar-chart"),
    lineLink: document.getElementById("line-link"),
    googleFormLink: document.getElementById("google-form-link"),
    shareButton: document.getElementById("share-button"),
    restartButton: document.getElementById("restart-button")
  };

  const state = {
    profileAnswers: {
      available_time: "",
      occupation: "",
      side_job_experience: "",
      pc_skill: ""
    },
    quizAnswers: {},
    currentQuestionIndex: 0,
    result: null,
    shareText: ""
  };

  function removeContinueButton() {
    const button = document.getElementById("continue-button");
    if (button) {
      button.remove();
    }
  }

  function showView(viewKey) {
    Object.entries(views).forEach(([key, el]) => {
      if (!el) {
        return;
      }

      if (key === viewKey) {
        el.classList.remove("is-hidden");
      } else {
        el.classList.add("is-hidden");
      }
    });
  }

  function getProfileOptionLabel(questionId, value) {
    const question = data.profileQuestions.find((q) => q.id === questionId);
    const option = question?.options.find((op) => op.value === value);
    return option ? option.label : value;
  }

  function getScaleLabel(answerKey) {
    const scale = data.answerScale.find((item) => item.key === answerKey);
    return scale ? scale.label : answerKey;
  }

  function saveTempState() {
    const temporary = {
      profileAnswers: state.profileAnswers,
      quizAnswers: state.quizAnswers,
      currentQuestionIndex: state.currentQuestionIndex,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(data.storageKey, JSON.stringify(temporary));
  }

  function clearTempState() {
    localStorage.removeItem(data.storageKey);
  }

  function loadTempState() {
    const raw = localStorage.getItem(data.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }

  function resetState() {
    state.profileAnswers = {
      available_time: "",
      occupation: "",
      side_job_experience: "",
      pc_skill: ""
    };
    state.quizAnswers = {};
    state.currentQuestionIndex = 0;
    state.result = null;
    state.shareText = "";
    clearTempState();
    removeContinueButton();
  }

  function renderProfileForm() {
    dom.profileFields.innerHTML = "";

    data.profileQuestions.forEach((question) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "question-block";
      fieldset.innerHTML = `<legend>${question.label}</legend>`;

      const list = document.createElement("div");
      list.className = "choice-list";

      question.options.forEach((option) => {
        const id = `${question.id}-${option.value}`;
        const checked = state.profileAnswers[question.id] === option.value;

        const item = document.createElement("div");
        item.className = "choice-item";
        item.innerHTML = `
          <label for="${id}">
            <input id="${id}" type="radio" name="${question.id}" value="${option.value}" ${checked ? "checked" : ""}>
            <span>${option.label}</span>
          </label>
        `;
        list.appendChild(item);
      });

      fieldset.appendChild(list);
      dom.profileFields.appendChild(fieldset);
    });
  }

  function validateProfileAnswers(formData) {
    const nextAnswers = {};

    for (const question of data.profileQuestions) {
      const value = formData.get(question.id);
      if (!value) {
        return {
          ok: false,
          message: "プロフィール4問すべてに回答してください。"
        };
      }
      nextAnswers[question.id] = String(value);
    }

    return {
      ok: true,
      answers: nextAnswers
    };
  }

  function renderQuestion() {
    const total = data.questions.length;
    const index = state.currentQuestionIndex;
    const question = data.questions[index];
    const selected = state.quizAnswers[question.id] || "";

    dom.quizProgressText.textContent = `Q${index + 1} / ${total}`;
    dom.quizProgressBar.style.width = `${Math.round(((index + 1) / total) * 100)}%`;
    dom.quizAxis.textContent = `${question.axis}軸`;
    dom.quizQuestion.textContent = question.text;

    dom.quizOptions.innerHTML = "";
    data.answerScale.forEach((scale) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      if (selected === scale.key) {
        button.classList.add("is-selected");
      }
      button.textContent = scale.label;
      button.dataset.answer = scale.key;
      button.addEventListener("click", () => {
        state.quizAnswers[question.id] = scale.key;
        saveTempState();

        if (index === total - 1) {
          showView("lead");
          return;
        }

        state.currentQuestionIndex += 1;
        renderQuestion();
      });
      dom.quizOptions.appendChild(button);
    });
  }

  function getAnsweredQuestionCount() {
    return Object.keys(state.quizAnswers).length;
  }

  function buildSubmissionPayload(result) {
    const mainType = data.types[result.mainType];
    const subType = data.types[result.subType];

    const answers = data.questions.map((question) => {
      const answerKey = state.quizAnswers[question.id] || "";
      return {
        id: question.id,
        axis: question.axis,
        answer_key: answerKey,
        answer_label: getScaleLabel(answerKey)
      };
    });

    return {
      timestamp: new Date().toISOString(),
      name: dom.leadName.value.trim(),
      email: dom.leadEmail.value.trim(),
      line_name: dom.leadLineName.value.trim(),
      available_time: getProfileOptionLabel("available_time", state.profileAnswers.available_time),
      occupation: getProfileOptionLabel("occupation", state.profileAnswers.occupation),
      side_job_experience: getProfileOptionLabel("side_job_experience", state.profileAnswers.side_job_experience),
      pc_skill: getProfileOptionLabel("pc_skill", state.profileAnswers.pc_skill),
      main_type: mainType ? mainType.name : "",
      sub_type: subType ? subType.name : "",
      scores_json: JSON.stringify({
        raw: result.rawScores,
        normalized: result.normalizedScores,
        ranked: result.ranked
      }),
      answers_json: JSON.stringify(answers)
    };
  }

  function submitToGas(payload) {
    const endpoint = data.links.gasEndpoint;
    if (!endpoint) {
      return Promise.resolve({ skipped: true });
    }

    return fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    })
      .then(() => ({ skipped: false }))
      .catch(() => ({ skipped: false }));
  }

  function renderResultView(result) {
    const renderOutput = window.ResultsView.renderResult(
      {
        mainName: dom.mainName,
        mainCopy: dom.mainCopy,
        mainDesc: dom.mainDesc,
        subName: dom.subName,
        subCopy: dom.subCopy,
        subDesc: dom.subDesc,
        scoreList: dom.scoreList,
        radarChart: dom.radarChart,
        lineLink: dom.lineLink,
        googleFormLink: dom.googleFormLink
      },
      result,
      data
    );

    state.shareText = renderOutput.shareText;
  }

  function attachContinueButton(saved) {
    if (!saved) {
      return;
    }

    const count = Object.keys(saved.quizAnswers || {}).length;
    if (!count) {
      return;
    }

    const anchor = dom.startButton.parentElement;
    removeContinueButton();

    const button = document.createElement("button");
    button.id = "continue-button";
    button.type = "button";
    button.className = "btn btn-ghost";
    button.textContent = `前回の続きから再開する（${count}/30回答済み）`;
    button.addEventListener("click", () => {
      state.profileAnswers = {
        ...state.profileAnswers,
        ...(saved.profileAnswers || {})
      };
      state.quizAnswers = { ...(saved.quizAnswers || {}) };
      state.currentQuestionIndex = Math.max(0, Math.min(saved.currentQuestionIndex || 0, data.questions.length - 1));

      renderProfileForm();
      renderQuestion();
      showView("quiz");
    });

    anchor.appendChild(button);
  }

  async function handleShare() {
    const text = state.shareText || "副業適性診断を受けました。";

    if (navigator.share) {
      try {
        await navigator.share({
          title: data.appName,
          text
        });
        return;
      } catch (_error) {
        // no-op
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        alert("結果テキストをコピーしました。");
        return;
      } catch (_error) {
        // no-op
      }
    }

    alert(text);
  }

  function bindEvents() {
    dom.startButton.addEventListener("click", () => {
      resetState();
      renderProfileForm();
      showView("profile");
    });

    dom.profileCancel.addEventListener("click", () => {
      showView("home");
    });

    dom.profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      dom.profileError.textContent = "";

      const formData = new FormData(dom.profileForm);
      const validated = validateProfileAnswers(formData);
      if (!validated.ok) {
        dom.profileError.textContent = validated.message;
        return;
      }

      state.profileAnswers = validated.answers;
      state.currentQuestionIndex = 0;
      saveTempState();
      renderQuestion();
      showView("quiz");
    });

    dom.quizBack.addEventListener("click", () => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        renderQuestion();
        return;
      }

      renderProfileForm();
      showView("profile");
    });

    dom.leadBack.addEventListener("click", () => {
      state.currentQuestionIndex = data.questions.length - 1;
      renderQuestion();
      showView("quiz");
    });

    dom.leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      dom.leadError.textContent = "";

      if (getAnsweredQuestionCount() < data.questions.length) {
        dom.leadError.textContent = "質問に未回答があります。";
        return;
      }

      if (!dom.leadName.value.trim() || !dom.leadEmail.value.trim()) {
        dom.leadError.textContent = "必須項目を入力してください。";
        return;
      }

      if (!dom.leadConsent.checked) {
        dom.leadError.textContent = "同意にチェックしてください。";
        return;
      }

      dom.leadSubmit.disabled = true;

      const result = scoring.calculateScores(
        state.profileAnswers,
        state.quizAnswers,
        data
      );

      state.result = result;
      renderResultView(result);
      showView("result");

      const payload = buildSubmissionPayload(result);
      clearTempState();

      try {
        await submitToGas(payload);
      } finally {
        dom.leadSubmit.disabled = false;
      }
    });

    dom.shareButton.addEventListener("click", handleShare);

    dom.restartButton.addEventListener("click", () => {
      resetState();
      dom.leadForm.reset();
      showView("home");
    });
  }

  function init() {
    if (dom.policyLink) {
      dom.policyLink.href = data.links.privacyPolicyUrl || "#";
    }

    bindEvents();
    renderProfileForm();
    showView("home");

    const saved = loadTempState();
    attachContinueButton(saved);
  }

  init();
})();
