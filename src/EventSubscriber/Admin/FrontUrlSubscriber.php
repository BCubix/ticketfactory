<?php

namespace App\EventSubscriber\Admin;

use App\Service\ServiceFactory;

use Symfony\Component\Security\Core\Security;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

use JMS\Serializer\EventDispatcher\EventSubscriberInterface;
use JMS\Serializer\EventDispatcher\PreSerializeEvent;

class FrontUrlSubscriber implements EventSubscriberInterface
{
    protected const URL_TYPE_CLASS = [
        "App\Entity\Content\Content" => false,
        "App\Entity\Event\Event" => true,
        "App\Entity\Event\EventCategory" => false,
        "App\Entity\Event\Room" => false,
        "App\Entity\Event\Season" => false,
        "App\Entity\Page\Page" => true,
    ];

    protected $sf;
    protected $security;

    public function __construct(private UrlGeneratorInterface $router, Security $security, ServiceFactory $sf)
    {
        $this->sf = $sf;
        $this->security = $security;
    }

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
        if (!array_key_exists($class, self::URL_TYPE_CLASS) || false === self::URL_TYPE_CLASS[$class]) {
            return;
        }
        
        $user = $this->security->getUser();
        $locale = $object->getLang()->getLocale();
        $frontUrl = $this->sf->get('urlService')->tfPath($object, ['u' => $user->getEmail(), 't' => substr($user->getPassword(), -8), '_locale' => $locale], RouterInterface::ABSOLUTE_PATH);

        if (null === $frontUrl) {
            return;
        }

        $object->frontUrl = $frontUrl;
    }
}