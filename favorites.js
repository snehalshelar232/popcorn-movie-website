// =========================
// FAVORITES
// =========================

const IMAGE_URL =
    "https://image.tmdb.org/t/p/w500";


// =========================
// HTML ELEMENTS
// =========================

const movieFavoritesContainer =
    document.querySelector("#movie-favorites-container");

const seriesFavoritesContainer =
    document.querySelector("#series-favorites-container");

const movieFavoriteCount =
    document.querySelector("#movie-favorite-count");

const seriesFavoriteCount =
    document.querySelector("#series-favorite-count");


// =========================
// GET FAVORITES
// =========================

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];


// =========================
// SEPARATE MOVIES & SERIES
// =========================

const movieFavorites =
    favorites.filter(function(item) {

        return item.media_type !== "tv";

    });


const seriesFavorites =
    favorites.filter(function(item) {

        return item.media_type === "tv";

    });


// =========================
// DISPLAY ALL FAVORITES
// =========================

function displayFavorites() {

    displayMovies();

    displaySeries();

}


// =========================
// DISPLAY MOVIE FAVORITES
// =========================

function displayMovies() {

    movieFavoritesContainer.innerHTML = "";


    // Count

    movieFavoriteCount.textContent =
        `${movieFavorites.length} ${
            movieFavorites.length === 1
                ? "movie"
                : "movies"
        }`;


    // No movies

    if (movieFavorites.length === 0) {

        movieFavoritesContainer.innerHTML = `

            <div class="no-results">

                <h3>
                    No movie favorites yet 🎬
                </h3>

                <p>
                    Go back and add some movies!
                </p>

            </div>

        `;

        return;

    }


    // Create movie cards

    movieFavorites.forEach(function(movie) {

        createFavoriteCard(
            movie,
            movieFavoritesContainer,
            false
        );

    });

}


// =========================
// DISPLAY SERIES FAVORITES
// =========================

function displaySeries() {

    seriesFavoritesContainer.innerHTML = "";


    // Count

    seriesFavoriteCount.textContent =
        `${seriesFavorites.length} ${
            seriesFavorites.length === 1
                ? "series"
                : "series"
        }`;


    // No series

    if (seriesFavorites.length === 0) {

        seriesFavoritesContainer.innerHTML = `

            <div class="no-results">

                <h3>
                    No web series favorites yet 📺
                </h3>

                <p>
                    Go to Web Series and add some!
                </p>

            </div>

        `;

        return;

    }


    // Create series cards

    seriesFavorites.forEach(function(series) {

        createFavoriteCard(
            series,
            seriesFavoritesContainer,
            true
        );

    });

}


// =========================
// CREATE FAVORITE CARD
// =========================

function createFavoriteCard(
    item,
    container,
    isSeries
) {

    const card =
        document.createElement("div");

    card.classList.add("movie-card");


    // Title

    const title =
        isSeries
            ? item.name || item.title
            : item.title;


    // Date

    const date =
        isSeries
            ? item.first_air_date ||
              item.release_date
            : item.release_date;


    card.innerHTML = `

        <img
            src="${IMAGE_URL}${item.poster_path}"
            alt="${title}"
        >

        <div class="movie-info">

            <h3>
                ${title}
            </h3>

            <p>
                ${
                    date
                    ? date.substring(0, 4)
                    : "Unknown"
                }
            </p>

            <p class="rating">
                ⭐ ${
                    item.vote_average
                    ? item.vote_average.toFixed(1)
                    : "N/A"
                }
            </p>

            <button
                class="remove-favorite"
                data-id="${item.id}"
                data-type="${
                    isSeries ? "tv" : "movie"
                }">

                Remove ❤️

            </button>

        </div>

    `;


    container.appendChild(card);


    // =========================
    // REMOVE BUTTON
    // =========================

    const removeButton =
        card.querySelector(
            ".remove-favorite"
        );


    removeButton.addEventListener(
        "click",
        function() {

            removeFromFavorites(
                item.id,
                isSeries ? "tv" : "movie"
            );

        }
    );

}


// =========================
// REMOVE FAVORITE
// =========================

function removeFromFavorites(
    itemId,
    itemType
) {

    favorites =
        favorites.filter(function(item) {

            return !(
                item.id === itemId &&
                (
                    item.media_type || "movie"
                ) === itemType
            );

        });


    // Save updated favorites

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    // Reload page

    location.reload();

}


// =========================
// START
// =========================

displayFavorites();


// =========================
// DARK / LIGHT MODE
// =========================

const themeToggle =
    document.querySelector(
        "#theme-toggle"
    );


// Get saved theme

const savedTheme =
    localStorage.getItem("theme");


// Apply saved theme

if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );

    themeToggle.textContent = "🌙";

}


// Toggle theme

themeToggle.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "light-theme"
        );


        if (
            document.body.classList.contains(
                "light-theme"
            )
        ) {

            themeToggle.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        } else {

            themeToggle.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

    }
);