<?php

namespace App\Form\Admin\Media;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;
use App\Entity\Media\MediaCategory;
use App\Repository\ImageFormatRepository;
use App\Repository\MediaRepository;
use App\Repository\MediaCategoryRepository;
use App\Service\File\MimeTypeMapping;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MediaType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('alt',                  TextType::class,            [])
            ->add('legend',               TextType::class,            [])
            ->add('title',                TextType::class,            [])
            ->add('mainCategory',         EntityType::class,          [
                'class'         => MediaCategory::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (MediaCategoryRepository $mcr) {
                    return $mcr
                        ->createQueryBuilder('mc')
                        ->orderBy('mc.name', 'ASC');
                }
            ])
            ->add('mediaCategories',      EntityType::class,          [
                'class'         => MediaCategory::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'query_builder' => function (MediaCategoryRepository $mcr) {
                    return $mcr
                        ->createQueryBuilder('mc')
                        ->orderBy('mc.name', 'ASC');
                }
            ])
            ->add('thumbnail',             EntityType::class,          [
                'class'         => Media::class,
                'choice_label'  => 'media',
                'multiple'      => false,
                'query_builder' => function (MediaRepository $mr) {
                    return $mr
                        ->createQueryBuilder('m')
                        ->orderBy('m.title', 'ASC');
                }
            ])
            ->add('imageFormats',      EntityType::class,          [
                'class'         => ImageFormat::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'query_builder' => function (ImageFormatRepository $ifr) {
                    return $ifr
                        ->createQueryBuilder('if')
                        ->orderBy('if.name', 'ASC');
                }
            ])
            ->add('iframe',                 CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('documentUrl',            TextType::class,            [])
            ->add('documentType',           ChoiceType::class,          [
                'choices'  => MimeTypeMapping::getAllMimes(),
            ]);

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                $this->fm->onPreSetData($event);
            }
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Media::class,
            'csrf_protection' => false
        ]);
    }
}
