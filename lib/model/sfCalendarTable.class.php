<?php

/**
 * CalendarTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class sfCalendarTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object CalendarTable
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
                    array('name' => 'name', 'type' => 'string'),
                    array('name' => 'comment', 'type' => 'string'),
                    array('name' => 'customicon', 'type' => 'string'),
                    array('name' => 'deleteable', 'type' => 'bool'),
                    array('name' => 'customcolor', 'type' => 'string')
                ),
                'sortInfo' => array(
                    'field' => 'id',
                    'direction' => 'ASC'
                )
            ),
            'success' => true,
            'message' => 'app.msg.info.loadedsuccessful',
            'results' => $count,
            'data' => is_array($array) ? $array : $array->toArray(),
            'page' => $page
        );
    }

    const table = 'Calendar';
    const akfield = 'code';

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        $select = 'rs.*, rs.customcolor as customcolor';
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array(), array(), false, $select);
        if ($simple)
            return $query['results'];
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    public static function findByAK($ak) {
        return BaseTable::findByAK(self::table, self::akfield, $ak);
    }

    public static function getAll($filters = array(), $simple = false) {
        $select = 'rs.*, rs.customcolor as customcolor';
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters, array(), array(), false, $select);
        if ($simple)
            return $query['results'];
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    public static function getAll1($query, $distinct = false, $filters = array()) {
        $q = Doctrine_Query::create()
                ->select('t.*')
                ->from(self::table . ' t');

        if ($distinct) {
            $where = '';
            $params = array();
            for ($i = 0; $i < count($distinct); $i++) {
                if ($i == 0)
                    $where = $where . 't.id != ?';
                else
                    $where = $where . ' AND t.id != ?';
                $params[] = $distinct[$i]->id;
            }
            $q->addWhere($where, $params);
        }

        if ($filters)
            $q = BaseTable::processFilters($q, $filters, 't');

        if ($query && $query != '')
            $q->addWhere('t.name LIKE ?', array('%' . $query . '%'));

        return self::formatData($q->execute(), 1, $q->count());
    }

    public static function deleteByPK($pks) {
        return BaseTable::deleteByPK(self::getInstance(), $pks);
    }

    //[getByParentMethod]
}