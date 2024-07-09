<?php

namespace App\Form\Website\Product;

use App\Entity\Product\ProductCategory;
use App\Repository\ProductCategoryRepository;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SearchType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductFilterType extends AbstractType
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $productCategory = $options['productCategory'];

        $builder
            ->add('search',                SearchType::class,         [
                'label' => '',
                'required' => false,
                'attr' => [
                    'placeholder' => "Rechercher...",
                    'minlength'   => 3
                ]
            ])
            ->add('productCategories',     EntityType::class,         [
                'label'         => 'Catégorie',
                'class'         => ProductCategory::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'expanded'      => true,
                'query_builder' => function (ProductCategoryRepository $pcr) use ($productCategory) {
                    $results = $pcr
                        ->createQueryBuilder('pc')
                        ->innerJoin('pc.parent', 'p')
                        ->where('pc.active = 1');

                    if (null !== $productCategory) {
                        $results = $results
                            ->andWhere('p.id = :productCategory')
                            ->orderBy('pc.position', 'ASC');
                    }

                    return $results->setParameter('productCategory', $productCategory);
                }
            ])
            ->add('page',                  HiddenType::class,         [
                'label' => ' ',
                'required' => false
            ]);

        $builder
            ->get('productCategories')
            ->addModelTransformer(new CallbackTransformer(
                function ($ids) {
                    if (null == $ids || count($ids) == 0) {
                        return [];
                    }

                    return $this->em->getRepository(ProductCategory::class)->findAllByIdsForWebsite(1, $ids);
                },
                function ($categories) {
                    if (null == $categories || count($categories) == 0) {
                        return null;
                    }

                    return array_map(fn ($category): int => $category->getId(), $categories);
                }
            ));
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
            'productCategory'    => null,
        ]);
    }
}
