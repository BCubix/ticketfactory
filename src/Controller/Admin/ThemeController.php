<?php

namespace App\Controller\Admin;

use App\Entity\Theme\Theme;
use App\Exception\ApiException;
use App\Manager\ThemeManager;
use App\Service\Hook\HookService;
use App\Service\Logger\Logger;
use App\Service\ModuleTheme\Service\ThemeService;
use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
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
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        ThemeManager $tm,
        ThemeService $ts,
        Filesystem $fs
    ) {
        parent::__construct($em, $se, $fec, $log, $hs);

        $this->tm = $tm;
        $this->ts = $ts;
        $this->fs = $fs;
    }

    #[Rest\Get('/themes')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request): View
    {
        $themes = $this->ts->getAllInDisk();

        for ($i = 0; $i < count($themes); ++$i) {
            unset($themes[$i]['global_settings']);
        }

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

        $this->em->getConnection()->beginTransaction();
        try {
            if (null === $theme) {
                $this->ts->install($themeName);
                $theme = $this->tm->createNewTheme($themeName);
            }

            $this->tm->active($theme);
        } catch (\Exception $e) {
            if ($this->em->getConnection()->isTransactionActive()) {
                $this->em->getConnection()->rollBack();
            }
            throw $e;
        }

        return $this->view($theme, Response::HTTP_OK);
    }

    #[Rest\Delete('/themes/{themeName}', requirements: ['themeName' => '.+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, string $themeName): View
    {
        $theme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($themeName);

        $this->em->getConnection()->beginTransaction();
        try {
            $themePath = $this->ts->getDir() . '/' . $themeName;

            if (null !== $theme) {
                $this->tm->delete($theme);
            } else if (!is_dir($themePath)) {
                throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $themePath n'existe pas.");
            }

            $this->ts->uninstall($themeName);
        } catch (\Exception $e) {
            if ($this->em->getConnection()->isTransactionActive()) {
                $this->em->getConnection()->rollBack();
            }
            throw $e;
        }

        return $this->view(null, Response::HTTP_OK);
    }
}