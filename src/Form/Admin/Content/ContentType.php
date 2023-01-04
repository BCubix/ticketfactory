<?php

namespace App\Form\Admin\Content;

use App\Entity\Content\Content;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $contentType = $options['content_type'];

        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('title',                TextType::class,            [])
            ->add('slug',                 TextType::class,            [])
            ->add('fields',               ContentFieldsType::class,   [
                'content_type' => $contentType
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Content::class
        ]);

        $resolver->setRequired('content_type');
    }
}
