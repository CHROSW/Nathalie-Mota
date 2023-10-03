<?php
if(is_single(get_the_ID())){
    $cate=wp_get_post_terms(get_the_ID(), 'categorie');
    if(method_exists(get_next_post(), 'id')){
       
        $the_query = new WP_Query( 
            array(
                'post__not_in' => array( get_the_ID(), get_next_post()->id ),
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
        $the_query = new WP_Query( 
            array(
                'post__not_in' => array( get_the_ID() ),
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
    }

}elseif(is_home()){
   
    $the_query = new WP_Query( 
        array(
            'post__not_in' => array( get_the_ID()),
            'post_type' => 'photo',
            'posts_per_page' => 8,
            'orderby' => 'rand',
        )
    );
}else{
  
}
// The Loop.
if ( isset($the_query) && $the_query->have_posts()) {
	echo '<ul>';
    $i=0;
	while ( $the_query->have_posts() ) {
		$the_query->the_post();
        if($i % 2 == 0){
            echo "<li class='photo-left'>";
        }else{
            echo "<li class='photo-right'>";
        }
		echo get_the_post_thumbnail(get_the_ID(), 'large') . '</li>';
        $i++;
	}
	echo '</ul>';
} else {
	esc_html_e( 'Sorry, no posts matched.' );
}
// Restore original Post Data.
wp_reset_postdata();

?>