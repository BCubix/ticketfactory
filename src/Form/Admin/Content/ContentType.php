<?php

namespace App\Form\Admin\Content;

use App\Entity\Content\Content;
use App\Entity\Language\Language;
use App\Repository\LanguageRepository;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('title',                TextType::class,            [])
            ->add('slug',                 TextType::class,            [])
            ->add('lang',                 EntityType::class,          [
                'class'         => Language::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (LanguageRepository $lr) {
                    return $lr
                        ->createQueryBuilder('l')
                        ->orderBy('l.name', 'ASC')
                    ;
                }
            ])
            ->add('languageGroup',        UuidType::class,            [])
        ;

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            [$this, 'onPreSetData']
        );
    }

    public function onPreSetData(FormEvent $event): void
    {
        $form = $event->getForm();
        $contentType = $form->getConfig()->getOptions()['content_type'];

        $contentTypes = $this->getContentTypes($contentType->getFields());

        $form->add(
            'fields',
            ContentFieldsType::class,
            ['contentTypes' => $contentTypes]
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Content::class
        ]);

        $resolver->setRequired('content_type');
    }

    private function getContentTypes(array $fields): array
    {
        $contentTypes = [];
        foreach ($fields as $field) {
            $contentType = [
                'name'  => $field->getName(),
                'title' => $field->getTitle(),
                'type'  => $field->getType()
            ];

            if (
                count($field->getParameters()) > 0 &&
                isset($field->getParameters()['fields'])
            ) {
                $contentType['children'] = $this->getContentTypes($field->getParameters()['fields']);
            }

            if (
                count($field->getParameters()) > 0 &&
                isset($field->getParameters()['choices'])
            ) {
                $contentType['choices'] = $field->getParameters()['choices'];
            }

            $contentTypes[] = $contentType;
        }

        return $contentTypes;
    }
}
