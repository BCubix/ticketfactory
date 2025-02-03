<?php

namespace App\Controller\Admin;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class AddonVersionController extends AdminController
{
    #[Rest\Get('/addon-versions')]
    public function getAddonVersions(): View
    {
        $results = $this->mf->get('addonVersion')->getAddonVersions();
        return $this->view($results, Response::HTTP_OK);
    }

    #[Rest\Post('/addon-versions/modules')]
    #[IsGranted('ROLE_ADDON_VERSION_UPDATE')]
    public function updateAllModules(): View
    {
        $this->mf->get('addonVersion')->updateAllModules();

        return $this->view(null, Response::HTTP_OK);
    }

    #[Rest\Post('/addon-versions/modules/{addonName}', requirements: ['addonName' => '[^/]+'])]
    #[IsGranted('ROLE_ADDON_VERSION_UPDATE')]
    public function updateModule(string $addonName): View
    {
        $this->mf->get('addonVersion')->updateModule($addonName);

        return $this->view(null, Response::HTTP_OK);
    }

    #[Rest\Post('/addon-versions/themes/{addonName}', requirements: ['addonName' => '[^/]+'])]
    #[IsGranted('ROLE_ADDON_VERSION_UPDATE')]
    public function updateTheme(string $addonName): View
    {
        $this->mf->get('addonVersion')->updateTheme($addonName);

        return $this->view(null, Response::HTTP_OK);
    }

    #[Rest\Post('/addon-versions/core')]
    #[IsGranted('ROLE_ADDON_VERSION_UPDATE')]
    public function updateCore(): View
    {
        $this->mf->get('addonVersion')->updateCore();

        return $this->view(null, Response::HTTP_OK);
    }
}