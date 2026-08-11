
// 1. gjør ferdig mulighet for endring av tittel !!!                    <- så å si ferdig, må se over text update functions og relaterte ting
// 2. ekstra: custom filter dropdown med clear filters knapp            <- kinda, ferdig men man trykker på hvert filter
// 3. ekstra: card delete button only visible when card is hovered      <- FERDIG

// movie card related variables:
const movieCardContainer = document.getElementById('movie-card-container');
const movieForm = document.getElementById('add-movie');
const deleteBtn = document.getElementById('reset-btn');
// modal related variables:
const confirmModal = document.getElementById('confirm-dialog');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
// filter related variables:
const filtersContainer = document.getElementById('active-filter-btns-container');
const filterWatched = document.getElementById('watched');
const filterNotWatched = document.getElementById('not-watched');
const filterCommented = document.getElementById('commented');
const filterNoComment = document.getElementById('no-comment');
//const dropdownContainer = document.querySelector('.dropdown-container');
const dropdownItems = document.querySelector('.dropdown-items');
//const options = document.querySelectorAll('filter');
/*
const filterWatchedCheck = document.getElementById('watched-checkbox');
const filterCommentedCheck = document.getElementById('commented-checkbox');
const filterWatchedSelect = document.getElementById('toggle-watched');
const filterCommentedSelect = document.getElementById('toggle-commented');
*/
// sorting related variables:
const alphabeticalBtn = document.getElementById('alphabetical');
const chronologicalBtn = document.getElementById('chronological');

let filterObject = {
    isWatchFilterActive: false,
    filterWatched: false,
    isCommentFilterActive: false,
    filterCommented: false
};

let sortingObject = {
    sortingType: 'chrono',
    isAscending: false       // <- default sorting shows newest added first
};

const movies = JSON.parse(localStorage.getItem('movies')) || [];                // the array where movieObject is pushed
// -----------

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
//----------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------

movieForm.addEventListener('submit', (e) => {                                   // movie submission event
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
            titleInputField.classList.remove('input-error-fade');
            titleInputField.value = "";
            titleInputField.contentEditable = true;
        }, 1200);                                                       // it fades for a little longer than 1s

        return;
    };

    const movieObject = {
        id: Date.now(),
        title: formData.get('movie-title-input'),
        url: formData.get('movie-url-input'),
        watched: false,
        comment: ""
    };
    movies.push(movieObject);                                           // push object to our storage array
    localStorage.setItem('movies', JSON.stringify(movies));             // tells localstorage to save that array's content
    buildPage();
    movieForm.blur();
});

//----------------------------------------------------------------------------------------------------------------------------

