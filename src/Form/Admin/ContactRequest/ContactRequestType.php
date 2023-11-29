<?php

namespace App\Form\Admin\ContactRequest;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\ContactRequest\ContactRequest;

use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContactRequestType extends AdminBaseFormType
{
    protected const ENTITY_CLASS = ContactRequest::class;

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('firstName',            TextType::class,            [])
            ->add('lastName',             TextType::class,            [])
            ->add('email',                EmailType::class,           [])
            ->add('phone',                TextType::class,            [])
            ->add('subject',              TextType::class,            [])
            ->add('message',              TextareaType::class,        []);

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
            'data_class' => ContactRequest::class,
            'csrf_protection' => false
        ]);
    }
}
