<?php

namespace App\Manager;

use App\Entity\Hook\Hook;
use App\Service\ModuleTheme\Service\ModuleService;
use Doctrine\ORM\EntityManagerInterface;

class HookManager extends AbstractManager
{
    private $ms;

    public function __construct(EntityManagerInterface $em, ModuleService $ms)
    {
        parent::__construct($em);

        $this->ms = $ms;
    }

    /**
     * Get all modules by hook and sort by position for each hook
     *
     * @return array
     */
    public function getAllModulesByHook(): array
    {
        $result = $this->getAllModulesByHookList();
        $this->sortByPosition($result);

        return $result;
    }

    /**
     * Disable hook : update position of module in the same hook
     *
     * @param Hook $removeHook
     *
     * @return void
     */
    public function disableHook(Hook $removeHook): void
    {
        $removeHookPosition = $removeHook->getPosition();

        $hooks = $this->em->getRepository(Hook::class)->findAllByNameForAdmin($removeHook->getName());
        foreach ($hooks as $hook) {
            $position = $hook->getPosition();
            if ($position > $removeHookPosition) {
                $hook->setPosition($position - 1);
                $this->em->persist($hook);
            }
        }

        $this->em->remove($removeHook);
    }

    /**
     * Update hook: Change the src hook position to the dest position
     * Update position of module in the same hook
     *
     * @param array $hooks Same name, different module
     * @param int $srcPosition
     * @param int $destPosition
     *
     * @return void
     */
    public function updateHook(array $hooks, int $srcPosition, int $destPosition): void
    {
        if ($srcPosition > $destPosition) {
            for ($i = $destPosition; $i < $srcPosition; ++$i) {
                $hooks[$i]->setPosition($i + 1);
                $this->em->persist($hooks[$i]);
            }
        } else {
            for ($i = $srcPosition + 1; $i < $destPosition + 1; ++$i) {
                $hooks[$i]->setPosition($i - 1);
                $this->em->persist($hooks[$i]);
            }
        }
        $hooks[$srcPosition]->setPosition($destPosition);
        $this->em->persist($hooks[$srcPosition]);
    }

    /**
     * Get all modules by hook
     *
     * @return array
     */
    private function getAllModulesByHookList(): array
    {
        $result = [];

        $modules = $this->ms->getAllInDisk();
        $hooks = $this->em->getRepository(Hook::class)->findAllHooksForAdmin();

        foreach ($hooks as $hook) {
            // Get index of hook with same name in array result
            for ($i = 0; $i < count($result); ++$i) {
                if ($result[$i]['name'] === $hook->getName()) {
                    break;
                }
            }

            // Create new hook list
            if ($i === count($result)) {
                $result[] = [
                    'name' => $hook->getName(),
                    'modules' => [],
                ];
            }

            $module = $hook->getModule();
            if (null !== $module) {
                $moduleName = $module->getName();

                // Search config of the module
                $moduleConfigArray = array_filter($modules, function ($moduleInfos) use ($moduleName) {
                    return $moduleInfos['name'] === $moduleName;
                });

                // Add module in the hook list
                // (Must be count($r) === 1 so we can use array_pop)
                $result[$i]['modules'][] = [
                    ...array_pop($moduleConfigArray),  // all module config (name, displayName, ...)
                    'position' => $hook->getPosition()        // position of the module in the hook
                ];
            }
        }

        return $result;
    }

    /**
     * Sort hooks list by position in each hook
     *
     * @param array $result
     *
     * @return void
     */
    private function sortByPosition(array &$result): void
    {
        for ($i = 0; $i < count($result); ++$i) {
            usort($result[$i]['modules'], function ($a, $b) {
                if ($a['position'] === $b['position']) {
                    return 0;
                }
                return $a['position'] < $b['position'] ? -1 : 1;
            });
        }
    }
}