<?php

/**
 * FileTable
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class FileTable extends Doctrine_Table {

    /**
     * Returns an instance of this class.
     *
     * @return object FileTable
     */
    public static function getInstance() {
        return Doctrine_Core::getTable(self::table);
    }

    const table = 'File';
    const akfield = 'code';

    public static function findByAK($ak) {
        return BaseTable::findByAK(self::table, self::akfield, $ak);
    }

    public static function deleteByPK($pks) {
        return BaseTable::deleteByPK(self::getInstance(), $pks);
    }
}