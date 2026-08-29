// =========================
// TMDB API
// =========================

const API_KEY = "1e4e799d01ec601962ac24534a693652";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";


// =========================
// HTML ELEMENTS
// =========================

const seriesContainer =
    document.querySelector("#series-container");

const searchInput =
    document.querySelector("#seriesSearchInput");

const searchButton =
    document.querySelector("#seriesSearchBtn");

const genreButtons =
    document.querySelectorAll(".series-genre-btn");


// =========================
// POPULAR WEB SERIES API
// =========================

const POPULAR_SERIES_URL =
    `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US`;


// =========================
// GET POPULAR WEB SERIES
// =========================

function getSeries() {

    fetch(POPULAR_SERIES_URL)

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            console.log("Popular Series:", data);

            displaySeries(data.results);

        })

        .catch(function(error) {

            console.log("Series Error:", error);

            seriesContainer.innerHTML = `
                <div class="no-results">
                    <h3>Unable to load web series 😕</h3>
                    <p>Please try again later.</p>
                </div>
            `;

        });

}


// =========================
// SEARCH WEB SERIES
// =========================

function searchSeries() {

    const query = searchInput.value.trim();


    // Empty search
    if (query === "") {

        getSeries();

        return;

    }


    const SEARCH_SERIES_URL =
        `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`;


    fetch(SEARCH_SERIES_URL)

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            console.log("Series Search Results:", data);

            displaySeries(data.results);

        })

        .catch(function(error) {

            console.log("Series Search Error:", error);

            seriesContainer.innerHTML = `
                <div class="no-results">
                    <h3>Something went wrong 😕</h3>
                    <p>Please try again.</p>
                </div>
            `;

        });

}


// =========================
// DISPLAY WEB SERIES
// =========================

function displaySeries(series) {

    seriesContainer.innerHTML = "";


    // No results
    if (!series || series.length === 0) {

        seriesContainer.innerHTML = `
            <div class="no-results">
                <h3>No web series found 😕</h3>
                <p>Try searching for another series.</p>
            </div>
        `;

        return;

    }


    // Create cards
    series.forEach(function(show) {


        // Skip series without posters
        if (!show.poster_path) {

            return;

        }


        // Create card
        const seriesCard =
            document.createElement("div");

        seriesCard.classList.add("movie-card");


        // Card HTML
        seriesCard.innerHTML = `

            <button
                class="favorite-btn"
                title="Add to favorites">
                ❤️
            </button>


            <img
                src="${IMAGE_URL}${show.poster_path}"
                alt="${show.name}"
            >


            <div class="movie-info">

                <h3>
                    ${show.name}
                </h3>


                <p>
                    ${
                        show.first_air_date
                        ? show.first_air_date.substring(0, 4)
                        : "Release date unavailable"
                    }
                </p>


                <p class="rating">
                    ⭐ ${
                        show.vote_average
                        ? show.vote_average.toFixed(1)
                        : "N/A"
                    }
                </p>

            </div>

        `;


        // Add card
        seriesContainer.appendChild(seriesCard);


        // =========================
        // FAVORITE BUTTON
        // =========================

        const favoriteButton =
            seriesCard.querySelector(".favorite-btn");


        favoriteButton.addEventListener(
            "click",
            function(event) {

                // Don't open details
                event.stopPropagation();

                addSeriesToFavorites(show);

            }
        );


        // =========================
        // SERIES DETAILS
        // =========================

        seriesCard.addEventListener(
            "click",
            function() {

                showSeriesDetails(show.id);

            }
        );

    });

}


// =========================
// SEARCH BUTTON
// =========================

searchButton.addEventListener(
    "click",
    function() {

        searchSeries();

    }
);


// =========================
// PRESS ENTER TO SEARCH
// =========================

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchSeries();

        }

    }
);


// =========================
// GENRE FILTERING
// =========================

genreButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {


            const genreId =
                button.dataset.seriesGenre;


            // Remove active
            genreButtons.forEach(function(btn) {

                btn.classList.remove("active");

            });


            // Add active
            button.classList.add("active");


            // All series
            if (genreId === "all") {

                getSeries();

                return;

            }


            // Genre API
            const GENRE_URL =
                `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`;


            fetch(GENRE_URL)

                .then(function(response) {

                    return response.json();

                })

                .then(function(data) {

                    console.log(
                        "Genre Series:",
                        data
                    );

                    displaySeries(data.results);

                })

                .catch(function(error) {

                    console.log(
                        "Genre Error:",
                        error
                    );

                });

        }
    );

});


// =========================
// SERIES DETAILS
// =========================

