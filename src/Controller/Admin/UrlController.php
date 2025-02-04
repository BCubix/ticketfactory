<?php

namespace App\Controller\Admin;

use App\Entity\Url\Url;
use App\Exception\ApiException;
use App\Form\Admin\Url\UrlType;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class UrlController extends CrudController
{
    protected const ENTITY_CLASS = Url::class;
    protected const TYPE_CLASS = UrlType::class;

    protected const NOT_FOUND_MESSAGE = "Cette url n'existe pas.";

    #[Rest\Get('/url')]
    #[Rest\QueryParam(name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_url_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/url/{urlId}', requirements: ['urlId' => '\d+'])]
    #[IsGranted('ROLE_URL_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_url_one'])]
    public function getOne(Request $request, int $urlId): View
    {
        return parent::getOne($request, $urlId);
    }

    #[Rest\Post('/url/{urlId}', requirements: ['urlId' => '\d+'])]
    #[IsGranted('ROLE_URL_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_url_one'])]
    public function edit(Request $request, int $urlId): View
    {
        return parent::edit($request, $urlId);
    }

    #[Rest\Post('/url/{urlId}/order', requirements: ['urlId' => '\d+'])]
    #[IsGranted('ROLE_URL_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_url_one'])]
    public function order(Request $request, int $urlId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($urlId);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $srcPosition = $request->get('src') + 1;
        $destPosition = $request->get('dest') + 1;
        if (null === $destPosition) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La requête n'a pas les informations requises.");
        }

        // Order position
        $this->mf->get('url')->orderUrlList($object, $srcPosition, $destPosition);

        $this->log->log(0, 0, 'Updated object from position ' . $srcPosition . ' to ' . $destPosition . '.', $this->entityClass, $object->getId());

        return $this->view($object, Response::HTTP_OK);
    }
}
