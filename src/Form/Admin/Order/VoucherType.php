<?php

namespace App\Form\Admin\Order;

use App\Entity\Order\Voucher;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\OptionsResolver\OptionsResolver;

class VoucherType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name',                 TextType::class,            [])
            ->add('code',                 TextType::class,            [])
            ->add('discount',             TextType::class,            [])
            ->add('unit',                 ChoiceType::class,          [
                'required' => true,
                'multiple' => false,
                'expanded' => false,
                'choices'  => array_flip(Voucher::DISCOUNT_TYPE)
            ])
            ->add('beginDate',            DateType::class,            [
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'yyyy-MM-dd',
                'html5'          => false
            ])
            ->add('endDate',              DateType::class,            [
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'yyyy-MM-dd',
                'html5'          => false
            ])
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
        ;

        
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Voucher::class
        ]);
    }
}
