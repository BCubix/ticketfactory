<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Event\Tag;
use App\Service\Sort\EventSorter;

class TagController extends WebsiteController
{
    public function index(Page $page, array $slugs)
    {
        if (isset($slugs[0]) && $page->getSlug() === $slugs[0]) {
            array_shift($slugs);
        }

        if (count($slugs) !== 1) {
            throw $this->createNotFoundException('This tag does not exist.');
        }

        $tag = $this->em->getRepository(Tag::class)->findBySlugForWebsite($this->getLanguageId(), $slugs[0]);
        if (null === $tag) {
            throw $this->createNotFoundException('This tag does not exist.');
        }

        $events = EventSorter::sortEvents($tag->getEvents()->toArray());

        return $this->websiteRender('Tag/index.html.twig', [
            'page'    => $page,
            'tag'     => $tag,
            'events'  => $events
        ]);
    }

    public function list(Page $page) {
        $request = $this->getRequest();

        $displayTags = $this->mf->get("parameter")->getCoreParameter("display_tags");
        if (!$displayTags) {
            throw $this->createNotFoundException('This page does not exist.');
        }

        $tags = $this->em->getRepository(Tag::class)->findAllForWebsite($this->getLanguageId());
        
        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        $template = 'Tag/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'page'               => $page,
            'tags'               => $tags,
            'pageContent'        => $pageContent,
        ]);
    }
}
