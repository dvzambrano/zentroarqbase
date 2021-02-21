<?php

/**
 * PersonTable
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 */
class sfPersonTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object PersonTable
     */
    public static function getInstance() {
        return Doctrine_Core::getTable('Person');
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
                    array('name' => 'nick', 'type' => 'string'),
                    array('name' => 'phone', 'type' => 'string'),
                    array('name' => 'cellphone', 'type' => 'string'),
                    array('name' => 'address', 'type' => 'string'),
                    array('name' => 'comment', 'type' => 'string'),
                    array('name' => 'picture', 'type' => 'string'),
                    array('name' => 'full_name', 'type' => 'string'),
                    array('name' => 'email_address', 'type' => 'string'),
                    array('name' => 'customicon', 'type' => 'string'),
                    array('name' => 'deleteable', 'type' => 'bool'),
                    array('name' => 'sfGuardUser')
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

    const table = 'Person';
    const akfield = 'code';

    public static function getAllPaged($start, $limit, $filters, $simple = false) {
        $query = BaseTable::getAllPaged(self::table, $start, $limit, $filters);
        if ($simple)
            return $query['results'];
        return self::formatData($query['results'], $query['page'], $query['count']);
    }

    public static function findByAK($ak) {
        return BaseTable::findByAK(self::table, self::akfield, $ak);
    }

    public static function getAll($filters = array(), $simple = false) {
        $q = Doctrine_Query::create()
                ->select('t.*')
                ->from(self::table . ' t')
                ->leftJoin('t.sfGuardUser u');

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
            $q->addWhere('u.username LIKE ? OR u.email_address  LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?', array('%' . $query . '%', '%' . $query . '%', '%' . $query . '%', '%' . $query . '%'));

        return self::formatData($q->execute(), 1, $q->count());
    }

    public static function deleteByPK($pks) {
        return BaseTable::deleteByPK(self::getInstance(), $pks);
    }

}
