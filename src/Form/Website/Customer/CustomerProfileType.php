<?php

namespace App\Form\Website\Customer;

use App\Entity\Customer\Customer;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CustomerProfileType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
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
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('plainPassword',      RepeatedType::class,        [
                'type' => PasswordType::class,
                'required' => true,
                'first_options' => [
                    'label' => 'Mot de passe',
                    'label_attr' => ['class' => 'form_label'],
                    'attr' => ['class' => 'form_input', 'placeholder' => ""]
                ],
                'second_options' => [
                    'label' => 'Confirmation mot de passe',
                    'label_attr' => ['class' => 'form_label'],
                    'attr' => ['class' => 'form_input', 'placeholder' => ""]
                ],
                'invalid_message' => 'Les mots de passe ne sont pas identiques',
            ])
            ->add('address',              CustomerAddressType::class, [])
            ->add('send',                 SubmitType::class,          [
                'attr' => ['class' => 'btn'],
                'label' => 'Mettre à jour'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Customer::class,
            'csrf_protection' => false,
        ]);
    }
}
