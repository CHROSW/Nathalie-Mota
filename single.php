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
	echo "<div>";
	the_title('<h1>','</h1>');
	echo "<p>";
	echo "<span>Référence</span>:<span>" . '' . "</span>";
	echo "<span>Catégorie</span>:<span>" . '' . "</span>";
	echo "<span>Format</span>:<span>" . '' . "</span>";
	echo "<span>Type</span>:<span>" . '' . "</span>";
	echo "<span>Année</span>:<span>" . '' . "</span>";
	echo "</p>";
	echo "</div>";
	/*the_post_thumbnail();*/
	echo get_the_post_thumbnail(get_the_ID(), 'large');

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
	/*$twentytwentyone_next = is_rtl() ? twenty_twenty_one_get_icon_svg( 'ui', 'arrow_left' ) : twenty_twenty_one_get_icon_svg( 'ui', 'arrow_right' );
	$twentytwentyone_prev = is_rtl() ? twenty_twenty_one_get_icon_svg( 'ui', 'arrow_right' ) : twenty_twenty_one_get_icon_svg( 'ui', 'arrow_left' );
	
	$twentytwentyone_next_label     = esc_html__( 'Next post', 'twentytwentyone' );
	$twentytwentyone_previous_label = esc_html__( 'Previous post', 'twentytwentyone' );*/

	echo "<div>";
	echo "<p>Cette photo vous intéresse ?</p>";
	echo get_the_post_thumbnail(get_next_post(), 'thumbnail');
	the_post_navigation(
		array(
			'next_text' => '<p class="meta-nav">' .  /*$twentytwentyone_next .*/ '</p><p class="post-title">%title</p>',
			'prev_text' => '<p class="meta-nav">' . /*$twentytwentyone_prev .*/  '</p><p class="post-title">%title</p>',
		)
	);
	echo "</div>";
	echo "</article>";
endwhile; // End of the loop.

get_footer();
