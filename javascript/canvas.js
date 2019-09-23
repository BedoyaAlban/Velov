var Savnac = {
    // Attributs de référencement du contexte canvas et 2dcanvas
    canvas : "",
    ctx : "",
    // Attributs pour garder la trace de la position de la souris et de l'état du bouton gauche
    mouseX : 0,
    mouseY : 0,
    mouseDown : 0,
    // garde la trace de l’ancienne / dernière position lorsqu’on trace une ligne
    // On le met à -1 au début pour indiquer que nous n'avons pas encore de valeur
    lastX : -1,
    lastY : -1,
    // Attributs pour garder la trace de la position tactile
    touchX : 0,
    touchY : 0,
    lineThickness : 4,
    clearCanvas : document.getElementById("clearbutton"),
    buttonValider : document.getElementById("submitbutton"),
    // Configure le canevas et ajoute nos gestionnaires d'événements après le chargement de la page
    init : function() {
        // Récupère l'élément canvas spécifique du document HTML
        this.canvas = document.getElementById("sketchpad");
        // Si le navigateur prend en charge la balise canvas, obtenez le contexte de dessin 2D pour cette toile
        if (this.canvas.getContext)
            this.ctx = Savnac.canvas.getContext("2d");
        // Vérifie que nous avons un contexte valide pour dessiner sur / avec avant d'ajouter des gestionnaires d'événement
        if (this.ctx) {
            // Réagir aux événements de la souris sur la toile, et mouseup sur l'ensemble du document
            Savnac.canvas.addEventListener("mousedown", Savnac.sketchpad_mouseDown, false);
            Savnac.canvas.addEventListener("mousemove", Savnac.sketchpad_mouseMove, false);
            window.addEventListener("mouseup", Savnac.sketchpad_mouseUp, false);
            // Réagir pour toucher les événements sur la toile
            Savnac.canvas.addEventListener("touchstart", Savnac.sketchpad_touchstart, false);
            Savnac.canvas.addEventListener("touchmove", Savnac.sketchpad_touchMove, false);
            Savnac.canvas.addEventListener('touchend', Savnac.sketchpad_touchEnd, false);
        }
    },
    // Dessine un point à une position spécifique sur le nom du canvas fournie
    // Les paramètres sont: Un contexte de canevas, la position x, la position y, la taille du point
    dessinLigne : function(ctx,x,y,size) {
        // Si lastX n'est pas défini, définissez lastX et lastY sur la position actuelle 
        if (Savnac.lastX==-1) {
            Savnac.lastX=x;
	    Savnac.lastY=y;
        }
        // Utilisons le noir en définissant les valeurs RVB sur 0 et 255 alpha (complètement opaques)
        r=0; g=0; b=0; a=255;
        // Sélectionne un style de remplissage
        ctx.strokeStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
        // Défini le style de ligne "cap" pour arrondir afin que les lignes à des angles différents puissent se rejoindre
        ctx.lineCap = "round";
        //ctx.lineJoin = "round";
        // Dessine une ligne remplie
        ctx.beginPath();
        // Tout d'abord, passe à l'ancienne (précédente) position
	    ctx.moveTo(Savnac.lastX,Savnac.lastY);
        // Dessine maintenant une ligne à la position actuelle du pointeur / contact
	    ctx.lineTo(x,y);
        // Défini l'épaisseur du trait et tracer la ligne
        ctx.lineWidth = size;
        ctx.stroke();
        ctx.closePath();
        // Mettre à jour la dernière position pour référencer la position actuelle
	    Savnac.lastX=x;
	    Savnac.lastY=y;
    },
    // Garde la trace du bouton de la souris enfoncé et dessine un point à l'emplacement actuel
    sketchpad_mouseDown : function() {
        Savnac.mouseDown=1;
        Savnac.dessinLigne(Savnac.ctx,Savnac.mouseX,Savnac.mouseY,Savnac.lineThickness);
    },
    // Conserve la position de la souris et dessine un point si le bouton de la souris est pressé
    sketchpad_mouseUp : function() {
        Savnac.mouseDown=0;
        Savnac.lastX=-1;
        Savnac.lastY=-1;
    },
     sketchpad_touchEnd : function() {
         // Réinitialise lastX et lastY à -1 pour indiquer qu'ils sont maintenant invalides, puisque nous avons levé le "stylo"
         Savnac.lastX=-1;
         Savnac.lastY=-1;
    },
    // Dessine quelque chose et empêche le défilement par défaut lorsque le mouvement tactile est détecté
    sketchpad_mouseMove(e) {
        // Mettre à jour les coordonnées de la souris lorsqu'il est déplacé
        Savnac.getMousePos(e);
        // Dessine un point si le bouton de la souris est pressé
        if (Savnac.mouseDown==1){
            Savnac.dessinLigne(Savnac.ctx,Savnac.mouseX,Savnac.mouseY,Savnac.lineThickness);
            Savnac.buttonValider.style.display = 'inline-block';
        }
    },
    // Récupère la position actuelle de la souris par rapport à la partie supérieure gauche de la toile
    getMousePos : function(e) {
        if (!e)
            var e = event;
        if (e.offsetX) {
            Savnac.mouseX = e.offsetX;
            Savnac.mouseY = e.offsetY;
        } 
        else if (e.layerX) {
            Savnac.mouseX = e.layerX;
            Savnac.mouseY = e.layerY;
        }   
    },
    // Dessine quelque chose quand un démarrage tactile est détecté
    sketchpad_touchstart : function() {
        // Mettre à jour les coordonnées tactiles
        Savnac.getTouchPos();
        Savnac.buttonValider.style.display = 'inline-block'
        // Empêche le déclenchement d'un événement mousedown supplémentaire
        Savnac.dessinLigne(Savnac.ctx,Savnac.touchX,Savnac.touchY,Savnac.lineThickness);
        event.preventDefault();
    },
    // Dessine quelque chose et empêche le défilement par défaut lorsque le mouvement tactile est détecté
    sketchpad_touchMove : function(e) {
        // Mettre à jour les coordonnées tactiles
        Savnac.getTouchPos(e);
        // Lors d'un événement touchmove, contrairement à un événement mousemove, il n'est pas nécessaire de vérifier si le toucher est activé, car il y aura toujours un contact avec l'écran par définition
        Savnac.dessinLigne(Savnac.ctx,Savnac.touchX,Savnac.touchY,Savnac.lineThickness);
        // Empêche le déclenchement d'un événement mousedown supplémentaire
        event.preventDefault();
    },
    // Obtenir la position tactile par rapport à la partie supérieure gauche de la toile
    // Quand nous obtenons les valeurs brutes de pageX et pageY ci-dessous, ils prennent en compte le défilement sur la page
    // mais pas la position relative à notre div cible. Nous allons les ajuster en utilisant "target.offsetLeft" et
    // "target.offsetTop" pour obtenir les bonnes valeurs par rapport à la partie supérieure gauche du canevas.
    getTouchPos : function(e) {
        if(!e)
            var e = event;
        if(e.touches) {
            if (e.touches.length == 1) { // Ne traite qu'avec un doigt
                var touch = e.touches[0];// Récupère les informations pour le doigt # 1
                Savnac.touchX=touch.pageX-touch.target.offsetLeft;
                Savnac.touchY=touch.pageY-touch.target.offsetTop;
            }
        }
    }
};
// Efface le contexte du canevas en utilisant la largeur et la hauteur du canevas
Savnac.clearCanvas.addEventListener("click", function() {
    Savnac.ctx.clearRect(0, 0, Savnac.canvas.width, Savnac.canvas.height);
    Savnac.buttonValider.style.display = 'none';    
})






