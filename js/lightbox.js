jQuery(document).ready(function($){

    /**
     * @param url link image to show required
     * 
     * @return html display
     * 
     * function to show image on lightbox with title and custom term categorie on custom post photo
     * **/
    function showLightbox(url){
    
    $('.lightbox-loader').html('');
        let listPhoto = $('button[data-photosId]').data('photosId');
        listPhoto = listPhoto.toString(); 
        let nbPhoto= listPhoto.split(',').length;
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
                if(j +1 < nbPhoto){
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

$("body").on("click", 'a.fullscreen[href$=".jpeg"], a.fullscreen[href$=".jpeg"]', function(e){
    e.preventDefault();
    $('.lightbox').show();
    showLightbox($(this).attr('href'));
});

$('.nav-prev').click( function(e){
    e.preventDefault();
    showLightbox($(this).attr('href'));
});

$('.nav-next').click( function(e){
    e.preventDefault();  
    showLightbox($(this).attr('href'));
});

$('.lightbox-close').click( function(e){
    $('.lightbox').hide();
});

});