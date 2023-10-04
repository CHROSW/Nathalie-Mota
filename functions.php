<?php
function enqueue_script_my_scripts(){
    wp_enqueue_style('nathaliemotacss', get_template_directory_uri() . '/style.css');
    wp_register_script('nathaliemotascript', get_template_directory_uri() . '/js/scripts.js', array('jquery'), '1.0', false);
    wp_enqueue_script('nathaliemotascript');
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

add_action( 'wp_ajax_load_photos', 'load_photos' );
add_action( 'wp_ajax_nopriv_load_photos', 'load_photos' );

function load_photos(){
	
		// Vérification de sécurité
		if( 
			! isset( $_REQUEST['nonce'] ) or 
			   ! wp_verify_nonce( $_REQUEST['nonce'], 'load_photos' ) 
		) {
			wp_send_json_error( "Vous n’avez pas l’autorisation d’effectuer cette action.", 403 );
		  }
		
		// On vérifie que l'identifiant a bien été envoyé
		if( ! isset( $_POST['postid'] ) ) {
			wp_send_json_error( "Les identifiants de l'article sont manquants.", 400 );
		  }
	
		  // Récupération des données du formulaire
		  $post_id = $_POST['postid'];
		  $nav_id = $_POST['navid'];
		  $cat_name= $_POST['categorie'];
		// Vérifier que l'article est publié, et public
		/*if( get_post_status( $post_id[count($post_id)] ) !== 'publish' ) {
			wp_send_json_error( "Vous n'avez pas accès aux photos de cet article.", 403 );
		}*/
	
		  // Utilisez sanitize_text_field() pour les chaines de caractères.
		  // exemple : 
		//$name = sanitize_text_field( $_POST['name'] );
	
		  // Requête des photos
		  
			$the_query = new WP_Query( 
				array(
					'post__not_in' => array($post_id, $nav_id),
					'post_type' => 'photo',
					'tax_query' => array( 
						array(
							'taxonomy' => 'categorie',
							'field' => 'slug',
							'terms' => $cat_name,
						),
					),
					'post_per_page' => 100,
					'orderby' => 'rand',
				)
			);
			
			
		  // Préparer le HTML des photos
		  if ( isset($the_query) && $the_query->have_posts()) {
			
			$i=0;
			while ( $the_query->have_posts() ) {
				$the_query->the_post();
				if($i % 2 == 0){
					$html .= "<li class='photo-left'>";
				}else{
					$html .= "<li class='photo-right'>";
				}
				$html .= get_the_post_thumbnail(get_the_ID(), 'large') . '</li>';
				$i++;
			}
			
		} else {
			$html = '<li style="list-style:none;margin:auto;margin-bottom:40px;">Sorry, no posts matched.</li>';
		}
		/**/
	
		  // Envoyer les données au navigateur
		wp_send_json_success( $html );
	}

?>