<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Product\Product;
use App\Entity\Url\Url;
use App\Form\Website\Product\ProductFilterType;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends EventAbleController
{
    public function orchestrator(?Page $page, Url $url, string $slug)
    {
        $urlFormat = $url->getSlug();
        $attachedPage = $this->mf->get('product')->getAttachedPage($url);
        if (null !== $attachedPage) {
            $page = $attachedPage;

            $urlFormat = $this->mf->get('page')->getPageSlugPath($page) . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('product')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents || !isset($contents['Product'])) {
            return new Response(null, 404);
        }

        $breadcrumbs = $this->mf->get('product')->generateBreadcrumbs($attachedPage, $url, $slug, $contents);
        return $this->detail($page, $contents, $breadcrumbs);
    }

    public function list(Page $page)
    {
        $request = $this->getRequest();
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        $filters = [];
        $filterForm = $this->createForm(ProductFilterType::class, null);
        $filterForm->handleRequest($request);

        if ($filterForm->isSubmitted() && $filterForm->isValid()) {
            $filters = $filterForm->getData();
        }

        list($products, $pagination) = $this->em->getRepository(Product::class)->findAllForWebsite($this->getLanguageId(), $filters);
        $topCategories = $this->mf->get('productCategory')->getTopCategories();

        $template = 'Product/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'products'           => $products,
            'filterForm'         => $filterForm->createView(),
            'pagination'         => $pagination,
            'topCategories'      => $topCategories,
        ]);
    }

    public function detail(Page $page, array $contents, array $breadcrumbs)
    {
        return $this->websiteRender('Product/detail.html.twig', [
            'breadcrumbs'        => $breadcrumbs,
            "page"               => $page,
            "product"            => $contents['Product'],
        ]);
    }

    #[Route("/products/add-product-to-cart", name: "tf_website_cart_add_product", priority: 1)]
    public function addProduct()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $quantity = $this->getRequest()->get('quantity') ?? 1;
        $productId = $this->getRequest()->get('productId');
        if (null === $productId) {
            return new Response(null, 400);
        }

        $product = $this->em->getRepository(Product::class)->findOneByIdForWebsite($productId);
        $stock = $product->getStock();

        // if not enough stock we render an error
        if ($stock - $quantity < 0) {
            $notif = [
                'title' => 'Erreur',
                'message' => "Impossible d'ajouter au panier. La quantité demandée dépasse le stock disponible."
            ];
        } else {
            $this->mf->get('cart')->addProductToCart($product, $quantity);
            $notif = [
                'title' => 'Succès',
                'message' => "Votre produit à été ajouté au panier."
            ];
        }

        return $this->websiteRender("_partials/_notification.html.twig", $notif);
    }
}
