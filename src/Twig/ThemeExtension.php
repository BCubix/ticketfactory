<?php

namespace App\Twig;

use App\Manager\ThemeManager;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ThemeExtension extends AbstractExtension
{
    private $tm;

    public function __construct(ThemeManager $tm)
    {
        $this->tm = $tm;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('adminTemplates',   [$this, 'adminTemplates']),
            new TwigFunction('websiteTemplates', [$this, 'websiteTemplates']),
        ];
    }

    public function adminTemplates(string $twigFilename): string
    {
        return $this->tm->getAdminTemplatesPath() . $twigFilename;
    }

    public function websiteTemplates(string $twigFilename): string
    {
        return $this->tm->getWebsiteTemplatesPath() . $twigFilename;
    }
}