
// ===================================
// 1. GET HTML ELEMENTS
// ===================================

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

const searchSubject = document.getElementById("searchSubject");
const searchMessage = document.getElementById("searchMessage");
const subjectList = document.getElementById("subjectList");

const subjectForm = document.getElementById("subjectForm");
const subjectName = document.getElementById("subjectName");
const subjectSubmitButton = subjectForm.querySelector('[type="submit"]');

const welcomeMessage = document.getElementById("welcomeMessage");
const lessonSection = document.getElementById("lessonSection");

const currentSubject = document.getElementById("currentSubject");
const lessonList = document.getElementById("lessonList");

const lessonForm = document.getElementById("lessonForm");
const lessonTitle = document.getElementById("lessonTitle");
const lessonContent = document.getElementById("lessonContent");
const formTitle = document.getElementById("formTitle");

const readingWindow = document.getElementById("readingWindow");
const readingTitle = document.getElementById("readingTitle");
const readingBody = document.getElementById("readingBody");

const showSubjectForm = document.getElementById("showSubjectForm");
const deleteSubjectButton = document.getElementById("deleteSubject");
const showLessonForm = document.getElementById("showLessonForm");
const saveLessonButton = document.getElementById("saveLesson");
const cancelLessonButton = document.getElementById("cancelLesson");
const closeReadingButton = document.getElementById("closeReading");

const languageSwitcher = document.getElementById("languageSwitcher");


// ===================================
// 2. TRANSLATIONS
// ===================================


const translations = {

    en: {
        tagline: "Your personal study library",
        developedBy: "Developed with love by",
        languageLabel: "Language:",
        mySubjects: "My Subjects",
        searchPlaceholder: "Search for a subject...",
        addSubject: "+ Add Subject",
        subjectPlaceholder: "Subject name",
        saveSubject: "Save Subject",
        saveSubjectChanges: "Save Changes",
        welcome: "Welcome!",
        welcomeText: "Select a subject to see its lessons.",
        deleteSubject: "Delete Subject",
        myLessons: "My Lessons",
        addLesson: "+ Add New Lesson",
        addLessonTitle: "Add New Lesson",
        editLessonTitle: "Edit Lesson",
        lessonTitlePlaceholder: "Lesson title",
        lessonContentPlaceholder: "Write your lesson here, or paste HTML...",
        saveLesson: "Save Lesson",
        saveChanges: "Save Changes",
        cancel: "Cancel",
        close: "✕ Close",
        madeWith: "Made with love and dedication",
        developedByFooter: "Developed by",
        developerRole: "Teacher & Front-End Developer",
        copyright: "© {year} Said ElHachmy. All rights reserved.",
        noSubject: "No subject found!",
        duplicateSubject: "This subject already exists!",
        confirmDeleteSubject: "Delete this subject and all its lessons?",
        confirmDeleteLesson: "Delete this lesson?",
        edit: "Edit",
        delete: "Delete"
    },

    ar: {
        tagline: "مكتبتك الدراسية الشخصية",
        developedBy: "تم تطويره بكل حب بواسطة",
        languageLabel: "اللغة:",
        mySubjects: "موادي الدراسية",
        searchPlaceholder: "ابحث عن مادة...",
        addSubject: "+ إضافة مادة",
        subjectPlaceholder: "اسم المادة",
        saveSubject: "حفظ المادة",
        saveSubjectChanges: "حفظ التعديلات",
        welcome: "مرحباً بك!",
        welcomeText: "اختر مادة للاطلاع على دروسها.",
        deleteSubject: "حذف المادة",
        myLessons: "دروسي",
        addLesson: "+ إضافة درس جديد",
        addLessonTitle: "إضافة درس جديد",
        editLessonTitle: "تعديل الدرس",
        lessonTitlePlaceholder: "عنوان الدرس",
        lessonContentPlaceholder: "اكتب درسك هنا أو الصق كود HTML...",
        saveLesson: "حفظ الدرس",
        saveChanges: "حفظ التعديلات",
        cancel: "إلغاء",
        close: "✕ إغلاق",
        madeWith: "صُنع بكل حب وإخلاص",
        developedByFooter: "تطوير",
        developerRole: "معلم ومطور واجهات أمامية",
        copyright: "© {year} سعيد الهاشمي. جميع الحقوق محفوظة.",
        noSubject: "لم يتم العثور على المادة!",
        duplicateSubject: "هذه المادة موجودة بالفعل!",
        confirmDeleteSubject: "هل تريد حذف هذه المادة وجميع دروسها؟",
        confirmDeleteLesson: "هل تريد حذف هذا الدرس؟",
        edit: "تعديل",
        delete: "حذف"
    },

    fr: {
        tagline: "Votre bibliothèque d'étude personnelle",
        developedBy: "Développé avec amour par",
        languageLabel: "Langue :",
        mySubjects: "Mes matières",
        searchPlaceholder: "Rechercher une matière...",
        addSubject: "+ Ajouter une matière",
        subjectPlaceholder: "Nom de la matière",
        saveSubject: "Enregistrer la matière",
        saveSubjectChanges: "Enregistrer les modifications",
        welcome: "Bienvenue !",
        welcomeText: "Sélectionnez une matière pour voir ses leçons.",
        deleteSubject: "Supprimer la matière",
        myLessons: "Mes leçons",
        addLesson: "+ Ajouter une leçon",
        addLessonTitle: "Ajouter une nouvelle leçon",
        editLessonTitle: "Modifier la leçon",
        lessonTitlePlaceholder: "Titre de la leçon",
        lessonContentPlaceholder: "Écrivez votre leçon ici ou collez du HTML...",
        saveLesson: "Enregistrer la leçon",
        saveChanges: "Enregistrer les modifications",
        cancel: "Annuler",
        close: "✕ Fermer",
        madeWith: "Créé avec amour et dévouement",
        developedByFooter: "Développé par",
        developerRole: "Enseignant et développeur Front-End",
        copyright: "© {year} Said ElHachmy. Tous droits réservés.",
        noSubject: "Aucune matière trouvée !",
        duplicateSubject: "Cette matière existe déjà !",
        confirmDeleteSubject: "Supprimer cette matière et toutes ses leçons ?",
        confirmDeleteLesson: "Supprimer cette leçon ?",
        edit: "Modifier",
        delete: "Supprimer"
    }

};


