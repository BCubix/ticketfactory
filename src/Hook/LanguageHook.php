<?php

namespace App\Hook;

use App\Entity\Event\EventCategory;
use App\Event\Admin\HookEvent;
use App\Exception\ApiException;
use App\Manager\LanguageManager;
use App\Manager\EventCategoryManager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class LanguageHook
{
    private $em;
    private $ecm;

    public function __construct(EntityManagerInterface $em, EventCategoryManager $ecm)
    {
        $this->em = $em;
        $this->ecm = $ecm;
    }

    public function hookLanguageSaved(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'add') {
            return;
        }

        $language = $event->getParam('sObject');
        $rootCategory = $this->em->getRepository(EventCategory::class)->findRootCategory();
        $newCategory = $this->ecm->translateCategory($rootCategory, $language->getId());
        $this->em->persist($newCategory);

        /**
         * Ajouter un nouveau menu ??? 
         */

         $this->em->flush();
    }
}
