window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    console.log({ location });
    
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
    console.log('HOME');
    (async function(){
        const popular = await getData(`${endpoints.popular}`)
        const cartelera = await getData(`${endpoints.cartelera}`)
        const trending = await getData(`${endpoints.trending}`)
        
        render(trending, trendingScroller)
        render(popular, popularScroller)
        render(cartelera, carteleraScroller)
    })();
}

function categoriesPage(){
    console.log('CATERGORIES');
}

function movieDetailsPage(){
    console.log('MOVIE');
}

function searchPage() {
    console.log('SEARCH');
}

function trendsPage(){
    console.log('TREAD');
}