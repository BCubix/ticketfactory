<?php

namespace App\Form\Admin\Technical;

use App\Entity\Technical\Redirection;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RedirectionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('redirectType',         ChoiceType::class,          [
                'choices'  => [
                    'Permanente (301)' => Redirection::REDIRECT_PERMANENT,
                    'Temporaire (302)' => Redirection::REDIRECT_TEMPORARY
                ]
            ])
            ->add('redirectFrom',         TextType::class,            [])
            ->add('redirectTo',           TextType::class,            [])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Redirection::class
        ]);
    }
}
