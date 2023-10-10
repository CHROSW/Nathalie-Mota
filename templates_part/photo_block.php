<?php
$post_id = get_the_ID();
$categorie=wp_get_post_terms(get_the_ID(), 'categorie');

if(is_single(get_the_ID())){
    
    if(get_next_post() != ''){
        $next=get_next_post()->ID;
        $the_query = new WP_Query( 
            array(
                'post__not_in' => array( get_the_ID(), get_next_post()->ID ),
                'post_type' => 'photo',
                'tax_query' => array( 
                    array(
                        'taxonomy' => 'categorie',
                        'field' => 'slug',
                        'terms' => $categorie[0]->slug,
                    ),
                ),
                'posts_per_page' => 2,
                'orderby' => 'rand',
            )
        );
    }elseif(get_previous_post() != ''){
        $prev=get_previous_post()->ID;
        $the_query = new WP_Query( 
            array(
                'post__not_in' => array( get_the_ID(), get_previous_post()->ID ),
                'post_type' => 'photo',
                'tax_query' => array( 
                    array(
                        'taxonomy' => 'categorie',
                        'field' => 'slug',
                        'terms' => $categorie[0]->slug,
                    ),
                ),
                'posts_per_page' => 2,
                'orderby' => 'rand',
            )
        ); 
    }else{
        
    }

}elseif(is_home()){
   
    $the_query = new WP_Query( 
        array(
            'post__not_in' => array( get_the_ID()),
            'post_type' => 'photo',
            'posts_per_page' => 12,
            'orderby' => 'rand',
        )
    );
}else{
  
}
// The Loop.
if ( isset($the_query) && $the_query->have_posts()) {
	echo '<ul>';
    $i=0;
    $ids='';
	while ( $the_query->have_posts() ) {
		$the_query->the_post();
        if($i % 2 == 0){
            echo '<li class="photo-left">';
        }else{
            echo "<li class='photo-right'>";
        }
		echo get_the_post_thumbnail(get_the_ID(), 'large') . '
        <a href="' . get_the_post_thumbnail_url(get_the_ID()) . '" class="fullscreen">
        <img src="' . get_template_directory_uri() . '/images/Icon_fullscreen.png" alt="Lightbox Icon fullscreen"/>
        </a>
        <a class="eye" href="' . get_permalink(get_the_ID()) . '">
        <img src="' . get_template_directory_uri() . '/images/Icon_eye.png" alt="Infos Icon eye"/>
        </a>
        <p class="hover-title">' . get_the_title() . '</p>
        <p class="hover-categorie">' . $categorie[0]->slug . '</p>
        </li>';
        $i++;
        $ids=get_the_ID().','.$ids;
	}
	echo '</ul>';
} else {
	esc_html_e( 'Sorry, no posts matched.' );
}

if(is_single($post_id)){
    $navid = (isset($next) ? $next : ( (isset($prev) ? $prev : '' )));
    echo '<div class="area-button-more">
        <button
        class="button-show-all"
        data-postid="' . $post_id . '"
        data-navid="' . $navid . '"
        data-photosid="' . substr($ids,0, strlen($ids)-1) . '"
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
        data-photosid="' . substr($ids,0, strlen($ids)-1) . '"
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
<div class="lightbox">
    <div class="lightbox-header">
        <span class="lightbox-close">X</span>
    </div>    
    <a class="nav-prev" href="#">
        <svg width="26" height="8" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.646447 3.64645C0.451184 3.84171 0.451184 4.15829 0.646447 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976311 4.7308 0.659728 4.53553 0.464466C4.34027 0.269204 4.02369 0.269204 3.82843 0.464466L0.646447 3.64645ZM1 4.5H26V3.5H1V4.5Z" fill="black"/>
        </svg>Précédent
    </a>
    <div class='lightbox-loader'>

    </div>
    <a class="nav-next" href="#">
        <svg width="26" height="8" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.3536 3.64645C25.5488 3.84171 25.5488 4.15829 25.3536 4.35355L22.1716 7.53553C21.9763 7.7308 21.6597 7.7308 21.4645 7.53553C21.2692 7.34027 21.2692 7.02369 21.4645 6.82843L24.2929 4L21.4645 1.17157C21.2692 0.976311 21.2692 0.659728 21.4645 0.464466C21.6597 0.269204 21.9763 0.269204 22.1716 0.464466L25.3536 3.64645ZM25 4.5H0V3.5H25V4.5Z" fill="black"/>
        </svg>Suivant
    </a>
</div>