// Sélectionne les éléments controls et les affiches en 'inline-block'
var controls = document.querySelectorAll('.controls');
for(var i=0; i<controls.length; i++){
    controls[i].style.display = 'inline-block';
}
// Objet pour le diaporama
var Slider = {
    
    slides : document.querySelectorAll('#slides .diaporama'),
    currentSlide : 0,
    // Boucle du défilement des slides
    slideInterval : setInterval(this.nextSlide,5000),
    playing : true,
    pauseButton : document.getElementById("pause"),
    next : document.getElementById("next"),
    previous : document.getElementById("previous"),
    // Méthode pour aller à la slide suivante
    nextSlide : function(){
           Slider.goToSlide(Slider.currentSlide+1);
    },
    // Méthode pour aller à la slide précédente
    previousSlide : function(){
        Slider.goToSlide(Slider.currentSlide-1);
    },
    // Modifie la classe du diaporama en cours
    goToSlide : function(n){
        Slider.slides[Slider.currentSlide].className = 'diaporama';
        Slider.currentSlide = (n+Slider.slides.length)%Slider.slides.length;
        Slider.slides[Slider.currentSlide].className = 'diaporama one';
    }, 
    // Méthode pour mettre en pause le diaporama
    pauseSlideshow : function(){
        Slider.pauseButton.innerHTML = "&#9658;";
        Slider.playing = false;
        clearInterval(Slider.slideInterval);
    },
    // Méthode relançant la boucle de défilement du diaporama
    playSlideshow : function(){
        Slider.pauseButton.innerHTML = '&#10074;&#10074;'; // pause character
        Slider.playing = true;
        Slider.slideInterval = setInterval(Slider.nextSlide,5000);
    }
};
// Evénement au clique du bouton pause, appel de la méthode mettant en pause le slider si le slider est en boucle  
Slider.pauseButton.onclick = function(){
  if(Slider.playing){ Slider.pauseSlideshow(); }
     else{ Slider.playSlideshow(); }
};
// Evénement pour stopper le slider de la boucle et passer à la slide suivante manuellement
Slider.next.onclick = function(){
  Slider.pauseSlideshow();
  Slider.nextSlide();
};
// Evénement pour stopper le slider de la boucle et passer à la slide précédente manuellement
Slider.previous.onclick = function(){
  Slider.pauseSlideshow();
  Slider.previousSlide();
};
// Evénement pour utiliser la navigation du diaporama via le clavier flêche gauche et droite
document.addEventListener("keydown", function(e){
    if(e.keyCode === 37){
    Slider.previousSlide();
    }
    else if(e.keyCode === 39){
    Slider.nextSlide();
    }
});
    
