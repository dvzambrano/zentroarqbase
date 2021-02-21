<?php

/**
 * Entity
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @package    SGArqBase
 * @subpackage model
 * @author     MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
class Entity extends sfEntity {

    public function getLegalImportant($representant = true, $important = true) {
        $array = array();
        
        if($representant){
            $rows = sfGuardUserTable::getInstance()->getAll(json_decode(stripslashes('[{"type":"string","value":"legalrepresentant__true","field":"profile"},{"type":"int","value":' . $this->getId() . ',"field":"entityid"}]')));
            foreach ($rows["data"] as $user) 
                if (!isset($array[$user['id']]))
                    $array[$user['id']] = $user;
        }
        if($important){
            $rows = sfGuardUserTable::getInstance()->getAll(json_decode(stripslashes('[{"type":"string","value":"legalimportant__true","field":"profile"},{"type":"int","value":' . $this->getId() . ',"field":"entityid"}]')));
            foreach ($rows["data"] as $user) 
                if (!isset($array[$user['id']]))
                    $array[$user['id']] = $user;
        }
        
        $result = array();
        foreach ($array as $value) {
            $result[] = $value;
        }

        return json_encode(array('persons' => $result));
    }

}