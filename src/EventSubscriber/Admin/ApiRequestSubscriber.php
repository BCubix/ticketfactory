<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Module\Module;
use App\Service\Hook\HookService;
use App\Service\ModuleTheme\Service\ModuleService;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ApiRequestSubscriber implements EventSubscriberInterface
{
    private $hs;
    private $em;
    private $ms;

    public function __construct(EntityManagerInterface $em, HookService $hs, ModuleService $ms)
    {
        $this->em = $em;
        $this->hs = $hs;
        $this->ms = $ms;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 10]]
        ];
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $modules = $this->em->getRepository(Module::class)->findAllForAdmin(['active' => true]);
        foreach ($modules['results'] as $module) {
            $this->ms->callConfig($module->getName(), 'hook', [true], $this->hs);
        }
    }
}