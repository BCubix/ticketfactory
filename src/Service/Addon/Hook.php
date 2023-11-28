<?php

namespace App\Service\Addon;

use App\Controller\Website\RouterController;
use App\Manager\ManagerFactory;
use App\Service\PageContext\PageContext;
use App\Service\ServiceFactory;

use App\Service\Url\UrlService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Environment;

abstract class Hook
{
    protected $em;
    protected $rs;
    protected $us;
    protected $tg;
    protected $mf;
    protected $sf;
    protected $data;


    public function __construct(EntityManagerInterface $em, Environment $tg, ManagerFactory $mf, ServiceFactory $sf, RequestStack $rs, UrlService $us)
    {
        $this->em = $em;
        $this->rs = $rs;
        $this->us = $us;
        $this->tg = $tg;
        $this->mf = $mf;
        $this->sf = $sf;
    }

    public function renderModule(string $path, array $parameters): string
    {
        $overrideModulePath = $this->mf->get('parameter')->getCoreParameter('main_theme') . '/module/' . $this->getModuleName() . '/templates/' . $path;

        if (file_exists($this->sf->get('pathGetter')->getThemesDir() . '/' . $overrideModulePath)) {
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
    public function setData($data)
    {
        $this->data = $data;
    }

    public function getPage()
    {
        $request = $this->rs->getMainRequest();
        $currentPageSlug = preg_replace('/^\//', '', $request->getRequestUri(), 1);

        $slugs = explode('/', $currentPageSlug);
        array_filter($slugs, function ($value) {
            return !empty($value);
        });
        $mainPage = $this->us->getPageBySlugArray($slugs);
        return ($mainPage);
    }
}