<?php

namespace App\Manager;

use App\Entity\Hook\Hook;
use App\Entity\Addon\Module as ModuleEntity;
use App\Entity\Language\Language;
use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Kernel;
use App\Manager\ManagerFactory;
use App\Service\Addon\Module;
use App\Service\Addon\Hook as HookConfig;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class HookManager extends AbstractManager
{
    public const SERVICE_NAME = 'hook';

    protected $ed;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        EventDispatcherInterface $ed
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->ed = $ed;
    }

    public function getAllModulesByHook(): array
    {
        $result = [];

        $modules = $this->mf->get('module')->getAllInDisk();
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
            for ($i = ($srcPosition + 1); $i < ($destPosition + 1); ++$i) {
                $hooks[$i]->setPosition($i - 1);
                $this->em->persist($hooks[$i]);
            }
        }

        // Update new position of the src hook
        $hooks[$srcPosition]->setPosition($destPosition);
        $this->em->persist($hooks[$srcPosition]);
    }

    /**
     * Register hook
     *
     * @param string $hookName
     * @param mixed $classInstance
     * @param int|null $position
     *
     * @return void
     * @throws ApiException
     */
    public function register(string $hookName, ?ModuleEntity $module, string $classname, ?int $position = null): void
    {
        $hook = $this->getHook($hookName, $module);
        if (null === $hook) {
            if ($position === null) {
                $position = $this->getPosition($hookName);
            }

            // Register new hook in database
            $hook = new Hook();
            $hook->setName($hookName);
            $hook->setPosition($position);
            $hook->setModule($module);
            $hook->setClassname($classname);

            $this->em->persist($hook);
            $this->em->flush();
        }

        $classInstance = $this->kl->getContainer()->get($classname);
        $methodName = ('hook' . ucfirst($hook->getName()));

        $this->ed->addListener($hookName, [$classInstance, $methodName]);
    }

    /**
     * Unregister hook
     *
     * @param string $hookName
     * @param mixed $classInstance
     *
     * @return void
     * @throws ApiException
     */
    public function unregister(string $hookName, mixed $classInstance): void
    {
        $hook = $this->getHook($hookName, $classInstance);
        if (null !== $hook) {
            $this->em->remove($hook);
            $this->em->flush();
        }

        $this->ed->removeListener($hookName, [$classInstance, $hookName]);
    }

    /**
     * Get hook according to the instance
     *
     * @param string $hookName
     * @param mixed $classInstance
     * @param Module|null $module
     *
     * @return Hook|null
     * @throws ApiException
     */
    private function getHook(string $hookName, ?ModuleEntity $module): ?Hook
    {
        if (null === $module) {
            return $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        }

        return $this->em->getRepository(Hook::class)->findOneByNameAndModuleNameForAdmin($hookName, $module->getName());
    }

    /**
     * Get the position of hook when add in list
     *
     * @param string $hookName
     *
     * @return int
     */
    public function getPosition(string $hookName): int
    {
        $hooks = $this->em->getRepository(Hook::class)->findAllByNameForAdmin($hookName);
        if ($hooks) {
            $lastHook = array_pop($hooks);

            return $lastHook->getPosition() + 1;
        }

        return 0;
    }

    /**
     * Exec hook: dispatch the hook event with parameters to all registered listeners.
     *
     * @param string $hookName
     * @param array $hookArgs
     *
     * @return void
     */
    public function exec(string $hookName, array $hookArgs = []): HookEvent
    {
        $locale = $this->rs->getMainRequest()->getLocale();
        $language = $this->em->getRepository(Language::class)->findByLocaleForWebsite($locale);

        $hookArgs = array_merge(['languageId' => $language->getId()], $hookArgs);
        $event = new HookEvent($hookArgs);

        return $this->ed->dispatch($event, $hookName);
    }
}
