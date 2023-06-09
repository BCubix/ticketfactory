<?php

namespace App\Twig;

use App\Manager\LanguageManager;
use App\Manager\HookManager;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigGlobalExtension extends AbstractExtension
{
    protected $lm;
    protected $hm;

    public function __construct(LanguageManager $lm, HookManager $hm)
    {
       $this->lm = $lm;
       $this->hm = $hm;
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
        $event = $this->hm->exec($hookName, $parameters);

        return html_entity_decode(implode($event->getResponses()));
    }
}
