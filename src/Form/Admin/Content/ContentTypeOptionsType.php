<?php

namespace App\Form\Admin\Content;

use App\Manager\ContentTypeManager;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeOptionsType extends AbstractType
{
    protected $ctm;

    public function __construct(ContentTypeManager $ctm)
    {
        $this->ctm = $ctm;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
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
        $options = $component::getOptions();

        foreach ($options as $optionKey => $optionValue) {
            $optOptions = (isset($optionValue['options']) ? $optionValue['options'] : []);
            $optOptions = array_replace(['property_path' => '[' . $optionKey . ']'], $optOptions);

            $form->add(
                $optionKey,
                $optionValue['class'],
                $optOptions
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
