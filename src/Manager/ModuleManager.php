<?php

namespace App\Manager;

use App\Entity\Module\Module;
use App\Service\ModuleTheme\Service\ModuleService;
use App\Utils\System;

use Doctrine\ORM\EntityManagerInterface;

class ModuleManager extends AbstractManager
{
    private const ACTIONS = [
        Module::ACTION_INSTALL          => 'install',
        Module::ACTION_DISABLE          => 'disable',
        Module::ACTION_UNINSTALL        => 'uninstall',
        Module::ACTION_UNINSTALL_DELETE => 'uninstall',
    ];

    private $ms;

    public function __construct(EntityManagerInterface $em, ModuleService $ms)
    {
        parent::__construct($em);

        $this->ms = $ms;
    }

    /**
     * Update module and execute action
     *
     * @param Module $module
     * @param int $action
     *
     * @return void
     * @throws \Exception
     */
    public function doAction(Module $module, int $action): void
    {
        $moduleName = $module->getName();

        if ($action === Module::ACTION_UNINSTALL_DELETE) {
            $this->em->remove($module);
        } else {
            $module->setActive(!$module->isActive());
            $this->em->persist($module);
        }

        $this->em->flush();

        $this->ms->callConfig($module->getName(), self::ACTIONS[$action]);

        if ($action === Module::ACTION_UNINSTALL_DELETE) {
            System::rmdir($this->ms->getDir() . '/' . $moduleName);
        }

        $this->ms->clear();
    }
}