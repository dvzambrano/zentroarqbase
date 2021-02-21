/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package SGArqBase
 * @subpackage contenteditor
 * @author MSc. Donel Vázquez Zambrano
 * @version 1.0.0
 */

ContenteditorApp = function() {
    return {
        init : function(ContenteditorApp) {            

            this.gridPanel = this.getPanelFor({
                app_host: config.app_host,
                id: 'gridPanelContenteditor',
                pdfreader: true,
                xlsreader: true,
                docxreader: true,
                callback: {
                    params: ['param'],
                    fn: function(params){
                        
                    }
                }
            });
            
        },

        getPanelFor : function(config){
            var id = Ext.id();
            if(config && config.id != '')
                id = config.id;
            
            var ref = 'contenteditorPanel';
            if(config && config.ref != '')
                ref = config.ref;
            
            return new Ext.Panel({
                id: id,
                ref: ref,
                layout:'fit',
                border: false,
                bbar: [{
                    xtype: 'tbspacer', 
                    width: 0
                }],
                items: [{
                    ref: 'editor',
                    xtype:'htmleditor',
                    border: false, 
                    config: config,
                    enableSourceEdit: config.enableSourceEdit,
                    fontFamilies: [
                    'Arial',
                    'Arial Black',
                    'Calibri',
                    'Courier New',
                    'Tahoma',
                    'Times New Roman',
                    'Verdana'
                    ],
                    listeners: {
                        render: function(field) {
                            if(field.getToolbar()){
                                field.getToolbar().insert(11, {
                                    iconCls: Ext.ux.Icon('text_heading_1'),
                                    tooltip: {
                                        text: bundle.getMsg('contenteditor.action.inserthx.comment')+'.', 
                                        title: bundle.getMsg('contenteditor.action.inserthx.label')
                                    },
                                    menu : {
                                        items: [{
                                            iconCls: Ext.ux.Icon('text_heading_1'),
                                            text: String.format(bundle.getMsg('contenteditor.action.inserthx.hx'), '1'), 
                                            field: field,
                                            listeners: {
                                                click: function(button) {
                                                    button.field.relayCmd('formatblock', '<h1>'); 
                                                }
                                            }
                                        },{
                                            iconCls: Ext.ux.Icon('text_heading_2'),
                                            text: String.format(bundle.getMsg('contenteditor.action.inserthx.hx'), '2'), 
                                            field: field,
                                            listeners: {
                                                click: function(button) {
                                                    button.field.relayCmd('formatblock', '<h2>');
                                                }
                                            }
                                        },{
                                            iconCls: Ext.ux.Icon('text_heading_3'),
                                            text: String.format(bundle.getMsg('contenteditor.action.inserthx.hx'), '3'), 
                                            field: field,
                                            listeners: {
                                                click: function(button) {
                                                    button.field.relayCmd('formatblock', '<h3>');
                                                }
                                            }
                                        },{
                                            iconCls: Ext.ux.Icon('text_heading_4'),
                                            text: String.format(bundle.getMsg('contenteditor.action.inserthx.hx'), '4'),
                                            field: field, 
                                            listeners: {
                                                click: function(button) {
                                                    button.field.relayCmd('formatblock', '<h4>');
                                                }
                                            }
                                        },{
                                            iconCls: Ext.ux.Icon('text_heading_5'),
                                            text: String.format(bundle.getMsg('contenteditor.action.inserthx.hx'), '5'), 
                                            field: field,
                                            listeners: {
                                                click: function(button) {
                                                    button.field.relayCmd('formatblock', '<h5>');
                                                }
                                            }
                                        },{
                                            iconCls: Ext.ux.Icon('text_heading_6'),
                                            text: String.format(bundle.getMsg('contenteditor.action.inserthx.hx'), '6'), 
                                            field: field,
                                            listeners: {
                                                click: function(button) {
                                                    button.field.relayCmd('formatblock', '<h6>');
                                                }
                                            }
                                        }]
                                    }
                                }); 
                                field.getToolbar().insert(16, {
                                    iconCls: Ext.ux.Icon('text_align_justify'),
                                    tooltip: { 
                                        title: bundle.getMsg('contenteditor.action.justify.label'),
                                        text: bundle.getMsg('contenteditor.action.justify.comment')+'.'
                                    },
                                    field: field,
                                    listeners: {
                                        click: function(button) {
                                            button.field.relayCmd('justifyFull', false);
                                        }
                                    }
                                }); 
                                field.getToolbar().insert(19, {
                                    iconCls: Ext.ux.Icon('page_white_link'),
                                    tooltip: {
                                        title: bundle.getMsg('contenteditor.action.insertobject.label'),
                                        text: bundle.getMsg('contenteditor.action.insertobject.comment')+'.'
                                    },
                                    field: field,
                                    listeners: {
                                        click: function(button) {
                                            var path = '';
                                            if(field.config.record && field.config.record.get && field.config.record.get('id')!='')
                                                path = '/'+field.config.record.get('id');
                                                                        
                                            showPictureForm(false, 'web/uploads/assets'+path, function(url){
                                                button.field.relayCmd('inserthtml', '<a href="#" onclick="javascript:window.location.href=&#39;'+config.app_host + url+'&#39;" style="text-decoration: none;">&nbsp;'+bundle.getMsg('contenteditor.action.insertobject.label')+'</a>');
                                            }, true); 
                                        }
                                    }
                                });       
                                
                                var i = 0;                       
                                var width = 0;
                                
                                if(field.config && field.config.tbar && field.config.tbar != ''){
                                    width = 0;
                                    for(i = 0; i < field.config.tbar.length; i++)
                                        field.getToolbar().insert(i, field.config.tbar[i]);
                                    field.getToolbar().insert(field.config.tbar.length, '-');
                                }
                                
                                if(field.ownerCt && field.ownerCt.getBottomToolbar && field.config && field.config.bbar && field.config.bbar != ''){ 
                                    for(i = 0; i < field.config.bbar.length; i++)
                                        field.ownerCt.getBottomToolbar().insert(i, field.config.bbar[i]);
                                }
                                
                                field.getToolbar().add('-', {
                                    iconCls: Ext.ux.Icon('images'),
                                    tooltip: {
                                        title: bundle.getMsg('contenteditor.action.insertimage.label'),
                                        text: bundle.getMsg('contenteditor.action.insertimage.comment')+'.'
                                    },
                                    field: field,
                                    listeners: {
                                        click: function(button) {
                                            var path = '';
                                            if(field.config.record && field.config.record.get && field.config.record.get('id')!='')
                                                path = '/'+field.config.record.get('id');

                                            Ext.getCmp('picture').regex = Date.patterns.OnlyImagesAllowed;
                                            showPictureForm(false, 'web/uploads/assets'+path, function(url){
                                                button.field.relayCmd('insertImage',field.config.app_host + url);
                                            }, true); 

                                        }
                                    }
                                }); 
                                
                                var documentreaderseparator = false;
                                if(config.docxreader){
                                    if(!documentreaderseparator){
                                        field.getToolbar().add('-');
                                        documentreaderseparator = true;
                                    }
                                    field.getToolbar().add({
                                        iconCls: Ext.ux.Icon('page_white_word'),
                                        tooltip: {
                                            text: String.format(bundle.getMsg('contenteditor.action.inserttext.comment')+'.', ' MS Word'), 
                                            title: String.format(bundle.getMsg('contenteditor.action.inserttext.label'), ' MS Word')
                                        },
                                        field: field,
                                        listeners: {
                                            click: function(button) {
                                                var path = '';
                                                if(field.config.record && field.config.record.get && field.config.record.get('id')!='')
                                                    path = '/'+field.config.record.get('id');

                                                Ext.getCmp('picture').regex = /^.*.(docx|DOCX)$/;
                                                showPictureForm(false, 'web/uploads/assets'+path, function(url){
                                                    var callbackFn = function(content){
                                                        button.field.relayCmd('inserthtml', content);
                                                    };
                                                    window['ExplorerApp'].readFile({
                                                        id:'web/'+url
                                                    }, 'docx', callbackFn, true);
                                                }, true);
                                            }
                                        }
                                    });
                                }
                                if(config.xlsreader){
                                    if(!documentreaderseparator){
                                        field.getToolbar().add('-');
                                        documentreaderseparator = true;
                                    }
                                    field.getToolbar().add({
                                        iconCls: Ext.ux.Icon('page_white_excel'),
                                        tooltip: {
                                            text: String.format(bundle.getMsg('contenteditor.action.inserttext.comment')+'.', ' MS Excel'), 
                                            title: String.format(bundle.getMsg('contenteditor.action.inserttext.label'), ' MS Excel')
                                        },
                                        field: field,
                                        listeners: {
                                            click: function(button) {
                                                var path = '';
                                                if(field.config.record && field.config.record.get && field.config.record.get('id')!='')
                                                    path = '/'+field.config.record.get('id');

                                                Ext.getCmp('picture').regex = /^.*.(xlsx|XLSX|xls|XLS)$/;
                                                showPictureForm(false, 'web/uploads/assets'+path, function(url){
                                                    var extension = url;
                                                    while(extension && extension.indexOf('.')>-1)
                                                        extension = extension.substring(extension.indexOf('.')+1, extension.length);
                                                
                                                    var callbackFn = function(content){
                                                        button.field.relayCmd('inserthtml', content);
                                                    };
                                                    window['ExplorerApp'].readFile({
                                                        id:'web/'+url
                                                    }, extension, callbackFn, true);
                                                }, true);
                                            }
                                        }
                                    });
                                }
                                if(config.pdfreader){
                                    if(!documentreaderseparator){
                                        field.getToolbar().add('-');
                                        documentreaderseparator = true;
                                    }
                                    field.getToolbar().add({
                                        iconCls: Ext.ux.Icon('page_white_acrobat'),
                                        tooltip: {
                                            title: String.format(bundle.getMsg('contenteditor.action.inserttext.label'), ' PDF'),
                                            text: String.format(bundle.getMsg('contenteditor.action.inserttext.comment')+'.', ' PDF')
                                        },
                                        field: field,
                                        listeners: {
                                            click: function(button) {
                                                var path = '';
                                                if(field.config.record && field.config.record.get && field.config.record.get('id')!='')
                                                    path = '/'+field.config.record.get('id');
                            
                                                Ext.getCmp('picture').regex = /^.*.(pdf|PDF)$/;
                                                showPictureForm(false, 'web/uploads/assets'+path, function(url){
                                                    var callbackFn = function(content){
                                                        button.field.relayCmd('inserthtml', content);
                                                    };
                                                    window['ExplorerApp'].readFile({
                                                        id:'web/'+url
                                                    }, 'pdf', callbackFn, true);
                                                }, true);
                                            }
                                        }
                                    }); 
                                }
                                
                                field.getToolbar().add('->', {
                                    iconCls: Ext.ux.Icon('disk'),
                                    tooltip: {
                                        title: bundle.getMsg('app.form.save')
                                    },
                                    field: field,
                                    listeners: {
                                        click: function(button) {
                                            if(field.config.callback && field.config.callback.fn){
                                                field.config.callback.params[1] = Ext.getCmp(field.id).getValue();
                                                field.config.callback.fn(field.config.callback.params);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }]
            });
        },
        
        showWindow : function(animateTarget, hideApply, callback){},

        applySecurity : function(groups, permissions){}
    }
}();

