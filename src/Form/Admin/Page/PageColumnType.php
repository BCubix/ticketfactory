<?php

namespace App\Form\Admin\Page;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Page\PageColumn;
use App\Manager\FormManager;
use App\Manager\PageManager;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnType extends AdminBaseFormType
{
    protected $pm;

    public function __construct(PageManager $pm, FormManager $fm)
    {
        parent::__construct($fm);

        $this->pm = $pm;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('content',              null,                       [])
            ->add('class',                TextType::class,            ['required' => false, 'empty_data' => ''])
            ->add('type',                 ChoiceType::class,          [
                'choices' => array_flip($this->pm->getFieldsSelect())
            ])
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
            FormEvents::SUBMIT,
            [$this, 'onSubmit']
        );
    }

    public function onSubmit(FormEvent $event): void
    {
        $form = $event->getForm();
        if (!$form->has('type')) {
            return;
        }

        $type = $form->get('type')->getData();
        if (null === $type) {
            return;
        }

        $component = $this->pm->getPageColumnFieldFromType($type);
        $options = $this->pm->getPageColumnInstanceFromType($type)->getFormOptions();
        $form->add(
            'content',
            $component,
            $options
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => PageColumn::class,
            'csrf_protection' => false
        ]);
    }
}
