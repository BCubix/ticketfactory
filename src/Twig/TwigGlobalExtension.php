<?php

namespace App\Twig;

use App\Manager\LanguageManager;
use App\Service\Hook\HookService;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigGlobalExtension extends AbstractExtension
{
    protected $lm;
    protected $hs;

    public function __construct(LanguageManager $lm, HookService $hs)
    {
       $this->lm = $lm;
       $this->hs = $hs;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('locale', [$this, 'locale']),
            new TwigFunction('hook', [$this, 'hook'], ['is_safe' => ['html']])
        ];
    }

    public function locale(): string
    {
        return $this->lm->getLocale();
    }

    public function hook(string $hookName, array $parameters = []): ?string
    {
        $event = $this->hs->exec($hookName, $parameters);

        return html_entity_decode(implode($event->getResponses()));
    }
}
