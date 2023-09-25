<?php
function enqueue_script_my_scripts(){
    wp_enqueue_style('mycss', get_template_directory_uri() . '/style.css');
    wp_register_script('myscript', get_template_directory_uri() . '/js/scripts.js', array('jquery'), '1.0', false);
    wp_enqueue_script('myscript');
}

add_action('wp_enqueue_scripts', 'enqueue_script_my_scripts');
?>