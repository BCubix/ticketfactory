<?php

namespace App\Form\Admin\Content;

use App\Entity\Content\ContentTypeField;
use App\Manager\ContentTypeManager;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldType extends AbstractType
{
    protected $ctm;

    public function __construct(ContentTypeManager $ctm)
    {
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
            ->add('options',              CollectionType::class,      [
                'entry_type'   => ContentTypeOptionType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
            ->add('validations',          CollectionType::class,      [
                'entry_type'   => ContentTypeValidationType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ContentTypeField::class
        ]);
    }
}
