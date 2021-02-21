ExplorerApp = function(){
    return {
        init : function(ExplorerApp){
            this.gridPanel = window['ExplorerApp'].getPanelFor('Explorer', false, false, {
                id: 'gridPanelExplorer',
                title: config.app_showgridtitle ? bundle.getMsg("explorer.grid.title") : '',
                showexport: true,
                showcc: true,
                reader: true,
                iconCls: Ext.ux.Icon('gnome-sticky-notes-applet')
            }); 

            var wordCount=new Ext.Toolbar.TextItem('Palabras: 0');
            var charCount=new Ext.Toolbar.TextItem('Caracteres: 0');
            var lineCount=new Ext.Toolbar.TextItem('L&iacute;neas: 0');

            this.formPanel=new Ext.Panel({
                layout:'fit',
                border:false,
                bbar:new Ext.ux.StatusBar({
                    id:'word-status',
                    items:[lineCount,' ',wordCount,' ',charCount,' ']
                }),
                items:{
                    ref: 'textArea',
                    xtype:'textarea',
                    enableKeyEvents:true,
                    listeners:{
                        'keypress':{
                            fn:function(t){
                                var v=t.getValue(),lc=0,wc=0,cc=v.length?v.length:0;
                                if(cc>0){
                                    wc=v.match(/\b/g);
                                    wc=wc?wc.length/2:0;
                                    lc=v.split('\n').length
                                }
                                Ext.fly(wordCount.getEl()).update('Palabras: '+wc);
                                Ext.fly(charCount.getEl()).update('Caracteres: '+cc);
                                Ext.fly(lineCount.getEl()).update('L&iacute;neas: '+lc)
                            },
                            buffer:1
                        }
                    }
                },
                listeners:{
                    render:{
                        fn:function(){
                            Ext.fly(wordCount.getEl().parent()).addClass('x-status-text-panel').createChild({
                                cls:'spacer'
                            });
                            Ext.fly(charCount.getEl().parent()).addClass('x-status-text-panel').createChild({
                                cls:'spacer'
                            });
                            Ext.fly(lineCount.getEl().parent()).addClass('x-status-text-panel').createChild({
                                cls:'spacer'
                            })
                        },
                        delay:100
                    }
                }
            });
        },
        getPanelFor : function(entity, table, tableid, layout){
            var app = Ext.util.Format.capitalize(entity.toLowerCase())+'App';
            var id = Ext.id();
            if(layout && layout.id != '')
                id = layout.id;
            
            var path = '';
            if(layout && layout.path && layout.path != '')
                path += layout.path;
            if(table && table!='')
                path += '/'+table;
            if(tableid && tableid!='')
                path += '/'+tableid;

            var panel = new Ext.ux.tree.TreeGrid({
                id: id,
                iconCls: layout.iconCls,
                title: config.app_showgridtitle && layout.title && layout.title != '' ? layout.title : '',
                ref: 'explorerPanel',
                layout: 'fit', 
                useReader: layout && layout.reader == true,
                useBrowser: layout && layout.browser == true,
                rootVisible: false,
                region: 'center',
                autoExpandColumn: 'explorermaincolumn',
                enableDD: false,
                useArrows: false,
                lines: true,
                containerScroll: true,
                animate: true,
                columnsText: bundle.getMsg('app.layout.columns'),
                maskConfig: {
                    msg:bundle.getMsg("app.layout.loading")+'...'
                },
                keys: [panelKeysMap],

                view: new Ext.grid.GroupingView(),
                
                columns:[{
                    id:'explorermaincolumn',
                    header:bundle.getMsg('app.form.name'),
                    width:360,
                    sortable:true,
                    dataIndex:'text'
                },{
                    header:bundle.getMsg('app.form.lastmod'),
                    align:'center',
                    width:150,
                    dataIndex:'lastmod'
                },{
                    header:bundle.getMsg('app.form.size'),
                    align:'center',
                    width:80,
                    sortable:true,
                    dataIndex:'size'
                },{
                    header: 'HREF',
                    width:180,
                    hidden:true,
                    dataIndex:'id'
                },{
                    header: 'URL',
                    width:320,
                    hidden:true,
                    dataIndex:'url'
                }],
                selModel: new Ext.tree.MultiSelectionModel({
                    listeners: {
                        selectionchange : function(selectionModel) {
                            var nodes = selectionModel.getSelectedNodes();
                            var disabled = false;
                            for (var i = 0; i < nodes.length; i++)
                                if(nodes[i].leaf){
                                    disabled = true;
                                    break;
                                }
                            selectionModel.tree.exportBtn.setDisabled(disabled);
                            selectionModel.tree.addBtn.setDisabled(nodes.length > 1 || disabled);
                            selectionModel.tree.removeBtn.setDisabled(nodes.length < 1);
                        }
                    }
                }),
                root: new Ext.tree.AsyncTreeNode({
                    text:'root',
                    id:'NULL'
                }),
                loader: new Ext.tree.TreeLoader({
                    baseParams: {
                        path: path,
                        component:'tree',
                        start:0
                    },
                    dataUrl: config.app_host+'/file/request/method/load',
                    listeners: {
                        load: function(treeLoader, node, response){
                            node.getOwnerTree().treeGridSorter = new Ext.ux.tree.TreeGridSorter(node.getOwnerTree(), {
                                property: node.getOwnerTree().columns[0].dataIndex,
                                folderSort: true
                            });
                            node.getOwnerTree().treeGridSorter.doSort(node);
                            
                            node.attributes.path = '/'+node.getOwnerTree().getRootNode()+'/'+node.id;

                            if(response.responseText.indexOf('signinForm')>0)
                                showSesionExpiredMsg(); 
                            window['ExplorerApp'].renderIcon(node);
                        }
                    }
                }),
				
                tbar: [{
                    ref: '../addBtn',
                    text: bundle.getMsg('app.form.add'),
                    iconCls: Ext.ux.Icon('add'),
                    menu: {
                        items: [{
                            text: bundle.getMsg('explorer.action.newfolder'),
                            iconCls: Ext.ux.Icon('folder_add'),
                            listeners: {
                                click: function(button, event) {
                                    var element = window['ExplorerApp'].getContainerByRef(button, 'explorerPanel');
                                    if(element && element.ref == 'explorerPanel' ){                                                            
                                        var nodes = element.getSelectionModel().getSelectedNodes();
                                    
                                        var path = element.loader.baseParams.path;
                                        var node = false;

                                        var finalFn = function(){
                                            var msg = '';
                                            if(node)
                                                msg = String.format(bundle.getMsg('explorer.action.newfolder.comment'), '<b>'+node.text+'</b>');
                                            else
                                                msg = String.format(bundle.getMsg('explorer.action.newfolder.comment'), '<b>'+bundle.getMsg('explorer.action.newfolder.rootnode')+'</b>');

                                            Ext.Msg.prompt(bundle.getMsg('explorer.action.newfolder.header'), msg+':', function(btn, text){
                                                if (btn == 'ok' && text != ''){
                                                    new Ext.data.Connection().request({
                                                        url: config.app_host + '/file/request/method/save',
                                                        params: {
                                                            name: text,
                                                            path: path
                                                        },
                                                        failure: requestFailed,
                                                        success: requestSuccessful,
                                                        callback : function(options, success, response) {
                                                            var object = Ext.decode(response.responseText);
                                                            if(object.success){                                                            
                                                                if(node){
                                                                    node.expanded = true;
                                                                    resetTree(element, node, node.parentNode);
                                                                }
                                                                else
                                                                    element.getLoader().load(element.getRootNode());
                                                            }
                                                            else
                                                                requestFailed(response, false);

                                                        }
                                                    });
                                                }
                                            });
                                        };

                                        switch(nodes.length){
                                            case 0:
                                                finalFn();
                                                break;
                                            case 1:
                                                node = nodes[0];
                                                node.ensureVisible(finalFn);
                                                path = node.id;
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                            }
                        },{
                            text: bundle.getMsg('explorer.action.uploadfile'),
                            iconCls: Ext.ux.Icon('page_white_add'),
                            listeners: {
                                click: function(button) {
                                    var element = window['ExplorerApp'].getContainerByRef(button, 'explorerPanel');                                    
                                    if(element && element.ref == 'explorerPanel' ){
                                        var nodes = element.getSelectionModel().getSelectedNodes();

                                        Ext.getCmp('picture').regex = '';
                                        var path = element.loader.baseParams.path;
                                        var node = false;

                                        if(nodes.length == 1){
                                            node = nodes[0];
                                            path = node.id;
                                        }

                                        showPictureForm(false, path, function(url){
                                            if(node){
                                                node.expanded = true;
                                                resetTree(element, node, node.parentNode);
                                            }
                                            else
                                                element.getLoader().load(element.getRootNode());
                                        }); 
                                    }
                                }
                            }
                        }]
                    }
                },{
                    ref: '../removeBtn',
                    text: bundle.getMsg('app.form.delete'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('delete'),
                    listeners: {
                        click: function(button, eventObject, callback) {
                            var element = window['ExplorerApp'].getContainerByRef(button, 'explorerPanel');
                            Ext.defer(function(){
                                Ext.Msg.show({
                                    title: bundle.getMsg('app.msg.warning.title'),
                                    msg: bundle.getMsg('app.msg.warning.deleteselected.text'),
                                    buttons: Ext.Msg.YESNO,
                                    fn: function(btn, text){
                                        if (btn == 'yes'){
                                            var nodes = element.getSelectionModel().getSelectedNodes();
                                            var array = new Array();
                                            for (var i = 0; i < nodes.length; i++){
                                                var obj = new Object;
                                                obj.id = nodes[i].attributes.id;
                                                obj.url = nodes[i].attributes.url;
                                                array.push(obj);
                                            }

                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/file/request/method/delete',
                                                params: {
                                                    paths: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    var object = Ext.decode(response.responseText);
                                                    if(object.success){
                                                        element.getLoader().load(element.getRootNode());
                                                        if(callback){
                                                            if(callback.fn)
                                                                callback.fn(callback.params);
                                                            else
                                                                callback();
                                                        }
                                                    }
                                                    else
                                                        requestFailed(response, false);

                                                }
                                            });
                                        }
                                    },
                                    animEl: 'elId',
                                    icon: Ext.MessageBox.QUESTION
                                });
                            }, 100, window[app]);
                        }
                    }
                },'->',{
                    ref: '../exportBtn',
                    hidden: !layout || !layout.showexport,
                    text: bundle.getMsg('app.layout.export'),
                    iconCls: Ext.ux.Icon('package_green'),
                    listeners: {
                        click: function(button) {
                            var element = window['ExplorerApp'].getContainerByRef(button, 'explorerPanel');
                            var nodes = element.getSelectionModel().getSelectedNodes();
                            var array = new Array();
                            for (var i = 0; i < nodes.length; i++)
                                array.push(nodes[i].id.replace('images/../../', ''));

                            Ext.Msg.show({
                                title: bundle.getMsg('app.layout.export.header'),
                                msg: bundle.getMsg('app.layout.export.type'),
                                buttons: {
                                    yes: bundle.getMsg('app.layout.export.type.basicinside'),
                                    no: bundle.getMsg('app.layout.export.type.basicoutside'),
                                    cancel: bundle.getMsg('app.form.cancel')
                                },
                                fn: function(btn, text){

                                    var finalFn = function(text){
                                        var msg=App.mask.msg;
                                        App.mask.msg=bundle.getMsg('app.layout.export.findingfiles');
                                        App.mask.show();

                                        new Ext.data.Connection().request({
                                            url: config.app_host+'/file/request/method/explore',
                                            params: {
                                                paths: Ext.encode(array)
                                            },
                                            method: 'POST',
                                            callback : function(options, success, response) {
                                                var json = Ext.decode(response.responseText);
                                                var files = json.message;
                                                var total = files.length;

                                                App.mask.hide();
                                                App.mask.msg = msg;

                                                var processFile = function(files, nextFn) {
                                                    var start = (files.length-total)*-1;
                                                    if(files && files.length>0){
                                                        var currentfile = files[0].split('/');
                                                        currentfile = currentfile[currentfile.length-1];
                                                        currentfile = Ext.util.Format.ellipsis(currentfile, 30);

                                                        Ext.MessageBox.progress(bundle.getMsg('app.msg.wait.title'), String.format(bundle.getMsg('app.layout.export.description'), start, total) + '...');
                                                        Ext.MessageBox.updateProgress(start/total, currentfile);

                                                        new Ext.data.Connection().request({
                                                            url: config.app_host + '/file/request/method/export',
                                                            method: 'POST',
                                                            params: { 
                                                                path: files[0],
                                                                target: text
                                                            },
                                                            callback : function(options, success, response) {
                                                                files.splice(0,1);
                                                                nextFn(files, processFile);
                                                            }
                                                        });
                                                    }
                                                    else{
                                                        Ext.MessageBox.hide(); 
                                                        Ext.Msg.show({
                                                            title:bundle.getMsg('app.msg.info.title'),
                                                            msg: String.format(bundle.getMsg('app.layout.export.done'), total, text),
                                                            buttons: Ext.Msg.OK,
                                                            icon: Ext.MessageBox.INFO
                                                        });
                                                    }
                                                };

                                                processFile(files, processFile);
                                            }
                                        });
                                    };

                                    switch(btn){
                                        case 'yes':
                                            finalFn('');
                                            break;
                                        case 'no':
                                            Ext.Msg.prompt(bundle.getMsg('app.layout.export.header'), bundle.getMsg('app.layout.export.destination')+':', function(btn, text){
                                                if (btn == 'ok' && text != ''){
                                                    finalFn(text);
                                                }
                                            });
                                            break;
                                        default:
                                            break;
                                    }
                                },
                                animEl: 'elId',
                                icon: Ext.MessageBox.QUESTION
                            }); 
                        }
                    }
                },{
                    ref: '../clearCacheBtn',
                    text: bundle.getMsg('app.layout.clearcache'),
                    iconCls: Ext.ux.Icon('layers'),
                    hidden: !layout || !layout.showcc,
                    listeners: {
                        click: function() {
                            var msg=App.mask.msg;
                            App.mask.msg=bundle.getMsg('app.layout.clearcache.proccess')+'...';
                            App.mask.show();
                            new Ext.data.Connection().request({
                                url:config.app_host+'/file/request/method/clearcache',
                                failure:requestFailed,
                                success:requestSuccessful,
                                callback:function(options,success,response){
                                    App.mask.msg=msg;
                                    App.mask.hide()
                                }
                            })
                        }
                    }
                },'-',{
                    ref: '../expandBtn',
                    iconCls: Ext.ux.Icon('expand-all', 'myicons'),
                    tooltip: bundle.getMsg('app.form.expandall'),
                    listeners: {
                        click: function(button) {
                            var element = window['ExplorerApp'].getContainerByRef(button, 'explorerPanel');
                            var nodes = element.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].expand(true);
                            else{
                                element.expandAll();
                                element.expandBtn.setDisabled(true);
                                element.collapseBtn.setDisabled(false);
                            }
                        }
                    }
                },{
                    ref: '../collapseBtn',
                    disabled: true,
                    iconCls: Ext.ux.Icon('collapse-all', 'myicons'),
                    tooltip: bundle.getMsg('app.form.collapseall'),
                    listeners: {
                        click: function(button) {
                            var element = window['ExplorerApp'].getContainerByRef(button, 'explorerPanel');
                            var nodes = element.getSelectionModel().getSelectedNodes();
                            if(nodes.length>0)
                                for(var i = 0; i < nodes.length; i++)
                                    nodes[i].collapse(true);
                            else {
                                element.collapseAll();
                                element.expandBtn.setDisabled(false);
                                element.collapseBtn.setDisabled(true);
                            }
                        }
                    }
                }],
                listeners: {
                    dblclick: function(node, eventObject){
                        if(node.leaf){
                            window['ExplorerApp'].editingNode = node;
                            
                            var browseFn = function(path){
                                var win = window.open(config.app_host + '/' + path.replace('web/', '/'), '_blank');
                                win.focus();
                            };
                            
                            var callbackFn = function(content){
                                if(content && content != ''){
                                    window['ExplorerApp'].formPanel.textArea.setValue(content);
                                    window['ExplorerApp'].formPanel.textArea.fireEvent('keypress',window['ExplorerApp'].formPanel.textArea);
                                    window['ExplorerApp'].showWindow();
                                }
                                else
                                    browseFn(window['ExplorerApp'].editingNode.id);
                            };
                                
                            if(node.getOwnerTree().useReader)
                                window['ExplorerApp'].readFile(window['ExplorerApp'].editingNode, '', callbackFn, true);
                            else
                            if(node.getOwnerTree().useBrowser)
                                browseFn(window['ExplorerApp'].editingNode.id);
                        }
                    },
                    activate: function(panel){
                        if(layout && layout.showexport)
                            Ext.Ajax.request({
                                method:'POST',
                                url:config.app_host+'/file/request/method/checksum',
                                success:function(response,opts){
                                    var obj = Ext.decode(response.responseText);
                                    Ext.fly(panel.getBottomToolbar().items.items[13].getEl()).update(bundle.getMsg('app.msg.info.fileintegroty')+': <b>'+obj.message+'</b>');
                                    panel.doLayout();
                                },
                                failure:requestFailed
                            });
                    },
                    activate: function(panel){
                        if(layout && layout.showexport)
                            Ext.Ajax.request({
                                method:'POST',
                                url:config.app_host+'/file/request/method/checksum',
                                success:function(response,opts){
                                    var obj = Ext.decode(response.responseText);
                                    Ext.fly(panel.getBottomToolbar().items.items[13].getEl()).update(bundle.getMsg('app.msg.info.fileintegroty')+': <b>'+obj.message+'</b>');
                                    panel.doLayout();
                                },
                                failure:requestFailed
                            });
                    },
                    containerclick: treeContainerClick
                    
                },
				
                bbar: new Ext.PagingToolbar({
                    hidden: layout.bbarhidden,
                    pageSize: Number.MAX_VALUE,
                    store: new Ext.data.Store({
                        url: config.app_host+'/file/request',
                        reader: new Ext.data.JsonReader(),
                        listeners: {
                            load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                                alertNoRecords(records);
                            },
                            loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                        }
                    }),
                    items:[{
                        tooltip: bundle.getMsg('app.form.clearfilters'),
                        iconCls: Ext.ux.Icon('table_lightning'),
                        handler: function () {
                            element.getSelectionModel().clearSelections();
                        } 
                    },'-', new Ext.Toolbar.TextItem('')],
                    doRefresh : function(){
                        element.getLoader().load(element.getRootNode());
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
            
            if(layout && layout.showexport)
                panel.tools = [{
                    id:'refresh',
                    hidden: !layout || !layout.showexport,
                    qtip: bundle.getMsg('app.languaje.refresh.label'),
                    handler:function(event,toolEl,panel,tc){
                        panel.getRootNode().removeAll();
                        panel.getLoader().load(panel.getRootNode());
                    }
                },{
                    id:'print',
                    hidden: !layout || !layout.showexport,
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function(event,toolEl,panel,tc) {
                        App.printView(panel);
                    }
                }];
            
            return panel;
        },

        getContainerByRef: function(element, name){
            while(element && element.ref != name)
                element = Ext.getCmp(element.ownerCt.id);
            return element;
        },

        renderIcon: function(node){
            for(var i=0; i < node.childNodes.length; i++){
                if(node.childNodes[i].leaf){
                    switch(node.childNodes[i].attributes.ext){
                        case'json':case'txt':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_text'));
                            break;
                        case'bat':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_gear'));
                            break;
                        case'php':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_php'));
                            break;
                        case'ico':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_picture'));
                            break;
                        case'png':case'jpg':case'jpeg':case'gif':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('picture'));
                            break;
                        case'htm':case'html':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('html'));
                            break;
                        case'css':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('css'));
                            break;
                        case'yml':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_wrench'));
                            break;
                        case'js':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_code_red'));
                            break;
                        case'pdf':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_acrobat'));
                            break;
                        case'docx':case'doc':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_word'));
                            break;
                        case'xlsx':case'xls':
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white_excel'));
                            break;
                        default:
                            node.childNodes[i].setIconCls(Ext.ux.Icon('page_white'));
                            break
                    }
                }
            }
        },

        readFile : function(node, type, callback, mandatoryurl, returnas){
            
            var mask = new Ext.LoadMask(node.getOwnerTree && node.getOwnerTree() ? node.getOwnerTree().container : Ext.getBody(), {
                msg: bundle.getMsg('explorer.action.reading') + '...'
            });
            mask.show();

            Ext.Ajax.request({
                url: config.app_host+'/file/request/method/readfile',
                params:{
                    file: mandatoryurl ? node.id : config.app_host + '/' + node.id,
                    type: type,
                    returnas: returnas && returnas != '' ? returnas : 'text'
                },
                method:'POST',
                success:function(response){
                    mask.hide();
                    var obj = Ext.decode(response.responseText);

                    var content = '';
                    if (typeof obj.message == 'string' || (returnas && returnas != ''))
                        content = obj.message;
                    else {
                        if(obj.message && obj.message.length > 0)
                            for(var i = 0; i < obj.message.length; i++)
                                content = content + ' ' + obj.message[i];
                    }

                    if(callback)
                        callback(content);
                },
                failure: function(){
                    mask.hide();
                    if(callback)
                        callback('');
                }
            });
        },

        showWindow : function(animateTarget){
            window['ExplorerApp'].window = App.showWindow(bundle.getMsg('explorer.window.title'),770,500,window['ExplorerApp'].formPanel,function(button,eventObject,callback){
                var msg=App.mask.msg;
                App.mask.msg='Guardando...';
                App.mask.show();
                Ext.Ajax.request({
                    params:{
                        file: window['ExplorerApp'].editingNode.id,
                        content: window['ExplorerApp'].formPanel.textArea.getValue()
                    },
                    method:'POST',
                    url:config.app_host+'/file/request/method/writefile',
                    success:function(response,opts){
                        App.mask.msg=msg;
                        App.mask.hide();
                        if(button.id == window['ExplorerApp'].window.submitBtn.id){
                            window['ExplorerApp'].formPanel.textArea.reset();
                            window['ExplorerApp'].editingNode=false;
                            window['ExplorerApp'].window.hide()
                        }
                    },
                    failure:requestFailed
                });
            },function(button,eventObject){
                window['ExplorerApp'].editingNode=false;
                window['ExplorerApp'].formPanel.textArea.reset();
                window['ExplorerApp'].window.hide()
            },animateTarget)
        },
        applySecurity:function(groups,permissions){

        }
    }
}();