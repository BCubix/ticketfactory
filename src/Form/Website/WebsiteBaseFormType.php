<?php

namespace App\Form\Website;

use App\Manager\FormManager;
use App\Manager\ParameterManager;
use Symfony\Component\Form\AbstractType;

class WebsiteBaseFormType extends AbstractType
{
    protected $fm;
    protected $pm;

    public function __construct(FormManager $fm, ParameterManager $pm)
    {
        $this->fm = $fm;
        $this->pm = $pm;
    }
}