function showSeriesDetails(seriesId) {


    const DETAILS_URL =
        `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${API_KEY}&language=en-US`;


    fetch(DETAILS_URL)

        .then(function(response) {

            return response.json();

        })

        .then(function(show) {


            console.log(
                "Series Details:",
                show
            );


            const modal =
                document.querySelector("#series-modal");


            const details =
                document.querySelector("#series-details");


            details.innerHTML = `

                <div class="movie-details">


                    <img
                        src="${IMAGE_URL}${show.poster_path}"
                        alt="${show.name}"
                    >


                    <div class="movie-details-info">


                        <h2>
                            ${show.name}
                        </h2>


                        <p class="rating">
                            ⭐ ${
                                show.vote_average
                                ? show.vote_average.toFixed(1)
                                : "N/A"
                            } / 10
                        </p>


                        <p class="release-date">
                            📅 ${
                                show.first_air_date ||
                                "Unknown"
                            }
                        </p>


                        <div class="genres">

                            ${
                                show.genres
                                ? show.genres.map(
                                    function(genre) {

                                        return `
                                            <span class="genre">
                                                ${genre.name}
                                            </span>
                                        `;

                                    }
                                ).join("")
                                : ""
                            }

                        </div>


                        <h3>
                            Overview
                        </h3>


                        <p class="overview">

                            ${
                                show.overview ||
                                "No description available."
                            }

                        </p>


                        <div class="trailer-section">

                            <button
                                class="trailer-btn"
                                onclick="watchSeriesTrailer(${show.id})">

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
                "Error loading series details:",
                error
            );

        });

}


// =========================
// CLOSE SERIES MODAL
// =========================

document.addEventListener(
    "click",
    function(event) {


        // Close button
        if (
            event.target.closest(
                "#close-series-modal"
            )
        ) {

            document.querySelector(
                "#series-modal"
            ).style.display = "none";

        }


        // Click outside modal
        if (
            event.target.id === "series-modal"
        ) {

            document.querySelector(
                "#series-modal"
            ).style.display = "none";

        }

    }
);


// =========================
// ESCAPE KEY
// =========================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {


            const modal =
                document.querySelector(
                    "#series-modal"
                );


            modal.style.display = "none";

        }

    }
);


// =========================
// ADD SERIES TO FAVORITES
// =========================

function addSeriesToFavorites(show) {


    // Get existing favorites
    let favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];


    // Check if already favorite
    const alreadyFavorite =
        favorites.some(function(item) {

            return (
                item.id === show.id &&
                item.media_type === "tv"
            );

        });


    if (alreadyFavorite) {

        alert(
            "This web series is already in your favorites ❤️"
        );

        return;

    }


    // Create favorite object
    const seriesFavorite = {

        id: show.id,

        title: show.name,

        name: show.name,

        poster_path: show.poster_path,

        release_date: show.first_air_date,

        first_air_date: show.first_air_date,

        vote_average: show.vote_average,

        overview: show.overview,

        media_type: "tv"

    };


    // Add
    favorites.push(seriesFavorite);


    // Save
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    alert(
        "Web series added to favorites ❤️"
    );

}


// =========================
// WATCH SERIES TRAILER
// =========================

function watchSeriesTrailer(seriesId) {


    const VIDEO_URL =
        `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${API_KEY}`;


    fetch(VIDEO_URL)

        .then(function(response) {

            return response.json();

        })

        .then(function(data) {


            console.log(
                "Series Videos:",
                data
            );


            const videos =
                data.results;


            // Find official trailer
            let trailer =
                videos.find(
                    function(video) {

                        return (
                            video.site === "YouTube" &&
                            video.type === "Trailer" &&
                            video.key
                        );

                    }
                );


            // Try teaser
            if (!trailer) {

                trailer =
                    videos.find(
                        function(video) {

                            return (
                                video.site === "YouTube" &&
                                video.type === "Teaser" &&
                                video.key
                            );

                        }
                    );

            }


            // Try any YouTube video
            if (!trailer) {

                trailer =
                    videos.find(
                        function(video) {

                            return (
                                video.site === "YouTube" &&
                                video.key
                            );

                        }
                    );

            }


            if (trailer) {


                const trailerModal =
                    document.querySelector(
                        "#series-trailer-modal"
                    );


                const trailerFrame =
                    document.querySelector(
                        "#series-trailer-frame"
                    );


                trailerFrame.src =
                    `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;


                trailerModal.style.display =
                    "flex";


            } else {


                alert(
                    "Sorry, no trailer is available for this web series 😕"
                );

            }

        })


        .catch(function(error) {

            console.log(
                "Series Trailer Error:",
                error
            );


            alert(
                "Unable to load the trailer 😕"
            );

        });

}


// =========================
// CLOSE SERIES TRAILER
// =========================

document.addEventListener(
    "click",
    function(event) {


        // Close button
        if (
            event.target.closest(
                "#close-series-trailer"
            )
        ) {


            const trailerModal =
                document.querySelector(
                    "#series-trailer-modal"
                );


            const trailerFrame =
                document.querySelector(
                    "#series-trailer-frame"
                );


            trailerModal.style.display =
                "none";


            // Stop video
            trailerFrame.src = "";

        }


        // Click outside
        if (
            event.target.id ===
            "series-trailer-modal"
        ) {


            const trailerModal =
                document.querySelector(
                    "#series-trailer-modal"
                );


            const trailerFrame =
                document.querySelector(
                    "#series-trailer-frame"
                );


            trailerModal.style.display =
                "none";


            // Stop video
            trailerFrame.src = "";

        }

    }
);


// =========================
// ESCAPE - TRAILER
// =========================

document.addEventListener(
    "keydown",
    function(event) {


        if (event.key === "Escape") {


            const trailerModal =
                document.querySelector(
                    "#series-trailer-modal"
                );


            const trailerFrame =
                document.querySelector(
                    "#series-trailer-frame"
                );


            trailerModal.style.display =
                "none";


            trailerFrame.src = "";

        }

    }
);


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
        "light-mode"
    );


    themeToggle.textContent = "🌙";


} else {


    themeToggle.textContent = "☀️";

}


// Toggle theme
themeToggle.addEventListener(
    "click",
    function() {


        document.body.classList.toggle(
            "light-mode"
        );


        if (
            document.body.classList.contains(
                "light-mode"
            )
        ) {


            themeToggle.textContent =
                "🌙";


            localStorage.setItem(
                "theme",
                "light"
            );


        } else {


            themeToggle.textContent =
                "☀️";


            localStorage.setItem(
                "theme",
                "dark"
            );

        }

    }
);


// =========================
// START WEBSITE
// =========================

getSeries();