// ===================================
// 3. CURRENT LANGUAGE
// ===================================

let currentLanguage =
    localStorage.getItem("studyManagerLanguage") || "en";

if (!translations[currentLanguage]) {
    currentLanguage = "en";
}

languageSwitcher.value = currentLanguage;

function t(key) {
    return translations[currentLanguage][key] || key;
}


// ===================================
// 3.1. CUSTOM CONFIRMATION POPUP
// ===================================

// Create popup styles.
const confirmationStyle = document.createElement("style");

confirmationStyle.textContent = `
    #customConfirmationOverlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        animation: confirmationFadeIn 0.2s ease;
    }

    #customConfirmationOverlay[hidden] {
        display: none !important;
    }

    #customConfirmationBox {
        width: 100%;
        max-width: 380px;
        padding: 25px;
        border-radius: 16px;
        background: #ffffff;
        color: #222222;
        text-align: center;
        box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25);
        animation: confirmationSlideIn 0.25s ease;
        font-family: inherit;
    }

    #customConfirmationIcon {
        width: 55px;
        height: 55px;
        margin: 0 auto 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #fff0f0;
        color: #dc3545;
        font-size: 27px;
    }

    #customConfirmationHeading {
        margin: 0 0 12px;
        font-size: 21px;
        font-weight: 700;
    }

    #customConfirmationMessage {
        margin: 0 0 24px;
        color: #555555;
        font-size: 15px;
        line-height: 1.7;
        overflow-wrap: anywhere;
    }

    #customConfirmationButtons {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    #customConfirmationButtons button {
        flex: 1;
        min-height: 43px;
        padding: 10px 15px;
        border: none;
        border-radius: 9px;
        cursor: pointer;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        transition: opacity 0.2s, transform 0.2s;
    }

    #customConfirmationButtons button:hover {
        opacity: 0.88;
        transform: translateY(-1px);
    }

    #customConfirmationCancel {
        background: #eeeeee;
        color: #333333;
    }

    #customConfirmationDelete {
        background: #dc3545;
        color: #ffffff;
    }

    #customConfirmationButtons button:focus-visible {
        outline: 3px solid #6c9fff;
        outline-offset: 3px;
    }

    @keyframes confirmationFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes confirmationSlideIn {
        from {
            opacity: 0;
            transform: translateY(15px) scale(0.97);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        #customConfirmationOverlay,
        #customConfirmationBox {
            animation: none;
        }

        #customConfirmationButtons button {
            transition: none;
        }
    }
`;

