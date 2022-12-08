<?php

namespace App\Service\Hook;

use App\Entity\Hook\Hook;
use App\Entity\Module\Module;
use App\Exception\ApiException;
use App\Service\ModuleTheme\Service\ModuleService;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class HookService
{
    private $em;
    private $ms;

    public function __construct(EntityManagerInterface $em, ModuleService $ms)
    {
        $this->em = $em;
        $this->ms = $ms;
    }

    /**
     * Register hook in database: associate hook with module given.
     *
     * @param string $hookName
     * @param string $moduleName
     *
     * @return void
     */
    public function register(string $hookName, string $moduleName): void
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            $hook = new Hook();
            $hook->setName($hookName);
        }

        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module (nom: $moduleName) n'existe pas.");
        }

        $hook->addModule($module);

        $this->em->persist($hook);
        $this->em->flush();
    }

    /**
     * Unregister hook in database: disassociate hook with module given.
     *
     * @param string $hookName
     * @param string $moduleName
     *
     * @return void
     * @throws ApiException
     */
    public function unregister(string $hookName, string $moduleName): void
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le hook (nom: $hookName) n'existe pas.");
        }

        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module (nom: $moduleName) n'existe pas.");
        }

        $hook->removeModule($module);

        $this->em->persist($hook);
        $this->em->flush();
    }

    /**
     * Exec hook: call the same hook function declare in multiple module associate by hook given.
     *
     * @param string $hookName
     * @param array $hookArgs
     *
     * @return void
     * @throws ApiException
     */
    public function exec(string $hookName, array $hookArgs = [])
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le hook (nom: $hookName) n'existe pas.");
        }

        $methodName = 'hook' . $hookName;

        $modules = $hook->getModules();
        foreach ($modules as $module) {
            $this->ms->callConfig($module->getName(), $methodName, $hookArgs, $this);
        }
    }
}