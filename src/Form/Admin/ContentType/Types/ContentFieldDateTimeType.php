<?php

namespace App\Form\Admin\ContentType\Types;

use App\Form\Admin\ContentType\ContentFieldType;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentFieldDateTimeType extends ContentFieldType
{
    public const FIELD_NAME = 'datetime';

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('value',                DateTimeType::class,        [
                'format' => 'dd/MM/yyyy HH:mm',
                'html5' => false,
                'widget' => 'single_text'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'inherit_data' => true
        ]);
    }

    protected static function getOptions() {
        return ['attr', 'disabled', 'required'];
    }

    protected static function getValidations() {
        return ['lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'];
    }
}
