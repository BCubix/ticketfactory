INSERT INTO
    `parameter` (
        id, name, type, param_key, param_value, available_value, validations, tab_name, block_name, breakpoints_value
    )
VALUES
    (21, 'Type d\'évènements par défaut', 'list', 'core_default_events_type', 'Pièces', '[{\"id\": \"Pièces\", \"name\": \"Pièces de théatre\"}, {\"id\": \"Expositions\", \"name\": \"Expositions temporaires\"}, {\"id\": \"Films\", \"name\": \"Diffusions de films\"}, {\"id\": \"Concerts\", \"name\": \"Concerts\"}, {\"id\": \"Ballets\", \"name\": \"Ballets\"}]', '[]', 'Général', 'Types d\'événements', 'xs-12 md-6', 1);
    (22, 'Type de structures par défaut', 'list', 'core_default_structures_type', '0', '[{\"id\": 0, \"name\": \"Théatre\"}, {\"id\": 1, \"name\": \"Musée\"}, {\"id\": 2, \"name\": \"Cinéma\"}, {\"id\": 3, \"name\": \"Festival\"}]', '[]', 'Général', 'Types d\'événements', 'xs-12 md-6', 1);
    (25, 'Format des images', 'string', 'core_image_format', '', NULL, '[]', NULL, NULL, NULL, 1);
    (26, 'Cropper ou compléter les images ?', 'bool', 'core_image_to_crop', '1', NULL, '[]', NULL, NULL, NULL, 1);
    (27, 'Qualité d\'image WEBP', 'int', 'core_image_webp_quality', '90', NULL, '[]', NULL, NULL, NULL, 1);
    (28, 'Qualité d\'image PNG', 'int', 'core_image_png_quality', '90', NULL, '[]', NULL, NULL, NULL, 1);
    (29, 'Qualité d\'image JPG', 'int', 'core_image_jpg_quality', '90', NULL, '[]', NULL, NULL, NULL, 1);
    (30, 'Thème principal (admin)', 'string', 'core_admin_theme', 'default', NULL, '[]', NULL, NULL, NULL, 1);
    (31, 'Thème principal', 'string', 'core_main_theme', 'default', NULL, '[]', NULL, NULL, NULL, 1);
    (32, 'Page saisons', 'Page', 'core_page_season', NULL, NULL, '[]', 'Paramètres généraux', 'URLs', 'xs-12 md-6', 1);
    (33, 'Page salles', 'Page', 'core_page_room', NULL, NULL, '[]', 'Paramètres généraux', 'URLs', 'xs-12 md-6', 1);
    (34, 'Page categories', 'Page', 'core_page_eventCategory', NULL, NULL, '[]', 'Paramètres généraux', 'URLs', 'xs-12 md-6', 1);
    (35, 'Page tags', 'Page', 'core_page_tag', NULL, NULL, '[]', 'Paramètres généraux', 'URLs', 'xs-12 md-6', 1);
    (36, 'Page événements', 'Page', 'core_page_event', NULL, NULL, '[]', 'Paramètres généraux', 'URLs', 'xs-12 md-6', 1);
    (37, 'Format de l\'URL des événements', 'string', 'core_event_url_format', '%season%/%category%/%slug%', NULL, '[]', 'Paramètres généraux', 'URLs', 'xs-12 md-6', 1);
    (38, '1er mois de la saison', 'list', 'core_season_month', '9', '[{\"id\": 1, \"name\": \"Janvier\"}, {\"id\": 2, \"name\": \"Février\"}, {\"id\": 3, \"name\": \"Mars\"}, {\"id\": 4, \"name\": \"Avril\"}, {\"id\": 5, \"name\": \"Mai\"}, {\"id\": 6, \"name\": \"Juin\"}, {\"id\": 7, \"name\": \"Juillet\"}, {\"id\": 8, \"name\": \"Août\"}, {\"id\": 9, \"name\": \"Septembre\"}, {\"id\": 10, \"name\": \"Octobre\"}, {\"id\": 11, \"name\": \"Novembre\"}, {\"id\": 12, \"name\": \"Décembre\"}]', NULL, 'Evènements', 'Saison', 'xs-12 md-6', 1);
    (39, 'Nom', 'string', 'core_website_name', 'Theater online', NULL, NULL, NULL, NULL, NULL, 1);
    (46, 'Adresse email d\'envoi', 'string', 'core_email_sender', 'hi@sender.com', NULL, NULL, 'Général', 'Email', 'xs-12 md-6', 1);
    (83, 'Formats d\'images par défaut', 'ImageFormat', 'core_default_image_formats', '1, 2, 4, 3, 5', NULL, '[]', 'Médias', 'Formats d\'images', 'xs-12 md-6', 1);
    (84, 'Utiliser les produits', 'bool', 'core_use_products', '1', '[]', '[]', 'Général', 'Fonctionnalités', 'xs-12 md-6', 1);
    (85, 'Utiliser les clients', 'bool', 'core_use_customers', '1', '[]', '[]', 'Général', 'Fonctionnalités', 'xs-12 md-6', 1);
    (86, 'Utiliser le tunnel d\'achat', 'bool', 'core_use_purchase', '1', '[]', '[]', 'Général', 'Fonctionnalités', 'xs-12 md-6', 1);
    (100, 'Filtrer par saison', 'bool', 'core_event_season_filter', '1', NULL, '[]', 'Evènements', 'Filtres', 'xs-12 md-6 lg-4', 1);
    (101, 'Filtrer par catégorie', 'bool', 'core_event_category_filter', '0', NULL, '[]', 'Evènements', 'Filtres', 'xs-12 md-6 lg-4', 1);
    (102, 'Filtrer par salle', 'bool', 'core_event_room_filter', '1', NULL, '[]', 'Evènements', 'Filtres', 'xs-12 md-6 lg-4', 1);
    (103, 'Filtrer par date de début', 'bool', 'core_event_begin_date_filter', '0', NULL, '[]', 'Evènements', 'Filtres', 'xs-12 md-6 lg-4', 1);
    (104, 'Filtrer par date de fin', 'bool', 'core_event_end_date_filter', '0', NULL, '[]', 'Evènements', 'Filtres', 'xs-12 md-6 lg-4', 1);
    (105, 'Activer le mode débug', 'bool', 'core_debug_mode', '1', NULL, '[]', 'Général', 'Paramètres du site', 'xs-12 md-6 lg-4', 1);
    (106, 'Activer le mode maintenance', 'bool', 'core_maintenance_mode', '0', NULL, '[]', 'Général', 'Maintenance du site', 'xs-12', 1);
    (107, 'Message de maintenance', 'string', 'core_maintenance_message', 'Nous sommes actuellement fermé, revenez plus tard.', NULL, '[]', 'Général', 'Maintenance du site', 'xs-12 md-6', 1);
    (108, 'Adresses IP autorisées (séparées par des virgules (0.0.0.0, 192.168.0.1, ...))', 'string', 'core_maintenance_ip', NULL, NULL, '[]', 'Général', 'Maintenance du site', 'xs-12 md-6', 1);
    (111, 'Nom par défaut des groupes de dates', 'string', 'core_default_event_date_block_name', NULL, NULL, '[]', 'Evènements', 'Dates d\'évènements', 'xs-12 md-6 lg-4', 1);
    (113, 'Nom par défaut des groupes de tarifs', 'string', 'core_default_event_price_block_name', NULL, NULL, '[]', 'Evènements', 'Tarifs d\'évènements', 'xs-12 md-6 lg-4', 1);
    (114, 'Tarifs par défaut', 'prices', 'core_default_event_price', '[]', NULL, '[]', 'Evènements', 'Tarifs d\'évènements', 'xs-12', 1);
    (115, 'Hôte du serveur', 'string', 'core_email_host', 'smtp.gmail.com', NULL, NULL, 'Général', 'Email', 'xs-12 md-8', 1);
    (116, 'Port du serveur', 'string', 'core_email_port', '465', NULL, NULL, 'Général', 'Email', 'xs-12 md-4', 1);
    (117, 'Identifiant du serveur', 'string', 'core_email_user', NULL, NULL, NULL, 'Général', 'Email', 'xs-12 md-6', 1);
    (118, 'Mot de passe du serveur', 'password', 'core_email_password', NULL, NULL, NULL, 'Général', 'Email', 'xs-12 md-6', 1);
    (119, 'Indexer le site', 'bool', 'core_index_site', '0', '[]', '[]', 'Paramètres généraux', 'Seo', 'xs-12 md-3', 1);
    (120, 'Afficher les salles', 'bool', 'core_display_rooms', '0', '[]', '[]', 'Général', 'Paramètres du site', 'xs-12 md-4', 1);
    (121, 'Afficher les saisons', 'bool', 'core_display_seasons', '0', '[]', '[]', 'Général', 'Paramètres du site', 'xs-12 md-4', 1);
    (122, 'Afficher les tags', 'bool', 'core_display_tags', '0', '[]', '[]', 'Général', 'Paramètres du site', 'xs-12 md-4', 1);
    (123, 'Poids maximum des fichiers joints (Mo)', 'int', 'core_max_files_size', '10', '[]', '[]', 'Général', 'Fichiers', 'xs-12 md-6', 1);
    (124, 'Taille maximale des images d\'événements (Mo)', 'int', 'core_max_images_size', '10', '[]', '[]', 'Général', 'Fichiers', 'xs-12 md-6', 1);
    (125, 'Générer les fichiers robot.txt et sitemap.xml', 'requestButton', 'core_generate_seo', '/parametres/generer/seo', NULL, NULL, 'Paramètres généraux', 'Seo', 'xs-12 md-6', 1);
    (126, 'Activer le mode catalogue', 'bool', 'core_catalog_mode', '0', '[]', '[]', 'Général', 'Paramètres du site', 'xs-12 md-4', 1);
    (129, 'Score minimum attendu', 'float', 'GoogleRecaptcha_min_score', NULL, '[]', '[]', 'Paramètres de modules', 'Module Recaptcha (Google)', 'xs-12 md-6', 0);
    (148, 'Différer la désactivation des spectacles (Heure)', 'int', 'core_event_additional_time', '3', '[]', '[]', 'Général', 'Paramètres du site', 'xs-12 md-4', 1);
    (170, 'Utiliser les saisons', 'bool', 'core_use_seasons', '1', NULL, NULL, 'Evènements', 'Saison', 'xs-12 md-6', 1);
    (171, 'Utiliser les salles', 'bool', 'core_use_rooms', '1', NULL, NULL, 'Evènements', 'Salles', 'xs-12 md-6', 1);
    (172, 'Utiliser les types d\'évènements', 'bool', 'core_use_event_types', '1', NULL, NULL, 'Evènements', 'Types', 'xs-12 md-6', 1);
    (265, 'Nombre d\'évènements à afficher par page', 'int', 'core_event_limit', '6', NULL, '[]', 'Evènements', 'Pages listes', 'xs-12 md-6', 1);
    (266, 'Tri par défaut', 'list', 'core_event_default_sort', 'chronoAsc', '[{\"id\": \"nameAsc\", \"name\": \"Nom (Ordre alphabétique)\"}, {\"id\": \"nameDesc\", \"name\": \"Nom (Ordre anti-alphabétique)\"}, {\"id\": \"chronoAsc\", \"name\": \"Date (Ordre chronologique)\"}, {\"id\": \"chronoDesc\", \"name\": \"Date (Ordre antéchronologique)\"}]', NULL, 'Evènements', 'Pages listes', 'xs-12 md-6', 1);
