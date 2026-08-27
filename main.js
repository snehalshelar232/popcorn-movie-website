const API_KEY = "1e4e799d01ec601962ac24534a693652";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";


// =========================
// HTML ELEMENTS
// =========================

const movieContainer = document.querySelector(".movie-container");

const searchInput = document.querySelector(".search-box input");

const searchButton = document.querySelector(".search-box button");
const genreButtons =
    document.querySelectorAll(".genre-btn");


// =========================
// POPULAR MOVIES API
// =========================

const POPULAR_URL =
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;


// =========================
// GET POPULAR MOVIES
// =========================

function getMovies() {

    fetch(POPULAR_URL)

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            console.log("Popular Movies:", data);

            displayMovies(data.results);

        })

        .catch(function(error) {

            console.log("Error:", error);

        });
}


// =========================
// SEARCH MOVIES
// =========================

function searchMovies() {

    const query = searchInput.value.trim();


    // If search box is empty
    if (query === "") {

        getMovies();

        return;
    }


    const SEARCH_URL =
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;


    fetch(SEARCH_URL)

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            console.log("Search Results:", data);

            displayMovies(data.results);

        })

        .catch(function(error) {

            console.log("Search Error:", error);

        });
}


// =========================
// DISPLAY MOVIES
// =========================

function displayMovies(movies) {

    movieContainer.innerHTML = "";


    // No movies found
    if (!movies || movies.length === 0) {

        movieContainer.innerHTML = `
            <div class="no-results">
                <h3>No movies found 😕</h3>
                <p>Try searching for another movie.</p>
            </div>
        `;

        return;
    }


    // Create movie cards
    movies.forEach(function(movie) {


        // Skip movies without posters
        if (!movie.poster_path) {

            return;

        }


        // Create movie card
        const movieCard = document.createElement("div");

        movieCard.classList.add("movie-card");


        // Movie card HTML
        movieCard.innerHTML = `

            <button
                class="favorite-btn"
                title="Add to favorites">
                ❤️
            </button>


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
                        : "Release date unavailable"
                    }
                </p>


                <p class="rating">
                    ⭐ ${movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "N/A"
                    }
                </p>

            </div>

        `;


        // Add card to page
        movieContainer.appendChild(movieCard);


        // =========================
        // FAVORITE BUTTON
        // =========================

        const favoriteButton =
            movieCard.querySelector(".favorite-btn");


        favoriteButton.addEventListener("click", function(event) {

            // Prevent movie details from opening
            event.stopPropagation();


            addToFavorites(movie);

        });


        // =========================
        // MOVIE DETAILS
        // =========================

        movieCard.addEventListener("click", function() {

            showMovieDetails(movie.id);

        });

    });

}


// =========================
// SEARCH BUTTON CLICK
// =========================

searchButton.addEventListener("click", function() {

    searchMovies();

});


// =========================
// PRESS ENTER TO SEARCH
// =========================

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        searchMovies();

    }

});


// =========================
// START WEBSITE
// =========================

getMovies();


// =========================
// MOVIE DETAILS
// =========================

function showMovieDetails(movieId) {

    const DETAILS_URL =
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;


    fetch(DETAILS_URL)

        .then(function(response) {

            return response.json();

        })

        .then(function(movie) {

            console.log("Movie Details:", movie);


            const modal =
                document.querySelector("#movie-modal");


            const details =
                document.querySelector("#movie-details");


            details.innerHTML = `

                <div class="movie-details">


                    <img
                        src="${IMAGE_URL}${movie.poster_path}"
                        alt="${movie.title}"
                    >


                    <div class="movie-details-info">


                        <h2>
                            ${movie.title}
                        </h2>


                        <p class="rating">

                            ⭐ ${movie.vote_average.toFixed(1)} / 10

                        </p>


                        <p class="release-date">

                            📅 ${movie.release_date || "Unknown"}

                        </p>


                        <div class="genres">

                            ${movie.genres.map(function(genre) {

                                return `
                                    <span class="genre">
                                        ${genre.name}
                                    </span>
                                `;

                            }).join("")}

                        </div>


                        <h3>
                            Overview
                        </h3>


                        <p class="overview">

                            ${movie.overview ||
                            "No description available."}

                        </p>
                        <div class="trailer-section">

    <button
        class="trailer-btn"
        onclick="watchTrailer(${movie.id})">
        ▶ Watch Trailer
    </button>

</div>


                    </div>


                </div>

            `;


            // Show popup
            modal.style.display = "flex";

        })


        .catch(function(error) {

            console.log(
                "Error loading movie details:",
                error
            );

        });

}


// =========================
// CLOSE MOVIE MODAL
// =========================

document.addEventListener("click", function(event) {


    // Close button
    if (event.target.closest("#close-modal")) {

        document.querySelector("#movie-modal").style.display = "none";

    }


    // Click outside modal
    if (event.target.id === "movie-modal") {

        document.querySelector("#movie-modal").style.display = "none";

    }

});


