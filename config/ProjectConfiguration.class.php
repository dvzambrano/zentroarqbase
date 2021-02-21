<?php

//require_once dirname(__FILE__) . '/../lib/symfony/autoload/sfCoreAutoload.class.php';
require_once __DIR__.'/../lib/vendor/autoload.php';
sfCoreAutoload::register();

class ProjectConfiguration extends sfProjectConfiguration {

    public function setup() {
        $this->enablePlugins(array(
            'sfDoctrinePlugin',
            'sfDoctrineGuardPlugin',
            'sfDoctrineGuardExtraPlugin'
        ));
    }

}
