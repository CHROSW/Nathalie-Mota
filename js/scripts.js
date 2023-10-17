jQuery(document).ready(function($){
// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
$('#myBtn').click( function() {
    modal.style.display = "block";
});

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




function filterPhoto(categorie, format, order){
    if((parseInt(categorie) %1 === 0) && (parseInt(format) %1 === 0) && (order == 'asc' || order == 'desc')){
        paramUrl='&categorie=' + categorie + '&format=' + format + '&orderby=date&order=' + order;
    }else if((parseInt(categorie) %1 === 0) && (parseInt(format) %1 === 0) && (order != 'asc' && order != 'desc')){
        paramUrl='&categorie=' + categorie + '&format=' + format;
    }else if((parseInt(categorie) %1 === 0) && (parseInt(format) %1 !== 0) && (order == 'asc' || order == 'desc')){
        paramUrl='&categorie=' + categorie + '&orderby=date&order=' + order;
    }else if((parseInt(categorie) %1 !== 0) && (parseInt(format) %1 === 0) && (order == 'asc' || order == 'desc')){
        paramUrl='&format=' + format + '&orderby=date&order=' + order;
    }else if((parseInt(categorie) %1 === 0) && (parseInt(format) %1 !== 0) && (order != 'asc' && order != 'desc')){
        paramUrl = '&categorie=' + categorie;
    }else if((parseInt(format) %1 === 0) && (parseInt(categorie) %1 !== 0) && (order != 'asc' && order != 'desc')){
        paramUrl = '&format=' + format;
    }else if((order == 'asc' || order == 'desc') && (parseInt(categorie) %1 !== 0) && (parseInt(format) %1 !== 0)){
        paramUrl = '&orderby=date&order=' + order;
    }else{
        console.log("Aucune sélection");
        paramUrl="";
    }
    let buttonshow = document.querySelector('.button-show-more');
    buttonshow.dataset.photosid = ''; 
    let filterphotosids='';

    $.ajax({

        
        type: 'GET',
        url: objphotos.restURL + 'wp/v2/photo?per_page=12&exclude=' +  $('.button-show-more').data('postid') + paramUrl,
        beforeSend: function(xhr){
            xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
        },
        data: {},
        success: function (response) {
            $('.diaporama ul').html('');
            
            
            if(response){
                let i=0;  
                response.forEach(function (element){
                   
                    filterphotosids =    filterphotosids + "," + element.id;

                    $.ajax({
                        type: 'GET',
                        url: objphotos.restURL + 'wp/v2/media/' + element.featured_media,
                        beforeSend: function(xhr){
                            xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
                        },
                        data: {},

                        success: function( mediaresponse){   

                            if(i%2 == 0){
                                $('.diaporama ul').append('<li class="photo-left"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                mediaresponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaresponse.id + 
                                '" ><a href="' + mediaresponse.media_details.sizes.full.source_url + 
                                '" class="fullscreen"><img src="' + objphotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + 
                                element.link + '"><img src="' + objphotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + element.title.rendered + '</p><p class="hover-categorie">' + $('.categories option[value="' + element.categorie + '"]').text() + '</p></li>');
                            }else{
                                $('.diaporama ul').append('<li class="photo-right"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                mediaresponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaresponse.id + 
                                '" ><a href="' + mediaresponse.media_details.sizes.full.source_url +  
                                '" class="fullscreen"><img src="' + objphotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + element.link + 
                                '"><img src="' + objphotos.restURL + '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + element.title.rendered + 
                                '</p><p class="hover-categorie">' + $('.categories option[value="' + element.categorie + '"]').text() + '</p></li>');
                            }
                            i++;
                        },
                    });

                    let button = document.querySelector('.button-show-more');
                    button.dataset.photosid = filterphotosids.substring(1,filterphotosids.length);
                    
                });
    
                
                
            }
        },
        error: function(error){
            $('.diaporama').html('');
            $('.diaporama').append('<ul><li style="list-style:none;margin:auto;margin-bottom:40px;">Sorry, no posts matched.</li></ul>');
            console.log(error);
        }

    });
}







$('.button-show-all').click(function (e) {
    $(this).hide();
    let categorie=$('.single-photo-text p').eq(1).text();
    let cat_name= categorie.substring(categorie.indexOf(':')+1, categorie.length);
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
                    filterphotosids =  element.id + "," + filterphotosids ;

                    $.ajax({
                        type: 'GET',
                        url: objphotos.restURL + 'wp/v2/media/' + element.featured_media,
                        beforeSend: function(xhr){
                            xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
                        },
                        data: {},

                        success: function( mediaresponse){  
                            
                            if(i%2 == 0){
                                $('.diaporama ul').append('<li class="photo-left"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                mediaresponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaresponse.id + '" ><a href="' + 
                                mediaresponse.media_details.sizes.full.source_url +  '" class="fullscreen"><img src="' + objphotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + 
                                element.link + '"><img src="' + objphotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + 
                                element.title.rendered + '</p><p class="hover-categorie">' + cat_name + '</p></li>');
                            }else{
                                $('.diaporama ul').append('<li class="photo-right"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                mediaresponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaresponse.id + '" ><a href="' + 
                                mediaresponse.media_details.sizes.full.source_url +  '" class="fullscreen"><img src="' + objphotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + element.link + 
                                '"><img src="' + objphotos.restURL + '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + 
                                element.title.rendered + '</p><p class="hover-categorie">' + cat_name + '</p></li>');
                            }
                            i++;
                        },
                    });


                    let button = document.querySelector('.button-show-all');
                    button.dataset.photosid = filterphotosids.substring(1,filterphotosids.length);

                
                    
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


$('.button-show-more').click(function (e) {

    categorie=$('.categories option:selected').val();
    format=$('.formats option:selected').val();
    order=$('.filter option:selected').val();

    if((parseInt(categorie) %1 === 0) && (parseInt(format) %1 === 0) && (order == 'asc' || order == 'desc')){
        paramUrl='&categorie=' + categorie + '&format=' + format + '&orderby=date&order=' + order;
    }else if((parseInt(categorie) %1 === 0) && (parseInt(format) %1 === 0) && (order != 'asc' && order != 'desc')){
        paramUrl='&categorie=' + categorie + '&format=' + format;
    }else if((parseInt(categorie) %1 === 0) && (parseInt(format) %1 !== 0) && (order == 'asc' || order == 'desc')){
        paramUrl='&categorie=' + categorie + '&orderby=date&order=' + order;
    }else if((parseInt(categorie) %1 !== 0) && (parseInt(format) %1 === 0) && (order == 'asc' || order == 'desc')){
        paramUrl='&format=' + format + '&orderby=date&order=' + order;
    }else if((parseInt(categorie) %1 === 0) && (parseInt(format) %1 !== 0) && (order != 'asc' && order != 'desc')){
        paramUrl = '&categorie=' + categorie;
    }else if((parseInt(format) %1 === 0) && (parseInt(categorie) %1 !== 0) && (order != 'asc' && order != 'desc')){
        paramUrl = '&format=' + format;
    }else if((order == 'asc' || order == 'desc') && (parseInt(categorie) %1 !== 0) && (parseInt(format) %1 !== 0)){
        paramUrl = '&orderby=date&order=' + order;
    }else{
        console.log("Aucune sélection");
        paramUrl="";
    }

    let buttonshow = document.querySelector('.button-show-more');
    let photosids= buttonshow.dataset.photosid;
    
    if((photosids.split(",").length %12) != 0){
        alert("Il n'y a pas plus de photos.");
    }else{
        $.ajax({
            type: 'GET',
            url: objphotos.restURL + 'wp/v2/photo?per_page=12&exclude=' +  $(this).data('postid') + ',' + photosids + paramUrl,
            beforeSend: function(xhr){
                xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
            },
            data: {},
            success: function (response) {
               
              
                if(response){
                    let i=0;  
                    response.forEach(function (element){
                        photosids=  element.id + "," + photosids;
                        
                       
                        $.ajax({
                            type: 'GET',
                            url: objphotos.restURL + 'wp/v2/media/' + element.featured_media,
                            beforeSend: function(xhr){
                                xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
                            },
                            data: {},
    
                            success: function( mediaresponse){  
                              
                                if(i%2 == 0){
                                    $('.diaporama ul').append('<li class="photo-left"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                    mediaresponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaresponse.id + '" ><a href="' + 
                                    mediaresponse.media_details.sizes.full.source_url +  '" class="fullscreen"><img src="' + objphotos.restURL + 
                                    '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + 
                                    element.link + '"><img src="' + objphotos.restURL + 
                                    '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + 
                                    element.title.rendered + '</p><p class="hover-categorie">' + $('.categories option[value="' + element.categorie + '"]').text() + '</p></li>');
                                }else{
                                    $('.diaporama ul').append('<li class="photo-right"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                    mediaresponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaresponse.id + '" ><a href="' + 
                                    mediaresponse.media_details.sizes.full.source_url +  '" class="fullscreen"><img src="' + objphotos.restURL + 
                                    '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + 
                                    element.link + '"><img src="' + objphotos.restURL + 
                                    '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + 
                                    element.title.rendered + '</p><p class="hover-categorie">' + $('.categories option[value="' + element.categorie + '"]').text() + '</p></li>');
                                }
                                i++;
                                
                            },
                           
                        });
    
                        let button = document.querySelector('.button-show-more'); 
                        button.dataset.photosid = photosids;
                        
                    });
                    
                    
                    
                }
            },
        });
    }

    

});




$('.categories').change(function(){
    filterPhoto($('.categories option:selected').val(), $('.formats option:selected').val(), $('.filter option:selected').val()); 
});

$('.formats').change(function(){
    filterPhoto($('.categories option:selected').val(), $('.formats option:selected').val(), $('.filter option:selected').val());
});

$('.filter').change(function(){
    filterPhoto($('.categories option:selected').val(), $('.formats option:selected').val(), $('.filter option:selected').val());
});



});