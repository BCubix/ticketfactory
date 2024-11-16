<?php

namespace App\Form\Admin\Profile;

use App\Entity\User\Profile;
use App\Entity\User\Role;
use App\Form\Admin\AdminBaseFormType;
use App\Repository\User\RoleRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
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
            ->add('active',                      CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('name',                        TextType::class,            [])
            ->add('roles',                       EntityType::class,          [
                'class'         => Role::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'query_builder' => function (RoleRepository $ecr) {
                    return $ecr
                        ->createQueryBuilder('rc')
                        ->orderBy('rc.name', 'ASC');
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
            'data_class' => Profile::class,
            'csrf_protection' => false
        ]);
    }
}