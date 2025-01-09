<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Product\Product;
use App\Entity\Product\ProductCategory;
use App\Entity\Url\Url;
use App\Form\Website\Product\ProductFilterType;

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
        $contents = $this->mf->get('productCategory')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents || !isset($contents['ProductCategory'])) {
            return new Response(null, 404);
        }

        $breadcrumbs = $this->mf->get('productCategory')->generateBreadcrumbs($attachedPage, $url, $slug, $contents);

        return $this->detail($page, $contents, $breadcrumbs);
    }

    public function list(Page $page) {
        $request = $this->getRequest();
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        $productCategories = $this->em->getRepository(ProductCategory::class)->findAllForWebsite($this->getLanguageId());

        $template = 'ProductCategory/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'productCategories'  => $productCategories,
        ]);
    }

    public function detail(Page $page, array $contents, array $breadcrumbs)
    {
        $request = $this->getRequest();

        $filters = ['topCategory' => [$contents['ProductCategory']->getId()]];
        $filterForm = $this->createForm(ProductFilterType::class, null, ['productCategory' => $contents['ProductCategory']->getId()]);
        $filterForm->handleRequest($request);

        if ($filterForm->isSubmitted() && $filterForm->isValid()) {
            $filters = $filterForm->getData();
            $filters['topCategory'] = $contents['ProductCategory']->getId();
        }

        list($products, $pagination) = $this->mf->get('product')->getProducts($this->getLanguageId(), $filters);
        $topCategories = $this->mf->get('productCategory')->getTopCategories();

        $template = 'Product/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'breadcrumbs'        => $breadcrumbs,
            "page"               => $page,
            "productCategory"    => $contents['ProductCategory'],
            'products'           => $products,
            'filterForm'         => $filterForm->createView(),
            'pagination'         => $pagination,
            'topCategories'      => $topCategories,
        ]);
    }
}
