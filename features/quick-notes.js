/* =====================================================
   STUDY MANAGER - QUICK NOTES
   Independent feature: features/quick-notes.js
   Supports English, Arabic and French.
===================================================== */

(function () {
    "use strict";

    const STORAGE_KEY = "studyManagerQuickNotes";
    const PANEL_ID = "quickNotesPanel";

    const translations = {
        en: {
            title: "Quick Notes",
            subtitle: "Keep your important thoughts in one place.",
            add: "+ Add Note",
            search: "Search your notes...",
            pinned: "Pinned Notes",
            all: "All Notes",
            empty: "You haven't created any notes yet.",
            noResults: "No notes match your search.",
            noPinned: "No pinned notes.",
            titlePlaceholder: "Note title",
            contentPlaceholder: "Write your note here...",
            save: "Save Note",
            update: "Save Changes",
            cancel: "Cancel",
            edit: "Edit",
            remove: "Remove",
            pin: "Pin",
            unpin: "Unpin",
            required: "Please enter a title and some note content.",
            deleteTitle: "Remove this note?",
            deleteText: "This action cannot be undone.",
            confirmRemove: "Yes, Remove",
            keep: "Keep Note",
            updated: "Updated",
            noteCount: "notes",
            pinnedLabel: "Pinned"
        },

        ar: {
            title: "ملاحظاتي السريعة",
            subtitle: "احتفظ بأفكارك وملاحظاتك المهمة في مكان واحد.",
            add: "+ إضافة ملاحظة",
            search: "ابحث في ملاحظاتك...",
            pinned: "الملاحظات المثبتة",
            all: "جميع الملاحظات",
            empty: "لم تقم بإضافة أي ملاحظات بعد.",
            noResults: "لا توجد ملاحظات تطابق بحثك.",
            noPinned: "لا توجد ملاحظات مثبتة.",
            titlePlaceholder: "عنوان الملاحظة",
            contentPlaceholder: "اكتب ملاحظتك هنا...",
            save: "حفظ الملاحظة",
            update: "حفظ التعديلات",
            cancel: "إلغاء",
            edit: "تعديل",
            remove: "حذف",
            pin: "تثبيت",
            unpin: "إلغاء التثبيت",
            required: "يرجى إدخال عنوان الملاحظة ومحتواها.",
            deleteTitle: "هل تريد حذف هذه الملاحظة؟",
            deleteText: "لا يمكن التراجع عن هذا الإجراء.",
            confirmRemove: "نعم، احذف",
            keep: "الاحتفاظ بها",
            updated: "آخر تعديل",
            noteCount: "ملاحظات",
            pinnedLabel: "مثبتة"
        },

        fr: {
            title: "Notes rapides",
            subtitle: "Gardez vos idées importantes au même endroit.",
            add: "+ Ajouter une note",
            search: "Rechercher dans vos notes...",
            pinned: "Notes épinglées",
            all: "Toutes les notes",
            empty: "Vous n'avez pas encore créé de notes.",
            noResults: "Aucune note ne correspond à votre recherche.",
            noPinned: "Aucune note épinglée.",
            titlePlaceholder: "Titre de la note",
            contentPlaceholder: "Écrivez votre note ici...",
            save: "Enregistrer la note",
            update: "Enregistrer les modifications",
            cancel: "Annuler",
            edit: "Modifier",
            remove: "Supprimer",
            pin: "Épingler",
            unpin: "Désépingler",
            required: "Veuillez saisir un titre et le contenu de la note.",
            deleteTitle: "Supprimer cette note ?",
            deleteText: "Cette action est irréversible.",
            confirmRemove: "Oui, supprimer",
            keep: "Conserver",
            updated: "Modifiée",
            noteCount: "notes",
            pinnedLabel: "Épinglée"
        }
    };

    let notes = loadNotes();
    let editingId = null;
    let pendingDeleteId = null;
    let panel = null;
    let currentLanguage = "en";
    let lastFocusedElement = null;

    let confirmKeyHandler = null;

    /* =========================================
       STORAGE
    ========================================= */

    function loadNotes() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            return [];
        }
    }

    function saveNotes() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(notes)
            );
        } catch (error) {
            console.warn(
                "Quick Notes: Could not save notes.",
                error
            );
        }
    }

    /* =========================================
       LANGUAGE
    ========================================= */

    function getLanguage() {
        const language = (
            document.documentElement.lang ||
            document.getElementById("languageSwitcher")?.value ||
            "en"
        ).toLowerCase().slice(0, 2);

        return translations[language] ? language : "en";
    }

    function t(key) {
        return translations[currentLanguage][key] ||
            translations.en[key] ||
            key;
    }

    function updateLanguage() {
        if (!panel) return;

        currentLanguage = getLanguage();

        const isArabic = currentLanguage === "ar";

        panel.dir = isArabic ? "rtl" : "ltr";
        panel.lang = currentLanguage;

        panel.querySelector(".qn-title").textContent = t("title");
        panel.querySelector(".qn-subtitle").textContent = t("subtitle");
        panel.querySelector(".qn-add").textContent = t("add");
        panel.querySelector(".qn-search").placeholder = t("search");

        panel.querySelector(".qn-pinned-heading").textContent = t("pinned");
        panel.querySelector(".qn-all-heading").textContent = t("all");

        panel.querySelector(".qn-note-title").placeholder =
            t("titlePlaceholder");

        panel.querySelector(".qn-note-content").placeholder =
            t("contentPlaceholder");

        panel.querySelector(".qn-cancel").textContent = t("cancel");

        panel.querySelector(".qn-confirm-title").textContent =
            t("deleteTitle");

        panel.querySelector(".qn-confirm-text").textContent =
            t("deleteText");

        panel.querySelector(".qn-confirm-remove").textContent =
            t("confirmRemove");

        panel.querySelector(".qn-keep").textContent = t("keep");

        if (!panel.querySelector(".qn-editor").hidden) {
            panel.querySelector(".qn-editor-heading").textContent =
                editingId ? t("edit") : t("add").replace("+ ", "");

            panel.querySelector(".qn-save").textContent =
                editingId ? t("update") : t("save");
        }

        renderNotes();
    }

    /* =========================================
       PANEL CREATION
    ========================================= */

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;

        panel = document.createElement("section");
        panel.id = PANEL_ID;
        panel.className = "qn-panel";

        panel.innerHTML = `
            <div class="qn-header">
                <div class="qn-heading">
                    <h2 class="qn-title"></h2>
                    <p class="qn-subtitle"></p>
                </div>

                <button type="button" class="qn-button qn-add"></button>
            </div>

            <div class="qn-search-wrap">
                <input
                    type="search"
                    class="qn-search"
                    autocomplete="off"
                >
            </div>

            <div class="qn-editor" hidden>
                <h3 class="qn-editor-heading"></h3>

                <input
                    type="text"
                    class="qn-input qn-note-title"
                    maxlength="120"
                >

                <textarea
                    class="qn-input qn-note-content"
                    rows="5"
                ></textarea>

                <p class="qn-error" role="alert" hidden></p>

                <div class="qn-editor-actions">
                    <button type="button" class="qn-button qn-save"></button>
                    <button type="button" class="qn-button qn-cancel"></button>
                </div>
            </div>

            <div class="qn-pinned-section">
                <h3 class="qn-section-title qn-pinned-heading"></h3>
                <div class="qn-pinned-list"></div>
                <p class="qn-empty-pinned" hidden></p>
            </div>

            <div class="qn-all-section">
                <h3 class="qn-section-title qn-all-heading"></h3>
                <div class="qn-notes-list"></div>
                <p class="qn-empty" hidden></p>
            </div>

            <div class="qn-confirm-overlay" hidden>
                <div
                    class="qn-confirm-box"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="qnConfirmTitle"
                    aria-describedby="qnConfirmText"
                    tabindex="-1"
                >
                    <div class="qn-confirm-icon" aria-hidden="true">
                        🗑️
                    </div>

                    <h3
                        class="qn-confirm-title"
                        id="qnConfirmTitle"
                    ></h3>

                    <p
                        class="qn-confirm-text"
                        id="qnConfirmText"
                    ></p>

                    <div class="qn-confirm-actions">
                        <button
                            type="button"
                            class="qn-button qn-confirm-remove"
                        ></button>

                        <button
                            type="button"
                            class="qn-button qn-keep"
                        ></button>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement("style");
        style.id = "quickNotesStyles";

        style.textContent = `
            .qn-panel {
                --qn-green: #176b50;
                --qn-blue: #2878c7;
                --qn-red: #d94b4b;
                --qn-gold: #d9a441;
                --qn-gray: #718078;

                position: relative;
                width: 100%;
                box-sizing: border-box;
                margin: 24px 0;
                padding: 22px;
                background: var(--surface, #fff);
                color: var(--text, #24372f);
                border: 1px solid var(--border, #e4ece7);
                border-radius: 16px;
                box-shadow: var(--shadow, 0 8px 25px rgba(24,65,47,.07));
                font-family: inherit;
            }

            .qn-panel *,
            .qn-panel *::before,
            .qn-panel *::after {
                box-sizing: border-box;
            }

            .qn-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 14px;
                margin-bottom: 18px;
            }

            .qn-heading {
                min-width: 0;
            }

            .qn-title {
                margin: 0 0 5px;
                color: var(--primary, #176b50);
                font-size: 22px;
                font-weight: 800;
            }

            .qn-subtitle {
                margin: 0;
                color: var(--muted, #7b8b83);
                font-size: 13px;
                line-height: 1.6;
            }

            .qn-button {
                border: 0;
                border-radius: 9px;
                padding: 10px 14px;
                font: inherit;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                transition: transform .15s, filter .15s;
            }

            .qn-button:hover {
                filter: brightness(.94);
                transform: translateY(-1px);
            }

            .qn-button:focus-visible,
            .qn-search:focus-visible,
            .qn-input:focus-visible {
                outline: 3px solid rgba(40,120,199,.22);
                outline-offset: 2px;
            }

            .qn-add,
            .qn-save {
                color: #fff;
                background: var(--qn-green);
            }

            .qn-search-wrap {
                margin-bottom: 22px;
            }

            .qn-search,
            .qn-input {
                display: block;
                width: 100%;
                min-width: 0;
                padding: 12px 14px;
                border: 1px solid var(--border, #e4ece7);
                border-radius: 10px;
                background: var(--background, #f3f7f5);
                color: var(--text, #24372f);
                font: inherit;
                font-size: 14px;
            }

            .qn-search:focus,
            .qn-input:focus {
                border-color: var(--primary, #176b50);
                outline: none;
            }

            .qn-editor {
                margin: 0 0 24px;
                padding: 18px;
                border: 1px solid var(--border, #e4ece7);
                border-radius: 13px;
                background: var(--background, #f3f7f5);
            }

            .qn-editor[hidden],
            .qn-confirm-overlay[hidden],
            .qn-empty[hidden],
            .qn-empty-pinned[hidden],
            .qn-pinned-section[hidden] {
                display: none !important;
            }

            .qn-editor-heading {
                margin: 0 0 14px;
                font-size: 16px;
                font-weight: 800;
            }

            .qn-note-title {
                margin-bottom: 10px;
            }

            .qn-note-content {
                resize: vertical;
                min-height: 110px;
                line-height: 1.7;
            }

            .qn-editor-actions,
            .qn-confirm-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 9px;
                margin-top: 13px;
            }

            .qn-cancel,
            .qn-keep {
                color: var(--text, #24372f);
                background: #e7ece9;
            }

            .qn-error {
                margin: 10px 0 0;
                color: var(--qn-red);
                font-size: 13px;
            }

            .qn-section-title {
                margin: 20px 0 12px;
                font-size: 16px;
                font-weight: 800;
            }

            .qn-pinned-section {
                margin-bottom: 18px;
                padding: 14px;
                border-radius: 13px;
                background: rgba(217,164,65,.08);
                border: 1px solid rgba(217,164,65,.24);
            }

            .qn-pinned-section .qn-section-title {
                margin-top: 0;
                color: #a7791e;
            }

            .qn-notes-list,
            .qn-pinned-list {
                display: grid;
                grid-template-columns: repeat(
                    auto-fit,
                    minmax(min(100%, 240px), 1fr)
                );
                gap: 12px;
            }

            .qn-card {
                min-width: 0;
                padding: 15px;
                border: 1px solid var(--border, #e4ece7);
                border-radius: 12px;
                background: var(--surface, #fff);
                overflow-wrap: anywhere;
            }

            .qn-pinned-list .qn-card {
                border-color: rgba(217,164,65,.4);
            }

            .qn-card-top {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 8px;
            }

            .qn-card-title {
                margin: 0;
                font-size: 15px;
                font-weight: 800;
                line-height: 1.5;
            }

            .qn-pin-label {
                flex: 0 0 auto;
                padding: 4px 7px;
                border-radius: 20px;
                background: rgba(217,164,65,.16);
                color: #9b701b;
                font-size: 10px;
                font-weight: 800;
            }

            .qn-card-content {
                margin: 10px 0 13px;
                color: var(--text, #24372f);
                font-size: 13px;
                line-height: 1.75;
                white-space: pre-wrap;
            }

            .qn-card-date {
                display: block;
                margin-bottom: 12px;
                color: var(--muted, #7b8b83);
                font-size: 10px;
            }

            .qn-card-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 7px;
                padding-top: 11px;
                border-top: 1px solid var(--border, #e4ece7);
            }

            .qn-action {
                padding: 7px 10px;
                border: 0;
                border-radius: 7px;
                font: inherit;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
            }

            .qn-edit {
                background: #e5f0ff;
                color: #2166ad;
            }

            .qn-remove {
                background: #ffebeb;
                color: #c63838;
            }

            .qn-pin {
                background: #fff3d8;
                color: #946711;
            }

            .qn-unpin {
                background: #edf0ef;
                color: #59665f;
            }

            .qn-empty,
            .qn-empty-pinned {
                margin: 10px 0;
                padding: 15px;
                text-align: center;
                color: var(--muted, #7b8b83);
                font-size: 13px;
            }

            /* =====================================
               CUSTOM DELETE CONFIRMATION
            ===================================== */

            .qn-confirm-overlay {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                background: rgba(15, 30, 23, .62);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                animation: qnFadeIn .18s ease;
            }

            .qn-confirm-box {
                width: min(100%, 390px);
                padding: 25px;
                border: 1px solid rgba(255,255,255,.7);
                border-radius: 19px;
                background: var(--surface, #fff);
                color: var(--text, #24372f);
                text-align: center;
                box-shadow: 0 20px 65px rgba(0,0,0,.24);
                animation: qnPopupIn .22s ease;
                outline: none;
            }

            .qn-confirm-icon {
                width: 58px;
                height: 58px;
                display: grid;
                place-items: center;
                margin: 0 auto 16px;
                border-radius: 50%;
                background: #fff0ef;
                color: var(--qn-red);
                font-size: 26px;
            }

            .qn-confirm-title {
                margin: 0 0 9px;
                font-size: 19px;
                font-weight: 800;
                line-height: 1.5;
            }

            .qn-confirm-text {
                margin: 0;
                color: var(--muted, #7b8b83);
                font-size: 13px;
                line-height: 1.7;
            }

            .qn-confirm-actions {
                display: flex;
                gap: 10px;
                margin-top: 23px;
            }

            .qn-confirm-actions button {
                flex: 1;
                min-height: 43px;
                border-radius: 10px;
                font-size: 13px;
            }

            .qn-confirm-remove {
                color: #fff;
                background: var(--qn-red);
            }

            .qn-confirm-remove:hover {
                background: #bd3737;
                filter: none;
            }

            .qn-keep {
                color: #365348;
                background: #eaf1ed;
            }

            .qn-confirm-actions button:focus-visible {
                outline: 3px solid rgba(40,120,199,.3);
                outline-offset: 3px;
            }

            @keyframes qnFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes qnPopupIn {
                from {
                    opacity: 0;
                    transform: translateY(12px) scale(.97);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @media (max-width: 520px) {
                .qn-panel {
                    padding: 15px;
                }

                .qn-header {
                    align-items: stretch;
                }

                .qn-add {
                    width: 100%;
                }

                .qn-card-actions .qn-action {
                    flex: 1 1 auto;
                }

                .qn-confirm-box {
                    padding: 22px 18px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .qn-confirm-overlay,
                .qn-confirm-box {
                    animation: none;
                }
            }
        `;

        if (!document.getElementById("quickNotesStyles")) {
            document.head.appendChild(style);
        }

        const featureContainer =
            document.getElementById("studyManagerFeatures");

        if (featureContainer) {
            featureContainer.appendChild(panel);
        } else {
            console.warn(
                "Study Manager: #studyManagerFeatures container was not found."
            );

            return;
        }

        connectEvents();
        updateLanguage();
        renderNotes();
    }

    /* =========================================
       NOTE CARDS
    ========================================= */

    function createNoteCard(note) {
        const card = document.createElement("article");
        card.className = "qn-card";

        const top = document.createElement("div");
        top.className = "qn-card-top";

        const title = document.createElement("h4");
        title.className = "qn-card-title";
        title.textContent = note.title;

        top.appendChild(title);

        if (note.pinned) {
            const pinLabel = document.createElement("span");
            pinLabel.className = "qn-pin-label";
            pinLabel.textContent = t("pinnedLabel");
            top.appendChild(pinLabel);
        }

        const content = document.createElement("p");
        content.className = "qn-card-content";
        content.textContent = note.content;

        const date = document.createElement("span");
        date.className = "qn-card-date";
        date.textContent =
            `${t("updated")}: ${formatDate(note.updatedAt)}`;

        const actions = document.createElement("div");
        actions.className = "qn-card-actions";

        actions.appendChild(
            makeAction("edit", t("edit"), note.id, "qn-edit")
        );

        actions.appendChild(
            makeAction(
                note.pinned ? "unpin" : "pin",
                t(note.pinned ? "unpin" : "pin"),
                note.id,
                note.pinned ? "qn-unpin" : "qn-pin"
            )
        );

        actions.appendChild(
            makeAction("remove", t("remove"), note.id, "qn-remove")
        );

        card.append(top, content, date, actions);

        return card;
    }

    function makeAction(action, label, id, className) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = `qn-action ${className}`;
        button.dataset.action = action;
        button.dataset.id = id;
        button.textContent = label;

        return button;
    }

    function formatDate(timestamp) {
        try {
            return new Intl.DateTimeFormat(currentLanguage, {
                dateStyle: "medium",
                timeStyle: "short"
            }).format(new Date(timestamp));
        } catch (error) {
            return new Date(timestamp).toLocaleString();
        }
    }

    /* =========================================
       RENDER NOTES
    ========================================= */

    function renderNotes() {
        if (!panel) return;

        const query = panel.querySelector(".qn-search").value
            .trim()
            .toLocaleLowerCase();

        const filtered = notes.filter(note =>
            `${note.title} ${note.content}`
                .toLocaleLowerCase()
                .includes(query)
        );

        const pinned = filtered
            .filter(note => note.pinned)
            .sort((a, b) => b.updatedAt - a.updatedAt);

        const ordinary = filtered
            .filter(note => !note.pinned)
            .sort((a, b) => b.updatedAt - a.updatedAt);

        const pinnedList =
            panel.querySelector(".qn-pinned-list");

        const notesList =
            panel.querySelector(".qn-notes-list");

        pinnedList.replaceChildren();
        notesList.replaceChildren();

        pinned.forEach(note => {
            pinnedList.appendChild(createNoteCard(note));
        });

        ordinary.forEach(note => {
            notesList.appendChild(createNoteCard(note));
        });

        panel.querySelector(".qn-pinned-section").hidden =
            pinned.length === 0;

        panel.querySelector(".qn-empty-pinned").hidden = true;

        const emptyMessage = panel.querySelector(".qn-empty");

        emptyMessage.hidden = filtered.length !== 0;

        emptyMessage.textContent =
            notes.length === 0 ? t("empty") : t("noResults");
    }

    /* =========================================
       NOTE EDITOR
    ========================================= */

    function openEditor(note = null) {
        const editor = panel.querySelector(".qn-editor");
        const titleInput = panel.querySelector(".qn-note-title");
        const contentInput = panel.querySelector(".qn-note-content");

        editingId = note ? note.id : null;

        titleInput.value = note ? note.title : "";
        contentInput.value = note ? note.content : "";

        panel.querySelector(".qn-editor-heading").textContent =
            note ? t("edit") : t("add").replace("+ ", "");

        panel.querySelector(".qn-save").textContent =
            note ? t("update") : t("save");

        panel.querySelector(".qn-error").hidden = true;

        editor.hidden = false;

        titleInput.focus();

        editor.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    function closeEditor() {
        panel.querySelector(".qn-editor").hidden = true;
        panel.querySelector(".qn-note-title").value = "";
        panel.querySelector(".qn-note-content").value = "";
        panel.querySelector(".qn-error").hidden = true;

        editingId = null;
    }

    function saveEditor() {
        const title =
            panel.querySelector(".qn-note-title").value.trim();

        const content =
            panel.querySelector(".qn-note-content").value.trim();

        const error = panel.querySelector(".qn-error");

        if (!title || !content) {
            error.textContent = t("required");
            error.hidden = false;
            return;
        }

        const now = Date.now();

        if (editingId) {
            const note = notes.find(
                item => item.id === editingId
            );

            if (note) {
                note.title = title;
                note.content = content;
                note.updatedAt = now;
            }
        } else {
            notes.push({
                id: createId(),
                title,
                content,
                pinned: false,
                createdAt: now,
                updatedAt: now
            });
        }

        saveNotes();
        closeEditor();
        renderNotes();
    }

    function createId() {
        return "qn-" +
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).slice(2, 9);
    }

    /* =========================================
       CUSTOM DELETE CONFIRMATION
    ========================================= */

    function showDeleteConfirmation(id) {
        const note = notes.find(item => item.id === id);

        if (!note) return;

        const overlay =
            panel.querySelector(".qn-confirm-overlay");

        const dialog =
            panel.querySelector(".qn-confirm-box");

        pendingDeleteId = id;
        lastFocusedElement = document.activeElement;

        overlay.hidden = false;

        confirmKeyHandler = handleConfirmKeydown;

        document.addEventListener(
            "keydown",
            confirmKeyHandler
        );

        // Focus the safe option instead of the destructive button.
        panel.querySelector(".qn-keep").focus();

        dialog.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    function closeDeleteConfirmation() {
        const overlay =
            panel.querySelector(".qn-confirm-overlay");

        overlay.hidden = true;

        pendingDeleteId = null;

        if (confirmKeyHandler) {
            document.removeEventListener(
                "keydown",
                confirmKeyHandler
            );

            confirmKeyHandler = null;
        }

        // Restore focus to the element that opened the popup.
        if (
            lastFocusedElement &&
            document.contains(lastFocusedElement)
        ) {
            lastFocusedElement.focus();
        }

        lastFocusedElement = null;
    }

    function handleConfirmKeydown(event) {
        const overlay =
            panel.querySelector(".qn-confirm-overlay");

        if (overlay.hidden) return;

        // Escape closes the popup.
        if (event.key === "Escape") {
            event.preventDefault();
            closeDeleteConfirmation();
            return;
        }

        // Keep keyboard navigation inside the confirmation card.
        if (event.key === "Tab") {
            const buttons = Array.from(
                overlay.querySelectorAll(
                    "button:not(:disabled)"
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

    function removeNote() {
        if (!pendingDeleteId) return;

        const id = pendingDeleteId;

        notes = notes.filter(note => note.id !== id);

        if (editingId === id) {
            closeEditor();
        }

        saveNotes();

        closeDeleteConfirmation();

        renderNotes();
    }

    /* =========================================
       EVENTS
    ========================================= */

    function connectEvents() {
        panel.querySelector(".qn-add").addEventListener(
            "click",
            () => openEditor()
        );

        panel.querySelector(".qn-save").addEventListener(
            "click",
            saveEditor
        );

        panel.querySelector(".qn-cancel").addEventListener(
            "click",
            closeEditor
        );

        panel.querySelector(".qn-search").addEventListener(
            "input",
            renderNotes
        );

        panel.querySelector(".qn-pinned-list").addEventListener(
            "click",
            handleCardAction
        );

        panel.querySelector(".qn-notes-list").addEventListener(
            "click",
            handleCardAction
        );

        panel.querySelector(".qn-confirm-remove").addEventListener(
            "click",
            removeNote
        );

        panel.querySelector(".qn-keep").addEventListener(
            "click",
            closeDeleteConfirmation
        );

        // Clicking outside the confirmation card closes it.
        panel.querySelector(".qn-confirm-overlay").addEventListener(
            "click",
            event => {
                if (event.target === event.currentTarget) {
                    closeDeleteConfirmation();
                }
            }
        );

        panel.querySelector(".qn-note-content").addEventListener(
            "keydown",
            event => {
                if (
                    event.key === "Enter" &&
                    (event.ctrlKey || event.metaKey)
                ) {
                    saveEditor();
                }
            }
        );
    }

    function handleCardAction(event) {
        const button = event.target.closest(
            "button[data-action]"
        );

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        const note = notes.find(item => item.id === id);

        if (!note) return;

        if (action === "edit") {
            openEditor(note);
        }

        if (action === "pin" || action === "unpin") {
            note.pinned = action === "pin";
            note.updatedAt = Date.now();

            saveNotes();
            renderNotes();
        }

        if (action === "remove") {
            showDeleteConfirmation(id);
        }
    }

    /* =========================================
       INITIALIZATION
    ========================================= */

    function start() {
        createPanel();

        if (!panel) return;

        const languageSwitcher =
            document.getElementById("languageSwitcher");

        if (languageSwitcher) {
            languageSwitcher.addEventListener(
                "change",
                updateLanguage
            );
        }

        // Watch for changes to the document language.
        if (window.MutationObserver) {
            const observer = new MutationObserver(
                updateLanguage
            );

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["lang", "dir"]
            });
        }

        // Listen for language changes from other app components.
        document.addEventListener(
            "languageChanged",
            updateLanguage
        );

        document.addEventListener(
            "language-changed",
            updateLanguage
        );

        window.addEventListener(
            "languageChanged",
            updateLanguage
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            start,
            { once: true }
        );
    } else {
        start();
    }

})();
