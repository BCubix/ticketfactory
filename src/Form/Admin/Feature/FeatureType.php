<?php

namespace App\Form\Admin\Feature;

use App\Entity\Feature\Feature;
use App\Entity\Feature\FeatureCategory;
use App\Repository\FeatureCategoryRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FeatureType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',                      CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('name',                        TextType::class,            [])
            ->add('slug',                        TextType::class,            [])
            ->add('keyword',                     TextType::class,            [])
            ->add('type',                        ChoiceType::class,          [
                'choices'  => [
                    'Texte'   => 'text',
                    'Nombre'  => 'number',
                    'Date'    => 'date',
                    'Couleur' => 'color'
                ]
            ])
            ->add('position',                    NumberType::class,          [])
            ->add('filter',                      CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('filterType',                  ChoiceType::class,          [
                'choices'  => [
                    'Boutons radio'    => 'radio',
                    'Cases à cocher'   => 'checkbox',
                    'Liste déroulante' => 'simple_list',
                    'Liste multiple'   => 'multiple_list',
                    'Réglette'         => 'slider',
                    'Min-Max'          => 'minmax',
                    'Couleur'          => 'color'
                ]
            ])
            ->add('featureCategory',             EntityType::class,          [
                'class'         => FeatureCategory::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (FeatureCategoryRepository $fcr) {
                    return $fcr
                        ->createQueryBuilder('fc')
                        ->where('fc.active = 1')
                        ->orderBy('fc.name', 'ASC');
                }
            ])
            ->add('featureValues',               CollectionType::class,      [
                'entry_type'   => FeatureValueType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Feature::class,
        ]);
    }
}
