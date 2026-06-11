// 1. add watched element i buildpage med funksjonalitet -> add watched boolean inni movieObject også
// 2. add sortering og filtrering funksjonalitet -> først filtrering, så sortering I think
// 3. style dialog og finjuster annen styling

const movieCardContainer = document.getElementById('movie-card-container');
const movieForm = document.getElementById('add-movie');
const deleteBtn = document.getElementById('reset-btn');
const confirmModal = document.getElementById('confirm-dialog');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');

const movies = JSON.parse(localStorage.getItem('movies')) || [];                // the array where movieobject is pushed

deleteBtn.addEventListener('click', () => confirmModal.showModal());            // delete everything modal
cancelBtn.addEventListener('click', () => confirmModal.close());
confirmBtn.addEventListener('click', () => {
    movieCardContainer.replaceChildren();
    movies.length = 0;
    localStorage.clear();
    confirmModal.close();
});
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) confirmModal.close();
});

movieForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(movieForm);
    const titleInput = formData.get('movie-title-input');
    if (!titleInput.trim()) {
        e.preventDefault();                                     // stop!!!!!!!!!!!!
    };

    const movieObject = {
        title: formData.get('movie-title'),
        url: formData.get('movie-url'),
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

    movies.forEach((movie, index) => {                          // looping over the storage array
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

        const cardCheckboxRow = document.createElement('div');          // watched checkbox element
        const cardCheckBox = document.createElement('input');
        cardCheckBox.className = "card-checkbox";
        cardCheckBox.type = "checkbox";
        const cardCheckboxLabel = document.createElement('label');
        cardCheckboxLabel.className = "checkbox-label";
        cardCheckboxLabel.textContent = "Finished watching";
        cardCheckboxLabel.prepend(cardCheckBox);

        cardCheckboxLabel.addEventListener('click', () => {
            // hm....
        })
        //--

        const cardComment = document.createElement('p');                // element for comment field
        cardComment.contentEditable = "true";
        cardComment.spellcheck = false;
        cardComment.className = "movie-comment-field";
        cardComment.textContent = movie.comment || "Click to add your thoughts";

        function updateComment() {                                                      // comment function
            movies[index].comment = cardComment.textContent;
            localStorage.setItem('movies', JSON.stringify(movies));
        }

        const cardCommentSaveBtn = document.createElement('button');                    // adding save button
        cardCommentSaveBtn.className = "movie-comment-save-btn";
        cardCommentSaveBtn.textContent = "Save comment";
        cardCommentSaveBtn.addEventListener('click', (event) => {
            updateComment();
            cardCommentSaveBtn.blur();
        });

        cardComment.addEventListener('focus', () => {                                   // comment field eventlisteners
            cardComment.style.outline = '1px solid var(--accent)';
            cardCommentSaveBtn.style.visibility = 'visible';
            if (cardComment.textContent === "Click to add your thoughts")
            {cardComment.textContent = "";}
        })
        cardComment.addEventListener('blur', () => {
            updateComment();
            cardComment.style.outline = 'none';
            cardCommentSaveBtn.style.visibility = 'hidden';
            if (cardComment.textContent === "")
            {cardComment.textContent = "Click to add your thoughts";}
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

buildPage();














/* OVERKOMPLISERT:

const names = localStorage.getItem('names') || [];
const namesDiv = document.getElementById('names-div');

const exampleForm = document.getElementById('your-name-is');
exampleForm.addEventListener('submit', (e) => {                 // (e) for å kunne targete det som blir submitted
    e.preventDefault();                                         // no reload default og sånn

    const formData = new FormData(exampleForm);
    const name = formData.get('your-name');                     // henter NAME attribute fra inputen

    names.push(name);                                           // BYTT UT med hva enn man skriver for å replace keyvalue
    localStorage.setItem('names', JSON.stringify(names));
    renderPage();

    console.log(name);
})

const renderPage = () => {

    names.forEach(name => {
        namesDiv.replaceChildren();

        const nameEl = document.createElement('p');
        namesDiv.append(name);
    })
}

*/