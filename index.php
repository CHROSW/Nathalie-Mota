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
    echo '<article id="post-' . get_the_ID() . '">
        <h2>Photographe Event</h2>';
    echo get_the_post_thumbnail(get_the_ID(), 'full');
    echo '</article>';
}
echo '</section>
    <section>';
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
/*echo '<div class="filter-nav">
    <select class="categories">
    <option value="" selected disabled>Catégories</option>';
for($i=0; $i < count($categories); $i++){
echo '<option value ="' . $categories[$i]->term_id . '">' . $categories[$i]->name . '</option>';
}
echo '</select>
    <select class="formats">
    <option value="" selected disabled>Formats</option>';
for($i=0; $i < count($formats); $i++){
echo '<option value ="' . $formats[$i]->term_id . '">' . $formats[$i]->name . '</option>';
}
echo '</select>
    <select class="filter">
    <option value="" selected disabled>Trier par</option>
    <option value ="asc">Date croissante</option>
    <option value ="desc">Date décroissante</option>
    </select>
    </div>
    <div class="diaporama">';*/
echo '<div class="filter-nav">
<div class="categories">
<div class="select">
<input name="categories" type="radio" id="optioncat" value ="categories" checked/>
<label for="optioncat" class="option">Catégories</label>';
for($i=0; $i < count($categories); $i++){
    echo '<input  name="cat' . $i . '" type="radio" id="option' . $i . '" value ="' . $categories[$i]->term_id . '"/>
    <label for="option' . $i . '" class="option">'. $categories[$i]->name .'</label>';       
}
echo '</div></div><div class="formats"><div class="select">
<input name="formats" type="radio" id="optionform" value ="format" checked/>
<label for="optionform" class="option">Formats</label>';
for($i=0; $i < count($formats); $i++){
    echo '<input  name="cat' . $i . '" type="radio" id="option' . $i . '" value ="' . $formats[$i]->term_id . '"/>
    <label for="option' . $i . '" class="option">'. $formats[$i]->name .'</label>';       
}
echo '</div></div><div class="filter"><div class="select">
<input name="tri" type="radio" id="optiontri" value ="trier" checked/>
<label for="optiontri" class="option">Trier par</label><input name="asc" type="radio" id="option1" value ="asc" />
<label for="option1" class="option">Date croissante</label><input name="desc" type="radio" id="option2" value ="desc" />
<label for="option2" class="option">Date décroissante</label></div></div></div><div class="diaporama">';




get_template_part('/templates_part/photo_block');
echo '</div>
    </section>';
get_footer();
?>