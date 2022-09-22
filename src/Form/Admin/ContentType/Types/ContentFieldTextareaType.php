<?php

namespace App\Form\Admin\ContentType\Types;

use App\Form\Admin\ContentType\ContentFieldType;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentFieldTextareaType extends ContentFieldType
{
    public const FIELD_NAME = 'textarea';

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('value',                TextareaType::class,        [])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'inherit_data' => true
        ]);
    }

    protected static function getValidations() {
        $validations = parent::getValidations();

        return array_merge($validations, ['minLength', 'maxLength', 'regex']);
    }
}
