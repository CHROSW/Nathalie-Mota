<?php
if(method_exists(get_next_post(), 'id')){
$the_query = new WP_Query( 
    array(
        'post__not_in' => array( get_the_ID(), get_next_post()->id ),
        'post_type' => 'photo',
        'category_name' => $cat,
        'posts_per_page' => 2,
        'orderby' => 'rand',
    )
);
}else{
   $the_query = new WP_Query( 
    array(
        'post__not_in' => array( get_the_ID() ),
        'post_type' => 'photo',
        'category_name' => $cat,
        'posts_per_page' => 2,
        'orderby' => 'rand',
    )
); 
}


// The Loop.
if ( $the_query->have_posts() ) {
	echo '<ul>';
	while ( $the_query->have_posts() ) {
		$the_query->the_post();
		echo '<li>' . get_the_post_thumbnail(get_the_ID(), 'thumbnail') . '</li>';
	}
	echo '</ul>';
} else {
	esc_html_e( 'Sorry, no posts matched your criteria.' );
}
// Restore original Post Data.
wp_reset_postdata();

?>