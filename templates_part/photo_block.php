<?php
$post_id = get_the_ID();
$categorie=wp_get_post_terms(get_the_ID(), 'categorie');

if(is_single(get_the_ID())){
    
    if(get_next_post() != ''){
        $next=get_next_post()->ID;
        
    }elseif(get_previous_post() != ''){
        $prev=get_previous_post()->ID;
       
    }else{
        
    }

}


echo '<ul></ul>';



/* button display after list image */
if(is_single($post_id)){
    echo '<div class="area-button-more">
        <button
        class="button-show-all"
        data-postid="' . $post_id . '"
        data-navid="' . (isset($next) ? $next : ( (isset($prev) ? $prev : '' ))) . '"
        data-photosid=""
        data-categorie="' . $categorie[0]->term_id .'"
        data-nonce="' . wp_create_nonce('load_photos') . '"
        data-action="load_photos"
        data-ajaxurl="' . admin_url( 'admin-ajax.php' ) . '"
        >Toutes les photos</button>
        </div>';

}elseif(is_home()){
    echo '<div class="area-button-more">
        <button class="button-show-more"
        data-postid="' . $post_id . '"
        data-photosid=""
        data-nonce="' . wp_create_nonce('load_photos') . '"
        data-action="load_photos"
        data-ajaxurl="' . admin_url( 'admin-ajax.php' ) . '"
        >Charger plus</button>
        </div>';
}else{

}

// Restore original Post Data.
wp_reset_postdata();

?>