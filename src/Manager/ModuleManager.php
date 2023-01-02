<?php

namespace App\Manager;

use App\Entity\Module\Module;
use App\Exception\ApiException;
use App\Service\Hook\HookService;
use App\Service\ModuleTheme\Service\ModuleService;

use App\Utils\Exec;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;

class ModuleManager extends AbstractManager
{
    private const ACTIONS = [
        Module::ACTION_INSTALL          => 'install',
        Module::ACTION_DISABLE          => 'disable',
        Module::ACTION_UNINSTALL        => 'uninstall',
        Module::ACTION_UNINSTALL_DELETE => 'uninstall',
    ];

    private $fs;
    private $ms;
    private $hs;

    public function __construct(EntityManagerInterface $em, Filesystem $fs, ModuleService $ms, HookService $hs)
    {
        parent::__construct($em);

        $this->fs = $fs;
        $this->ms = $ms;
        $this->hs = $hs;
    }

    /**
     * Create new module
     *
     * @param string $name
     * @param bool $clear
     * @return Module
     */
    public function createNewModule(string $name, bool $actionAndClear = true): Module
    {
        $module = new Module();
        $module->setActive(true);
        $module->setName($name);

        $this->em->persist($module);
        $this->em->flush();
        $this->em->getConnection()->commit();

        if ($actionAndClear) {
            $this->ms->callConfig($name, 'install', [], $this->hs);

            $this->ms->clear();
            Exec::exec('yarn run encore production');
        }

        return $module;
    }

    /**
     * Update module and execute action
     *
     * @param Module $module
     * @param int $action
     * @param bool $clear
     *
     * @return void
     * @throws ApiException
     * @throws IOException
     */
    public function doAction(Module $module, int $action, bool $clear = true): void
    {
        $moduleName = $module->getName();

        if ($action === Module::ACTION_UNINSTALL_DELETE) {
            $this->em->remove($module);
        } else {
            $module->setActive($action === Module::ACTION_INSTALL);
            $this->em->persist($module);
        }

        $this->em->flush();
        $this->em->getConnection()->commit();

        $this->ms->callConfig($module->getName(), self::ACTIONS[$action], [], $this->hs);

        if ($action === Module::ACTION_UNINSTALL_DELETE) {
            $this->fs->remove($this->ms->getDir() . '/' . $moduleName);
        }

        if ($clear) {
            $this->ms->clear();
        }
    }
}