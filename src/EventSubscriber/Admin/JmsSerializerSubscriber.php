<?php

namespace App\EventSubscriber\Admin;

use JMS\Serializer\EventDispatcher\Events;
use JMS\Serializer\EventDispatcher\EventSubscriberInterface;
use JMS\Serializer\EventDispatcher\PreSerializeEvent;
use Symfony\Component\Security\Core\Security;
use Vich\UploaderBundle\Exception\MappingNotFoundException;
use Vich\UploaderBundle\Metadata\MetadataReader;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;
use Vich\UploaderBundle\Util\ClassUtils;

class JmsSerializerSubscriber implements EventSubscriberInterface
{
    /** @var MetadataReader */
    private $metadata;

    /** @var UploaderHelper */
    private $helper;

    /** @var string */
    private $remoteFileUrl;

    /** @var Security */
    private $security;

    public function __construct(
        MetadataReader $metadata,
        UploaderHelper $helper,
        Security $security,
        string $remoteFileUrl
    ) {
        $this->metadata = $metadata;
        $this->helper = $helper;
        $this->remoteFileUrl = $remoteFileUrl;
        $this->security = $security;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            Events::PRE_SERIALIZE => [
                'event' => Events::PRE_SERIALIZE,
                'method' => 'onPreSerialize',
                'format' => 'json',
                'priority' => 10
            ]
        ];
    }

    /**
     * @param PreSerializeEvent $event
     */
    public function onPreSerialize(PreSerializeEvent $event)
    {
        $object = $event->getObject();
        if (gettype($object) != "object" || !get_class($object)) {
            return;
       	}

        $this->transformAbsoluteUrls($object);
    }

    private function transformAbsoluteUrls($object) {
        try {
            $fields = $this->metadata->getUploadableFields(ClassUtils::getClass($object));
        } catch (MappingNotFoundException $e) {
            return;
        }

        foreach ($fields as $field) {
            $filePath = $this->helper->asset($object, $field['propertyName']);
            $setterName = ('set' . ucfirst($field['fileNameProperty']));

            if (!empty($filePath) && strpos($filePath, $this->remoteFileUrl) === false) {
                $object->$setterName($this->remoteFileUrl . '/uploads' . $filePath);
            }
        }
    }
}
