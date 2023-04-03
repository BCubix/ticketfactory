<?php

namespace App\Service\Url;

use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Entity\Event\Season;
use App\Entity\Page\Page;
use App\Manager\EventManager;
use App\Manager\PageManager;
use App\Manager\ParameterManager;

use Doctrine\Common\Util\ClassUtils;
use Symfony\Component\Routing\RouterInterface;

class UrlService
{
    public const SERVICE_NAME = 'urlService';

    protected $em;
    protected $pam;
    protected $prm;
    protected $router;

    public function __construct(EventManager $em, PageManager $pam, ParameterManager $prm, RouterInterface $router)
    {
        $this->em = $em;
        $this->pam = $pam;
        $this->prm = $prm;
        $this->router = $router;
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
        switch (ClassUtils::getClass($element)) {
            case EventCategory::class:
            case Season::class:
            case Room::class:
                return $this->eventRelativePath($element, $parameters, $absolute);

            case Event::class:
                return $this->eventPath($element, $parameters, $absolute);

            case Page::class:
                return $this->pagePath($element, $parameters, $absolute);

            default:
                return '';
        }
    }

    public function eventRelativePath(Object $object, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        $slugs = [];
        $slugs[] = $object->getSlug();

        $keyword = ClassUtils::getClass($object);
        $keyword = explode('\\', $keyword);
        $keyword = array_pop($keyword);
        $keyword = lcfirst($keyword);

        $page = $this->prm->get('page_' . $keyword);
        while ($page !== null) {
            $slugs[] = $page->getSlug();
            $page = $page->getParent();
        }

        return $this->generateFromMainSlugs($slugs, $parameters, $absolute);
    }

    public function eventPath(Event $event, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        $slugs = $this->mf->get('event')->getUrlSlugs($event);

        $page = $this->prm->get('page_event');
        while ($page !== null) {
            $slugs[] = $page->getSlug();
            $page = $page->getParent();
        }

        return $this->generateFromMainSlugs($slugs, $parameters, $absolute);
    }

    public function pagePath(Page $page, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        $slugs = [];
        while ($page !== null) {
            $slugs[] = $page->getSlug();
            $page = $page->getParent();
        }

        return $this->generateFromMainSlugs($slugs, $parameters, $absolute);
    }

    private function generateFromMainSlugs(array $slugs, array $parameters, $absolute)
    {
        $slugs = array_reverse($slugs);
        $slugs = array_filter($slugs, function($value) {
            return !empty($value);
        });

        $slugs = ['slugs' => implode('/', $slugs)];
        $slugs = array_merge($slugs, $parameters);

        return $this->router->generate('tf_website_global', $slugs, $absolute);
    }
}
