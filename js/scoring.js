(function () {
  const BASE_POINTS = {
    strongly_agree: 5,
    agree: 4,
    neutral: 3,
    disagree: 2,
    strongly_disagree: 1
  };

  const NEGATIVE_POINTS = {
    strongly_agree: 1,
    agree: 2,
    neutral: 3,
    disagree: 4,
    strongly_disagree: 5
  };

  function createZeroScoreMap(typeOrder) {
    return typeOrder.reduce((acc, typeId) => {
      acc[typeId] = 0;
      return acc;
    }, {});
  }

  function convertAnswerToPoint(answerKey, isNegative) {
    const points = isNegative ? NEGATIVE_POINTS : BASE_POINTS;
    return points[answerKey] || 0;
  }

  function applyMultiplierMap(scoreMap, multiplierMap) {
    Object.keys(multiplierMap).forEach((typeId) => {
      if (Object.prototype.hasOwnProperty.call(scoreMap, typeId)) {
        scoreMap[typeId] *= multiplierMap[typeId];
      }
    });
  }

  function getTimeFilter(availableTime) {
    if (availableTime === "lt_30m") {
      return {
        programmer: 0.5,
        video_editor: 0.5,
        small_business: 0.5,
        web_designer: 0.5
      };
    }

    if (availableTime === "m30_to_1h") {
      return {
        programmer: 0.7,
        video_editor: 0.7,
        small_business: 0.7
      };
    }

    if (availableTime === "h1_to_2h") {
      return {
        programmer: 0.85
      };
    }

    return {};
  }

  function getPcSkillFilter(pcSkill) {
    if (pcSkill === "low") {
      return {
        programmer: 0.4,
        web_designer: 0.6,
        video_editor: 0.7
      };
    }

    if (pcSkill === "basic") {
      return {
        programmer: 0.7
      };
    }

    if (pcSkill === "advanced") {
      return {
        programmer: 1.1
      };
    }

    return {};
  }

  function getMaxPossibleScore(data) {
    const maxScores = createZeroScoreMap(data.typeOrder);

    data.questions.forEach((question) => {
      question.targets.forEach((target) => {
        maxScores[target.type] += 5 * target.weight;
      });
    });

    return maxScores;
  }

  function calculateScores(profileAnswers, quizAnswers, data) {
    const rawScores = createZeroScoreMap(data.typeOrder);

    data.questions.forEach((question) => {
      const answerKey = quizAnswers[question.id];
      if (!answerKey) {
        return;
      }

      const point = convertAnswerToPoint(answerKey, question.isNegative);
      question.targets.forEach((target) => {
        rawScores[target.type] += point * target.weight;
      });
    });

    data.priorityTypes.forEach((typeId) => {
      rawScores[typeId] *= 1.15;
    });

    const timeFilter = getTimeFilter(profileAnswers.available_time);
    const pcFilter = getPcSkillFilter(profileAnswers.pc_skill);
    applyMultiplierMap(rawScores, timeFilter);
    applyMultiplierMap(rawScores, pcFilter);

    const maxPossible = getMaxPossibleScore(data);
    const normalizedScores = {};

    Object.keys(rawScores).forEach((typeId) => {
      const denominator = maxPossible[typeId] || 1;
      const percent = Math.round((rawScores[typeId] / denominator) * 100);
      normalizedScores[typeId] = Math.min(100, Math.max(0, percent));
      rawScores[typeId] = Math.round(rawScores[typeId] * 100) / 100;
    });

    const ranked = Object.entries(rawScores)
      .map(([type, score]) => ({ type, score, percent: normalizedScores[type] }))
      .sort((a, b) => b.score - a.score);

    return {
      mainType: ranked[0]?.type || null,
      subType: ranked[1]?.type || null,
      ranked,
      rawScores,
      normalizedScores,
      appliedFilters: {
        timeFilter,
        pcFilter
      }
    };
  }

  window.ScoringEngine = {
    convertAnswerToPoint,
    getTimeFilter,
    getPcSkillFilter,
    calculateScores,
    getMaxPossibleScore
  };
})();
