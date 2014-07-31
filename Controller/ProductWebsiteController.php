<?php
/*
 * This file is part of the Sulu CMF.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\ProductBundle\Controller;

use Sulu\Bundle\ProductBundle\Product\Exception\ProductNotFoundException;
use Sulu\Bundle\ProductBundle\Product\ProductManagerInterface;
use Sulu\Component\Webspace\Analyzer\RequestAnalyzerInterface;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * This Controller is responsible for the rendering of the product
 * @package Sulu\Bundle\ProductBundle\Controller
 */
class ProductWebsiteController
{
    /**
     * @var EngineInterface
     */
    private $templating;

    /**
     * @var ProductManagerInterface
     */
    private $productManager;

    /**
     * @var RequestAnalyzerInterface
     */
    private $requestAnalyzer;

    public function __construct(
        EngineInterface $templating,
        ProductManagerInterface $productManager,
        RequestAnalyzerInterface $requestAnalyzer
    ) {
        $this->templating = $templating;
        $this->productManager = $productManager;
        $this->requestAnalyzer = $requestAnalyzer;
    }

    public function displayAction($id)
    {
        $product = $this->productManager->findByIdAndLocale(
            $id,
            $this->requestAnalyzer->getCurrentLocalization()->getLocalization()
        );

        if ($product) {
            return new Response($product->getName());
        } else {
            return new Response('404');
        }
    }
} 
