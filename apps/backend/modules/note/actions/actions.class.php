<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage note
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class noteActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = array();

        if ($request->getParameter('entity') && $request->getParameter('entity') != '') {
            $obj = new stdClass();
            $obj->type = "string";
            $obj->field = "entity";
            $obj->comparison = "eq";
            $obj->value = $request->getParameter('entity');


            $filter[] = $obj;
        }

        if ($request->getParameter('entityid') && $request->getParameter('entityid') != '') {
            $obj = new stdClass();
            $obj->field = "entityid";
            $obj->value = $request->getParameter('entityid');
            $filter[] = $obj;
        }

        switch ($request->getParameter('component')) {
            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');

                $rows = NoteTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;
            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $note = array();

        if ($request->getParameter('id') != '')
            $note = Doctrine::getTable('Note')->find($request->getParameter('id'));

        if ($note == array()) {
            $note = new Note();
        }

        $note->setEntity($request->getParameter('entity'));
        $note->setEntityid($request->getParameter('entityid'));
        $note->setComment($request->getParameter('comment'));
        $note->setPersonId($request->getParameter('personid'));
        $note->setJson($request->getParameter('json'));
		if($request->getParameter('json') && $request->getParameter('json')!=''){
			$json = json_decode($request->getParameter('json'), true);
			// if JSON contains 4th elements is because the value should be manipulated by a class
			if(count($json)>3){
				for($index = 0; $index < count($json[0]); $index++){
					//[["dateField","numberField","contractField"],["2020-12-05T00:00:00","1","202012-22"],["05/12/2020","1","202012-22"],["","Contract::getSuplementNumber",""]]
					//[["dateField","reclamationtypeCombo","numberField","hiddenField","receptiondateField","reclamaionstatusCombo"],["2020-12-06T00:00:00",1,"","","2020-12-16T00:00:00",""],["06/12/2020","Impagos","","","16/12/2020",""],["","","Contract::getReclamationNumber","","",""]]
					if($json[3][$index] && $json[3][$index] != ''){
						$evaluate = create_function('', "return ".$json[3][$index]."('".$request->getParameter('json')."');"); 
						$json[1][$index] = $evaluate($json[1][$index]); 
						$json[2][$index] = $json[1][$index]; 
					}
				}
				
				$note->setJson(json_encode($json));
			}
		}
        $note->setIncrease(PHP_INT_MAX . '');

        if ($request->getParameter('noteid') && $request->getParameter('noteid') != '') {
            $note->setParentid($request->getParameter('noteid'));

            $n = Doctrine::getTable('Note')->find($request->getParameter('noteid'));
            $note->setIncrease($n->getIncrease());
        }

        $note->save();
        sfContext::getInstance()->getLogger()->alert('Salvada nota ' . $note->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        BaseTable::orderByIncrease('Note', true, $note->getParentid());

        return $note->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode($request->getParameter('ids'));
        return Doctrine::getTable('Note')->deleteByPK($pks);
    }

}
