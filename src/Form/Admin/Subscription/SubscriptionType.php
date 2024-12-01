<?php

namespace App\Form\Admin\Subscription;

use App\Entity\Event\Event;
use App\Entity\Language\Language;
use App\Entity\Subscription\Subscription;
use App\Form\Admin\AdminBaseFormType;
use App\Repository\EventRepository;
use App\Repository\LanguageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SubscriptionType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('active',                CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('name',                  TextType::class,            [])
            ->add('description',           TextareaType::class,            [])
            ->add('eventNb',               IntegerType::class,         [])
            ->add('price',                 MoneyType::class,           [])
            ->add('beginDate',             DateType::class,        [
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'yyyy-MM-dd',
                'html5'          => false
            ])
            ->add('endDate',               DateType::class,        [
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'yyyy-MM-dd',
                'html5'          => false
            ])
            ->add('duration',             IntegerType::class,          [])
            ->add('events',               EntityType::class,           [
                'class'         => Event::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'query_builder' => function (EventRepository $er) {
                    return $er
                        ->createQueryBuilder('e')
                        ->orderBy('e.name', 'ASC');
                }
            ])
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
            ->add('languageGroup',               UuidType::class,            []);

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                $this->fm->onPreSetData($event);
            }
        );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Subscription::class,
            'csrf_protection' => false
        ]);
    }
}