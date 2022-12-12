<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Entity\Module\Module;
use App\Entity\User\User;
use App\Hook\EventCategoryHook;
use App\Hook\RoomHook;
use App\Hook\SeasonHook;
use App\Hook\UserHook;
use App\Service\Hook\HookService;
use App\Service\ModuleTheme\Service\ModuleService;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestSubscriber implements EventSubscriberInterface
{
    private $em;
    private $ms;
    private $hs;
    private $ech;
    private $rh;
    private $sh;
    private $uh;

    public function __construct(
        EntityManagerInterface $em,
        ModuleService $ms,
        HookService $hs,
        EventCategoryHook $ech,
        RoomHook $rh,
        SeasonHook $sh,
        UserHook $uh
    ) {
        $this->em = $em;
        $this->ms = $ms;
        $this->hs = $hs;

        $this->ech = $ech;
        $this->rh = $rh;
        $this->sh = $sh;
        $this->uh = $uh;
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
            $moduleConfig = $this->ms->getModuleConfigInstance($module->getName(), $this->hs);
            foreach ($module->getHooks() as $hook) {
                $this->hs->register($hook->getName(), $moduleConfig);
            }
        }

        $hookSystem = [
            'instantiated' => [
                EventCategory::class => [ $this->ech, 'onEventCategoryInstantiate' ],
                Room::class          => [ $this->rh,  'onRoomInstantiate' ],
                SeasonHook::class    => [ $this->sh,  'onSeasonInstantiate' ],
                User::class          => [ $this->uh,  'onUserInstantiate' ],
            ],
            'validated'   => [
                User::class          => [ $this->uh, 'onUserValidate' ],
            ],
        ];

        foreach ($hookSystem as $name => $hooks) {
            foreach ($hooks as $class => $listener) {
                $this->hs->registerHook($name . '.' . $class, $listener);
            }
        }
    }
}