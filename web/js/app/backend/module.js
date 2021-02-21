
ModuleApp = function() {
    return {
        init : function(ModuleApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/module/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                groupField:'parent'
            });
			
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/module/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('module.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
		
            this.iconsComboStore = new Ext.data.Store({
                url: config.app_host + '/file/request/method/load',
                baseParams:{
                    path: 'web/images/icons/famfamfam/',
                    filtering: true
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.selectedAtributesComboStore = new Ext.data.Store({
                url: config.app_host + '/module/request/method/load',
                baseParams:{
                    component: 'moduledependency'
                },
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                reader: new Ext.data.JsonReader()
            });

            this.selectedRelationsComboStore = new Ext.data.Store({
                url: config.app_host + '/module/request/method/load',
                baseParams:{
                    component: 'moduledependency'
                },
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                reader: new Ext.data.JsonReader()
            });
			
            this.selectedDependenciesComboStore = new Ext.data.Store({
                url: config.app_host + '/module/request/method/load',
                baseParams:{
                    component: 'moduledependency'
                },
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                reader: new Ext.data.JsonReader()
            });
			
            this.selectedPermissionsComboStore = new Ext.data.Store({
                url: config.app_host + '/module/request/method/load',
                baseParams:{
                    component: 'modulepermission'
                },
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                reader: new Ext.data.JsonReader()
            });

            this.attributeTypeComboStore = new Ext.data.ArrayStore({
                fields: ['name', 'nick'],
                data : [
                [bundle.getMsg('module.attribute.type.string'), 'string'], 
                [bundle.getMsg('module.attribute.type.bool'), 'boolean'], 
                [bundle.getMsg('module.attribute.type.decimal'), 'decimal'], 
                [bundle.getMsg('module.attribute.type.integer'), 'integer']
                ]
            });

            this.relationTypeComboStore = new Ext.data.ArrayStore({
                fields: ['name', 'nick'],
                data : [ 
                [bundle.getMsg('module.relation.type.onetoone'), 'onetoone'], 
                [bundle.getMsg('module.relation.type.onetomany'), 'onetomany'],
                [bundle.getMsg('module.relation.type.manytomany'), 'manytomany']
                ]
            });
			
            this.filters = new Ext.ux.grid.GridFilters({
                encode: true,
                local: false,
                menuFilterText: bundle.getMsg('app.languaje.find.label'),
                filters: [{
                    type: 'string',
                    dataIndex: 'name'
                },{
                    type: 'string',
                    dataIndex: 'comment'
                }]
            });

            this.infoTextItem = new Ext.Toolbar.TextItem('');

            this.gridPanel = new Ext.ux.tree.TreeGrid({
                id: 'gridPanelModule',
                rootVisible:false,
                iconCls: Ext.ux.Icon('flag_orange'),

                region:'center',
                title: config.app_showgridtitle ? bundle.getMsg("module.grid.title") : '',
                autoExpandColumn: 'modulemaincolumn',
                enableDD: false,
                useArrows: false,
                lines: true,
                containerScroll: true,
                animate: true,
                columnsText: bundle.getMsg('app.layout.columns'),
                maskConfig: {
                    msg: bundle.getMsg("app.layout.loading")
                },
                keys: [panelKeysMap],

                view: new Ext.grid.GroupingView(),

                plugins: [this.filters],

                tools:[{
                    id:'refresh',
                    qtip: bundle.getMsg('app.languaje.refresh.label'),
                    handler:function(event,toolEl,panel,tc){
                        window['ModuleApp'].gridPanel.getSelectionModel().clearSelections();
                        window['ModuleApp'].gridPanel.getRootNode().removeAll();
                        window['ModuleApp'].gridPanel.getLoader().load(window['ModuleApp'].gridPanel.getRootNode());

                        window['ModuleApp'].gridPanel.expandBtn.setDisabled(false);
                        window['ModuleApp'].gridPanel.collapseBtn.setDisabled(true);
                    }
                },{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['ModuleApp'].gridPanel);
                    }
                }],

                columns: [{
                    id:'modulemaincolumn', 
                    header: bundle.getMsg('app.form.name'), 
                    width: 260, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    header: bundle.getMsg('app.form.comment'), 
                    width: 360, 
                    sortable: true, 
                    dataIndex: 'comment',
                    tpl: new Ext.XTemplate('{comment:this.renderValue}', {
                        renderValue: formatNull
                    })
                }],

                selModel: new Ext.tree.MultiSelectionModel({
                    listeners: {
                        selectionchange : function(selectionModel) {
                            App.selectionChange(selectionModel);
                            
                            var deleteable = true;
                            for (var i = 0; i < selectionModel.selNodes.length; i++){
                                if (selectionModel.selNodes[i].attributes.is_base)
                                    deleteable = false;                              
                            }
                            selectionModel.tree.removeBtn.setDisabled(!deleteable || selectionModel.selNodes.length < 1);
                            
                            window['ModuleApp'].gridPanel.generateCode.setDisabled(selectionModel.getSelectedNodes().length != 1);                            
                            window['ModuleApp'].gridPanel.downBtn.setDisabled(selectionModel.getSelectedNodes().length != 1);
                            window['ModuleApp'].gridPanel.upBtn.setDisabled(selectionModel.getSelectedNodes().length != 1);
                        }
                    }
                }),

                root: new Ext.tree.AsyncTreeNode({
                    text: 'root',
                    id:'NULL'
                }),

                listeners: {
                    click: function(node){
                        App.selectionChange(node.getOwnerTree().getSelectionModel());
                    },
                    beforedblclick: function(){
                        window['ModuleApp'].gridPanel.updateBtn.fireEvent('click', window['ModuleApp'].gridPanel.updateBtn);
                        return false;
                    },
                    beforeexpandnode: function(node, deep, anim){
                        node.getOwnerTree().collapseBtn.setDisabled(false);
                    },
                    beforecollapsenode: function(node, deep, anim){
                        node.getOwnerTree().expandBtn.setDisabled(false);
                    },
                    filterupdate: function(){
                        var text = App.getFiltersText(window['ModuleApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['ModuleApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['ModuleApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['ModuleApp'].infoTextItem.getEl()).update('');
                    },
                    containerclick: treeContainerClick
                },

                loader: new Ext.tree.TreeLoader({
                    baseParams: {
                        permissions: 1,
                        component: 'tree',
                        start: 0
                    },
                    dataUrl: config.app_host + '/module/request/method/load',
                    listeners: {
                        load: function(treeLoader, node, response){
                            node.getOwnerTree().treeGridSorter = new Ext.ux.tree.TreeGridSorter(node.getOwnerTree(), {
                                property: 'increase'
                            });
                            node.getOwnerTree().treeGridSorter.doSort(node);

                            if(response.responseText.indexOf('signinForm')>0)
                                showSesionExpiredMsg();

                            for(var i = 0; i < node.childNodes.length; i++){
                                if(node.childNodes[i].attributes.is_base)
                                    node.childNodes[i].getUI().addClass('row-italic');
                                if(node.childNodes[i].attributes.is_base)
                                    node.childNodes[i].getUI().addClass('row-background-blue');

                                if(node.childNodes[i].attributes.customicon != ''){
                                    var extension = node.childNodes[i].attributes.customicon;
                                    while(extension.indexOf('.')>-1)
                                        extension = extension.substring(extension.indexOf('.')+1, extension.length);
                                    var icon = node.childNodes[i].attributes.customicon.replace('.'+extension, '');
                                    
                                    node.childNodes[i].setIconCls(Ext.ux.Icon(icon, 'famfamfam'));
                                }
                            }
                        }
                    }
                }),

                tbar: [{
                    text: bundle.getMsg('app.form.add'),
                    iconCls: Ext.ux.Icon('add'),
                    ref: '../addBtn',
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            window['ModuleApp'].formPanel.tabPanel.dependencyPanel.setDisabled(false);
                            window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.setDisabled(false);
                            window['ModuleApp'].gridPanel.getSelectionModel().clearSelections();
                            window['ModuleApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
                        }
                    }
                },{
                    ref: '../updateBtn',
                    text: bundle.getMsg('app.form.info'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('information'),
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            App.mask.show();

                            var finalFn = function(){
                                var node = window['ModuleApp'].gridPanel.getSelectionModel().getSelectedNodes();
                                if (node && node.length == 1){
                                    node = node[0];
                                    var dr = new Ext.data.Record({
                                        name: node.attributes.name,
                                        nick: node.attributes.nick,
                                        comment: node.attributes.comment,
                                        icon: node.attributes.customicon,
                                        is_multientidable: node.attributes.is_multientidable,
                                        is_multientity: node.attributes.is_multientity,
                                        parentid: node.attributes.parent
                                    });
                                    if (!window['ModuleApp'].parentRecord){
                                        window['ModuleApp'].parentRecord = new Object;
                                        window['ModuleApp'].parentRecord.data = new Object;
                                    }
                                    window['ModuleApp'].parentRecord.id = node.attributes.parentid;
                                    window['ModuleApp'].parentRecord.data.path = node.parentNode.getPath();
                                    window['ModuleApp'].formPanel.getForm().loadRecord(dr);

                                    window['ModuleApp'].formPanel.isactiveRadioGroup.setValue('module_active', node.attributes.is_active);
                                    window['ModuleApp'].formPanel.isactiveRadioGroup.setValue('module_inactive', !node.attributes.is_active);

                                    var array, i, record;
                                    
                                    if(node.attributes.Permissions && node.attributes.Permissions.length > 0){
                                        window['ModuleApp'].selectedPermissionsComboStore.removeAll();
                                        for (i = 0; i < node.attributes.Permissions.length; i++){
                                            record = window['UserApp'].permissionsComboStore.getAt(window['UserApp'].permissionsComboStore.find('id', node.attributes.Permissions[i].id, 0, true, true));
                                            if(record){
                                                window['UserApp'].permissionsComboStore.remove(record);
                                                window['ModuleApp'].selectedPermissionsComboStore.add(record);
                                            }
                                        }

                                    }

                                    window['ModuleApp'].formPanel.tabPanel.dependencyPanel.setDisabled(node.attributes.is_base);
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.setDisabled(node.attributes.is_base);

                                    if(!node.attributes.is_base){
                                        if(node.attributes.DependentModules && node.attributes.DependentModules.length > 0){
                                            window['ModuleApp'].selectedDependenciesComboStore.removeAll();
                                            for (i = 0; i < node.attributes.DependentModules.length; i++){
                                                record = window['ModuleApp'].comboStore.getAt(window['ModuleApp'].comboStore.find('id', node.attributes.DependentModules[i].id, 0, true, true));
                                                if(record){
                                                    window['ModuleApp'].comboStore.remove(record);
                                                    window['ModuleApp'].selectedDependenciesComboStore.add(record);
                                                }
                                            }

                                        }

                                        if(node.attributes.attributes){
                                            array = Ext.decode(node.attributes.attributes);
                                            if(array){
                                                window['ModuleApp'].selectedAtributesComboStore.removeAll();
                                                for (i = 0; i < array.length; i++)
                                                    window['ModuleApp'].selectedAtributesComboStore.insert(window['ModuleApp'].selectedAtributesComboStore.getCount(), new Ext.data.Record({
                                                        ispk: array[i].ispk,
                                                        isak: array[i].isak,
                                                        name: array[i].name,
                                                        nick: array[i].nick,
                                                        type: array[i].type,
                                                        restriction: array[i].restriction,
                                                        nulleable: array[i].nulleable
                                                    }));
                                            }
                                        }

                                        if(node.attributes.relations){
                                            array = Ext.decode(node.attributes.relations);
                                            if(array){
                                                window['ModuleApp'].selectedRelationsComboStore.removeAll();
                                                for (i = 0; i < array.length; i++)
                                                    window['ModuleApp'].selectedRelationsComboStore.insert(window['ModuleApp'].selectedRelationsComboStore.getCount(), new Ext.data.Record({
                                                        attributeid: array[i].attributeid,
                                                        attribute: array[i].attribute,
                                                        typeid: array[i].typeid,
                                                        type: array[i].type,
                                                        moduleid: array[i].moduleid,
                                                        module: array[i].module,
                                                        moduleattributeid: array[i].moduleattributeid,
                                                        moduleattribute: array[i].moduleattribute
                                                    }));

                                            }
                                        }
                                    }
                                }
                                else
                                    window['ModuleApp'].formPanel.getForm().reset();
                                window['ModuleApp'].showWindow(button.getEl(), hideApply, callback);


                                App.mask.hide();
                            };

                            syncLoad([
                                window['UserApp'].permissionsComboStore,
                                window['ModuleApp'].comboStore
                                ], finalFn);
                        }
                    }
                },{
                    ref: '../removeBtn',
                    text: bundle.getMsg('app.form.delete'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('delete'),
                    listeners: {
                        click: function(button, eventObject, callback) {
                            Ext.defer(function(){
                                Ext.Msg.show({
                                    title: bundle.getMsg('app.msg.warning.title'),
                                    msg: bundle.getMsg('app.msg.warning.deleteselected.text'),
                                    buttons: Ext.Msg.YESNO,
                                    fn: function(btn, text){
                                        if (btn == 'yes'){
                                            var nodes = window['ModuleApp'].gridPanel.getSelectionModel().getSelectedNodes();

                                            var array = new Array();
                                            for (var i=0; i<nodes.length; i++){
                                                array.push(nodes[i].id);

                                                new Ext.data.Connection().request({
                                                    url: config.app_host + '/file/request/method/degenerate',
                                                    params: {
                                                        appname: 'backend',
                                                        modulename: nodes[i].attributes.name,
                                                        modulenick: nodes[i].attributes.nick
                                                    },
                                                    failure: requestFailed
                                                });
                                            }

                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/module/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    for (var i=0; i<nodes.length; i++){
                                                        nodes[i].unselect();
                                                        var el = Ext.fly(nodes[i].ui.elNode);
                                                        if(el)
                                                            el.ghost('l', {
                                                                callback: nodes[i].remove, 
                                                                scope: nodes[i], 
                                                                duration: .4
                                                            });
                                                    }
                                                    if(callback){
                                                        if(callback.fn)
                                                            callback.fn(callback.params);
                                                        else
                                                            callback();
                                                    }
                                                }
                                            });
                                        }
                                    },
                                    animEl: 'elId',
                                    icon: Ext.MessageBox.QUESTION
                                });
                            }, 100, this);
                        }
                    }
                },'-',{
                    ref: '../generateCode',
                    text: bundle.getMsg('module.generate.code'),
                    iconCls: Ext.ux.Icon('html_valid'),
                    disabled: true,
                    listeners: {
                        click: function(button) {
                            var node = window['ModuleApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(node && node.length>0)
                                node = node[0];

                            function submitFn(button, eventObject, callback){
                                if (window['ModuleApp'].codeGeneratorFormPanel.getForm().isValid())
                                    if (window['ModuleApp'].codeGeneratorFormPanel.generateoptionsCheckBoxGroup.disabled){
                                        Ext.Msg.show({
                                            title: bundle.getMsg('app.msg.warning.title'),
                                            msg: String.format(bundle.getMsg('app.msg.warning.degeneratecode.text'), node.attributes.name, '<b>', '</b>'),
                                            buttons: Ext.Msg.YESNO,
                                            fn: function(btn, text){
                                                if (btn == 'yes'){
                                                    var mask = new Ext.LoadMask(window['ModuleApp'].window.getEl(), {
                                                        msg: bundle.getMsg('app.layout.loading')+'...'
                                                    });
                                                    mask.show();
                                                    new Ext.data.Connection().request({
                                                        url: config.app_host + '/file/request/method/degenerate',
                                                        params: {
                                                            appname: 'backend',
                                                            modulename: node.attributes.name,
                                                            modulenick: node.attributes.nick
                                                        },
                                                        failure: requestFailed,
                                                        success: function(form, action) {
                                                            mask.hide();
                                                            requestSuccessful(form, action);
                                                            if(button.id == window['ModuleApp'].window.submitBtn.id)
                                                                window['ModuleApp'].window.hide();
                                                            if (callback)
                                                                callback();
                                                        }
                                                    });
                                                }
                                            },
                                            animEl: 'elId',
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                    }
                                    else {
                                        var mask = new Ext.LoadMask(window['ModuleApp'].window.getEl(), {
                                            msg: bundle.getMsg('app.layout.loading')+'...'
                                        });
                                        mask.show(); 

                                        var radios = window['ModuleApp'].codeGeneratorFormPanel.generateoptionsCheckBoxGroup.getValue();
                                        var array=new Array();
                                        for (var i=0; i<radios.length; i++)
                                            array.push(radios[i].name);

                                        Ext.Msg.show({
                                            title: bundle.getMsg('app.msg.warning.title'),
                                            msg: String.format(bundle.getMsg('app.msg.warning.generatecode.text'), node.attributes.name, '<b>', '</b>'),
                                            buttons: Ext.Msg.YESNO,
                                            fn: function(btn, text){
                                                if (btn == 'yes'){
                                                    new Ext.data.Connection().request({
                                                        url: config.app_host + '/file/request/method/duplicate',
                                                        params: {
                                                            appname: 'backend',
                                                            modulename: node.attributes.name,
                                                            modulenick: node.attributes.nick,
                                                            options: Ext.encode(array),
                                                            attributes: node.attributes.attributes,
                                                            relations: node.attributes.relations,
                                                            parentattribute: Ext.getCmp('checkboxGroupView-treegridfield').getValue(),
                                                            multientidable: node.attributes.is_multientidable
                                                        },
                                                        failure: requestFailed,
                                                        success: function(form, action) {
                                                            mask.hide(); 
                                                            requestSuccessful(form, action);
                                                            if(button.id == window['ModuleApp'].window.submitBtn.id)
                                                                window['ModuleApp'].window.hide();
                                                            if (callback)
                                                                callback();
                                                        }
                                                    });
                                                }
                                            },
                                            animEl: 'elId',
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                    }
                            }

                            function cancelFn(){
                                window['ModuleApp'].codeGeneratorFormPanel.getForm().reset();
                                window['ModuleApp'].window.hide();
                            }

                            if(node.attributes.attributes){
                                var array = Ext.decode(node.attributes.attributes);
                                if(array){
                                    window['ModuleApp'].selectedAtributesComboStore.removeAll();
                                    for (var i = 0; i < array.length; i++){
                                        window['ModuleApp'].selectedAtributesComboStore.insert(window['ModuleApp'].selectedAtributesComboStore.getCount(), new Ext.data.Record({
                                            name: array[i].name,
                                            nick: array[i].nick,
                                            type: array[i].type,
                                            restriction: array[i].restriction,
                                            nulleable: array[i].nulleable
                                        }));
                                    }
                                }
                            }

                            window['ModuleApp'].window = App.showWindow(bundle.getMsg('module.generate.code'), 750, 210, window['ModuleApp'].codeGeneratorFormPanel, 
                                submitFn,
                                cancelFn, 
                                button);
                        }
                    }
                },'->',{
                    ref: '../upBtn',
                    disabled: true,
                    iconCls: Ext.ux.Icon('bullet_arrow_up'),
                    tooltip: bundle.getMsg('module.action.moveincreaseup'),
                    listeners: {
                        click: function(button, eventObject) {
                            window['ModuleApp'].moveIncrease('');
                        }
                    }
                }, {
                    ref: '../downBtn',
                    disabled: true,
                    iconCls: Ext.ux.Icon('bullet_arrow_down'),
                    tooltip: bundle.getMsg('module.action.moveincreasedown'),
                    listeners: {
                        click: function(button, eventObject) {
                            window['ModuleApp'].moveIncrease(1);
                        }
                    }
                }, '-',{
                    ref: '../expandBtn',
                    iconCls: Ext.ux.Icon('expand-all', 'myicons'),
                    tooltip: bundle.getMsg('app.form.expandall'),
                    listeners: {
                        click: function() {
                            var nodes = window['ModuleApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].expand(true);
                            else{
                                window['ModuleApp'].gridPanel.expandAll();
                                window['ModuleApp'].gridPanel.expandBtn.setDisabled(true);
                                window['ModuleApp'].gridPanel.collapseBtn.setDisabled(false);
                            }
                        }
                    }
                },{
                    ref: '../collapseBtn',
                    disabled: true,
                    iconCls: Ext.ux.Icon('collapse-all', 'myicons'),
                    tooltip: bundle.getMsg('app.form.collapseall'),
                    listeners: {
                        click: function() {
                            var nodes = window['ModuleApp'].gridPanel.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].collapse(true);
                            else {
                                window['ModuleApp'].gridPanel.collapseAll();
                                window['ModuleApp'].gridPanel.expandBtn.setDisabled(false);
                                window['ModuleApp'].gridPanel.collapseBtn.setDisabled(true);
                            }
                        }
                    }
                }],

                bbar: new Ext.PagingToolbar({
                    pageSize: Number.MAX_VALUE,
                    store: this.store,
                    items:[{
                        tooltip: bundle.getMsg('app.form.clearfilters'),
                        iconCls: Ext.ux.Icon('table_lightning'),
                        handler: function () {
                            window['ModuleApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['ModuleApp'].infoTextItem.getEl()).update('');
                            window['ModuleApp'].gridPanel.getSelectionModel().clearSelections();
                        } 
                    },'-', this.infoTextItem],
                    doRefresh : function(){
                        window['ModuleApp'].gridPanel.getLoader().load(window['ModuleApp'].gridPanel.getRootNode());

                        window['ModuleApp'].gridPanel.expandBtn.setDisabled(false);
                        window['ModuleApp'].gridPanel.collapseBtn.setDisabled(true);
                    },
                    displayInfo: true,
                    displayMsg: bundle.getMsg('app.bbar.msg'),
                    emptyMsg: bundle.getMsg('app.bbar.msg'),
                    listeners: {
                        render: function(toolbar) {
                            toolbar.items.items[4].setDisabled(true);
                        }
                    }
                })
            });
			
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/module/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',						
                keys: [formKeyMaping],
                items: [{
                    layout:'column',
                    items:[{
                        columnWidth:.6,
                        layout: 'form',
                        items: [{
                            xtype:'textfield',
                            name: 'name',
                            anchor:'-20',
                            allowBlank: false,         
                            maxLength: 130, 
                            fieldLabel: bundle.getMsg('app.form.name')+'<span style="color:red;"><sup>*</sup></span>'
                        },{
                            xtype:'textarea',
                            name: 'comment',
                            anchor:'-20',
                            fieldLabel: bundle.getMsg('app.form.comment')
                        }]
                    },{
                        columnWidth:.4,
                        layout: 'form',
                        items: [{
                            ref: '../../nickField',
                            xtype:'textfield',
                            name: 'nick',
                            anchor:'-20',         
                            maxLength: 130, 
                            allowBlank:false,
                            regex: Date.patterns.LettersOnly,
                            maskRe: Date.patterns.LettersOnly,
                            fieldLabel: bundle.getMsg('app.form.nick')+'<span style="color:red;"><sup>*</sup></span>',
                            listeners: {
                                blur: function(field){
                                    var obj = window['ModuleApp'].validateNick(field.getValue());
                                    if(!obj.valid)
                                        field.markInvalid(String.format(bundle.getMsg('app.error.fieldinvalid.suggest'), obj.value));
                                }
                            }
                        },new Ext.form.ComboBox({
                            fieldLabel: bundle.getMsg('app.form.icon'),
                            name:'icon',
                            anchor:'-20',         
                            maxLength: 130, 
                            store: this.iconsComboStore,
                            listeners: {
                                focus: function(combo) {
                                    if(!combo.readOnly && !combo.disabled)
                                        combo.getStore().load();
                                }
                            },
                            valueField: 'url',
                            displayField: 'text',
                            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item"><img src="{noweburl}"/>{text}</div></tpl>',
                            typeAhead: true,
                            mode: 'local',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            forceSelection:true,
                            emptyText: bundle.getMsg('app.form.select')
                        }), new Ext.form.ClearableCombo({
                            fieldLabel : bundle.getMsg('module.field.parent'),
                            store: this.comboStore,
                            name: 'parentid',
                            anchor:'-20',         
                            maxLength: 400, 
                            emptyText: bundle.getMsg('app.form.typehere'),
                            minChars: config.app_characteramounttofind,
                            displayField: 'name',
                            typeAhead: false,
                            loadingText: bundle.getMsg('app.msg.wait.searching'),
                            pageSize: config.app_elementsongrid/2,
                            tpl: new Ext.XTemplate(
                                '<tpl for="."><div class="search-item">',
                                '<h3><span>{parent}</span>{name}</h3>',
                                '{comment}',
                                '</div></tpl>'
                                ),
                            itemSelector: 'div.search-item',
                            listeners: {
                                beforequery: function(queryEvent) {
                                    delete queryEvent.combo.lastQuery;
                                    var node = window['ModuleApp'].gridPanel.getSelectionModel().getSelectedNodes();
                                    if (node && node.length>0){
                                        node = node[0];

                                        var elements = new Array();
                                        var element = new Object;
                                        element.id = node.id;
                                        elements.push(element);

                                        window['ModuleApp'].comboStore.baseParams.distinct = Ext.encode(elements);
                                    }
                                    this.setValue(queryEvent.query);
                                },
                                select: function(combo, record, index ){
                                    window['ModuleApp'].parentRecord = record;
                                    window['ModuleApp'].comboStore.baseParams.distinct = '';
                                    this.collapse();
                                },
                                blur: function(field) {		
                                    if(field.getRawValue() == '')
                                        window['ModuleApp'].parentRecord = false;
                                    
                                    window['ModuleApp'].comboStore.baseParams.distinct = '';
                                }
                            },
                            triggerConfig: {
                                tag:'span', 
                                cls:'x-form-twin-triggers', 
                                style:'padding-right:2px',
                                cn:[{
                                    tag: "img", 
                                    src: Ext.BLANK_IMAGE_URL, 
                                    cls: "x-form-trigger x-form-search-trigger"
                                }]
                            }
                        })]
                    }]
                }, new Ext.TabPanel({
                    ref: 'tabPanel',
                    deferredRender: false,
                    height: 190,
                    anchor:'-20',
                    defaults:{
                        autoHeight:false
                    }, 			
                    activeTab: 0,
			
                    items:[new Ext.grid.GridPanel({
                        ref: 'attributesGridPanel',
                        stripeRows: true,
                        autoExpandColumn: 'userattributesmaincolumn',
                        title: bundle.getMsg('module.attribute.name'),
                        iconCls: Ext.ux.Icon('bricks'),
                        store: this.selectedAtributesComboStore,
                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect: false, 
                            listeners: {
                                selectionchange: function(selectionModel) {
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.removeRow.setDisabled(selectionModel.getCount() < 1);
                                }
                            }
                        }),	
                        view: new Ext.grid.GridView({
                            markDirty: false,
                            forceFit:true
                        }),
                        columns: [{
                            header: 'PK',
                            width: 40, 
                            sortable: true, 
                            dataIndex: 'ispk',
                            renderer : function(val) {
                                if (val && (val === 1 || val === true)) {
                                    return '<img title="" src="'+config.app_host+'/images/icons/famfamfam/key.png" alt=""/>';
                                }
                                return '';
                            }
                        },{
                            header: 'AK',
                            width: 40, 
                            sortable: true, 
                            dataIndex: 'isak',
                            renderer : function(val) {
                                if (val && (val === 1 || val === true)) {
                                    return '<img title="" src="'+config.app_host+'/images/icons/famfamfam/lock.png" alt=""/>';
                                }
                                return '';
                            }
                        },{
                            id: 'userattributesmaincolumn',
                            header: bundle.getMsg('app.form.name'),
                            width: 120, 
                            sortable: true, 
                            dataIndex: 'name'
                        },{
                            header: bundle.getMsg('app.form.nick'),
                            width: 120, 
                            sortable: true, 
                            dataIndex: 'nick'
                        },{
                            header: bundle.getMsg('module.attribute.type'),
                            width: 150, 
                            sortable: true, 
                            dataIndex: 'type'
                        },{
                            header: '',
                            width: 60, 
                            sortable: true, 
                            dataIndex: 'restriction'
                        },{
                            header: 'NULL',
                            width: 40, 
                            sortable: true, 
                            dataIndex: 'nulleable',
                            renderer : function(val) {
                                if (val && (val === 1 || val === true)) {
                                    return '<img title="" src="'+config.app_host+'/images/icons/famfamfam/tick.png" alt=""/>';
                                }
                                return '';
                            }
                        }],
                        tbar: [{
                            ref: '../pkCheckBox',
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: 'PK',
                            listeners: {
                                check: function(checkbox, checked) {
                                    if(checked){
                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nulleableCombo.reset();
                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.akCheckBox.reset();
                                    }
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nulleableCombo.setDisabled(checked);
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.akCheckBox.setDisabled(checked);
                                }
                            }
                        },{
                            xtype: 'displayfield', 
                            value: '&nbsp;&nbsp;'
                        },{
                            ref: '../akCheckBox',
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: 'AK',
                            listeners: {
                                check: function(checkbox, checked) {
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nulleableCombo.setDisabled(checked);
                                }
                            }
                        },{
                            xtype: 'displayfield', 
                            value: '&nbsp;&nbsp;'
                        }, new Ext.Toolbar.TextItem(bundle.getMsg('app.form.name')+'<span style="color:red;"><sup>*</sup></span>'+': '),{
                            ref: '../nameField',
                            xtype:'textfield',
                            width: 100, 
                            msgTarget: 'qtip',
                            allowBlank:false
                        },{
                            xtype: 'displayfield', 
                            value: '&nbsp;&nbsp;'
                        },new Ext.Toolbar.TextItem(bundle.getMsg('app.form.nick')+'<span style="color:red;"><sup>*</sup></span>'+': '),{
                            ref: '../nickField',
                            xtype:'textfield',
                            maskRe: Date.patterns.LettersOnly,
                            regex: Date.patterns.LettersOnly,
                            width: 60, 
                            msgTarget: 'qtip',
                            allowBlank:false
                        },{
                            xtype: 'displayfield', 
                            value: '&nbsp;&nbsp;'
                        },new Ext.Toolbar.TextItem(bundle.getMsg('module.attribute.type')+'<span style="color:red;"><sup>*</sup></span>'+': '),new Ext.form.ComboBox({
                            ref: '../typeCombo',
                            store: this.attributeTypeComboStore,
                            width: 110, 
                            valueField: 'nick',
                            displayField:'name',
                            typeAhead: true,
                            mode: 'local',
                            forceSelection: true,
                            triggerAction: 'all',
                            selectOnFocus:true,
                            allowBlank:false
                        }),{
                            xtype: 'displayfield', 
                            value: '&nbsp;'
                        },{
                            ref: '../restrictionCombo',
                            xtype:'textfield',
                            width: 30, 
                            msgTarget: 'qtip'
                        },{
                            xtype: 'displayfield', 
                            value: '&nbsp;'
                        },{
                            xtype: 'checkbox',
                            ref: '../nulleableCombo',
                            fieldLabel: '',
                            boxLabel: 'NULL'
                        },'->',{
                            tooltip: bundle.getMsg('app.form.addrow'),
                            iconCls: Ext.ux.Icon('table_row_insert'),
                            listeners: {
                                click: function() {
                                    if(window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nameField.isValid() && window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nickField.isValid() && window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.typeCombo.isValid()){
                                        if (window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.pkCheckBox.getValue() == true)
                                            window['ModuleApp'].selectedAtributesComboStore.each(function(record){
                                                if(record.get('ispk'))
                                                    record.set('isak', true);
                                                record.set('ispk', false);
                                            });

                                        window['ModuleApp'].selectedAtributesComboStore.insert(window['ModuleApp'].selectedAtributesComboStore.getCount(), new Ext.data.Record({
                                            ispk: window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.pkCheckBox.getValue(),
                                            isak: window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.akCheckBox.getValue(),
                                            name: window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nameField.getValue(),
                                            nick: window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nickField.getValue(),
                                            type: window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.typeCombo.getValue(),
                                            restriction: window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.restrictionCombo.getValue(),
                                            nulleable: window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nulleableCombo.getValue()
                                        }));

                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.reconfigure(window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.getStore(), window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.getColumnModel());

                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.pkCheckBox.reset();
                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.akCheckBox.reset();
                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nameField.reset();
                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nickField.reset();
                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.typeCombo.reset();
                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.restrictionCombo.reset();
                                        window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nulleableCombo.reset();
                                    }
                                }
                            }
                        },{
                            ref: '../removeRow',
                            tooltip: bundle.getMsg('app.form.deleterow'),
                            disabled: true,
                            iconCls: Ext.ux.Icon('table_row_delete'),
                            listeners: {
                                click: function() {
                                    window['ModuleApp'].deleteAtributes();
                                }
                            }
                        }],
                        listeners:{
                            keypress:function(e){		
                                if(e.getKey()==46)
                                    window['ModuleApp'].deleteAtributes();
                            }
                        }
                    }), new Ext.grid.GridPanel({
                        ref: 'relationsGridPanel',
                        stripeRows: true,
                        autoExpandColumn: 'userrelationsmaincolumn',
                        title: bundle.getMsg('module.relation.name'),
                        iconCls: Ext.ux.Icon('table_relationship'),
                        store: this.selectedRelationsComboStore,
                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect: false, 
                            listeners: {
                                selectionchange: function(selectionModel) {
                                    window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.removeBtn.setDisabled(selectionModel.getCount() < 1);
                                }
                            }
                        }),	
                        view: new Ext.grid.GridView({
                            markDirty: false,
                            forceFit:true
                        }),
                        columns: [{
                            header: bundle.getMsg('module.attribute.name'),
                            width: 120, 
                            sortable: true, 
                            dataIndex: 'attribute'
                        },{
                            header: bundle.getMsg('module.relation.type'),
                            width: 150, 
                            sortable: true, 
                            dataIndex: 'type'
                        },{
                            id:'userrelationsmaincolumn',
                            header: bundle.getMsg('module.field.label'),
                            width: 120, 
                            sortable: true, 
                            dataIndex: 'module'
                        }],
                        tbar: [new Ext.Toolbar.TextItem(bundle.getMsg('module.attribute.name')+': '),new Ext.form.ComboBox({
                            ref: '../fromattributeCombo',
                            valueField: 'nick',
                            width: 90, 
                            store: window['ModuleApp'].selectedAtributesComboStore,
                            displayField: 'name',
                            tpl: '<tpl for="."><div ext:qtip="{type}" class="x-combo-list-item">{name}</div></tpl>',
                            typeAhead: true,
                            mode: 'local',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            forceSelection:true,
                            emptyText: bundle.getMsg('app.form.select')
                        }),{
                            xtype: 'displayfield', 
                            value: '&nbsp;&nbsp;'
                        },new Ext.Toolbar.TextItem(bundle.getMsg('module.relation.type')+'<span style="color:red;"><sup>*</sup></span>'+': '),new Ext.form.ComboBox({
                            ref: '../typeCombo',
                            store: this.relationTypeComboStore,
                            width: 120, 
                            valueField: 'nick',
                            displayField:'name',
                            typeAhead: true,
                            mode: 'local',
                            forceSelection: true,
                            triggerAction: 'all',
                            selectOnFocus:true,
                            allowBlank:false,
                            emptyText: bundle.getMsg('app.form.select')
                        }),{
                            xtype: 'displayfield', 
                            value: '&nbsp;&nbsp;'
                        },new Ext.Toolbar.TextItem(bundle.getMsg('module.field.label')+': '),new Ext.form.ComboBox({
                            ref: '../moduleCombo',
                            valueField: 'nick',
                            width: 100, 
                            store: window['ModuleApp'].comboStore,
                            listeners: {
                                focus: function(combo) {
                                    if(!combo.readOnly && !combo.disabled)
                                        combo.getStore().load();
                                }
                            }, 
                            displayField: 'name',
                            tpl: '<tpl for="."><div ext:qtip="{comment}" class="x-combo-list-item">{name}</div></tpl>',
                            typeAhead: true,
                            mode: 'local',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            forceSelection:true,
                            emptyText: bundle.getMsg('app.form.select')
                        }),{
                            xtype: 'displayfield', 
                            value: '&nbsp;&nbsp;'
                        },new Ext.form.ComboBox({
                            ref: '../toattributeCombo',
                            valueField: 'nick',
                            width: 90, 
                            store: window['ModuleApp'].selectedAtributesComboStore,
                            displayField: 'name',
                            tpl: '<tpl for="."><div ext:qtip="{type}" class="x-combo-list-item">{name}</div></tpl>',
                            typeAhead: true,
                            mode: 'local',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            forceSelection:true,
                            emptyText: bundle.getMsg('app.form.select')
                        }),'->',{
                            tooltip: bundle.getMsg('app.form.addrow'),
                            iconCls: Ext.ux.Icon('table_row_insert'),
                            listeners: {
                                click: function() {
                                    if(window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.moduleCombo.isValid() && window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.typeCombo.isValid() && window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.fromattributeCombo.isValid()){
                                        window['ModuleApp'].selectedRelationsComboStore.insert(window['ModuleApp'].selectedRelationsComboStore.getCount(), new Ext.data.Record({
                                            attributeid: window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.fromattributeCombo.getValue(),
                                            attribute: window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.fromattributeCombo.getRawValue(),
                                            typeid: window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.typeCombo.getValue(),
                                            type: window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.typeCombo.getRawValue(),
                                            moduleid: window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.moduleCombo.getValue(),
                                            module: window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.moduleCombo.getRawValue(),
                                            moduleattributeid: window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.toattributeCombo.getValue(),
                                            moduleattribute: window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.toattributeCombo.getRawValue()
                                        }));

                                        window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.moduleCombo.reset();
                                        window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.typeCombo.reset();
                                        window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.fromattributeCombo.reset();
                                    }

                                }
                            }
                        },{
                            ref: '../removeBtn',
                            tooltip: bundle.getMsg('app.form.deleterow'),
                            disabled: true,
                            iconCls: Ext.ux.Icon('table_row_delete'),
                            listeners: {
                                click: function() {
                                    window['ModuleApp'].deleteRelations();
                                }
                            }
                        }],
                        listeners:{
                            keypress:function(e){		
                                if(e.getKey()==46)
                                    window['ModuleApp'].deleteRelations();
                            }
                        }
                    }), new Ext.Panel({
                        ref: 'dependencyPanel',
                        title: bundle.getMsg('module.field.dependency'),
                        iconCls: Ext.ux.Icon('disconnect'),
                        bodyStyle:'padding:5px 5px 0',
                        height: 150,
                        items: [{
                            xtype: 'itemselector',
                            name: 'dependencies',
                            imagePath: './js/extjs/ux/images/',
                            multiselects: [{
                                width: 300,
                                height: 150,
                                store: this.comboStore,
                                legend: bundle.getMsg('app.languaje.select.available'),
                                displayField: 'name',
                                valueField: 'id'
                            },{
                                width: 300,
                                height: 150,
                                store: this.selectedDependenciesComboStore,
                                legend: bundle.getMsg('app.languaje.select.selected'),
                                displayField: 'name',
                                valueField: 'id'
                            }]
                        }]
                    }), new Ext.Panel({
                        ref: 'permissionPanel',
                        title: bundle.getMsg('permission.tab.label'),
                        iconCls: Ext.ux.Icon('key'),
                        bodyStyle:'padding:5px 5px 0',
                        height: 150,
                        items: [{
                            xtype: 'itemselector',
                            name: 'permissions',
                            imagePath: './js/extjs/ux/images/',
                            multiselects: [{
                                width: 300,
                                height: 150,
                                store: window['UserApp'].permissionsComboStore,
                                legend: bundle.getMsg('app.languaje.select.available'),
                                displayField: 'description',
                                valueField: 'id'
                            },{
                                width: 300,
                                height: 150,
                                store: this.selectedPermissionsComboStore,
                                legend: bundle.getMsg('app.languaje.select.selected'),
                                displayField: 'description',
                                valueField: 'id'
                            }]
                        }]
                    })]
                }),{
                    layout:'column',
                    items:[{
                        columnWidth:.3,
                        layout: 'form',
                        items: [{
                            ref: '../../isactiveRadioGroup',
                            xtype: 'radiogroup',
                            fieldLabel: '',
                            labelSeparator: '',
                            width: 150,
                            items: [{
                                boxLabel: bundle.getMsg('user.is.inactive'), 
                                id: 'module_inactive', 
                                name: 'module_is_active', 
                                inputValue: false
                            },{
                                boxLabel: bundle.getMsg('user.is.active'), 
                                id: 'module_active', 
                                name: 'module_is_active', 
                                inputValue: true, 
                                checked: true
                            }]
                        }]
                    },{
                        columnWidth:.4,
                        layout: 'form',
                        items: [{
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: bundle.getMsg('module.is.multientidable'), 
                            name: 'is_multientidable'
                        }]
                    },{
                        columnWidth:.3,
                        layout: 'form',
                        items: [{
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: bundle.getMsg('module.is.multientity'), 
                            name: 'is_multientity'
                        }]
                    }]
                }]
            });

            this.codeGeneratorFormPanel = new Ext.FormPanel({
                labelWidth: 5,
                frame: true,
                bodyStyle: 'padding:5px 5px 0',	
                items: [{
                    xtype: 'radiogroup',
                    anchor: '50%',
                    fieldLabel: '',
                    items: [{
                        boxLabel: bundle.getMsg('module.generate.code.all'), 
                        name: 'ation-radiogroup', 
                        inputValue: 1,
                        checked: true
                    },{
                        boxLabel: bundle.getMsg('module.degenerate.code.all'), 
                        name: 'ation-radiogroup',
                        inputValue: 0
                    }],
                    listeners: {
                        change: function(radioGroup, checkedRadio){
                            window['ModuleApp'].codeGeneratorFormPanel.generateoptionsCheckBoxGroup.reset();
                            window['ModuleApp'].codeGeneratorFormPanel.generateoptionsCheckBoxGroup.setDisabled(checkedRadio.inputValue==0);
                        }
                    }
                },{
                    ref: 'generateoptionsCheckBoxGroup',
                    xtype: 'checkboxgroup',
                    itemCls: 'x-check-group-alt',
                    fieldLabel: '',
                    allowBlank: false,
                    anchor: '95%',
                    items: [{
                        columnWidth: '.3',
                        items: [{
                            xtype: 'label', 
                            text: bundle.getMsg('module.generate.view'), 
                            cls:'x-form-check-group-label', 
                            anchor:'-15'
                        },{
                            boxLabel: bundle.getMsg('module.generate.view.grid'), 
                            id: 'checkboxGroupView-grid',
                            name: 'view-grid',
                            listeners: {
                                check: function(checkbox, ckecked) {
                                    Ext.getCmp('checkboxGroupView-treegrid').setValue(!ckecked);
                                    if (ckecked)
                                        Ext.getCmp('checkboxGroupCcontroller-grid').setValue(ckecked);
                                }
                            }
                        },{
                            boxLabel: bundle.getMsg('module.generate.view.treegrid'), 
                            id: 'checkboxGroupView-treegrid',
                            name: 'view-treegrid',
                            listeners: {
                                check: function(checkbox, ckecked) {
                                    Ext.getCmp('checkboxGroupView-grid').setValue(!ckecked);
                                    Ext.getCmp('checkboxGroupCcontroller-tree').setValue(ckecked);
                                    if(!ckecked)
                                        Ext.getCmp('checkboxGroupView-treegridfield').reset();
                                    Ext.getCmp('checkboxGroupView-treegridfield').setDisabled(!ckecked);

                                }
                            }
                        }, {
                            xtype: 'compositefield',
                            items: [
                            new Ext.form.ComboBox({
                                id: 'checkboxGroupView-treegridfield',
                                anchor:'-15',
                                store: this.selectedAtributesComboStore,
                                valueField: 'nick',
                                displayField: 'name',
                                tpl: '<tpl for="."><div ext:qtip="{type}" class="x-combo-list-item">{name}</div></tpl>',
                                disabled: true,
                                typeAhead: true,
                                mode: 'local',
                                triggerAction: 'all',
                                selectOnFocus:true,
                                forceSelection:true,
                                emptyText: bundle.getMsg('app.form.select')
                            }),{
                                xtype: 'displayfield', 
                                value: '&nbsp;&nbsp;&nbsp;&nbsp;'
                            }]
                        }]
                    },{
                        columnWidth: '.4',
                        items: [{
                            xtype: 'label', 
                            text: bundle.getMsg('module.generate.controller'), 
                            cls:'x-form-check-group-label', 
                            anchor:'-15'
                        },{
                            boxLabel: bundle.getMsg('module.generate.controller.combo'), 
                            name: 'controller-combo'
                        },{
                            boxLabel: bundle.getMsg('module.generate.controller.grid'), 
                            id: 'checkboxGroupCcontroller-grid',
                            name: 'controller-grid'
                        },{
                            boxLabel: bundle.getMsg('module.generate.controller.tree'), 
                            id: 'checkboxGroupCcontroller-tree',
                            name: 'controller-tree'
                        }]
                    },{
                        columnWidth: '.3',
                        items: [{
                            xtype: 'label', 
                            text: bundle.getMsg('module.generate.model'), 
                            cls:'x-form-check-group-label', 
                            anchor:'-15'
                        },{
                            boxLabel: bundle.getMsg('module.generate.model.all'), 
                            name: 'model-all'
                        }]
                    }]
                }]
            });

        },

        validateNick : function(nick){
            var obj = new Object;

            var val = nick;
            val = val.replace(' ', '');
            val = Ext.util.Format.capitalize(val);

            obj.valid = val == nick;
            obj.value = val;

            return obj;
        },

        deleteAtributes : function(){
            var records = window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.getSelectionModel().getSelections();
            window['ModuleApp'].selectedAtributesComboStore.remove(records);
        },

        getPortalPanelFor: function(entity){
            return new Ext.Panel({
                id: 'gridPanel'+entity,
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('tag_orange'),
                title: config.app_showgridtitle ? bundle.getMsg(entity.toLowerCase()+".grid.title") : '',
                items: [{
                    xtype:'portal',
                    region:'center',
                    margins:'35 5 5 0',
                    border: false,
                    ref: 'panelPortal'
                }],
                listeners: {
                    activate: function(panel){
                        var button = Ext.getCmp('principal-menu-item-'+App.mainmenuTreePanel.getSelectionModel().getSelectedNode().id);
                        panel.panelPortal.removeAll();
                        if(button.menu && button.menu.items && button.menu.items.items)
                            for(var i = 0; i < button.menu.items.items.length; i++){
                                panel.panelPortal.add({
                                    columnWidth:.33,
                                    style:'padding:10px',
                                    items:[{
                                        title: button.menu.items.items[i].def.name,
                                        html: button.menu.items.items[i].def.comment,
                                        iconCls: Ext.ux.Icon(button.menu.items.items[i].def.customicon.replace('.png', '')),
                                        layout:'fit'
                                    }]
                                });
                            }
                        panel.doLayout();
                    }
                }
            });
        },

        deleteRelations: function(){
            var records = window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.getSelectionModel().getSelections();
            window['ModuleApp'].selectedRelationsComboStore.remove(records);
        },
        
        moveIncrease : function(direction) {
            var mask = new Ext.LoadMask(window['ModuleApp'].gridPanel.getEl(), {
                msg: bundle.getMsg('app.layout.loading')+'...'
            });
            mask.show();
            
            var node = window['ModuleApp'].gridPanel.getSelectionModel().getSelectedNodes();
            node = node[0];
            
            new Ext.data.Connection().request({
                url: config.app_host + '/module/request/method/moveincrease',
                params: {
                    id: node.id,
                    step: direction
                },
                failure: requestFailed,
                callback : function(options, success, response) {
                    if(node)
                        resetTree(window['ModuleApp'].gridPanel, node, window['ModuleApp'].parentRecord ? window['ModuleApp'].parentRecord : false);
                    mask.hide();
                }
            });
        },

        showWindow : function(animateTarget, hideApply, callback){
            window['ModuleApp'].window = App.showWindow(bundle.getMsg('module.window.title'), 700, 500, window['ModuleApp'].formPanel, 
                function (button){
                    if(!button){
                        button = new Object;
                        button.id = window['ModuleApp'].window.submitBtn.id;
                    }
                    var node = false;
                    var nodes = window['ModuleApp'].gridPanel.getSelectionModel().getSelectedNodes(); 
                    if(nodes && nodes.length > 0)
                        node = nodes[0];

                    var obj = window['ModuleApp'].validateNick(window['ModuleApp'].formPanel.nickField.getValue());
                    var valid = window['ModuleApp'].formPanel.getForm().isValid() && obj.valid;

                    if(obj.valid){
                        var attributesarray = new Array(); 
                        window['ModuleApp'].selectedAtributesComboStore.each(function(record){
                            attributesarray.push(record.data);
                        });

                        var relationsarray = new Array(); 
                        window['ModuleApp'].selectedRelationsComboStore.each(function(record){
                            relationsarray.push(record.data);
                        });

                        window['ModuleApp'].formPanel.getForm().submit({
                            waitTitle : bundle.getMsg('app.msg.wait.title'), 
                            waitMsg: bundle.getMsg('app.msg.wait.text'), 
                            clientValidation: true,
                            params: {
                                id: node ? node.id:'',
                                parent_id: window['ModuleApp'].parentRecord ? window['ModuleApp'].parentRecord.id :'',
                                path: window['ModuleApp'].parentRecord ? window['ModuleApp'].parentRecord.data.path : window['ModuleApp'].gridPanel.getRootNode().getPath(),
                                attributes : Ext.encode(attributesarray),
                                relations : Ext.encode(relationsarray)
                            },
                            success: function(form, action) {
                                checkSesionExpired(form, action);

                                window['ModuleApp'].gridPanel.expandBtn.setDisabled(false);
                                resetTree(window['ModuleApp'].gridPanel, node, window['ModuleApp'].parentRecord ? window['ModuleApp'].parentRecord : false);

                                submitFormSuccessful('ModuleApp', form, action, button, !node, function(){
                                    window['ModuleApp'].parentRecord = false;

                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.pkCheckBox.reset();
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.akCheckBox.reset();
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nameField.reset();
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nickField.reset();
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.typeCombo.reset();
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.restrictionCombo.reset();
                                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nulleableCombo.reset();

                                    window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.moduleCombo.reset();
                                    window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.typeCombo.reset();
                                    window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.fromattributeCombo.reset();
                                    
                                    window['ModuleApp'].selectedAtributesComboStore.removeAll();
                                    window['ModuleApp'].selectedRelationsComboStore.removeAll();
                                    window['ModuleApp'].selectedDependenciesComboStore.removeAll();
                                    window['ModuleApp'].selectedPermissionsComboStore.removeAll();  
                                }, callback);
                            },
                            failure: loadFormFailed
                        });

                    }
                    else
                        window['ModuleApp'].formPanel.nickField.markInvalid(String.format(bundle.getMsg('app.error.fieldinvalid.suggest'), obj.value));

                    return valid;
                },
                function (){
                    window['ModuleApp'].selectedAtributesComboStore.removeAll();
                    window['ModuleApp'].selectedRelationsComboStore.removeAll();
                    window['ModuleApp'].selectedDependenciesComboStore.removeAll();
                    window['ModuleApp'].selectedPermissionsComboStore.removeAll();
                    window['ModuleApp'].formPanel.getForm().reset();

                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.pkCheckBox.reset();
                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.akCheckBox.reset();
                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nameField.reset();
                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nickField.reset();
                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.typeCombo.reset();
                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.restrictionCombo.reset();
                    window['ModuleApp'].formPanel.tabPanel.attributesGridPanel.nulleableCombo.reset();

                    window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.moduleCombo.reset();
                    window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.typeCombo.reset();
                    window['ModuleApp'].formPanel.tabPanel.relationsGridPanel.fromattributeCombo.reset();

                    window['ModuleApp'].gridPanel.expandBtn.setDisabled(false);

                    window['ModuleApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },

        applySecurity : function(groups, permissions){
            window['ModuleApp'].gridPanel.addBtn.setVisible(permissions.indexOf('managemodule') != -1 || permissions.indexOf('managemoduleadd') != -1);
            window['ModuleApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('managemodule') != -1 || permissions.indexOf('managemoduleedit') != -1);
            window['ModuleApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('managemodule') != -1 || permissions.indexOf('managemoduledelete') != -1);
        }
    }
}();