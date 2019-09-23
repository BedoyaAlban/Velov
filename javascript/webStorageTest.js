function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}
if (storageAvailable('sessionStorage')) {
    console.log("Nous pouvons utiliser sessionStorage")
}
else {
    console.log("Malheureusement, sessionStorage n'est pas disponible")
}