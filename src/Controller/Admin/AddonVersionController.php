<?php

namespace App\Controller\Admin;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Response;

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
    public function updateAllModules(): View
    {
        $this->mf->get('addonVersion')->updateAllModules();

        return $this->view(null, Response::HTTP_OK);
    }

    #[Rest\Post('/addon-versions/modules/{addonName}', requirements: ['addonName' => '[^/]+'])]
    public function updateModule(string $addonName): View
    {
        $this->mf->get('addonVersion')->updateModule($addonName);

        return $this->view(null, Response::HTTP_OK);
    }

    #[Rest\Post('/addon-versions/themes/{addonName}', requirements: ['addonName' => '[^/]+'])]
    public function updateTheme(string $addonName): View
    {
        $this->mf->get('addonVersion')->updateTheme($addonName);

        return $this->view(null, Response::HTTP_OK);
    }

    #[Rest\Post('/addon-versions/core')]
    public function updateCore(): View
    {
        $this->mf->get('addonVersion')->updateCore();

        return $this->view(null, Response::HTTP_OK);
    }
}