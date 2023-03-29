<?php

namespace App\Service\Rendering;

use Limenius\ReactRenderer\Renderer\PhpExecJsReactRenderer;
use Symfony\Component\Asset\Packages;

class CustomPhpExecJsReactRenderer extends PhpExecJsReactRenderer
{
    /**
     * @param Packages $packages
     * @param string   $serverBundlePath
     */
    public function setPackage(Packages $packages, string $serverBundlePath)
    {
        $this->serverBundlePath .= $packages->getUrl($serverBundlePath);
    }
}