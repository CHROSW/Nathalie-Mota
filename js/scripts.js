jQuery(document).ready(function($){
// Get the modal
var modal = document.getElementById('contactModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
$('#contactModalBtn').click( function() {
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
                    if(filterphotosids.substring(0,1) === ','){
                        filterphotosids=filterphotosids.substring(1, filterphotosids.length);
                    }
                    if(filterphotosids.substring(filterphotosids.length-1, filterphotosids.length) === ','){
                        filterphotosids=filterphotosids.substring(0, filterphotosids.length-1);
                    }
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
                    if(filterphotosids.substring(0,1) === ','){
                        filterphotosids=filterphotosids.substring(1, filterphotosids.length);
                    }
                    if(filterphotosids.substring(filterphotosids.length-1, filterphotosids.length) === ','){
                        filterphotosids=filterphotosids.substring(0, filterphotosids.length-1);
                    }
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


$('body').on('click', '.button-show-more', function (e) {
    let categorie="";
    let format="";
    let order="";
    if($('.categories ul li').hasClass('selected')){
        let categorie_html_id=$('.categories ul li.selected').attr('id');
        categorie = parseInt(categorie_html_id.substring(4, categorie_html_id.length));
    }
    if($('.formats ul li').hasClass('selected')){
        let format_html_id=$('.formats ul li.selected').attr('id');
        format = parseInt(format_html_id.substring(7, format_html_id.length));
    }
    if($('.filter ul li').hasClass('selected')){
    let filter_html_id=$('.filter ul li.selected').attr('id');
    order = parseInt(filter_html_id.substring(4, filter_html_id.length));
    }

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
                        if(photosids.substring(0,1) === ','){
                            photosids=photosids.substring(1, photosids.length);
                        }
                        if(photosids.substring(photosids.length-1, photosids.length) === ','){
                            photosids=photosids.substring(0, photosids.length-1);
                        }
                        button.dataset.photosid = photosids;
                        
                    });
                    
                    
                    
                }
            },
        });
    }

    

});

let j=0;
$('.categories').click(function(){
    $('.categories ul').toggle();
    if(j++ %2 === 0){
    $('.categories').css('border-bottom-left-radius', '0');
    $('.categories').css('border-bottom-right-radius', '0');
    $('.categories').css('border-color', '#215AFF');
    $('.categories .arrow-down').addClass('arrow-up');
    $('.categories .arrow-up').removeClass('arrow-down');
    }else{
        $('.categories').css('border-bottom-left-radius', '8px');
        $('.categories').css('border-bottom-right-radius', '8px');
        $('.categories').css('border-color', '#B8BBC2');
        $('.categories .arrow-up').addClass('arrow-down');
        $('.categories .arrow-down').removeClass('arrow-up');
    }
});
let k=0;
$('.formats').click(function(){
    $('.formats ul').toggle();
    if(k++ %2 === 0){
    $('.formats').css('border-bottom-left-radius', '0');
    $('.formats').css('border-bottom-right-radius', '0');
    $('.formats').css('border-color', '#215AFF');
    $('.formats .arrow-down').addClass('arrow-up');
    $('.formats .arrow-up').removeClass('arrow-down');
    }else{
        $('.formats').css('border-bottom-left-radius', '8px');
        $('.formats').css('border-bottom-right-radius', '8px');
        $('.formats').css('border-color', '#B8BBC2');
        $('.formats .arrow-up').addClass('arrow-down');
        $('.formats .arrow-down').removeClass('arrow-up');
    }
});
let l=0;
$('.filter').click(function(){
    $('.filter ul').toggle();
    if(l++ %2 === 0){
    $('.filter').css('border-bottom-left-radius', '0');
    $('.filter').css('border-bottom-right-radius', '0');
    $('.filter').css('border-color', '#215AFF');
    $('.filter .arrow-down').addClass('arrow-up');
    $('.filter .arrow-up').removeClass('arrow-down');
    }else{
        $('.filter').css('border-bottom-left-radius', '8px');
        $('.filter').css('border-bottom-right-radius', '8px');
        $('.filter').css('border-color', '#B8BBC2');
        $('.filter .arrow-up').addClass('arrow-down');
        $('.filter .arrow-down').removeClass('arrow-up');
    }
});


