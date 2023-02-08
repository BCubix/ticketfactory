<?php

namespace App\Controller\Website;

use App\Manager\ThemeManager;
use App\Service\Hook\HookService;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Spatie\Ssr\Renderer;
use Spatie\Ssr\Engines\Node;


abstract class WebsiteController extends AbstractFOSRestController
{
    protected $em;
    protected $hs;
    protected $tm;

    public function __construct(EntityManagerInterface $em, HookService $hs, ThemeManager $tm)
    {
        $this->em = $em;
        $this->hs = $hs;
        $this->tm = $tm;
    }

    protected function websiteRender(string $twigFilename, Request $request): Response
    {
        if ($this->tm->getIsServerSide()) {
            $uri = $request->getPathInfo();

            $engine = new Node('node', $this->tm->getWebsiteServerPath());
            $renderer = new Renderer($engine);

            $render = $renderer
                ->enabled(true)
                ->debug(true)
                ->context('uri', $uri)
                ->fallback('<div id="app"></div>')
                ->entry($this->tm->getWebsiteServerPath() . "index.js")
                ->render()
            ;

            return $this->render($this->tm->getWebsiteTemplatesPath() . $twigFilename, [ 'render' => $render, 'serverSideRendering' => true ]);
        } else {
            return $this->render($this->tm->getWebsiteTemplatesPath() . $twigFilename, [ 'serverSideRendering' => false ]);
        }
    }
}
