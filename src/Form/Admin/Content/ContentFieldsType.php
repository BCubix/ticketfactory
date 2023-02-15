<?php

namespace App\Form\Admin\Content;

use App\Manager\ContentTypeManager;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\DataMapperInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentFieldsType extends AbstractType implements DataMapperInterface
{
    protected $ctm;

    public function __construct(ContentTypeManager $ctm)
    {
        $this->ctm = $ctm;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            [$this, 'onPreSetData']
        );

        $builder->setDataMapper($this);
    }

    public function onPreSetData(FormEvent $event): void
    {
        $form = $event->getForm();
        $contentType = $form->getConfig()->getOptions()['content_type'];

        foreach ($contentType->getFields() as $field) {
            $options = $this->ctm->getOptionsFromField($field);
            $options = array_replace(['property_path' => '[' . $field->getName() . ']'], $options);

            $form->add(
                $field->getName(),
                $this->ctm->getContentTypeFieldFromType($field->getType()),
                $options
            );
        }
    }

    public function mapDataToForms($viewData, \Traversable $forms): void
    {
        if (null === $viewData) {
            return;
        }

        if (!is_array($viewData)) {
            throw new UnexpectedTypeException($viewData, 'array');
        }

        $forms = iterator_to_array($forms);

        foreach ($forms as $formKey => $form) {
            foreach($viewData as $dataKey => $dataVal) {
                if ($dataKey == $formKey) {
                    $forms[$formKey]->setData($dataVal);
                    break;
                }
            }
        }
    }

    public function mapFormsToData(\Traversable $forms, &$viewData): void
    {
        $forms = iterator_to_array($forms);

        $viewData = [];
        foreach ($forms as $key => $field) {
            $viewData[$key] = $forms[$key]->getData();
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null
        ]);

        $resolver->setRequired('content_type');
    }
}
