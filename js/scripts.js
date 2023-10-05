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
    $(this).hide();
    $.ajax({
        type: 'GET',
        url: objphotos.restURL + 'wp/v2/photo?per_page=100&exclude=' +  $(this).data('postid') + ',' + $(this).data('navid') + ',' + $(this).data('photosid') + '&categorie=' + $(this).data('categorie'),
        beforeSend: function(xhr){
            xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
        },
        data: {},
        success: function (response) {
            if(response){
                let i=0;  
                response.forEach(function (element){
                

                    $.ajax({
                        type: 'GET',
                        url: objphotos.restURL + 'wp/v2/media/' + element.featured_media,
                        beforeSend: function(xhr){
                            xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
                        },
                        data: {},

                        success: function( mediaresponse){  
                          
                            if(i%2 == 0){
                                $('.diaporama ul').append('<li class="photo-left"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + mediaresponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaresponse.id + '" ></li>');
                            }else{
                                $('.diaporama ul').append('<li class="photo-right"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + mediaresponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaresponse.id + '" ></li>');
                            }
                            i++;
                        },
                    });




                
                    
                });
    
                
                
            }
        },
        error: function(error){
            $('.diaporama').html('');
            $('.diaporama').append('<h3 class="diaporama-title">Vous aimeriez aussi</h3><ul><li style="list-style:none;margin:auto;margin-bottom:40px;">Sorry, no posts matched.</li></ul>');
            console.log(error);
        }

    });
    
    




 
    
});

});