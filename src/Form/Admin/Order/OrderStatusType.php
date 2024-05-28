<?php

namespace App\Form\Admin\Order;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Order\OrderStatus;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class OrderStatusType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name',                 TextType::class,            [])
            ->add('keyword',              TextType::class,            [])
            ->add('color',                TextType::class,            [])
            ;

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
            'data_class' => OrderStatus::class,
            'csrf_protection' => false
        ]);
    }
}
