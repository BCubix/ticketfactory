<?php

namespace App\Controller\Admin;

use App\Entity\Addon\Theme;
use App\Exception\ApiException;
use App\Manager\HookManager;
use App\Manager\ThemeManager;
use App\Manager\LanguageManager;
use App\Service\Error\FormErrorsCollector;
use App\Service\Log\Logger;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ThemeController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce thème n'existe pas.";

    protected $tm;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        LanguageManager $lm,
        HookManager $hm,
        ThemeManager $tm
    ) {
        parent::__construct($em, $se, $fec, $log, $lm, $hm);

        $this->tm = $tm;
    }

    #[Rest\Get('/themes')]
    #[Rest\View(serializerGroups: ['a_all', 'a_theme_all'])]
    public function getAll(Request $request): View
    {
        $themes = $this->tm->getAll();

        return $this->view($themes, Response::HTTP_OK);
    }

    #[Rest\Get('/themes/{themeId}', requirements: ['themeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_theme_one'])]
    public function getOne(Request $request, int $themeId): View
    {
        $theme = $this->em->getRepository(Theme::class)->findOneForAdmin($themeId);
        if (is_null($theme)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        return $this->view($theme, Response::HTTP_OK);
    }

    #[Rest\Post('/themes/{themeName}/active', requirements: ['themeName' => '.+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_theme_one'])]
    public function active(Request $request, string $themeName): View
    {
        $this->em->getConnection()->beginTransaction();

        try {
            $theme = $this->tm->active($themeName);
        } finally {
            if ($this->em->getConnection()->isTransactionActive()) {
                $this->em->getConnection()->rollBack();
            }
        }

        return $this->view($theme, Response::HTTP_OK);
    }

    #[Rest\Delete('/themes/{themeName}', requirements: ['themeName' => '.+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_theme_one'])]
    public function delete(Request $request, string $themeName): View
    {
        $this->em->getConnection()->beginTransaction();
        
        try {
            $this->tm->delete($themeName, true);
        } finally {
            if ($this->em->getConnection()->isTransactionActive()) {
                $this->em->getConnection()->rollBack();
            }
        }

        return $this->view(null, Response::HTTP_OK);
    }
}