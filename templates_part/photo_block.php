<?php
if(is_single(get_the_ID())){
    $single=get_the_ID();
    $cate=wp_get_post_terms(get_the_ID(), 'categorie');
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
                        'terms' => $cate[0]->slug,
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
                        'terms' => $cate[0]->slug,
                    ),
                ),
                'posts_per_page' => 2,
                'orderby' => 'rand',
            )
        ); 
    }else{
        
    }

}elseif(is_home()){
   $home=get_the_ID();
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
            echo "<li class='photo-left'>";
        }else{
            echo "<li class='photo-right'>";
        }
		echo get_the_post_thumbnail(get_the_ID(), 'large') . '</li>';
        $i++;
        $ids=get_the_ID().','.$ids;
	}
	echo '</ul>';
} else {
	esc_html_e( 'Sorry, no posts matched.' );
}

if(isset($single) && is_single($single)){
    $navid = (isset($next) ? $next : ( (isset($prev) ? $prev : '' )));
    echo '<div class="area-button-more">
        <button
        class="button-show-all"
        data-postid="' . $single . '"
        data-navid="' . $navid . '"
        data-photosid="' . substr($ids,0, strlen($ids)-1) . '"
        data-categorie="' . $cate[0]->term_id .'"
        data-nonce="' . wp_create_nonce('load_photos') . '"
        data-action="load_photos"
        data-ajaxurl="' . admin_url( 'admin-ajax.php' ) . '"
        >Toutes les photos</button>
        </div>';
    
}elseif(isset($home) && is_home()){
    echo '<div class="area-button-more">
        <button class="button-show-more"
        data-postid="' . $home . '"
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