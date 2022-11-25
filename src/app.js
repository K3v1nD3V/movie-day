const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': '70663b0dc46c468cef00141424d0fdc4'
    },
});
let pag = 1
let totalPages
let url
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

function createMovieCard(movie) {
    const scroller_card = document.createElement('div');
    const movie_img = document.createElement('img');
    const info_div = document.createElement('div');
    const movie_name = document.createElement('h3');
    const row_div = document.createElement('div');
    const streaming_img = document.createElement('img');
    const like_container = document.createElement('div');
    const like_icon = document.createElement('i');
    const porcen_container = document.createElement('div');
    const porcen_number = document.createElement('p');
    const porcen_icon_container = document.createElement('span');
    const porcen_icon = document.createElement('p')

    scroller_card.className = 'scroller_card'
    scroller_card.setAttribute('movie_id', movie.id)

    movie_img.src = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`
    movie_img.alt = movie.original_title
    movie_img.addEventListener('click', () => {
        location.hash = `#movie=${movie.id}`
    });
    
    info_div.className = 'info';

    movie_name.textContent = movie.original_title

    row_div.className = 'row';
    
    // getData(`/movie/${movie.id}/watch/providers`)
    //     .then(mv => {
    //         // console.log(mv);
    //             // streaming_img.src = 
    //     })

    like_container.classList.add('like-container','row')

    like_icon.classList.add('like','fa-regular', 'fa-thumbs-up')

    porcen_container.className = 'row';
    console.log(typeof movie.vote_average);
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

    scroller_card.appendChild(movie_img)
    scroller_card.appendChild(info_div)
    
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
            // console.log(movie);
            if (!movie.poster_path) {
                return
            }
            const movie_card = createMovieCard(movie);
            scroller.appendChild(movie_card);
    });
}
async function rederHome() {
    try {
        const popular = await getData(`${endpoints.popular}?page=1`)
        const cartelera = await getData(`${endpoints.cartelera}`)
        const trending = await getData(`${endpoints.trending}`)
            
        render(trending, trendingScroller)
        render(popular, popularScroller)
        render(cartelera, carteleraScroller)
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
            showMore_button_controler(searchView_showMore_button)
        })
}
function showMore(e) {
    const container = e.composedPath()[1].firstElementChild
    pag++
    let simbol = '?'
    if (url.split('?').length > 1) {
        simbol = '&'
    }
    console.log(pag);
    getData(`${url}${simbol}page=${pag}`)
        .then((data) =>{
            render(data,container,false)
        })
}
function showMore_button_controler(showButton) {
    console.log(`${pag} - ${totalPages} ${pag == totalPages}`);
    if (pag == totalPages) {
        console.log('delete');
        showButton.classList.add('inactive')
    }else{
        showButton.classList.remove('inactive')
    }
}    
showMore_button.addEventListener('click', (e) => {
    showMore(e)
    console.log('funcionando');
    showMore_button_controler(showMore_button)
})
searchView_showMore_button.addEventListener('click', (e) => {
    showMore(e)
    showMore_button_controler(searchView_showMore_button)
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
        console.log(e.composedPath()[0].name);
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
