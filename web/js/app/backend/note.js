/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage entity
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

NoteApp = function() {
    return {
        init : function(NoteApp) {
			
            this.notesPanel = window['NoteApp'].getPanelFor('Note');
            
            this.gridPanel = new Ext.Panel({
                id: 'gridPanelNote',
                title: bundle.getMsg('note.grid.title'),
                iconCls: Ext.ux.Icon('gnome-sticky-notes-applet'),
                region:'center',
                layout:'fit',
                items:[this.notesPanel]
            });                
            
        },
        
        getPanelFor : function(entity, table, tableid, layout){
            var app = Ext.util.Format.capitalize(entity.toLowerCase())+'App';
                        
            var template = '<div class="thumb-wrap" style="width:96%;">\
                                    <div style="width:{identleft}%;float:left;"></div>\
                                    <div style="width:{identright}%;float:right;text-align:justify;">\
                                        {avatarinit}\
                                        <span><b>{full_name}</b>&nbsp;&nbsp;&nbsp;({created_at})</span>\
                                        <hr/>{comment}<br/>\
                                        <div style="float:right;">{toolbar}</div>\
                                        {avatarend}\
                                    </div>\
                                </div>';
            var newnotelabel = bundle.getMsg('note.action.newcomment.defaultname');
            
            var addicon = 'note_add';
            var replyicon = 'note_go';
            var editicon = 'note_edit';
            var delicon = 'note_delete';
            
            var prepareFn = false;
            var tbar = false;
            var bbar = false;
            var hidereply = false;
            var hidebbarfn = false;
            
            if(layout){                
                if(layout.template)
                    template = layout.template;
                
                if(layout.hidereply)
                    hidereply = layout.hidereply;
                
                if(layout.label && layout.label.newnote)
                    newnotelabel = layout.label.newnote;
                
                if(layout.icon){
                    if(layout.icon.add)
                        addicon = layout.icon.add;
                    if(layout.icon.reply)
                        replyicon = layout.icon.reply;
                    if(layout.icon.edit)
                        editicon = layout.icon.edit;
                    if(layout.icon.del)
                        delicon = layout.icon.del;
                }
                
                if(layout.prepareFn)
                    prepareFn = layout.prepareFn;
                
                if(layout.tbar)
                    tbar = layout.tbar;
                
                if(layout.bbar)
                    bbar = layout.bbar;
                
                hidebbarfn = layout.hidebbarfn;
            }
            
            
            var contentEditor = window['ContenteditorApp'].getPanelFor({
                ref: 'contentEditor',
                app_host: config.app_host,
                tbar: tbar,
                bbar: bbar
            });
        
            var panelid = Ext.id();
        
            return new Ext.Panel({
                id: panelid,
                region: 'center',
                layout: 'card',
                flex: 1,
                border: false, 
                activeItem: 0,
                items: [{
                    autoScroll: true,
                    border: false,
                    items: new Ext.DataView({
                        ref: '../dataView',
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader()
                        }),
                        tpl: new Ext.XTemplate('<tpl for=".">'+template+'</tpl><div class="x-clear"></div>'),
                        autoHeight:true,
                        multiSelect: true,
                        overClass:'x-view-over',
                        itemSelector:'div.thumb-wrap',
                        emptyText: '',
                        loadingText: bundle.getMsg('app.layout.loading')+'...',

                        prepareData: function(data){ 
                            data.picture = config.app_logueduserdata.picture;
                                    
                            if(data.Person && (data.Person.sfGuardUser.first_name != '' || data.Person.sfGuardUser.last_name != '')){
                                if(!data.Person.picture || data.Person.picture == '')
                                    data.Person.picture = config.app_host+'/images/avatar.png';
                                        
                                data.avatarinit = '<div style="width:8%;float:left;">\
                                                        <img src="'+data.Person.picture+'" width="100%">\
                                                </div>\
                                                <div style="width:91%;float:right;text-align:justify;">';
                                data.avatarend = '</div>';
                                        
                                data.full_name = data.Person.sfGuardUser.first_name + ' ' + data.Person.sfGuardUser.last_name;
                            }
                                
                            var dt = new Date(data.created_at);
                            data.created_at = dt.format(Date.patterns.LongDate);  
                                    
                            data.ident = data.ident*3 + 1;  
                            data.identleft = data.ident;  
                            data.identright = 100 - data.ident;  
                                    
                            if (data.id){
                                
                                data.toolbar = ' <table border="0" style="text-align:right;"><tr>';
                                if(!hidereply)
                                    data.toolbar += '<td><img src="'+config.app_host+'/images/icons/famfamfam/'+replyicon+'.png"></td><td><a href="#" onclick="javascript:Ext.getCmp(&#39;'+panelid+'&#39;).showFormFn('+data.id+')" style="text-decoration: none;">&nbsp;'+bundle.getMsg('note.action.reply')+'</a></td>';
                                if((data.Person.sfGuardUser && config.app_logueduserdata.id == data.Person.sfGuardUser.id)  || App.isAdmin()){
                                    data.toolbar += '<td>&nbsp;&nbsp;&nbsp;<img src="'+config.app_host+'/images/icons/famfamfam/'+editicon+'.png"></td><td><a href="#" onclick="javascript:Ext.getCmp(&#39;'+panelid+'&#39;).editFn(&#39;'+panelid+'&#39;,&#39;'+data.id+'&#39;,'+hidebbarfn+')" style="text-decoration: none;">&nbsp;'+bundle.getMsg('app.form.update')+'</a></td>';
                                    data.toolbar += '<td>&nbsp;&nbsp;&nbsp;<img src="'+config.app_host+'/images/icons/famfamfam/'+delicon+'.png"></td><td><a href="#" onclick="javascript:Ext.getCmp(&#39;'+panelid+'&#39;).deleteFn(&#39;'+data.id+'&#39;)" style="text-decoration: none;">&nbsp;'+bundle.getMsg('app.form.delete')+'</a></td>';
                                }
                                        
                                data.toolbar += '</tr></table>';  
                            }
                            
                            if(prepareFn){
                                data.icon = layout.icon;
                                data.panelid = panelid;
                                data = prepareFn(data);
                            }
                                    
                            return data;
                        }
                    }),
                    listeners: {
                        activate: function(panel) {
                            panel.getBottomToolbar().store.load({
                                params:{
                                    start: panel.getBottomToolbar().cursor
                                }
                            });
                        }
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: parseInt(config.app_elementsongrid),
                        store: new Ext.data.GroupingStore({
                            url: config.app_host + '/note/request/method/load',
                            baseParams:{                    
                                component: 'grid',
                                start: 0,
                                limit: config.app_elementsongrid,
                                entity: table ? table : ''
                            },
                            reader: new Ext.data.JsonReader(),
                            listeners: {
                                load: function(store, records) {  
                                    Ext.getCmp(panelid).dataView.store.removeAll();
                                    Ext.getCmp(panelid).dataView.store.add(records);
                                    Ext.getCmp(panelid).dataView.store.add(new Ext.data.Record({
                                        created_at: new Date(),
                                        comment: String.format(bundle.getMsg('note.action.newcomment.comment')+'...', newnotelabel.toLowerCase(), '<a href="#" onclick="javascript:Ext.getCmp(&#39;'+panelid+'&#39;).showFormFn();">', '</a>'),
                                        full_name: '<img src="'+config.app_host+'/images/icons/famfamfam/'+addicon+'.png">&nbsp;&nbsp;' + String.format(bundle.getMsg('note.action.newcomment.name'), newnotelabel.toLowerCase()),
                                        ident: 0
                                    }));
                                }
                            }
                        }),
                        displayInfo: true,
                        displayMsg: bundle.getMsg('app.form.bbar.displaymsg'),
                        emptyMsg: String.format(bundle.getMsg('app.form.bbar.emptymsg'), bundle.getMsg('app.form.elements').toLowerCase())
                    })
                }, contentEditor],
                listeners: {
                    render: function(panel) {
                        if(tableid)
                            panel.items.items[0].getBottomToolbar().store.baseParams.entityid = tableid;
                    }
                },
                
                prepareEditorFormFn: function(noteid) {
                    Ext.getCmp(panelid).contentEditor.editor.config.callback = new Object;
                    Ext.getCmp(panelid).contentEditor.editor.config.callback.params = new Ext.data.Record({
                        noteid: noteid
                    });
                    Ext.getCmp(panelid).contentEditor.editor.config.callback.fn = function(params){
                        var resetFn = function(){
                            var resetComponent = function(component){
                                if(component.name && component.name != ''){
									if(component.xtype == 'hiddenfield'){}
									else
										component.reset(); 
                                }
                            };
                            
                            if(Ext.getCmp(panelid).contentEditor.editor.tb)
                                Ext.getCmp(panelid).contentEditor.editor.tb.cascade(resetComponent);
                            if(Ext.getCmp(panelid).contentEditor.getBottomToolbar())
                                Ext.getCmp(panelid).contentEditor.getBottomToolbar().cascade(resetComponent);
                            
                            Ext.getCmp(panelid).getLayout().setActiveItem(0);
                        };
                                    
                        if(Ext.getCmp(panelid).contentEditor.editor.getValue()!='' && Ext.getCmp(panelid).contentEditor.editor.getValue()!='<br>'){
                            var mask = new Ext.LoadMask(Ext.getCmp(panelid).getEl(), {
                                msg: bundle.getMsg('app.layout.loading')+'...'
                            });
                            
                            var i = 0;
                            var valid = true;
                            var json = new Array();
                            var names = new Array();
                            var values = new Array();
                            var rawvalues = new Array();
                            var functions = new Array();
                            
                            var getComponentValue = function(component){
                                if(component.isValid && !component.isValid()){
                                    valid = false;
                                    return;
                                }
                                
                                if(component.name && component.name != ''){
                                    names.push(component.name);
                                    values.push(component.getValue());
                                    if(component.getRawValue)
                                        rawvalues.push(component.getRawValue());
                                    else
                                        rawvalues.push('');
									// this is used to pass to controller a custom function to use with reflection to manipulate the field value
                                    if(component.anchor)
                                        functions.push(component.anchor);
                                    else
                                        functions.push('');
                                }
                            };
                            
                            if(Ext.getCmp(panelid).contentEditor.editor.tb)
                                Ext.getCmp(panelid).contentEditor.editor.tb.cascade(getComponentValue);
                            if(Ext.getCmp(panelid).contentEditor.getBottomToolbar())
                                Ext.getCmp(panelid).contentEditor.getBottomToolbar().cascade(getComponentValue);
                            
                            json.push(names);
                            json.push(values);
                            json.push(rawvalues);
                            json.push(functions);
                            
                            params = params.data;
                            params.comment = Ext.getCmp(panelid).contentEditor.editor.getValue();
                            params.personid = config.app_logueduserdata.Person.id;
                            params.entity = table ? table : '';
                            params.entityid = Ext.getCmp(panelid).items.items[0].getBottomToolbar().store.baseParams.entityid ? Ext.getCmp(panelid).items.items[0].getBottomToolbar().store.baseParams.entityid : '';
                            params.json = Ext.encode(json);
                    
                            if((Ext.getCmp(panelid).contentEditor.getBottomToolbar().isVisible() && valid) || !Ext.getCmp(panelid).contentEditor.getBottomToolbar().isVisible()){
                                mask.show();
                                Ext.Ajax.request({
                                    url: config.app_host+'/note/request/method/save',
                                    method: 'POST',
                                    params: params,
                                    success:function(){
                                        mask.hide();
                                        resetFn();
                                    },
                                    failure:requestFailed
                                });
                            }  
                        }
                        else 
                            resetFn();
                    };
                },
                
                showFormFn: function(noteid) {
                    Ext.getCmp(panelid).prepareEditorFormFn(noteid);
                    
                    Ext.getCmp(panelid).contentEditor.getBottomToolbar().setDisabled(noteid);
                    Ext.getCmp(panelid).contentEditor.getBottomToolbar().setVisible(!noteid);
                    
                    Ext.getCmp(panelid).getLayout().setActiveItem(1);  
                    Ext.getCmp(panelid).doLayout();
                    Ext.getCmp(panelid).contentEditor.editor.reset();
                    
                },
                
                editFn: function(panelid, noteid, hidebbarfn) {
                    var note = false;
                    var hidebbar = false;
                    Ext.getCmp(panelid).dataView.store.each(function(record){
                        if(record.data.id == noteid){
                            note = record.data;
                            if(hidebbarfn)
                                hidebbar = hidebbarfn(record);
                            else
                                hidebbar = false;
                            return;
                        }
                    }); 
                    
                    Ext.getCmp(panelid).prepareEditorFormFn();
                    Ext.getCmp(panelid).contentEditor.editor.config.callback.params.set('id', noteid);
                
                    Ext.getCmp(panelid).contentEditor.getBottomToolbar().setDisabled(!noteid);
                    Ext.getCmp(panelid).contentEditor.getBottomToolbar().setVisible(!hidebbar);
                    
                    Ext.getCmp(panelid).contentEditor.editor.setValue(note.comment);
                    
                    Ext.getCmp(panelid).contentEditor.getBottomToolbar().cascade(function(component){
                        if(component.name && note.json && note.json[0])
                            for (var i = 0; i < note.json[0].length; i++) 
                                if(component.name == note.json[0][i])				
									if(component.xtype == 'hiddenfield'){}
									else{
										Ext.getCmp(component.id).setValue(note.json[1][i]);
										Ext.getCmp(component.id).setRawValue(note.json[2][i]);
										Ext.getCmp(component.id).clearInvalid();
										break;
									}
                    });
                    
                    Ext.getCmp(panelid).getLayout().setActiveItem(1);  
                    Ext.getCmp(panelid).doLayout();
                },
                
                deleteFn: function(noteid) {
                    var mask = new Ext.LoadMask(Ext.getCmp(panelid).getEl(), {
                        msg: bundle.getMsg('app.layout.loading')+'...'
                    });
                    mask.show();
                
                    Ext.Ajax.request({
                        url: config.app_host+'/note/request/method/delete',
                        method: 'POST',
                        params: {
                            ids: '['+noteid+']'
                        },
                        success: function(){
                            Ext.getCmp(panelid).items.items[0].getBottomToolbar().store.load({
                                params:{
                                    start: Ext.getCmp(panelid).items.items[0].getBottomToolbar().cursor
                                },
                                callback: function(){
                                    mask.hide();
                                }
                            });
                        },
                        failure: requestFailed
                    });
                }
            });
    
        },
        
        showWindow : function(animateTarget, hideApply, callback){
           
        },
        
        applySecurity : function(groups, permissions){
            
        }
    }
}();

