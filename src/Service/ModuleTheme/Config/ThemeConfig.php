<?php

namespace App\Service\ModuleTheme\Config;

use App\Utils\FileManipulator;

class ThemeConfig extends ConfigAbstract
{
    /**
     * @throws \Exception
     */
    public function install() {
        $this->entry(false);
    }

    /**
     * @throws \Exception
     */
    public function uninstall() {
        $this->entry(true);
    }

    /**
     * Inject or remove entry in webpack.
     *
     * @throws \Exception
     */
    private function entry(bool $remove)
    {
        $webpackFilePath = $this->projectDir . '/webpack.config.js';

        $file = new FileManipulator($webpackFilePath);
        $content = $file->getContent();

        $needleAppEntry= ".addEntry('app', './themes/Admin/default/assets/index.js')";
        $needleWebsiteEntry = ".addEntry('website', './themes/Website/" . static::NAME . "/assets/index.js')";

        // Find position of the end of app entry in content
        $position = $file->getPosition($needleAppEntry) + strlen($needleAppEntry);
        // Add content start the beginning content to the end of app entry
        $newContent = substr($content, 0, $position);

        if (!$remove) {
            // Add website entry
            $newContent .= PHP_EOL . "    " . $needleWebsiteEntry;
        } else {
            // Find position of the end of website entry in content
            $position = $file->getPosition($needleWebsiteEntry) + strlen($needleWebsiteEntry);
        }

        // Add rest of content
        $newContent .= substr($content, $position);

        $file->setContent($newContent);
    }
}