jQuery(document).ready(function($){
// Get the modal
var modal = document.getElementById('contactModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//link with contact identified by tag li id on wordpress menu  
$('#menu-item-64 a').addClass('contactModalBtn');

// When the user clicks on the button, open the modal
$('.contactModalBtn').click( function(e) {
    e.preventDefault();
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
/* substring contain only reference and not side text */
let refDisplay = refPhoto.substring(refPhoto.indexOf(':')+1, refPhoto.length);
$('.wpcf7-form-control-wrap input').eq(2).val(refDisplay);


/* add nav menu at burger menu on load page and hide this*/
let i =0;
let c2 = $('.header nav div').html();
$('.burger-content').append('<div>' + c2 + '</div>').hide();

$('.burger').click(function(){
    
    $('.burger .line').toggle();
    $('.burger .burger-close').toggle();
    $('.burger-content').toggle( i++ %2 === 0);  
});


/** 
 * @param {int} categorie custom term content name categorie for custom post photo on list select optional
 * @param {int} format custom term content name format for custom post photo on list select optional
 * @param {string} order photo order on list select asc or desc optional 
 * 
 * @return html display
 * 
 * function to filter custom post photo data and display on grid image list with default param based on rest API
 * **/
function filterPhoto(categorie, format, order){
    /* check param value and determine param used */
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
    let buttonShow = document.querySelector('.button-show-more');
    buttonShow.dataset.photosid = ''; 
    let filterPhotosIds='';

    $.ajax({

        
        type: 'GET',
        url: objPhotos.restURL + 'wp/v2/photo?per_page=12&exclude=' +  $('.button-show-more').data('postid') + paramUrl,
        beforeSend: function(xhr){
            xhr.setRequestHeader('X-WP-NOUNCE', objPhotos.restNounce);
        },
        data: {},
        success: function (response) {
            $('.diaporama ul').html('');
            
            
            if(response){
                let i=0;  
                response.forEach(function (element){
                   /* string contain list id separate by , */
                    filterPhotosIds =    filterPhotosIds + "," + element.id;

                    $.ajax({
                        type: 'GET',
                        url: objPhotos.restURL + 'wp/v2/media/' + element.featured_media,
                        beforeSend: function(xhr){
                            xhr.setRequestHeader('X-WP-NOUNCE', objPhotos.restNounce);
                        },
                        data: {},

                        success: function( mediaResponse){   

                            if(i%2 == 0){
                                $('.diaporama ul').append('<li class="photo-left"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                mediaResponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaResponse.id + 
                                '" ><a href="' + mediaResponse.media_details.sizes.full.source_url + 
                                '" class="fullscreen"><img src="' + objPhotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + 
                                element.link + '"><img src="' + objPhotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + element.title.rendered +
                                '</p><p class="hover-categorie">' + $('.categories option[value="' + element.categorie + '"]').text() + '</p></li>');
                            }else{
                                $('.diaporama ul').append('<li class="photo-right"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                mediaResponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaResponse.id + 
                                '" ><a href="' + mediaResponse.media_details.sizes.full.source_url +  
                                '" class="fullscreen"><img src="' + objPhotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + element.link + 
                                '"><img src="' + objPhotos.restURL + '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + element.title.rendered + 
                                '</p><p class="hover-categorie">' + $('.categories option[value="' + element.categorie + '"]').text() + '</p></li>');
                            }
                            i++;
                        },
                    });

                    let button = document.querySelector('.button-show-more');
                    /* remove , at begin and at end of string */
                    if(filterPhotosIds.substring(0,1) === ','){
                        filterPhotosIds=filterPhotosIds.substring(1, filterPhotosIds.length);
                    }
                    if(filterPhotosIds.substring(filterPhotosIds.length-1, filterPhotosIds.length) === ','){
                        filterPhotosIds=filterPhotosIds.substring(0, filterPhotosIds.length-1);
                    }
                    button.dataset.photosid = filterPhotosIds.substring(1,filterPhotosIds.length);
                    
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


/**
 * 
 * @param {int} postId page post id already display to exclude required
 * @param {int} navId post navigation id already display to exclude required
 * @param {int} categorieId custom term categorie id to display required
 * @param {string} categorieName custom term in categorie to display required
 * @param {string} photosId photos id already display on page to exclude optional
 * @param {string} firstPhotosIds button dataset list photos id already display optional
 * 
 * @return html display
 * 
 * function to display all photos into same custom term categorie
 */
function showAllPhotos(postId, navId, categorieId, categorieName, photosId, firstPhotosIds){
    $.ajax({
        type: 'GET',
        url: objPhotos.restURL + 'wp/v2/photo?per_page=100&exclude=' +  postId + ',' + navId + ',' + photosId + '&categorie=' + categorieId,
        beforeSend: function(xhr){
            xhr.setRequestHeader('X-WP-NOUNCE', objPhotos.restNounce);
        },
        data: {},
        success: function (response) {
            if(response){
                let i=0;  
                response.forEach(function (element){
                    /* string contain list id separate by , */
                    firstPhotosIds =  element.id + "," + firstPhotosIds ;

                    $.ajax({
                        type: 'GET',
                        url: objPhotos.restURL + 'wp/v2/media/' + element.featured_media,
                        beforeSend: function(xhr){
                            xhr.setRequestHeader('X-WP-NOUNCE', objPhotos.restNounce);
                        },
                        data: {},

                        success: function( mediaResponse){  
                            
                            if(i%2 == 0){
                                $('.diaporama ul').append('<li class="photo-left"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                mediaResponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaResponse.id + '" ><a href="' + 
                                mediaResponse.media_details.sizes.full.source_url +  '" class="fullscreen"><img src="' + objPhotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + 
                                element.link + '"><img src="' + objPhotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + 
                                element.title.rendered + '</p><p class="hover-categorie">' + categorieName + '</p></li>');
                            }else{
                                $('.diaporama ul').append('<li class="photo-right"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                mediaResponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaResponse.id + '" ><a href="' + 
                                mediaResponse.media_details.sizes.full.source_url +  '" class="fullscreen"><img src="' + objPhotos.restURL + 
                                '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + element.link + 
                                '"><img src="' + objPhotos.restURL + '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + 
                                element.title.rendered + '</p><p class="hover-categorie">' + categorieName + '</p></li>');
                            }
                            i++;
                        },
                    });


                    let button = document.querySelector('.button-show-all');
                    /* remove , at begin and at end of string */
                    if(firstPhotosIds.substring(0,1) == ','){
                        firstPhotosIds=firstPhotosIds.substring(1, firstPhotosIds.length);
                    }
                    if(firstPhotosIds.substring(firstPhotosIds.length-1, firstPhotosIds.length) == ','){
                        firstPhotosIds=firstPhotosIds.substring(0, firstPhotosIds.length-1);
                    }
                    button.dataset.photosid = firstPhotosIds;

                
                    
                });     
                
            }
        },
        error: function(error){
            $('.diaporama').html('');
            $('.diaporama').append('<h3 class="diaporama-title">Vous aimeriez aussi</h3><ul><li style="list-style:none;margin:auto;margin-bottom:40px;">Sorry, no posts matched.</li></ul>');
            console.log(error);
        }

    });
}


/**
 * 
 * @param {int} postId page post id to exclude required
 * @param {int} categorie custom term id into custom term categorie optional
 * @param {int} format custom term id into custom term format optional
 * @param {string} order order to display asc or desc optional
 * 
 * @return html display
 * 
 * function to display 12 new photos at click on button
 */
function infinitePage(postId, categorie, format, order){
    /* check param value and determine param used */
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
    let photosIds= buttonshow.dataset.photosid;

    if((photosIds.split(",").length %12) != 0){
        alert("Il n'y a pas plus de photos.");
    }else{
        $.ajax({
            type: 'GET',
            url: objPhotos.restURL + 'wp/v2/photo?per_page=12&exclude=' +  postId + ',' + photosIds + paramUrl,
            beforeSend: function(xhr){
                xhr.setRequestHeader('X-WP-NOUNCE', objPhotos.restNounce);
            },
            data: {},
            success: function (response) {
               
              
                if(response){
                    let i=0;  
                    response.forEach(function (element){
                        /* string contain list id separate by , */
                        photosIds=  element.id + "," + photosIds;
                        
                       
                        $.ajax({
                            type: 'GET',
                            url: objPhotos.restURL + 'wp/v2/media/' + element.featured_media,
                            beforeSend: function(xhr){
                                xhr.setRequestHeader('X-WP-NOUNCE', objPhotos.restNounce);
                            },
                            data: {},
    
                            success: function( mediaResponse){  
                              
                                if(i%2 == 0){
                                    $('.diaporama ul').append('<li class="photo-left"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                    mediaResponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaResponse.id + '" ><a href="' + 
                                    mediaResponse.media_details.sizes.full.source_url +  '" class="fullscreen"><img src="' + objPhotos.restURL + 
                                    '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + 
                                    element.link + '"><img src="' + objPhotos.restURL + 
                                    '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + 
                                    element.title.rendered + '</p><p class="hover-categorie">' + $('.categories option[value="' + element.categorie + '"]').text() + '</p></li>');
                                }else{
                                    $('.diaporama ul').append('<li class="photo-right"><img class="attachment-large size-large wp-post-image" decoding="async" loading="lazy" src="' + 
                                    mediaResponse.media_details.sizes.large.source_url + '" alt="photo-' + mediaResponse.id + '" ><a href="' + 
                                    mediaResponse.media_details.sizes.full.source_url +  '" class="fullscreen"><img src="' + objPhotos.restURL + 
                                    '../wp-content/themes/nathaliemota/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/></a><a class="eye" href="' + 
                                    element.link + '"><img src="' + objPhotos.restURL + 
                                    '../wp-content/themes/nathaliemota/images/Icon_eye.png" alt="Infos Icon eye"/></a><p class="hover-title">' + 
                                    element.title.rendered + '</p><p class="hover-categorie">' + $('.categories option[value="' + element.categorie + '"]').text() + '</p></li>');
                                }
                                i++;
                                
                            },
                           
                        });
    
                        let button = document.querySelector('.button-show-more'); 
                        /* remove , at begin and at end of string */
                        if(photosIds.substring(0,1) == ','){
                            photosIds=photosIds.substring(1, photosIds.length);
                        }
                        if(photosIds.substring(photosIds.length-1, photosIds.length) == ','){
                            photosIds=photosIds.substring(0, photosIds.length-1);
                        }
                        button.dataset.photosid = photosIds;
                        
                    });
                    
                    
                    
                }
            },
        });
    }
}


/* to show all photos on single.php */
$('body').on('click', '.button-show-all', function (e) {
    $(this).hide();
    let categorie=$('.single-photo-text p').eq(1).text();
    let categorieName= categorie.substring(categorie.indexOf(':')+1, categorie.length);
    let firstPhotosIds=$(this).data('photosid');
    let postId=$(this).data('postid');
    let navId=$(this).data('navid');
    let photosId=$(this).data('photosid');
    let categorieId=$(this).data('categorie');
    showAllPhotos(postId, navId, photosId, categorieId, categorieName, firstPhotosIds);
});

/* to show 12 new photos on infinite page*/
$('body').on('click', '.button-show-more', function (e) {
    let categorie="";
    let format="";
    let order="";
    let postId=$(this).data('postid'); 
    if($('.categories ul li').hasClass('selected')){
        let categorieHtmlId=$('.categories ul li.selected').attr('id');
        /* extract number id from html attribute id */
        categorie = parseInt(categorieHtmlId.substring(4, categorieHtmlId.length));
    }
    if($('.formats ul li').hasClass('selected')){
        let formatHtmlId=$('.formats ul li.selected').attr('id');
        /* extract number id from html attribute id */
        format = parseInt(formatHtmlId.substring(7, formatHtmlId.length));
    }
    if($('.filter ul li').hasClass('selected')){
    let filterHtmlId=$('.filter ul li.selected').attr('id');
    /* extract number id from html attribute id */
    order = parseInt(filterHtmlId.substring(6, filterHtmlId.length));
    }
    infinitePage(postId, categorie, format, order);

});
/* to show submenu categorie on filter navigation */
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

/* to show submenu format on filter navigation */
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

/* to show submenu order on filter navigation */
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

/* to select choice into categorie on filter navigation */
$('body').on('click', '.categories ul li', function(){
    $('.categories ul li.selected').removeClass('selected');
    $(this).addClass('selected');
    $('.categories ul').hide();
    let categorieId ="";
    let formatId="";
    let filterId="";
    if($('.categories ul li').hasClass('selected')){
        let categorieHtmlId=$('.categories ul li.selected').attr('id');
        /* extract number id from html attribute id */
        categorieId = parseInt(categorieHtmlId.substring(4, categorieHtmlId.length));
    }
    if($('.formats ul li').hasClass('selected')){
        let formatHtmlId=$('.formats ul li.selected').attr('id');
        /* extract number id from html attribute id */
        formatId = parseInt(formatHtmlId.substring(7, formatHtmlId.length));
    }
    if($('.filter ul li').hasClass('selected')){
    let filterHtmlId=$('.filter ul li.selected').attr('id');
    /* extract number id from html attribute id */
    filterId = parseInt(filterHtmlId.substring(6, filterHtmlId.length));
    }
    if($('.categories ul li').hasClass('selected') || $('.formats ul li').hasClass('selected') || $('.filter ul li').hasClass('selected')){
        filterPhoto(categorieId, formatId, filterId); 
    }
});

/* to select choice into format on filter navigation */
$('body').on('click', '.formats ul li', function(){
    $('.formats ul li.selected').removeClass('selected');
    $(this).addClass('selected');
    $('.formats ul').hide();
    let categorieId ="";
    let formatId="";
    let filterId="";
    if($('.categories ul li').hasClass('selected')){
        let categorieHtmlId=$('.categories ul li.selected').attr('id');
        /* extract number id from html attribute id */
        categorieId = parseInt(categorieHtmlId.substring(4, categorieHtmlId.length));
    }
    if($('.formats ul li').hasClass('selected')){
        let formatHtmlId=$('.formats ul li.selected').attr('id');
        /* extract number id from html attribute id */
        formatId = parseInt(formatHtmlId.substring(7, formatHtmlId.length));
    }
    if($('.filter ul li').hasClass('selected')){
        let filterHtmlId=$('.filter ul li.selected').attr('id');
        /* extract number id from html attribute id */
        filterId = parseInt(filterHtmlId.substring(6, filterHtmlId.length));
    }
    if($('.categories ul li').hasClass('selected') || $('.formats ul li').hasClass('selected') || $('.filter ul li').hasClass('selected')){
        filterPhoto(categorieId, formatId, filterId); 
    }
});

/* to select choice into order on filter navigation */
$('body').on('click', '.filter ul li', function(){
    $('.filter ul li.selected').removeClass('selected');
    $(this).addClass('selected');
    $('.filter ul').hide();
    let categorieId ="";
    let formatId="";
    let filterId="";
    if($('.categories ul li').hasClass('selected')){
        let categorieHtmlId=$('.categories ul li.selected').attr('id');
        /* extract number id from html attribute id */
        categorieId = categorieHtmlId.substring(4, categorieHtmlId.length);
    }
    if($('.formats ul li').hasClass('selected')){
        let formatHtmlId=$('.formats ul li.selected').attr('id');
        /* extract number id from html attribute id */
        formatId = formatHtmlId.substring(7, formatHtmlId.length);
    }
    if($('.filter ul li').hasClass('selected')){
        let filterHtmlId=$('.filter ul li.selected').attr('id');
        /* extract number id from html attribute id */
        filterId = filterHtmlId.substring(6, filterHtmlId.length);
    }
    if($('.categories ul li').hasClass('selected') || $('.formats ul li').hasClass('selected') || $('.filter ul li').hasClass('selected')){
        filterPhoto(categorieId, formatId, filterId); 
    }
    
});


});