// =========================
// ESCAPE KEY
// =========================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        document.querySelector("#movie-modal").style.display = "none";

    }

});


// =========================
// ADD TO FAVORITES
// =========================

function addToFavorites(movie) {


    // Get existing favorites
    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];


    // Check if movie already exists
    const alreadyFavorite =
        favorites.some(function(item) {

            return item.id === movie.id;

        });


    if (alreadyFavorite) {

        alert("This movie is already in your favorites ❤️");

        return;

    }


    // Add movie to array
    favorites.push(movie);


    // Save favorites in browser
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    alert("Movie added to favorites ❤️");

}

// =========================
// GENRE FILTERING
// =========================

genreButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const genreId =
            button.dataset.genre;


        // Remove active class
        genreButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active class to clicked button
        button.classList.add("active");


        // Show popular movies again
        if (genreId === "all") {

            getMovies();

            return;
        }


        // TMDB genre URL
        const GENRE_URL =
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;


        fetch(GENRE_URL)

            .then(function(response) {

                return response.json();

            })

            .then(function(data) {

                console.log("Genre Movies:", data);

                displayMovies(data.results);

            })

            .catch(function(error) {

                console.log(
                    "Genre Error:",
                    error
                );

            });

    });

});
// =========================
// WATCH TRAILER
// =========================
function watchTrailer(movieId) {

    const VIDEO_URL =
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;

    fetch(VIDEO_URL)

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            console.log("Movie Videos:", data);

            const videos = data.results;

            let trailer = videos.find(function(video) {

                return video.site === "YouTube" &&
                       video.type === "Trailer" &&
                       video.key;

            });


            if (!trailer) {

                trailer = videos.find(function(video) {

                    return video.site === "YouTube" &&
                           video.type === "Teaser" &&
                           video.key;

                });

            }


            if (!trailer) {

                trailer = videos.find(function(video) {

                    return video.site === "YouTube" &&
                           video.key;

                });

            }


            if (trailer) {

                const trailerModal =
                    document.querySelector("#trailer-modal");

                const trailerFrame =
                    document.querySelector("#trailer-frame");


                trailerFrame.src =
                    `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;


                trailerModal.style.display = "flex";

            } else {

                alert("Sorry, no trailer is available for this movie 😕");

            }

        })

        .catch(function(error) {

            console.log("Trailer Error:", error);

            alert("Unable to load the trailer 😕");

        });
}
// =========================
// TRAILER POPUP
// =========================

function openTrailer(trailerKey) {

    const trailerModal = document.createElement("div");

    trailerModal.classList.add("trailer-modal");

    trailerModal.innerHTML = `

        <div class="trailer-content">

            <button class="close-trailer">
                ×
            </button>

            <iframe
                src="https://www.youtube.com/embed/${trailerKey}?autoplay=1"
                title="Movie Trailer"
                allow="autoplay; encrypted-media"
                allowfullscreen>
            </iframe>

        </div>

    `;

    document.body.appendChild(trailerModal);


    // Close button

    const closeButton =
        trailerModal.querySelector(".close-trailer");

    closeButton.addEventListener("click", function() {

        trailerModal.remove();

    });


    // Close when clicking outside

    trailerModal.addEventListener("click", function(event) {

        if (event.target === trailerModal) {

            trailerModal.remove();

        }

    });

}
// =========================
// CLOSE TRAILER POPUP
// =========================

document.addEventListener("click", function(event) {

    // Close button
    if (event.target.closest("#close-trailer")) {

        const trailerModal =
            document.querySelector("#trailer-modal");

        const trailerFrame =
            document.querySelector("#trailer-frame");

        trailerModal.style.display = "none";

        // Stop the video
        trailerFrame.src = "";

    }


    // Click outside the trailer
    if (event.target.id === "trailer-modal") {

        const trailerModal =
            document.querySelector("#trailer-modal");

        const trailerFrame =
            document.querySelector("#trailer-frame");

        trailerModal.style.display = "none";

        // Stop the video
        trailerFrame.src = "";

    }

});


// Close trailer with Escape

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        const trailerModal =
            document.querySelector("#trailer-modal");

        const trailerFrame =
            document.querySelector("#trailer-frame");

        trailerModal.style.display = "none";

        trailerFrame.src = "";

    }

});
// =========================
// DARK / LIGHT MODE
// =========================

const themeToggle =
    document.querySelector("#theme-toggle");


// Check saved theme

const savedTheme =
    localStorage.getItem("theme");


// Apply saved theme

if (savedTheme === "light") {

    document.body.classList.add("light-mode");

    themeToggle.textContent = "🌙";

} else {

    themeToggle.textContent = "☀️";

}


// Toggle theme

themeToggle.addEventListener("click", function() {

    document.body.classList.toggle("light-mode");


    // Check current mode

    if (document.body.classList.contains("light-mode")) {

        themeToggle.textContent = "🌙";

        localStorage.setItem("theme", "light");

    } else {

        themeToggle.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    }

});