<?php

namespace App\Form\Admin\Content;

use App\Form\Admin\AdminBaseFormType;
use App\Manager\ContentTypeManager;
use App\Manager\FormManager;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeParametersType extends AdminBaseFormType
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
            FormEvents::PRE_SUBMIT,
            [$this, 'onPreSubmit']
        );

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                $this->fm->onPreSetData($event);
            }
        );
    }

    public function onPreSubmit(FormEvent $event): void
    {
        $form = $event->getForm();
        if (!$form->getParent()->has('type')) {
            return;
        }

        $type = $form->getParent()->get('type')->getData();
        if (null === $type) {
            return;
        }

        $component = $this->ctm->getContentTypeFieldFromType($type);
        $parameters = $component::getParameters();

        foreach ($parameters as $paramKey => $paramValue) {
            $options = (isset($paramValue['options']) ? $paramValue['options'] : []);
            $options = array_replace(['property_path' => '[' . $paramKey . ']'], $options);

            $form->add(
                $paramKey,
                $paramValue['class'],
                $options
            );
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null
        ]);
    }
}
