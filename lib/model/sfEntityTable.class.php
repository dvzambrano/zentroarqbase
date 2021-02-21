<?php

/**
 * EntityTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class sfEntityTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object EntityTable
     */
    public static function getInstance() {
        return Doctrine_Core::getTable(self::table);
    }

    public static function formatData($array, $page, $count = false) {
        return array(
            'metaData' => array(
                'idProperty' => 'id',
                'root' => 'data',
                'totalProperty' => 'results',
                'fields' => array(
                    array('name' => 'id', 'type' => 'int'),
                    array('name' => 'code', 'type' => 'string'),
                    array('name' => 'name', 'type' => 'string'),
                    array('name' => 'comment', 'type' => 'string'),
                    array('name' => 'logo', 'type' => 'string'),
                    array('name' => 'images'),
                    array('name' => 'path', 'type' => 'string'),
                    array('name' => 'parentid', 'type' => 'int'),
                    array('name' => 'profile'),
                    array('name' => 'customicon', 'type' => 'string'),
                    array('name' => 'deleteable', 'type' => 'bool'),
                    array('name' => 'Entity')
                ),
                'sortInfo' => array(
                    'field' => 'id',
                    'direction' => 'ASC'
                )
            ),
            'success' => true,
            'message' => 'app.msg.info.loadedsuccessful',
            'results' => $count,
            'data' => $array->toArray(),
            'page' => $page
        );
    }

    const table = 'Entity';
    const akfield = 'code';

    public static function getAllPaged($start, $limit, $filters, $simple = false, $where = false) {
        $select = 'true as deleteable, p.*';
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array('t.Entity p'), array(array(
                        'field' => 'entityid',
                        'realfield' => 'id',
                        'char' => 't'
                        )), false, $select, $where);
        if ($simple)
            return $query['results'];
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    public static function findByAK($ak) {
        return BaseTable::findByAK(self::table, self::akfield, $ak);
    }

    public static function getAll($filters = array(), $simple = false) {
        $where = false;
        return self::getAllPaged(0, PHP_INT_MAX, $filters, $simple, $where);
    }

    public static function deleteByPK($pks) {
        return BaseTable::deleteByPK(self::getInstance(), $pks);
    }

    public static function getByParent($filters = array(), $checkeable = false) {
        return BaseTable::getByParent(self::table, $filters, $checkeable);
    }

}
