jQuery(document).ready(function($){
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let refPhoto = $('.single-photo-text').children('p').first().text();
let refDisplay = refPhoto.substring(refPhoto.indexOf(':')+1, refPhoto.length);
$('.wpcf7-form-control-wrap input').eq(2).val(refDisplay);


$('.button-show-all').click(function (e) {
    const ajaxurl = $(this).data('ajaxurl');

    const data = {
        action: $(this).data('action'), 
        nonce:  $(this).data('nonce'),
        postid: $(this).data('postid'),
        navid: $(this).data('navid'),
        categorie: $(this).data('categorie'),
    }


    fetch(ajaxurl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
        },
        body: new URLSearchParams(data),
    })
    .then(response => response.json())
    .then(response => {
        // En cas d'erreur
        if(!response.success) {
            alert(response.data);
            return;
        }

        $(this).hide();
        $('.diaporama').html('');
        $('.diaporama').append('<h3 class="diaporama-title">Vous aimeriez aussi</h3><ul>' + response.data + '</ul>');
    });
});

});