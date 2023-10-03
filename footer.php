        <?php
        get_template_part('/templates_part/contact'); 
        ?>
        <footer class="footer">
            <nav role="navigation" aria-label="<?php _e('Footer Menu', 'text-domain'); ?>">
                <?php wp_nav_menu(['theme_location' => 'footer-menu',]); ?>
            </nav>
        </footer>
    </body>
</html>