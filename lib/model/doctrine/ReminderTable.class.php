<?php

/**
 * ReminderTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class ReminderTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object ReminderTable
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
                    array('name' => 'value', 'type' => 'int'),
                    array('name' => 'period', 'type' => 'int'),
                    array('name' => 'customicon', 'type' => 'string'),
                    array('name' => 'deleteable', 'type' => 'bool')
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

    const table = 'Reminder';
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
        return self::getAllPaged(0, PHP_INT_MAX, $filters, $simple);
    }

    public static function deleteByPK($pks) {
        return BaseTable::deleteByPK(self::getInstance(), $pks);
    }

    // for importing from filepurposes. DO NOT DELETE!
    public static function getRebuilded($array = array()) {
        $reminder = false;

        if (!$reminder && $array['code'] != '')
            $reminder = Doctrine::getTable('Reminder')->findByAK($array['code']);

        if (!$reminder && $array['id'] > 0) {
            $reminder = new Reminder();
            $reminder->fromArray($array);
            $reminder->save();
        }

        return $reminder;
    }

    //[getByParentMethod]
}