<?php

namespace App\EventSubscriber\Website;

use App\Manager\ParameterManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;

/**
 * Get maintenance parameters
 * Return Exception if maintenance mode is enabled and ip is not on white list
 */
class MaintenanceSubscriber implements EventSubscriberInterface
{
    private $pm;
    private $twig;

    private const WHITE_LIST_URL = ['admin', '_wdt', '_profiler', '_error'];

    public function __construct(ParameterManager $pm, Environment $twig)
    {
        $this->pm = $pm;
        $this->twig = $twig;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['checkMaintenance', 100]]
        ];
    }

    public function checkMaintenance(RequestEvent $event)
    {
        // We check if the url is in the white list
        $url = $event->getRequest()->getPathInfo();
        if ($this->checkUrl($url)) {
            return;
        }

        // We check if maintenance mode is enabled
        $maintenanceMode = $this->pm->getCoreParameter('maintenance_mode');
        if (!$maintenanceMode) {
            return;
        }

        // We check if client Ip is part of white list
        $maintenanceIp = $this->pm->getCoreParameter('maintenance_ip');
        if (null !== $maintenanceIp && "" !== $maintenanceIp) {
            $clientIp = $event->getRequest()->getClientIp();
            $whiteListIps = array_filter(explode(',', str_replace(' ', '', $maintenanceIp)));

            if (array_search($clientIp, $whiteListIps) !== false) {
                return;
            }
        }

        // We set the response that will be sent with the message, status and the file
        $message = $this->pm->getCoreParameter('maintenance_message') ?? "Site actuellement en maintenance.";
        $response = new Response();
        $response->setStatusCode(503);
        $response->setContent($this->twig->render("bundles/TwigBundle/Exception/error503.html.twig", ['message' => $message]));

        $event->setResponse($response);
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
