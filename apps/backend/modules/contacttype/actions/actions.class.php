<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage contacttype
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */
class contacttypeActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {

            case 'combo':
            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');

                $rows = ContacttypeTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $contacttype = array();
        $ak = Util::generateCode($request->getParameter('name'));

        if ($request->getParameter('id') != '')
            $contacttype = Doctrine::getTable('Contacttype')->find($request->getParameter('id'));

        if ($contacttype == array()) {
            $contacttype = Doctrine::getTable('Contacttype')->findByAK($ak);
            if ($contacttype)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('contacttype.field.label', 'contacttype.field.name', $request->getParameter('name'))
                        )));
            $contacttype = new Contacttype();
        }
        else {
            $testobj = Doctrine::getTable('Contacttype')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $contacttype->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('contacttype.field.label', 'contacttype.field.name', $request->getParameter('name'))
                        )));
        }

        $contacttype->setCode($ak);
        $contacttype->setName($request->getParameter('name'));
        $contacttype->setComment($request->getParameter('comment'));

        $contacttype->save();
        sfContext::getInstance()->getLogger()->alert('Salvado tipo de tipo de contacto ' . $contacttype->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        return $contacttype->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Contacttype')->deleteByPK($pks);
    }

}
