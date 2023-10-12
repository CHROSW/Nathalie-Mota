jQuery(document).ready(function($){

    function showLightbox(url, page, nbPageMax, loop_link, firstPhoto){
    
    let listPhoto = $('button[data-photosid]').data('photosid');
    let nbPhoto= listPhoto.split(',').length;
    let lastPhoto = nbPhoto%12;
    let matched_next=0;
    let matched_first=0;
    let matched_url = 0;
    let i=0;
    let first_next =0;
    
    $.ajax({
        type: 'GET',
        url: objphotos.restURL + 'wp/v2/photo?include=' +  listPhoto + '&orderby=include&per_page=12&page=' + page,
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

                            if(loop_link == "" && page == '1'){ 
                                firstPhoto = mediaresponse.media_details.sizes.full.source_url;
                            }

                            if(matched_first == '0' && page == '1' && i == '0'){
                                matched_first = 1;
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

                            
                            if((i== '12' || (i == lastPhoto && page == nbPageMax)) && (url == mediaresponse.media_details.sizes.full.source_url)){
                                $('.nav-prev').attr("href", firstPhoto);
                                $('.nav-next').attr("href", loop_link);
                            }


                            

                            loop_link = mediaresponse.media_details.sizes.full.source_url;
                            
                            


                            if((i == lastPhoto && page == nbPageMax)){
                                $('.nav-next').attr("href", loop_link);
                            }
                           
                            if(i == '12' && first_next==1){
                                    $('.nav-next').attr("href", loop_link);
                                if(page== '1' && nbPageMax > 1){
                                    firstPhoto = loop_link;   
                                }
                                
                                
                                
                            }   
                            

                            if(i == '12' && page < nbPageMax){
                                page++;
                                
                                showLightbox(url, page, nbPageMax, loop_link, firstPhoto);
                            }
                        },
                    });
                    
                });
                
            } 
            
        },
    });

    }

$("body").on("click", 'a.fullscreen[href$=".jpeg"], a.fullscreen[href$=".jpeg"]', function(e){
    e.preventDefault();
    $('.lightbox').show();
    $('.lightbox-loader').html('');
    let allPhoto = $('button[data-photosid]').data('photosid');
    totalPhoto= allPhoto.split(',').length;
    let totalPage =Math.ceil(totalPhoto/12);
    let firstPhoto = "";
    let loop_link = "";
   
 
    showLightbox($(this).attr('href'), '1', totalPage, loop_link, firstPhoto);
});

$('.nav-prev').click( function(e){
    e.preventDefault();
    $('.lightbox-loader').html('');
    let allPhoto = $('button[data-photosid]').data('photosid');
    totalPhoto= allPhoto.split(',').length;
    let totalPage =Math.ceil(totalPhoto/12);
    let loop_link = "";
    let firstPhoto = "";
 
    showLightbox($(this).attr('href'), '1', totalPage, loop_link, firstPhoto);
});

$('.nav-next').click( function(e){
    e.preventDefault();
    $('.lightbox-loader').html('');
    let allPhoto = $('button[data-photosid]').data('photosid');
    totalPhoto= allPhoto.split(',').length;
    let totalPage =Math.ceil(totalPhoto/12);
    let loop_link = "";
    let firstPhoto = "";
 
    
    showLightbox($(this).attr('href'), '1', totalPage, loop_link, firstPhoto);
});

$('.lightbox-close').click( function(e){
    $('.lightbox').hide();
});

});