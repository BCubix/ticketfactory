<?php

namespace App\Form\Website\Customer;

use App\Entity\Customer\Address;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AddressType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('address1',             TextType::class,            [
                'label' => 'Adresse',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('address2',             TextType::class,            [
                'label' => 'Adresse 2',
                'required' => false,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('zipcode',              TextType::class,            [
                'label' => 'Code postal',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('city',                 TextType::class,            [
                'label' => 'Ville',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('country',              TextType::class,            [
                'label' => 'Pays',
                'required' => true,
                'label_attr' => ['class' => 'form_label'],
                'attr' => ['class' => 'form_input', 'placeholder' => ""]
            ])
            ->add('send',                     SubmitType::class,               [
                'attr' => ['class' => 'btn'],
                'label' => 'Continuer'
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Address::class,
            'csrf_protection' => false,
        ]);
    }
}
