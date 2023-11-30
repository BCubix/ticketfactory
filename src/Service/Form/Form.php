<?php

namespace App\Service\Form;

use Symfony\Component\Form\FormFactoryInterface;

class Form
{
    public const SERVICE_NAME = 'form';

    private $ff;

    public function __construct(FormFactoryInterface $ff)
    {
        $this->ff = $ff;
    }

    public function createForm(string $formType, mixed $entity, ?array $options)
    {
        $form = $this->ff->create($formType, $entity, $options);

        return $form;
    }
}
