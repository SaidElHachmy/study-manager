
/* =====================================================
   STUDY MANAGER - EXAM COUNTDOWN
   Independent feature: features/exam-countdown.js
===================================================== */

(function () {
    "use strict";

    const STORAGE_KEY = "studyManagerExams";
    const PANEL_ID = "examCountdownPanel";

    const translations = {
        en: {
            title: "Exam Countdown",
            subtitle: "Stay prepared. Every second brings your exam closer.",
            add: "+ Add Exam",
            search: "Search exams...",
            empty: "No exams yet. Add your first exam!",
            noResults: "No exams match your search.",
            upcoming: "Upcoming Exams",
            past: "Past Exams",
            examTitle: "Exam Title",
            subject: "Subject",
            dateTime: "Exam Date & Time",
            titlePlaceholder: "e.g. Mathematics Final Exam",
            subjectPlaceholder: "e.g. Mathematics",
            save: "Save Exam",
            update: "Save Changes",
            cancel: "Cancel",
            edit: "Edit",
            remove: "Delete",
            days: "Days",
            hours: "Hours",
            minutes: "Minutes",
            seconds: "Seconds",
            remaining: "Time Remaining",
            passed: "Exam time has passed",
            started: "Exam time has arrived!",
            deleteTitle: "Delete this exam?",
            deleteText: "This exam will be permanently removed.",
            confirmDelete: "Yes, Delete",
            keep: "Keep Exam",
            required: "Please complete all fields.",
            invalidDate: "Please choose a valid future date and time.",
            subjectOptional: "Optional",
            today: "Today",
            tomorrow: "Tomorrow",
            dateLabel: "Scheduled for",
            updated: "Updated",
            pinned: "Next exam"
        },
        ar: {
            title: "العد التنازلي للامتحانات",
            subtitle: "استعد جيدًا، فكل ثانية تقربك من موعد امتحانك.",
            add: "+ إضافة امتحان",
            search: "ابحث عن امتحان...",
            empty: "لا توجد امتحانات بعد. أضف امتحانك الأول!",
            noResults: "لا توجد امتحانات تطابق بحثك.",
            upcoming: "الامتحانات القادمة",
            past: "الامتحانات السابقة",
            examTitle: "عنوان الامتحان",
            subject: "المادة",
            dateTime: "تاريخ ووقت الامتحان",
            titlePlaceholder: "مثال: امتحان الرياضيات النهائي",
            subjectPlaceholder: "مثال: الرياضيات",
            save: "حفظ الامتحان",
            update: "حفظ التعديلات",
            cancel: "إلغاء",
            edit: "تعديل",
            remove: "حذف",
            days: "يوم",
            hours: "ساعة",
            minutes: "دقيقة",
            seconds: "ثانية",
            remaining: "الوقت المتبقي",
            passed: "انتهى موعد الامتحان",
            started: "حان موعد الامتحان!",
            deleteTitle: "هل تريد حذف هذا الامتحان؟",
            deleteText: "سيتم حذف هذا الامتحان نهائيًا.",
            confirmDelete: "نعم، احذف",
            keep: "الاحتفاظ بالامتحان",
            required: "يرجى ملء جميع الحقول المطلوبة.",
            invalidDate: "يرجى اختيار تاريخ ووقت صحيحين في المستقبل.",
            subjectOptional: "اختياري",
            today: "اليوم",
            tomorrow: "غدًا",
            dateLabel: "موعد الامتحان",
            updated: "آخر تعديل",
            pinned: "الامتحان القادم"
        },
        fr: {
            title: "Compte à rebours des examens",
            subtitle: "Préparez-vous : chaque seconde vous rapproche de votre examen.",
            add: "+ Ajouter un examen",
            search: "Rechercher un examen...",
            empty: "Aucun examen. Ajoutez votre premier examen !",
            noResults: "Aucun examen ne correspond à votre recherche.",
            upcoming: "Examens à venir",
            past: "Examens passés",
            examTitle: "Nom de l'examen",
            subject: "Matière",
            dateTime: "Date et heure de l'examen",
            titlePlaceholder: "Ex. : Examen final de mathématiques",
            subjectPlaceholder: "Ex. : Mathématiques",
            save: "Enregistrer l'examen",
            update: "Enregistrer les modifications",
            cancel: "Annuler",
            edit: "Modifier",
            remove: "Supprimer",
            days: "Jours",
            hours: "Heures",
            minutes: "Minutes",
            seconds: "Secondes",
            remaining: "Temps restant",
            passed: "L'heure de l'examen est passée",
            started: "L'heure de l'examen est arrivée !",
            deleteTitle: "Supprimer cet examen ?",
            deleteText: "Cet examen sera définitivement supprimé.",
            confirmDelete: "Oui, supprimer",
            keep: "Conserver",
            required: "Veuillez remplir tous les champs obligatoires.",
            invalidDate: "Veuillez choisir une date et une heure futures valides.",
            subjectOptional: "Facultatif",
            today: "Aujourd'hui",
            tomorrow: "Demain",
            dateLabel: "Prévu pour",
            updated: "Modifié",
            pinned: "Prochain examen"
        }
    };

    let exams = loadExams();
    let editingId = null;
    let deletingId = null;
    let panel = null;
    let currentLanguage = "en";
    let timer = null;

    function loadExams() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function saveExams() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    }

    function getLanguage() {
        const value = (
            document.documentElement.lang ||
            document.getElementById("languageSwitcher")?.value ||
            "en"
        ).toLowerCase().slice(0, 2);

        return translations[value] ? value : "en";
    }

    function t(key) {
        return translations[currentLanguage][key] || key;
    }

    function createStyles() {
        if (document.getElementById("examCountdownStyles")) return;

        const style = document.createElement("style");
        style.id = "examCountdownStyles";

        style.textContent = `
            .ec-panel {
                --ec-green: #176b50;
                --ec-blue: #2878c7;
                --ec-red: #d94b4b;
                --ec-gold: #d9a441;
                width: 100%;
                box-sizing: border-box;
                margin: 24px 0;
                padding: 22px;
                color: var(--text, #24372f);
                background: var(--surface, #fff);
                border: 1px solid var(--border, #e4ece7);
                border-radius: 16px;
                box-shadow: var(--shadow, 0 8px 25px rgba(24,65,47,.07));
                font-family: inherit;
            }

            .ec-panel *,
            .ec-panel *::before,
            .ec-panel *::after {
                box-sizing: border-box;
            }

            .ec-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 14px;
                margin-bottom: 18px;
            }

            .ec-title {
                margin: 0 0 5px;
                color: var(--primary, #176b50);
                font-size: 22px;
                font-weight: 800;
            }

            .ec-subtitle {
                margin: 0;
                color: var(--muted, #7b8b83);
                font-size: 13px;
                line-height: 1.6;
            }

            .ec-button {
                padding: 10px 14px;
                border: 0;
                border-radius: 9px;
                font: inherit;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                transition: filter .15s, transform .15s;
            }

            .ec-button:hover, .ec-action:hover {
                filter: brightness(.94);
                transform: translateY(-1px);
            }

            .ec-button:focus-visible,
            .ec-action:focus-visible,
            .ec-input:focus-visible,
            .ec-search:focus-visible {
                outline: 3px solid rgba(40,120,199,.25);
                outline-offset: 2px;
            }

            .ec-add, .ec-save {
                color: #fff;
                background: var(--ec-green);
            }

            .ec-search {
                width: 100%;
                padding: 12px 14px;
                margin-bottom: 20px;
                border: 1px solid var(--border, #e4ece7);
                border-radius: 10px;
                background: var(--background, #f3f7f5);
                color: var(--text, #24372f);
                font: inherit;
                font-size: 14px;
            }

            .ec-form {
                padding: 18px;
                margin-bottom: 22px;
                border: 1px solid var(--border, #e4ece7);
                border-radius: 13px;
                background: var(--background, #f3f7f5);
            }

            .ec-form[hidden], .ec-confirm[hidden],
            .ec-empty[hidden], .ec-section[hidden] {
                display: none !important;
            }

            .ec-form-heading {
                margin: 0 0 15px;
                font-size: 16px;
                font-weight: 800;
            }

            .ec-label {
                display: block;
                margin: 12px 0 6px;
                font-size: 12px;
                font-weight: 700;
            }

            .ec-input {
                display: block;
                width: 100%;
                min-width: 0;
                padding: 11px 12px;
                border: 1px solid var(--border, #e4ece7);
                border-radius: 9px;
                background: var(--surface, #fff);
                color: var(--text, #24372f);
                font: inherit;
                font-size: 14px;
            }

            .ec-form-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 9px;
                margin-top: 16px;
            }

            .ec-cancel, .ec-keep {
                color: var(--text, #24372f);
                background: #e7ece9;
            }

            .ec-error {
                margin: 10px 0 0;
                color: var(--ec-red);
                font-size: 13px;
            }

            .ec-section-title {
                margin: 20px 0 12px;
                font-size: 16px;
                font-weight: 800;
            }

            .ec-next {
                margin-bottom: 22px;
                padding: 15px;
                border: 1px solid rgba(217,164,65,.35);
                border-radius: 13px;
                background: rgba(217,164,65,.08);
            }

            .ec-next-label {
                display: inline-block;
                margin-bottom: 10px;
                color: #9b701b;
                font-size: 11px;
                font-weight: 800;
                text-transform: uppercase;
            }

            .ec-next .ec-exam-card {
                margin: 0;
                border-color: rgba(217,164,65,.4);
            }

            .ec-exam-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
                gap: 13px;
            }

            .ec-exam-card {
                min-width: 0;
                padding: 15px;
                border: 1px solid var(--border, #e4ece7);
                border-radius: 12px;
                background: var(--surface, #fff);
                overflow-wrap: anywhere;
            }

            .ec-exam-title {
                margin: 0;
                font-size: 15px;
                font-weight: 800;
                line-height: 1.5;
            }

            .ec-exam-subject {
                margin: 5px 0 0;
                color: var(--muted, #7b8b83);
                font-size: 12px;
            }

            .ec-date {
                margin: 12px 0;
                color: var(--muted, #7b8b83);
                font-size: 11px;
            }

            .ec-countdown-label {
                margin: 12px 0 8px;
                color: var(--primary, #176b50);
                font-size: 11px;
                font-weight: 800;
            }

            .ec-countdown {
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 7px;
            }

            .ec-time-unit {
                min-width: 0;
                padding: 10px 4px;
                text-align: center;
                border-radius: 9px;
                background: var(--primary-light, #e7f4ed);
            }

            .ec-time-number {
                display: block;
                color: var(--primary-dark, #104b39);
                font-size: clamp(17px, 4vw, 23px);
                font-weight: 900;
                font-variant-numeric: tabular-nums;
            }

            .ec-time-label {
                display: block;
                margin-top: 3px;
                color: var(--muted, #7b8b83);
                font-size: 9px;
            }

            .ec-status {
                margin: 13px 0 0;
                padding: 10px;
                border-radius: 8px;
                color: #9b701b;
                background: rgba(217,164,65,.13);
                font-size: 12px;
                font-weight: 800;
                text-align: center;
            }

            .ec-status.passed {
                color: #c63838;
                background: #ffebeb;
            }

            .ec-card-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 14px;
                padding-top: 12px;
                border-top: 1px solid var(--border, #e4ece7);
            }

            .ec-action {
                padding: 8px 11px;
                border: 0;
                border-radius: 7px;
                font: inherit;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
            }

            .ec-edit { color: #2166ad; background: #e5f0ff; }
            .ec-delete { color: #c63838; background: #ffebeb; }

            .ec-empty {
                padding: 18px;
                color: var(--muted, #7b8b83);
                text-align: center;
                font-size: 13px;
            }

            .ec-confirm {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                background: rgba(20,35,28,.5);
            }

            .ec-confirm-box {
                width: min(100%, 360px);
                padding: 22px;
                border-radius: 14px;
                background: var(--surface, #fff);
                box-shadow: 0 12px 35px rgba(0,0,0,.18);
            }

            .ec-confirm-box h3 {
                margin: 0 0 8px;
                font-size: 17px;
            }

            .ec-confirm-box p {
                margin: 0;
                color: var(--muted, #7b8b83);
                font-size: 13px;
                line-height: 1.6;
            }

            .ec-confirm-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 9px;
                margin-top: 16px;
            }

            .ec-confirm-delete {
                color: #fff;
                background: var(--ec-red);
            }

            @media (max-width: 520px) {
                .ec-panel { padding: 15px; }
                .ec-header { align-items: stretch; }
                .ec-add { width: 100%; }
                .ec-card-actions .ec-action { flex: 1 1 auto; }
            }
        `;

        document.head.appendChild(style);
    }

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;

        panel = document.createElement("section");
        panel.id = PANEL_ID;
        panel.className = "ec-panel";

        panel.innerHTML = `
            <div class="ec-header">
                <div>
                    <h2 class="ec-title"></h2>
                    <p class="ec-subtitle"></p>
                </div>
                <button type="button" class="ec-button ec-add"></button>
            </div>

            <input type="search" class="ec-search" autocomplete="off">

            <form class="ec-form" hidden>
                <h3 class="ec-form-heading"></h3>

                <label class="ec-label ec-title-label"></label>
                <input class="ec-input ec-name" type="text" maxlength="120" required>

                <label class="ec-label ec-subject-label"></label>
                <input class="ec-input ec-subject" type="text" maxlength="100">

                <label class="ec-label ec-date-label"></label>
                <input class="ec-input ec-date-input" type="datetime-local" required>

                <p class="ec-error" role="alert" hidden></p>

                <div class="ec-form-actions">
                    <button class="ec-button ec-save" type="submit"></button>
                    <button class="ec-button ec-cancel" type="button"></button>
                </div>
            </form>

            <div class="ec-next-section" hidden>
                <div class="ec-next">
                    <span class="ec-next-label"></span>
                    <div class="ec-next-card"></div>
                </div>
            </div>

            <div class="ec-section ec-upcoming-section">
                <h3 class="ec-section-title ec-upcoming-title"></h3>
                <div class="ec-exam-list ec-upcoming-list"></div>
            </div>

            <div class="ec-section ec-past-section" hidden>
                <h3 class="ec-section-title ec-past-title"></h3>
                <div class="ec-exam-list ec-past-list"></div>
            </div>

            <p class="ec-empty" hidden></p>

            <div class="ec-confirm" hidden>
                <div class="ec-confirm-box" role="dialog" aria-modal="true">
                    <h3 class="ec-confirm-title"></h3>
                    <p class="ec-confirm-text"></p>
                    <div class="ec-confirm-actions">
                        <button type="button" class="ec-button ec-confirm-delete"></button>
                        <button type="button" class="ec-button ec-keep"></button>
                    </div>
                </div>
            </div>
        `;

        createStyles();

        // Insert this feature into the dedicated features container.
const featureContainer = document.getElementById("studyManagerFeatures");

if (featureContainer) {
    featureContainer.appendChild(panel);
} else {
    console.warn(
        "Study Manager: #studyManagerFeatures container was not found."
    );
}

        connectEvents();
        updateLanguage();
        renderExams();

        timer = setInterval(updateCountdowns, 1000);
    }

    function formatDate(value) {
        const date = new Date(value);

        try {
            return new Intl.DateTimeFormat(currentLanguage, {
                dateStyle: "full",
                timeStyle: "short"
            }).format(date);
        } catch (error) {
            return date.toLocaleString();
        }
    }

    function createTimeUnit(value, label) {
        const unit = document.createElement("div");
        unit.className = "ec-time-unit";

        const number = document.createElement("span");
        number.className = "ec-time-number";
        number.textContent = String(value).padStart(2, "0");

        const text = document.createElement("span");
        text.className = "ec-time-label";
        text.textContent = label;

        unit.append(number, text);
        return unit;
    }

    function createCountdown(exam) {
        const target = new Date(exam.dateTime).getTime();
        const remaining = target - Date.now();

        const wrapper = document.createElement("div");
        wrapper.className = "ec-countdown-wrap";

        const label = document.createElement("p");
        label.className = "ec-countdown-label";
        label.textContent = t("remaining");
        wrapper.appendChild(label);

        if (remaining <= 0) {
            const status = document.createElement("p");
            status.className = "ec-status passed";
            status.textContent = t("passed");
            wrapper.appendChild(status);
            return wrapper;
        }

        const days = Math.floor(remaining / 86400000);
        const hours = Math.floor((remaining % 86400000) / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        const countdown = document.createElement("div");
        countdown.className = "ec-countdown";

        countdown.append(
            createTimeUnit(days, t("days")),
            createTimeUnit(hours, t("hours")),
            createTimeUnit(minutes, t("minutes")),
            createTimeUnit(seconds, t("seconds"))
        );

        wrapper.appendChild(countdown);
        return wrapper;
    }

    function createExamCard(exam) {
        const card = document.createElement("article");
        card.className = "ec-exam-card";
        card.dataset.examId = exam.id;

        const title = document.createElement("h4");
        title.className = "ec-exam-title";
        title.textContent = exam.title;

        card.appendChild(title);

        if (exam.subject) {
            const subject = document.createElement("p");
            subject.className = "ec-exam-subject";
            subject.textContent = exam.subject;
            card.appendChild(subject);
        }

        const date = document.createElement("p");
        date.className = "ec-date";
        date.textContent = `${t("dateLabel")}: ${formatDate(exam.dateTime)}`;

        card.appendChild(date);
        card.appendChild(createCountdown(exam));

        const actions = document.createElement("div");
        actions.className = "ec-card-actions";

        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "ec-action ec-edit";
        edit.dataset.action = "edit";
        edit.dataset.id = exam.id;
        edit.textContent = t("edit");

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "ec-action ec-delete";
        remove.dataset.action = "delete";
        remove.dataset.id = exam.id;
        remove.textContent = t("remove");

        actions.append(edit, remove);
        card.appendChild(actions);

        return card;
    }

    function renderExams() {
        if (!panel) return;

        const query = panel.querySelector(".ec-search").value
            .trim()
            .toLocaleLowerCase();

        const matching = exams.filter(exam =>
            `${exam.title} ${exam.subject || ""}`
                .toLocaleLowerCase()
                .includes(query)
        );

        const now = Date.now();

        const upcoming = matching
            .filter(exam => new Date(exam.dateTime).getTime() > now)
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        const past = matching
            .filter(exam => new Date(exam.dateTime).getTime() <= now)
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

        const upcomingList = panel.querySelector(".ec-upcoming-list");
        const pastList = panel.querySelector(".ec-past-list");

        upcomingList.replaceChildren();
        pastList.replaceChildren();

        upcoming.forEach(exam => {
            upcomingList.appendChild(createExamCard(exam));
        });

        past.forEach(exam => {
            pastList.appendChild(createExamCard(exam));
        });

        panel.querySelector(".ec-past-section").hidden = past.length === 0;

        const nextSection = panel.querySelector(".ec-next-section");
        nextSection.hidden = upcoming.length === 0 || query !== "";

        if (!nextSection.hidden) {
            const nextCard = createExamCard(upcoming[0]);
            nextCard.querySelector(".ec-card-actions").remove();
            panel.querySelector(".ec-next-card").replaceChildren(nextCard);
        }

        const empty = panel.querySelector(".ec-empty");
        empty.hidden = matching.length !== 0;
        empty.textContent = exams.length === 0 ? t("empty") : t("noResults");
    }

    function updateCountdowns() {
        if (!panel) return;

        // Refresh countdown displays without rebuilding the cards.
        panel.querySelectorAll(".ec-exam-card[data-exam-id]").forEach(card => {
            const exam = exams.find(item => item.id === card.dataset.examId);
            if (!exam) return;

            const oldCountdown = card.querySelector(".ec-countdown-wrap");
            if (oldCountdown) {
                oldCountdown.replaceWith(createCountdown(exam));
            }
        });

        const upcoming = exams
            .filter(exam => new Date(exam.dateTime).getTime() > Date.now())
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        const query = panel.querySelector(".ec-search").value.trim();

        if (!query) {
            const nextSection = panel.querySelector(".ec-next-section");

            if (upcoming.length) {
                nextSection.hidden = false;
                const nextCard = createExamCard(upcoming[0]);
                nextCard.querySelector(".ec-card-actions").remove();
                panel.querySelector(".ec-next-card").replaceChildren(nextCard);
            } else {
                nextSection.hidden = true;
            }
        }

        // Re-sort automatically when an exam reaches its scheduled time.
        if (exams.some(exam =>
            exam.dateTime &&
            new Date(exam.dateTime).getTime() <= Date.now() &&
            !exam.countdownPassed
        )) {
            exams.forEach(exam => {
                if (new Date(exam.dateTime).getTime() <= Date.now()) {
                    exam.countdownPassed = true;
                }
            });

            saveExams();
            renderExams();
        }
    }

    function createId() {
        return "exam-" + Date.now().toString(36) +
            "-" + Math.random().toString(36).slice(2, 9);
    }

    function openForm(exam = null) {
        editingId = exam ? exam.id : null;

        const form = panel.querySelector(".ec-form");

        panel.querySelector(".ec-form-heading").textContent =
            exam ? t("edit") : t("add").replace("+ ", "");

        panel.querySelector(".ec-name").value = exam?.title || "";
        panel.querySelector(".ec-subject").value = exam?.subject || "";
        panel.querySelector(".ec-date-input").value = exam?.dateTime || "";

        panel.querySelector(".ec-save").textContent =
            exam ? t("update") : t("save");

        panel.querySelector(".ec-error").hidden = true;
        form.hidden = false;

        panel.querySelector(".ec-name").focus();
        form.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function closeForm() {
        panel.querySelector(".ec-form").hidden = true;
        panel.querySelector(".ec-error").hidden = true;
        editingId = null;
    }

    function saveExam(event) {
        event.preventDefault();

        const title = panel.querySelector(".ec-name").value.trim();
        const subject = panel.querySelector(".ec-subject").value.trim();
        const dateTime = panel.querySelector(".ec-date-input").value;
        const error = panel.querySelector(".ec-error");

        if (!title || !dateTime) {
            error.textContent = t("required");
            error.hidden = false;
            return;
        }

        const timestamp = new Date(dateTime).getTime();

        if (!Number.isFinite(timestamp)) {
            error.textContent = t("invalidDate");
            error.hidden = false;
            return;
        }

        const now = Date.now();

        if (!editingId && timestamp <= now) {
            error.textContent = t("invalidDate");
            error.hidden = false;
            return;
        }

        if (editingId) {
            const exam = exams.find(item => item.id === editingId);

            if (exam) {
                exam.title = title;
                exam.subject = subject;
                exam.dateTime = dateTime;
                exam.updatedAt = now;
                delete exam.countdownPassed;
            }
        } else {
            exams.push({
                id: createId(),
                title,
                subject,
                dateTime,
                createdAt: now,
                updatedAt: now
            });
        }

        saveExams();
        closeForm();
        renderExams();
    }

    function showDeleteConfirmation(id) {
        deletingId = id;
        panel.querySelector(".ec-confirm").hidden = false;
    }

    function closeDeleteConfirmation() {
        deletingId = null;
        panel.querySelector(".ec-confirm").hidden = true;
    }

    function deleteExam() {
        if (!deletingId) return;

        exams = exams.filter(exam => exam.id !== deletingId);
        saveExams();

        closeDeleteConfirmation();
        renderExams();
    }

    function handleCardAction(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const exam = exams.find(item => item.id === button.dataset.id);
        if (!exam) return;

        if (button.dataset.action === "edit") {
            openForm(exam);
        }

        if (button.dataset.action === "delete") {
            showDeleteConfirmation(exam.id);
        }
    }

    function connectEvents() {
        panel.querySelector(".ec-add").addEventListener("click", () => openForm());

        panel.querySelector(".ec-form").addEventListener("submit", saveExam);

        panel.querySelector(".ec-cancel").addEventListener("click", closeForm);

        panel.querySelector(".ec-search").addEventListener("input", renderExams);

        panel.querySelector(".ec-upcoming-list").addEventListener("click", handleCardAction);
        panel.querySelector(".ec-past-list").addEventListener("click", handleCardAction);

        panel.querySelector(".ec-confirm-delete").addEventListener("click", deleteExam);
        panel.querySelector(".ec-keep").addEventListener("click", closeDeleteConfirmation);
    }

    function updateLanguage() {
        if (!panel) return;

        currentLanguage = getLanguage();

        panel.lang = currentLanguage;
        panel.dir = currentLanguage === "ar" ? "rtl" : "ltr";

        panel.querySelector(".ec-title").textContent = t("title");
        panel.querySelector(".ec-subtitle").textContent = t("subtitle");
        panel.querySelector(".ec-add").textContent = t("add");
        panel.querySelector(".ec-search").placeholder = t("search");

        panel.querySelector(".ec-title-label").textContent = t("examTitle");
        panel.querySelector(".ec-subject-label").textContent = t("subject");
        panel.querySelector(".ec-date-label").textContent = t("dateTime");

        panel.querySelector(".ec-name").placeholder = t("titlePlaceholder");
        panel.querySelector(".ec-subject").placeholder = t("subjectPlaceholder");

        panel.querySelector(".ec-upcoming-title").textContent = t("upcoming");
        panel.querySelector(".ec-past-title").textContent = t("past");
        panel.querySelector(".ec-next-label").textContent = t("pinned");

        panel.querySelector(".ec-cancel").textContent = t("cancel");

        panel.querySelector(".ec-confirm-title").textContent = t("deleteTitle");
        panel.querySelector(".ec-confirm-text").textContent = t("deleteText");
        panel.querySelector(".ec-confirm-delete").textContent = t("confirmDelete");
        panel.querySelector(".ec-keep").textContent = t("keep");

        if (!panel.querySelector(".ec-form").hidden) {
            panel.querySelector(".ec-form-heading").textContent =
                editingId ? t("edit") : t("add").replace("+ ", "");

            panel.querySelector(".ec-save").textContent =
                editingId ? t("update") : t("save");
        }

        renderExams();
    }

    function start() {
        createPanel();

        const switcher = document.getElementById("languageSwitcher");

        if (switcher) {
            switcher.addEventListener("change", updateLanguage);
        }

        const observer = new MutationObserver(updateLanguage);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["lang", "dir"]
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();

