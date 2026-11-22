
(function () {
  "use strict";

  /* =========================================
     CUSTOM LESSON TIMER
     English / Arabic / French
     Automatic language detection
     Saves lesson plans in localStorage
     Custom confirmation popups
  ========================================= */

  const STORAGE_KEY = "studyManagerLessonTimerV1";
  const ROOT_ID = "studyManagerLessonTimer";

  const translations = {
    en: {
      title: "Lesson Timer",
      subtitle: "Organize your lesson, one stage at a time.",
      plan: "Lesson plan",
      newPlan: "New lesson",
      planName: "Lesson name",
      create: "Create",
      save: "Save changes",
      stages: "Lesson stages",
      addStage: "Add a stage",
      stageName: "Stage name",
      minutes: "Minutes",
      actions: "Actions",
      start: "Start lesson",
      pause: "Pause",
      resume: "Resume",
      reset: "Reset",
      previous: "Previous",
      next: "Next",
      finish: "Finish lesson",
      current: "Current stage",
      upcoming: "Upcoming stages",
      completed: "Completed",
      total: "Total lesson time",
      remaining: "Time remaining",
      stage: "Stage",
      of: "of",
      noStages: "No stages yet. Add your first lesson stage.",
      delete: "Delete",
      moveUp: "Move up",
      moveDown: "Move down",
      edit: "Edit",
      autoAdvance: "Automatically start the next stage",
      sound: "Play a sound when a stage ends",
      templates: "Saved lesson plans",
      choosePlan: "Choose a lesson plan",
      deletePlan: "Delete this lesson plan",
      confirmDeletePlan: "Delete this lesson plan?",
      confirmDeleteStage: "Delete this stage?",
      enterPlanName: "Please enter a lesson name.",
      enterStageName: "Please enter a stage name.",
      invalidDuration: "Please enter a duration greater than zero.",
      lessonComplete: "Lesson completed!",
      stageComplete: "Stage completed!",
      ready: "Ready to begin",
      running: "Timer running",
      paused: "Timer paused",
      notStarted: "Not started",
      noPlan: "Create a lesson plan to get started.",
      planCreated: "New lesson created.",
      allStages: "All stages",
      clear: "Clear",
      examplePlan: "Example lesson",
      reading: "Reading",
      explanation: "Explanation",
      exercises: "Exercises",
      correction: "Correction of exercises",
      minutesShort: "min",
      stageProgress: "Stage progress",
      deleteCurrent: "Delete stage",
      saveTemplate: "Your plans are saved automatically.",
      emptyPlans: "No saved lesson plans yet.",
      finished: "Finished",
      restart: "Restart lesson",
      confirmTitle: "Are you sure?",
      confirmDelete: "This action cannot be undone.",
      confirmDeleteStageText: "Are you sure you want to delete this stage? This action cannot be undone.",
      confirmDeletePlanText: "Are you sure you want to delete this lesson plan? All its stages will also be deleted.",
      confirmAction: "Yes, delete",
      cancel: "Keep it",
      close: "Close confirmation"
    },

    ar: {
      title: "مؤقت الدرس",
      subtitle: "نظّم درسك مرحلةً بعد مرحلة.",
      plan: "خطة الدرس",
      newPlan: "درس جديد",
      planName: "اسم الدرس",
      create: "إنشاء",
      save: "حفظ التغييرات",
      stages: "مراحل الدرس",
      addStage: "إضافة مرحلة",
      stageName: "اسم المرحلة",
      minutes: "الدقائق",
      actions: "الإجراءات",
      start: "بدء الدرس",
      pause: "إيقاف مؤقت",
      resume: "استئناف",
      reset: "إعادة ضبط",
      previous: "المرحلة السابقة",
      next: "المرحلة التالية",
      finish: "إنهاء الدرس",
      current: "المرحلة الحالية",
      upcoming: "المراحل القادمة",
      completed: "مكتملة",
      total: "المدة الإجمالية للدرس",
      remaining: "الوقت المتبقي",
      stage: "المرحلة",
      of: "من",
      noStages: "لا توجد مراحل بعد. أضف أول مرحلة لدرسك.",
      delete: "حذف",
      moveUp: "تحريك للأعلى",
      moveDown: "تحريك للأسفل",
      edit: "تعديل",
      autoAdvance: "الانتقال تلقائياً إلى المرحلة التالية",
      sound: "تشغيل صوت عند انتهاء المرحلة",
      templates: "خطط الدروس المحفوظة",
      choosePlan: "اختر خطة درس",
      deletePlan: "حذف خطة الدرس",
      confirmDeletePlan: "هل تريد حذف خطة الدرس هذه؟",
      confirmDeleteStage: "هل تريد حذف هذه المرحلة؟",
      enterPlanName: "يرجى إدخال اسم الدرس.",
      enterStageName: "يرجى إدخال اسم المرحلة.",
      invalidDuration: "يرجى إدخال مدة أكبر من صفر.",
      lessonComplete: "اكتمل الدرس!",
      stageComplete: "اكتملت المرحلة!",
      ready: "جاهز للبدء",
      running: "المؤقت يعمل",
      paused: "المؤقت متوقف مؤقتاً",
      notStarted: "لم يبدأ بعد",
      noPlan: "أنشئ خطة درس للبدء.",
      planCreated: "تم إنشاء درس جديد.",
      allStages: "جميع المراحل",
      clear: "مسح",
      examplePlan: "درس نموذجي",
      reading: "القراءة",
      explanation: "الشرح",
      exercises: "التمارين",
      correction: "تصحيح التمارين",
      minutesShort: "د",
      stageProgress: "تقدم المراحل",
      deleteCurrent: "حذف المرحلة",
      saveTemplate: "تُحفظ خططك تلقائياً.",
      emptyPlans: "لا توجد خطط دروس محفوظة بعد.",
      finished: "انتهى",
      restart: "إعادة بدء الدرس",
      confirmTitle: "هل أنت متأكد؟",
      confirmDelete: "لا يمكن التراجع عن هذا الإجراء.",
      confirmDeleteStageText: "هل تريد بالتأكيد حذف هذه المرحلة؟ لا يمكن التراجع عن هذا الإجراء.",
      confirmDeletePlanText: "هل تريد بالتأكيد حذف خطة الدرس هذه؟ سيتم حذف جميع مراحلها أيضاً.",
      confirmAction: "نعم، احذف",
      cancel: "إلغاء",
      close: "إغلاق نافذة التأكيد"
    },

    fr: {
      title: "Minuteur de cours",
      subtitle: "Organisez votre cours étape par étape.",
      plan: "Plan du cours",
      newPlan: "Nouveau cours",
      planName: "Nom du cours",
      create: "Créer",
      save: "Enregistrer les modifications",
      stages: "Étapes du cours",
      addStage: "Ajouter une étape",
      stageName: "Nom de l'étape",
      minutes: "Minutes",
      actions: "Actions",
      start: "Commencer le cours",
      pause: "Pause",
      resume: "Reprendre",
      reset: "Réinitialiser",
      previous: "Précédent",
      next: "Suivant",
      finish: "Terminer le cours",
      current: "Étape actuelle",
      upcoming: "Étapes suivantes",
      completed: "Terminées",
      total: "Durée totale du cours",
      remaining: "Temps restant",
      stage: "Étape",
      of: "sur",
      noStages: "Aucune étape. Ajoutez votre première étape.",
      delete: "Supprimer",
      moveUp: "Monter",
      moveDown: "Descendre",
      edit: "Modifier",
      autoAdvance: "Passer automatiquement à l'étape suivante",
      sound: "Jouer un son à la fin d'une étape",
      templates: "Plans de cours enregistrés",
      choosePlan: "Choisir un plan de cours",
      deletePlan: "Supprimer ce plan",
      confirmDeletePlan: "Supprimer ce plan de cours ?",
      confirmDeleteStage: "Supprimer cette étape ?",
      enterPlanName: "Veuillez saisir le nom du cours.",
      enterStageName: "Veuillez saisir le nom de l'étape.",
      invalidDuration: "Veuillez saisir une durée supérieure à zéro.",
      lessonComplete: "Cours terminé !",
      stageComplete: "Étape terminée !",
      ready: "Prêt à commencer",
      running: "Minuteur en marche",
      paused: "Minuteur en pause",
      notStarted: "Pas encore commencé",
      noPlan: "Créez un plan de cours pour commencer.",
      planCreated: "Nouveau cours créé.",
      allStages: "Toutes les étapes",
      clear: "Effacer",
      examplePlan: "Cours exemple",
      reading: "Lecture",
      explanation: "Explication",
      exercises: "Exercices",
      correction: "Correction des exercices",
      minutesShort: "min",
      stageProgress: "Progression des étapes",
      deleteCurrent: "Supprimer l'étape",
      saveTemplate: "Vos plans sont enregistrés automatiquement.",
      emptyPlans: "Aucun plan de cours enregistré.",
      finished: "Terminé",
      restart: "Recommencer le cours",
      confirmTitle: "Êtes-vous sûr ?",
      confirmDelete: "Cette action est irréversible.",
      confirmDeleteStageText: "Voulez-vous vraiment supprimer cette étape ? Cette action est irréversible.",
      confirmDeletePlanText: "Voulez-vous vraiment supprimer ce plan de cours ? Toutes ses étapes seront également supprimées.",
      confirmAction: "Oui, supprimer",
      cancel: "Annuler",
      close: "Fermer la confirmation"
    }
  };

  const state = {
    plans: [],
    activePlanId: null,
    currentStage: 0,
    remaining: 0,
    running: false,
    paused: false,
    finished: false,
    autoAdvance: false,
    sound: true,
    interval: null,
    language: "en"
  };

  let root = null;
  let lastLanguage = "";
  let languageObserver = null;
  let languageCheckInterval = null;

  // Confirmation popup state
  let confirmationAction = null;
  let lastFocusedElement = null;

  /* =========================================
     LANGUAGE DETECTION
  ========================================= */

  function normalizeLanguage(value) {
    if (!value) return null;

    value = String(value).trim().toLowerCase();

    if (
      value === "ar" ||
      value.startsWith("ar-") ||
      value.startsWith("arabic")
    ) return "ar";

    if (
      value === "fr" ||
      value.startsWith("fr-") ||
      value.startsWith("french")
    ) return "fr";

    if (
      value === "en" ||
      value.startsWith("en-") ||
      value.startsWith("english")
    ) return "en";

    return null;
  }

  function getLanguageFromElement(element) {
    if (!element) return null;

    const values = [
      element.value,
      element.getAttribute("data-language"),
      element.getAttribute("data-lang"),
      element.getAttribute("lang"),
      element.getAttribute("aria-label")
    ];

    for (const value of values) {
      const language = normalizeLanguage(value);
      if (language) return language;
    }

    return null;
  }

  function findLanguageSwitcher() {
    const selectors = [
      "#languageSwitcher",
      "#language-switcher",
      "#languageSelect",
      "#language-select",
      "#language",
      "#lang",
      "select[name='language']",
      "select[name='lang']",
      "[data-language-switcher]",
      "[data-lang-switcher]"
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);

      if (element && !root?.contains(element)) {
        const language = getLanguageFromElement(element);

        if (language) return language;
      }
    }

    const selects = document.querySelectorAll("select");

    for (const select of selects) {
      if (root?.contains(select)) continue;

      const identifier = (
        (select.id || "") + " " +
        (select.name || "") + " " +
        (select.className || "")
      ).toLowerCase();

      if (
        identifier.includes("language") ||
        identifier.includes("lang")
      ) {
        const language = getLanguageFromElement(select);

        if (language) return language;
      }
    }

    return null;
  }

  function detectLanguage() {
    const switcherLanguage = findLanguageSwitcher();

    if (switcherLanguage) return switcherLanguage;

    const globalValues = [
      window.currentLanguage,
      window.selectedLanguage,
      window.appLanguage,
      window.language,
      window.lang
    ];

    for (const value of globalValues) {
      const language = normalizeLanguage(value);

      if (language) return language;
    }

    const htmlLanguage = normalizeLanguage(
      document.documentElement.getAttribute("lang")
    );

    if (htmlLanguage) return htmlLanguage;

    const storageKeys = [
      "language",
      "lang",
      "selectedLanguage",
      "appLanguage",
      "studyManagerLanguage",
      "currentLanguage"
    ];

    for (const key of storageKeys) {
      try {
        const language = normalizeLanguage(
          localStorage.getItem(key)
        );

        if (language) return language;
      } catch (error) {}
    }

    return "en";
  }

  function t(key) {
    return translations[state.language][key] ||
      translations.en[key] ||
      key;
  }

  function refreshLanguage() {
    const newLanguage = detectLanguage();

    if (newLanguage === lastLanguage) return;

    lastLanguage = newLanguage;
    state.language = newLanguage;

    render();
  }

  function setupLanguageDetection() {
    document.addEventListener("change", function (event) {
      const element = event.target;

      if (!element || root?.contains(element)) return;

      const language = getLanguageFromElement(element);

      if (language) refreshLanguage();
    }, true);

    const eventNames = [
      "languageChanged",
      "languagechange",
      "appLanguageChanged",
      "language-changed",
      "languageChange",
      "changeLanguage"
    ];

    eventNames.forEach(eventName => {
      window.addEventListener(eventName, refreshLanguage);
      document.addEventListener(eventName, refreshLanguage);
    });

    if (window.MutationObserver) {
      languageObserver = new MutationObserver(refreshLanguage);

      languageObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang", "dir"],
        subtree: false
      });
    }

    window.addEventListener("storage", refreshLanguage);

    languageCheckInterval = setInterval(refreshLanguage, 500);
  }

  /* =========================================
     GENERAL HELPERS
  ========================================= */

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function getActivePlan() {
    return state.plans.find(
      plan => plan.id === state.activePlanId
    ) || null;
  }

  function getTotalSeconds(plan) {
    if (!plan) return 0;

    return plan.stages.reduce(
      (total, stage) => total + stage.minutes * 60,
      0
    );
  }

  function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds));

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(secs).padStart(2, "0")
      ].join(":");
    }

    return [
      String(minutes).padStart(2, "0"),
      String(secs).padStart(2, "0")
    ].join(":");
  }

  /* =========================================
     LOCAL STORAGE
  ========================================= */

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        plans: state.plans,
        activePlanId: state.activePlanId,
        autoAdvance: state.autoAdvance,
        sound: state.sound
      }));
    } catch (error) {
      console.warn("Lesson Timer: Could not save data.", error);
    }
  }

  function loadData() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
      );

      if (saved && Array.isArray(saved.plans)) {
        state.plans = saved.plans;
        state.activePlanId = saved.activePlanId;
        state.autoAdvance = Boolean(saved.autoAdvance);
        state.sound = saved.sound !== false;
      }
    } catch (error) {
      console.warn("Lesson Timer: Could not load saved data.", error);
    }

    state.plans = state.plans.filter(plan =>
      plan &&
      typeof plan.id === "string" &&
      Array.isArray(plan.stages)
    );

    state.plans.forEach(plan => {
      plan.stages = plan.stages.filter(stage => stage);

      plan.stages.forEach(stage => {
        stage.id = stage.id || (
          "stage_" + Math.random().toString(36).slice(2)
        );

        stage.name = String(stage.name || "");
        stage.minutes = Math.max(
          1,
          Math.min(1440, parseInt(stage.minutes, 10) || 1)
        );
      });

      plan.name = String(plan.name || "");
    });

    if (!getActivePlan()) {
      state.activePlanId = state.plans[0]?.id || null;
    }
  }

  function stopInterval() {
    if (state.interval) {
      clearInterval(state.interval);
      state.interval = null;
    }
  }

  function resetTimerState() {
    stopInterval();

    state.running = false;
    state.paused = false;
    state.finished = false;
    state.currentStage = 0;

    const plan = getActivePlan();

    state.remaining = plan?.stages[0]?.minutes * 60 || 0;
  }

  /* =========================================
     CUSTOM CONFIRMATION POPUP
  ========================================= */

  function showConfirmation(type, callback) {
    const modal = root.querySelector(".slt-confirm");
    if (!modal) return;

    // Prevent opening multiple confirmation dialogs.
    if (!modal.hidden) return;

    confirmationAction = callback;
    lastFocusedElement = document.activeElement;

    const title = modal.querySelector(".slt-confirm-title");
    const message = modal.querySelector(".slt-confirm-message");
    const confirmButton = modal.querySelector(".slt-confirm-yes");
    const cancelButton = modal.querySelector(".slt-confirm-no");

    title.textContent = t("confirmTitle");

    if (type === "delete-stage") {
      message.textContent = t("confirmDeleteStageText");
    } else {
      message.textContent = t("confirmDeletePlanText");
    }

    confirmButton.textContent = t("confirmAction");
    cancelButton.textContent = t("cancel");

    modal.hidden = false;

    document.addEventListener(
      "keydown",
      handleConfirmationKeydown
    );

    // Focus the safer option first.
    cancelButton.focus();
  }

  function closeConfirmation() {
    const modal = root?.querySelector(".slt-confirm");

    if (!modal || modal.hidden) return;

    modal.hidden = true;
    confirmationAction = null;

    document.removeEventListener(
      "keydown",
      handleConfirmationKeydown
    );

    const previousElement = lastFocusedElement;
    lastFocusedElement = null;

    if (
      previousElement &&
      previousElement.isConnected &&
      typeof previousElement.focus === "function"
    ) {
      previousElement.focus();
    }
  }

  function handleConfirmationKeydown(event) {
    const modal = root?.querySelector(".slt-confirm");

    if (!modal || modal.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeConfirmation();
      return;
    }

    if (event.key === "Tab") {
      const buttons = Array.from(
        modal.querySelectorAll("button:not(:disabled)")
      );

      if (!buttons.length) return;

      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function handleConfirmationBackdrop(event) {
    if (event.target.classList.contains("slt-confirm")) {
      closeConfirmation();
    }
  }

  function confirmPendingAction() {
    if (typeof confirmationAction !== "function") return;

    const callback = confirmationAction;

    closeConfirmation();
    callback();
  }

  /* =========================================
     SOUND
  ========================================= */

  function playSound() {
    if (!state.sound) return;

    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;

      gain.gain.setValueAtTime(0.001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.2,
        context.currentTime + 0.03
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.5
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);

      oscillator.onended = function () {
        context.close();
      };
    } catch (error) {
      console.warn("Lesson Timer: Sound unavailable.", error);
    }
  }

  /* =========================================
     LESSON MANAGEMENT
  ========================================= */

  function createPlan(name) {
    const plan = {
      id: "plan_" + Date.now() + "_" +
        Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      stages: []
    };

    state.plans.push(plan);
    state.activePlanId = plan.id;

    resetTimerState();
    saveData();
    render();
  }

  function addStage() {
    const plan = getActivePlan();
    if (!plan) return;

    plan.stages.push({
      id: "stage_" + Date.now() + "_" +
        Math.random().toString(36).slice(2, 6),
      name: "",
      minutes: 5
    });

    saveData();
    render();

    const inputs = root.querySelectorAll(".slt-stage-name");
    const lastInput = inputs[inputs.length - 1];

    if (lastInput) lastInput.focus();
  }

  function deleteStage(index) {
    const plan = getActivePlan();
    if (!plan || !plan.stages[index]) return;

    showConfirmation("delete-stage", function () {
      const wasCurrent = index === state.currentStage;

      plan.stages.splice(index, 1);

      if (plan.stages.length === 0) {
        resetTimerState();
      } else if (index < state.currentStage) {
        state.currentStage--;
      } else if (wasCurrent) {
        stopInterval();

        state.running = false;
        state.paused = false;
        state.finished = false;

        state.currentStage = Math.min(
          state.currentStage,
          plan.stages.length - 1
        );

        state.remaining =
          plan.stages[state.currentStage].minutes * 60;
      }

      saveData();
      render();
    });
  }

  function moveStage(index, direction) {
    const plan = getActivePlan();
    if (!plan) return;

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= plan.stages.length) return;

    [plan.stages[index], plan.stages[newIndex]] = [
      plan.stages[newIndex],
      plan.stages[index]
    ];

    if (state.currentStage === index) {
      state.currentStage = newIndex;
    } else if (state.currentStage === newIndex) {
      state.currentStage = index;
    }

    saveData();
    render();
  }

  function selectPlan(id) {
    if (!state.plans.some(plan => plan.id === id)) return;

    state.activePlanId = id;

    resetTimerState();
    saveData();
    render();
  }

  function deletePlan() {
    const plan = getActivePlan();
    if (!plan) return;

    showConfirmation("delete-plan", function () {
      stopInterval();

      state.plans = state.plans.filter(
        item => item.id !== plan.id
      );

      state.activePlanId = state.plans[0]?.id || null;

      resetTimerState();
      saveData();
      render();
    });
  }

  function updateStage(index, field, value) {
    const plan = getActivePlan();
    if (!plan || !plan.stages[index]) return;

    const stage = plan.stages[index];

    if (field === "name") {
      stage.name = value;
    }

    if (field === "minutes") {
      const minutes = Math.max(
        1,
        Math.min(1440, parseInt(value, 10) || 1)
      );

      stage.minutes = minutes;

      if (index === state.currentStage && !state.running) {
        state.remaining = minutes * 60;
      }
    }

    saveData();
    updateSummary();
  }

  function updatePlanName(value) {
    const plan = getActivePlan();
    if (!plan) return;

    plan.name = value;
    saveData();
    updateSummary();
  }

  /* =========================================
     TIMER CONTROLS
  ========================================= */

  function startTimer() {
    const plan = getActivePlan();

    if (!plan || !plan.stages.length) return;

    if (state.finished) {
      resetTimerState();
    }

    if (state.remaining <= 0) {
      state.remaining =
        plan.stages[state.currentStage]?.minutes * 60 || 0;
    }

    if (state.remaining <= 0) return;

    state.running = true;
    state.paused = false;

    stopInterval();

    state.interval = setInterval(tick, 1000);

    render();
  }

  function pauseTimer() {
    if (!state.running) return;

    stopInterval();

    state.running = false;
    state.paused = true;

    render();
  }

  function resetCurrentStage() {
    const plan = getActivePlan();

    if (!plan || !plan.stages[state.currentStage]) return;

    stopInterval();

    state.running = false;
    state.paused = false;
    state.finished = false;

    state.remaining =
      plan.stages[state.currentStage].minutes * 60;

    render();
  }

  function goToStage(index, shouldStart) {
    const plan = getActivePlan();

    if (!plan || !plan.stages.length) return;
    if (index < 0 || index >= plan.stages.length) return;

    stopInterval();

    state.currentStage = index;
    state.remaining = plan.stages[index].minutes * 60;
    state.running = false;
    state.paused = false;
    state.finished = false;

    render();

    if (shouldStart) startTimer();
  }

  function nextStage() {
    const plan = getActivePlan();
    if (!plan) return;

    if (state.currentStage < plan.stages.length - 1) {
      goToStage(
        state.currentStage + 1,
        state.running || state.paused
      );
    } else {
      finishLesson();
    }
  }

  function previousStage() {
    if (state.currentStage > 0) {
      goToStage(
        state.currentStage - 1,
        state.running || state.paused
      );
    }
  }

  function finishLesson() {
    stopInterval();

    state.running = false;
    state.paused = false;
    state.finished = true;
    state.remaining = 0;

    playSound();
    render();
  }

  function tick() {
    if (!state.running) return;

    state.remaining--;

    if (state.remaining <= 0) {
      state.remaining = 0;

      stopInterval();

      state.running = false;
      state.paused = false;

      playSound();

      const plan = getActivePlan();

      if (
        state.autoAdvance &&
        plan &&
        state.currentStage < plan.stages.length - 1
      ) {
        state.currentStage++;

        state.remaining =
          plan.stages[state.currentStage].minutes * 60;

        render();
        startTimer();
      } else if (
        plan &&
        state.currentStage === plan.stages.length - 1
      ) {
        finishLesson();
      } else {
        render();
      }

      return;
    }

    updateTimerDisplay();
  }

  /* =========================================
     UI UPDATES
  ========================================= */

  function updateTimerDisplay() {
    const timer = root.querySelector("[data-timer-display]");
    const status = root.querySelector("[data-timer-status]");
    const progress = root.querySelector("[data-timer-progress]");

    if (timer) {
      timer.textContent = formatTime(state.remaining);
    }

    if (status) {
      status.textContent = getTimerStatus();
    }

    if (progress) {
      const plan = getActivePlan();
      const stage = plan?.stages[state.currentStage];

      const total = stage ? stage.minutes * 60 : 0;

      const percentage = total
        ? ((total - state.remaining) / total) * 100
        : 0;

      progress.style.width =
        Math.max(0, Math.min(100, percentage)) + "%";
    }
  }

  function updateSummary() {
    const plan = getActivePlan();
    if (!plan) return;

    const nameInput = root.querySelector("[data-plan-name]");

    if (nameInput && document.activeElement !== nameInput) {
      nameInput.value = plan.name;
    }

    const total = root.querySelector("[data-total-time]");

    if (total) {
      total.textContent = formatTime(getTotalSeconds(plan));
    }

    const selector = root.querySelector("[data-plan-select]");

    if (selector) {
      selector.value = plan.id;
    }
  }

  function getTimerStatus() {
    if (state.finished) return t("lessonComplete");
    if (state.running) return t("running");
    if (state.paused) return t("paused");
    if (state.remaining > 0) return t("ready");

    return t("notStarted");
  }

  /* =========================================
     RENDERING
  ========================================= */

  function render() {
    if (!root) return;

    const plan = getActivePlan();
    const hasPlan = Boolean(plan);
    const stages = plan?.stages || [];
    const current = stages[state.currentStage];

    root.setAttribute("lang", state.language);

    root.setAttribute(
      "dir",
      state.language === "ar" ? "rtl" : "ltr"
    );

    const planOptions = state.plans.map(item => `
      <option value="${escapeHTML(item.id)}"
        ${item.id === state.activePlanId ? "selected" : ""}>
        ${escapeHTML(item.name || t("plan"))}
      </option>
    `).join("");

    const stageRows = stages.map((stage, index) => {
      const isCurrent = index === state.currentStage;
      const isCompleted = index < state.currentStage;

      return `
        <div class="slt-stage ${isCurrent ? "is-current" : ""} ${isCompleted ? "is-completed" : ""}">

          <div class="slt-stage-number">
            ${isCompleted ? "✓" : index + 1}
          </div>

          <div class="slt-stage-fields">

            <input
              class="slt-stage-name"
              type="text"
              maxlength="70"
              placeholder="${escapeHTML(t("stageName"))}"
              value="${escapeHTML(stage.name)}"
              data-stage-name="${index}"
              aria-label="${escapeHTML(t("stageName"))}"
            >

            <div class="slt-duration-field">
              <input
                type="number"
                min="1"
                max="1440"
                value="${stage.minutes}"
                data-stage-minutes="${index}"
                aria-label="${escapeHTML(t("minutes"))}"
              >
              <span>${escapeHTML(t("minutesShort"))}</span>
            </div>

          </div>

          <div class="slt-stage-actions">

            <button type="button"
              data-move-up="${index}"
              title="${escapeHTML(t("moveUp"))}"
              ${index === 0 ? "disabled" : ""}>↑</button>

            <button type="button"
              data-move-down="${index}"
              title="${escapeHTML(t("moveDown"))}"
              ${index === stages.length - 1 ? "disabled" : ""}>↓</button>

            <button type="button"
              class="slt-delete"
              data-delete-stage="${index}"
              title="${escapeHTML(t("delete"))}">×</button>

          </div>
        </div>
      `;
    }).join("");

    const completedCount =
      state.currentStage + (state.finished ? 1 : 0);

    const overallProgress = stages.length
      ? Math.min(100, (completedCount / stages.length) * 100)
      : 0;

    const currentStageProgress = current
      ? Math.max(0, Math.min(
          100,
          ((current.minutes * 60 - state.remaining) /
            (current.minutes * 60)) * 100
        ))
      : 0;

    root.innerHTML = `
      <style>
        #${ROOT_ID} {
          --slt-green: #176b4b;
          --slt-green-dark: #104c38;
          --slt-green-light: #e8f5ed;
          --slt-blue: #3478c7;
          --slt-orange: #e69a36;
          --slt-red: #d9534f;
          --slt-text: #24332d;
          --slt-muted: #718078;
          --slt-border: #e4ebe6;
          --slt-card: #ffffff;
          font-family: inherit;
          color: var(--slt-text);
          width: 100%;
          box-sizing: border-box;
        }

        #${ROOT_ID} *,
        #${ROOT_ID} *::before,
        #${ROOT_ID} *::after {
          box-sizing: border-box;
        }

        #${ROOT_ID} .slt-header {
          background: linear-gradient(130deg, #104c38, #21845a);
          color: white;
          padding: 24px;
          border-radius: 18px;
          margin-bottom: 18px;
          position: relative;
          overflow: hidden;
        }

        #${ROOT_ID} .slt-header::after {
          content: "⏱";
          position: absolute;
          font-size: 100px;
          opacity: .10;
          right: 18px;
          bottom: -22px;
          pointer-events: none;
        }

        #${ROOT_ID}[dir="rtl"] .slt-header::after {
          right: auto;
          left: 18px;
        }

        #${ROOT_ID} .slt-header h2 {
          margin: 0 0 7px;
          font-size: 24px;
          font-weight: 800;
        }

        #${ROOT_ID} .slt-header p {
          margin: 0;
          font-size: 14px;
          opacity: .88;
        }

        #${ROOT_ID} .slt-card {
          background: var(--slt-card);
          border: 1px solid var(--slt-border);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 16px;
          box-shadow: 0 4px 14px rgba(20, 55, 35, .045);
        }

        #${ROOT_ID} .slt-section-title {
          font-size: 17px;
          font-weight: 800;
          margin: 0 0 14px;
          color: var(--slt-green-dark);
        }

        #${ROOT_ID} .slt-muted {
          color: var(--slt-muted);
          font-size: 13px;
        }

        #${ROOT_ID} input,
        #${ROOT_ID} select {
          font: inherit;
          color: var(--slt-text);
          border: 1px solid var(--slt-border);
          background: #fff;
          border-radius: 9px;
          padding: 10px 11px;
          min-width: 0;
          outline: none;
        }

        #${ROOT_ID} input:focus,
        #${ROOT_ID} select:focus {
          border-color: var(--slt-green);
          box-shadow: 0 0 0 3px rgba(23, 107, 75, .10);
        }

        #${ROOT_ID} button {
          font: inherit;
          cursor: pointer;
          border: 0;
          border-radius: 9px;
          padding: 10px 14px;
          font-weight: 700;
          transition: .18s ease;
        }

        #${ROOT_ID} button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        #${ROOT_ID} .slt-primary {
          background: var(--slt-green);
          color: white;
        }

        #${ROOT_ID} .slt-primary:hover:not(:disabled) {
          background: var(--slt-green-dark);
        }

        #${ROOT_ID} .slt-secondary {
          background: #edf3ef;
          color: var(--slt-green-dark);
        }

        #${ROOT_ID} .slt-danger {
          background: #fff0ef;
          color: var(--slt-red);
        }

        #${ROOT_ID} .slt-plan-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 9px;
          margin-bottom: 12px;
        }

        #${ROOT_ID} .slt-plan-row select {
          width: 100%;
        }

        #${ROOT_ID} .slt-plan-name {
          width: 100%;
          margin-bottom: 12px;
          font-weight: 700;
        }

        #${ROOT_ID} .slt-new-plan {
          display: flex;
          gap: 8px;
        }

        #${ROOT_ID} .slt-new-plan input {
          flex: 1;
          width: 100%;
        }

        #${ROOT_ID} .slt-stage-list {
          display: grid;
          gap: 9px;
        }

        #${ROOT_ID} .slt-stage {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
          padding: 11px;
          border: 1px solid var(--slt-border);
          border-radius: 12px;
          background: #fff;
        }

        #${ROOT_ID} .slt-stage.is-current {
          border: 2px solid var(--slt-green);
          background: #f1faf4;
        }

        #${ROOT_ID} .slt-stage.is-completed {
          background: #f6faf7;
        }

        #${ROOT_ID} .slt-stage-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #edf3ef;
          color: var(--slt-green);
          font-weight: 800;
          font-size: 13px;
        }

        #${ROOT_ID} .slt-stage.is-current .slt-stage-number {
          background: var(--slt-green);
          color: white;
        }

        #${ROOT_ID} .slt-stage-fields {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 105px;
          gap: 8px;
          align-items: center;
        }

        #${ROOT_ID} .slt-stage-name {
          width: 100%;
        }

        #${ROOT_ID} .slt-duration-field {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--slt-muted);
          font-size: 12px;
        }

        #${ROOT_ID} .slt-duration-field input {
          width: 65px;
          text-align: center;
        }

        #${ROOT_ID} .slt-stage-actions {
          display: flex;
          gap: 4px;
        }

        #${ROOT_ID} .slt-stage-actions button {
          width: 30px;
          height: 30px;
          padding: 0;
          background: #f0f4f1;
          color: #50665a;
          font-size: 16px;
        }

        #${ROOT_ID} .slt-stage-actions .slt-delete {
          color: var(--slt-red);
          background: #fff0ef;
        }

        #${ROOT_ID} .slt-add-stage {
          width: 100%;
          margin-top: 12px;
          border: 1px dashed #83ae95;
          background: #f2f8f4;
          color: var(--slt-green);
        }

        #${ROOT_ID} .slt-timer-card {
          text-align: center;
          background: linear-gradient(150deg, #f7fbf8, #edf7f0);
          border: 1px solid #dcece1;
          padding: 22px 18px;
        }

        #${ROOT_ID} .slt-timer-label {
          color: var(--slt-green);
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .7px;
        }

        #${ROOT_ID} .slt-current-name {
          font-size: 21px;
          font-weight: 800;
          margin: 10px 0;
          overflow-wrap: anywhere;
        }

        #${ROOT_ID} .slt-time {
          font-size: clamp(48px, 12vw, 76px);
          font-weight: 900;
          letter-spacing: 2px;
          color: var(--slt-green-dark);
          line-height: 1.2;
          font-variant-numeric: tabular-nums;
          margin: 10px 0;
        }

        #${ROOT_ID} .slt-status {
          color: var(--slt-muted);
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        #${ROOT_ID} .slt-progress-track {
          width: 100%;
          height: 9px;
          border-radius: 20px;
          background: #dce9df;
          overflow: hidden;
          margin: 12px 0;
        }

        #${ROOT_ID} .slt-progress-fill {
          height: 100%;
          width: 0;
          border-radius: inherit;
          background: linear-gradient(90deg, #21845a, #66b783);
          transition: width .4s linear;
        }

        #${ROOT_ID} .slt-timer-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-top: 17px;
        }

        #${ROOT_ID} .slt-timer-buttons button {
          min-width: 105px;
        }

        #${ROOT_ID} .slt-navigation {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-top: 12px;
        }

        #${ROOT_ID} .slt-navigation button {
          flex: 1;
        }

        #${ROOT_ID} .slt-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 15px;
        }

        #${ROOT_ID} .slt-stat {
          background: white;
          border: 1px solid var(--slt-border);
          border-radius: 11px;
          padding: 12px;
          text-align: center;
        }

        #${ROOT_ID} .slt-stat strong {
          display: block;
          font-size: 20px;
          color: var(--slt-green-dark);
          margin-top: 4px;
        }

        #${ROOT_ID} .slt-settings {
          display: grid;
          gap: 12px;
        }

        #${ROOT_ID} .slt-check {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          color: var(--slt-text);
          cursor: pointer;
        }

        #${ROOT_ID} .slt-check input {
          width: 17px;
          height: 17px;
          accent-color: var(--slt-green);
        }

        #${ROOT_ID} .slt-empty {
          text-align: center;
          color: var(--slt-muted);
          background: #f7faf8;
          border-radius: 12px;
          padding: 22px 12px;
          font-size: 14px;
        }

        #${ROOT_ID} .slt-footer {
          text-align: center;
          padding: 8px;
          color: var(--slt-muted);
          font-size: 12px;
        }

        #${ROOT_ID} .slt-overall {
          margin-top: 15px;
        }

        #${ROOT_ID} .slt-overall-head {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 12px;
          color: var(--slt-muted);
          font-weight: 700;
        }

        /* =================================
           CUSTOM CONFIRMATION POPUP
        ================================= */

        #${ROOT_ID} .slt-confirm {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(13, 29, 21, .62);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: sltFadeIn .2s ease;
        }

        #${ROOT_ID} .slt-confirm[hidden] {
          display: none !important;
        }

        #${ROOT_ID} .slt-confirm-box {
          width: min(100%, 390px);
          padding: 27px 23px 22px;
          background: #fff;
          border: 1px solid rgba(255,255,255,.7);
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 22px 65px rgba(0,0,0,.24);
          animation: sltPopupIn .25s ease;
          outline: none;
        }

        #${ROOT_ID} .slt-confirm-icon {
          width: 62px;
          height: 62px;
          margin: 0 auto 15px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #fff0ef;
          color: #d9534f;
          font-size: 27px;
        }

        #${ROOT_ID} .slt-confirm-title {
          margin: 0 0 10px;
          color: #24332d;
          font-size: 21px;
          font-weight: 850;
        }

        #${ROOT_ID} .slt-confirm-message {
          margin: 0 auto 23px;
          max-width: 310px;
          color: #718078;
          font-size: 14px;
          line-height: 1.7;
        }

        #${ROOT_ID} .slt-confirm-actions {
          display: flex;
          gap: 10px;
        }

        #${ROOT_ID} .slt-confirm-actions button {
          flex: 1;
          min-height: 44px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 750;
        }

        #${ROOT_ID} .slt-confirm-yes {
          color: #fff;
          background: #d9534f;
        }

        #${ROOT_ID} .slt-confirm-yes:hover {
          background: #bd403c;
        }

        #${ROOT_ID} .slt-confirm-no {
          color: #176b4b;
          background: #edf4ef;
        }

        #${ROOT_ID} .slt-confirm-no:hover {
          background: #e0ece3;
        }

        #${ROOT_ID} .slt-confirm-actions button:focus-visible {
          outline: 3px solid rgba(23,107,75,.3);
          outline-offset: 3px;
        }

        @keyframes sltFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes sltPopupIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 520px) {
          #${ROOT_ID} .slt-header {
            padding: 19px;
          }

          #${ROOT_ID} .slt-card {
            padding: 14px;
          }

          #${ROOT_ID} .slt-stage {
            grid-template-columns: 30px minmax(0, 1fr);
          }

          #${ROOT_ID} .slt-stage-actions {
            grid-column: 2;
            justify-content: flex-end;
          }

          #${ROOT_ID} .slt-stage-fields {
            grid-template-columns: minmax(0, 1fr) 95px;
          }

          #${ROOT_ID} .slt-timer-buttons button {
            flex: 1 1 40%;
          }

          #${ROOT_ID} .slt-new-plan {
            flex-direction: column;
          }

          #${ROOT_ID} .slt-confirm-box {
            padding: 24px 18px 19px;
          }
        }

        @media (max-width: 360px) {
          #${ROOT_ID} .slt-confirm-actions {
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #${ROOT_ID} .slt-confirm,
          #${ROOT_ID} .slt-confirm-box {
            animation: none;
          }
        }
      </style>

      <header class="slt-header">
        <h2>⏱ ${t("title")}</h2>
        <p>${t("subtitle")}</p>
      </header>

      <section class="slt-card">
        <h3 class="slt-section-title">${t("plan")}</h3>

        ${
          state.plans.length
            ? `
              <div class="slt-plan-row">
                <select data-plan-select
                  aria-label="${escapeHTML(t("choosePlan"))}">
                  ${planOptions}
                </select>

                <button type="button"
                  class="slt-danger"
                  data-action="delete-plan"
                  title="${escapeHTML(t("deletePlan"))}">×</button>
              </div>
            `
            : `<p class="slt-muted">${t("emptyPlans")}</p>`
        }

        <div class="slt-new-plan">
          <input
            type="text"
            maxlength="70"
            data-new-plan-name
            placeholder="${escapeHTML(t("planName"))}"
          >

          <button type="button"
            class="slt-primary"
            data-action="create-plan">${t("create")}</button>
        </div>

        ${
          hasPlan
            ? `
              <p class="slt-muted" style="margin:12px 0 6px">
                ${t("saveTemplate")}
              </p>
            `
            : ""
        }
      </section>

      ${
        hasPlan
          ? `
            <section class="slt-card">
              <h3 class="slt-section-title">${t("stages")}</h3>

              <input
                class="slt-plan-name"
                type="text"
                maxlength="70"
                data-plan-name
                value="${escapeHTML(plan.name)}"
                placeholder="${escapeHTML(t("planName"))}"
                aria-label="${escapeHTML(t("planName"))}"
              >

              ${
                stages.length
                  ? `<div class="slt-stage-list">${stageRows}</div>`
                  : `<div class="slt-empty">${t("noStages")}</div>`
              }

              <button type="button"
                class="slt-add-stage"
                data-action="add-stage">
                + ${t("addStage")}
              </button>

              <div class="slt-stats">
                <div class="slt-stat">
                  <span class="slt-muted">${t("allStages")}</span>
                  <strong>${stages.length}</strong>
                </div>

                <div class="slt-stat">
                  <span class="slt-muted">${t("total")}</span>
                  <strong data-total-time>
                    ${formatTime(getTotalSeconds(plan))}
                  </strong>
                </div>
              </div>
            </section>

            <section class="slt-card slt-timer-card">
              <div class="slt-timer-label">${t("current")}</div>

              <div class="slt-current-name">
                ${
                  current
                    ? escapeHTML(
                        current.name ||
                        t("stage") + " " + (state.currentStage + 1)
                      )
                    : t("noStages")
                }
              </div>

              <div class="slt-time" data-timer-display>
                ${formatTime(state.remaining)}
              </div>

              <div class="slt-status" data-timer-status>
                ${getTimerStatus()}
              </div>

              <div class="slt-progress-track">
                <div class="slt-progress-fill"
                  data-timer-progress
                  style="width:${currentStageProgress}%"></div>
              </div>

              <div class="slt-muted">
                ${t("stage")} ${stages.length ? state.currentStage + 1 : 0}
                ${t("of")} ${stages.length}
              </div>

              <div class="slt-timer-buttons">
                ${
                  state.running
                    ? `<button type="button" class="slt-secondary" data-action="pause">${t("pause")}</button>`
                    : state.paused
                      ? `<button type="button" class="slt-primary" data-action="resume">${t("resume")}</button>`
                      : state.finished
                        ? `<button type="button" class="slt-primary" data-action="restart">${t("restart")}</button>`
                        : `<button type="button" class="slt-primary" data-action="start" ${!stages.length ? "disabled" : ""}>${t("start")}</button>`
                }

                <button type="button"
                  class="slt-secondary"
                  data-action="reset"
                  ${!current ? "disabled" : ""}>
                  ${t("reset")}
                </button>
              </div>

              <div class="slt-navigation">
                <button type="button"
                  class="slt-secondary"
                  data-action="previous"
                  ${state.currentStage === 0 || !stages.length ? "disabled" : ""}>
                  ← ${t("previous")}
                </button>

                <button type="button"
                  class="slt-secondary"
                  data-action="next"
                  ${!stages.length || state.finished ? "disabled" : ""}>
                  ${state.currentStage === stages.length - 1 ? t("finish") : t("next")} →
                </button>
              </div>

              <div class="slt-overall">
                <div class="slt-overall-head">
                  <span>${t("stageProgress")}</span>
                  <span>${Math.round(overallProgress)}%</span>
                </div>

                <div class="slt-progress-track">
                  <div class="slt-progress-fill"
                    style="width:${overallProgress}%"></div>
                </div>
              </div>
            </section>

            <section class="slt-card">
              <h3 class="slt-section-title">${t("actions")}</h3>

              <div class="slt-settings">
                <label class="slt-check">
                  <input type="checkbox"
                    data-setting="autoAdvance"
                    ${state.autoAdvance ? "checked" : ""}>
                  <span>${t("autoAdvance")}</span>
                </label>

                <label class="slt-check">
                  <input type="checkbox"
                    data-setting="sound"
                    ${state.sound ? "checked" : ""}>
                  <span>${t("sound")}</span>
                </label>
              </div>
            </section>
          `
          : `
            <section class="slt-card">
              <div class="slt-empty">
                <div style="font-size:38px;margin-bottom:10px">📚</div>
                ${t("noPlan")}
              </div>
            </section>
          `
      }

      <div class="slt-footer">
        ${t("title")} · Study Manager
      </div>

      <!-- Custom confirmation popup -->
      <div class="slt-confirm"
        hidden
        role="presentation"
        aria-label="${escapeHTML(t("close"))}">

        <div class="slt-confirm-box"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="sltConfirmTitle"
          aria-describedby="sltConfirmMessage"
          tabindex="-1">

          <div class="slt-confirm-icon" aria-hidden="true">
            🗑️
          </div>

          <h3 class="slt-confirm-title" id="sltConfirmTitle">
            ${t("confirmTitle")}
          </h3>

          <p class="slt-confirm-message" id="sltConfirmMessage">
            ${t("confirmDelete")}
          </p>

          <div class="slt-confirm-actions">
            <button type="button" class="slt-confirm-yes">
              ${t("confirmAction")}
            </button>

            <button type="button" class="slt-confirm-no">
              ${t("cancel")}
            </button>
          </div>

        </div>
      </div>
    `;
  }

  /* =========================================
     EVENT HANDLERS
  ========================================= */

  function handleClick(event) {
    const target = event.target;

    // Confirmation popup actions
    if (target.closest(".slt-confirm-yes")) {
      confirmPendingAction();
      return;
    }

    if (target.closest(".slt-confirm-no")) {
      closeConfirmation();
      return;
    }

    if (target.classList.contains("slt-confirm")) {
      handleConfirmationBackdrop(event);
      return;
    }

    const button = target.closest(
      "[data-action], [data-move-up], [data-move-down], [data-delete-stage]"
    );

    if (!button || !root.contains(button)) return;

    if (button.hasAttribute("data-move-up")) {
      moveStage(Number(button.dataset.moveUp), -1);
      return;
    }

    if (button.hasAttribute("data-move-down")) {
      moveStage(Number(button.dataset.moveDown), 1);
      return;
    }

    if (button.hasAttribute("data-delete-stage")) {
      deleteStage(Number(button.dataset.deleteStage));
      return;
    }

    switch (button.dataset.action) {
      case "create-plan": {
        const input = root.querySelector("[data-new-plan-name]");
        const name = input?.value.trim();

        if (!name) {
          input?.focus();
          return;
        }

        createPlan(name);
        break;
      }

      case "delete-plan":
        deletePlan();
        break;

      case "add-stage":
        addStage();
        break;

      case "start":
      case "resume":
        startTimer();
        break;

      case "pause":
        pauseTimer();
        break;

      case "reset":
        resetCurrentStage();
        break;

      case "previous":
        previousStage();
        break;

      case "next":
        nextStage();
        break;

      case "restart":
        resetTimerState();
        startTimer();
        break;
    }
  }

  function handleChange(event) {
    const target = event.target;

    if (target.matches("[data-plan-select]")) {
      selectPlan(target.value);
      return;
    }

    if (target.matches("[data-plan-name]")) {
      updatePlanName(target.value);
      return;
    }

    if (target.matches("[data-stage-name]")) {
      updateStage(
        Number(target.dataset.stageName),
        "name",
        target.value
      );
      return;
    }

    if (target.matches("[data-stage-minutes]")) {
      const index = Number(target.dataset.stageMinutes);
      const value = parseInt(target.value, 10);

      if (!Number.isFinite(value) || value < 1) {
        target.value = "1";
      }

      updateStage(index, "minutes", target.value);

      target.value = String(
        getActivePlan()?.stages[index]?.minutes || 1
      );

      return;
    }

    if (target.matches("[data-setting]")) {
      const setting = target.dataset.setting;

      if (setting === "autoAdvance") {
        state.autoAdvance = target.checked;
      }

      if (setting === "sound") {
        state.sound = target.checked;
      }

      saveData();
    }
  }

  function handleInput(event) {
    const target = event.target;

    if (target.matches("[data-plan-name]")) {
      updatePlanName(target.value);
    }

    if (target.matches("[data-stage-name]")) {
      updateStage(
        Number(target.dataset.stageName),
        "name",
        target.value
      );
    }
  }

  function handleKeydown(event) {
    if (
      event.key === "Enter" &&
      event.target.matches("[data-new-plan-name]")
    ) {
      event.preventDefault();

      root.querySelector(
        '[data-action="create-plan"]'
      )?.click();
    }
  }

  /* =========================================
     INITIALIZATION
  ========================================= */

  function init() {
    if (document.getElementById(ROOT_ID)) return;

    const container =
      document.getElementById("studyManagerFeatures") ||
      document.body;

    root = document.createElement("div");
    root.id = ROOT_ID;

    container.appendChild(root);

    state.language = detectLanguage();
    lastLanguage = state.language;

    loadData();

    const plan = getActivePlan();

    if (plan && plan.stages.length) {
      state.remaining = plan.stages[0].minutes * 60;
    }

    root.addEventListener("click", handleClick);
    root.addEventListener("change", handleChange);
    root.addEventListener("input", handleInput);
    root.addEventListener("keydown", handleKeydown);

    render();

    setupLanguageDetection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

