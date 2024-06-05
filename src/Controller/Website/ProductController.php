<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Product\Product;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends EventAbleController
{
    public function orchestrator(?Page $page, string $slug, string $urlFormat)
    {
        $parameterPage = $this->mf->get('parameter')->getCoreParameter('page_product');
        if (null !== $parameterPage) {
            $page = $parameterPage;

            $urlFormat = $page->getSlug() . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('product')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        $template = 'Product/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $template);
    }

    public function list(Page $page) {
        $request = $this->getRequest();

        $products = $this->em->getRepository(Product::class)->findAllForWebsite($this->getLanguageId());

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        $template = 'Product/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'page'               => $page,
            'products'           => $products,
            'pageContent'        => $pageContent,
        ]);
    }
}
