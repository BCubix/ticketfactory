<?php

namespace App\Controller\Website;

use App\Manager\ManagerFactory;
use App\Entity\Language\Language;
use App\Entity\User\User;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Spatie\Ssr\Renderer;
use Spatie\Ssr\Engines\Node;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Environment;

abstract class WebsiteController extends AbstractFOSRestController
{
    protected $em;
    protected $rs;
    protected $mf;
    protected $sf;
    protected $tg;
    protected $cache;

    public function __construct(
        EntityManagerInterface $em,
        RequestStack $rs,
        ManagerFactory $mf,
        ServiceFactory $sf,
        Environment $tg,
    ) {
        $this->em = $em;
        $this->rs = $rs;
        $this->mf = $mf;
        $this->sf = $sf;
        $this->tg = $tg;
    }

    protected function getRequest(): Request
    {
        return $this->rs->getMainRequest();
    }

    public function getDefaultLocale(): string
    {
        return $this->em->getRepository(Language::class)->findDefaultForWebsite()->getLocale();
    }

    public function getLocale(): string
    {
        return $this->getRequest()->getLocale();
    }

    public function getDefaultLanguageId(): int
    {
        return $this->em->getRepository(Language::class)->findDefaultForWebsite()->getId();
    }

    public function getLanguageId(): int
    {
        $locale = $this->getLocale();

        $language = $this->em->getRepository(Language::class)->findByLocaleForWebsite($locale);
        if (null !== $language) {
            return $language->getId();
        }

        return $this->getDefaultLanguageId();
    }

    protected function websiteRender(string $twigFilename, array $parameters = []): Response
    {
        $tm = $this->mf->get('theme');
        $parameters = array_merge($parameters, $this->getOtherParameters());

        return $this->render($tm->getWebsiteTemplatesPath() . $twigFilename, $parameters);
    }

    protected function getModulePath(string $moduleName, string $path): string
    {
        $overrideModulePath = $this->mf->get('parameter')->getCoreParameter('main_theme') . '/module/' . $moduleName . '/templates/' . $path;

        if (file_exists($this->sf->get('pathGetter')->getThemesDir() . '/' . $overrideModulePath)) {
            $path = 'Website/' . $overrideModulePath;
        } else {
            $path = ('@modules/' . $moduleName . '/templates/' . $path);
        }

        return $path;
    }

    protected function renderModuleView(string $moduleName, string $path, array $parameters): string
    {
        $path = $this->getModulePath($moduleName, $path);
        $parameters = array_merge($parameters, $this->getOtherParameters());

        return $this->tg->render($path, $parameters);
    }

    protected function renderModule(string $moduleName, string $path, array $parameters): Response
    {
        $path = $this->getModulePath($moduleName, $path);
        $parameters = array_merge($parameters, $this->getOtherParameters());
        $content = $this->tg->render($path, $parameters);

        $response = new Response();
        foreach ($parameters as $v) {
            if ($v instanceof FormInterface && $v->isSubmitted() && !$v->isValid()) {
                $response->setStatusCode(422);
                break;
            }
        }

        $response->setContent($content);

        return $response;
    }

    protected function getOtherParameters(): array
    {
        $modules = $this->mf->get('module')->getAll(['active' => 1]);
        $modulesName = [];

        foreach ($modules['results'] as $module) {
            $modulesName[] = $module['name'];
        }
        $modulesName = implode(",", $modulesName);

        $tm = $this->mf->get('theme');
        if (!$tm->isSSRActive()) {
            return ['serverSideRendering' => false, 'modules' => $modulesName];
        }

        $uri = $this->rs->getMainRequest()->getPathInfo();

        $serverPath = $this->mf->get('theme')->getWebsiteServerPath();
        $engine = new Node('node', $serverPath);
        $renderer = new Renderer($engine);

        $render = $renderer
            ->enabled(true)
            ->debug(true)
            ->context('uri', $uri)
            ->fallback('<div id="app"></div>')
            ->entry($serverPath . "index.js")
            ->render();

        return ['render' => $render, 'serverSideRendering' => true, 'modules' => $modulesName];
    }

    protected function getActiveFilter(): bool
    {
        $userAddress = $this->getRequest()->get('u');
        $userPass = $this->getRequest()->get('t');
        $user = null;

        if (null !== $userAddress && null !== $userPass) {
            $user = $this->em->getRepository(User::class)->getUserByTokenForWebsite($userAddress, $userPass);
        }

        if (null !== $user && in_array("ROLE_ADMIN", $user->getRoles())) {
            return false;
        }

        return true;
    }
}
