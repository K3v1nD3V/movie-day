const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': '70663b0dc46c468cef00141424d0fdc4'
    },
});

const endpoints = {
    movie: '/movie',
    trending: '/trending/movie/day',
    popular: '/movie/popular',
    cartelera: '/movie/now_playing',
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
    
    porcen_number.textContent = '00';
    
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
function render(movies, scroller) {
    let movie_list = movies
    if (movies.results) {
            movie_list = movies.results
    }
    scroller.innerHTML = ''
    movie_list.forEach(movie => {
            const movie_card = createMovieCard(movie);
            scroller.appendChild(movie_card);
    });
}
async function rederHome() {
    try {
        const popular = await getData(`${endpoints.popular}?page=3`)
        const cartelera = await getData(`${endpoints.cartelera}`)
        const trending = await getData(`${endpoints.trending}`)
            
        render(trending, trendingScroller)
        render(popular, popularScroller)
        render(cartelera, carteleraScroller)
    } catch (error) {
        console.log(error);
    }
}

country_select.addEventListener('change', () => {
    
    const codigo_ISO = country_select.options[country_select.selectedIndex].value
    getData(`${endpoints.cartelera}?region=${codigo_ISO}`)
        .then((data) => {
            carteleraScroller.innerHTML = ''
            render(data, carteleraScroller)
        })
})