const buildPage = () => {
    movieCardContainer.replaceChildren();
/*
    const filteredList = movies.filter((movie) => {                         // filtering functionality
        if (filterWatchedCheck.checked) {
            const isWatchedSelected = filterWatchedSelect.value === "Watched";  // boolean checking if option is "Watched"
            if (movie.watched !== isWatchedSelected) {      // <- return false if the 2 booleans don't match
                return false;
        }}
        if (filterCommentedCheck.checked) {
            // if comment has value, also after trim, and value is not placeholder, hasComment is true. !!(forced boolean)
            const hasComment = !!(movie.comment && movie.comment.trim() !== "" && movie.comment !== "Click to comment");
            const isCommentedSelected = filterCommentedSelect.value === "Commented";    // boolean checking for "Commented"
            if (hasComment !== isCommentedSelected) {       // <- return false if the 2 booleans don't match
                return false;
        }}
        return true;        // <- only show what wasn't filtered out as false
    });
*/
    const filteredList = movies.filter((movie) => {
        const { isWatchFilterActive, filterWatched, isCommentFilterActive, filterCommented } = filterObject;
        
        if (isWatchFilterActive) {
            const isWatchedSelected = filterWatched;
            if (movie.watched !== isWatchedSelected) {
                return false;
            }
        }
        if (isCommentFilterActive) {
            const hasComment = !!(movie.comment && movie.comment.trim() !== "" && movie.comment !== "Click to comment");
            const isCommentedSelected = filterCommented;
            if (hasComment !== isCommentedSelected) {
                return false;
            }
        }
        return true;
    })

    //--------------------------------------------------------------

    const { sortingType, isAscending } = sortingObject;

    const displayList = filteredList.toSorted((a, b) => {                   // sorting functionality
        if (sortingType === 'alpha') {
            const movieA = a.title.toLowerCase();
            const movieB = b.title.toLowerCase();

            // considering movieA. if less than B, place it before (-1) B when sorting is set to ascend
            if (movieA < movieB) return isAscending ? -1 : 1;
            if (movieA > movieB) return isAscending ? 1 : -1;
            return 0;
        }
        if (sortingType === 'chrono') {
            // a - b will be -1 if ascending from oldest to newest added
            return isAscending ? a.id - b.id : b.id - a.id;
        }
    })

    //--------------------------------------------------------------

    displayList.forEach((movieToDisplay) => {                   // looping over filtered and sorted storage array
        const movieCard = document.createElement('div');
        movieCard.className = "movie-card";

        const cardTitle = document.createElement('h2');         // movie title element
        cardTitle.className = "movie-title"
        cardTitle.textContent = movieToDisplay.title;
        cardTitle.contentEditable = true;
        cardTitle.spellcheck = false;

        function updateTitle() {                                                    // title edit function
            const movieInstance = movies.find(m => m.id === movieToDisplay.id);
        
            if (movieInstance) {
                movieInstance.title = cardTitle.textContent;
                localStorage.setItem('movies', JSON.stringify(movies));
                buildPage();
            }
        }

        cardTitle.addEventListener('focus', () => {                         // style change when editing title
            cardTitle.style.outline = '1px solid var(--accent)';
            cardTitle.style.borderRadius = 'var(--radius)';
        })
        cardTitle.addEventListener('blur', () => {                          // on element blur (exit),
            cardTitle.style.outline = 'none';                               // remove style change, and
            if (cardTitle && cardTitle.textContent.trim() !== "") {         // update if there is content
                updateTitle();
            }
        })
        cardTitle.addEventListener('keydown', (event) => {                  // exits (thus saves) on enter click
            if (event.key === 'Enter') {
                event.preventDefault()          // <- prevents line break
                event.target.blur();
            }
        })
        //--------------------------------------------------------------

        const cardUrl = document.createElement('a')             // anchor tag (link) element
        cardUrl.href = movieToDisplay.url;
        cardUrl.target = "_blank";
        cardUrl.textContent = "> Click to watch <";

        const cardManipulation = document.createElement('div');         // div element for the interactive parts below
        cardManipulation.className = "card-manipulation";
        //--------------------------------------------------------------

        const cardCheckBox = document.createElement('input');           // watched checkbox element
        cardCheckBox.className = "card-checkbox";
        cardCheckBox.type = "checkbox";
        cardCheckBox.checked = movieToDisplay.watched;  // <- keeps visual checkmark on refresh if boolean is true
        movieCard.classList.toggle('watched-style', movieToDisplay.watched);    // adds style-class only on true

        const cardCheckboxLabel = document.createElement('label');
        cardCheckboxLabel.className = "checkbox-label";
        cardCheckboxLabel.textContent = "Finished watching";
        cardCheckboxLabel.prepend(cardCheckBox);

        cardCheckBox.addEventListener('change', () => {     // on checkbox toggle:
            movieToDisplay.watched = cardCheckBox.checked;  // <- matches filtered movieobject watched value to checkbox value

            const movieIndex = movies.findIndex(m => m.id === movieToDisplay.id);
            movies[movieIndex].watched = cardCheckBox.checked;  // <- matches original movieobject watched value to checkbox value

            movieCard.classList.toggle('watched-style', movieToDisplay.watched); // <- swaps card styling
            movieCard.querySelector('a').classList.toggle('watched-style', movieToDisplay.watched);
            localStorage.setItem('movies', JSON.stringify(movies));
        })
        //--------------------------------------------------------------

        const cardComment = document.createElement('p');                // element for comment field
        cardComment.contentEditable = true;
        cardComment.spellcheck = false;
        cardComment.className = "movie-comment-field";
        cardComment.textContent = movieToDisplay.comment || "Click to comment";

        function updateComment() {                                                      // comment function
            const movieInstance = movies.find(m => m.id === movieToDisplay.id);
        
            if (movieInstance) {
                movieInstance.comment = cardComment.textContent;
                localStorage.setItem('movies', JSON.stringify(movies));
            }
        }

        /*
        const cardCommentSaveBtn = document.createElement('button');                    // comment save button
        cardCommentSaveBtn.className = "movie-comment-save-btn";
        cardCommentSaveBtn.textContent = "Save comment";
        cardCommentSaveBtn.addEventListener('click', () => {
            updateComment();
            cardCommentSaveBtn.blur();
        });
        */

        cardComment.addEventListener('focus', () => {                                   // comment field eventlisteners
            cardComment.style.outline = '1px solid var(--accent)';
            //cardCommentSaveBtn.style.visibility = 'visible';
            if (cardComment.textContent === "Click to comment")
            {cardComment.textContent = "";}
        })
        cardComment.addEventListener('blur', () => {
            updateComment();
            cardComment.style.outline = 'none';
            //cardCommentSaveBtn.style.visibility = 'hidden';
            if (cardComment.textContent === "")
            {cardComment.textContent = "Click to comment";}
        })
        cardComment.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()          // <- prevents line break
                updateComment();
                event.target.blur();
            }
        })
        //--------------------------------------------------------------

        const cardDeleteBtn = document.createElement('button');         // element for movie card delete button
        cardDeleteBtn.className = "movie-delete-btn";
        cardDeleteBtn.textContent = "Delete";
        cardDeleteBtn.addEventListener('click', () => {             // <- movie card delete functionality
            const movieIndex = movies.findIndex(m => m.id === movieToDisplay.id);

            movieCard.remove();

            if (movieIndex !== -1) {
                movies.splice(movieIndex, 1);
                localStorage.setItem('movies', JSON.stringify(movies));
            }
        })
        movieCard.addEventListener('mouseover', () => {
            const currentDeleteBtn = movieCard.querySelector('.movie-delete-btn');
            currentDeleteBtn.style.pointerEvents = 'auto';
            currentDeleteBtn.style.opacity = '1';
        })
        movieCard.addEventListener('mouseleave', () => {
            const currentDeleteBtn = movieCard.querySelector('.movie-delete-btn');
            currentDeleteBtn.style.pointerEvents = 'none';
            currentDeleteBtn.style.opacity = '0';
        })

        cardManipulation.append(cardCheckboxLabel, cardComment, /*cardCommentSaveBtn,*/ cardDeleteBtn)
        movieCard.append(cardTitle, cardUrl, cardManipulation);
        movieCardContainer.append(movieCard);
    });
}

