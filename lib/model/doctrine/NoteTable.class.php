<?php

/**
 * NoteTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class NoteTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object NoteTable
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
                    array('name' => 'comment', 'type' => 'string'),
                    array('name' => 'increase', 'type' => 'string'),
                    array('name' => 'entity', 'type' => 'string'),
                    array('name' => 'entityid', 'type' => 'string'),
                    array('name' => 'person_id', 'type' => 'int'),
                    array('name' => 'parentid', 'type' => 'int'),
                    array('name' => 'json', 'type' => 'string'),
                    array('name' => 'ident', 'type' => 'int'),
                    array('name' => 'created_at', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'updated_at', 'type' => 'date', 'dateFormat' => 'Y-m-d H:i:s'),
                    array('name' => 'ident', 'type' => 'int'),
                    array('name' => 'Person')
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

    const table = 'Note';
    const akfield = 'name';

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        $select = 'p.*, u.*, t.increase, t.created_at';
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array('t.Person p', 'p.sfGuardUser u'), array(), 't.increase, t.created_at', $select);
        if ($simple)
            return $query['results'];

        // formating this way beacouse i dont know how to calculate ident in dql :(
        $data = self::formatData($query['results'], $query['page'], $query['count']);
        for ($index = 0; $index < count($data['data']); $index++) {
            $data['data'][$index]['ident'] = $query['results'][$index]->getIdent();
        }

        return $data;
    }

    public static function findByAK($ak) {
        return BaseTable::findByAK(self::table, self::akfield, $ak);
    }

    public static function getAll($filters = array(), $simple = false) {
        return self::getAllPaged(0, PHP_INT_MAX, $filters, $simple);
    }

    public static function deleteByPK($pks) {
        return BaseTable::deleteByPK(self::getInstance(), $pks);
    }

    public static function getForEntity($entity = false, $entityid = false, $limit = false, $orderby = false, $nullamount = true) {
        $filters = array();

        if ($entity && $entity != '') {
            $obj = new stdClass();
            $obj->type = "string";
            $obj->field = "entity";
            $obj->comparison = "eq";
            $obj->value = $entity;
            $filters[] = $obj;
        }
        if ($entityid && $entityid != '') {
            $obj = new stdClass();
            $obj->type = "string";
            $obj->field = "entityid";
            $obj->comparison = "eq";
            $obj->value = $entityid;
            $filters[] = $obj;
        }
        if (!$nullamount) {
            $obj = new stdClass();
            $obj->field = "amount";
            $obj->comparison = "notnull";
            $filters[] = $obj;
        }

        $select = 'p.*, u.*, t.increase, t.created_at';
        $order = 't.increase, t.created_at';
        if ($orderby)
            $order = $orderby;
        $query = BaseTable::getAllPaged(self::table, 0, $limit, $filters, array('t.Person p', 'p.sfGuardUser u'), array(), $order, $select);
        
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    //[getByParentMethod]
}