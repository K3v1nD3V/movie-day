//GLOBAL VARIABLES
let pag = 1
let totalPages
let url

//DATA
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': '70663b0dc46c468cef00141424d0fdc4',
        "language": navigator.language 
    },
});

const endpoints = {
    movie: '/movie',
    trending: '/trending/movie/day',
    popular: '/movie/popular',
    cartelera: '/movie/now_playing',
    discover: '/discover/movie',
    search: '/search/movie'
}

async function getData(endpoint) {
    try{
        const {data} = await api.get(endpoint);
        return data
    }catch(e){
        console.log(new Error('Get-Data: ' + e));
    }
}

function getDataFromLocalStrorage() {
    const likedMoviesObject = localStoregeHelper()
    const likedMoviesArray = Object.values(likedMoviesObject)

    return likedMoviesArray
}
function localStoregeHelper() {
    const item = JSON.parse(localStorage.getItem('likedMovies'))
    let movies
    if (item) {
        movies = item
    }else{
        movies = {}
    }
    return movies
}
function localStorageControler(movie) {
    const likedMovies = localStoregeHelper()
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined
    } else {
        likedMovies[movie.id] = movie
    }
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies))
}
//OBSERVER
const loadImgOptions = {
    root: null,
    threshold: 0.1,
}
function loadImg(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img_src = entry.target.getAttribute('img_src')
            entry.target.src = img_src
        }
    })
}
const loadImgObserver = new IntersectionObserver(loadImg, loadImgOptions)

//EVENT LISTENERS
window.addEventListener('scroll', (e) => {
    if (location.hash.startsWith('#search=') || location.hash.startsWith('#show=')) {
        if (pag >= totalPages) {
            return
        }
        if(document.documentElement.scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 50){
            showMore(e)
        }
    }
})
country_select.addEventListener('change', () => {
    const codigo_ISO = country_select.options[country_select.selectedIndex].value
    getData(`${endpoints.cartelera}?region=${codigo_ISO}`)
        .then((data) => {
            carteleraScroller.innerHTML = ''
            render(data, carteleraScroller)
        })
})
show_more.forEach(button => {
    button.addEventListener('click', (e) => {
        location.hash = `#show=${e.composedPath()[0].name}`
    })
})
submit.addEventListener('click', (e) => {
    search(e, search_input)
})
searchView_submit.addEventListener('click', (e) => {
    search(e, searchView_input)
    submitSearch() 
    pag = 1
})

//HANDLES

function createMovieCard(movie) {
    console.log(movie);
    const likedMovies = localStoregeHelper()
    
    const scroller_card = document.createElement('div');
    const movie_img = document.createElement('img');
    // const favorite_container = document.createElement('div');
    const favorite_icon = document.createElement('li')
    const info_div = document.createElement('div');
    const movie_name = document.createElement('h3');
    const row_div = document.createElement('div');
    // const streaming_img = document.createElement('img');
    const like_container = document.createElement('div');
    const like_icon = document.createElement('i');
    const porcen_container = document.createElement('div');
    const porcen_number = document.createElement('p');
    const porcen_icon_container = document.createElement('span');
    const porcen_icon = document.createElement('p')

    scroller_card.className = 'scroller_card'
    scroller_card.setAttribute('movie_id', movie.id)

    movie_img.setAttribute('img_src', `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)
    movie_img.src = `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg`
    movie_img.alt = movie.original_title
    movie_img.addEventListener('click', () => {
        location.hash = `#movie=${movie.id}`
    });
    
    favorite_icon.classList.add('favorite','fa-regular','fa-star')
    favorite_icon.addEventListener('click', (e) => {
        const movie_id = e.composedPath()[1].getAttribute('movie_id')
        const movies = document.querySelectorAll(`div[movie_id='${movie_id}']`)
        movies.forEach(movie => {
            movie.children[0].classList.toggle('fa-regular')
            movie.children[0].classList.toggle('fa-solid')
        });
        
        localStorageControler(movie)
        
        const favorites = getDataFromLocalStrorage()
        rederFavorites(favorites)
        
    });
    if (likedMovies[movie.id]) {
        favorite_icon.classList.toggle('fa-regular')
        favorite_icon.classList.toggle('fa-solid')
    }
    info_div.className = 'info';

    movie_name.textContent = movie.title

    row_div.className = 'row';

    like_container.classList.add('like-container','row')

    like_icon.classList.add('like','fa-regular', 'fa-thumbs-up')

    porcen_container.className = 'row';
    porcen_number.textContent =  Math.round(movie.vote_average * 10);
    
    porcen_icon_container.className = 'porcen';
    
    porcen_icon.textContent = "%"

    
    porcen_icon_container.appendChild(porcen_icon)
    
    porcen_container.appendChild(porcen_number)
    porcen_container.appendChild(porcen_icon_container)
    
    like_container.appendChild(like_icon);
    like_container.appendChild(porcen_container);
    
    // row_div.appendChild(streaming_img)
    row_div.appendChild(like_container);

    info_div.appendChild(movie_name)
    info_div.appendChild(row_div )

    scroller_card.appendChild(favorite_icon)
    scroller_card.appendChild(movie_img)
    scroller_card.appendChild(info_div)
    
    let target = movie_img
    loadImgObserver.observe(target)

    return scroller_card
}
function render(movies, scroller, clear = true) {
    let movie_list = movies
    if (movies.results) {
            movie_list = movies.results
    }
    if (clear) {
        scroller.innerHTML = ''
    }
    movie_list.forEach(movie => {
        if (!movie.poster_path) {
            return
        }
        
        const movie_card = createMovieCard(movie);
        scroller.appendChild(movie_card);
    });
    

}
function rederFavorites(favorites) {
    favoriteScroller.innerHTML = ''
    
    if (!favorites.length) {
        const span = document.createElement('span');
        
        span.textContent = 'No hay ninguna pelicula en tu lista de favoritos.'
        span.className = 'span';
        
        favoriteScroller.appendChild(span);
    }else{
        render(favorites, favoriteScroller)
    }
}
async function rederHome() {
    try {
        const popular = await getData(`${endpoints.popular}?page=1`)
        const cartelera = await getData(`${endpoints.cartelera}`)
        const trending = await getData(`${endpoints.trending}`)
        const favorites = getDataFromLocalStrorage()
       
        render(trending, trendingScroller)
        render(popular, popularScroller)
        render(cartelera, carteleraScroller)
        // render(favorites, favoriteScroller)
        rederFavorites(favorites)
        
    } catch (error) {
        console.log(error);
    }
}
function search(e, search_input) {
    e.preventDefault();
    location.hash = '#search=' + search_input.value
}
function submitSearch() {
    const query = location.hash.split('=')[1]

    getData(`${endpoints.search}?query=${query}`)
        .then((data) => {
            totalPages = data.total_pages
            render(data, searchView_container)
        })
}
function showMore(e) {
    pag++
    let container

    if(location.hash.startsWith('#search=')){
        container = searchView_container
        
    }else if(location.hash.startsWith('#show=')){
        container = showMore_container
    }
    
    let simbol = '?'
    if (url.split('?').length > 1) {
        simbol = '&'
    }
    getData(`${url}${simbol}page=${pag}`)
        .then((data) =>{
            render(data,container,false)
        })
}

