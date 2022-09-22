<?php

namespace App\Form\Admin\ContentType\Types;

use App\Form\Admin\ContentType\ContentFieldType;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentFieldNumberType extends ContentFieldType
{
    public const FIELD_NAME = 'number';

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('value',                NumberType::class,          [])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'inherit_data' => true
        ]);
    }

    protected static function getOptions() {
        return ['attr', 'disabled', 'required', 'scale'];
    }

    protected static function getValidations() {
        return ['lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'];
    }
}
