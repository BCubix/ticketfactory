<?php

namespace App\Form\Admin\Event;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Event\Tag;
use App\Entity\Language\Language;
use App\Repository\LanguageRepository;
use App\Form\Admin\SEOAble\SEOAbleType;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TagType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('name',                 TextType::class,            [])
            ->add('slug',                 TextType::class,            [])
            ->add('description',          TextareaType::class,        [])
            ->add('lang',                 EntityType::class,          [
                'class'         => Language::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (LanguageRepository $lr) {
                    return $lr
                        ->createQueryBuilder('l')
                        ->orderBy('l.name', 'ASC');
                }
            ])
            ->add('languageGroup',        UuidType::class,            [])
            ->add('seo',                  SEOAbleType::class,         [
                'data_class' => Tag::class,
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
            'data_class' => Tag::class,
            'csrf_protection' => false
        ]);
    }
}
