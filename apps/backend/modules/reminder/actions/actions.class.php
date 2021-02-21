<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage reminder
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class reminderActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {
            case 'combo':
            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');
                $rows = ReminderTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $reminder = array();
        $ak = Util::generateCode($request->getParameter('name'));

        if ($request->getParameter('id') != '')
            $reminder = Doctrine::getTable('Reminder')->find($request->getParameter('id'));

        if ($reminder == array()) {
            $reminder = Doctrine::getTable('Reminder')->findByAK($ak);
            if ($reminder)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('reminder.field.label', 'reminder.field.name', $request->getParameter('name'))
                        )));
            $reminder = new Reminder();
        }

        $reminder->setName($request->getParameter('name'));
        $reminder->setComment($request->getParameter('comment'));
        $reminder->setValue($request->getParameter('value'));
        $reminder->setPeriod($request->getParameter('period_id'));


        $reminder->setName($request->getParameter('name'));
        $reminder->setCode($ak);

        $reminder->save();
        sfContext::getInstance()->getLogger()->alert('Salvado recordatorio ' . $reminder->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');
        
        return $reminder->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Reminder')->deleteByPK($pks);
    }

}
