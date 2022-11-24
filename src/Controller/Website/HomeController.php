<?php

namespace App\Controller\Website;

use App\Entity\Parameter\Parameter;
use App\Entity\Theme\Theme;

use Symfony\Component\Routing\Annotation\Route;

class HomeController extends WebsiteController
{
    #[Route("/", name: 'home_website')]
    public function index(?string $reactRouting)
    {
        $result = $this->em->getRepository(Parameter::class)->findAllForAdmin(['paramKey' => 'main_theme']);
        if (null === $result || count($result['results']) !== 1) {
            throw new \Exception("Le thème principal n'est pas dans les paramètres.");
        }

        $parameter = $result['results'][0];

        $theme = $this->em->getRepository(Theme::class)->findOneForAdmin($parameter->getParamValue());
        if (null === $theme) {
            throw new \Exception('Il n\'y a pas de thème principal.');
        }

        return $this->render('@website/index.html.twig', [
            'themeName' => $theme->getName(),
        ]);
    }
}

