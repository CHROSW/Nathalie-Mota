<!doctype html>
<html lang="fr">
    <head>
	    <meta charset="utf-8" />
	    <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet">
        <?php wp_head(); ?>
    </head>
    <body>
            <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
	            <?php
		        $image = wp_get_attachment_image_src(attachment_url_to_postid(get_theme_mod('wpc_logo')) , 'full'); 
	            ?>
	            <img src="<?php echo $image[0]; ?>" alt="<?php echo esc_attr(get_bloginfo('name', 'display')); ?>">
            </a>
            <nav role="navigation" aria-label="<?php _e('Menu principal', 'text-domain'); ?>">
            <?php wp_nav_menu(['theme_location' => 'main-menu',]); ?>
            </nav>