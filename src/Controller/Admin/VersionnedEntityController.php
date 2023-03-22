<?php

namespace App\Controller\Admin;

use App\Exception\ApiException;
use App\Manager\VersionnedEntityManager;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class VersionnedEntityController extends AdminController
{
    #[Rest\Get('/api/versions/{entityKeyword}/{entityId}')]
    #[Rest\View(serializerGroups: ['a_all', 'a_version_all'])]
    public function getVersions(Request $request, VersionnedEntityManager $vem, string $entityKeyword, int $entityId): View
    {
        $className = $vem->getClass($entityKeyword);
        if (!$className) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Ce type de données n\'est pas géré.");
        }

        $versions = $vem->getEntityVersions($entityKeyword, $entityId);

        return $this->view($versions, Response::HTTP_OK);
    }

    #[Rest\Post('/api/versions/{entityKeyword}/{versionId}')]
    #[Rest\View(serializerGroups: ['a_all', 'a_version_one'])]
    public function restoreVersion(Request $request, VersionnedEntityManager $vem, string $entityKeyword, int $versionId): View
    {
        $className = $vem->getClass($entityKeyword);
        if (!$className) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Ce type de données n\'est pas géré.");
        }

        $object = $vem->restoreEntityVersion($entityKeyword, $versionId);

        return $this->view($object, Response::HTTP_OK);
    }
}
