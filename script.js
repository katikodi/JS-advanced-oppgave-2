// 1. add sortering og filtrering funksjonalitet -> først filtrering, så sortering I think
// 2. fix styling on modal buttons and all delete button hover visuals

const movieCardContainer = document.getElementById('movie-card-container');
const movieForm = document.getElementById('add-movie');
const deleteBtn = document.getElementById('reset-btn');
const confirmModal = document.getElementById('confirm-dialog');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
const filterWatchedCheck = document.getElementById('watched-checkbox');
const filterCommentedCheck = document.getElementById('commented-checkbox');
const filterWatchedSelect = document.getElementById('toggle-watched');
const filterCommentedSelect = document.getElementById('toggle-commented');

const movies = JSON.parse(localStorage.getItem('movies')) || [];                // the array where movieobject is pushed

deleteBtn.addEventListener('click', () => confirmModal.showModal());            // delete everything modal
cancelBtn.addEventListener('click', () => confirmModal.close());
confirmBtn.addEventListener('click', () => {
    movieCardContainer.replaceChildren();
    localStorage.clear();
    movies.length = 0;
    confirmModal.close();
});
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) confirmModal.close();
});

movieForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(movieForm);
    const titleInput = formData.get('movie-title-input');

    if (!titleInput.trim()) {                                           // user-error if only blank spaces in title input
        const titleInputField = document.getElementById('add-title');

        titleInputField.contentEditable = false;
        titleInputField.value = "Blank spaces are not enough";
        titleInputField.classList.add('input-error');

        setTimeout(() => {
            titleInputField.classList.remove('input-error');
            titleInputField.classList.add('input-error-fade');
        }, 1000);                                                       // it stays for 1 second
        setTimeout(() => {
            titleInputField.value = "";
            titleInputField.classList.remove('input-error-fade');
            titleInputField.contentEditable = true;
        }, 1200);                                                       // it fades for a little longer than 1s

        return;
    };

    const movieObject = {
        title: formData.get('movie-title-input'),
        url: formData.get('movie-url-input'),
        watched: false,
        comment: ""
    };
    movies.push(movieObject);                                           // push object to our storage array
    localStorage.setItem('movies', JSON.stringify(movies));             // tells localstorage to save that array's content
    buildPage();
    movieForm.blur();
})

const buildPage = () => {
    movieCardContainer.replaceChildren();

    const displayList = movies.filter((movie, index) => {

        console.log(`\nTesting movie [${index}]:`, movie.title);

        if (filterWatchedCheck.checked) {
            const isWatchedSelected = filterWatchedSelect.value === "Watched";
            if (movie.watched !== isWatchedSelected) {
                return false;
        }}

        if (filterCommentedCheck.checked) {
            const hasComment = !!(movie.comment && movie.comment.trim() !== "" && movie.comment !== "Click to comment");
            const isCommentedSelected = filterCommentedSelect.value === "Commented";
            if (hasComment !== isCommentedSelected) {
                return false;
        }}

        return true;
    });


    displayList.forEach((movie, index) => {                          // looping over the storage array
        const movieCard = document.createElement('div')
        movieCard.className = "movie-card";

        const cardTitle = document.createElement('h2');         // movie title element
        cardTitle.className = "movie-title"
        cardTitle.textContent = movie.title;
        const cardUrl = document.createElement('a')             // anchor tag (link) element
        cardUrl.href = movie.url;
        cardUrl.target = "_blank";
        cardUrl.textContent = "> Click to watch <";

        const cardManipulation = document.createElement('div');         // div element for the interactive parts below
        cardManipulation.className = "card-manipulation";
        //--

        const cardCheckBox = document.createElement('input');           // watched checkbox element
        cardCheckBox.className = "card-checkbox";
        cardCheckBox.type = "checkbox";
        cardCheckBox.checked = movie.watched;       // <- keeps visual checkmark on refresh if boolean is true
        movieCard.classList.toggle('watched-style', movie.watched);

        const cardCheckboxLabel = document.createElement('label');
        cardCheckboxLabel.className = "checkbox-label";
        cardCheckboxLabel.textContent = "Finished watching";
        cardCheckboxLabel.prepend(cardCheckBox);

        cardCheckBox.addEventListener('change', () => {     // <- swaps card styling on checkbox toggle
            movie.watched = cardCheckBox.checked;
            movieCard.classList.toggle('watched-style', movie.watched);
            movieCard.querySelector('a').classList.toggle('watched-style', movie.watched);
            localStorage.setItem('movies', JSON.stringify(movies));
        })
        //--

        const cardComment = document.createElement('p');                // element for comment field
        cardComment.contentEditable = "true";
        cardComment.spellcheck = false;
        cardComment.className = "movie-comment-field";
        cardComment.textContent = movie.comment || "Click to comment";

        function updateComment() {                                                      // comment function
            movie.comment = cardComment.textContent;
            buildPage();
            localStorage.setItem('movies', JSON.stringify(movies));
        }

        const cardCommentSaveBtn = document.createElement('button');                    // comment save button
        cardCommentSaveBtn.className = "movie-comment-save-btn";
        cardCommentSaveBtn.textContent = "Save comment";
        cardCommentSaveBtn.addEventListener('click', (event) => {
            updateComment();
            cardCommentSaveBtn.blur();
        });

        cardComment.addEventListener('focus', () => {                                   // comment field eventlisteners
            cardComment.style.outline = '1px solid var(--accent)';
            cardCommentSaveBtn.style.visibility = 'visible';
            if (cardComment.textContent === "Click to comment")
            {cardComment.textContent = "";}
        })
        cardComment.addEventListener('blur', () => {
            updateComment();
            cardComment.style.outline = 'none';
            cardCommentSaveBtn.style.visibility = 'hidden';
            if (cardComment.textContent === "")
            {cardComment.textContent = "Click to comment";}
        })
        cardComment.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()          // prevents line break
                updateComment();
                event.target.blur();
            }
        })
        //--

        const cardDeleteBtn = document.createElement('button');         // element for movie card delete button
        cardDeleteBtn.className = "movie-delete-btn";
        cardDeleteBtn.textContent = "Delete";
        cardDeleteBtn.addEventListener('click', () => {
            movieCard.remove();
            movies.splice(index, 1);
            localStorage.setItem('movies', JSON.stringify(movies));
        })

        cardManipulation.append(cardCheckboxLabel, cardComment, cardCommentSaveBtn, cardDeleteBtn)
        movieCard.append(cardTitle, cardUrl, cardManipulation);
        movieCardContainer.append(movieCard);
    });
}

[filterWatchedCheck, filterWatchedSelect, filterCommentedCheck, filterCommentedSelect].forEach((element) => {
    element.addEventListener('change', buildPage);
});

buildPage();