<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Product\Product;
use App\Entity\Product\ProductCategory;

class SeoManager extends AbstractManager
{
    public const SERVICE_NAME = 'seo';

    public function completeSeoEvent(Event $event): void
    {
        $keywords = $this->getSeoKeywordEvent($event);
        $seo = $this->getSeoFields($keywords, 'event');
        $event->completeFields($seo['title'], $seo['description']);
    }

    public function completeSeoEventCategory(EventCategory $category): void
    {
        $keywords = $this->getSeoKeywordEventCategory($category);
        $seo = $this->getSeoFields($keywords, 'event_category');
        $category->completeFields($seo['title'], $seo['description']);
    }

    public function completeSeoProduct(Product $product): void
    {
        $keywords = $this->getSeoKeywordProduct($product);
        $seo = $this->getSeoFields($keywords, 'product');
        $product->completeFields($seo['title'], $seo['description']);
    }

    public function completeSeoProductCategory(ProductCategory $category): void
    {
        $keywords = $this->getSeoKeywordProductCategory($category);
        $seo = $this->getSeoFields($keywords, 'product_category');
        $category->completeFields($seo['title'], $seo['description']);
    }

    private function getSeoFields(array $keywords, string $entityName): array
    {
        $metaTitle = $this->mf->get('parameter')->getCoreParameter('seo_' . $entityName . '_title');
        $metaTitle = $this->replaceSeoKeywords($metaTitle, $keywords);

        $metaDescription = $this->mf->get('parameter')->getCoreParameter('seo_' . $entityName . '_description');
        $metaDescription = $this->replaceSeoKeywords($metaDescription, $keywords);

        return ['title' => $metaTitle, 'description' => $metaDescription];
    }

    private function replaceSeoKeywords(?string $subject, array $keywords): ?string
    {
        if (null === $subject) {
            return null;
        }

        foreach ($keywords as $keyword => $replace) {
            $subject = str_replace('%' . $keyword . '%', $replace, $subject);
        }

        return $subject;
    }

    private function getSeoKeywordEvent(Event $event): array
    {
        $eventDateStart = null;
        $eventDateEnd = null;
        if (0 !== count($event->getEventDates())) {
            $dates = $event->getEventDates();

            if (0 !== count($dates)) {
                $date_start = $dates->first()->getEventDate();
                $date_end = $dates->first()->getEventDate();

                foreach ($dates as $date) {
                    if ($date->getEventDate() < $date_start) {
                        $date_start = $date->getEventDate();
                    }
                    if ($date->getEventDate() > $date_end) {
                        $date_end = $date->getEventDate();
                    }
                }

                $eventDateStart = $date_start;
                $eventDateEnd = $date_end;
            }
        }

        $eventPrice = null;
        if (0 !== count($event->getEventPriceCategories())) {
            $prices = [];

            foreach ($event->getEventPriceCategories() as $eventPriceCategory) {
                $prices = array_merge($prices, $eventPriceCategory->getEventPrices()->toArray());
            }
            if (0 !== count($prices)) {
                $min_price = $prices[0]->getPrice();

                foreach ($prices as $price) {
                    if ($price->getPrice() < $min_price) {
                        $min_price = $price->getPrice();
                    }
                }
                $eventPrice = $min_price;
            }
        }

        return [
            'title' => $event->getName(),
            'chapo' => $event->getChapo(),
            'website' => $this->mf->get('parameter')->getCoreParameter('website_name'),
            'category' => $event->getMainCategory()->getName(),
            'date_start' => $eventDateStart->format($event->getLang()->getDateFormat()),
            'date_end' => $eventDateEnd->format($event->getLang()->getDateFormat()),
            'price' => $eventPrice,
        ];
    }

    private function getSeoKeywordEventCategory(EventCategory $category): array
    {
        return [
            'name' => $category->getName(),
        ];
    }

    private function getSeoKeywordProduct(Product $product): array
    {
        return [
            'name' => $product->getName(),
            'chapo' => $product->getChapo(),
            'category' => $product->getMainCategory()->getName(),
            'price' => $product->getPrice(),
        ];
    }

    private function getSeoKeywordProductCategory(ProductCategory $category): array
    {
        return [
            'name' => $category->getName(),
        ];
    }
}
