<?php

namespace App\Form\Admin\User;

use App\Entity\User\User;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email',                EmailType::class,           [])
            ->add('plainPassword',        PasswordType::class,        [])
            ->add('firstName',            TextType::class,            [])
            ->add('lastName',             TextType::class,            [])
            ->add('roles', ChoiceType::class, [
                'required' => true,
                'multiple' => false,
                'expanded' => false,
                'choices'  => array_flip(User::ROLE_TYPE)
            ])
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
        ;

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
            ))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class
        ]);
    }
}
