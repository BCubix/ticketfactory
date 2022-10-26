<?php

namespace App\Form\Admin\Event;

use App\Entity\Event\EventMedia;
use App\Entity\Media\Media;
use App\Repository\MediaRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventMediaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('media',                  EntityType::class,          [
                'class'         => Media::class,
                'choice_label'  => 'media',
                'multiple'      => false,
                'query_builder' => function (MediaRepository $mr) {
                    return $mr
                    ->createQueryBuilder('m')
                    ->orderBy('m.title', 'ASC')
                    ;
                }
            ])
            ->add('mainImg',                CheckboxType::class,        ['false_values' => ['0']])
            ->add('position',               NumberType::class,          [])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => EventMedia::class,
        ]);
    }
}
