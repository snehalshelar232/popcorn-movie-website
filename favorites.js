// =========================
// GET FAVORITES
// =========================

const favoritesContainer =
    document.querySelector("#favorites-container");


const IMAGE_URL =
    "https://image.tmdb.org/t/p/w500";


// Get favorites from browser

const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

const favoriteCount =
    document.querySelector("#favorite-count");
// =========================
// DISPLAY FAVORITES
// =========================

function displayFavorites() {

    favoritesContainer.innerHTML = "";
favoriteCount.textContent =
    `${favorites.length} ${favorites.length === 1 ? "movie" : "movies"}`;

    // No favorites

    if (favorites.length === 0) {

        favoritesContainer.innerHTML = `

            <div class="no-results">

                <h3>
                    No favorites yet ❤️
                </h3>

                <p>
                    Go back and add some movies!
                </p>

            </div>

        `;

        return;
    }


    // Display every favorite

    favorites.forEach(function(movie) {

        const movieCard =
            document.createElement("div");


        movieCard.classList.add("movie-card");


        movieCard.innerHTML = `

            <img
                src="${IMAGE_URL}${movie.poster_path}"
                alt="${movie.title}"
            >


            <div class="movie-info">

                <h3>
                    ${movie.title}
                </h3>


                <p>
                    ${movie.release_date
                        ? movie.release_date.substring(0, 4)
                        : "Unknown"
                    }
                </p>


                <p class="rating">

                    ⭐ ${movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "N/A"
                    }

                </p>


                <button
                    class="remove-favorite"
                    data-id="${movie.id}">

                    Remove ❤️

                </button>

            </div>

        `;


        favoritesContainer.appendChild(movieCard);


        // =========================
        // REMOVE FAVORITE
        // =========================

        const removeButton =
            movieCard.querySelector(".remove-favorite");


        removeButton.addEventListener(
            "click",
            function() {

                removeFromFavorites(movie.id);

            }
        );

    });

}


// =========================
// REMOVE FAVORITE
// =========================

function removeFromFavorites(movieId) {

    const updatedFavorites =
        favorites.filter(function(movie) {

            return movie.id !== movieId;

        });


    localStorage.setItem(
        "favorites",
        JSON.stringify(updatedFavorites)
    );


    // Refresh page

    location.reload();

}


// =========================
// START
// =========================

displayFavorites();

// =========================
// DARK / LIGHT MODE
// =========================

const themeToggle = document.querySelector("#theme-toggle");

// Get saved theme
const savedTheme = localStorage.getItem("theme");

// Apply saved theme
if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "🌙";
}


// Toggle theme
themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {

        themeToggle.textContent = "🌙";

        localStorage.setItem("theme", "light");

    } else {

        themeToggle.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    }

});