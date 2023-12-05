<?php

namespace App\Form\Admin\Content;

use App\Form\Admin\AdminBaseFormType;
use App\Manager\ContentTypeManager;
use App\Manager\FormManager;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeValidationsType extends AdminBaseFormType
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
            function (FormEvent $event) {
                $this->fm->onPreSetData($event);
            }
        );

        $builder->addEventListener(
            FormEvents::PRE_SUBMIT,
            [$this, 'onPreSubmit']
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
        $validations = $component::getValidations();

        foreach ($validations as $validKey => $validValue) {
            $options = (isset($validValue['options']) ? $validValue['options'] : []);
            $options = array_replace(['property_path' => '[' . $validKey . ']'], $options);

            $form->add(
                $validKey,
                $validValue['class'],
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
