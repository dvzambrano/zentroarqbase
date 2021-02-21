
App = function() {
    return {
        init : function(App) {
            this.mask = new Ext.LoadMask(Ext.getBody(), {
                msg: bundle.getMsg('app.layout.loading')+'...'
            });

            this.contentPanel = new Ext.Panel({
                region: 'center',
                autoScroll: true,					
                border: false,
                html: ''
            });

            this.viewPort = new Ext.Viewport({
                layout: 'border',
                autoScroll: true,
                items: [this.contentPanel],
                listeners: {
                    render: function() {
                        Ext.ux.GridPrinter.stylesheetPath = config.app_host+'/css/gridPrint.css';
                        Ext.ux.GridPrinter.stylesheetPath = Ext.ux.GridPrinter.stylesheetPath.replace('&#47;&#47;..&#47;', '&#47;');
                        
                        window.parent.App.window.getTopToolbar().setDisabled(true);
                            
                        App.mask.show();

                        App.genHTML(function(html){
                            html = '<div id="reportViewDiv" style="background-color: white; padding: 20px;">'+html+'</div>';
                            
                            App.contentPanel.removeAll();
                            App.contentPanel.add(new Ext.Panel({
                                html: html,
                                autoScroll: true,
                                border: false
                            }));

                            App.contentPanel.doLayout();

                            App.mask.hide();
                            window.parent.App.window.getTopToolbar().setDisabled(false);
                        }); 
                    }
                }
            });

        },

        genPDF : function(){ 
            var html = Ext.get('reportViewDiv').dom.innerHTML;
                 
            var paperorientation = 'portrait';
            if(!window.parent.App.window.paperorientationBtn.pressed)
                paperorientation = 'landscape';
            
            var dt = new Date();
            var file = dt.format('YmdHis')+Math.random();
            
            Ext.Ajax.request({
                method:'POST',
                url: config.app_host+'/file/request/method/writefile',
                params:{
                    file: 'web/uploads/assets/'+file,
                    content: html
                },
                success:function(response,opts){
                    App.mask.hide();
                    window.open(config.app_host+'/print/pdf?orientation='+paperorientation+'&file=web/uploads/assets/'+file, 'print');
                },
                failure:requestFailed
            });
        },

        printPage : function(){	
            App.mask.show();
            
            var html = Ext.get('reportViewDiv').dom.innerHTML;
            
            var myWindow = window.open();
            myWindow.document.open();
            
            html = html.replace('<span class="pagenum"></span>', ' ');
            
            // se incluye esto porq cuando hay tablas (<table>) muy largas se corta la impresion
            html = html.replace('printReport.css', '');
            
            // en la impresion directa hay q remplazar todas las ocurrencias <pagebreak> que se puso en genHTML por el estilo q el navegador reconoce como cambio de pagina
            while(html.indexOf('<pagebreak>')>-1){
                html = html.replace('<pagebreak>', '<hr style="page-break-after: always; border: 0;"/>');
            }
            
            // aqui hay q buscar la forma de q cuando se imprima directamente se predefina el tipo de hoja q se selecciono
            /*
            if(!window.parent.App.window.paperorientationBtn.pressed)
                alert('recuerde escoger la orientacion manualmente para la impresora');
            */
            
            myWindow.document.write(html);
            
            myWindow.document.close();
            myWindow.focus();
                                
            if(Ext.isOpera)
                myWindow.addEventListener('load', function(e) {
                    myWindow.print();
                            
                    App.mask.hide();
                }, false);
                                        
            setTimeout(function(){
                myWindow.print();
                myWindow.close();
                        
                App.mask.hide();
            },500);
        },

        genHTML: function(callback){
            var fn = function(html){                
                if (!window.parent.App.headercontent)
                    window.parent.App.headercontent = '<table>\
                                                            <tr>\
                                                                <td width="50%"><div style="font-size: (x+3)px;"><b>'+window.parent.App.grid.title+'</b></div><br/><div style="font-size: (x-3)px;">'+new Date().format(Date.patterns.NonISO8601Long)+'</div></td>\
                                                                <td width="50%" style="text-align: right;"><!--'+config.app_name+'--></td>\
                                                            </tr>\
                                                        </table>';
                if (!window.parent.App.footercontent)
                    window.parent.App.footercontent = '<table>\
                                                            <tr>\
                                                                <td width="80%"><div style="font-size: (x-3)px;">'+String.format(bundle.getMsg('app.languaje.report.author'), config.app_logueduser, config.app_name)+'</div></td>\
                                                                <td width="20%" style="text-align: right;"></td>\
                                                            </tr>\
                                                        </table>';
                
                // reemplazando encavezado y pie de pagina
                html = html.replace('headercontent', window.parent.App.headercontent).replace('footercontent', window.parent.App.footercontent);
                
                // incluyo esto pa garantizar q aun quitando printReport sigan saliendo los cortes de pagina tanto en impresion directa como en mdf
                while(html.indexOf('<hr/>')>-1 || html.indexOf('<hr />')>-1 || html.indexOf('<hr>')>-1 || html.indexOf('<hr >')>-1){
                    var pagebreak = '<pagebreak>';
                    html = html.replace('<hr/>', pagebreak);
                    html = html.replace('<hr />', pagebreak);
                    html = html.replace('<hr>', pagebreak);
                    html = html.replace('<hr >', pagebreak);
                }
                
                window.parent.App.headercontent = false;
                window.parent.App.footercontent = false

                // haciendo q las tablas q no traen especificaciones se pongan con tamaño de fuente por defecto
                while(html.indexOf('<table>')>-1){
                    html = html.replace('<table>', '<table style="font-size: 11px;">');
                }
                
                // AJUSTANDO TAMAÑO DE LA FUENTE
                html = '<div style="font-size: (x+3)px;">'+html+'</div>';
                //quitando espacio antes del valor de font-size
                while(html.indexOf('font-size: ')>-1){
                    html = html.replace('font-size: ', 'font-size:');
                }
                var limit = 30;
                var find = '';
                for(var i = 0; i<=30; i++){
                    find = 'font-size:'+i+'px';
                    while(html.indexOf(find)>-1){
                        var diff = i-11;
                        if(diff>-1)
                            html = html.replace(find, 'font-size:(x+'+(i-11)+')px');
                        else
                            html = html.replace(find, 'font-size:(x'+(i-11)+')px');
                    }
                }
                for(var i = -30; i<30; i++){
                    var find = 'font-size:(x'+i+')px';
                    if(i > -1)
                        find = 'font-size:(x+'+i+')px';
                    var replace = 'font-size:'+(window.parent.App.printableFontSize+i)+'px';
                    
                    while(html.indexOf(find)>-1){
                        html = html.replace(find, replace);
                    }
                }

                return html;
            }; 
            var html = '';

            if(window.parent.App.grid.getXType){
                switch(window.parent.App.grid.getXType()){
                    case 'grid':
                    case 'editorgrid':
                        html = Ext.ux.GridPrinter.getHTML(window.parent.App.grid);
                        break;
                    case 'treegrid':
                        html = '<link media="screen,print" type="text/css" rel="stylesheet" href="'+config.app_host+'/css/gridPrint.css">';
                        html += window.parent.App.grid.getHTML();
                        break;
                    case 'extensible.calendarpanel':
                        html = window.parent.App.grid.getEl().dom.innerHTML;
                        break;
                    case 'htmleditor':
                    case 'textfield':
                    case 'textarea':
                        html = '<link media="screen,print" type="text/css" rel="stylesheet" href="'+config.app_host+'/css/gridPrint.css">';
                        html += '<div style="padding:35px;">'+window.parent.App.grid.getValue()+'</div>';
                        break;
                    default:
                        html = 'Component NON supported...';
                        break;
                }
                html = fn(html);
                callback(html);
            }
            else{
                var afterLoadReportFn = function(response,opts){
                    html = response.responseText;

                    // to include header & footter in custom reports
                    window.parent.App.headercontent = ' ';
                    window.parent.App.footercontent = ' ';

                    if (callback){
                        html = fn(html);
                        callback(html);
                    }
                };
                Ext.Ajax.request({
                    params:{
                        files: '',
                        params: window.parent.App.gridparams ? Ext.encode(window.parent.App.gridparams) : ''
                    },
                    method: 'POST',
                    url: config.app_host + window.parent.App.grid,
                    success: afterLoadReportFn,
                    failure: function(response, opts) {
                        console.log('afterLoadReportFn server-side failure ' + response.responseText);
                        afterLoadReportFn(response, opts);
                    }
                });
            }
        },

        increaseText : function(value){
            if (!window.parent.App.printableFontSize || !value)
                window.parent.App.printableFontSize = 11;

            if(value)
                window.parent.App.printableFontSize+=value;

            App.viewPort.fireEvent('render', App.viewPort);
        }
    }
}();

if (window.parent.config){
    var config = window.parent.config;
    var bundle = window.parent.bundle;	
    eval(config.languajeJs);
    
    // comente esto porq no me sirva de nada. vine a tratar de config.app_host para q no de error en firebug y no descubri pa q era esta linea de codigo
    //Ext.util.CSS.swapStyleSheet(window.parent.Ext.getCmp('ThemeCycleButton').themeVar, window.parent.Ext.getCmp('ThemeCycleButton').cssPath + window.parent.Ext.getCmp('ThemeCycleButton').getActiveItem().file);


    Ext.onReady(function(){
        App.init(App);
    });
}