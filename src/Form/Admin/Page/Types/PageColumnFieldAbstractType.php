<?php

namespace App\Form\Admin\Page\Types;

use App\Form\Admin\AdminBaseFormType;
use Doctrine\ORM\EntityManagerInterface;

abstract class PageColumnFieldAbstractType extends AdminBaseFormType
{
    protected $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getFormOptions(): array
    {
        return [];
    }
}
