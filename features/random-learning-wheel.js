
/* ==========================================
   RANDOM LEARNING WHEEL
   Modes: Random Subject + Random Lesson
   Languages: English, Arabic, French
   ========================================== */

(function () {
    "use strict";

    // Prevent duplicate initialization
    if (document.getElementById("randomLearningWheel")) return;

    const wheelTranslations = {
        en: {
            title: "Random Learning Wheel",
            subtitle: "Let the wheel decide what you learn next!",
            subjectMode: "Random Subject",
            lessonMode: "Random Lesson",
            spin: "SPIN THE WHEEL",
            spinning: "Spinning...",
            result: "Your result",
            recent: "Recent Results",
            empty: "No results yet. Spin the wheel!",
            noSubjects: "Add some subjects first!",
            noLessons: "No lessons available in your subjects!",
            subject: "Subject",
            lesson: "Lesson",
            again: "Spin Again"
        },
        ar: {
            title: "عجلة التعلّم العشوائية",
            subtitle: "دع العجلة تختار لك ما ستتعلمه!",
            subjectMode: "اختيار مادة عشوائية",
            lessonMode: "اختيار درس عشوائي",
            spin: "أدر العجلة",
            spinning: "جارٍ الدوران...",
            result: "النتيجة",
            recent: "النتائج الأخيرة",
            empty: "لا توجد نتائج بعد. أدر العجلة!",
            noSubjects: "أضف بعض المواد أولاً!",
            noLessons: "لا توجد دروس في المواد!",
            subject: "المادة",
            lesson: "الدرس",
            again: "أدر العجلة مجدداً"
        },
        fr: {
            title: "Roue d'apprentissage aléatoire",
            subtitle: "Laissez la roue choisir votre prochain apprentissage !",
            subjectMode: "Matière aléatoire",
            lessonMode: "Leçon aléatoire",
            spin: "LANCER LA ROUE",
            spinning: "En rotation...",
            result: "Votre résultat",
            recent: "Résultats récents",
            empty: "Aucun résultat. Lancez la roue !",
            noSubjects: "Ajoutez d'abord des matières !",
            noLessons: "Aucune leçon disponible !",
            subject: "Matière",
            lesson: "Leçon",
            again: "Relancer"
        }
    };

    const colors = [
        "#16a34a",
        "#2563eb",
        "#f59e0b",
        "#9333ea",
        "#0891b2",
        "#e11d48",
        "#65a30d",
        "#ea580c"
    ];

    let mode = "subject";
    let isSpinning = false;
    let rotation = 0;
    let recentResults = [];

    const container = document.createElement("section");
    container.id = "randomLearningWheel";
    container.innerHTML = `
        <div class="rlw-card">
            <div class="rlw-heading">
                <div class="rlw-icon">🎡</div>
                <div>
                    <h2 data-rlw="title"></h2>
                    <p data-rlw="subtitle"></p>
                </div>
            </div>

            <div class="rlw-modes">
                <button type="button" data-mode="subject" class="rlw-mode active"></button>
                <button type="button" data-mode="lesson" class="rlw-mode"></button>
            </div>

            <div class="rlw-wheel-area">
                <div class="rlw-pointer"></div>
                <canvas class="rlw-canvas" width="600" height="600"></canvas>
                <div class="rlw-center">🎓</div>
            </div>

            <button type="button" class="rlw-spin"></button>

            <div class="rlw-result" aria-live="polite">
                <span class="rlw-result-label" data-rlw="result"></span>
                <strong class="rlw-result-value">—</strong>
            </div>

            <div class="rlw-history">
                <h3 data-rlw="recent"></h3>
                <div class="rlw-history-list"></div>
            </div>
        </div>
    `;

    // Inject styles
    const style = document.createElement("style");
    style.textContent = `
        #randomLearningWheel {
            width: 100%;
            margin: 30px auto;
            font-family: inherit;
            color: var(--text-color, #1f2937);
        }

        #randomLearningWheel * {
            box-sizing: border-box;
        }

        #randomLearningWheel .rlw-card {
            max-width: 650px;
            margin: auto;
            padding: 25px;
            border-radius: 20px;
            background: var(--card-bg, #ffffff);
            border: 1px solid var(--border-color, #e5e7eb);
            box-shadow: 0 8px 25px rgba(0,0,0,.07);
            text-align: center;
        }

        #randomLearningWheel .rlw-heading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 13px;
            margin-bottom: 22px;
        }

        #randomLearningWheel .rlw-icon {
            font-size: 38px;
        }

        #randomLearningWheel h2 {
            margin: 0 0 5px;
            font-size: 23px;
        }

        #randomLearningWheel .rlw-heading p {
            margin: 0;
            color: #6b7280;
            font-size: 14px;
        }

        #randomLearningWheel .rlw-modes {
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 25px;
        }

        #randomLearningWheel .rlw-mode {
            border: 1px solid #d1d5db;
            background: transparent;
            color: inherit;
            padding: 10px 17px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: .2s;
        }

        #randomLearningWheel .rlw-mode.active {
            background: #15803d;
            color: white;
            border-color: #15803d;
        }

        #randomLearningWheel .rlw-wheel-area {
            width: min(100%, 350px);
            aspect-ratio: 1;
            margin: 0 auto 25px;
            position: relative;
        }

        #randomLearningWheel .rlw-canvas {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 50%;
            filter: drop-shadow(0 5px 8px rgba(0,0,0,.15));
        }

        #randomLearningWheel .rlw-pointer {
            position: absolute;
            z-index: 3;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 17px solid transparent;
            border-right: 17px solid transparent;
            border-top: 35px solid #dc2626;
            filter: drop-shadow(0 2px 2px rgba(0,0,0,.25));
        }

        #randomLearningWheel .rlw-center {
            position: absolute;
            z-index: 2;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 62px;
            height: 62px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: white;
            border: 5px solid #e5e7eb;
            font-size: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,.15);
            pointer-events: none;
        }

        #randomLearningWheel .rlw-spin {
            width: min(100%, 280px);
            padding: 15px 20px;
            border: none;
            border-radius: 12px;
            background: #15803d;
            color: white;
            font-weight: 800;
            font-size: 16px;
            cursor: pointer;
            transition: .2s;
        }

        #randomLearningWheel .rlw-spin:hover {
            background: #166534;
            transform: translateY(-2px);
        }

        #randomLearningWheel .rlw-spin:disabled {
            opacity: .65;
            cursor: not-allowed;
            transform: none;
        }

        #randomLearningWheel .rlw-result {
            margin-top: 22px;
            padding: 15px;
            border-radius: 12px;
            background: rgba(21,128,61,.08);
            display: flex;
            flex-direction: column;
            gap: 7px;
        }

        #randomLearningWheel .rlw-result-label {
            color: #6b7280;
            font-size: 13px;
        }

        #randomLearningWheel .rlw-result-value {
            font-size: 20px;
            color: #15803d;
            overflow-wrap: anywhere;
        }

        #randomLearningWheel .rlw-history {
            margin-top: 25px;
            text-align: start;
        }

        #randomLearningWheel .rlw-history h3 {
            font-size: 16px;
            margin: 0 0 12px;
        }

        #randomLearningWheel .rlw-history-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        #randomLearningWheel .rlw-history-item {
            padding: 10px 12px;
            border-radius: 9px;
            background: rgba(107,114,128,.08);
            font-size: 14px;
            overflow-wrap: anywhere;
        }

        #randomLearningWheel[dir="rtl"] .rlw-history {
            text-align: right;
        }

        @media (max-width: 480px) {
            #randomLearningWheel .rlw-card {
                padding: 17px 12px;
            }

            #randomLearningWheel h2 {
                font-size: 19px;
            }

            #randomLearningWheel .rlw-heading p {
                font-size: 12px;
            }

            #randomLearningWheel .rlw-mode {
                padding: 9px 12px;
                font-size: 13px;
            }

            #randomLearningWheel .rlw-wheel-area {
                width: min(100%, 290px);
            }
        }
    `;

    document.head.appendChild(style);

    // Connect the feature to the existing app.
    // Change this target if you want the wheel somewhere else.
    const target =
        document.getElementById("studyManagerFeatures") ||
        document.querySelector("main") ||
        document.body;

    target.appendChild(container);

    const canvas = container.querySelector(".rlw-canvas");
    const ctx = canvas.getContext("2d");
    const spinButton = container.querySelector(".rlw-spin");
    const resultValue = container.querySelector(".rlw-result-value");
    const historyList = container.querySelector(".rlw-history-list");

    function getLanguage() {
        const language = document.documentElement.lang || "en";
        return wheelTranslations[language] ? language : "en";
    }

    function t(key) {
        return wheelTranslations[getLanguage()][key];
    }

    function getSubjects() {
        // Uses the existing global subjects array from Study Manager.
        return Array.isArray(subjects) ? subjects : [];
    }

    function getItems() {
        const allSubjects = getSubjects();

        if (mode === "subject") {
            return allSubjects
                .map(subject => subject.name)
                .filter(name => typeof name === "string" && name.trim());
        }

        return allSubjects.flatMap(subject =>
            (Array.isArray(subject.lessons) ? subject.lessons : [])
                .filter(lesson => lesson && typeof lesson.title === "string")
                .map(lesson => ({
                    title: lesson.title,
                    subject: subject.name
                }))
        );
    }

    function getItemLabel(item) {
        return mode === "subject"
            ? item
            : item.title;
    }

    function drawWheel(items) {
        const size = canvas.width;
        const center = size / 2;
        const radius = center - 8;

        ctx.clearRect(0, 0, size, size);

        if (!items.length) {
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.fillStyle = "#9ca3af";
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🎓", center, center);
            return;
        }

        const slice = (Math.PI * 2) / items.length;

        items.forEach((item, index) => {
            const start = rotation + index * slice - Math.PI / 2;
            const end = start + slice;

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, start, end);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            ctx.strokeStyle = "rgba(255,255,255,.85)";
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(start + slice / 2);

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 18px sans-serif";

            let label = getItemLabel(item);
            const maxLength = 17;
            if (label.length > maxLength) {
                label = label.slice(0, maxLength - 1) + "…";
            }

            ctx.fillText(label, radius - 22, 0);
            ctx.restore();
        });
    }

    function updateHistory() {
        historyList.innerHTML = "";

        if (!recentResults.length) {
            historyList.textContent = t("empty");
            return;
        }

        recentResults.forEach((result, index) => {
            const item = document.createElement("div");
            item.className = "rlw-history-item";
            item.textContent = `${index + 1}. ${result}`;
            historyList.appendChild(item);
        });
    }

    function updateInterface() {
        const lang = getLanguage();
        const translations = wheelTranslations[lang];

        container.dir = lang === "ar" ? "rtl" : "ltr";

        container.querySelectorAll("[data-rlw]").forEach(element => {
            element.textContent = translations[element.dataset.rlw];
        });

        container.querySelector('[data-mode="subject"]').textContent =
            translations.subjectMode;

        container.querySelector('[data-mode="lesson"]').textContent =
            translations.lessonMode;

        spinButton.textContent = translations.spin;

        container.querySelectorAll(".rlw-mode").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );
        });

        updateHistory();
        drawWheel(getItems());
    }

    function spinWheel() {
        if (isSpinning) return;

        const items = getItems();

        if (!items.length) {
            resultValue.textContent =
                mode === "subject" ? t("noSubjects") : t("noLessons");
            return;
        }

        isSpinning = true;
        spinButton.disabled = true;
        spinButton.textContent = t("spinning");

        const selectedIndex = Math.floor(Math.random() * items.length);
        const slice = (Math.PI * 2) / items.length;

        // Position the selected segment under the pointer at the top.
        const desiredAngle =
            Math.PI * 2 -
            (selectedIndex + 0.5) * slice;

        const currentAngle = rotation % (Math.PI * 2);
        const extraRotation =
            (desiredAngle - currentAngle + Math.PI * 2) %
            (Math.PI * 2);

        const startRotation = rotation;
        const finalRotation =
            startRotation + (Math.PI * 2 * 5) + extraRotation;

        const duration = 4200;
        const startTime = performance.now();

        function animate(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            rotation =
                startRotation +
                (finalRotation - startRotation) * eased;

            drawWheel(items);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                rotation = finalRotation;
                finishSpin(items[selectedIndex]);
            }
        }

        requestAnimationFrame(animate);
    }

    function finishSpin(selected) {
        const label = getItemLabel(selected);

        resultValue.textContent =
            mode === "subject"
                ? label
                : `${selected.title} — ${selected.subject}`;

        recentResults.unshift(
            mode === "subject"
                ? `${t("subject")}: ${label}`
                : `${t("lesson")}: ${selected.title} (${selected.subject})`
        );

        recentResults = recentResults.slice(0, 5);
        updateHistory();

        isSpinning = false;
        spinButton.disabled = false;
        spinButton.textContent = t("again");
    }

    container.querySelectorAll(".rlw-mode").forEach(button => {
        button.addEventListener("click", () => {
            if (isSpinning) return;

            mode = button.dataset.mode;
            resultValue.textContent = "—";
            updateInterface();
        });
    });

    spinButton.addEventListener("click", spinWheel);

    // Keep the wheel language synchronized with the existing language switcher.
    const languageObserver = new MutationObserver(() => {
        updateInterface();
    });

    languageObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang", "dir"]
    });

    updateInterface();
})();
