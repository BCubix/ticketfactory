<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Service\Addon\Hook;
use App\Manager\ManagerFactory;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Environment;

class ContentHook extends Hook
{
    protected $sc;

    public function __construct(EntityManagerInterface $em, Environment $tg, ManagerFactory $mf, ServiceFactory $sf, RequestStack $rs, Security $sc)
    {
        parent::__construct($em, $tg, $mf, $sf, $rs);

        $this->sc = $sc;
    }

    public function hookContentValidated(HookEvent $event)
    {
        $vObject = $event->getParam('vObject');

        if ($vObject->getPublicationStatus() === "PUBLISHED") {
            $userRoles = $this->sc->getUser()->getRoles();
            if (!in_array("ROLE_CONTENT_PUBLISH", $userRoles, true)) {
                $vObject->setPublicationStatus("TO_VALIDATE");
            }
        }
    }

    public function hookContentSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        if ($sObject->getPublicationStatus() === "TO_VALIDATE") {
            $userRoles = $this->sc->getUser()->getRoles();
            if (!in_array("ROLE_CONTENT_PUBLISH", $userRoles, true)) {
                $this->mf->get('notification')->createContentPublicationStatusNotification($sObject);
            }
        }

        $this->mf->get('versionnedEntity')->checkVersionnedEntity($sObject, $iObject);
    }
}
