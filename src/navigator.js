window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    if (location.hash.startsWith('#trends')) {
        trendsPage();
    console.log('treands');
    } else if (location.hash.startsWith('#search=')) {
        searchPage() 
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }
}

function homePage() {
    homeContainer.classList.remove('inactive')
    movieInfoContainer.classList.add('inactive')
    rederHome()
}

function categoriesPage(){
    console.log('CATERGORIES');
}

function movieDetailsPage(){
    console.log('MOVIE');
    
    const movie_id = location.hash.split('=')[1]
    
    movieInfoContainer.classList.remove('inactive')
    homeContainer.classList.add('inactive');
    console.log(`${endpoints.movie}/${movie_id}`);
    
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
            calification.childNodes[0].textContent = Math.floor(movie_info.popularity)
            console.log(movie_info);
            console.log(movie_info);
            sipnosis.textContent = movie_info.overview
        })
    getData(`${endpoints.movie}/${movie_id}/similar`)
        .then(similares => {
            let similar_list = similares.results
            render(similar_list, similaresScroller)
        })
}

function searchPage() {
    console.log('SEARCH');
}

function trendsPage(){
    console.log('TREAD');
}