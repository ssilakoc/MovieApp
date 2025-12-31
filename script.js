 const API_KEY = '4669d029a3d6864bb0d3cba8b9bd0a28';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=tr-TR&page=1`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query="`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const logo = document.getElementById('logo');
const watchlistSection = document.getElementById('watchlist-section');
const watchlistContainer = document.getElementById('watchlist-container');
const watchlistBtn = document.getElementById('watchlist-btn');
const backBtn = document.getElementById('back-btn');

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

getMovies(API_URL);

async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length > 0) {
        showMovies(data.results);
    } else {
        main.innerHTML = '<h2 class="no-results">Maalesef sonuç bulunamadı.</h2>';
    }
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, id } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        const movieImage = poster_path 
            ? IMG_PATH + poster_path 
            : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop';

        movieEl.innerHTML = `
            <img src="${movieImage}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>
            <div class="overview">
                <h3>Özet</h3>
                <p>${overview || "Bu film için henüz Türkçe özet girilmemiş."}</p>
                <button class="add-btn" style="background: #f39c12; color: #22254b; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px; font-weight: bold;" onclick="addToWatchlist(${id}, '${title.replace(/'/g, "\\'")}', '${poster_path}')">İzleme Listesine Ekle</button>
            </div>
        `;
        main.appendChild(movieEl);
    });
}

function getClassByRate(vote) {
    if (vote >= 8) return 'green';
    else if (vote >= 5) return 'orange';
    else return 'red';
}

function addToWatchlist(id, title, poster_path) {
    if (!watchlist.find(m => m.id === id)) {
        watchlist.push({ id, title, poster_path });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        showToast(`${title} listeye eklendi!`, "success");
    } else {
        showToast("Bu film zaten listenizde.", "error");
    }
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    if(!container) return; // toast-container yoksa hata verme
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

function displayWatchlist() {
    watchlistContainer.innerHTML = '';
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = '<h3 style="grid-column: 1/-1; text-align: center;">Listeniz henüz boş.</h3>';
        return;
    }
    watchlist.forEach((movie) => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        const movieImage = movie.poster_path ? IMG_PATH + movie.poster_path : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop';
        movieEl.innerHTML = `
            <img src="${movieImage}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <button class="remove-btn" onclick="removeFromWatchlist(${movie.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Kaldır</button>
            </div>
        `;
        watchlistContainer.appendChild(movieEl);
    });
}

function removeFromWatchlist(id) {
    watchlist = watchlist.filter(m => m.id !== id);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
        search.value = '';
    } else {
        window.location.reload();
    }
});

logo.addEventListener('click', () => {
    getMovies(API_URL);
    search.value = '';
});

watchlistBtn.addEventListener('click', () => {
    main.classList.add('hidden');
    watchlistSection.classList.remove('hidden');
    displayWatchlist();
});

backBtn.addEventListener('click', () => {
    watchlistSection.classList.add('hidden');
    main.classList.remove('hidden');
});