$('body').on('click', '.categories ul li', function(){
    $('.categories ul li.selected').removeClass('selected');
    $(this).addClass('selected');
    $('.categories ul').hide();
    let categorie_id ="";
    let format_id="";
    let filter_id="";
    if($('.categories ul li').hasClass('selected')){
        let categorie_html_id=$('.categories ul li.selected').attr('id');
        categorie_id = parseInt(categorie_html_id.substring(4, categorie_html_id.length));
    }
    if($('.formats ul li').hasClass('selected')){
        let format_html_id=$('.formats ul li.selected').attr('id');
        format_id = parseInt(format_html_id.substring(7, format_html_id.length));
    }
    if($('.filter ul li').hasClass('selected')){
    let filter_html_id=$('.filter ul li.selected').attr('id');
    filter_id = parseInt(filter_html_id.substring(4, filter_html_id.length));
    }
    if($('.categories ul li').hasClass('selected') || $('.formats ul li').hasClass('selected') || $('.filter ul li').hasClass('selected')){
        filterPhoto(categorie_id, format_id, filter_id); 
    }
});

$('body').on('click', '.formats ul li', function(){
    $('.formats ul li.selected').removeClass('selected');
    $(this).addClass('selected');
    $('.formats ul').hide();
    let categorie_id ="";
    let format_id="";
    let filter_id="";
    if($('.categories ul li').hasClass('selected')){
        let categorie_html_id=$('.categories ul li.selected').attr('id');
        categorie_id = parseInt(categorie_html_id.substring(4, categorie_html_id.length));
    }
    if($('.formats ul li').hasClass('selected')){
        let format_html_id=$('.formats ul li.selected').attr('id');
        format_id = parseInt(format_html_id.substring(7, format_html_id.length));
    }
    if($('.filter ul li').hasClass('selected')){
        let filter_html_id=$('.filter ul li.selected').attr('id');
        filter_id = parseInt(filter_html_id.substring(4, filter_html_id.length));
    }
    if($('.categories ul li').hasClass('selected') || $('.formats ul li').hasClass('selected') || $('.filter ul li').hasClass('selected')){
        filterPhoto(categorie_id, format_id, filter_id); 
    }
});

$('body').on('click', '.filter ul li', function(){
    $('.filter ul li.selected').removeClass('selected');
    $(this).addClass('selected');
    $('.filter ul').hide();
    let categorie_id ="";
    let format_id="";
    let filter_id="";
    if($('.categories ul li').hasClass('selected')){
        let categorie_html_id=$('.categories ul li.selected').attr('id');
        categorie_id = categorie_html_id.substring(4, categorie_html_id.length);
    }
    if($('.formats ul li').hasClass('selected')){
        let format_html_id=$('.formats ul li.selected').attr('id');
        format_id = format_html_id.substring(7, format_html_id.length);
    }
    if($('.filter ul li').hasClass('selected')){
    let filter_html_id=$('.filter ul li.selected').attr('id');
        filter_id = filter_html_id.substring(4, filter_html_id.length);
    }
    if($('.categories ul li').hasClass('selected') || $('.formats ul li').hasClass('selected') || $('.filter ul li').hasClass('selected')){
        filterPhoto(categorie_id, format_id, filter_id); 
    }
    
});

let i =0;
let c2 = $('.header nav div').html();
$('.burger-content').append('<div>' + c2 + '</div>').hide();

$('.burger').click(function(){
    
    $('.burger .line').toggle();
    $('.burger .burger-close').toggle();
    $('.burger-content').toggle( i++ %2 === 0);  
});



});