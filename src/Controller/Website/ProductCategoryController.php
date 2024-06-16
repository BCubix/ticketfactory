<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Product\Product;
use App\Entity\Product\ProductCategory;
use App\Entity\Url\Url;

use Symfony\Component\HttpFoundation\Response;

class ProductCategoryController extends EventAbleController
{
    public function orchestrator(?Page $page, Url $url, string $slug)
    {
        $urlFormat = $url->getSlug();
        $attachedPage = $this->mf->get('productCategory')->getAttachedPage($url);
        if (null !== $attachedPage) {
            $page = $attachedPage;

            $urlFormat = $this->mf->get('page')->getPageSlugPath($page) . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('product')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents || !isset($contents['ProductCategory'])) {
            return new Response(null, 404);
        }

        return $this->detail($page, $contents);
    }

    public function list(Page $page) {
        $request = $this->getRequest();

        $productCategories = $this->em->getRepository(ProductCategory::class)->findAllForWebsite($this->getLanguageId());

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        $template = 'ProductCategory/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'page'               => $page,
            'productCategories'  => $productCategories,
            'pageContent'        => $pageContent,
        ]);
    }

    public function detail(Page $page, array $contents)
    {
        $products = $this->em->getRepository(Product::class)->findAllForWebsite(['productCategories' => [$contents['ProductCategory']->getId()]]);

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        return $this->websiteRender('Website/ProductCategory/detail.html.twig', [
            "page"               => $page,
            "productCategory"    => $contents['ProductCategory'],
            'products'           => $products,
            'pageContent'        => $pageContent,
        ]);
    }
}
