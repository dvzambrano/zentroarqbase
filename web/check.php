<?php

function is_cli() {
    return !isset($_SERVER['HTTP_HOST']);
}

/**
 * Checks a configuration.
 */
function check($boolean, $message, $help = '', $fatal = false) {
    echo $boolean ? "  OK        " : sprintf("[[%s]] ", $fatal ? ' ERROR ' : 'ADVERTENCIA');
    echo sprintf("$message%s\n", $boolean ? '' : ': HA FALLADO');

    if (!$boolean) {
        echo "            *** $help ***\n";
        if ($fatal) {
            die("Ud debe solucionar este problema para continuar el chequeo.\n");
        }
    }
}

/**
 * Gets the php.ini path used by the current PHP interpretor.
 *
 * @return string the php.ini path
 */
function get_ini_path() {
    if ($path = get_cfg_var('cfg_file_path')) {
        return $path;
    }

    return 'ADVERTENCIA: No se esta usando un archivo php.ini';
}

if (!is_cli()) {
    echo '<html><body><pre>';
}

echo "********************************************\n";
echo "*                                          *\n";
echo "*  <b>Chequeo de requerimientos del sistema</b>   *\n";
echo "*                                          *\n";
echo "********************************************\n\n";

echo sprintf("El archivo de configucraci&oacute;n de PHP (php.ini) utilizado se encuentra en: %s\n\n", get_ini_path());

if (is_cli()) {
    echo "** ADVERTENCIA **\n";
    echo "*  El PHP CLI puede usar un fichero de configuracion (php.ini) diferente\n";
    echo "*  que el usado en el servidor web.\n";
    if ('\\' == DIRECTORY_SEPARATOR) {
        echo "*  (especialmente en plataforma Windows)\n";
    }
    echo "*  Si este es el caso, por favor ejecute esta\n";
    echo "*  utilidad desde su servidor web.\n";
    echo "** ADVERTENCIA **\n";
}

// OBLIGATORIOS
echo "\n** Requerimientos obligatorios **\n\n";
check(version_compare(phpversion(), '5.2.5', '>='), sprintf('La version de PHP es al menos 5.2.5 (%s)', phpversion()), 'La version actual es ' . phpversion(), true);
check(class_exists('PDO'), 'Esta instalado PDO', 'Instale PDO (obligatorio para el uso de Propel o Doctrine)', false);
if (class_exists('PDO')) {
    $drivers = PDO::getAvailableDrivers();
    check(count($drivers), 'PDO tiene instalado los controladores siguientes: ' . implode(', ', $drivers), 'Instale controladores para PDO (obligatorio para el uso de Propel o Doctrine)');
}
$mod_rewrite = false;
if (function_exists('apache_get_modules')) {
  $modules = apache_get_modules();
  $mod_rewrite = in_array('mod_rewrite', $modules);
} else {
  $mod_rewrite = getenv('HTTP_MOD_REWRITE')=='On' ? true : false ;
}
check($mod_rewrite, 'El m&oacute;dulo rewrite_module de Apache est&aacute; disponible', 'Habilite el m&oacute;dulo rewrite_module de Apache  (obligatorio para redireccionamientos del sistema)', false);
check(extension_loaded('openssl'), 'La extensi&oacute;n OpenSSL est&aacute; disponible', 'Instale y habilite la extension OpenSSL (obligatorio para la seguridad del sistema)', false);
check(extension_loaded('ldap'), 'La extensi&oacute;n LDAP est&aacute; disponible', 'Instale y habilite la extension LDAP (altamente recomendado)', false);

// ADVERTENCIAS
echo "\n** Requerimientos opcionales **\n\n";
check(class_exists('DomDocument'), 'El modulo PHP-XML esta instalado', 'Instale y habilite el modulo php-xml (requerido para uso de Propel)', false);
check(class_exists('XSLTProcessor'), 'El modulo XSL esta instalado', 'Instale y habilite el modulo XSL (recomendado para el uso de Propel)', false);
check(extension_loaded('gd'), 'La extensi&oacute;n GD2 est&aacute; disponible', 'Instale y habilite la extension GD2 (altamente recomendado)', false);
check(function_exists('token_get_all'), 'La funcion token_get_all() esta disponible', 'Instale y habilite la extension Tokenizer (altamente recomendado)', false);
check(function_exists('mb_strlen'), 'La funcion mb_strlen() esta disponible', 'Instale y habilite la extension mbstring', false);
check(function_exists('iconv'), 'La funcion iconv() esta disponible', 'Instale y habilite la extension iconv', false);
check(function_exists('utf8_decode'), 'La funcion utf8_decode() esta disponible', 'Instale y habilite la extension XML', false);
check(function_exists('posix_isatty'), 'La funcion posix_isatty() esta disponible', 'Instale y habilite la extension php_posix)', false);

$accelerator =
        (function_exists('apc_store') && ini_get('apc.enabled'))
        ||
        function_exists('eaccelerator_put') && ini_get('eaccelerator.enable')
        ||
        function_exists('xcache_set')
;
check($accelerator, 'Hay un acelerador de PHP instalado', 'Instale un acelerador de PHP, por ejemplo APC (altamente recomendado)', false);

check(!ini_get('short_open_tag'), 'php.ini tiene short_open_tag apagado', 'Cambielo a apagado en el php.ini', false);
check(!ini_get('magic_quotes_gpc'), 'php.ini tiene magic_quotes_gpc apagado', 'Cambielo a apagado en el php.ini', false);
check(!ini_get('register_globals'), 'php.ini tiene register_globals apagado', 'Cambielo a apagado en el php.ini', false);
check(!ini_get('session.auto_start'), 'php.ini tiene session.auto_start apagado', 'Cambielo a apagado en el php.ini', false);

check(version_compare(phpversion(), '5.2.9', '!='), 'La version de PHP usada no es 5.2.9', 'PHP 5.2.9 presenta problemas con array_unique() y sfToolkit::arrayDeepMerge(). Use la version 5.2.10 o superior en su lugar [Ticket #6211]', false);

if (!is_cli()) {
    echo '</pre></body></html>';
}
