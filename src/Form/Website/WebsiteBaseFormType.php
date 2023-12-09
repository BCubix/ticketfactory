<?php

namespace App\Form\Website;

use App\Manager\FormManager;
use Symfony\Component\Form\AbstractType;

class WebsiteBaseFormType extends AbstractType
{
    protected $fm;

    public function __construct(FormManager $fm)
    {
        $this->fm = $fm;
    }
}
