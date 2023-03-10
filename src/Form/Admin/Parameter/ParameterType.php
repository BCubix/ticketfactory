<?php

namespace App\Form\Admin\Parameter;

use App\Entity\Parameter\Parameter;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ParameterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->addEventListener(FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                $parameter = $event->getData();
                $form = $event->getForm();

                switch ($parameter->getType()) {
                    case "list":
                        $choices = [];
                        foreach ($parameter->getAvailableValue() as $parameter) {
                            $choices += [$parameter['name'] => $parameter['id']];
                        }
                        $form->add('paramValue', ChoiceType::class, [
                            'choices' => $choices,
                        ]);
                        break;

                    // We use a TextType to store the fileName as the upload is handled by the listener
                    case "upload":
                        $form->add('paramValue', TextType::class, []); 
                        break;

                    default:
                        $form->add('paramValue', TextType::class, [
                            'label'    => $parameter->getName(),
                            'required' => false
                        ]);
                        break;
                }
            }
        )
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Parameter::class
        ]);
    }
}
