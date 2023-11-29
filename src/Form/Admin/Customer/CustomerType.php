<?php

namespace App\Form\Admin\Customer;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Customer\Customer;

use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CustomerType extends AdminBaseFormType
{
    protected const ENTITY_CLASS = Customer::class;

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email',                EmailType::class,           [])
            ->add('plainPassword',        PasswordType::class,        [])
            ->add('firstName',            TextType::class,            [])
            ->add('lastName',             TextType::class,            [])
            ->add('civility',             ChoiceType::class,          [
                'choices'  => array_flip(Customer::CIVILITIES)
            ])
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']]);

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
            'data_class' => Customer::class,
            'csrf_protection' => false
        ]);
    }
}
