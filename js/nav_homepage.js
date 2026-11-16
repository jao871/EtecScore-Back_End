/**
    Este arquivo apresenta as functions de navegação da homepage com outras páginas 
 */

document.addEventListener("DOMContentLoaded", () => {
    configurarCliqueCardsJogos();
});

/**
 * Function: configurarCliqueCardsJogos
 * Utilidade: faz os cards de informação redirecionarem para os profiles dos times/atletas
 */
function configurarCliqueCardsJogos() {
    // Seleciona os cardas
    const cardsJogos = document.querySelectorAll('.card-jogo');

    cardsJogos.forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            
            window.location.href = '??? (página de profile especifica)';
        });
    });
}