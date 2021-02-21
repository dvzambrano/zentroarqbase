<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage person
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class sfPersonActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {

            case 'combo':
            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');
				
				// this was commented i dont know why. if recommented then in ZentroInstructorI, access level on plans by groups fail!!
                $rows = PersonTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $person = Doctrine::getTable('sfGuardUser')->find($request->getParameter('id'))->getPerson();

        $person->setComment($request->getParameter('comment'));
        $person->setPicture($request->getParameter('picture'));

        $values = json_decode($request->getParameter('values'));
        $indexes = json_decode($request->getParameter('indexes'));
        $profile = array();
        for ($index = 0; $index < count($indexes); $index++)
            $profile[$indexes[$index]] = $values[$index];
        $person->setProfile(json_encode($profile));


        $person->save();
        sfContext::getInstance()->getLogger()->alert('Salvada persona ' . $person->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        return $person->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Person')->deleteByPK($pks);
    }

}