document.head.appendChild(confirmationStyle);


// Create popup elements.
const confirmationOverlay = document.createElement("div");

confirmationOverlay.id = "customConfirmationOverlay";
confirmationOverlay.hidden = true;

confirmationOverlay.innerHTML = `
    <div
        id="customConfirmationBox"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="customConfirmationHeading"
        aria-describedby="customConfirmationMessage"
        dir="auto"
    >
        <div id="customConfirmationIcon" aria-hidden="true">!</div>

        <h2 id="customConfirmationHeading"></h2>

        <p id="customConfirmationMessage"></p>

        <div id="customConfirmationButtons">
            <button
                type="button"
                id="customConfirmationCancel"
            ></button>

            <button
                type="button"
                id="customConfirmationDelete"
            ></button>
        </div>
    </div>
`;

document.body.appendChild(confirmationOverlay);


// Get popup elements.
const confirmationHeading =
    document.getElementById("customConfirmationHeading");

const confirmationMessage =
    document.getElementById("customConfirmationMessage");

const confirmationCancelButton =
    document.getElementById("customConfirmationCancel");

const confirmationDeleteButton =
    document.getElementById("customConfirmationDelete");

let confirmationCallback = null;
let previousFocusedElement = null;


// Close the popup.
function closeConfirmation(restoreFocus = true) {

    confirmationOverlay.hidden = true;

    confirmationCallback = null;

    document.removeEventListener(
        "keydown",
        handleConfirmationKeyboard
    );

    if (
        restoreFocus &&
        previousFocusedElement &&
        document.contains(previousFocusedElement)
    ) {
        previousFocusedElement.focus();
    }

    previousFocusedElement = null;

}


// Handle Escape key.
function handleConfirmationKeyboard(event) {

    if (event.key === "Escape") {

        event.preventDefault();

        closeConfirmation();

    }

}


// Show the custom confirmation popup.
function showConfirmation(message, callback) {

    previousFocusedElement = document.activeElement;

    confirmationCallback = callback;

    confirmationHeading.textContent = t("delete");

    confirmationMessage.textContent = message;

    confirmationCancelButton.textContent = t("cancel");

    confirmationDeleteButton.textContent = t("delete");

    confirmationOverlay.hidden = false;

    document.addEventListener(
        "keydown",
        handleConfirmationKeyboard
    );

    confirmationCancelButton.focus();

}


// Cancel button.
confirmationCancelButton.addEventListener("click", function() {

    closeConfirmation();

});


// Confirm delete button.
confirmationDeleteButton.addEventListener("click", function() {

    const action = confirmationCallback;

    closeConfirmation();

    if (typeof action === "function") {

        action();

    }

});


// Close when clicking outside the popup.
confirmationOverlay.addEventListener("click", function(event) {

    if (event.target === confirmationOverlay) {

        closeConfirmation();

    }

});


// ===================================
// 4. LOAD SAVED DATA
// ===================================

let subjects = [];

try {

    const savedData = JSON.parse(localStorage.getItem("subjects"));

    if (Array.isArray(savedData)) {

        subjects = savedData.map(function(subject) {

            return {
                name: subject.name || "Untitled Subject",
                lessons: Array.isArray(subject.lessons)
                    ? subject.lessons
                    : []
            };

        });

    }

} catch (error) {

    subjects = [];

}

let selectedSubject = null;
let editingLesson = null;
let editingSubject = null;
let messageTimer;


// ===================================
// 5. INITIAL SCREEN
// ===================================

