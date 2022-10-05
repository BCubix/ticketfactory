<?php

namespace App\Form\Admin\ContactRequest;

use App\Entity\ContactRequest\ContactRequest;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContactRequestType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('firstName',            TextType::class,            [])
            ->add('lastName',             TextType::class,            [])
            ->add('email',                EmailType::class,           [])
            ->add('phone',                TextType::class,            [])
            ->add('subject',              TextType::class,            [])
            ->add('message',              TextareaType::class,        [])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ContactRequest::class
        ]);
    }
}
