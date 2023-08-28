<?php

namespace App\Form\Website\ContactRequest;

use App\Entity\ContactRequest\ContactRequest;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContactRequestType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstName',            TextType::class,            [
                'label' => 'Prénom',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('lastName',             TextType::class,            [
                'label' => 'Nom',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('email',                EmailType::class,           [
                'label' => 'Email',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('phone',                TextType::class,            [
                'label' => 'Téléphone',
                'required' => false,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('subject',              TextType::class,            [
                'label' => 'Objet',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('message',              TextareaType::class,        [
                'label' => 'Message',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('send',                     SubmitType::class,               [
                'attr' => ['class' => 'btn'],
                'label' => 'Envoyer'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ContactRequest::class
        ]);
    }
}
