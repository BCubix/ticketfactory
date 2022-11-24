<?php

namespace App\Controller\Admin;

use App\Entity\Parameter\Parameter;
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

#[Rest\Route('/api')]
class ThemeController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce thème n'existe pas.";

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


    #[Rest\Post('/themes/{themeId}/choose', requirements: ['themeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function choose(Request $request, ThemeService $themeService, int $themeId): View
    {
        $result = $this->em->getRepository(Parameter::class)->findAllForAdmin(['paramKey' => 'main_theme']);
        if (null === $result || count($result['results']) !== 1) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        $parameter = $result['results'][0];

        $event = new CrudObjectInstantiatedEvent($parameter, 'edit');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $parameter->setParamValue($themeId);

        $event = new CrudObjectValidatedEvent($parameter);
        $this->ed->dispatch($event, CrudObjectValidatedEvent::NAME);

        $this->em->persist($parameter);
        $this->em->flush();

        $this->log->log(0, 0, 'Updated object.', Parameter::class, $parameter->getId());

        if (NULL === shell_exec('php ../bin/console cache:clear')) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La commande cache:clear a échoué.");
        }

        return $this->view(null, Response::HTTP_OK);
    }

    #[Rest\Delete('/themes/{themeId}', requirements: ['themeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, ThemeService $themeService, int $themeId): View
    {
        $theme = $this->em->getRepository(Theme::class)->findOneForAdmin($themeId);
        if (null === $theme) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $event = new CrudObjectInstantiatedEvent($theme, 'delete');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $themeId = $theme->getId();
        $themeName = $theme->getName();

        $this->em->remove($theme);
        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', Theme::class, $themeId);

        $result = $this->em->getRepository(Parameter::class)->findAllForAdmin(['paramKey' => 'main_theme']);
        if (null === $result || count($result['results']) !== 1) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        $parameter = $result['results'][0];

        if ($themeId === intval($parameter->getParamValue())) {

            $event = new CrudObjectInstantiatedEvent($parameter, 'edit');
            $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

            $parameter->setParamValue(null);

            $event = new CrudObjectValidatedEvent($parameter);
            $this->ed->dispatch($event, CrudObjectValidatedEvent::NAME);

            $this->em->persist($parameter);
            $this->em->flush();

            $this->log->log(0, 0, 'Updated object.', Parameter::class, $parameter->getId());

            if (NULL === shell_exec('php ../bin/console cache:clear')) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La commande cache:clear a échoué.");
            }
        }

        $themeService->deleteFolder($themeName);

        return $this->view(null, Response::HTTP_OK);
    }
}