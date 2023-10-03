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
echo '<section>';
$categories = get_terms(
    array(
        'taxonomy' => 'categorie',
        'hide_empty' => false,
    )
);
$formats = get_terms(
    array(
        'taxonomy' => 'format',
        'hide_empty' => false,
    )
);
echo '<div class="filter-nav">';
echo '<select class="categories">';
echo '<option value="" selected disabled>Catégories</option>';
for($i=0; $i < count($categories); $i++){
echo '<option value ="' . $categories[$i]->slug . '">' . $categories[$i]->name . '</option>';
}
echo '</select>';
echo '<select class="formats">';
echo '<option value="" selected disabled>Formats</option>';
for($i=0; $i < count($formats); $i++){
echo '<option value ="' . $formats[$i]->slug . '">' . $formats[$i]->name . '</option>';
}
echo '</select>';
echo '<select class="filter">';
echo '<option value="" selected disabled>Trier par</option>';
echo '<option value ="croissant">Date croissante</option>';
echo '<option value ="decroissant">Date décroissante</option>';
echo '</select>';
echo '</div>';
echo '<div class="diaporama">';
get_template_part('/templates_part/photo_block');
echo '<div class="area-button-more">';
echo '<input class="button-show-more" type="button" value="Charger plus"/>';
echo '</div>';
echo '</div>';
echo '</section>';
get_footer();
?>