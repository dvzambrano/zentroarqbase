<?php

/**
 * module actions.
 *
 * @package    SGARQBASE
 * @subpackage metadata
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class metadataActions extends sfBaseActions {

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        $obj = new stdClass();
        $obj->type = "bool";
        $obj->field = "is_visible";
        $obj->comparison = "eq";
        $obj->value = true;
        $filter[] = $obj;

        switch ($request->getParameter('component')) {
            case 'combo':
            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');
                $rows = MetadataTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;
            case 'util':
                $number = 0;
                if ($request->getParameter('number') && $request->getParameter('number') != '') {
                    $number = $request->getParameter('number');
                    if ($number < 0)
                        $number = $number * (-1);
                }
                $rows = array(
                    'success' => true,
                    'message' => 'app.msg.info.loadedsuccessful',
                    'data' => Util::getNumberSpell($number)
                );
                break;
            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $metadata = array();

        $ak = Util::generateCode($request->getParameter('name'));

        if ($request->getParameter('id') != '')
            $metadata = Doctrine::getTable('Metadata')->find($request->getParameter('id'));

        if ($metadata == array()) {
            $metadata = Doctrine::getTable('Metadata')->findByAK($request->getParameter('name'));
            if ($metadata)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('metadata.field.label', 'metadata.field.name', $request->getParameter('name'))
                        )));
            $metadata = new Metadata();
        }

        $metadata->setName($request->getParameter('name'));
        $metadata->setValue($request->getParameter('value'));
        if ($request->getParameter('category') && $request->getParameter('category') != '')
            $metadata->setCategory($request->getParameter('category'));
        else
            $metadata->setCategory(' ');

        $metadata->save();
        sfContext::getInstance()->getLogger()->alert('Salvada configuracion ' . $metadata->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        return $metadata->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Metadata')->deleteByPK($pks, $this->getUser()->getUsername());
    }

}
