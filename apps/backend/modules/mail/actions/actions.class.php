<?php

/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construccion de Sistemas.
 *
 * @package SGArqBase
 * @subpackage calendar
 * @author MSc. Donel Vazquez Zambrano
 * @version1.0.0
 */
class mailActions extends sfBaseActions {

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        try {
            switch ($request->getParameter('method')) {
                case 'send':
                    $params = array();

                    // getting custom params
                    if ($request->getParameter('params') && $request->getParameter('params') != '') {
                        $params = json_decode($request->getParameter('params'), true);
                        $params = $params[0];
                    }
                    // setting base params
                    $params['appname'] = Util::getMetadataValue('app_name');
                    $params['companyemail'] = Util::getMetadataValue('app_businessmail');
                    $params['appheadershadow'] = Util::getMetadataValue('app_headershadow');
                    $params['url'] = $request->getUri();
                    $params['url'] = str_replace('/mail/request/method/send', '', $params['url']);
                    $params['url'] = str_replace('admin.php', '', $params['url']);
                    //$params['img'] = 'data:image/png;base64,' . base64_encode(file_get_contents(Util::getRootPath('/web/images/logo-white-transpatent.png', true)));
                    $params['img'] = $params['url'] . '/images/logo-white-transpatent.png';

                    // creating message html
                    $html = $this->getPartial($request->getParameter('partial'), $params);
                    $this->getRequest()->setParameter('msg', $html);
                    // depuring subject
                    foreach ($params as $key => $value)
                        $request->setParameter('subject', str_replace('$' . $key, $value, $request->getParameter('subject')));

                    // send
                    Util::sendEmail($this->getMailer(), $request->getParameter('sendto'), $request->getParameter('subject'), $request->getParameter('msg'));
                    $response = array('success' => true, 'message' => 'app.msg.info.sendedsuccessful');
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

}

//                    // EXAMPLE 1: Send simple mail test using factories.yml configuration on local Mail Server
//                    // Create the message
//                    $message = Swift_Message::newInstance()
//                            // Give the message a subject
//                            ->setSubject('Your subject')
//                            // Set the From address with an associative array
//                            ->setFrom(array('noresponder@domain.com' => 'Alias de Remitente'))
//                            // Set the To addresses with an associative array
//                            ->setTo(array('cliente1@domain.com', 'noresponder@domain.com' => 'Alias de Destinatario'))
//                            // Give it a body
//                            ->setBody('Here is the message itself')
//                            // And optionally an alternative body
//                            ->addPart('<q>Here is the message itself</q>', 'text/html')
//                    //                                // Optionally add any attachments
//                    //                                ->attach(Swift_Attachment::fromPath('my-document.pdf'))
//                    ;
//                    $this->getMailer()->send($message);
//
//
//                    // EXAMPLE 2: Send simple mail test using factories.yml configuration on local Mail Server
//                    $message = $this->getMailer()->compose(
//                            array('noresponder@domain.com' => 'Alias de Remitente'), 'cliente1@domain.com', 'Asunto del correo', 'Cuerpo del correo'
//                    );
//                    $this->getMailer()->send($message);
