<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construccion de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage calendar
 * @author     MSc. Donel Vazquez Zambrano
 * @version    1.0.0
 */
class sfCalendarActions extends sfBaseActions {

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        $filter = $this->getFilter($request);

        try {
            switch ($request->getParameter('method')) {
                case 'load':
                    switch ($request->getParameter('component')) {
                        case 'calendar':
                            $mastercolors = false;
                            if ($request->getParameter('mastercolors') && $request->getParameter('mastercolors') != '')
                                $mastercolors = json_decode($request->getParameter('mastercolors'));

                            $rows = CalendarTable::getInstance()->getAll($filter);

                            $response['calendars'] = array();
                            foreach ($rows['data'] as $value) {
                                $response['calendars'][] = array(
                                    'id' => $value['id'],
                                    'title' => $value['name'],
                                    'color' => $value['color'],
                                    'customcolor' => !$value['customcolor'] && $mastercolors && count($mastercolors) > 0 ? $mastercolors[rand(0, count($mastercolors) - 1)] : $value['customcolor']
                                );
                            }
                            break;
                        case 'event':
                            $response['evts'] = array();


                            if ($request->getParameter('start') && $request->getParameter('start') != '') {
                                $obj = new stdClass();
                                $obj->type = "date";
                                $obj->field = "start";
                                $obj->comparison = "get";
                                $obj->value = $request->getParameter('start');
                                $filter[] = $obj;
                            }

                            if ($request->getParameter('end') && $request->getParameter('end') != '') {
                                $obj = new stdClass();
                                $obj->type = "date";
                                $obj->field = "start";
                                $obj->comparison = "let";
                                $obj->value = $request->getParameter('end');
                                $filter[] = $obj;
                            }

                            $rows = EventTable::getInstance()->getAll($filter);

                            $response['evts'] = array();
                            foreach ($rows['data'] as $value) {
                                $response['evts'][] = $value;
                                $response['evts'][count($response['evts']) - 1]['cid'] = $value['calendarid'];
                                $response['evts'][count($response['evts']) - 1]['title'] = $value['name'];
                                $response['evts'][count($response['evts']) - 1]['ad'] = $value['allday'];
                                $response['evts'][count($response['evts']) - 1]['notes'] = $value['comment'];
                                $response['evts'][count($response['evts']) - 1]['loc'] = $value['location'];
                                $response['evts'][count($response['evts']) - 1]['url'] = $value['link'];
                                $response['evts'][count($response['evts']) - 1]['rem'] = $value['reminderid'];
                                $response['evts'][count($response['evts']) - 1]['rec'] = '';
                            }
                            break;
                        case 'stadistics':
                            $response = EventTable::getInstance()->getSummary($request->getParameter('start'), $request->getParameter('end'));
                            break;
                        default:
                            break;
                    }
                    break;

                case 'eventadjust':
                    $event = Doctrine::getTable('Event')->find($request->getParameter('EventId'));
                    if ($event) {
                        $event->setStart($request->getParameter('StartDate'));
                        $event->setEnd($request->getParameter('EndDate'));

                        $event->save();
                        $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful');
                    }
                    break;

                default:
                    return parent::executeRequest($request);
                    break;
            }
        } catch (Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return $this->renderText(json_encode($response));
    }

    public function save(sfWebRequest $request) {
        $event = array();

        $ak = Util::generateCode($request->getParameter('Title') .
                        $request->getParameter('calendar-period-start-date') . $request->getParameter('calendar-period-start-time') .
                        $request->getParameter('calendar-period-end-date') . $request->getParameter('calendar-period-end-time'));

        if ($request->getParameter('EventId') != '')
            $event = Doctrine::getTable('Event')->find($request->getParameter('EventId'));

        if ($event == array()) {
            $event = Doctrine::getTable('Event')->findByAK($ak);
            if ($event)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('event.field.label', 'event.field.name', $request->getParameter('name'))
                        )));
            $event = new Event();
        }

        $event->setCode($ak);
        $event->setName($request->getParameter('Title'));

        if ($request->getParameter('calendar-period-allday') == 'on')
            $event->setAllday(true);
        else
            $event->setAllday(false);

        $event->setStart(Util::convertToDate($request->getParameter('calendar-period-start-date') . ' ' . $request->getParameter('calendar-period-start-time'), 'd/m/Y H:i A', 'Y-m-d H:i:s'));
        $event->setEnd(Util::convertToDate($request->getParameter('calendar-period-end-date') . ' ' . $request->getParameter('calendar-period-end-time'), 'd/m/Y H:i A', 'Y-m-d H:i:s'));

        $event->setLocation($request->getParameter('Location'));
        $event->setComment($request->getParameter('Notes'));
        $event->setLink($request->getParameter('Url'));

        $event->setCalendarid($request->getParameter('calendarid'));

        if ($request->getParameter('reminderid') && $request->getParameter('reminderid') != '')
            $event->setReminderid($request->getParameter('reminderid'));
        else
            $event->setReminderid(null);

        $event->save();

        return $event->toArray();
    }

}
