<?php

namespace App\Form\Admin\Page;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Page\PageBlock;
use App\Entity\Language\Language;
use App\Entity\Page\PageBlockType as PagePageBlockType;
use App\Form\Admin\Content\ContentFieldsType;
use App\Repository\LanguageRepository;
use App\Repository\PageBlockTypeRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageBlockType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name',                 TextType::class,            [])
            ->add('saveAsModel',          CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('class',                TextType::class,            ['required' => false, 'empty_data' => ''])
            ->add('columns',              CollectionType::class,      [
                'entry_type'   => PageColumnType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
            ->add('lang',                 EntityType::class,          [
                'class'         => Language::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (LanguageRepository $lr) {
                    return $lr
                        ->createQueryBuilder('l')
                        ->orderBy('l.name', 'ASC');
                }
            ])
            ->add('pageBlockType',         EntityType::class,          [
                'class'         => PagePageBlockType::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (PageBlockTypeRepository $pbtr) {
                    return $pbtr
                        ->createQueryBuilder('pbt')
                        ->orderBy('pbt.name', 'ASC');
                }
            ])
            ->add('languageGroup',        UuidType::class,            []);


        $builder->get('pageBlockType')->addEventListener(FormEvents::POST_SUBMIT, [$this, 'onPostSubmit']);

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                $this->fm->onPreSetData($event);
            }
        );
    }

    public function onPostSubmit(FormEvent $event): void
    {
        $form = $event->getForm();
        $pageBlockType = $form->getData();

        if ($pageBlockType) {
            $contentTypes = $this->getContentTypes($pageBlockType->getFields());

            $form->getParent()->add(
                'fields',
                PageBlockFieldsType::class,
                ['contentTypes' => $contentTypes]
            );
        }
    }
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => PageBlock::class,
            'csrf_protection' => false
        ]);
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

            if (isset($field->getParameters()['fields'])) {
                $contentType['children'] = $this->getContentTypes($field->getParameters()['fields']);
            }

            if (isset($field->getParameters()['choices'])) {
                $contentType['choices'] = $field->getParameters()['choices'];
            }

            $contentTypes[] = $contentType;
        }

        return $contentTypes;
    }
}
