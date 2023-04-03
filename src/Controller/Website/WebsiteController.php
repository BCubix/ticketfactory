<?php

namespace App\Controller\Website;

use App\Manager\ManagerFactory;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Spatie\Ssr\Renderer;
use Spatie\Ssr\Engines\Node;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

abstract class WebsiteController extends AbstractFOSRestController
{
    protected $em;
    protected $rs;
    protected $mf;
    protected $sf;

    public function __construct(
        EntityManagerInterface $em,
        RequestStack $rs,
        ManagerFactory $mf,
        ServiceFactory $sf
    ) {
        $this->em = $em;
        $this->rs = $rs;
        $this->mf = $mf;
        $this->sf = $sf;
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

        if (!$tm->isSSRActive()) {
            $parameters = array_merge($parameters, ['serverSideRendering' => false]);
            return $this->render($tm->getWebsiteTemplatesPath() . $twigFilename, $parameters);
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
            ->render()
        ;

        $parameters = array_merge($parameters, ['render' => $render, 'serverSideRendering' => true]);
        return $this->render($tm->getWebsiteTemplatesPath() . $twigFilename, $parameters);
    }
}
