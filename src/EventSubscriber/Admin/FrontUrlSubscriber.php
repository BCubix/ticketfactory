<?php

namespace App\EventSubscriber\Admin;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use JMS\Serializer\EventDispatcher\EventSubscriberInterface;
use JMS\Serializer\EventDispatcher\PreSerializeEvent;

class FrontUrlSubscriber implements EventSubscriberInterface
{
    protected const URL_TYPE_CLASS = [
        "App\Entity\Content\Content" => null,
        "App\Entity\Event\Event" => "tf_website_spectacle_detail",
        "App\Entity\Event\EventCategory" => null,
        "App\Entity\Event\Room" => null,
        "App\Entity\Event\Season" => null,
        "App\Entity\Page\Page" => null
    ];

    public function __construct(private UrlGeneratorInterface $router)
    {}

    public static function getSubscribedEvents(): array
    {
        return [
            [
                'event'    => 'serializer.pre_serialize',
                'method'   => 'onPreSerialize',
                'format'   => 'json',
                'priority' => 10
            ]
        ];
    }

    public function onPreSerialize(PreSerializeEvent $event): void
    {
        $object = $event->getObject();
        if (gettype($object) !== "object" || !get_class($object)) {
            return;
        }

        $class = get_class($object);
        if (!array_key_exists($class, self::URL_TYPE_CLASS) || null === self::URL_TYPE_CLASS[$class]) {
            return;
        }

        $frontUrl = $this->router->generate(self::URL_TYPE_CLASS[$class], [ "slug" => $object->getSlug() ]);

        if (null === $frontUrl) {
            return;
        }

        $object->frontUrl = $frontUrl;
    }
}