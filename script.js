let searchInput = document.getElementById("note-search");
let allNotesBtn = document.getElementById("notes");
let newNoteBtn = document.getElementById("new");
let addNoteIcon = document.getElementById("add-note-fab");
let formContent = document.getElementById("form-content");
let notesList = document.getElementById("notes-list");

let allNoteList = document.getElementById("all-notes__list");
let pinnedNoteList = document.getElementById("pinned-note__list");
let noteTitle = document.getElementById("title");
let noteAuthor = document.getElementById("author");
let noteTextarea = document.getElementById("text");
let addNoteBtn = document.getElementById("add-note");
let addPinnedNoteBtn = document.getElementById("add-pinned-note");
let resetNoteForm = document.getElementById("reset");

//revealFormHideNotes

newNoteBtn.addEventListener("click", () => {
  revealFormHideNotes();
});

addNoteIcon.addEventListener("click", () => {
  revealFormHideNotes();
});

//revealNotesHideForm

allNotesBtn.addEventListener("click", () => {
  revealNotesHideForm();
});

function revealFormHideNotes() {
  formContent.style.display = "block";
  notesList.style.display = "none";
  newNoteBtn.classList.add("active");
  allNotesBtn.classList.remove("active");
}
function revealNotesHideForm() {
  notesList.style.display = "block";
  formContent.style.display = "none";
  allNotesBtn.classList.add("active");
  newNoteBtn.classList.remove("active");
}

addPinnedNoteBtn.addEventListener("click", () => {
  addNote(true);
});

addNoteBtn.addEventListener("click", () => {
  addNote(false);
});

function resetNote() {
  noteTitle.value = "";
  noteAuthor.value = "";
  noteTextarea.value = "";
}

function addNote(isPinned = false) {
  let noteTitleValue = noteTitle.value.trim();
  let noteAuthorValue = noteAuthor.value.trim();
  let noteTextareaValue = noteTextarea.value.trim();
  let today = new Date();
  let dateString = today.toLocaleString();

  if (noteTitleValue && noteAuthorValue && noteTextareaValue) {
    addNoteEle(
      noteTitleValue,
      noteTextareaValue,
      noteAuthorValue,
      dateString,
      isPinned
    );
    resetNote();
    revealNotesHideForm();
  } else {
    alert("Please Fill All Fields");
    return;
  }
}

