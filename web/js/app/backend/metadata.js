
MetadataApp = function() {
    return {
        init : function(MetadataApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/metadata/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: 100000
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                groupField:'category'
            });
			
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/metadata/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0
                },
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                reader: new Ext.data.JsonReader()
            });

            this.nameRender = function(val) {
                return bundle.getMsg('metadata.param.'+val.replace('app_',''));
            };

            this.valueRender = function(val) {
                if (val === '1' || val === 1 || val === 'true' || val === true)
                    return '<span style="color:green;">S&iacute;</span>';
                if (!val || val === '' || val === '0' || val === 0 || val === 'false' || val === false)
                    return '<span style="color:red;">No</span>';
                return val;
            };

            this.expanderColumn = new Ext.ux.grid.RowExpander({
                tpl : new Ext.Template(
                    '<p><img src="'+config.app_host+'/images/icons/famfamfam/lightbulb.png" width="10px"/><b> {comment}</b></p>'
                    )
            });
			
            this.gridPanel = new Ext.grid.EditorGridPanel({
                id: 'gridPanelMetadata',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('world'),
                title: config.app_showgridtitle ? bundle.getMsg("metadata.grid.title") : '',
                autoExpandColumn: 'metadatamaincolumn',
                store: this.store,
                loadMask: true,
                clicksToEdit: 1,
                tools: [{
                    id:'save',
                    qtip: bundle.getMsg('app.form.save'),
                    handler: function() {
                        var mask = new Ext.LoadMask(window['MetadataApp'].gridPanel.getEl(), {
                            msg: bundle.getMsg('app.layout.loading')+'...'
                        });
                        mask.show();

                        var array=new Array(); 
                        window['MetadataApp'].gridPanel.getStore().each(function(record){
                            array.push(record.data);
                        });

                        new Ext.data.Connection().request({
                            url: config.app_host + '/db/request/method/saveConfig',
                            params: {
                                config: Ext.encode(array)
                            },
                            failure: requestFailed,
                            //success: requestSuccessful,
                            callback : function(options, success, response) {
                                mask.hide();
                                window.parent.config = Ext.decode(response.responseText);
                                Ext.Msg.getDialog().on('beforehide', function() {
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
                            }
                        });
                    }
                },{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['MetadataApp'].gridPanel);
                    }
                },{
                    id:'gear',
                    qtip: bundle.getMsg('app.layout.export.header'),
                    handler: function() {
                        Ext.Msg.show({
                            title: bundle.getMsg('app.msg.info.title'),
                            msg: bundle.getMsg('metadata.action.sql'),
                            buttons: {
                                yes:bundle.getMsg('metadata.action.sql.export'),
                                no:bundle.getMsg('metadata.action.sql.import'),
                                cancel:bundle.getMsg('app.form.cancel')
                            },
                            fn: function(btn, text){
                                if (btn == 'yes')
                                    exportDbFn();
                                else if (btn == 'no')
                                    window.location.href = config.app_host + '/install.php';
                                
                                    
                            },
                            animEl: 'elId',
                            icon: Ext.MessageBox.QUESTION
                        }); 
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
                        window.open(config.app_host + '/uploads/tutorial/03 Configuracion global.html');
                    }
                }],

                listeners: {
                    activate: function(gridpanel){
                        gridpanel.getStore().load();
                    }
                },
				
                columns: [
                this.expanderColumn,{
                    header: bundle.getMsg('app.form.name'), 
                    width: 150, 
                    sortable: true, 
                    renderer: this.nameRender,
                    dataIndex: 'name'
                },{
                    id:'metadatamaincolumn', 
                    header: bundle.getMsg('app.form.value'), 
                    width: 270, 
                    sortable: true, 
                    renderer: this.valueRender,
                    dataIndex: 'value',
                    editor: new Ext.form.TextField({
                        allowBlank: false
                    })
                },{
                    header: bundle.getMsg('group.field.label'), 
                    width: 160, 
                    hidden: true, 
                    sortable: true, 
                    dataIndex: 'category'
                }],
				
                view: new Ext.grid.GroupingView({
                    markDirty: false,
                    forceFit:true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? bundle.getMsg("app.form.elements") : bundle.getMsg("app.form.element")]})'
                }),
				
                plugins: [this.expanderColumn],
				
                stripeRows: true,
				
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:true
                })
            });
			
            this.gridPanel.getView().getRowClass = function(record, index, rowParams, store) {
                //if (record.get('editable')) 
                //return 'row-red';
                if (!record.get('deleteable')) 
                    return 'row-italic';
            };

        },
        
        getPanelFor : function(entity){
            var app = Ext.util.Format.capitalize(entity.toLowerCase())+'App';
            var id = Ext.id();
            
            return new Ext.grid.EditorGridPanel({
                id: id,
                ref: 'metadataPanel',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('world'),
                title: bundle.getMsg(entity+'.tab.metadata'),
                autoExpandColumn: entity+'metadatamaincolumn',
                store: new Ext.data.GroupingStore({
                    url: config.app_host + '/metadata/request/method/load',
                    reader: new Ext.data.JsonReader(),
                    groupField:'category'
                }),
                loadMask: true,
                clicksToEdit: 1,
                columns: [{
                    header: bundle.getMsg('app.form.name'), 
                    width: 150, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    id: entity+'metadatamaincolumn', 
                    header: bundle.getMsg('app.form.value'), 
                    width: 270, 
                    sortable: true, 
                    dataIndex: 'value',
                    editor: new Ext.form.TextField({
                        allowBlank: false
                    })
                },{
                    header: bundle.getMsg('group.field.label'), 
                    width: 160, 
                    hidden: true, 
                    sortable: true, 
                    dataIndex: 'category'
                }],	
                view: new Ext.grid.GroupingView({
                    markDirty: false,
                    forceFit:true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? bundle.getMsg("app.form.elements") : bundle.getMsg("app.form.element")]})'
                }),				
                stripeRows: true,				
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:true
                })
            });
        },

        showWindow : function(animateTarget){

        },

        applySecurity : function(groups, permissions){

        }
    }
}();