subjectForm.hidden = true;
lessonForm.hidden = true;
lessonSection.hidden = true;
readingWindow.hidden = true;

welcomeMessage.hidden = false;

readingWindow.style.setProperty(
    "display",
    "none",
    "important"
);


// ===================================
// 6. SAVE DATA
// ===================================

function saveData() {

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

}


// ===================================
// 7. SHOW SEARCH MESSAGE
// ===================================

function showSearchMessage(key) {

    searchMessage.dataset.messageKey = key;
    searchMessage.textContent = t(key);
    searchMessage.style.color = "red";

    clearTimeout(messageTimer);

    messageTimer = setTimeout(function() {

        searchMessage.textContent = "";
        delete searchMessage.dataset.messageKey;

    }, 5000);

}


// ===================================
// 8. SHOW SUBJECTS
// ===================================

function showSubjects() {

    subjectList.innerHTML = "";

    const search = searchSubject.value.toLowerCase().trim();

    let found = 0;

    subjects.forEach(function(subject, index) {

        if (!subject.name.toLowerCase().includes(search)) {
            return;
        }

        found++;

        // Subject container
        const subjectEntry = document.createElement("div");

        subjectEntry.style.display = "flex";
        subjectEntry.style.alignItems = "center";
        subjectEntry.style.gap = "8px";
        subjectEntry.style.width = "100%";
        subjectEntry.style.marginBottom = "8px";

        // Open subject button
        const openButton = document.createElement("button");

        openButton.type = "button";
        openButton.className = "subjectItem";
        openButton.dir = "auto";

        openButton.textContent =
            subject.name + " (" + subject.lessons.length + ")";

        openButton.style.flex = "1";
        openButton.style.minWidth = "0";

        openButton.addEventListener("click", function() {

            openSubject(index);

        });

        // Edit subject button
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "editLesson";
        editButton.textContent = t("edit");

        editButton.addEventListener("click", function() {

            editSubject(index);

        });

        subjectEntry.appendChild(openButton);
        subjectEntry.appendChild(editButton);

        subjectList.appendChild(subjectEntry);

    });

    if (search !== "" && found === 0) {

        showSearchMessage("noSubject");

    } else {

        searchMessage.textContent = "";
        delete searchMessage.dataset.messageKey;

        clearTimeout(messageTimer);

    }

}

searchSubject.addEventListener("input", showSubjects);


// ===================================
// 9. ADD OR EDIT A SUBJECT
// ===================================

// Show the subject form.
showSubjectForm.onclick = function() {

    if (subjectForm.hidden) {

        editingSubject = null;

        subjectForm.reset();

        subjectSubmitButton.textContent = t("saveSubject");

        subjectForm.hidden = false;

    } else {

        subjectForm.hidden = true;

        subjectForm.reset();

        editingSubject = null;

        subjectSubmitButton.textContent = t("saveSubject");

    }

};


// Save a new subject or an edited subject.
subjectForm.onsubmit = function(event) {

    event.preventDefault();

    const name = subjectName.value.trim();

    if (name === "") return;

    // Check for duplicate names.
    const alreadyExists = subjects.some(function(subject, index) {

        if (editingSubject === index) {
            return false;
        }

        return subject.name.toLowerCase() === name.toLowerCase();

    });

    if (alreadyExists) {

        showSearchMessage("duplicateSubject");

        return;

    }

    // Editing an existing subject.
    if (editingSubject !== null) {

        if (!subjects[editingSubject]) return;

        subjects[editingSubject].name = name;

        // Update the currently selected subject heading.
        if (selectedSubject === editingSubject) {

            currentSubject.textContent = name;
            currentSubject.dir = "auto";

        }

    }

    // Adding a new subject.
    else {

        subjects.push({

            name: name,
            lessons: []

        });

    }

    saveData();

    subjectForm.reset();

    subjectForm.hidden = true;

    editingSubject = null;

    subjectSubmitButton.textContent = t("saveSubject");

    searchSubject.value = "";

    showSubjects();

};


// ===================================
// 10. EDIT A SUBJECT
// ===================================