function addNoteEle(title, noteText, author, date, isPinned) {
  let noteLi = document.createElement("li");

  // ==== Header ====
  let noteHeadingDiv = document.createElement("div");
  noteHeadingDiv.classList.add("item-header");

  let h4 = document.createElement("h4");
  h4.textContent = `Title: ${trimText(title, 13)}`;
  noteHeadingDiv.appendChild(h4);

  let noteCardgDiv = document.createElement("div");
  noteCardgDiv.classList.add("note-card");

  // Optionally add pin icon if not pinned
  if (!isPinned) {
    let pinBtn = document.createElement("button");
    pinBtn.classList.add("icon-button", "pin");
    let pinIcon = document.createElement("i");
    pinIcon.classList.add("fas", "fa-thumbtack");
    pinBtn.appendChild(pinIcon);
    noteCardgDiv.appendChild(pinBtn);

    // Add event to move to pinned
    pinBtn.addEventListener("click", () => {
      noteLi.remove();
      addNoteEle(title, noteText, author, date, true);
    });
  }

  // Edit Button
  let editBtn = document.createElement("button");
  editBtn.classList.add("icon-button", "edit");
  let editIcon = document.createElement("i");
  editIcon.classList.add("fas", "fa-edit");
  editBtn.appendChild(editIcon);
  noteCardgDiv.appendChild(editBtn);

  editBtn.addEventListener("click", () => {
    editNote(noteLi, h4, noteTextParagraph, noteSpanAuthor);
  });

  // Delete Button
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("icon-button", "delete");
  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-trash");
  deleteBtn.appendChild(deleteIcon);
  noteCardgDiv.appendChild(deleteBtn);

  // Delete note
  deleteBtn.addEventListener("click", () => {
    noteLi.remove();
  });

  noteHeadingDiv.appendChild(noteCardgDiv);
  noteLi.appendChild(noteHeadingDiv);

  // ==== Content ====
  let noteTextDiv = document.createElement("div");
  noteTextDiv.classList.add(
    isPinned ? "pinned-note__content" : "all-notes__content"
  );

  let noteTextParagraph = document.createElement("p");
  noteTextParagraph.classList.add(
    isPinned ? "pinned-note__text" : "all-notes__text"
  );
  noteTextParagraph.textContent = `Text: ${trimText(noteText, 20)}`;
  noteTextDiv.appendChild(noteTextParagraph);
  noteLi.appendChild(noteTextDiv);

  // ==== Footer ====
  let noteFooterDiv = document.createElement("div");
  noteFooterDiv.classList.add("note-card__footer");

  let noteSpanAuthor = document.createElement("span");
  noteSpanAuthor.classList.add("note-card__author");
  noteSpanAuthor.textContent = `Author: ${trimText(author, 13)}`;

  let noteSpanDate = document.createElement("span");
  noteSpanDate.classList.add("note-card__date");
  noteSpanDate.textContent = date;

  noteFooterDiv.appendChild(noteSpanAuthor);
  noteFooterDiv.appendChild(noteSpanDate);
  noteLi.appendChild(noteFooterDiv);

  // ==== Append to proper list ====
  if (isPinned) {
    pinnedNoteList.appendChild(noteLi);
  } else {
    allNoteList.appendChild(noteLi);
  }

  // Show popup with full content on click
  noteLi.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;

    showPopup(title, noteText, author, date);
  });
}

//Trim Long Text

function trimText(text, maxLength = 10) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// Edit Note Function

function editNote(noteElement, titleElement, textElement, authorElement) {
  // Get existing values from the note
  let currentTitle = titleElement.textContent.replace("Title: ", "").trim();
  let currentText = textElement.textContent.replace("Text: ", "").trim();
  let currentAuthor = authorElement.textContent.replace("Author: ", "").trim();

  // Fill form with existing data
  noteTitle.value = currentTitle;
  noteTextarea.value = currentText;
  noteAuthor.value = currentAuthor;

  // Show form and hide notes
  revealFormHideNotes();

  // Remove the old note
  noteElement.remove();
}

//Search Notes

function doesNoteMatchSearch(note, term) {
  let title = note.querySelector("h4").textContent.toLowerCase() || "";
  let author = note.querySelector("p").textContent.toLowerCase() || "";
  let text =
    note.querySelector(".note-card__author").textContent.toLowerCase() || "";
  return title.includes(term) || text.includes(term) || author.includes(term);
}

function filterNotes(noteList, term) {
  const notes = noteList.querySelectorAll("li");

  notes.forEach((note) => {
    const isMatch = doesNoteMatchSearch(note, term);
    note.style.display = isMatch ? "" : "none";
  });
}

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  filterNotes(allNoteList, searchTerm);
  filterNotes(pinnedNoteList, searchTerm);
});

//popup

function showPopup(title, text, author, date) {
  const popup = document.createElement("div");
  popup.classList.add("popup-overlay");
  popup.innerHTML = `
      <div class="popup">
        <button class="close-btn">&times;</button>
        <h2>${title}</h2>
        <p><strong>Author:</strong> ${author}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Note:</strong> ${text}</p>
      </div>
    `;
  document.body.appendChild(popup);

  popup.querySelector(".close-btn").addEventListener("click", () => {
    popup.remove();
  });

  let popupOverlay = document.querySelector(".popup-overlay");
  popupOverlay.addEventListener("click", () => {
    popup.remove();
  });
}
