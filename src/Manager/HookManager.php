<?php

namespace App\Manager;

use App\Entity\Hook\Hook;

use Doctrine\ORM\EntityManagerInterface;

class HookManager extends AbstractManager
{
    private $mm;

    public function __construct(EntityManagerInterface $em, ModuleManager2 $mm)
    {
        parent::__construct($em);

        $this->mm = $mm;
    }

    /**
     * Get all modules by hook sorted by position for each hook
     *
     * Example :
     *    [
     *        [
     *            'name'    => 'hookName1',
     *            'modules' => [
     *                [
     *                    'name'        => 'moduleName1',
     *                    'displayName' => 'Nom d'affichage du module',
     *                    'description' => 'Description du module',
     *                    'author'      => 'Nom d'auteur',
     *                    'version'     => '1.0.0',
     *                    'position'    => 0
     *                ],
     *                ...
     *            ],
     *        ],
     *        ...
     *    ];
     *
     * @return array
     */
    public function getAllModulesByHook(): array
    {
        $result = [];

        $modules = $this->mm->getAllInDisk();
        $hooks = $this->em->getRepository(Hook::class)->findAllHooksForAdmin();

        $hookName = null;
        $indexResult = -1;
        foreach ($hooks as $hook) {
            $module = $hook->getModule();
            if (null === $module) {
                continue;
            }

            if ($hookName !== $hook->getName()) {
                $hookName = $hook->getName();

                $indexResult++;
                $result[] = [
                    'name' => $hookName,
                    'modules' => [],
                ];
            }

            $moduleName = $module->getName();
            // Search config of the module
            $moduleConfigArray = array_filter($modules, function ($moduleInfos) use ($moduleName) {
                return $moduleInfos['name'] === $moduleName;
            });

            // Add module in the hook list
            // (Must be count($r) === 1 so we can use array_pop)
            $result[$indexResult]['modules'][] = [
                ...array_pop($moduleConfigArray),  // all module config (name, displayName, ...)
                'position' => $hook->getPosition()        // position of the module in the hook
            ];
        }

        return $result;
    }

    /**
     * Disable hook : down all hook position after the removeHook
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
            // Up position all hook between dest include to src exclude
            for ($i = $destPosition; $i < $srcPosition; ++$i) {
                $hooks[$i]->setPosition($i + 1);
                $this->em->persist($hooks[$i]);
            }
        } else {
            // Down position of all hook between src exclude to dest include
            for ($i = $srcPosition + 1; $i < $destPosition + 1; ++$i) {
                $hooks[$i]->setPosition($i - 1);
                $this->em->persist($hooks[$i]);
            }
        }

        // Update new position of the src hook
        $hooks[$srcPosition]->setPosition($destPosition);
        $this->em->persist($hooks[$srcPosition]);
    }
}