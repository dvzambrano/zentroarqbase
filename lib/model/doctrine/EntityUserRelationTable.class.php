<?php

/**
 * EntityUserRelationTable
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 */
class EntityUserRelationTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object EntityUserRelationTable
     */
    public static function getInstance() {
        return Doctrine_Core::getTable('EntityUserRelation');
    }

    public static function formatData($array, $page, $count = false) {
        return array(
            'metaData' => array(
                'idProperty' => 'id',
                'root' => 'data',
                'totalProperty' => 'results',
                'fields' => array(
                    array('name' => 'entity_id', 'type' => 'int'),
                    array('name' => 'sf_guard_user_id', 'type' => 'int'),
                    array('name' => 'id', 'type' => 'int'),
                    array('name' => 'code', 'type' => 'string'),
                    array('name' => 'name', 'type' => 'string'),
                    array('name' => 'comment', 'type' => 'string')
                ),
                'sortInfo' => array(
                    'field' => 'id',
                    'direction' => 'ASC'
                )
            ),
            'success' => true,
            'message' => 'app.msg.info.loadedsuccessful',
            'results' => $pos,
            'data' => $array->toArray(),
            'page' => $page
        );
    }

    public static function getAll($filters = array(), $simple = false) {
        $q = Doctrine_Query::create()
                ->from('EntityUserRelation cbr');

        if ($query && $query != '')
            $q = Doctrine_Query::create()
                    ->select('cbr.*')
                    ->from('EntityUserRelation cbr')
                    ->where('cbr.sf_guard_user_id = ?', $query);

        return self::formatData($q->execute(), 1, $q->count());
    }

}