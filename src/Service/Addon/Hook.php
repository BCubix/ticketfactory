<?php

namespace App\Service\Addon;

use App\Manager\ManagerFactory;

use Doctrine\ORM\EntityManagerInterface;
use Twig\Environment;

abstract class Hook
{
    protected $em;
    protected $tg;
    protected $mf;

    public function __construct(EntityManagerInterface $em, Environment $tg, ManagerFactory $mf)
    {
        $this->em = $em;
        $this->tg = $tg;
        $this->mf = $mf;
    }

    public function renderModule(string $path, array $parameters): string
    {
        $path = ('@modules/' . $this->getModuleName() . '/templates/' . $path);

        return $this->tg->render($path, $parameters);
    }

    protected function getModuleName(): string
    {
        $reflected = new \ReflectionObject($this);
        
        $dirname = \dirname($reflected->getFileName());
        
        $moduleName = explode('/', $dirname);
        $moduleIndex = array_search('modules', $moduleName, true);

        if (false !== $moduleIndex) {
            return $moduleName[$moduleIndex + 1];
        }

        return '';
    }
}