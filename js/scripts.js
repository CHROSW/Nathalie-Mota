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
                   
                    filterphotosids = filterphotosids  + "," + element.id;

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



function showLightbox(url){
    $('.lightbox').show();
    $('.lightbox-loader').html('');
    let listPhoto = $('button[data-photosid]').data('photosid');
    let matched_next=0;
    let matched_first=0;
    let loop_link = "";
    let matched_url = 0;
    let first_link = "";
    let i=0;
    let first_next =0;
    
    $.ajax({
        type: 'GET',
        url: objphotos.restURL + 'wp/v2/photo?include=' +  listPhoto + '&orderby=include&per_page=12',
        beforeSend: function(xhr){
            xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
        },
        data: {},
        success: function (response) {
            if(response){

                response.forEach(function (element){
                    $.ajax({
                        type: 'GET',
                        url: objphotos.restURL + 'wp/v2/media/' + element.featured_media,
                        beforeSend: function(xhr){
                            xhr.setRequestHeader('X-WP-NOUNCE', objphotos.restNounce);
                        },
                        data: {},

                        success: function( mediaresponse){
                            
                            

                            if(matched_first == '0'){
                                matched_first = 1;
                                first_link = mediaresponse.media_details.sizes.full.source_url;
                                console.log(first_link);
                            }

                            if(matched_url == '1' && matched_next == '0'){
                                matched_next = 1;  
                                loop_link = mediaresponse.media_details.sizes.full.source_url; 
                                $('.nav-prev').attr("href", loop_link);
                            }
                            if(url === mediaresponse.media_details.sizes.full.source_url){
                                if(loop_link !== ""){
                                    $('.nav-next').attr("href", loop_link);
                                  
                                }
                                
                               
                                if($('button').hasClass('button-show-all')){
                                    let categorieSingle=$('.single-photo-text p').eq(1).text();
                                    let showCat= categorieSingle.substring(categorieSingle.indexOf(':')+1, categorieSingle.length);
                                    $('.lightbox-loader').prepend('<figure><img src="' + mediaresponse.media_details.sizes.full.source_url + 
                                '" alt="' + element.title.rendered + '"><figcaption><h2 class="title-lightbox">' + element.title.rendered + 
                                '</h2><h3 class="categorie-lightbox">' + showCat + '</h3></figcaption></figure>');
                                }else{
                                    
                                    $('.lightbox-loader').prepend('<figure><img src="' + mediaresponse.media_details.sizes.full.source_url + 
                                    '" alt="' + element.title.rendered + '"><figcaption><h2 class="title-lightbox">' + element.title.rendered + 
                                    '</h2><h3 class="categorie-lightbox">' + $('.categories option[value="' + element.categorie + '"]').text() + '</h3></figcaption></figure>');
                                }
                                
                                matched_url = 1;


                                
                            }
                            
                            
                                
                            i++;
                            if(i== '1' && url == mediaresponse.media_details.sizes.full.source_url){
                                first_next = 1;
                                $('.nav-prev').attr("href", loop_link);
                            }
                            if(i== '12' && url == mediaresponse.media_details.sizes.full.source_url){
                                $('.nav-prev').attr("href", first_link);
                                $('.nav-next').attr("href", loop_link);
                            }

                            loop_link = mediaresponse.media_details.sizes.full.source_url;
                            

                            
                            
                            if(i == '12' && first_next==1){
                                $('.nav-next').attr("href", loop_link); 
                            }   

                        },
                    });
                    
                });
                
            } 
            
        },
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
                        photosids= photosids  + "," + element.id;
                        
                       
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



$("body").on("click", 'a.fullscreen[href$=".jpeg"], a.fullscreen[href$=".jpeg"]', function(e){
    e.preventDefault();
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