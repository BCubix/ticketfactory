<?php

namespace App\Hook;

use App\Entity\Content\ContentType;
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

        $url = $this->mf->get('url')->findOneByKeywordForAdmin("contentType_" . $contentType->getId());
        if (null !== $url) {
            $this->em->remove($url);
            $this->em->flush();
        }
    }

    public function hookContentTypeSaved(HookEvent $event)
    {
        $sObject = $event->getParam('sObject');
        $state = $event->getParam('state');

        if ($sObject->isPageType()) {
            return;
        }

        if ($state !== 'add') {
            $url = $this->mf->get('url')->findOneByKeywordForAdmin("contentType_" . $sObject->getId());
            if (null !== $url) {
                $url->setName("Type de contenu (" . $sObject->getName() . ')');
                $url->setPage($sObject->getPageParent());

                $this->em->persist($url);
                $this->em->flush();

                return;
            }
        }

        $url = new Url();
        $url->setName("Type de contenu (" . $sObject->getName() . ')');
        $url->setSlug("%slug%");
        $url->setKeyword('contentType_' . $sObject->getId());
        $url->setEntity('ContentType');
        $url->setController('App\Controller\Website\ContentController::orchestrator');
        $url->setUrlBuilder('content');
        $url->setPage($sObject->getPageParent());

        $maxPosition = $this->em->getRepository(Url::class)->findMaxPosition() + 1;
        $url->setPosition($maxPosition);

        $this->em->persist($url);
        $this->em->flush();
    }
}
