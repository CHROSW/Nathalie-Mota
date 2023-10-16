jQuery(document).ready(function($){

    function showLightbox(url){
    
    $('.lightbox-loader').html('');
        let listPhoto = $('button[data-photosid]').data('photosid');
        listPhoto = listPhoto.toString(); 
        let nbPhoto= listPhoto.split(',').length;
        let linkPhotoElem = $("a.fullscreen");
        let titlePhotoElem = $("p.hover-title");
        let categoriePhotoElem = $("p.hover-categorie");
        let j=0;
        console.log(titlePhotoElem);
        $.each(linkPhotoElem, function (key, value) {
            
            if(url == value.href){
                if(j-1 >= '0'){
                    $('.nav-prev').attr("href", linkPhotoElem[j - 1].href);
                }else{
                    $('.nav-prev').attr("href", linkPhotoElem[nbPhoto - 1].href);
                }
                if(j +1 <= nbPhoto-1){
                    $('.nav-next').attr("href", linkPhotoElem[j + 1].href);
                }else{
                    $('.nav-next').attr("href", linkPhotoElem['0'].href);
                }
                $('.lightbox-loader').prepend('<figure><img src="' + value.href + 
                '" alt="' + titlePhotoElem[key].innerHTML + '"><figcaption><h2 class="title-lightbox">' + titlePhotoElem[key].innerHTML + 
                '</h2><h3 class="categorie-lightbox">' + categoriePhotoElem[key].innerHTML + '</h3></figcaption></figure>');   
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