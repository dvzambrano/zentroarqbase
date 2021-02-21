<?php

/**
 * Module
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @package    SGArqBase
 * @subpackage model
 * @author     MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
class Module extends BaseModule {

    public function getIconName() {
        $icon = explode('.', $this->getIcon());
        if (count($icon) > 0)
            return $icon[0];
        return '';
    }

    public function isTree() {
        $relations = json_decode($this->getRelations(), true);
        foreach ($relations as $relation)
            if ($relation['moduleid'] == $this->getNick() && stripos($relation['attributeid'], 'parent') > -1)
                return true;

        return false;
    }

}