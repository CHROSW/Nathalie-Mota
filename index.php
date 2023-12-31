<?php
$hero_query = new WP_Query( 
    array(
        'post_type' => 'photo',
        'posts_per_page' => 1,
        'orderby' => 'rand',
    )
);


get_header();
/* hero section */
echo '<section class="hero">';
while ( $hero_query->have_posts() ) {
    $hero_query->the_post();
    echo '<article id="post-' . get_the_ID() . '">
        <h2>Photographe Event</h2>';
    echo get_the_post_thumbnail(get_the_ID(), 'full');
    echo '</article>';
}
/* filter section */
echo '</section>
    <section>
    <div class="filter-nav">   
    <div class="categories"><span>Catégories</span>
    <div class="arrow-down"><</div>
    <ul>';

/* taxonomy list by taxonomy name */ 
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

for($i=0; $i < count($categories); $i++){
echo '<li  id="cat-' . $categories[$i]->term_id . '">' . $categories[$i]->name . '</li>';
}
echo '</ul></div>
    <div class="formats"><span>Formats</span>
    <div class="arrow-down"><</div>
    <ul>';
for($i=0; $i < count($formats); $i++){
echo '<li id="format-' . $formats[$i]->term_id . '">' . $formats[$i]->name . '</li>';
}
echo '</ul></div>
    <div class="filter"><span>Trier par</span>
    <div class="arrow-down"><</div>
    <ul>
    <li id="order-asc" style="accent-color: yellow;">Date croissante</li>
    <li id="order-desc">Date décroissante</li>
    </ul></div>
    </div>
    <div class="diaporama">';
/*list image content */
get_template_part('/templates_part/photo_block');
echo '</div>
    </section>';
get_footer();
?>