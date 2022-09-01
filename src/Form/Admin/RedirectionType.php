<?php

namespace App\Form\Admin;

use App\Entity\Redirection;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RedirectionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',                    CheckboxType::class,             [
                'label' => 'Redirection active ?',
                'required' => false
            ])
            ->add('redirectType',              ChoiceType::class,               [
                'label' => 'Type de redirection',
                'required' => true,
                'expanded' => false,
                'multiple' => false,
                'choices'  => [
                    'Permanente (301)' => Redirection::REDIRECT_PERMANENT,
                    'Temporaire (302)' => Redirection::REDIRECT_TEMPORARY
                ]
            ])
            ->add('redirectFrom',              TextType::class,                 [
                'label' => 'Rediriger',
                'required' => true
            ])
            ->add('redirectTo',                TextType::class,                 [
                'label' => 'Vers',
                'required' => true
            ])
            ->add('save',                      SubmitType::class,               [
                'label' => 'Enregistrer'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Redirection::class
        ]);
    }
}
