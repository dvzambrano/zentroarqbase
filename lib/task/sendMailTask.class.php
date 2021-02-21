<?php

class sendMailTask extends sfBaseTask {

    protected function configure() {
        $this->addOptions(array(
            new sfCommandOption('application', null, sfCommandOption::PARAMETER_REQUIRED, 'The application name'),
            new sfCommandOption('env', null, sfCommandOption::PARAMETER_REQUIRED, 'The environment', 'dev'),
            new sfCommandOption('connection', null, sfCommandOption::PARAMETER_REQUIRED, 'The connection name', 'doctrine'),
                // add your own options here
        ));

        $this->namespace = 'reminder';
        $this->name = 'sendMail';
        $this->briefDescription = 'Esta tarea envia un correo';
        $this->detailedDescription = <<<EOF
The [sendMail|INFO] task does things.
Call it with:

  [php symfony sendMail|INFO]
EOF;
    }

    protected function execute($arguments = array(), $options = array()) {
        // initialize the database connection
        $databaseManager = new sfDatabaseManager($this->configuration);
        $connection = $databaseManager->getDatabase($options['connection'])->getConnection();
        
        $base64img = '#';

        $sendto = Util::getMetadataValue('app_businessmail');
        $params = Array('app_name' => Util::getMetadataValue('app_name'),
            'app_mailusername' => Util::getMetadataValue('app_mailusername'),
            'app_username' => ' ',
            'img' => $base64img,
            'content' => 'Texto del mensaje...'
        );

        $this->log($params['app_name'] . ' esta ejecutando una tarea programada, esto puede tardar unos segundos...');

        Util::sendEmail($this->getMailer(), $sendto, " ", $this->getContent($params));
    }

    protected function getContent($params) {
        foreach ($params as $key => $value)
            eval("\$" . str_replace('_', '', $key) . " = \"$value\";");


        $location = Util::getRootPath('/apps/backend/modules/mail/templates/_NotificationSuccess.php', true, true);

        $text = file_get_contents($location, true);
        $text = str_replace('<?php echo ', '', $text);
        $text = str_replace('; ?>', '', $text);

        $str = '';
        eval("\$str = \"$text\";");

        return $str;
    }

}
