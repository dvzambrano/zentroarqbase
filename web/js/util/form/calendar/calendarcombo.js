Ext.ns("Ext.SgArqBase");

Ext.SgArqBase.CalendarCombo = Ext.extend(Ext.form.ComboBox, {
    fieldLabel: "Calendar",
    triggerAction: "all",
    mode: "local",
    forceSelection: true,
    defaultCls: "x-cal-default",
    initComponent: function () {
        var a = Ext.SgArqBase,
        b = Ext.ensible.cal.CalendarMappings;
        a.CalendarCombo.superclass.initComponent.call(this);
        this.valueField = b.CalendarId.name;
        this.displayField = b.Title.name;
        this.tpl = this.tpl || '<tpl for="."><div class="x-combo-list-item"><div class="mail-calendar-cat-color ext-cal-picker-icon"  style="background-color:#{' + b.CustomColor.name + '}">&#160;</div>{' + this.displayField + "}</div></tpl>"
    },
    afterRender: function () {
        Ext.SgArqBase.CalendarCombo.superclass.afterRender.call(this);
        this.wrap = this.el.up(".x-form-field-wrap");
        this.wrap.addClass("ext-calendar-picker");
        this.icon = Ext.DomHelper.append(this.wrap, {
            tag: "div",
            cls: "ext-cal-picker-icon ext-cal-picker-mainicon"
        })
    },
    getStyleClass: function (a) {
        if (a && a !== "") {
            var b = this.store.getById(a);
            return "x-cal-" + b.data[Ext.ensible.cal.CalendarMappings.ColorId.name]
        }
    },
    setValue: function (a) {
        if(this.store.getAt(0)){
            this.wrap.removeClass(this.getStyleClass(this.getValue()));
            a = a || this.store.getAt(0).data[Ext.ensible.cal.CalendarMappings.CalendarId.name];
            Ext.SgArqBase.CalendarCombo.superclass.setValue.call(this, a);
            this.wrap.addClass(this.getStyleClass(a))
        }
    }
});
Ext.reg("sgarqbase.calendarcombo", Ext.SgArqBase.CalendarCombo);