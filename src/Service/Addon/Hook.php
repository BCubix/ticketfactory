<?php

namespace App\Service\Addon;

use App\Manager\ManagerFactory;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Twig\Environment;

abstract class Hook
{
    protected $em;
    protected $tg;
    protected $mf;
    protected $sf;

    public function __construct(EntityManagerInterface $em, Environment $tg, ManagerFactory $mf, ServiceFactory $sf)
    {
        $this->em = $em;
        $this->tg = $tg;
        $this->mf = $mf;
        $this->sf = $sf;
    }

    public function renderModule(string $path, array $parameters): string
    {
        $overrideModulePath = $this->mf->get('parameter')->getCoreParameter('main_theme') . '/module/' . $this->getModuleName() . '/templates/' . $path;

        if (file_exists($this->sf->get('pathGetter')->getThemesDir() . '/' .  $overrideModulePath)) {
            $path = 'Website/' . $overrideModulePath;
        } else {
            $path = ('@modules/' . $this->getModuleName() . '/templates/' . $path);
        }

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