function editSubject(index) {

    if (!subjects[index]) return;

    editingSubject = index;

    subjectName.value = subjects[index].name;

    subjectSubmitButton.textContent = t("saveSubjectChanges");

    subjectForm.hidden = false;

    subjectName.focus();

    subjectForm.scrollIntoView({

        behavior: "smooth",
        block: "center"

    });

}


// ===================================
// 11. OPEN A SUBJECT
// ===================================

function openSubject(index) {

    if (!subjects[index]) return;

    selectedSubject = index;

    currentSubject.textContent = subjects[index].name;
    currentSubject.dir = "auto";

    welcomeMessage.hidden = true;
    lessonSection.hidden = false;

    lessonForm.hidden = true;
    lessonForm.reset();

    closeReading();

    editingLesson = null;

    formTitle.textContent = t("addLessonTitle");

    showLessons();

}


// ===================================
// 12. DELETE A SUBJECT
// ===================================

deleteSubjectButton.onclick = function() {

    if (selectedSubject === null) return;

    showConfirmation(
        t("confirmDeleteSubject"),
        function() {

            subjects.splice(selectedSubject, 1);

            selectedSubject = null;

            editingSubject = null;

            saveData();

            lessonSection.hidden = true;
            lessonForm.hidden = true;

            closeReading();

            welcomeMessage.hidden = false;

            showSubjects();

        }
    );

};


// ===================================
// 13. SHOW LESSONS
// ===================================

function showLessons() {

    lessonList.innerHTML = "";

    if (selectedSubject === null) return;

    const subject = subjects[selectedSubject];

    if (!subject) return;

    subject.lessons.forEach(function(lesson, index) {

        const item = document.createElement("div");

        item.className = "lessonItem";
        item.style.cursor = "pointer";

        const title = document.createElement("span");

        title.className = "lessonTitle";
        title.textContent = lesson.title;
        title.dir = "auto";

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = t("edit");
        editButton.className = "editLesson";

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = t("delete");
        deleteButton.className = "deleteLesson";

        item.addEventListener("click", function(event) {

            if (
                event.target.closest(".editLesson") ||
                event.target.closest(".deleteLesson")
            ) {
                return;
            }

            openLesson(index);

        });

        editButton.addEventListener("click", function(event) {

            event.stopPropagation();

            editLesson(index);

        });

        deleteButton.addEventListener("click", function(event) {

            event.stopPropagation();

            deleteLesson(index);

        });

        item.appendChild(title);
        item.appendChild(editButton);
        item.appendChild(deleteButton);

        lessonList.appendChild(item);

    });

}


// ===================================
// 14. SHOW ADD LESSON FORM
// ===================================

showLessonForm.onclick = function() {

    if (selectedSubject === null) return;

    editingLesson = null;

    lessonForm.reset();

    formTitle.textContent = t("addLessonTitle");

    saveLessonButton.textContent = t("saveLesson");

    lessonForm.hidden = false;

};


// ===================================
// 15. ADD OR EDIT A LESSON
// ===================================

lessonForm.onsubmit = function(event) {

    event.preventDefault();

    if (selectedSubject === null) return;

    const subject = subjects[selectedSubject];

    if (!subject) return;

    const title = lessonTitle.value.trim();
    const content = lessonContent.value;

    if (title === "" || content.trim() === "") return;

    if (editingLesson === null) {

        subject.lessons.push({

            title: title,
            content: content

        });

    } else {

        subject.lessons[editingLesson].title = title;

        subject.lessons[editingLesson].content = content;

    }

    saveData();

    lessonForm.reset();

    lessonForm.hidden = true;

    editingLesson = null;

    formTitle.textContent = t("addLessonTitle");

    saveLessonButton.textContent = t("saveLesson");

    showLessons();

};


// ===================================
// 16. EDIT A LESSON
// ===================================

function editLesson(index) {

    const subject = subjects[selectedSubject];

    if (!subject || !subject.lessons[index]) return;

    const lesson = subject.lessons[index];

    editingLesson = index;

    lessonTitle.value = lesson.title;

    lessonContent.value = lesson.content;

    formTitle.textContent = t("editLessonTitle");

    saveLessonButton.textContent = t("saveChanges");

    lessonForm.hidden = false;

    lessonForm.scrollIntoView({

        behavior: "smooth",
        block: "center"

    });

}


