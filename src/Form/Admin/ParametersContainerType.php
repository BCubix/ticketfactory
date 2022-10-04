<?php

namespace App\Form\Admin;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;

class ParametersContainerType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('parameters',       CollectionType::class,           [
                'entry_type' => ParameterType::class,
                'required'  => true,
                'allow_add' => false,
                'allow_delete' => false,
                'delete_empty' => false,
                'by_reference' => false,
            ])
        ;
    }
}