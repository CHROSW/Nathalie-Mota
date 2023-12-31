jQuery(document).ready(function($){

    /**
     * @param {string} url link image to show required
     * 
     * @return html display
     * 
     * function to show image on lightbox with title and custom term categorie on custom post photo
     * **/
    function showLightbox(url){
    
    $('.lightbox-loader').html(''); 
        let linkPhoto = $("a.fullscreen");
        let titlePhoto = $("p.hover-title");
        let categoriePhoto = $("p.hover-categorie");
        let j=0;
        $.each(linkPhoto, function (key, value) {
            
            if(url == value.href){
                if(j-1 >= '0'){
                    $('.nav-prev').show();
                    $('.nav-prev').attr("href", linkPhoto[j - 1].href);
                }else{
                    $('.nav-prev').hide();
                }
                if(j +1 < linkPhoto.length){
                    $('.nav-next').show();
                    $('.nav-next').attr("href", linkPhoto[j + 1].href);
                }else{
                    $('.nav-next').hide();
                }
                $('.lightbox-loader').prepend('<figure><img src="' + value.href + 
                '" alt="' + titlePhoto[key].innerHTML + '"><figcaption><h2 class="title-lightbox">' + titlePhoto[key].innerHTML + 
                '</h2><h3 class="categorie-lightbox">' + categoriePhoto[key].innerHTML + '</h3></figcaption></figure>');   
            }
            j++
        });
    
    

    }
/* to show lightbox on hover image*/
$("body").on("click", 'a.fullscreen[href$=".jpeg"], a.fullscreen[href$=".jpeg"]', function(e){
    e.preventDefault();
    $('.lightbox').show();
    showLightbox($(this).attr('href'));
});

/* to previous photo on lightbox navigation */
$('.lightbox .nav-prev').click( function(e){
    e.preventDefault();
    showLightbox($(this).attr('href'));
});

/* to next photo on lightbox navigation */
$('.lightbox .nav-next').click( function(e){
    e.preventDefault();    
    showLightbox($(this).attr('href'));
});
/* to close lightbox */
$('.lightbox-close').click( function(e){
    $('.lightbox').hide();
});

});