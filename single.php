<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */

get_header();

/* Start the Loop */
while ( have_posts() ) :
	the_post();
	echo "<article id='post-" . get_the_ID() . "' >";
	echo "<div class='single-photo'>";
	echo "<div class='single-photo-text'>";
	the_title('<h1>','</h1>');
	echo "<p>Référence<span>:</span>" . '' . "</p>";
	echo "<p>Catégorie<span>:</span>" . '' . "</p>";
	echo "<p>Format<span>:</span>" . '' . "</p>";
	echo "<p>Type<span>:</span>" . '' . "</p>";
	echo "<p>Année<span>:</span>" . '' . "</p>";
	echo "</div>";
	echo get_the_post_thumbnail(get_the_ID(), 'large');
	echo "</div>";
	/*the_post_thumbnail();*/
	

	if ( is_attachment() ) {
		//Parent post navigation.
		the_post_navigation(
			array(
				/* translators: %s: Parent post link. */
			'prev_text' => sprintf( __( '<span class="meta-nav">Published in</span><span class="post-title">%s</span>', 'Nathalie Mota' ), '%title' ),
			)
		);
	}

	// If comments are open or there is at least one comment, load up the comment template.
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}

	// Previous/next post navigation.
	echo "<div>";
	echo "<p>Cette photo vous intéresse ?</p>";
	echo get_the_post_thumbnail(get_next_post(), 'thumbnail');
	the_post_navigation(
		array(
			'next_text' => '<p class="meta-nav"><img src="' . get_template_directory_uri() . '/images/Line 7.png" alt="next"/></p>',
			'prev_text' => '<p class="meta-nav"><img src="'. get_template_directory_uri() . '/images/Line 6.png" alt="previous"/></p>',
		)
	);
	echo "</div>";
	echo "</article>";
endwhile; // End of the loop.

get_footer();
