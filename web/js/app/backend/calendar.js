/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package SGArqBase
 * @subpackage calendar
 * @author MSc. Donel Vázquez Zambrano
 * @version 1.0.0
 */

CalendarApp = function() {
    return {
        init: function(CalendarApp) {
            //app-center
            this.calendarStore = new Ext.data.JsonStore({
                storeId: 'calendarStore',
                root: 'calendars',
                idProperty: 'id',
                url: config.app_host + '/calendar/request/method/load',
                baseParams:{
                    component: 'calendar'
                },
                fields: [{
                    name:'CalendarId', 
                    mapping: 'id', 
                    type: 'int'
                },{
                    name:'Title', 
                    mapping: 'title', 
                    type: 'string'
                },{
                    name:'ColorId', 
                    mapping: 'color', 
                    type: 'string'
                },{
                    name:'CustomColor', 
                    mapping: 'customcolor', 
                    type: 'string'
                }],
                sortInfo: {
                    field: 'CalendarId',
                    direction: 'ASC'
                },
                listeners: {
                    beforeload: function(store, options) {
                        App.mask.show();
                        beforeloadStore(store);
                    },
                    load: function(store, options) {
                        App.mask.hide();
                    }
                }
            });

            this.eventStore = new Ext.data.JsonStore({
                id: 'eventStore',
                root: 'evts',
                url: config.app_host + '/calendar/request/method/load',
                baseParams:{
                    component: 'event',
                    personid: config.app_logueduserdata.id
                },
                fields: [{
                    name:'EventId', 
                    mapping: 'id', 
                    type: 'int'
                },{
                    name:'CalendarId', 
                    mapping: 'cid', 
                    type: 'int'
                },{
                    name:'Title', 
                    mapping: 'title', 
                    type: 'string'
                },{
                    name:'StartDate', 
                    mapping: 'start', 
                    type: 'date', 
                    dateFormat: 'c'
                },{
                    name:'EndDate', 
                    mapping: 'end', 
                    type: 'date', 
                    dateFormat: 'c'
                },{
                    name:'Location', 
                    mapping: 'loc', 
                    type: 'string'
                },{
                    name:'Notes', 
                    mapping: 'notes', 
                    type: 'string'
                },{
                    name:'Url', 
                    mapping: 'url', 
                    type: 'string'
                },{
                    name:'IsAllDay', 
                    mapping: 'ad', 
                    type: 'boolean'
                },{
                    name:'Reminder', 
                    mapping: 'rem', 
                    type: 'string'
                },{
                    name:'Recurrence', 
                    mapping: 'rec', 
                    type: 'string'
                },{
                    name:'IsNew', 
                    mapping: 'n', 
                    type: 'boolean'
                }],	
                sortInfo: {
                    field: 'StartDate',
                    direction: 'ASC'
                },
                listeners: {
                    beforeload: function(store, options) {
                        App.mask.show();
                        beforeloadStore(store);
                    },
                    load: function(store, options) {
                        App.mask.hide();
                    }
                }
            });
            
            this.centerPanel = new Ext.ensible.cal.CalendarPanel({
                id: 'app-center',
                region: 'center',
                title: ' ', // will be updated to the current view's date range
                iconCls: Ext.ux.Icon('date'),
                eventStore: window['CalendarApp'].eventStore,
                calendarStore: window['CalendarApp'].calendarStore,
                activeItem: 4, // month view

                // Any generic view options that should be applied to all sub views:
                viewConfig: {
                    //enableFx: false
                    todayText: bundle.getMsg('calendar.field.todayText'),
                    ddCreateEventText: bundle.getMsg('calendar.field.ddCreateEventText'),
                    ddMoveEventText: bundle.getMsg('calendar.field.ddMoveEventText'),
                    ddResizeEventText: bundle.getMsg('calendar.field.ddResizeEventText'),
                    defaultEventTitleText: bundle.getMsg('calendar.field.defaultEventTitleText'),
                    dateParamFormat: Date.patterns.NonISO8601Short
                },

                // View options specific to a certain view (if the same options exist in viewConfig
                // they will be overridden by the view-specific config):
                monthViewCfg: {
                    showHeader: true,
                    showWeekLinks: true,
                    showWeekNumbers: true,
                    moreText: bundle.getMsg('calendar.field.moreText')
                },

                multiWeekViewCfg: {
                //weekCount: 2
                },

                // Some optional CalendarPanel configs to experiment with:
                readOnly: App.permissions.indexOf('managecalendarview') != -1,
                //showDayView: false,
                showMultiDayView: true,
                //showWeekView: false,
                showMultiWeekView: true,
                //showMonthView: false,
                //showNavBar: false,
                //showTodayText: false,
                //showTime: false,
                //showNavNextPrev: false,
                //showNavJump: false,
                editModal: true,

                jumpToText: bundle.getMsg('calendar.field.jumpToText'),
                todayText: bundle.getMsg('calendar.field.todayText'),
                goText: bundle.getMsg('calendar.field.goText'),
                monthText: bundle.getMsg('calendar.field.monthText'),
                weekText: bundle.getMsg('calendar.field.weekText'),
                multiWeekText: bundle.getMsg('calendar.field.multiWeekText'),
                dayText: bundle.getMsg('calendar.field.dayText'),
                multiDayText: bundle.getMsg('calendar.field.multiDayText'),

                // Once this component inits it will set a reference to itself as an application
                // member property for easy reference in other functions within App.
                initComponent: function() {
                    window['CalendarApp'].calendarPanel = this;
                    this.constructor.prototype.initComponent.apply(this, arguments);
                },

                listeners: {
                    'eventclick': {
                        fn: function(vw, rec, el) {
                            //Ext.Base.msg('Info:', 'Clicking evt rec='+rec.get('Title')+', view='+ vw.id +', el='+el.id);
                            window['CalendarApp'].formPanel.getForm().loadRecord(rec);
                            window['CalendarApp'].formPanel.periodRangeField.setValue(rec.data);

                            window['CalendarApp'].showWindow(Ext.getBody());
/*console.info(rec);
                            App.mask.show();
                            window['PlanApp'].taskGridPanel.getStore().load({
                                params: {
                                    entityid: config.app_entityid,
                                    customfilter: '[{"type":"int","value":"'+rec.json.Task.id+'","field":"id"}]'
                                },
                                callback: function() {
                                    App.mask.hide();
                                    window['PlanApp'].taskGridPanel.getSelectionModel().selectFirstRow();
                                    window['PlanApp'].taskGridPanel.updateBtn.fireEvent('click', 
                                        window['PlanApp'].gridPanel.updateBtn, false, true, function(){
                                            window['CalendarApp'].gridPanel.fireEvent('activate', window['CalendarApp'].gridPanel);
                                        });
                                }
                            });*/
                        }
                    },
                    'eventmove': {
                        fn: function(vw, rec) {
                            window['CalendarApp'].adjustEvent(rec, bundle.getMsg('calendar.field.moveevent.success'));
                        }
                    },
                    'eventresize': {
                        fn: function(vw, rec) {
                            window['CalendarApp'].adjustEvent(rec, bundle.getMsg('calendar.field.resizeevent.success'));
                        }
                    },
                    'initdrag': {
                        fn: function(vw) {
                            if (this.editWin && this.editWin.isVisible()) {
                                this.editWin.hide();
                            }
                        }
                    },
                    'viewchange': {
                        fn: function(p, vw, dateInfo) {
                            if (this.editWin) {
                                this.editWin.hide();
                            }
                            if (dateInfo !== null) {
                                // will be null when switching to the event edit form so ignore
                                window['CalendarApp'].eastPanel.navigationDatePicker.setValue(dateInfo.activeDate);
                                window['CalendarApp'].updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                            }
                        }
                    },
                    'dayclick': {
                        fn: function(vw, dt, ad, el) {
                            var dates = new Object;
                            dates.StartDate = dt;
                            dates.EndDate = dt;
                            window['CalendarApp'].formPanel.periodRangeField.setValue(dates);

                            window['CalendarApp'].showWindow(Ext.getBody()); 
/*
                            window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.setValue([dt, dt]);
                            window['PlanApp'].taskFormPanel.tabPanel.timePanel.manuallyprogrammedCheckBox.setValue(true);
                            window['PlanApp'].taskGridPanel.addBtn.fireEvent('click', window['PlanApp'].gridPanel.addBtn, false, true, function(){
                                window['CalendarApp'].gridPanel.fireEvent('activate', window['CalendarApp'].gridPanel);
                            });
                            window['PlanApp'].validateDateRange();
*/
                        }
                    },
                    'rangeselect': {
                        fn: function(vw, dates, onComplete) {
                            window['CalendarApp'].formPanel.periodRangeField.setValue(dates);

                            window['CalendarApp'].showWindow(Ext.getBody());
/*
                            window['PlanApp'].taskFormPanel.tabPanel.timePanel.periodRangeField.setValue(dates);
                            window['PlanApp'].taskFormPanel.tabPanel.timePanel.manuallyprogrammedCheckBox.setValue(true);
                            window['PlanApp'].taskGridPanel.addBtn.fireEvent('click', window['PlanApp'].gridPanel.addBtn, false, true, function(){
                                window['CalendarApp'].gridPanel.fireEvent('activate', window['CalendarApp'].gridPanel);
                            });
                            window['PlanApp'].validateDateRange();
*/
                        }
                    }
                }
            });

            this.calendarsView = new Ext.DataView({
                store: window['CalendarApp'].calendarStore,
                cls: 'x-combo-list',
                style: 'background-color: white; padding: 5px',
                itemSelector: '.x-combo-list-item',
                selectedClass: 'x-combo-selected',
                overClass: 'x-combo-selected',
                autoHeight:true,
                autoScroll: true,
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="x-combo-list-item" style="vertical-align: middle">',
                    '<div class="x-cal-{ColorId}">',
                    '<div class="mail-calendar-cat-color ext-cal-picker-icon" onmouseover="Ext.get(this).addClass(\'mail-calendar-cat-color-over\');" onmouseout="Ext.get(this).removeClass(\'mail-calendar-cat-color-over\');" style="background-color:#{CustomColor}">&nbsp;</div>',
                    '</div>',
                    '<div id="calendar-div-item-{CalendarId}">&nbsp;{Title}&nbsp;</div>',
                    '</div>',
                    '</tpl>',
                    '<div class="x-clear"></div>'
                    ),
                multiSelect: false,
                listeners: {
                    click: function(view, index, node, e) {
                        var record = window['CalendarApp'].calendarPanel.calendarStore.getAt(index);
                        var isHidden = record.get('IsHidden');

                        record.set('IsHidden', !isHidden);
                        record.commit();

                        if(!isHidden)
                            Ext.get('calendar-div-item-'+record.get('CalendarId')).addClass('task-complete');
                        else
                            Ext.get('calendar-div-item-'+record.get('CalendarId')).removeClass('task-complete');
                    },
                    contextmenu: function(view, index, node, e) {
                        e.stopEvent();

                        window['CalendarApp'].calendarWindowMenu.recordIndex = index;
                        window['CalendarApp'].calendarWindowMenu.show(Ext.get(node));

                        // forcing calendar to show if its hidden
                        var record = window['CalendarApp'].calendarPanel.calendarStore.getAt(index);
                        record.set('IsHidden', false);
                        record.commit();
                        Ext.get('calendar-div-item-'+record.get('CalendarId')).removeClass('task-complete');
                    }
                }
            });

            this.eastPanel = new Ext.Panel({
                region: 'east',
                width: 176,
                collapsible: true,
                collapseMode: 'mini',
                header: false,
                items: [new Ext.Panel({
                    iconCls: Ext.ux.Icon('date_go'),
                    title: bundle.getMsg('calendar.field.navigation'),
                    border: false,
                    items:[{
                        ref: '../navigationDatePicker',
                        xtype: 'datepicker',
                        cls: 'ext-cal-nav-picker',
                        listeners: {
                            'select': {
                                fn: function(dp, dt) {
                                    window['CalendarApp'].calendarPanel.setStartDate(dt);
                                }
                            }
                        }
                    }]
                }), new Ext.Panel({
                    title: bundle.getMsg('calendar.field.customview'),
                    iconCls: Ext.ux.Icon('color_swatch'),
                    border: false,
                    autoScroll: true,
                    layout: 'fit',
                    tools: [{
                        id:'save',
                        qtip: bundle.getMsg('app.form.save'),
                        handler: function() {
                            var array = new Array(); 
                            window['CalendarApp'].calendarPanel.calendarStore.each(function(record){
                                var obj = new Object;
                                obj.calendar = record.get('CalendarId');
                                obj.color = record.get('CustomColor');
                                array.push(obj);
                            });

                            var msg = App.mask.msg;
                            App.mask.msg = 'Guardando perfil de usuario...';
                            App.mask.show();

                            new Ext.data.Connection().request({
                                url: config.app_host + '/db/request/method/saveprofile',
                                params: {
                                    customcolor: Ext.encode(array)
                                },
                                method: 'POST',
                                callback : function(options, success, response) {

                                    App.mask.hide();
                                    App.mask.msg = msg;

                                    Ext.Msg.show({
                                        title:bundle.getMsg('app.msg.info.title'),
                                        msg: bundle.getMsg('app.msg.info.savedsuccessful'),
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                }
                            }); 
                        }
                    }],
                    items:[this.calendarsView]
                })]
            });

            this.gridPanel = new Ext.Panel({
                id: 'gridPanelCalendar',
                border: false,
                defaults: {
                    split: true
                },
                layout: 'border',
                store: window['CalendarApp'].eventStore,
                listeners: {
                    activate: function(gridpanel){
                        window['CalendarApp'].calendarStore.load({
                            params:{
                                mastercolors: Ext.encode(mastercolors)
                            },
                            callback: function(records, options, success ){
                                if(config && config.app_logueduserdata && config.app_logueduserdata.profile && config.app_logueduserdata.profile.customcolor){
                                    var cols = Ext.decode(config.app_logueduserdata.profile.customcolor);
                                    for (var i = 0; i < cols.length; i++){
                                        var record = window['CalendarApp'].calendarStore.getAt(window['CalendarApp'].calendarStore.find('CalendarId',cols[i].calendar, 0, true, true));
                                        record.set('CustomColor', cols[i].color);
                                    }
                                }
                                window['CalendarApp'].eventStore.load();
                            }
                        });
                        window['ReminderApp'].comboStore.load();
                    }
                },
                items: [this.centerPanel, this.eastPanel]
            });

            this.calendarColorPalette = new Ext.ColorPalette({
                handler: function(palette, colorId) {
                    var record = window['CalendarApp'].calendarPanel.calendarStore.getAt(window['CalendarApp'].calendarWindowMenu.recordIndex);
                    record.set('CustomColor', colorId);
                    window['CalendarApp'].calendarWindowMenu.hide();
                }
            });
            this.calendarColorPalette.colors = mastercolors;

            this.calendarWindowMenu = new Ext.menu.Menu({
                cls: 'x-calendar-list-menu',
                items: ['<b class="menu-title">'+bundle.getMsg('calendar.field.selectcustomcolor')+'</b>', this.calendarColorPalette]
            });


            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/calendar/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',						
                keys: [formKeyMaping],
                items: [{
                    xtype:'hidden',
                    name: 'EventId'
                },{
                    xtype:'textfield',
                    name: 'Title',
                    anchor:'-20',
                    allowBlank:false,
                    fieldLabel: bundle.getMsg('app.form.title')+'<span style="color:red;"><sup>*</sup></span>'
                },{
                    ref: 'periodRangeField',
                    xtype: 'sgarqbase.daterangefield',
                    fieldLabel: bundle.getMsg('event.field.period')+'<span style="color:red;"><sup>*</sup></span>',
                    id: 'calendar-period',
                    toText: bundle.getMsg('calendar.field.toText'),
                    allDayText: bundle.getMsg('calendar.field.allDayText'),
                    dateFormat: Date.patterns.NonISO8601Short,
                    allowBlank:false,
                    anchor:'-20'
                },{
                    layout:'column',
                    border: false,
                    defaults:{
                        border:false
                    }, 	
                    items:[{
                        columnWidth:.60,
                        layout: 'form',
                        items: [{
                            xtype:'textarea',
                            name: 'Notes',
                            height: 72,
                            anchor:'-20',
                            fieldLabel: bundle.getMsg('app.form.comment')
                        },{
                            xtype:'textfield',
                            name: 'Location',
                            anchor:'-20',
                            fieldLabel: bundle.getMsg('reminder.field.location')
                        }]
                    },{
                        columnWidth:.40,
                        layout: 'form',
                        items: [{
                            ref: '../../calendarCombo',
                            xtype: 'sgarqbase.calendarcombo',
                            store: window['CalendarApp'].calendarStore,
                            fieldLabel: bundle.getMsg('calendar.field.label')+'<span style="color:red;"><sup>*</sup></span>',
                            valueField: 'id',
                            name: 'CalendarId',
                            anchor:'-20',
                            allowBlank:false,
                            emptyText: bundle.getMsg('app.form.select')
                        },new Ext.form.ComboBox({
                            ref: '../../reminderCombo',
                            fieldLabel: bundle.getMsg('reminder.field.label'),
                            name: 'Reminder',
                            valueField: 'id',
                            anchor:'-20',
                            store: window['ReminderApp'].comboStore,
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
                            xtype:'textfield',
                            name: 'Url',
                            anchor:'-20',
                            fieldLabel: bundle.getMsg('reminder.field.link')
                        }]
                    }]
                }]
            });
			
        },

        // The CalendarPanel itself supports the standard Panel title config, but that title
        // only spans the calendar views. For a title that spans the entire width of the app
        // we added a title to the layout's outer center region that is app-specific. This code
        // updates that outer title based on the currently-selected view range anytime the view changes.
        updateTitle: function(startDt, endDt) {
            var p = window['CalendarApp'].centerPanel;

            if (startDt.clearTime().getTime() == endDt.clearTime().getTime()) {
                p.setTitle(startDt.format('F j, Y'));
            }
            else if (startDt.getFullYear() == endDt.getFullYear()) {
                if (startDt.getMonth() == endDt.getMonth()) {
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('j, Y'));
                }
                else {
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('F j, Y'));
                }
            }
            else {
                p.setTitle(startDt.format('F j, Y') + ' - ' + endDt.format('F j, Y'));
            }


            Ext.getCmp('app-center-tb-feed').setIconClass(Ext.ux.Icon('feed'));
            Ext.getCmp('app-center-tb-feed').handler = function () {
                var win = window.open(config.app_host + '/service.php?method=getatom&sf_format=atom', '_blank');
                win.focus();
            };

            Ext.getCmp('app-center-tb-today').setIconClass(Ext.ux.Icon('calendar_view_day'));
            Ext.getCmp('app-center-tb-day').setIconClass(Ext.ux.Icon('calendar_view_day'));
            Ext.getCmp('app-center-tb-multiday').setIconClass(Ext.ux.Icon('calendar_view_day'));
            Ext.getCmp('app-center-tb-week').setIconClass(Ext.ux.Icon('calendar_view_week'));
            Ext.getCmp('app-center-tb-multiweek').setIconClass(Ext.ux.Icon('calendar_view_week'));
            Ext.getCmp('app-center-tb-month').setIconClass(Ext.ux.Icon('calendar_view_month'));
            Ext.getCmp('app-center-tb-jump').setIconClass(Ext.ux.Icon('date_go'));
        },

        adjustEvent : function(rec, msg){
            var sd = rec.get('StartDate');
            var ed = rec.get('EndDate');

            Ext.Ajax.request({
                method:'POST',
                url: config.app_host + '/calendar/request/method/eventadjust',
                params:{
                    EventId: rec.get('EventId'),
                    StartDate: sd.format(Date.patterns.ISO8601Long),
                    EndDate: ed.format(Date.patterns.ISO8601Long)
                },
                success:function(response,opts){
                    window['CalendarApp'].gridPanel.fireEvent('activate', window['CalendarApp'].gridPanel);
                    Ext.Base.msg(bundle.getMsg('app.form.info'), String.format(msg, rec.get('Title'), rec.get('StartDate').format(Date.patterns.FullDateTime)));
                },
                failure:requestFailed
            });
        },

        showWindow : function(animateTarget){
            window['CalendarApp'].window = App.showWindow(bundle.getMsg('event.window.title'), 580, 340, window['CalendarApp'].formPanel, 
                function(button, eventObject, callback){ 
                    if(!button){
                        button = new Object;
                        button.id = window['CalendarApp'].window.submitBtn.id;
                    }

                    window['CalendarApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            responsibleid: window['CalendarApp'].eventStore.baseParams.personid, 
                            entityid: config.app_entityid, 
                            calendarid: window['CalendarApp'].formPanel.calendarCombo.getValue(),
                            reminderid: window['CalendarApp'].formPanel.reminderCombo.getValue()
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['CalendarApp'].gridPanel.fireEvent('activate', window['CalendarApp'].gridPanel);
                            
                            submitFormSuccessful('CalendarApp', form, action, button, true, function(){
                                
                                }, callback);
                        },
                        failure: loadFormFailed
                    });

                }, 
                function(){
                    window['CalendarApp'].window.hide();
                }, 
                animateTarget);

        },
        
        applySecurity : function(groups, permissions){
            
        }
    }
}();

Ext.data.Store.prototype.rejectAllChanges = function() {
    this.rejectChanges();
    for (var i = this.data.length - 1; i >= 0; i--) {
        var rec = this.data.items[i];
        if (rec.phantom) {
            this.remove(rec);
            if (Ext.isArray(this.deleted)) {
                this.deleted.remove(rec);
            }
            if (Ext.isArray(this.removed)) {
                this.removed.remove(rec);
            }
        }
    }
}

