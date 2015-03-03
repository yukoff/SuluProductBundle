<?php
/*
 * This file is part of the Sulu CMS.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\ProductBundle\Api;

use Sulu\Bundle\ProductBundle\Entity\CountryTax as Entity;
use JMS\Serializer\Annotation\VirtualProperty;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\ExclusionPolicy;
use Sulu\Bundle\ProductBundle\Entity\TaxClassTranslation;
use Sulu\Component\Rest\ApiWrapper;

/**
 * The TaxClass class which will be exported to the API
 *
 * @package Sulu\Bundle\ProductBundle\Api
 * @ExclusionPolicy("all")
 */
class CountryTax extends ApiWrapper
{
    /**
     * @param Entity $entity
     * @param string $locale
     */
    public function __construct(Entity $entity, $locale)
    {
        $this->entity = $entity;
        $this->locale = $locale;
    }

    /**
     * The id of the CountryTax
     * @return int
     * @VirtualProperty
     * @SerializedName("id")
     */
    public function getId()
    {
        return $this->entity->getId();
    }

    /**
     * Country of the CountryTax
     * @return string
     * @VirtualProperty
     * @SerializedName("country")
     */
    public function getCountry()
    {
        return $this->entity->getCountry();
    }

    /**
     * Country of the CountryTax
     * @return string
     */
    public function getTaxClass()
    {
        return new TaxClass($this->entity->getTaxClass(), $this->locale);
    }

    /**
     * Get tax
     * @return float
     * @VirtualProperty
     * @SerializedName("tax")
     */
    public function getTax()
    {
        return $this->entity->getTax();
    }
}
