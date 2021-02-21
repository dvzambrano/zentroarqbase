
LogApp = function() {
    return {
        init : function(LogApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/log/request',
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                groupField:'user'
            });

            this.filesComboStore = new Ext.data.Store({
                url: config.app_host + '/file/request/method/load',
                baseParams:{
                    path: 'log'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.expander = new Ext.ux.grid.RowExpander({
                tpl : new Ext.Template(
                    '<br/>'+bundle.getMsg('log.object.summary')+':<hr/> <p>{obj}</p>'
                    )
            });
			
            this.gridPanel = new Ext.grid.GridPanel({
                id: 'gridPanelLog',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('text_horizontalrule'),
                title: config.app_showgridtitle ? bundle.getMsg("log.grid.title") : '',
                autoExpandColumn: 'logmaincolumn',
                store: this.store,
                loadMask: true,

                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['LogApp'].gridPanel);
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
                        //window.open(config.app_host + '/uploads/tutorial/page.html');
                    }
                }],
				
                columns: [this.expander, {
                    header: bundle.getMsg('app.form.date'), 
                    width: 100, 
                    sortable: true, 
                    dataIndex: 'id'
                },{
                    header: bundle.getMsg('user.field.label'), 
                    width: 80, 
                    sortable: true, 
                    dataIndex: 'user'
                },{
                    id:'logmaincolumn', 
                    header: bundle.getMsg('app.form.comment'),
                    width: 500,
                    dataIndex: 'action'
                }],
				
                view: new Ext.grid.GroupingView({
                    markDirty: false,
                    forceFit:true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? bundle.getMsg("app.form.elements") : bundle.getMsg("app.form.element")]})'
                }),
				
                bbar: new Ext.PagingToolbar({
                    pageSize: Number.MAX_VALUE,
                    store: this.store,
                    items:['->', new Ext.form.ComboBox({
                        width: 310,
                        store: window['LogApp'].filesComboStore,
                        listeners: {
                            focus: function(combo) {
                                if(!combo.readOnly && !combo.disabled)
                                    combo.getStore().load();
                            },
                            select: function(combo) {
                                window['LogApp'].gridPanel.getStore().load({
                                    params:{
                                        file: combo.getValue()
                                    }
                                });
                            }
                        },
                        valueField: 'text',
                        displayField: 'text',
                        tpl: '<tpl for="."><div ext:qtip="{lastmod}" class="x-combo-list-item">{text}</div></tpl>',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        selectOnFocus:true,
                        forceSelection:true,
                        emptyText: bundle.getMsg('app.form.select')
                    })]
                }),
				
                stripeRows: true,
                plugins: this.expander,
                animCollapse: false,
				
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:false
                }),

                listeners: {
                    activate: function(gridpanel){
                        gridpanel.getSelectionModel().clearSelections();
                        window['LogApp'].filesComboStore.load({
                            callback: function(records, options, success ){
                                window['LogApp'].gridPanel.getStore().load({
                                    params:{
                                        file: records[0].get('name')
                                    }
                                });
                            }
                        })

                    }
                }
            });
        },

        showWindow : function(animateTarget){

        },

        applySecurity : function(groups, permissions){

        }
    }
}();