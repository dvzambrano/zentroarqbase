<?php











namespace Composer;

use Composer\Semver\VersionParser;






class InstalledVersions
{
private static $installed = array (
  'root' => 
  array (
    'pretty_version' => '1.0.0+no-version-set',
    'version' => '1.0.0.0',
    'aliases' => 
    array (
    ),
    'reference' => NULL,
    'name' => 'administrador/zentro-sg-arq-base',
  ),
  'versions' => 
  array (
    'administrador/zentro-sg-arq-base' => 
    array (
      'pretty_version' => '1.0.0+no-version-set',
      'version' => '1.0.0.0',
      'aliases' => 
      array (
      ),
      'reference' => NULL,
    ),
    'friendsofsymfony1/doctrine1' => 
    array (
      'pretty_version' => 'v1.3.8',
      'version' => '1.3.8.0',
      'aliases' => 
      array (
      ),
      'reference' => '3ef85915e56b29475e9bff85bfc1f80d41028a7f',
    ),
    'friendsofsymfony1/symfony1' => 
    array (
      'pretty_version' => 'v1.5.13',
      'version' => '1.5.13.0',
      'aliases' => 
      array (
      ),
      'reference' => '28fa68237e2ed4aa25eba8c453884b0a681c4ce2',
    ),
    'jpgraph/jpgraph' => 
    array (
      'pretty_version' => '4.0.2',
      'version' => '4.0.2.0',
      'aliases' => 
      array (
      ),
      'reference' => 'e82db7da6a546d3926c24c9a346226da7aa49094',
    ),
    'mpdf/mpdf' => 
    array (
      'pretty_version' => 'v8.0.10',
      'version' => '8.0.10.0',
      'aliases' => 
      array (
      ),
      'reference' => '1333a962cd2f7ae1a127b7534b7734b58179186f',
    ),
    'myclabs/deep-copy' => 
    array (
      'pretty_version' => '1.10.2',
      'version' => '1.10.2.0',
      'aliases' => 
      array (
      ),
      'reference' => '776f831124e9c62e1a2c601ecc52e776d8bb7220',
      'replaced' => 
      array (
        0 => '1.10.2',
      ),
    ),
    'paragonie/random_compat' => 
    array (
      'pretty_version' => 'v9.99.100',
      'version' => '9.99.100.0',
      'aliases' => 
      array (
      ),
      'reference' => '996434e5492cb4c3edcb9168db6fbb1359ef965a',
    ),
    'psr/log' => 
    array (
      'pretty_version' => '1.1.3',
      'version' => '1.1.3.0',
      'aliases' => 
      array (
      ),
      'reference' => '0f73288fd15629204f9d42b7055f72dacbe811fc',
    ),
    'setasign/fpdi' => 
    array (
      'pretty_version' => 'v2.3.5',
      'version' => '2.3.5.0',
      'aliases' => 
      array (
      ),
      'reference' => 'f2246c8669bd25834f5c264425eb0e250d7a9312',
    ),
    'swiftmailer/swiftmailer' => 
    array (
      'pretty_version' => 'v5.4.12',
      'version' => '5.4.12.0',
      'aliases' => 
      array (
      ),
      'reference' => '181b89f18a90f8925ef805f950d47a7190e9b950',
    ),
  ),
);







public static function getInstalledPackages()
{
return array_keys(self::$installed['versions']);
}









public static function isInstalled($packageName)
{
return isset(self::$installed['versions'][$packageName]);
}














public static function satisfies(VersionParser $parser, $packageName, $constraint)
{
$constraint = $parser->parseConstraints($constraint);
$provided = $parser->parseConstraints(self::getVersionRanges($packageName));

return $provided->matches($constraint);
}










public static function getVersionRanges($packageName)
{
if (!isset(self::$installed['versions'][$packageName])) {
throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
}

$ranges = array();
if (isset(self::$installed['versions'][$packageName]['pretty_version'])) {
$ranges[] = self::$installed['versions'][$packageName]['pretty_version'];
}
if (array_key_exists('aliases', self::$installed['versions'][$packageName])) {
$ranges = array_merge($ranges, self::$installed['versions'][$packageName]['aliases']);
}
if (array_key_exists('replaced', self::$installed['versions'][$packageName])) {
$ranges = array_merge($ranges, self::$installed['versions'][$packageName]['replaced']);
}
if (array_key_exists('provided', self::$installed['versions'][$packageName])) {
$ranges = array_merge($ranges, self::$installed['versions'][$packageName]['provided']);
}

return implode(' || ', $ranges);
}





public static function getVersion($packageName)
{
if (!isset(self::$installed['versions'][$packageName])) {
throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
}

if (!isset(self::$installed['versions'][$packageName]['version'])) {
return null;
}

return self::$installed['versions'][$packageName]['version'];
}





public static function getPrettyVersion($packageName)
{
if (!isset(self::$installed['versions'][$packageName])) {
throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
}

if (!isset(self::$installed['versions'][$packageName]['pretty_version'])) {
return null;
}

return self::$installed['versions'][$packageName]['pretty_version'];
}





public static function getReference($packageName)
{
if (!isset(self::$installed['versions'][$packageName])) {
throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
}

if (!isset(self::$installed['versions'][$packageName]['reference'])) {
return null;
}

return self::$installed['versions'][$packageName]['reference'];
}





public static function getRootPackage()
{
return self::$installed['root'];
}







public static function getRawData()
{
return self::$installed;
}



















public static function reload($data)
{
self::$installed = $data;
}
}
