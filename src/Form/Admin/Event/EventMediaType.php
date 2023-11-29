<?php

namespace App\Form\Admin\Event;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Event\EventMedia;
use App\Entity\Media\Media;
use App\Repository\MediaRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventMediaType extends AdminBaseFormType
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
                        ->orderBy('m.title', 'ASC');
                }
            ])
            ->add('position',               NumberType::class,          []);

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
            'data_class' => EventMedia::class,
            'csrf_protection' => false
        ]);
    }
}
