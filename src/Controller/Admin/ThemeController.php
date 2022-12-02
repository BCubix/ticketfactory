<?php

namespace App\Controller\Admin;

use App\Entity\Theme\Theme;
use App\Exception\ApiException;
use App\Manager\ThemeManager;
use App\Service\Logger\Logger;
use App\Service\ModuleTheme\Service\ThemeService;
use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ThemeController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce thème n'existe pas.";

    protected $tm;
    protected $ts;
    protected $fs;

    public function __construct(
        EventDispatcherInterface $ed,
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        ThemeManager $tm,
        ThemeService $ts,
        Filesystem $fs
    ) {
        parent::__construct($ed, $em, $se, $fec, $log);

        $this->tm = $tm;
        $this->ts = $ts;
        $this->fs = $fs;
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

    #[Rest\Post('/themes/{themeName}/active', requirements: ['themeName' => '.+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function active(Request $request, string $themeName): View
    {
        $theme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($themeName);
        if (null === $theme) {
            $this->ts->install($themeName);
            $theme = $this->tm->createNewTheme($themeName);
        }

        $this->tm->active($theme);

        return $this->view($theme, Response::HTTP_OK);
    }

    #[Rest\Delete('/themes/{themeName}', requirements: ['themeName' => '.+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, string $themeName): View
    {
        $themePath = $this->ts->getDir() . '/' . $themeName;

        $theme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($themeName);
        if (null !== $theme) {
            $this->tm->delete($theme);
        } else if (!is_dir($themePath)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $themePath n'existe pas.");
        }

        $this->fs->remove($themePath);

        return $this->view(null, Response::HTTP_OK);
    }
}