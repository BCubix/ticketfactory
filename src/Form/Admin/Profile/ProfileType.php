<?php

namespace App\Form\Admin\Profile;

use App\Entity\User\Profile;
use App\Form\Admin\AdminBaseFormType;

use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProfileType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name',                 TextType::class,           [])
            ->add('roles',                ChoiceType::class,          [
                'required' => true,
                'multiple' => false,
                'expanded' => false,
                'choices'  => array_flip(Profile::ROLE_TYPE)
            ]);

        $builder
            ->get('roles')
            ->addModelTransformer(new CallbackTransformer(
                function ($roles) {
                    if (count($roles) == 0) {
                        return null;
                    }

                    return $roles[0];
                },
                function ($roles) {
                    return [$roles];
                }
            ));

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
            'data_class' => Profile::class,
            'csrf_protection' => false
        ]);
    }
}