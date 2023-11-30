<?php

namespace App\Form\Feature;

use App\Entity\Feature\FeatureCategory;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FeatureCategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',                      CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('name',                        TextType::class,            [])
            ->add('slug',                        TextType::class,            [])
            ->add('keyword',                     TextType::class,            []);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => FeatureCategory::class,
        ]);
    }
}
