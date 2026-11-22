/* ==========================================
   STUDY MANAGER
   FEATURE: RECENTLY OPENED LESSONS
========================================== */

(function () {
    "use strict";

    // ======================================
    // 1. SETTINGS
    // ======================================

    const STORAGE_KEY = "studyManagerRecentLessons";
    const MAX_RECENT = 8;

    const translations = {

        en: {
            title: "Recently Opened Lessons",
            subtitle: "Quickly return to your previous lessons.",
            empty: "No recently opened lessons yet.",
            clear: "Clear History",
            subject: "Subject",
            opened: "Opened",
            confirm: "Clear your recently opened lessons?",
            missing: "This lesson is no longer available.",
            clearTitle: "Clear Recent History?",
            missingTitle: "Lesson Unavailable",
            cancel: "Cancel",
            ok: "OK",
            confirmClear: "Clear"
        },

        ar: {
            title: "الدروس المفتوحة مؤخراً",
            subtitle: "ارجع بسهولة إلى دروسك السابقة.",
            empty: "لا توجد دروس مفتوحة مؤخراً.",
            clear: "مسح السجل",
            subject: "المادة",
            opened: "آخر فتح",
            confirm: "هل تريد مسح سجل الدروس المفتوحة مؤخراً؟",
            missing: "هذا الدرس لم يعد متوفراً.",
            clearTitle: "مسح سجل الدروس؟",
            missingTitle: "الدرس غير متوفر",
            cancel: "إلغاء",
            ok: "حسناً",
            confirmClear: "مسح السجل"
        },

        fr: {
            title: "Leçons récemment ouvertes",
            subtitle: "Retrouvez rapidement vos leçons précédentes.",
            empty: "Aucune leçon récemment ouverte.",
            clear: "Effacer l'historique",
            subject: "Matière",
            opened: "Ouvert",
            confirm: "Effacer l'historique des leçons récentes ?",
            missing: "Cette leçon n'est plus disponible.",
            clearTitle: "Effacer l'historique ?",
            missingTitle: "Leçon indisponible",
            cancel: "Annuler",
            ok: "OK",
            confirmClear: "Effacer"
        }

    };


    // ======================================
    // 2. STATE
    // ======================================

    let lastFocusedElement = null;
    let dialogCallback = null;


    // ======================================
    // 3. LANGUAGE
    // ======================================

    function getLanguage() {

        const language =
            document.documentElement.lang ||
            localStorage.getItem("studyManagerLanguage") ||
            "en";

        return translations[language]
            ? language
            : "en";

    }

    function t(key) {
        return translations[getLanguage()][key];
    }


    // ======================================
    // 4. LOAD RECENT HISTORY
    // ======================================

    function getRecentLessons() {

        try {

            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            return Array.isArray(saved) ? saved : [];

        } catch (error) {

            return [];

        }

    }

    function saveRecentLessons(items) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(items)
            );

        } catch (error) {

            console.error(
                "Unable to save recent lessons:",
                error
            );

        }

    }


    // ======================================
    // 5. CREATE FEATURE INTERFACE
    // ======================================

    const panel = document.createElement("section");

    panel.id = "recentLessonsPanel";
    panel.className = "recent-lessons-panel";

    panel.innerHTML = `
        <div class="recent-header">
            <div class="recent-heading-group">
                <h2 id="recentHeading"></h2>
                <p id="recentSubtitle"></p>
            </div>

            <button
                type="button"
                id="clearRecentLessons"
                class="recent-clear-button">
            </button>
        </div>

        <div id="recentLessonsList"></div>

        <div
            class="recent-dialog-overlay"
            hidden
        >
            <div
                class="recent-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="recentDialogTitle"
                aria-describedby="recentDialogMessage"
                tabindex="-1"
            >

                <div
                    class="recent-dialog-icon"
                    aria-hidden="true"
                >
                    <span class="recent-dialog-icon-symbol">🗑️</span>
                </div>

                <h3
                    class="recent-dialog-title"
                    id="recentDialogTitle">
                </h3>

                <p
                    class="recent-dialog-message"
                    id="recentDialogMessage">
                </p>

                <div class="recent-dialog-actions">

                    <button
                        type="button"
                        class="recent-dialog-confirm">
                    </button>

                    <button
                        type="button"
                        class="recent-dialog-cancel">
                    </button>

                </div>

            </div>
        </div>
    `;


    // ======================================
    // 6. FEATURE STYLES
    // ======================================

    const style = document.createElement("style");

    style.textContent = `

        /* Main Panel */

        .recent-lessons-panel {
            width: 100%;
            box-sizing: border-box;
            background: var(--surface, #ffffff);
            border: 1px solid var(--border, #e4ece7);
            border-radius: 16px;
            padding: 20px;
            margin: 22px 0;
            box-shadow: var(--shadow, 0 8px 25px rgba(24,65,47,.07));
        }


        /* Header */

        .recent-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 16px;
        }

        .recent-heading-group {
            min-width: 0;
            flex: 1;
        }

        .recent-header h2 {
            margin: 0 0 6px;
            color: var(--text, #24372f);
            font-size: 19px;
            font-weight: 800;
            line-height: 1.4;
        }

        .recent-header p {
            margin: 0;
            color: var(--muted, #7b8b83);
            font-size: 13px;
            line-height: 1.6;
        }


        /* Clear Button */

        .recent-clear-button {
            border: none;
            border-radius: 9px;
            padding: 10px 14px;
            background: var(--primary-light, #e7f4ed);
            color: var(--primary, #176b50);
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            transition: .2s ease;
            flex-shrink: 0;
        }

        .recent-clear-button:hover {
            opacity: .85;
            transform: translateY(-1px);
        }

        .recent-clear-button:active {
            transform: scale(.97);
        }


        /* Lesson Items */

        .recent-lesson-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 14px;
            margin-top: 9px;
            border: 1px solid var(--border, #e4ece7);
            border-radius: 12px;
            cursor: pointer;
            transition: .2s ease;
            background: var(--surface, #ffffff);
        }

        .recent-lesson-item:hover {
            border-color: var(--primary, #176b50);
            background: var(--primary-light, #e7f4ed);
            transform: translateY(-2px);
        }

        .recent-lesson-item:focus-visible {
            outline: 3px solid var(--primary, #176b50);
            outline-offset: 3px;
        }

        .recent-lesson-info {
            min-width: 0;
            flex: 1;
        }

        .recent-lesson-name {
            display: block;
            color: var(--text, #24372f);
            font-weight: 800;
            overflow-wrap: anywhere;
            margin-bottom: 6px;
            line-height: 1.5;
        }

        .recent-lesson-subject,
        .recent-lesson-time {
            display: block;
            color: var(--muted, #7b8b83);
            font-size: 12px;
            margin-top: 4px;
            line-height: 1.5;
        }

        .recent-lesson-icon {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 11px;
            background: var(--primary-light, #e7f4ed);
            font-size: 21px;
        }


        /* Empty State */

        .recent-empty {
            text-align: center;
            padding: 28px 12px;
            color: var(--muted, #7b8b83);
            font-size: 14px;
            line-height: 1.7;
            background: var(--background, #f8faf9);
            border: 1px dashed var(--border, #e4ece7);
            border-radius: 12px;
        }


        /* RTL Support */

        html[dir="rtl"] .recent-header {
            direction: rtl;
        }

        html[dir="rtl"] .recent-lesson-item {
            direction: rtl;
            text-align: right;
        }

        html[dir="rtl"] .recent-dialog {
            direction: rtl;
        }


        /* Dialog Overlay */

        .recent-dialog-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            box-sizing: border-box;
            background: rgba(15, 30, 23, .62);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            animation: recentFadeIn .18s ease-out;
        }

        .recent-dialog-overlay[hidden] {
            display: none !important;
        }


        /* Dialog Card */

        .recent-dialog {
            width: min(100%, 390px);
            box-sizing: border-box;
            padding: 25px 22px 21px;
            border: 1px solid var(--border, #e4ece7);
            border-radius: 19px;
            background: var(--surface, #ffffff);
            color: var(--text, #24372f);
            box-shadow: 0 22px 65px rgba(0,0,0,.25);
            text-align: center;
            animation: recentPopIn .2s ease-out;
        }

        .recent-dialog:focus {
            outline: none;
        }


        /* Dialog Icon */

        .recent-dialog-icon {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 14px;
            border-radius: 50%;
            background: rgba(217, 75, 75, .12);
        }

        .recent-dialog-icon-symbol {
            font-size: 26px;
        }


        /* Dialog Text */

        .recent-dialog-title {
            margin: 0 0 9px;
            color: var(--text, #24372f);
            font-size: 18px;
            font-weight: 800;
            line-height: 1.5;
        }

        .recent-dialog-message {
            margin: 0;
            color: var(--muted, #7b8b83);
            font-size: 13px;
            line-height: 1.8;
            overflow-wrap: anywhere;
        }


        /* Dialog Actions */

        .recent-dialog-actions {
            display: flex;
            gap: 10px;
            margin-top: 23px;
        }

        .recent-dialog-actions button {
            flex: 1;
            min-height: 44px;
            border: none;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            transition: .2s ease;
        }

        .recent-dialog-actions button:hover {
            opacity: .86;
            transform: translateY(-1px);
        }

        .recent-dialog-actions button:active {
            transform: scale(.97);
        }

        .recent-dialog-actions button:focus-visible {
            outline: 3px solid var(--primary, #176b50);
            outline-offset: 3px;
        }

        .recent-dialog-confirm {
            background: #d94b4b;
            color: #ffffff;
        }

        .recent-dialog-cancel {
            background: #e7ece9;
            color: #24372f;
        }


        /* Animations */

        @keyframes recentFadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        @keyframes recentPopIn {
            from {
                opacity: 0;
                transform: translateY(9px) scale(.97);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }


        /* Mobile */

        @media (max-width: 500px) {

            .recent-lessons-panel {
                padding: 14px;
                border-radius: 13px;
            }

            .recent-header {
                align-items: flex-start;
            }

            .recent-header h2 {
                font-size: 17px;
            }

            .recent-clear-button {
                padding: 9px 11px;
                font-size: 11px;
            }

            .recent-lesson-item {
                padding: 12px;
            }

            .recent-dialog {
                padding: 22px 17px 18px;
            }

            .recent-dialog-actions {
                flex-direction: column-reverse;
            }

            .recent-dialog-actions button {
                width: 100%;
            }

        }


        /* Reduced Motion */

        @media (prefers-reduced-motion: reduce) {

            .recent-dialog-overlay,
            .recent-dialog,
            .recent-lesson-item,
            .recent-clear-button,
            .recent-dialog-actions button {
                animation: none !important;
                transition: none !important;
            }

        }

    `;

    document.head.appendChild(style);


    // ======================================
    // 7. INSERT INTO FEATURES AREA
    // ======================================

    function insertPanel() {

        const featureContainer =
            document.getElementById("studyManagerFeatures");

        if (featureContainer) {

            if (panel.parentElement !== featureContainer) {
                featureContainer.appendChild(panel);
            }

            return true;

        }

        // Safe fallback if the dedicated container is unavailable.
        if (!panel.isConnected) {
            document.body.appendChild(panel);
        }

        return panel.isConnected;

    }


    // ======================================
    // 8. CUSTOM DIALOG
    // ======================================

    function showDialog(options) {

        const overlay = panel.querySelector(
            ".recent-dialog-overlay"
        );

        const dialog = panel.querySelector(
            ".recent-dialog"
        );

        const icon = panel.querySelector(
            ".recent-dialog-icon-symbol"
        );

        const confirmButton = panel.querySelector(
            ".recent-dialog-confirm"
        );

        const cancelButton = panel.querySelector(
            ".recent-dialog-cancel"
        );

        lastFocusedElement = document.activeElement;
        dialogCallback = options.onConfirm || null;

        panel.querySelector("#recentDialogTitle").textContent =
            options.title;

        panel.querySelector("#recentDialogMessage").textContent =
            options.message;

        confirmButton.textContent = options.confirmText;
        cancelButton.textContent = options.cancelText || "";

        icon.textContent = options.icon || "⚠️";

        confirmButton.style.background =
            options.danger === false
                ? "var(--primary, #176b50)"
                : "#d94b4b";

        cancelButton.hidden = !options.showCancel;

        overlay.hidden = false;

        document.addEventListener(
            "keydown",
            handleDialogKeydown
        );

        if (options.showCancel) {
            cancelButton.focus();
        } else {
            confirmButton.focus();
        }

        dialog.focus({ preventScroll: true });

        // Move focus to the appropriate action button.
        if (options.showCancel) {
            cancelButton.focus();
        } else {
            confirmButton.focus();
        }

    }


    // ======================================
    // 9. CLOSE CUSTOM DIALOG
    // ======================================

    function closeDialog(restoreFocus = true) {

        const overlay = panel.querySelector(
            ".recent-dialog-overlay"
        );

        overlay.hidden = true;

        dialogCallback = null;

        document.removeEventListener(
            "keydown",
            handleDialogKeydown
        );

        if (
            restoreFocus &&
            lastFocusedElement &&
            lastFocusedElement.isConnected
        ) {
            lastFocusedElement.focus();
        }

        lastFocusedElement = null;

    }


    // ======================================
    // 10. DIALOG KEYBOARD ACCESSIBILITY
    // ======================================

    function handleDialogKeydown(event) {

        const overlay = panel.querySelector(
            ".recent-dialog-overlay"
        );

        if (overlay.hidden) return;

        if (event.key === "Escape") {

            event.preventDefault();
            closeDialog();

            return;

        }

        if (event.key === "Tab") {

            const buttons = Array.from(
                overlay.querySelectorAll(
                    "button:not(:disabled):not([hidden])"
                )
            );

            if (!buttons.length) return;

            const first = buttons[0];
            const last = buttons[buttons.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {

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


    // ======================================
    // 11. FORMAT DATE AND TIME
    // ======================================

    function formatDate(timestamp) {

        const locale = {
            en: "en-US",
            ar: "ar",
            fr: "fr-FR"
        }[getLanguage()];

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);

    }


    // ======================================
    // 12. OPEN A RECENT LESSON
    // ======================================

    function openRecentLesson(lesson) {

        const subjectIndex = subjects.findIndex(
            function (subject) {

                return subject.name === lesson.subjectName;

            }
        );

        if (subjectIndex === -1) {

            showDialog({

                title: t("missingTitle"),
                message: t("missing"),
                confirmText: t("ok"),
                cancelText: "",
                icon: "📚",
                showCancel: false,
                danger: false

            });

            return;

        }

        const subjectData = subjects[subjectIndex];

        let lessonIndex = subjectData.lessons.findIndex(
            function (savedLesson) {

                return (
                    savedLesson.title === lesson.title &&
                    savedLesson.content === lesson.content
                );

            }
        );

        // Fallback if the lesson content has been edited.
        if (lessonIndex === -1) {

            lessonIndex = subjectData.lessons.findIndex(
                function (savedLesson) {

                    return savedLesson.title === lesson.title;

                }
            );

        }

        if (lessonIndex === -1) {

            showDialog({

                title: t("missingTitle"),
                message: t("missing"),
                confirmText: t("ok"),
                cancelText: "",
                icon: "📚",
                showCancel: false,
                danger: false

            });

            return;

        }

        openSubject(subjectIndex);
        openLesson(lessonIndex);

    }


    // ======================================
    // 13. DISPLAY RECENT LESSONS
    // ======================================

    function renderRecentLessons() {

        if (!insertPanel()) return;

        const list = panel.querySelector(
            "#recentLessonsList"
        );

        panel.querySelector("#recentHeading").textContent =
            t("title");

        panel.querySelector("#recentSubtitle").textContent =
            t("subtitle");

        panel.querySelector("#clearRecentLessons").textContent =
            t("clear");

        list.innerHTML = "";

        const recentLessons = getRecentLessons();

        if (recentLessons.length === 0) {

            const empty = document.createElement("div");

            empty.className = "recent-empty";
            empty.textContent = t("empty");

            list.appendChild(empty);

            return;

        }

        recentLessons.forEach(function (lesson) {

            const item = document.createElement("div");

            item.className = "recent-lesson-item";
            item.tabIndex = 0;
            item.setAttribute("role", "button");
            item.setAttribute("aria-label", lesson.title);
            item.dir = "auto";

            const info = document.createElement("div");

            info.className = "recent-lesson-info";

            const name = document.createElement("span");

            name.className = "recent-lesson-name";
            name.textContent = lesson.title || "";
            name.dir = "auto";

            const subject = document.createElement("span");

            subject.className = "recent-lesson-subject";
            subject.textContent =
                t("subject") + ": " + (lesson.subjectName || "");

            const time = document.createElement("span");

            time.className = "recent-lesson-time";
            time.textContent =
                t("opened") + ": " +
                formatDate(lesson.openedAt);

            const icon = document.createElement("span");

            icon.className = "recent-lesson-icon";
            icon.textContent = "📖";
            icon.setAttribute("aria-hidden", "true");

            info.appendChild(name);
            info.appendChild(subject);
            info.appendChild(time);

            item.appendChild(info);
            item.appendChild(icon);

            item.addEventListener("click", function () {

                openRecentLesson(lesson);

            });

            item.addEventListener("keydown", function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();
                    openRecentLesson(lesson);

                }

            });

            list.appendChild(item);

        });

    }


    // ======================================
    // 14. SAVE OPENED LESSON
    // ======================================

    const originalOpenLesson = openLesson;

    openLesson = function (index) {

        const subject = subjects[selectedSubject];

        if (!subject || !subject.lessons[index]) {
            return originalOpenLesson(index);
        }

        const lesson = subject.lessons[index];

        const recent = getRecentLessons();

        const newEntry = {

            subjectName: subject.name,
            title: lesson.title,
            content: lesson.content,
            openedAt: Date.now()

        };

        // Remove an older entry for the same lesson.
        const filtered = recent.filter(function (item) {

            return !(
                item.subjectName === newEntry.subjectName &&
                item.title === newEntry.title &&
                item.content === newEntry.content
            );

        });

        filtered.unshift(newEntry);

        saveRecentLessons(
            filtered.slice(0, MAX_RECENT)
        );

        // Open the lesson normally.
        originalOpenLesson(index);

        renderRecentLessons();

    };


    // ======================================
    // 15. CLEAR HISTORY CONFIRMATION
    // ======================================

    function askClearHistory() {

        const recentLessons = getRecentLessons();

        if (recentLessons.length === 0) {
            return;
        }

        showDialog({

            title: t("clearTitle"),
            message: t("confirm"),
            confirmText: t("confirmClear"),
            cancelText: t("cancel"),
            icon: "🗑️",
            showCancel: true,
            danger: true,

            onConfirm: function () {

                saveRecentLessons([]);

                closeDialog(false);

                renderRecentLessons();

            }

        });

    }


    // ======================================
    // 16. CONNECT EVENTS
    // ======================================

    function connectEvents() {

        const clearButton = panel.querySelector(
            "#clearRecentLessons"
        );

        const overlay = panel.querySelector(
            ".recent-dialog-overlay"
        );

        const confirmButton = panel.querySelector(
            ".recent-dialog-confirm"
        );

        const cancelButton = panel.querySelector(
            ".recent-dialog-cancel"
        );

        // Clear history.
        clearButton.addEventListener("click", function () {

            askClearHistory();

        });

        // Confirm dialog action.
        confirmButton.addEventListener("click", function () {

            const callback = dialogCallback;

            if (callback) {
                callback();
            } else {
                closeDialog();
            }

        });

        // Cancel dialog.
        cancelButton.addEventListener("click", function () {

            closeDialog();

        });

        // Close dialog when clicking outside the card.
        overlay.addEventListener("click", function (event) {

            if (event.target === event.currentTarget) {
                closeDialog();
            }

        });

    }

    connectEvents();


    // ======================================
    // 17. LANGUAGE UPDATES
    // ======================================

    const languageObserver = new MutationObserver(function () {

        renderRecentLessons();

    });

    languageObserver.observe(document.documentElement, {

        attributes: true,
        attributeFilter: ["lang", "dir"]

    });


    // ======================================
    // 18. START FEATURE
    // ======================================

    renderRecentLessons();

})();
