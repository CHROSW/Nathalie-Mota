<?php
function enqueue_script_my_scripts(){
    wp_enqueue_style('mycss', get_template_directory_uri() . 'style.css');
    wp_enqueue_script('myscript', get_template_directory_uri() . '/js/scripts.js', array(), '1.0', true);
}

add_action('wp_enqueue_scripts', 'enqueue_script_my_scripts');
?>