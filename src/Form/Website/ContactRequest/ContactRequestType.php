<?php

namespace App\Form\Website\ContactRequest;

use App\Entity\ContactRequest\ContactRequest;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
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
                'attr' => ['class' => 'form_input', 'placeholder' => ""],
                'label_attr' => ['class' => 'form_label'],
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
                'attr' => ['class' => 'form_input', 'placeholder' => ""],
                'label_attr' => ['class' => 'form_label']
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
                'attr' => ['class' => 'form_input', 'placeholder' => ""],
                'label_attr' => ['class' => 'form_label']
            ])
            ->add('send',                     SubmitType::class,               [
                'label' => 'Envoyer',
                'attr' => ['class' => 'btn'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ContactRequest::class
        ]);
    }
}
