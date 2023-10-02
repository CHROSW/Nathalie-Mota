<?php
$hero_query = new WP_Query( 
    array(
        'post_type' => 'photo',
        'posts_per_page' => 1,
        'orderby' => 'rand',
    )
);

get_header();
echo '<section class="hero">';
while ( $hero_query->have_posts() ) {
$hero_query->the_post();
echo '<article id="post-' . get_the_ID() . '">';
echo '<h2>Photographe Event</h2>';
echo get_the_post_thumbnail(get_the_ID(), 'full');
echo '</article>';
}
echo '</section>';
get_footer();
?>