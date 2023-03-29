<?php

namespace App\Form\Admin\SEOAble;

use App\Entity\Media\Media;
use App\Repository\MediaRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SEOAbleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('metaTitle',                 TextType::class,                 [])
            ->add('metaDescription',           TextareaType::class,             [])
            ->add('socialImage',               EntityType::class,          [
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
            ->add('fbTitle',                   TextType::class,                 [])
            ->add('fbDescription',             TextareaType::class,             [])
            ->add('twTitle',                   TextType::class,                 [])
            ->add('twDescription',             TextareaType::class,             [])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'inherit_data' => true,
        ]);
    }
}
