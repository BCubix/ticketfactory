INSERT INTO
    `url` (
        id, created_at, updated_at, active, name, slug, keyword, controller, position, entity, url_builder, page_id
    )
VALUES
    (1, CURDATE(), CURDATE(), 1, 'Liste d\'évènement', '%Season%/%EventCategory%', 'event-list', 'App\\Controller\\Website\\EventController::orchestrator', 1, NULL, 'event', NULL);
    (2, CURDATE(), CURDATE(), 1, 'Saison', '%slug%', 'season', 'App\\Controller\\Website\\SeasonController::orchestrator', 3, 'Season', 'season', NULL);
    (3, CURDATE(), CURDATE(), 1, 'Salle', '%slug%', 'room', 'App\\Controller\\Website\\RoomController::orchestrator', 4, 'Room', 'room', NULL);
    (4, CURDATE(), CURDATE(), 1, 'Evènement', '%Season%/%EventCategory%/%slug%', 'event', 'App\\Controller\\Website\\EventController::orchestrator', 2, 'Event', 'event', NULL);
    (5, CURDATE(), CURDATE(), 1, 'Catégorie de produit', '%slug%', 'productCategory', 'App\\Controller\\Website\\ProductCategoryController::orchestrator', 5, 'ProductCategory', 'productCategory', NULL);
    (6, CURDATE(), CURDATE(), 1, 'Produits', '%slug%', 'product', 'App\\Controller\\Website\\ProductController::orchestrator', 6, 'Product', 'product', NULL);
    (7, CURDATE(), CURDATE(), 1, 'Tag', '%slug%', 'tag', 'App\\Controller\\Website\\TagController::orchestrator', 7, 'Tag', 'tag', NULL);
    (8, CURDATE(), CURDATE(), 1, 'Catégorie d\'évènement', '%slug%', 'eventCategory', 'App\\Controller\\Website\\EventCategoryController::orchestrator', 8, 'EventCategory', 'eventCategory', NULL);
    (9, CURDATE(), CURDATE(), 1, 'Type d\'évènement', '%slug%', 'eventType', 'App\\Controller\\Website\\EventTypeController::orchestrator', 9, 'EventType', 'eventType', NULL);
