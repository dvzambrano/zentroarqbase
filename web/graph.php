<?php
require_once __DIR__.'/../lib/vendor/autoload.php';

JpGraph\JpGraph::load();	

switch($_REQUEST['graph']){
	case 'qr':
		JpGraph\JpGraph::module('QR/qrencoder.inc.php');
		
		$e=new QREncoder();
		$b=QRCodeBackendFactory::Create($e);
		$b->Stroke($_REQUEST['data']);
		break;
	case 'barcode':
		JpGraph\JpGraph::module('barcode');
		
		$data = isset($_REQUEST['data']) ? $_REQUEST['data'] : '81092719101';

		$symbology = BarcodeFactory::Create(ENCODING_CODE128);
		$barcode = BackendFactory ::Create(BACKEND_IMAGE, $symbology);
		$barcode->Stroke($data);
		break;
	default:
		break;
}

?>


