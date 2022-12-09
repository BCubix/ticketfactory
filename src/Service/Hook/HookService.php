<?php

namespace App\Service\Hook;

use App\Entity\Hook\Hook;
use App\Entity\Module\Module;
use App\Event\Admin\HookEvent;
use App\Exception\ApiException;
use App\Service\ModuleTheme\Config\ModuleConfig;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;

class HookService
{
    private $ed;
    private $em;

    public function __construct(EventDispatcherInterface $ed, EntityManagerInterface $em)
    {
        $this->ed = $ed;
        $this->em = $em;
    }

    /**
     * Register hook in database: associate hook with module given.
     *
     * @param string $hookName
     * @param ModuleConfig $moduleConfig
     *
     * @return void
     * @throws ApiException
     */
    public function register(string $hookName, ModuleConfig $moduleConfig): void
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            $hook = new Hook();
            $hook->setName($hookName);
        }

        $moduleName = $moduleConfig->getInfo()['name'];
        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module (nom: $moduleName) n'existe pas.");
        }

        $hook->addModule($module);

        $this->em->persist($hook);
        $this->em->flush();

        $this->ed->addListener('hook' . $hookName, [$moduleConfig, 'hook' . $hookName]);
    }

    /**
     * Unregister hook in database: disassociate hook with module given.
     *
     * @param string $hookName
     * @param ModuleConfig $moduleConfig
     *
     * @return void
     * @throws ApiException
     */
    public function unregister(string $hookName, ModuleConfig $moduleConfig): void
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le hook (nom: $hookName) n'existe pas.");
        }

        $moduleName = $moduleConfig->getInfo()['name'];
        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module (nom: $moduleName) n'existe pas.");
        }

        $hook->removeModule($module);

        $this->em->persist($hook);
        $this->em->flush();

        $this->ed->removeListener('hook' . $hookName, [$moduleConfig, 'hook' . $hookName]);
    }

    /**
     * Exec hook: dispatch the hook event with parameters to all registered listeners.
     *
     * @param string $hookName
     * @param array $hookArgs
     *
     * @return void
     */
    public function exec(string $hookName, array $hookArgs = []): void
    {
        $event = new HookEvent($hookArgs);
        $this->ed->dispatch($event, 'hook' . $hookName);
    }
}