<?php

namespace App\Form\Admin\Content;

use App\Form\Admin\AdminBaseFormType;
use App\Manager\ContentTypeManager;
use App\Manager\FormManager;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentFieldsType extends AdminBaseFormType
{
    protected $ctm;

    public function __construct(ContentTypeManager $ctm, FormManager $fm)
    {
        parent::__construct($fm);

        $this->ctm = $ctm;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            [$this, 'onPreSetData']
        );

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                $this->fm->onPreSetData($event);
            }
        );
    }

    public function onPreSetData(FormEvent $event): void
    {
        $form = $event->getForm();
        $contentTypes = $form->getConfig()->getOptions()['contentTypes'];

        foreach ($contentTypes as $contentType) {
            $options = [];
            $component = $this->ctm->getContentTypeFieldFromType($contentType['type']);

            if (isset($contentType['children'])) {
                if ($contentType['type'] == 'collection') {
                    $options['entry_options'] = ['contentTypes' => $contentType['children']];
                } else {
                    $options['contentTypes'] = $contentType['children'];
                }
            }

            if (isset($contentType['choices'])) {
                $options['choices'] = $component::getChoicesFromString($contentType['choices']);
            }

            $form->add(
                $contentType['name'],
                $component,
                $options
            );
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
            'contentTypes'   => []
        ]);
    }
}
