<?php

namespace App\Form\Admin\Content;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Content\ContentTypeField;
use App\Manager\ContentTypeManager;
use App\Manager\FormManager;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldType extends AdminBaseFormType
{
    protected const ENTITY_CLASS = ContentTypeField::class;

    protected $ctm;

    public function __construct(ContentTypeManager $ctm, FormManager $fm)
    {
        parent::__construct($fm);

        $this->ctm = $ctm;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title',                TextType::class,            [])
            ->add('name',                 TextType::class,            [])
            ->add('helper',               TextareaType::class,        [])
            ->add('type',                 ChoiceType::class,          [
                'choices' => array_flip($this->ctm->getFieldsSelect())
            ])
            ->add('options',              ContentTypeOptionsType::class,     [])
            ->add('validations',          ContentTypeValidationsType::class, [])
            ->add('parameters',           ContentTypeParametersType::class,  []);

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
            'data_class' => ContentTypeField::class
        ]);
    }
}
