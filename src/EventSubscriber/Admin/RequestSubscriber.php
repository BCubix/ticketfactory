<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Hook\Hook;
use App\Manager\HookManager;
use App\Manager\ModuleManager;
use App\Service\File\PathGetter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestSubscriber implements EventSubscriberInterface
{
    private $pg;
    private $em;
    private $mm;
    private $hm;
    private $rs;
    private $container;

    public function __construct(
        PathGetter             $pg,
        EntityManagerInterface $em,
        ModuleManager          $mm,
        HookManager            $hm,
        RequestStack           $rs,
        ContainerInterface     $container
    ) {
        $this->pg = $pg;
        $this->em = $em;
        $this->mm = $mm;
        $this->hm = $hm;
        $this->rs = $rs;

        $this->container = $container;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 10]]
        ];
    }

    public function onKernelRequest(RequestEvent $event)
    {
        if ($event->getRequest() != $this->rs->getMainRequest()) {
            return;
        }

        // Register module hooks
        $hooks = $this->em->getRepository(Hook::class)->findAllHooksForAdmin();
        foreach ($hooks as $hook) {
            $module = $hook->getModule();
            if (null == $module || !$module->isActive()) {
                continue;
            }

            $methodName = ('hook' . ucfirst($hook->getName()));

            $this->hm->register($hook->getName(), $hook->getModule(), $hook->getClassname(), $hook->getPosition());
        }

        // Register system hooks
        $hooksSystem = $this->getAllHookSystem();
        foreach ($hooksSystem as $hookSystem) {
            foreach ($hookSystem['hookMethods'] as $hookMethod) {
                $classname = $hookSystem['hookInstance']::class;
                $this->hm->register($hookMethod, null, $classname);
            }
        }
    }

    private function getAllHookSystem(): array
    {
        $hookSystem = [];

        $hookFilesPath = glob($this->pg->getHooksDir() . '/*');
        foreach ($hookFilesPath as $hookFilePath) {
            // Get classname
            $path = explode('/', $hookFilePath);
            $hookClassName = basename(array_pop($path), '.php');

            // Get instance and hook methods
            $hookInstance = $this->container->get('App\\Hook\\' . $hookClassName);
            $hookMethods = array_filter(get_class_methods($hookInstance), function ($methodName) {
                return str_starts_with($methodName, 'hook');
            });

            // Add in result
            $hookSystem[] = [
                'hookInstance' => $hookInstance,
                'hookMethods'  => $hookMethods,
            ];
        }

        return $hookSystem;
    }
}
