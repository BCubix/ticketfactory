<?php

namespace App\Form\Admin\User;

use App\Entity\User\Profile;
use App\Form\Admin\AdminBaseFormType;
use App\Entity\User\User;
use App\Repository\ProfileRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('email',                EmailType::class,           [])
            ->add('plainPassword',        PasswordType::class,        [])
            ->add('firstName',            TextType::class,            [])
            ->add('lastName',             TextType::class,            [])
            ->add('profiles',             EntityType::class,          [
                'class'         => Profile::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'query_builder' => function (ProfileRepository $pr) {
                    return $pr
                        ->createQueryBuilder('p')
                        ->orderBy('p.name', 'ASC');
                }
            ]);

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
            'data_class' => User::class,
            'csrf_protection' => false
        ]);
    }
}
