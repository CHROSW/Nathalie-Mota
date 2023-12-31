<?php
/* head link */ 
function enqueue_script_my_scripts(){
    wp_enqueue_style('nathaliemotacss', get_template_directory_uri() . '/style.css');
    wp_register_script('nathaliemotascript', get_template_directory_uri() . '/js/scripts.js', array('jquery'), '1.0', false);
    wp_enqueue_script('nathaliemotascript');
	wp_localize_script('nathaliemotascript', 'objPhotos',array('restURL' => rest_url(), 'restNonce' => wp_create_nonce('wp_rest')));
	wp_register_script('nathaliemotalightboxscript', get_template_directory_uri() . '/js/lightbox.js', array('jquery'), '1.0', false);
	wp_enqueue_script('nathaliemotalightboxscript');
}

add_action('wp_enqueue_scripts', 'enqueue_script_my_scripts');
/* wordpress menu display on theme */ 
function register_my_menu() {
    register_nav_menu( 'main-menu' , __( 'Menu principal', 'text-domain' ) );
	register_nav_menu( 'footer-menu', __( 'Footer Menu', 'text-domain'));
}
add_action( 'after_setup_theme', 'register_my_menu' );

/* add logo option on customizer */
function wpc_theme_support() {
	add_theme_support('custom-logo', array(
		'flex-height' => true,
		'flex-width'  => true,
	));
}
add_action('after_setup_theme','wpc_theme_support');

function wpc_customize_register($wp_customize) {
	$wp_customize->add_section('wpc_logo_section', array(
			'title'          => __('Logo', 'textdomain'),
			'priority'       => 30,
			'description'    => __('Upload a logo to replace the default site name and description in the header', 'textdomain')
		)
	);
	$wp_customize->add_setting('wpc_logo');
	$wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'wpc_logo', array(
			'label'      => __('Logo', 'textdomain'),
			'section'    => 'wpc_logo_section',
			'settings'   => 'wpc_logo')
		)
	);
}
add_action('customize_register', 'wpc_customize_register');
?>