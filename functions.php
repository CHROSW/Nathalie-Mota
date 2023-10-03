<?php
function enqueue_script_my_scripts(){
    wp_enqueue_style('mycss', get_template_directory_uri() . '/style.css');
    wp_register_script('myscript', get_template_directory_uri() . '/js/scripts.js', array('jquery'), '1.0', false);
    wp_enqueue_script('myscript');
}

add_action('wp_enqueue_scripts', 'enqueue_script_my_scripts');

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