<?php

namespace App\Controller\Admin;

use App\Entity\Theme\Theme;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;
use App\Exception\ApiException;
use App\Service\Module\ThemeService;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ThemeController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce thème n'existe pas.";

    private const ACTION_DISABLE = 0;
    private const ACTION_UNINSTALL = 1;
    private const ACTION_UNINSTALL_DELETE = 2;

    #[Rest\Get('/themes')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $themes = $this->em->getRepository(Theme::class)->findAllForAdmin($filters);

        return $this->view($themes, Response::HTTP_OK);
    }

    #[Rest\Get('/themes/{themeId}', requirements: ['themeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $themeId): View
    {
        $theme = $this->em->getRepository(Theme::class)->findOneForAdmin($themeId);
        if (is_null($theme)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        return $this->view($theme, Response::HTTP_OK);
    }

    #[Rest\Post('/themes/{themeId}/active', requirements: ['themeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function active(Request $request, ThemeService $themeService, int $themeId): View
    {
        $theme = $this->em->getRepository(Theme::class)->findOneForAdmin($themeId);
        if (null === $theme) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $actionStr = $request->get('action');
        $action = $actionStr !== null ? intval($actionStr) : null;

        if ($action === self::ACTION_UNINSTALL_DELETE) {
            $event = new CrudObjectInstantiatedEvent($theme, 'delete');
            $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

            $themeName = $theme->getName();
            $themeId = $theme->getId();

            $this->em->remove($theme);
            $this->em->flush();

            $this->log->log(0, 0, 'Deleted object.', Theme::class, $themeId);

            $themeService->deleteFolder($themeName);

            return $this->view(null, Response::HTTP_OK);
        }

        $event = new CrudObjectInstantiatedEvent($theme, 'edit');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $theme->setActive(!$theme->isActive());

        $event = new CrudObjectValidatedEvent($theme);
        $this->ed->dispatch($event, CrudObjectValidatedEvent::NAME);

        $this->em->persist($theme);
        $this->em->flush();

        $this->log->log(0, 0, 'Updated object.', Theme::class, $theme->getId());

        return $this->view($theme, Response::HTTP_OK);
    }
}