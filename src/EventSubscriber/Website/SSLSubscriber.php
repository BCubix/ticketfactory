<?php

namespace App\EventSubscriber\Website;

use App\Manager\ManagerFactory;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class SSLSubscriber implements EventSubscriberInterface
{
    private $mf;

    public function __construct(ManagerFactory $mf)
    {
        $this->mf = $mf;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['checkSSL', 5]]
        ];
    }

    public function checkSSL(RequestEvent $event)
    {
        $request = $event->getRequest();
        $isHttps = $request->isSecure();
        $activeSSL = $this->mf->get('parameter')->getCoreParameter('use_ssl');

        if ($isHttps === $activeSSL) {
            return;
        }

        $port = $request->getPort();
        if ($isHttps) {
            $portString = $port !== 443 ? ':' . $port : '';
        } else {
            $portString = $port !== 80 ? ':' . $port : '';
        }

        $url = ($isHttps ? "http://" : "https://") . $request->getHost() . $portString . $request->getRequestUri();

        $response  = new RedirectResponse($url);
        $event->setResponse($response);
    }
}