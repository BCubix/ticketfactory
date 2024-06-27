<?php

namespace App\Service\Url;

use App\Entity\Content\Content;
use App\Entity\Page\Page;
use App\Manager\EventManager;
use App\Manager\ManagerFactory;
use App\Manager\PageManager;
use App\Manager\ParameterManager;
use App\Service\ServiceFactory;

use Doctrine\Common\Util\ClassUtils;
use Symfony\Component\Routing\RouterInterface;

class UrlService
{
    public const SERVICE_NAME = 'urlService';

    protected $em;
    protected $mf;
    protected $pam;
    protected $prm;
    protected $router;
    protected $rs;
    protected $sf;

    public function __construct(EventManager $em, PageManager $pam, ParameterManager $prm, RouterInterface $router, ManagerFactory $mf, ServiceFactory $sf)
    {
        $this->em = $em;
        $this->mf = $mf;
        $this->pam = $pam;
        $this->prm = $prm;
        $this->router = $router;
        $this->sf = $sf;
    }

    public function generateUrl(string $key, ?array $options = [], int $absolute = RouterInterface::ABSOLUTE_PATH): string
    {
        $url = $this->router->generate($key, $options, $absolute);

        return $url;
    }

    public function keywordPath(string $keyword, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        $element = $this->pam->getByKeyword($keyword);
        if (null === $element) {
            throw new \Exception('There is no page with this keyword.');
        }

        return $this->tfPath($element, $parameters, $absolute);
    }

    public function tfPath(mixed $element, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        if (null === $element) {
            return '';
        }

        if (gettype($element) === 'string') {
            return $this->keywordElementPath($element, $parameters, $absolute);
        }

        $class = ClassUtils::getClass($element);
        if ($class === Page::class) {
            return $this->pagePath($element, $parameters, $absolute);
        }

        if ($class === Content::class) {
            return $this->contentPath($element, $parameters, $absolute);
        }

        $class = explode('\\', $class);
        $class = array_pop($class);
        $urlFormat = $this->mf->get('url')->findOneByEntityForWebsite($class);

        if (null === $urlFormat) {
            return "";
        }

        return $this->mf->get($urlFormat->getManager())->buildUrl($element, $urlFormat, $parameters, $absolute);
    }

    public function keywordElementPath(string $keyword, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        $urlFormat = $this->mf->get('url')->findOneByKeywordForWebsite($keyword);
        if (null === $urlFormat) {
            return $this->keywordPath($keyword, $parameters, $absolute);
        }

        return $this->mf->get($urlFormat->getManager())->buildUrlFromKeyword($urlFormat, $parameters, $absolute);
    }

    public function pagePath(Page $page, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        $parameters["_locale"] = $page->getLang()->getLocale();
        $slugs = [];

        while ($page !== null) {
            $slugs[] = $page->getSlug();
            $page = $page->getParent();
        }

        $slugs = array_reverse($slugs);

        return $this->generateFromMainSlugs($slugs, $parameters, $absolute);
    }

    public function contentPath(Content $content, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        $parameters["_locale"] = $content->getLang()->getLocale();

        $urlFormat = $this->mf->get('url')->findOneByKeywordForWebsite('content_' . $content->getContentType()->getId());
        if (null === $urlFormat) {
            return "";
        }

        return $this->mf->get($urlFormat->getManager())->buildUrl($content, $urlFormat, $parameters, $absolute);
    }

    private function generateFromMainSlugs(array $slugs, array $parameters, $absolute)
    {
        $slugs = array_filter($slugs, function ($value) {
            return !empty($value);
        });

        $slugs = ['slugs' => implode('/', $slugs)];
        $slugs = array_merge($slugs, $parameters);

        return $this->router->generate('tf_website_global', $slugs, $absolute);
    }

    public function getMainPageBySlugArray(array $slugs)
    {

        $mainPage = null;

        foreach ($slugs as $slug) {
            $page = $this->mf->get('page')->getBySlug($slug);
            if (null === $page) {
                break;
            }

            if (null === $mainPage || (null !== $page->getParent() && $page->getParent()->getId() === $mainPage->getId())) {
                $mainPage = $page;
                array_shift($slugs);
            }
        }

        return ($mainPage);
    }
}
