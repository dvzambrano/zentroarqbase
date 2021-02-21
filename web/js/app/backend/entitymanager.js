/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage entity
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

EntitymanagerApp = function() {
    return {
        init : function(EntitymanagerApp) {
            
            this.store = new Ext.data.Store({
                url: config.app_host + '/entity/request/method/load',
                baseParams:{
                    component: 'grid'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: function(store, records) { 
                        store.mask = new Ext.LoadMask(window['EntitymanagerApp'].gridPanel.getEl(), {
                            msg: bundle.getMsg('app.layout.loading')+'...'
                        }); 
                        store.mask.show();
                        beforeloadStore(store);
                    },
                    load: function(store, records) { 
                        var entity = records[0].data;
                        
                        window['EntitymanagerApp'].gridPanel.setTitle(entity.name, Ext.ux.Icon('chart_organisation'));
                        
                        store.mask.hide();
                    }
                }
            });
            
            this.imagesPanel = App.getFilesPanelFor('entity',  Date.patterns.OnlyImagesAllowed, 'images').cloneConfig({
                header: false,
                border: false,
                width: 120,
                bbar:[{
                    xtype: 'tbspacer', 
                    height: 22
                }],
                tbar:[{
                    xtype: 'tbspacer', 
                    height: 22
                }, new Ext.Toolbar.TextItem('<img src="'+config.app_host+'/images/icons/famfamfam/images.png" /> '+bundle.getMsg('entity.field.images'))]
            });
            this.opinionsPanel = window['NoteApp'].getPanelFor('Entitymanager', 'Entity', config.app_entityid, {
                label:{
                    newnote: bundle.getMsg('entity.field.newopinion')
                },
                icon: {
                    add: 'comment_add',
                    reply: 'comment_edit',
                    del: 'comment_delete'
                }
            });
            
            this.gridPanel = new Ext.Panel({
                id: 'gridPanelEntitymanager',
                title: bundle.getMsg('entity.field.label'),
                iconCls: Ext.ux.Icon('chart_organisation'),
                store: this.store,
                region:'center',
                layout:'hbox',
                layoutConfig: {
                    align : 'stretch',
                    pack  : 'start'
                },
                items: [{
                    border: false, 
                    padding: 8,
                    width: 200,
                    items:[new Ext.DataView({
                        tpl: new Ext.XTemplate(
                            '<tpl for=".">\
                                <div style="padding:2px; width:90%;"><i class="soap-icon-flexible"></i> {comment}</div>\
                                <br/>\
                                <div style="padding:2px; width:90%;">\
                                    <img src="'+config.app_host+'/images/icons/famfamfam/application_view_gallery.png" height="11px"> <b>'+bundle.getMsg('app.form.generaldata')+'</b>: <hr/>\
                                </div>\
                                <div style="padding:2px; width:90%;"><i class="soap-icon-locations"></i> {address}</div>\
                                <br/>\
                                <div style="padding:2px; width:90%;">\
                                    <img src="'+config.app_host+'/images/icons/famfamfam/vcard.png" height="11px"> <b>'+bundle.getMsg('entity.field.contact')+'</b>: <hr/>\
                                </div>\
                                <div style="padding:2px; width:90%;"><i class="soap-icon-phone"></i> {phone} {cellphone}</div>\
                                <div style="padding:2px; width:90%;"><i class="soap-icon-letter"></i> {email_address}</div>\
                                <div class="x-clear"></div>\
                            </tpl>'
                            ),
                        singleSelect: true,
                        trackOver: true,
                        overClass:'x-view-over',
                        itemSelector: 'div.thumb-wrap',
                        emptyText : '<div style="padding:10px;">'+bundle.getMsg('app.error.noimages')+'</div>',
                        store: this.store,
                        prepareData: function(data){
                            if(!data.logo || data.logo == '')
                                data.logo = config.app_host+'/images/entity.png';
                            if(data.images && data.images != '')
                                App.addFiles(Ext.decode(data.images), window['EntitymanagerApp'].imagesPanel);
                            return data;
                        }
                    })],
                
                    tbar:[{
                        text: bundle.getMsg('app.form.info'),
                        iconCls: Ext.ux.Icon('information'),
                        listeners: {
                            click: function() {
                                var record = window['EntitymanagerApp'].store.getAt(0);
            
                                window['EntityApp'].store.removeAll();
                                window['EntityApp'].store.add(record);
                                window['EntityApp'].gridPanel.getSelectionModel().selectRecords([record]);
            
                                window['EntityApp'].gridPanel.updateBtn.fireEvent('click', window['EntitymanagerApp'].gridPanel, false, true, function(){
                                    Ext.Msg.getDialog().on('beforehide', function() {
                                        App.mask.show();
                                        window.parent.location = window.parent.location.href.replace('#', '');
                                    }, 
                                    this, {
                                        single:true
                                    }
                                    );
                                    Ext.Msg.show({
                                        title:bundle.getMsg('app.msg.info.title'),
                                        msg: bundle.getMsg('app.msg.info.savedsuccessful')+'<br/>'+bundle.getMsg('app.msg.warning.reloadpage'),
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.WARNING
                                    });
                                });
                            }
                        }
                    }],
                    bbar:[{
                        xtype: 'tbspacer', 
                        height: 23
                    }]
                }, {
                    layout: 'fit',
                    border: false,
                    flex: 1,
                    items: [new Ext.TabPanel({
                        ref: '../tabPanel',
                        flex: 1,			
                        activeTab: 0,
                        border: false,
                        items:[{
                            title: bundle.getMsg('entity.field.opinion'),
                            iconCls: Ext.ux.Icon('comments'),
                            border: false,
                            layout: 'fit',
                            items:[this.opinionsPanel]
                        }]
                    })]
                }, this.imagesPanel],
                listeners: {
                    activate: function(gridpanel){
                        gridpanel.store.load();
                        gridpanel.tabPanel.setActiveTab(0);
                        window['EntitymanagerApp'].opinionsPanel.items.items[0].getBottomToolbar().store.removeAll();
                        window['EntitymanagerApp'].opinionsPanel.items.items[0].getBottomToolbar().store.baseParams.entityid = config.app_entityid;
                        window['EntitymanagerApp'].opinionsPanel.items.items[0].getBottomToolbar().store.load();
                    }
                }
            
            });
        
        },
        
        showWindow : function(){},
        
        applySecurity : function(groups, permissions){}
    }
}();

