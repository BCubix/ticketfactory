<?php

namespace App\Controller\Admin;

use App\Manager\ContentTypeFieldManager;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ContentTypeFieldsController extends AdminController
{
    #[Rest\Get('/content-type-fields')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ContentTypeFieldManager $ctfm): View
    {
        $list = $ctfm->getAllFields();

        return $this->view($list, Response::HTTP_OK);
    }

    #[Rest\Get('/content-type-fields/{fieldName}')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, ContentTypeFieldManager $ctfm, string $fieldName): View
    {
        $field = $ctfm->getFieldParams($fieldName);
        if (null === $field) {
            throw $this->createNotFoundException('Ce type de champ n\'est pas reconnu.');
        }

        return $this->view($field, Response::HTTP_OK);
    }
}