//----------------------------------------------------------------------------------------------------------------------------

/*
[filterWatchedCheck, filterWatchedSelect, filterCommentedCheck, filterCommentedSelect].forEach((element) => {
    element.addEventListener('change', buildPage);
});
*/
/*
[filterWatched, filterCommented, filterNotWatched, filterNoComment].forEach((element) =>  {
    element.addEventListener('click', () => {
        element
        applyFilter
    })
})
*/
/*
const applyFilter = (element) => {
    const { filterWatched, isWatchFilterActive, filterCommented, isCommentFilterActive } = filterObject;


    if (element === filterWatched || filterNotWatched) {
        filterObject.isWatchFilterActive = true;
        
    }

    buildPage();
}
*/



dropdownItems.addEventListener('click', (e) => {
    const filterOption = e.target.closest('.filter');

    // lag visuell slett filterknapp funksjon basert på filterobject values
    // og endring av filterobject basert på filterknapp fjerna (lage funksjon for det også)
    // sjekk i loopen om filtre blir applya riktig

    if (!filterOption) return;

    if (filterOption.id === "watched" || filterOption.id === "not-watched") {

        filterObject.isWatchFilterActive = true;    // <- updates filter object that "watched" or "not watched" is selected
        filterObject.filterWatched = filterOption.id === "watched" ? true : false;      // <- specifies which of them it is

        const type = filterObject.filterWatched === true ? "watched" : "notWatched";
        const oppositeType = filterObject.filterWatched === false ? "watched" : "notWatched";

        const text = filterObject.filterWatched === true ? "Watched" : "Not watched";
        const icon = '👁';
            
        const hasDuplicateButton = filtersContainer.querySelector(`#${type}Button`) !== null;
        const hasOppositeButton = filtersContainer.querySelector(`#${oppositeType}Button`) !== null;

        if (hasDuplicateButton) {   // if container has button of same watched state, return nothing
            console.log("Refused to add a duplicate button");
            console.log(filterObject);
            return;
        }
        else if (hasOppositeButton) {   // if container has button of opposite watched state, remove it before adding button
            filtersContainer.querySelector(`#${oppositeType}Button`).remove();
            addActiveFilterButton(text, type, icon);
            console.log(`Removed ${oppositeType} filter and added ${type} filter`);
            console.log(filterObject);
            return;
        } else {    // if the button doesn't already exist, kjør addfilterbutton function
            addActiveFilterButton(text, type, icon);
            console.log(`Added ${type} filter`);
            console.log(filterObject);
            return;
        }
        

    } else if (filterOption.id === "commented" || filterOption.id === "no-comment") {
        
        filterObject.isCommentFilterActive = true;    // <- updates filter object that "watched" or "not watched" is selected
        filterObject.filterCommented = filterOption.id === "commented" ? true : false;      // <- specifies which of them it is

        const type = filterObject.filterCommented === true ? "commented" : "notCommented";
        const oppositeType = filterObject.filterCommented === false ? "commented" : "notCommented";

        const text = filterObject.filterCommented === true ? "Commented" : "Not commented";
        const icon = '🗩';
            
        const hasDuplicateButton = filtersContainer.querySelector(`#${type}Button`) !== null;
        const hasOppositeButton = filtersContainer.querySelector(`#${oppositeType}Button`) !== null;

        if (hasDuplicateButton) {   // if container has button of same commented state, return nothing
            console.log("Refused to add a duplicate button");
            console.log(filterObject);
            return;
        }
        else if (hasOppositeButton) {   // if container has button of opposite watched state, remove it before adding button
            filtersContainer.querySelector(`#${oppositeType}Button`).remove();
            addActiveFilterButton(text, type, icon);
            console.log(`Removed ${oppositeType} filter and added ${type} filter`);
            console.log(filterObject);
            return;
        } else {    // if the button doesn't already exist, kjør addfilterbutton function
            addActiveFilterButton(text, type, icon);
            console.log(`Added ${type} filter`);
            console.log(filterObject);
            return;
        }
    }
});

