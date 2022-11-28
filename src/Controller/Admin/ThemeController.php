<?php

namespace App\Controller\Admin;

use App\Entity\Theme\Theme;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Exception\ApiException;
use App\Manager\ParameterManager;
use App\Service\Logger\Logger;
use App\Service\ModuleTheme\Service\ThemeService;
use App\Utils\FormErrorsCollector;
use App\Utils\System;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ThemeController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce thème n'existe pas.";

    protected $pm;
    protected $ts;

    public function __construct(EventDispatcherInterface $ed, EntityManagerInterface $em, SerializerInterface $se, FormErrorsCollector $fec, Logger $log, ParameterManager $pm, ThemeService $ts)
    {
        parent::__construct($ed, $em, $se, $fec, $log);

        $this->pm = $pm;
        $this->ts = $ts;
    }

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
    public function choose(Request $request, int $themeId): View
    {
        $theme = $this->em->getRepository(Theme::class)->findOneForAdmin($themeId);
        if (null === $theme) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $parameter = $this->pm->get('main_theme');

        $oldThemeId = $parameter->getParamValue();

        $this->pm->set('main_theme', $themeId);
        $this->em->flush();

        try {
            if (null !== $oldThemeId) {
                $oldTheme = $this->em->getRepository(Theme::class)->findOneForAdmin($oldThemeId);
                if (null === $oldTheme) {
                    throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
                }

                $this->ts->callConfig($oldTheme->getName(), 'uninstall');
            }

            $this->ts->callConfig($theme->getName(), 'install');
            $this->ts->clear();
        } catch (\Exception $e) {
            $this->pm->set('main_theme', $oldThemeId);
            $this->em->flush();

            throw $e;
        }

        return $this->view($theme, Response::HTTP_OK);
    }

    #[Rest\Delete('/themes/{themeId}', requirements: ['themeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $themeId): View
    {
        $theme = $this->em->getRepository(Theme::class)->findOneForAdmin($themeId);
        if (null === $theme) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $themeName = $theme->getName();
        $parameter = $this->pm->get('main_theme');

        if ($themeId === intval($parameter->getParamValue())) {
            $this->pm->set('main_theme', null);
            $this->em->flush();

            try {
                $this->ts->callConfig($themeName, 'uninstall');
                $this->ts->clear();
            } catch (\Exception $e) {
                $this->pm->set('main_theme', $themeId);
                $this->em->flush();

                throw $e;
            }
        }

        $event = new CrudObjectInstantiatedEvent($theme, 'delete');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $this->em->remove($theme);
        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', Theme::class, $themeId);

        System::rmdir($this->ts->getDir() . '/' . $themeName);

        return $this->view(null, Response::HTTP_OK);
    }
}