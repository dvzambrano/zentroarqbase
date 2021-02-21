<html>
    <head>
        <style>
            @page {
              size: auto;
              odd-header-name: html_MyHeader1;
              odd-footer-name: html_MyFooter1;
            }

            @page chapter2 {
                odd-header-name: html_MyHeader2;
                odd-footer-name: html_MyFooter2;
            }

            @page noheader {
                odd-header-name: _blank;
                odd-footer-name: _blank;
            }

            div.chapter2 {
                page-break-before: always;
                page: chapter2;
            }

            div.noheader {
                page-break-before: always;
                page: noheader;
            }
            table.change_order_items { 
                /*font-size: 8pt;*/
                width: 100%;
                border-collapse: collapse;
                margin-top: 2em;
                margin-bottom: 2em;
            }

            table.change_order_items>tbody { 
                border: 1px solid black;
            }

            table.change_order_items>tbody>tr>th { 
                border-bottom: 1px solid black;
            }

            table.change_order_items>tbody>tr>td { 
                border-right: 1px solid black;
                padding: 0.5em;
            }
            table.change_order_items>thead { 
                border: 1px solid black;
            }

            table.change_order_items>thead>tr>th { 
                border-bottom: 1px solid black;
            }

            table.change_order_items>thead>tr>td { 
                border-right: 1px solid black;
                padding: 0.5em;
            }


            td.change_order_total_col { 
                padding-right: 4pt;
                text-align: right;
            }

            td.change_order_unit_col { 
                padding-left: 2pt;
                text-align: left;
            }

            .even_row td {
                /*  background-color: #F8EEE4;
                  border-top: 3px solid #FFFFff;*/
                background-color: #f6f6f6;
                border-bottom: 0.9px solid #ddd;
            }

            .written_field { 
                border-bottom: 0.1pt solid black;
            }

        </style>
    </head>
    <body>
        <htmlpageheader name="MyHeader1">
            <div style="text-align: right; <!--border-bottom: 1px solid #000000;--> font-weight: bold; font-size: 10pt;"></div>
        </htmlpageheader>
        
        <table style="width: 100%;" class="header">
            <tr>
                <td><h1 style="text-align: left">REPORTE DE PRUEBA</h1></td>
                <td><h1 style="text-align: right">No. de orden: 132-003</h1></td>
            </tr>
        </table>

        <table style="width: 100%; font-size: 8pt;">
            <tr>
                <td>Orden: <b>132-003</b></td>
                <td>Comprador(es): <b>David Lopez Gongora</b></td>
            </tr>

            <tr>
                <td>Creado: <b>2004-08-13</b></td>
                <td>&Uacute;tima modificaci&oacute;n: <b>2004-08-16  9:28 AM</b></td>
            </tr>

            <tr>
                <td>Direcci&oacute;n: <b>667 Pine Lodge Dr.</b></td>
                <td>Estado legal: <b>N/A</b></td>
            </tr>
        </table>

        <table style="width: 100%; border-top: 1px solid black; border-bottom: 1px solid black; font-size: 8pt;">

            <tr>
                <td>Modelo: <b>Raul Zamora Pe&ntilde;a</b></td>
                <td>Elevaci&oacute;n: <b>B</b></td>
                <td>Tama&ntilde;o: <b>1160 Cu. Ft.</b></td>
                <td>Estilo: <b>Rec&iacute;proco</b></td>
            </tr>

        </table>

        <table class="change_order_items">

            <tr><td colspan="7"><h2>Elementos est&aacute;ndar:</h2></td></tr>

            <tbody>
                <tr>
                    <th>Elemento</th>
                    <th>Descripci&oacute;n</th>
                    <th>Cantidad</th>
                    <th colspan="2">Costo unitario</th>
                    <th colspan="2">Total</th>
                </tr>

                <?php $evenrow = false; ?>
                <?php foreach ($items as $item): ?>
                    <?php if (!$evenrow): ?>
                        <tr class="even_row">
                            <td style="text-align: center"><?php echo $item->index ?></td>
                            <td><?php echo $item->name ?></td>
                            <td style="text-align: center"><?php echo $item->amount ?></td>
                            <td style="text-align: right; border-right-style: none;">$<?php echo $item->unitprice ?></td>
                            <td class="change_order_unit_col" style="border-left-style: none;">CUP</td>
                            <td style="text-align: right; border-right-style: none;">$<?php echo $item->subtotal ?></td>
                            <td class="change_order_unit_col" style="border-left-style: none;">CUP</td>
                        </tr>
                    <?php endif ?>

                    <?php if ($evenrow): ?>
                        <tr class="odd_row"> <td style="text-align: center"><?php echo $item->index ?></td>
                            <td><?php echo $item->name ?></td>
                            <td style="text-align: center"><?php echo $item->amount ?></td>
                            <td style="text-align: right; border-right-style: none;">$<?php echo $item->unitprice ?></td>
                            <td class="change_order_unit_col" style="border-left-style: none;">CUP</td>
                            <td style="text-align: right; border-right-style: none;">$<?php echo $item->subtotal ?></td>
                            <td class="change_order_unit_col" style="border-left-style: none;">CUP</td>
                        </tr>
                    <?php endif ?>

                    <?php $evenrow = !$evenrow; ?>
                <?php endforeach ?>

            </tbody>

            <tr>
                <td colspan="3" style="text-align: right;">(No est&aacute;n incluidos impuestos; ser&aacute;n agregados al cierre.)</td>
                <td colspan="2" style="text-align: right;"><b>TOTAL GENERAL:</b></td>
                <td style="text-align: right; border-right-style: none;">$<?php echo $total ?></td>
                <td class="change_order_unit_col" style="border-left-style: none;">CUP</td>
            </tr>
        </table>
        
        <table class="sa_signature_box">
            <tr>
                <td colspan="4" style="text-align: right"><b><?php echo ucfirst($letters) ?></b>.<br/><br/><br/></td>
            </tr>

            <tr>    
                <td>APROBADO:</td><td class="written_field" style="padding-left: 2.5in">&nbsp;</td>
                <td style="padding-left: 1em">COMPRADOR:</td><td class="written_field" style="padding-left: 2.5in; text-align: right;">X</td>
            </tr>
            <tr>
                <td colspan="3" style="padding-top: 0em">&nbsp;</td>
                <td style="text-align: center; padding-top: 0em;">Srta. Sofia G&oacute;mez Montoya</td>
            </tr>

            <tr><td colspan="4" style="white-space: normal">
                    Esta orden no tiene efecto o fuerza mientras no haya sido firmada y aprobada
                    por el suministrador. Cualquier cambio o solicitud personalizada que no conste
                    en este documento no forma parte del contrato.
                </td>
            </tr>

            <tr>
                <td colspan="2">Fecha de aceptaci&oacute;n
                    <span class="written_field" style="padding-left: 4em">&nbsp;</span>
                    de <span class="written_field" style="padding-left: 8em;">&nbsp;</span>, 
                    20<span class="written_field" style="padding-left: 4em">&nbsp;</span>.
                </td>

                <td colspan="2" style="padding-left: 1em;">ENTIDAD QUE EMITE.<br/><br/>
                    POR: 
                    <span class="written_field" style="padding-left: 2.5in">&nbsp;</span>
                </td>
            </tr>
        </table>

        <htmlpagefooter name="MyFooter1">
            <table width="100%" style="vertical-align: bottom;">
                <tr>
                    <td width="90%" style="font-size: 8px;"><?php echo Util::getBundle('app.languaje.report.author', 'es-ES', array($user->getFirstName().' '.$user->getLastName(), Util::getMetadataValue('app_name'))) ?></td>
                    <td width="10%" style="text-align: right; visibility:hidden;">{PAGENO}/{nbpg}</td>
                </tr>
            </table>
        </htmlpagefooter>
    </body>
</html>