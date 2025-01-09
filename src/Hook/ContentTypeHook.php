<?php

namespace App\Hook;

use App\Entity\Url\Url;
use App\Event\HookEvent;
use App\Service\Addon\Hook;

class ContentTypeHook extends Hook
{

    public function hookContentTypeInstantiated(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'delete') {
            return;
        }

        $contentType = $event->getParam('object');

        $url = $this->mf->get('url')->findOneByKeywordForAdmin("content_" . $contentType->getId());
        if (null !== $url) {
            $this->em->remove($url);
            $this->em->flush();
        }
    }

    public function hookContentTypeSaved(HookEvent $event)
    {
        $sObject = $event->getParam('sObject');
        $state = $event->getParam('state');

        if ($state !== 'add') {
            $url = $this->mf->get('url')->findOneByKeywordForAdmin("content_" . $sObject->getId());
            if (null !== $url) {
                $url->setName("Contenu (" . $sObject->getName() . ')');
                $url->setPage($sObject->getPageParent());

                $this->em->persist($url);
                $this->em->flush();

                return;
            }
        }

        $url = new Url();
        $url->setName("Contenu (" . $sObject->getName() . ')');
        $url->setSlug("%slug%");
        $url->setKeyword('content_' . $sObject->getId());
        $url->setEntity('Content');
        $url->setController('App\Controller\Website\ContentController::orchestrator');
        $url->setManager('content');
        $url->setPage($sObject->getPageParent());

        $maxPosition = $this->em->getRepository(Url::class)->findMaxPosition() + 1;
        $url->setPosition($maxPosition);

        $this->em->persist($url);
        $this->em->flush();
    }
}
