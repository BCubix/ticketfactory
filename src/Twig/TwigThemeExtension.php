<?php

namespace App\Twig;

use App\Manager\ManagerFactory;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigThemeExtension extends AbstractExtension
{
    private $mf;

    public function __construct(ManagerFactory $mf)
    {
        $this->mf = $mf;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('adminTemplates',   [$this, 'adminTemplates']),
            new TwigFunction('websiteTemplates', [$this, 'websiteTemplates']),
            new TwigFunction('moduleTemplates', [$this, 'moduleTemplates']),
        ];
    }

    public function adminTemplates(string $twigFilename): string
    {
        return $this->mf->get('theme')->getAdminTemplatesPath() . $twigFilename;
    }

    public function websiteTemplates(string $twigFilename): string
    {
        return $this->mf->get('theme')->getWebsiteTemplatesPath() . $twigFilename;
    }

    public function moduleTemplates(string $moduleName, string $twigFilename): string
    {
        return $this->mf->get('module')->getModuleFilePath($moduleName, $twigFilename);
    }
}
