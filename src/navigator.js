window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    pag = 1
    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage() 
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#show=')) {
        showMorePage();
    } else {
        homePage();
    }
}

function homePage() {
    homeContainer.classList.remove('inactive')
    movieInfoContainer.classList.add('inactive')
    showMoreContainer.classList.add('inactive')
    searchContainer.classList.add('inactive')
    
    rederHome()
    window.scrollTo(0, 0);
}

function showMorePage(){
    showMoreContainer.classList.remove('inactive')
    homeContainer.classList.add('inactive')
    movieInfoContainer.classList.add('inactive')
    searchContainer.classList.add('inactive')
    
    let genresArray = []
    
    const hash = location.hash.split('=')[1]
    
    if (hash == 'popular'){
        url = `${endpoints.popular}`
    }
    else if(hash == 'trending'){
        url = `${endpoints.trending}`
    }
    
    getData(url)
        .then(data => {
            totalPages = data.total_pages
            render(data,showMore_container)
            showMore_button_controler(showMore_button)
        })
    
    getData('/genre/movie/list')
        .then((data) => {
            const genres = data.genres
            genders_container.innerHTML = ''
            genres.forEach(genre => {
                const li = document.createElement('li')
                
                li.textContent = genre.name
                li.className = 'genre'
                li.id = genre.id
                
                li.addEventListener('click',(e) => {
                    e.target.classList.toggle('filterActive')

                    if (!e.target.classList.contains('filterActive')) {
                        genresArray.splice(genresArray.indexOf(e.target.id), 1)
                    }else{
                        genresArray.push(e.target.id)
                    }
            
                    add_filter.classList.add('addFilters_button-actived')
                     
                })
                
                genders_container.appendChild(li)
            })
        })

        add_filter.addEventListener('click', () =>{
            pag = 1
            if (add_filter.classList.contains('addFilters_button-actived')) {
                add_filter.classList.remove('addFilters_button-actived')
                
                const genresIds = genresArray.join(',')
                
                getData(`${endpoints.discover}?with_genres=${genresIds}`)
                    .then(data => {
                        console.log(data);
                        totalPages = data.total_pages
                        render(data,showMore_container)
                        showMore_button_controler(showMore_button)
                        url = `${endpoints.discover}?with_genres=${genresIds}`
                    })
            }
           
        })  
    
    window.scrollTo(0, 0);
}

function movieDetailsPage(){    
    const movie_id = location.hash.split('=')[1]
    
    movieInfoContainer.classList.remove('inactive')
    homeContainer.classList.add('inactive');
    showMoreContainer.classList.add('inactive')
    searchContainer.classList.add('inactive')

    getData(`${endpoints.movie}/${movie_id}`)
        .then(movie_info => {

            movie_img.src = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + movie_info.poster_path
            movie_img.alt = movie_info.title

            movie_title.textContent = movie_info.title
            date.textContent = movie_info.release_date
            
            let genre_list = []
            movie_info.genres.forEach(gen => {
                genre_list.push(gen.name)
            })
            genres.textContent = genre_list.join(', ')
            
            let minutes = movie_info.runtime
            let hours = 0
            let time = ''
            while (minutes - 60 >= 0) {
                minutes -= 60
                hours += 1

                time = `${hours}h ${minutes}m`
            }
            duration.textContent = time
            
            company_logo.src = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + movie_info.production_companies[0].logo_path
            calification.childNodes[0].textContent = Math.round(movie_info.vote_average * 10)

            sipnosis.textContent = movie_info.overview
        })
    getData(`${endpoints.movie}/${movie_id}/similar`)
        .then(similares => {
            let similar_list = similares.results
            render(similar_list, similaresScroller)
        })
    
    window.scrollTo(0, 0);
}

function searchPage() {
    searchContainer.classList.remove('inactive')
    movieInfoContainer.classList.add('inactive')
    homeContainer.classList.add('inactive');
    showMoreContainer.classList.add('inactive')
    
    url = `${endpoints.search}?query=${location.hash.split('=')[1]}`

    submitSearch() 
}

function trendsPage(){
    console.log('TREAD');
}