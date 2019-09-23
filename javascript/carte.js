var Map = {
    // On initialise la latitude et la longitude de Lyon (centre de la carte)
    lat : 45.758539,
    lon : 4.838040,
    map : null,
    apiJCDecaux : "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=6a893597b3f8f89dab88658580d8c282260afcf2",
    markers : [],
    // Méthode initialisant la carte + appel ajax
    initMap : function() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(this.lat, this.lon),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            scrollwheel: false,
            mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
            },
            navigationControl: true,
            navigationControlOptions: {
            style: google.maps.NavigationControlStyle.ZOOM_PAN
            }
        });
        // Nous appelons la fonction ajax 
        ajaxGet(this.apiJCDecaux, function (reponse) {
            // Réglage de la taille des markers
            var icon = {url: "./images/icon_velov_o.png",
                        scaledSize: new google.maps.Size(50, 50),
                        origin: new google.maps.Point(0,0), 
                        anchor: new google.maps.Point(25, 50)
                       };
            // Transforme la réponse en un tableau de stations
            var stations = JSON.parse(reponse);
            stations.forEach(function (station) {
                // Affiche différents marker suivant le statut de la station
                if (station.status === "OPEN" && station.available_bike_stands > 0) {
                    icon.url = "./images/icon_velov_o.png";
                } else if (station.status === "CLOSED") {
                    icon.url = "./images/icon_velov.png";
                } else if (station.available_bike_stands === 0) {
                    icon.url = "./images/icon_velov0.png";
                }
                var marker = new google.maps.Marker({
                    position: station.position,
                    icon: icon,       
				    title: station.name,
				    map: map
                }); 
                var content = {
                    nom : station.name,
                    adresse : station.address,
                    statut : station.status,
                    nbvelo : station.bike_stands,
                    velosrestant : station.available_bike_stands,
                    velosutilise : station.available_bikes,
                    btnreserver : document.getElementById("btnReserverVelo"),
                }
                // Affichage des informations de la station
                var contentHTML = "";
                contentHTML += "<div class='infos'>Numéro - Nom : " + content.nom;
                contentHTML += "</div><div class='infos'>Adresse : " + content.adresse;
                contentHTML += "</div><div class='infos'>Statut : " + content.statut;
                contentHTML += "</div><div class='infos'>Nombre de Vélo'v : " + content.nbvelo;
                contentHTML += "</div><div class='infos'>Nombre de Vélo'v disponible : " + content.velosrestant;
                contentHTML += "</div><div class='infos'>Nombre de Vélo'v utilisés : " + content.velosutilise;
                contentHTML += "</div>";
                // Conditions indiquant le statut de la station
                if (content.statut === "CLOSED") {
                    contentHTML += "<div id='close'>La station est fermée vous ne pouvez pas réserver de Vélo'v</div>";
                } else if (content.velosrestant === 0) {
                    contentHTML += "<div id='no_bikes'>Il ne reste plus de Vélo'v disponible sur cette station</div>";
                }
                // Evénements au clique d'un marker
                marker.addListener('click', function() {
                    document.getElementById("texte").style.display = 'block';
                    // Ajout des informations dans l'élément HTML 
                    document.getElementById("textes").innerHTML= contentHTML ;
                    // Remise à zéro du canvas au clique d'une station
                    Savnac.ctx.clearRect(0, 0, Savnac.canvas.width, Savnac.canvas.height);
                    document.getElementById("sketchpadapp").style.display = 'none';
                    // Conditions pour pouvoir réserver un vélo suivant le statut de la station
                    if (content.statut === "OPEN" && content.velosrestant > 0) {
                        content.btnreserver.style.display = 'inline-block';
                        sessionStorage.setItem('nom', station.name);
                    } else if (content.statut === "CLOSED") {
                        content.btnreserver.style.display = 'none';
                    } else if (content.velosrestant === 0) {
                        content.btnreserver.style.display = 'none';
                    }
                    // Condition empêchant une autre réservation lorsqu'une est en cours
                    if (sessionStorage.getItem('distance') !== null) {
                        document.getElementById("btnReserverVelo").style.display = 'none';
                        document.getElementById("sketchpadapp").style.display = 'none';
                    }
                });
                // Ajout des markers dans le tableau markers
                Map.markers.push(marker)
                // Affiche la canvas suite à la volonté de l'utilisateur de réserver un vélo
                content.btnreserver.addEventListener('click', function() {
                    document.getElementById("sketchpadapp").style.display = 'block';
                });
            });
            // Ajouter un marqueur clusterer pour gérer les marqueurs
            var markerCluster = new MarkerClusterer(map, Map.markers, 
                                                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        });
    }
};
// Fonction s'effectuant au chargement de la page
window.onload = function(){
    Savnac.init();
    // Appel de la méthode d'initialisation qui s'exécute lorsque le DOM est chargé
    Map.initMap();
    if (sessionStorage.getItem('distance') !== null) {
        document.getElementById("text_timer").innerHTML = "Vous avez réservé un Vélo'v à la station : " + sessionStorage.getItem('nom') + " - ";
        document.getElementById("sessionstorage").style.display = 'inline-block';
        document.getElementById("base_text").style.display = 'none';
        document.getElementById("btnReserverVelo").style.display = 'none';
        document.getElementById("sketchpadapp").style.display = 'none';
        Timer.timer();
    }
};

    
           