var Timer = {
    countDownDate : null,
    now : null,
    distance : null,
    minutes : null,
    seconds : null,
    texte : document.getElementById("sessionstorage"),
    buttonv : document.getElementById("submitbutton"), 
    buttonc : document.getElementById("annuler"),
    // Méthode effectuant le décompte
    timer : function(){
        // Variable pour stocker le point de repère avant la boucle de soustraction
        var distance ;
        // Si une réservation est déjà en cours le point de repère est celui lorsque le timer a été stoppé au chergement de la page
        if (sessionStorage.getItem('distance') !== null) {
            distance = sessionStorage.getItem('distance');
        } else {
            // Pas de réservation, décompte commence à 20 min
            distance = 1200000;
        };
        // ParseInt() analyse la chaîne distance fournie en argument et la renvoie en entier
        countDownDate = new Date().getTime() + parseInt(distance);
        // Boucle s'effectuant chaque seconde 
        x = setInterval(Timer.count, 1000);
        document.getElementById("text_timer").innerHTML = "Vous avez réservé un Vélo'v à la station : " + sessionStorage.getItem('nom') + " - ";
        document.getElementById("base_text").style.display = 'none';
        Timer.texte.style.display = 'inline-block';
    },
    // Méthode qui soustrait le temps actuel à un temps sélectionné lors du lancement du minuteur
    count : function() {
        now = new Date().getTime();
        distance = this.countDownDate - this.now;
        // Stockage de la distance restante avant la fin du décompte
        sessionStorage.setItem('distance', this.distance);
        // Calculs de temps pour les minutes et secondes
        minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
        // Affiche le résultat dans l'élément HTML
        document.getElementById("minutes").innerHTML = this.minutes + " m";
        document.getElementById("seconds").innerHTML = this.seconds + " s";
        // Si le décompte est terminé, remise à zéro du minuteur
        if (this.distance < 0) {
            clearInterval(x);
            document.getElementById("text_timer").innerHTML = "Votre réservation a expirée!";
        } 
    },
    // Méthode stoppant le décompte + remise à zéro du minuteur + remise à zéro du stockage
    stopTimer : function() {
        clearInterval(x);
        sessionStorage.clear();
        Timer.texte.style.display = 'none';
        document.getElementById("base_text").style.display = 'inline-block';
    },
};
// Lance le décompte une fois la signature valide 
Timer.buttonv.addEventListener("click", function() {
    Timer.timer();
    document.getElementById("sketchpadapp").style.display = 'none';
    document.getElementById("btnReserverVelo").style.display = 'none';
});
// Appel de la méthode pour stopper et remettre à zéro le timer
Timer.buttonc.addEventListener("click", function() {
    Timer.stopTimer();
    Timer.buttonv.style.display = 'none';
});
