<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Manager\ManagerFactory;
use App\Service\Addon\Hook;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;

class PageHook extends Hook
{
    protected $sc;

    public function __construct(EntityManagerInterface $em, Environment $tg, ManagerFactory $mf, ServiceFactory $sf, RequestStack $rs, Security $sc)
    {
        parent::__construct($em, $tg, $mf, $sf, $rs);

        $this->sc = $sc;
    }

    public function hookPageSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        if ($sObject->getPublicationStatus() === "TO_VALIDATE") {
            $userRoles = $this->sc->getUser()->getRoles();
            if (!in_array("ROLE_PAGE_PUBLISH", $userRoles, true)) {
                $this->mf->get('notification')->createPagePublicationStatusNotification($sObject);
            }
        }

        //$this->mf->get('versionnedEntity')->checkVersionnedEntity($sObject, $iObject);
    }

    public function hookPageInstantiated(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'delete') {
            return;
        }

        $page = $event->getParam('object');
        if (null !== $page->getController()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer cette page car elle est rattaché à une action particulière.');
        }
    }

    public function hookPageValidated(HookEvent $event)
    {
        $vObject = $event->getParam('vObject');

        if ($vObject->getPublicationStatus() === "PUBLISHED") {
            $userRoles = $this->sc->getUser()->getRoles();
            if (!in_array("ROLE_PAGE_PUBLISH", $userRoles, true)) {
                $vObject->setPublicationStatus("TO_VALIDATE");
            }
        }
    }
}
