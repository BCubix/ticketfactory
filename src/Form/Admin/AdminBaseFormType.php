<?php

namespace App\Form\Admin;

use App\Manager\FormManager;
use Symfony\Component\Form\AbstractType;

class AdminBaseFormType extends AbstractType
{
    protected $fm;

    public function __construct(FormManager $fm)
    {
        $this->fm = $fm;
    }
}
