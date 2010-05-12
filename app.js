var jQT = $.jQTouch();

$(document).ready(function() {
    if (localStorage.getItem('twitterUsername')) {
        // wenn ein Username gespeichert ist, das Preferences-Feld damit vorbelegen und Tweets abrufen
        $('#username').val(localStorage.getItem('twitterUsername'));
        updateTweets();
    } else {
        // falls noch kein Username gespeichert ist, zum Preferences-Panel wechseln
        jQT.goTo('#preferences', 'flip');
    }
    
    // bei Klick auf den Button zum Preferences-Panel wechseln
    $('#button-preferences').click(function(e) {
        jQT.goTo('#preferences', 'flip');
    });
    
    // beim Verlassen des Preferences-Panel überprüfen, ob sich der Benutzername geändert hat, und
    // ggf. den neuen Wert speichern und Tweets abrufen
    $('#preferences').bind('pageAnimationStart', function(event, info) {
        if (info.direction == 'out' && $('#username').val() != localStorage.getItem('twitterUsername')) {
            localStorage.setItem('twitterUsername', $('#username').val());
            updateTweets();
        }
    });
});

// Funktion zum Abrufen der Tweets von twitter
function updateTweets() {
    // Titel auf Usernamen ändern
    $('#home .toolbar h1').text('@' + localStorage.getItem('twitterUsername'));
    
    // alle <li>-Kindelemente der <ul>-Liste löschen
    $('#tweets li').remove();
    
    // einen Platzhalter einfügen, der während der Ladezeit angezeigt wird.
    $('#tweets').append('<li>Tweets werden geladen …</li>');
    
    // die Tweets von twitter abrufen, dabei den Wert aus dem localStorage verwenden
    // (vgl. http://developer.twitter.com/doc/get/statuses/user_timeline)
    $.getJSON('http://api.twitter.com/1/statuses/user_timeline/' + localStorage.getItem('twitterUsername') + '.json?callback=?', function(data) {
        
        // Sobald die Daten von twitter abgerufen wurden, wird der Platzhalter gelöscht und das 
        // Resultat Tweet für Tweet durchgegangen.
        $('#tweets li').remove();
        $.each(data, function() {
        
            // Für jeden tweet wird an unser ul mit der ID "tweets" ein <li>-Element mit dem Text 
            // und Erstellungszeitpunkt angehängt.
            $('#tweets').append('<li>' + this.text + '<div class="datetime">' + this.created_at + '</div></li>');
        });
    });
}