const addActiveFilterButton = (text, type, icon) => {
    console.log("---");
    const activeFilterButton = document.createElement('button');
    activeFilterButton.id = `${type}Button`;
    activeFilterButton.className = "remove-active-filter-btn";
    //activeFilterButton.textContent = `  ${text}`;

    const xSpan = document.createElement('span');
    xSpan.className = "filter-x";
    xSpan.textContent = "✖";

    const iconSpan = document.createElement('span');
    iconSpan.className = "filter-icon-span";
    const iconSpanIcon = document.createElement('span');
    iconSpanIcon.classname = "filter-icon";
    iconSpanIcon.textContent = icon;
    const iconSpanSlash = document.createElement('span');
    iconSpanSlash.className = "filter-icon-slash";
    iconSpanSlash.textContent = "/";

    if (type === "watched" || type === "commented") {
        iconSpan.append(iconSpanIcon);
    } else {
        iconSpan.append(iconSpanIcon, iconSpanSlash);
    }

    activeFilterButton.append(xSpan, text, iconSpan);
    filtersContainer.append(activeFilterButton);
    buildPage();
}


filtersContainer.addEventListener('click', (e) => {
    const filterToRemove = e.target.closest(".remove-active-filter-btn");

    if (!filterToRemove) return;

    if (filterToRemove.id === "watchedButton" || filterToRemove.id === "notWatchedButton") {
        filterObject.isWatchFilterActive = false;
        removeActiveFilterButton(filterToRemove);
        console.log(`removed ${filterToRemove}`);
        console.log(filterObject);
    } else {
        filterObject.isCommentFilterActive = false;
        removeActiveFilterButton(filterToRemove);
        console.log(`removed ${filterToRemove}`);
        console.log(filterObject);
    }
})

const removeActiveFilterButton = (filter) => {
    console.log("-----");
    filter.remove();
    buildPage();
}




//----------------------------------------------------------------------------------------------------------------------------


const updateSortingButtons = () => {
    const { sortingType, isAscending } = sortingObject;     // destructures and grabs current sortingObject keys/values

    chronologicalBtn.classList.toggle('active-sort', sortingType === 'chrono');
    alphabeticalBtn.classList.toggle('active-sort', sortingType === 'alpha');

    if (sortingType === 'chrono') {
        chronologicalBtn.textContent = isAscending ? "⮝ First added" : "⮟ Last added";
    } else {
        alphabeticalBtn.textContent = isAscending ? "⮝ A-Z" : "⮟ Z-A";
    }
}

chronologicalBtn.addEventListener('click', () => {
    if (sortingObject.sortingType === 'chrono') {
        sortingObject.isAscending = !sortingObject.isAscending;             // toggles direction if already selected
    } else {
        sortingObject.sortingType = 'chrono';                               // if not, swap to it
        if (chronologicalBtn.textContent === "⮝ First added") {sortingObject.isAscending = true}
        if (chronologicalBtn.textContent === "⮟ Last added") {sortingObject.isAscending = false}
    }
    updateSortingButtons();
    buildPage();
});

alphabeticalBtn.addEventListener('click', () => {
    if (sortingObject.sortingType === 'alpha') {
        sortingObject.isAscending = !sortingObject.isAscending;
    } else {
        sortingObject.sortingType = 'alpha';
        if (alphabeticalBtn.textContent === "⮝ A-Z") {sortingObject.isAscending = true}
        if (alphabeticalBtn.textContent === "⮟ Z-A") {sortingObject.isAscending = false}
    }
    updateSortingButtons();
    buildPage();
});

buildPage();

// ⮟ Last added (descending NEWEST)     <- chronoDescend
// ⮝ Alphabetical (ascending A-Z)       <- alphaAscend
// ⮝ First added (ascending OLDEST)     <- chronoAscend
// ⮟ Alphabetical (descending Z-A)      <- alphaDescend