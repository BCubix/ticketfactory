<?php

namespace App\Service\Hook;

use App\Entity\Hook\Hook;
use App\Entity\Module\Module;
use App\Service\ModuleTheme\Service\ModuleService;
use Doctrine\ORM\EntityManagerInterface;

class HookService
{
    private $em;
    private $ms;

    public function __construct(EntityManagerInterface $em, ModuleService $ms)
    {
        $this->em = $em;
        $this->ms = $ms;
    }

    public function register(string $hookName, string $moduleName): void
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            $hook = new Hook();
            $hook->setName($hookName);
        }

        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        $hook->addModule($module);

        $this->em->persist($hook);
        $this->em->flush();
    }

    public function unregister(string $hookName, string $moduleName): void
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            return;
        }

        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        $hook->removeModule($module);

        $this->em->persist($hook);
        $this->em->flush();
    }

    public function exec(string $hookName, array $hookArgs = [])
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            $hook = new Hook();
        }

        $methodName = 'hook' . $hookName;

        $modules = $hook->getModules();
        foreach ($modules as $module) {
            $r = $this->ms->callConfig($module->getName(), $methodName, $hookArgs);
            dd($r);
        }
    }
}