<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Module\Module;
use App\Service\Hook\HookService;
use App\Service\ModuleTheme\Service\ModuleService;
use App\Utils\PathGetter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestSubscriber implements EventSubscriberInterface
{
    private $pg;
    private $em;
    private $ms;
    private $hs;
    private $container;

    public function __construct(
        PathGetter $pg,
        EntityManagerInterface $em,
        ModuleService $ms,
        HookService $hs,
        ContainerInterface $container
    ) {
        $this->pg = $pg;
        $this->em = $em;
        $this->ms = $ms;
        $this->hs = $hs;

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
        // Register hook module
        $modules = $this->em->getRepository(Module::class)->findAllForAdmin(['active' => true]);
        foreach ($modules['results'] as $module) {
            $moduleConfig = $this->ms->getModuleConfigInstance($module->getName(), $this->hs);
            foreach ($module->getHooks() as $hook) {
                $this->hs->register($hook->getName(), $moduleConfig);
            }
        }

        // Register hook system
        $hooksSystem = $this->getAllHookSystem();
        foreach ($hooksSystem as $hookSystem) {
            $hookInstance = $hookSystem['hookInstance'];

            foreach ($hookSystem['hookMethods'] as $hookMethod) {
                $this->hs->registerHook($hookMethod, $hookInstance);
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