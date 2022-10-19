console.log('funcionando...');

document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    console.log(e);
})