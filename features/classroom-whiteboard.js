
/* ==========================================
   STUDY MANAGER
   FEATURE: CLASSROOM WHITEBOARD
   MULTILINGUAL: ENGLISH / ARABIC / FRENCH
========================================== */

(function () {
    "use strict";

    // ======================================
    // 1. SETTINGS
    // ======================================

    const STORAGE_KEY = "studyManagerWhiteboardV1";
    const MAX_HISTORY = 30;

    let currentTool = "pen";
    let isDrawing = false;
    let startPoint = null;
    let lastPoint = null;
    let baseImage = null;
    let currentLanguage = "en";

    let history = [];
    let redoHistory = [];

    // ======================================
    // 2. TRANSLATIONS
    // ======================================

    const translations = {
        en: {
            title: "Classroom Whiteboard",
            description: "Your digital teaching and drawing workspace.",
            ready: "Ready",
            boardTitle: "My Whiteboard",
            boardTitleLabel: "Whiteboard title",
            save: "💾 Save",
            export: "🖼️ Export PNG",
            pen: "✏️ Pen",
            highlighter: "🖍️ Highlight",
            eraser: "🧽 Eraser",
            line: "📏 Line",
            rect: "▭ Rectangle",
            circle: "◯ Circle",
            arrow: "➜ Arrow",
            color: "Color",
            size: "Size",
            undo: "↶ Undo",
            redo: "↷ Redo",
            clear: "🗑️ Clear",
            canvasLabel: "Interactive drawing canvas",
            canvasHint: "Start drawing here",
            footerTouch: "✋ Mouse, touch and stylus supported",
            footerSave: "Changes are saved when you press Save.",
            tool: "Tool",
            drawingUpdated: "Drawing updated",
            confirmClear: "Are you sure you want to clear the whiteboard?",
            confirmTitle: "Clear whiteboard?",
            confirmCancel: "Cancel",
            confirmAction: "Yes, clear it",
            cleared: "Whiteboard cleared",
            saved: "Saved successfully",
            saveError: "Could not save. Export as PNG instead.",
            restored: "Previous board restored",
            loadError: "Could not load saved board",
            exported: "PNG exported",
            undoStatus: "Undo",
            redoStatus: "Redo"
        },

        ar: {
            title: "السبورة التعليمية",
            description: "مساحتك الرقمية للتدريس والرسم.",
            ready: "جاهز",
            boardTitle: "سبورتي",
            boardTitleLabel: "عنوان السبورة",
            save: "💾 حفظ",
            export: "🖼️ تصدير PNG",
            pen: "✏️ قلم",
            highlighter: "🖍️ قلم تمييز",
            eraser: "🧽 ممحاة",
            line: "📏 خط",
            rect: "▭ مستطيل",
            circle: "◯ دائرة",
            arrow: "➜ سهم",
            color: "اللون",
            size: "الحجم",
            undo: "↶ تراجع",
            redo: "↷ إعادة",
            clear: "🗑️ مسح",
            canvasLabel: "مساحة الرسم التفاعلية",
            canvasHint: "ابدأ الرسم هنا",
            footerTouch: "✋ يدعم الفأرة واللمس والقلم الإلكتروني",
            footerSave: "يتم حفظ التغييرات عند الضغط على زر الحفظ.",
            tool: "الأداة",
            drawingUpdated: "تم تحديث الرسم",
            confirmClear: "هل أنت متأكد أنك تريد مسح السبورة؟",
            confirmTitle: "تأكيد مسح السبورة",
            confirmCancel: "إلغاء",
            confirmAction: "نعم، امسح السبورة",
            cleared: "تم مسح السبورة",
            saved: "تم الحفظ بنجاح",
            saveError: "تعذر الحفظ. يمكنك تصدير السبورة بصيغة PNG.",
            restored: "تم استعادة السبورة السابقة",
            loadError: "تعذر تحميل السبورة المحفوظة",
            exported: "تم تصدير الصورة",
            undoStatus: "تم التراجع",
            redoStatus: "تمت إعادة الخطوة"
        },

        fr: {
            title: "Tableau blanc interactif",
            description: "Votre espace numérique d'enseignement et de dessin.",
            ready: "Prêt",
            boardTitle: "Mon tableau",
            boardTitleLabel: "Titre du tableau",
            save: "💾 Enregistrer",
            export: "🖼️ Exporter PNG",
            pen: "✏️ Stylo",
            highlighter: "🖍️ Surligneur",
            eraser: "🧽 Gomme",
            line: "📏 Ligne",
            rect: "▭ Rectangle",
            circle: "◯ Cercle",
            arrow: "➜ Flèche",
            color: "Couleur",
            size: "Taille",
            undo: "↶ Annuler",
            redo: "↷ Rétablir",
            clear: "🗑️ Effacer",
            canvasLabel: "Espace de dessin interactif",
            canvasHint: "Commencez à dessiner ici",
            footerTouch: "✋ Souris, écran tactile et stylet compatibles",
            footerSave: "Les modifications sont enregistrées lorsque vous cliquez sur Enregistrer.",
            tool: "Outil",
            drawingUpdated: "Dessin mis à jour",
            confirmClear: "Voulez-vous vraiment effacer le tableau ?",
            confirmTitle: "Effacer le tableau ?",
            confirmCancel: "Annuler",
            confirmAction: "Oui, effacer",
            cleared: "Tableau effacé",
            saved: "Enregistrement réussi",
            saveError: "Impossible d'enregistrer. Exportez plutôt en PNG.",
            restored: "Tableau précédent restauré",
            loadError: "Impossible de charger le tableau enregistré",
            exported: "Image PNG exportée",
            undoStatus: "Annulation",
            redoStatus: "Étape rétablie"
        }
    };

    function normalizeLanguage(language) {
        if (!language) return null;

        const value = String(language).toLowerCase().trim();

        if (value.startsWith("ar")) return "ar";
        if (value.startsWith("fr")) return "fr";
        if (value.startsWith("en")) return "en";

        return null;
    }

    function detectLanguage() {
        const htmlLanguage = normalizeLanguage(
            document.documentElement.lang
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
                const stored = normalizeLanguage(
                    localStorage.getItem(key)
                );

                if (stored) return stored;
            } catch (error) {}
        }

        const globalValues = [
            window.currentLanguage,
            window.selectedLanguage,
            window.appLanguage,
            window.language,
            window.lang
        ];

        for (const value of globalValues) {
            const detected = normalizeLanguage(value);
            if (detected) return detected;
        }

        return "en";
    }

    function t(key) {
        return translations[currentLanguage][key]
            || translations.en[key]
            || key;
    }

    // ======================================
    // 3. CREATE FEATURE
    // ======================================

    const panel = document.createElement("section");

    panel.id = "classroomWhiteboardPanel";
    panel.className = "classroom-whiteboard";

    panel.innerHTML = `
        <div class="wb-header">
            <div>
                <h2 data-i18n="title"></h2>
                <p data-i18n="description"></p>
            </div>

            <span class="wb-status" id="wbStatus"
                data-i18n="ready"></span>
        </div>

        <div class="wb-board-info">
            <input
                type="text"
                id="wbBoardTitle"
                maxlength="60"
                aria-label=""
                data-i18n-placeholder="boardTitle"
            >

            <div class="wb-actions">
                <button type="button" data-action="save"
                    data-i18n="save"></button>

                <button type="button" data-action="export"
                    data-i18n="export"></button>
            </div>
        </div>

        <div class="wb-toolbar">
            <div class="wb-tools">
                <button type="button" data-tool="pen"
                    class="active" aria-pressed="true"
                    data-i18n="pen"></button>

                <button type="button" data-tool="highlighter"
                    aria-pressed="false"
                    data-i18n="highlighter"></button>

                <button type="button" data-tool="eraser"
                    aria-pressed="false"
                    data-i18n="eraser"></button>

                <button type="button" data-tool="line"
                    aria-pressed="false"
                    data-i18n="line"></button>

                <button type="button" data-tool="rect"
                    aria-pressed="false"
                    data-i18n="rect"></button>

                <button type="button" data-tool="circle"
                    aria-pressed="false"
                    data-i18n="circle"></button>

                <button type="button" data-tool="arrow"
                    aria-pressed="false"
                    data-i18n="arrow"></button>
            </div>

            <div class="wb-settings">
                <label class="wb-color-control">
                    <span data-i18n="color"></span>
                    <input type="color" id="wbColor"
                        value="#176b50">
                </label>

                <label class="wb-size-control">
                    <span data-i18n="size"></span>
                    <input type="range" id="wbSize"
                        min="1" max="30" value="4">
                    <span id="wbSizeValue">4</span>
                </label>
            </div>

            <div class="wb-history">
                <button type="button" data-action="undo"
                    data-i18n="undo"></button>

                <button type="button" data-action="redo"
                    data-i18n="redo"></button>

                <button type="button" data-action="clear"
                    data-i18n="clear"></button>
            </div>
        </div>

        <div class="wb-canvas-wrapper">
            <canvas id="wbCanvas"
                aria-label=""></canvas>

            <div class="wb-canvas-hint"
                data-i18n="canvasHint"></div>
        </div>

        <div class="wb-footer">
            <span data-i18n="footerTouch"></span>
            <span data-i18n="footerSave"></span>
        </div>
    `;

    // ======================================
    // 4. FEATURE STYLES
    // ======================================

    const style = document.createElement("style");

    style.textContent = `
        .classroom-whiteboard {
            width: 100%;
            box-sizing: border-box;
            padding: 20px;
            margin: 22px 0;
            background: var(--surface, #ffffff);
            border: 1px solid var(--border, #e4ece7);
            border-radius: 16px;
            box-shadow: var(--shadow, 0 8px 25px rgba(24,65,47,.07));
            color: var(--text, #24372f);
        }

        .classroom-whiteboard * {
            box-sizing: border-box;
        }

        .wb-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 18px;
        }

        .wb-header h2 {
            margin: 0 0 6px;
            font-size: 21px;
        }

        .wb-header p {
            margin: 0;
            color: var(--muted, #7b8b83);
            font-size: 13px;
        }

        .wb-status {
            padding: 6px 12px;
            border-radius: 20px;
            background: var(--primary-light, #e7f4ed);
            color: var(--primary, #176b50);
            font-size: 12px;
            font-weight: bold;
        }

        .wb-board-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 15px;
        }

        #classroomWhiteboardPanel #wbBoardTitle {
            width: 190px;
            max-width: 100%;
            padding: 9px 11px;
            border: 1px solid var(--border, #e4ece7);
            border-radius: 8px;
            background: var(--surface, #ffffff);
            color: var(--text, #24372f);
            font-size: 14px;
            font-weight: bold;
        }

        .wb-actions,
        .wb-tools,
        .wb-history {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
        }

        .classroom-whiteboard button {
            border: 1px solid var(--border, #e4ece7);
            border-radius: 8px;
            padding: 9px 12px;
            background: var(--surface, #ffffff);
            color: var(--text, #24372f);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: .2s;
        }

        .classroom-whiteboard button:hover {
            border-color: var(--primary, #176b50);
            background: var(--primary-light, #e7f4ed);
        }

        .classroom-whiteboard button.active {
            background: var(--primary, #176b50);
            color: #ffffff;
            border-color: var(--primary, #176b50);
        }

        .classroom-whiteboard button:disabled {
            opacity: .4;
            cursor: not-allowed;
        }

        .wb-toolbar {
            display: flex;
            flex-direction: column;
            gap: 13px;
            padding: 13px;
            margin-bottom: 12px;
            border: 1px solid var(--border, #e4ece7);
            border-radius: 12px;
            background: var(--bg, #f7faf8);
        }

        .wb-settings {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 22px;
        }

        .wb-color-control,
        .wb-size-control {
            display: flex;
            align-items: center;
            gap: 9px;
            color: var(--text, #24372f);
            font-size: 12px;
            font-weight: bold;
        }

        #classroomWhiteboardPanel #wbColor {
            width: 38px;
            height: 30px;
            padding: 2px;
            border: 1px solid var(--border, #e4ece7);
            border-radius: 6px;
            cursor: pointer;
        }

        #classroomWhiteboardPanel #wbSize {
            width: 110px;
            accent-color: var(--primary, #176b50);
        }

        #wbSizeValue {
            min-width: 18px;
            color: var(--primary, #176b50);
        }

        .wb-canvas-wrapper {
            position: relative;
            width: 100%;
            height: 440px;
            overflow: hidden;
            border: 1px solid #dce5df;
            border-radius: 10px;
            background: #ffffff;
        }

        #classroomWhiteboardPanel #wbCanvas {
            display: block;
            width: 100%;
            height: 100%;
            background: #ffffff;
            cursor: crosshair;
            touch-action: none;
            user-select: none;
        }

        .wb-canvas-hint {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #b5c2bb;
            font-size: 17px;
            pointer-events: none;
            opacity: 0;
        }

        .wb-footer {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
            color: var(--muted, #7b8b83);
            font-size: 11px;
        }

        .classroom-whiteboard[dir="rtl"] {
            text-align: right;
        }

        .classroom-whiteboard[dir="rtl"] .wb-header,
        .classroom-whiteboard[dir="rtl"] .wb-board-info,
        .classroom-whiteboard[dir="rtl"] .wb-settings,
        .classroom-whiteboard[dir="rtl"] .wb-footer {
            direction: rtl;
        }

        .classroom-whiteboard[dir="rtl"] #wbBoardTitle {
            text-align: right;
        }

        /* ==================================
           CUSTOM CONFIRMATION POPUP
        ================================== */

        .wb-dialog-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            background: rgba(15, 25, 20, .55);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            animation: wbOverlayIn .2s ease;
        }

        .wb-dialog-card {
            width: 100%;
            max-width: 390px;
            padding: 25px;
            border: 1px solid #e4ece7;
            border-radius: 18px;
            background: #ffffff;
            color: #24372f;
            text-align: center;
            box-shadow: 0 18px 55px rgba(0, 0, 0, .2);
            animation: wbCardIn .25s ease;
        }

        .wb-dialog-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 58px;
            height: 58px;
            margin: 0 auto 15px;
            border-radius: 50%;
            background: #fff3e8;
            color: #d97706;
            font-size: 27px;
        }

        .wb-dialog-title {
            margin: 0 0 10px;
            color: #24372f;
            font-size: 19px;
            font-weight: 800;
        }

        .wb-dialog-message {
            margin: 0;
            color: #718078;
            font-size: 14px;
            line-height: 1.7;
        }

        .wb-dialog-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 23px;
        }

        .wb-dialog-actions button {
            min-width: 110px;
            padding: 11px 16px;
            border-radius: 9px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: .2s;
        }

        .wb-dialog-cancel {
            border: 1px solid #dce5df;
            background: #f7faf8;
            color: #40534a;
        }

        .wb-dialog-confirm {
            border: 1px solid #c74635;
            background: #c74635;
            color: #ffffff;
        }

        .wb-dialog-confirm:hover {
            border-color: #a93426;
            background: #a93426;
        }

        .wb-dialog-cancel:hover {
            border-color: #aebdb4;
            background: #edf3ef;
        }

        .wb-dialog-overlay[dir="rtl"] {
            direction: rtl;
        }

        @keyframes wbOverlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes wbCardIn {
            from {
                opacity: 0;
                transform: translateY(12px) scale(.97);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @media (max-width: 600px) {
            .classroom-whiteboard {
                padding: 13px;
            }

            .wb-header h2 {
                font-size: 18px;
            }

            .wb-board-info {
                align-items: stretch;
            }

            #classroomWhiteboardPanel #wbBoardTitle {
                width: 100%;
            }

            .wb-actions button {
                flex: 1;
            }

            .wb-canvas-wrapper {
                height: 380px;
            }

            .wb-toolbar {
                padding: 9px;
            }

            .wb-tools button,
            .wb-history button {
                flex: 1 1 auto;
            }

            .wb-footer {
                flex-direction: column;
            }

            .wb-dialog-card {
                padding: 22px 18px;
            }

            .wb-dialog-actions button {
                flex: 1;
                min-width: 0;
            }
        }

        @media (max-width: 360px) {
            .wb-canvas-wrapper {
                height: 320px;
            }

            #classroomWhiteboardPanel #wbSize {
                width: 85px;
            }
        }
    `;

    document.head.appendChild(style);

    // ======================================
    // 5. LANGUAGE APPLICATION
    // ======================================

    function applyLanguage(language) {
        const normalized = normalizeLanguage(language);
        if (!normalized) return;

        currentLanguage = normalized;

        const isArabic = currentLanguage === "ar";

        panel.lang = currentLanguage;
        panel.dir = isArabic ? "rtl" : "ltr";

        panel.querySelectorAll("[data-i18n]").forEach(function (element) {
            const key = element.dataset.i18n;
            element.textContent = t(key);
        });

        panel.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
            const key = element.dataset.i18nPlaceholder;
            element.placeholder = t(key);
        });

        const titleInput = panel.querySelector("#wbBoardTitle");
        titleInput.setAttribute("aria-label", t("boardTitleLabel"));

        canvas.setAttribute("aria-label", t("canvasLabel"));

        setStatus(t("tool") + ": " + t(currentTool));

        panel.querySelectorAll(".wb-tools, .wb-history, .wb-actions")
            .forEach(function (element) {
                element.dir = isArabic ? "rtl" : "ltr";
            });
    }

    // ======================================
    // 6. INSERT INTO FEATURES CONTAINER
    // ======================================

    function insertPanel() {
        const container = document.getElementById("studyManagerFeatures");

        if (container) {
            if (panel.parentElement !== container) {
                container.appendChild(panel);
            }
        } else if (!panel.isConnected) {
            document.body.appendChild(panel);
        }
    }

    insertPanel();

    // ======================================
    // 7. CANVAS SETUP
    // ======================================

    const canvas = panel.querySelector("#wbCanvas");
    const ctx = canvas.getContext("2d");

    const colorInput = panel.querySelector("#wbColor");
    const sizeInput = panel.querySelector("#wbSize");
    const sizeValue = panel.querySelector("#wbSizeValue");
    const status = panel.querySelector("#wbStatus");

    function setStatus(message) {
        status.textContent = message;
    }

    function resetHistory() {
        history = [
            ctx.getImageData(0, 0, canvas.width, canvas.height)
        ];

        redoHistory = [];
        updateHistoryButtons();
    }

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const oldCanvas = document.createElement("canvas");
        oldCanvas.width = canvas.width;
        oldCanvas.height = canvas.height;

        if (oldCanvas.width && oldCanvas.height) {
            oldCanvas.getContext("2d").drawImage(canvas, 0, 0);
        }

        const ratio = window.devicePixelRatio || 1;

        canvas.width = Math.round(rect.width * ratio);
        canvas.height = Math.round(rect.height * ratio);

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, rect.width, rect.height);

        if (oldCanvas.width && oldCanvas.height) {
            ctx.drawImage(
                oldCanvas,
                0, 0,
                oldCanvas.width,
                oldCanvas.height,
                0, 0,
                rect.width,
                rect.height
            );
        }

        resetHistory();
    }

    // ======================================
    // 8. TOOL SELECTION
    // ======================================

    const toolButtons = panel.querySelectorAll("[data-tool]");

    function selectTool(tool) {
        currentTool = tool;

        toolButtons.forEach(function (button) {
            const selected = button.dataset.tool === tool;

            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });

        canvas.style.cursor =
            tool === "eraser" ? "cell" : "crosshair";

        setStatus(t("tool") + ": " + t(tool));
    }

    toolButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectTool(button.dataset.tool);
        });
    });

    // ======================================
    // 9. DRAWING SETTINGS
    // ======================================

    function getColor() {
        return colorInput.value;
    }

    function getSize() {
        return Number(sizeInput.value);
    }

    sizeInput.addEventListener("input", function () {
        sizeValue.textContent = sizeInput.value;
    });

    // ======================================
    // 10. DRAWING FUNCTIONS
    // ======================================

    function prepareStroke() {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = getSize();
        ctx.strokeStyle = getColor();
        ctx.fillStyle = getColor();
        ctx.globalAlpha = 1;

        if (currentTool === "highlighter") {
            ctx.lineWidth = getSize() * 3;
            ctx.globalAlpha = 0.28;
        }

        if (currentTool === "eraser") {
            ctx.lineWidth = getSize() * 4;
            ctx.strokeStyle = "#ffffff";
        }
    }

    function drawFreehand(from, to) {
        prepareStroke();

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    function drawArrow(start, end) {
        const angle = Math.atan2(
            end.y - start.y,
            end.x - start.x
        );

        const headLength = Math.max(12, getSize() * 3);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);

        ctx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
        );

        ctx.moveTo(end.x, end.y);

        ctx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
        );

        ctx.stroke();
    }

    function drawShape(start, end) {
        prepareStroke();

        const width = end.x - start.x;
        const height = end.y - start.y;

        ctx.beginPath();

        if (currentTool === "line") {
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
        } else if (currentTool === "rect") {
            ctx.rect(start.x, start.y, width, height);
        } else if (currentTool === "circle") {
            const radius = Math.sqrt(
                width * width + height * height
            );

            ctx.arc(
                start.x,
                start.y,
                radius,
                0,
                Math.PI * 2
            );
        } else if (currentTool === "arrow") {
            drawArrow(start, end);
        }

        if (currentTool !== "arrow") {
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }

    // ======================================
    // 11. POINTER EVENTS
    // ======================================

    function getPoint(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    canvas.addEventListener("pointerdown", function (event) {
        if (event.button !== 0 && event.pointerType === "mouse") {
            return;
        }

        event.preventDefault();

        canvas.setPointerCapture(event.pointerId);

        isDrawing = true;

        startPoint = getPoint(event);
        lastPoint = startPoint;

        baseImage = ctx.getImageData(
            0, 0,
            canvas.width,
            canvas.height
        );

        if (
            currentTool === "pen" ||
            currentTool === "highlighter" ||
            currentTool === "eraser"
        ) {
            prepareStroke();
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
        }
    });

    canvas.addEventListener("pointermove", function (event) {
        if (!isDrawing) return;

        event.preventDefault();

        const point = getPoint(event);

        if (
            currentTool === "pen" ||
            currentTool === "highlighter" ||
            currentTool === "eraser"
        ) {
            drawFreehand(lastPoint, point);
            lastPoint = point;
        } else {
            ctx.putImageData(baseImage, 0, 0);
            drawShape(startPoint, point);
        }
    });

    function finishDrawing() {
        if (!isDrawing) return;

        isDrawing = false;
        ctx.globalAlpha = 1;

        history.push(
            ctx.getImageData(0, 0, canvas.width, canvas.height)
        );

        if (history.length > MAX_HISTORY) {
            history.shift();
        }

        redoHistory = [];
        updateHistoryButtons();

        setStatus(t("drawingUpdated"));

        startPoint = null;
        lastPoint = null;
        baseImage = null;
    }

    canvas.addEventListener("pointerup", finishDrawing);
    canvas.addEventListener("pointercancel", finishDrawing);
    canvas.addEventListener("lostpointercapture", finishDrawing);

    // ======================================
    // 12. UNDO AND REDO
    // ======================================

    const undoButton = panel.querySelector('[data-action="undo"]');
    const redoButton = panel.querySelector('[data-action="redo"]');

    function updateHistoryButtons() {
        undoButton.disabled = history.length <= 1;
        redoButton.disabled = redoHistory.length === 0;
    }

    function restoreImage(imageData) {
        ctx.putImageData(imageData, 0, 0);
    }

    function undo() {
        if (history.length <= 1) return;

        redoHistory.push(history.pop());
        restoreImage(history[history.length - 1]);

        updateHistoryButtons();
        setStatus(t("undoStatus"));
    }

    function redo() {
        if (redoHistory.length === 0) return;

        const nextImage = redoHistory.pop();

        history.push(nextImage);
        restoreImage(nextImage);

        updateHistoryButtons();
        setStatus(t("redoStatus"));
    }

    undoButton.addEventListener("click", undo);
    redoButton.addEventListener("click", redo);

    // ======================================
    // 13. CUSTOM POPUP DIALOG
    // ======================================

    function showConfirmDialog(message, onConfirm) {
        // Remove any existing popup first.
        const existingDialog = document.querySelector(".wb-dialog-overlay");

        if (existingDialog) {
            existingDialog.remove();
        }

        const isArabic = currentLanguage === "ar";

        const overlay = document.createElement("div");
        overlay.className = "wb-dialog-overlay";
        overlay.dir = isArabic ? "rtl" : "ltr";

        overlay.innerHTML = `
            <div
                class="wb-dialog-card"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="wbDialogTitle"
                aria-describedby="wbDialogMessage"
            >
                <div class="wb-dialog-icon" aria-hidden="true">
                    ⚠️
                </div>

                <h3 class="wb-dialog-title" id="wbDialogTitle">
                    ${t("confirmTitle")}
                </h3>

                <p class="wb-dialog-message" id="wbDialogMessage">
                    ${message}
                </p>

                <div class="wb-dialog-actions">
                    <button
                        type="button"
                        class="wb-dialog-cancel"
                        data-dialog-action="cancel"
                    >
                        ${t("confirmCancel")}
                    </button>

                    <button
                        type="button"
                        class="wb-dialog-confirm"
                        data-dialog-action="confirm"
                    >
                        ${t("confirmAction")}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const cancelButton = overlay.querySelector(
            '[data-dialog-action="cancel"]'
        );

        const confirmButton = overlay.querySelector(
            '[data-dialog-action="confirm"]'
        );

        function closeDialog() {
            overlay.remove();
            document.removeEventListener("keydown", handleKeydown);
        }

        function handleKeydown(event) {
            if (event.key === "Escape") {
                closeDialog();
            }

            if (event.key === "Enter") {
                event.preventDefault();
                confirmButton.click();
            }
        }

        cancelButton.addEventListener("click", closeDialog);

        confirmButton.addEventListener("click", function () {
            closeDialog();

            if (typeof onConfirm === "function") {
                onConfirm();
            }
        });

        // Clicking outside the card closes the popup.
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                closeDialog();
            }
        });

        document.addEventListener("keydown", handleKeydown);

        // Focus the safe option first.
        cancelButton.focus();
    }

    // ======================================
    // 14. CLEAR WHITEBOARD
    // ======================================

    panel.querySelector('[data-action="clear"]')
        .addEventListener("click", function () {

            showConfirmDialog(t("confirmClear"), function () {
                const rect = canvas.getBoundingClientRect();

                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, rect.width, rect.height);

                resetHistory();
                setStatus(t("cleared"));
            });
        });

    // ======================================
    // 15. SAVE WHITEBOARD
    // ======================================

    function saveBoard() {
        try {
            const board = {
                title:
                    panel.querySelector("#wbBoardTitle").value.trim()
                    || t("boardTitle"),

                image: canvas.toDataURL("image/png"),
                updatedAt: Date.now()
            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(board)
            );

            setStatus(t("saved"));
        } catch (error) {
            setStatus(t("saveError"));
        }
    }

    panel.querySelector('[data-action="save"]')
        .addEventListener("click", saveBoard);

    // ======================================
    // 16. LOAD SAVED WHITEBOARD
    // ======================================

    function loadBoard() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            if (!saved || !saved.image) return;

            const image = new Image();

            image.onload = function () {
                const rect = canvas.getBoundingClientRect();

                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, rect.width, rect.height);

                ctx.drawImage(
                    image,
                    0,
                    0,
                    rect.width,
                    rect.height
                );

                if (saved.title) {
                    panel.querySelector("#wbBoardTitle").value =
                        saved.title;
                }

                resetHistory();
                setStatus(t("restored"));
            };

            image.src = saved.image;
        } catch (error) {
            setStatus(t("loadError"));
        }
    }

    // ======================================
    // 17. EXPORT AS PNG
    // ======================================

    panel.querySelector('[data-action="export"]')
        .addEventListener("click", function () {

            const title =
                panel.querySelector("#wbBoardTitle").value.trim()
                || "whiteboard";

            const link = document.createElement("a");

            link.download =
                title.replace(/[^\w-]+/g, "_") + ".png";

            link.href = canvas.toDataURL("image/png");
            link.click();

            setStatus(t("exported"));
        });

    // ======================================
    // 18. AUTOMATIC LANGUAGE DETECTION
    // ======================================

    function refreshLanguage() {
        const detected = detectLanguage();

        if (detected !== currentLanguage) {
            applyLanguage(detected);
        }
    }

    [
        "languageChanged",
        "languagechange",
        "appLanguageChanged",
        "language-changed"
    ].forEach(function (eventName) {
        window.addEventListener(eventName, refreshLanguage);
        document.addEventListener(eventName, refreshLanguage);
    });

    const languageObserver = new MutationObserver(function () {
        refreshLanguage();
    });

    languageObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
    });

    window.addEventListener("storage", function (event) {
        if (
            event.key &&
            [
                "language",
                "lang",
                "selectedLanguage",
                "appLanguage",
                "studyManagerLanguage",
                "currentLanguage"
            ].includes(event.key)
        ) {
            refreshLanguage();
        }
    });

    const languageInterval = window.setInterval(
        refreshLanguage,
        500
    );

    // ======================================
    // 19. INITIALIZE WHITEBOARD
    // ======================================

    applyLanguage(detectLanguage());

    resizeCanvas();
    loadBoard();
    updateHistoryButtons();

    if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(function () {
            resizeCanvas();
        });

        observer.observe(canvas.parentElement);
    } else {
        window.addEventListener("resize", resizeCanvas);
    }

})();

