<?php

namespace App\EventSubscriber\Website;

use App\Entity\Technical\Redirection;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Get registered redirections and redirect if router matches
 */
class RedirectionSubscriber implements EventSubscriberInterface
{
    private $em;
    private $websiteHost;

    public function __construct(EntityManagerInterface $em, string $websiteHost)
    {
        $this->em = $em;
        $this->websiteHost = $websiteHost;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['checkRedirections', 5]]
        ];
    }

    public function checkRedirections(RequestEvent $event)
    {
        /*if (!$event->isMainRequest()) {
            return;
        }*/
        
        if ($event->getRequest()->getHost() != $this->websiteHost) {
            return;
        }

        $fromPath = $event->getRequest()->getPathInfo();
        $redirection = $this->em->getRepository(Redirection::class)->findOneForFront($fromPath);
        if (is_null($redirection)) {
            return;
        }

        $response = new RedirectResponse($redirection->getRedirectTo(), $redirection->getRedirectType());
        $event->setResponse($response);
    }
}
