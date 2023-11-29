<?php

namespace App\Form\Admin\Technical;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Technical\Redirection;

use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RedirectionType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('redirectType',         ChoiceType::class,          [
                'choices'  => [
                    'Permanente (301)' => Redirection::REDIRECT_PERMANENT,
                    'Temporaire (302)' => Redirection::REDIRECT_TEMPORARY
                ]
            ])
            ->add('redirectFrom',         TextType::class,            [])
            ->add('redirectTo',           TextType::class,            []);

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
            'data_class' => Redirection::class,
            'csrf_protection' => false
        ]);
    }
}
