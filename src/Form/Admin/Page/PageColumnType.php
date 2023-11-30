<?php

namespace App\Form\Admin\Page;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Page\PageColumn;
use App\Entity\Media\Media;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('xs',                   IntegerType::class,         [])
            ->add('s',                    IntegerType::class,         [])
            ->add('m',                    IntegerType::class,         [])
            ->add('l',                    IntegerType::class,         [])
            ->add('xl',                   IntegerType::class,         []);

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                $this->fm->onPreSetData($event);
            }
        );

        $builder->addEventListener(
            FormEvents::PRE_SUBMIT,
            [$this, 'onSubmit']
        );

        $builder->addEventListener(
            FormEvents::SUBMIT,
            [$this, 'onSubmit']
        );
    }

    public function onSubmit(FormEvent $event): void
    {
        $form = $event->getForm();
        $data = $form->getParent()->getParent()->getData();

        if (isset($data) && $data->getBlockType() == 1) { // Block slider
            $form->add('content',                  EntityType::class,          [
                'class'         => Media::class,
                'choice_label'  => 'title',
                'multiple'      => false
            ]);
        } else {
            $form->add('content',                  TextareaType::class,        []);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => PageColumn::class,
            'csrf_protection' => false
        ]);
    }
}
