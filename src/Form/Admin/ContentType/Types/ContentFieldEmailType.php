<?php

namespace App\Form\Admin\ContentType\Types;

use App\Form\Admin\ContentType\ContentFieldType;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentFieldEmailType extends ContentFieldType
{
    public const FIELD_NAME = 'email';

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('value',                EmailType::class,           [])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'inherit_data' => true
        ]);
    }

    protected static function getValidations() {
        return ['email'];
    }
}