// ===================================
// 17. DELETE A LESSON
// ===================================

function deleteLesson(index) {

    const subject = subjects[selectedSubject];

    if (!subject || !subject.lessons[index]) return;

    showConfirmation(
        t("confirmDeleteLesson"),
        function() {

            subject.lessons.splice(index, 1);

            saveData();

            showLessons();

        }
    );

}


// ===================================
// 18. CANCEL LESSON FORM
// ===================================

cancelLessonButton.onclick = function() {

    lessonForm.reset();

    lessonForm.hidden = true;

    editingLesson = null;

    formTitle.textContent = t("addLessonTitle");

    saveLessonButton.textContent = t("saveLesson");

};


// ===================================
// 19. OPEN AND READ A LESSON
// ===================================

function openLesson(index) {

    if (selectedSubject === null) return;

    const subject = subjects[selectedSubject];

    if (!subject || !subject.lessons[index]) return;

    const lesson = subject.lessons[index];

    readingTitle.textContent = lesson.title;

    readingTitle.dir = "auto";

    const containsHTML = /<\/?[a-z][\s\S]*?>/i.test(
        lesson.content
    );

    if (containsHTML) {

        readingBody.innerHTML = lesson.content;

    } else {

        readingBody.textContent = lesson.content;

    }

    readingBody.dir = "auto";

    readingWindow.hidden = false;

    readingWindow.style.setProperty(
        "display",
        "flex",
        "important"
    );

}


// ===================================
// 20. CLOSE READING WINDOW
// ===================================

function closeReading() {

    readingWindow.hidden = true;

    readingWindow.style.setProperty(
        "display",
        "none",
        "important"
    );

}

closeReadingButton.onclick = closeReading;


// ===================================
// 21. APPLY LANGUAGE
// ===================================

function applyLanguage() {

    const isArabic = currentLanguage === "ar";

    document.documentElement.lang = currentLanguage;

    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    document.title =
        currentLanguage === "ar"
            ? "مدير الدراسة | سعيد الهاشمي"
            : currentLanguage === "fr"
                ? "Gestionnaire d'études | Said ElHachmy"
                : "Study Manager | Said ElHachmy";


    // Translate normal text.
    document.querySelectorAll("[data-i18n]").forEach(function(element) {

        const key = element.dataset.i18n;

        const translation = t(key);

        element.textContent = translation.replace(
            "{year}",
            new Date().getFullYear()
        );

    });


    // Translate placeholders.
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function(element) {

        const key = element.dataset.i18nPlaceholder;

        element.placeholder = t(key);

    });


    // Keep user-created names and lesson content unchanged.
    currentSubject.dir = "auto";
    readingTitle.dir = "auto";
    readingBody.dir = "auto";
    lessonTitle.dir = "auto";
    lessonContent.dir = "auto";
    subjectName.dir = "auto";


    // Update dynamically generated subject and lesson buttons.
    showSubjects();

    if (selectedSubject !== null) {

        showLessons();

    }


    // Update subject form button.
    subjectSubmitButton.textContent =
        editingSubject === null
            ? t("saveSubject")
            : t("saveSubjectChanges");


    // Update lesson form button.
    saveLessonButton.textContent =
        editingLesson === null
            ? t("saveLesson")
            : t("saveChanges");


    // Update lesson form heading.
    formTitle.textContent =
        editingLesson === null
            ? t("addLessonTitle")
            : t("editLessonTitle");


    // Update any active search message.
    if (searchMessage.dataset.messageKey) {

        searchMessage.textContent =
            t(searchMessage.dataset.messageKey);

    }

}


// ===================================
// 22. CHANGE LANGUAGE
// ===================================

languageSwitcher.addEventListener("change", function() {

    currentLanguage = languageSwitcher.value;

    localStorage.setItem(
        "studyManagerLanguage",
        currentLanguage
    );

    applyLanguage();

});


// ===================================
// 23. START APPLICATION
// ===================================

// Apply the saved language.
applyLanguage();

// Load saved subjects.
showSubjects();
