<?php

namespace App\EventSubscriber\Website;

use App\Manager\ManagerFactory;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class VisitorLogSubscriber implements EventSubscriberInterface
{
    private const WHITE_LIST_URL = ['admin', '_wdt', '_profiler', '_error'];

    private $mf;

    public function __construct(ManagerFactory $mf)
    {
        $this->mf = $mf;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['addLog', 5]]
        ];
    }

    public function addLog(RequestEvent $event)
    {
        if (!$event->isMainRequest()) {
            return;
        }
        
        // We check if the url is in the white list
        $url =  $event->getRequest()->getPathInfo();
        if ($this->checkUrl($url)) {
            return;
        }
         
        $clientIp = $event->getRequest()->getClientIp();
        $this->mf->get('requestsLog')->createNewRequest($clientIp, $url);
    }
    
    private function checkUrl(string $url): bool
    {
        // We explode url to get the first part
        $slugs = array_filter(explode('/', $url));
        if (count($slugs) === 0) {
            return false;
        }

        // We check if the first part of url is in the white list
        if (array_search(array_values($slugs)[0], self::WHITE_LIST_URL) !== false) {
            return true;
        }

        return false;
    }
}