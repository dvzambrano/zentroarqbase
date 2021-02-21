Ext.ns("Ext.SgArqBase");

Ext.SgArqBase.DateRangeField = Ext.extend(Ext.form.Field, {
    toText: "to",
    allDayText: "All day",
    singleLine: "auto",
    singleLineMinWidth: 490,
    dateFormat: "n/j/Y",
    onRender: function (e, b) {
        if (!this.el) {
            this.startDate = new Ext.form.DateField({
                id: this.id + "-start-date",
                vtype: 'daterange',
                endDateField: this.id + "-end-date",
                format: this.dateFormat,
                minValue: this.minValue,
                width: 100,
                allowBlank: this.allowBlank,
                listeners: {
                    change: {
                        fn: function () {
                            this.onFieldChange("date", "start")
                        },
                        scope: this
                    }
                }
            });
            this.startTime = new Ext.form.TimeField({
                id: this.id + "-start-time",
                hidden: this.showTimes === false,
                labelWidth: 0,
                hideLabel: true,
                width: 90,
                listeners: {
                    select: {
                        fn: function () {
                            this.onFieldChange("time", "start")
                        },
                        scope: this
                    }
                }
            });
            this.endTime = new Ext.form.TimeField({
                id: this.id + "-end-time",
                hidden: this.showTimes === false,
                labelWidth: 0,
                hideLabel: true,
                width: 90,
                listeners: {
                    select: {
                        fn: function () {
                            this.onFieldChange("time", "end")
                        },
                        scope: this
                    }
                }
            });
            this.endDate = new Ext.form.DateField({
                id: this.id + "-end-date",
                vtype: 'daterange',
                startDateField: this.id + "-start-date",
                format: this.dateFormat,
                hideLabel: true,
                width: 100,
                allowBlank: this.allowBlank,
                listeners: {
                    change: {
                        fn: function () {
                            this.onFieldChange("date", "end")
                        },
                        scope: this
                    }
                }
            });
            this.allDay = new Ext.form.Checkbox({
                id: this.id + "-allday",
                hidden: this.showTimes === false || this.showAllDay === false,
                boxLabel: this.allDayText,
                handler: function (g, h) {
                    this.startTime.setVisible(!h);
                    this.endTime.setVisible(!h)
                },
                scope: this
            });
            this.toLabel = new Ext.form.Label({
                xtype: "label",
                id: this.id + "-to-label",
                text: this.toText
            });
            var a = this.singleLine;
            if (a == "auto") {
                var f, c = this.ownerCt.getWidth() - this.ownerCt.getEl().getPadding("lr");
                if (f == this.ownerCt.getEl().child(".x-panel-body")) {
                    c -= f.getPadding("lr")
                }
                if (f == this.ownerCt.getEl().child(".x-form-item-label")) {
                    c -= f.getWidth() - f.getPadding("lr")
                }
                a = c <= this.singleLineMinWidth ? false : true
            }
            this.fieldCt = new Ext.Container({
                //                autoEl: {
                //                    id: this.id
                //                },
                cls: "ext-dt-range",
                renderTo: e,
                layout: "table",
                layoutConfig: {
                    columns: a ? 6 : 3
                },
                defaults: {
                    hideParent: true
                },
                items: [this.startDate, this.startTime, this.toLabel, a ? this.endTime : this.endDate, a ? this.endDate : this.endTime, this.allDay]
            });
            this.fieldCt.ownerCt = this;
            this.el = this.fieldCt.getEl();
            this.items = new Ext.util.MixedCollection();
            this.items.addAll([this.startDate, this.endDate, this.toLabel, this.startTime, this.endTime, this.allDay])
        }
        Ext.SgArqBase.DateRangeField.superclass.onRender.call(this, e, b);
        if (!a) {
            this.el.child("tr").addClass("ext-dt-range-row1")
        }
    },
    onFieldChange: function (a, b) {
        this.checkDates(a, b);
        this.fireEvent("change", this, this.getValue())
    },
    checkDates: function (f, g) {
        var e = Ext.getCmp(this.id + "-start-" + f),
        b = Ext.getCmp(this.id + "-end-" + f),
        c = this.getDT("start"),
        a = this.getDT("end");
        if (c > a) {
            if (g == "start") {
                b.setValue(c)
            } else {
                e.setValue(a);
                this.checkDates(f, "start")
            }
        }
        if (f == "date") {
            this.checkDates("time", g)
        }
    },
    getValue: function () {
        return [this.getDT("start"), this.getDT("end"), this.allDay ? this.allDay.getValue() : false]
    },
    getDT: function (c) {
        var b = this[c + "Time"] ? this[c + "Time"].getValue() : false,
        a = this[c + "Date"] ? this[c + "Date"].getValue() : false;
        if (a && Ext.isDate(a)) {
            a = a.format(this[c + "Date"].format)
        } else {
            return null
        }
        if (a && b && b != "" && this[c + "Time"].isVisible()) {
            return Date.parseDate(a + " " + b, this[c + "Date"].format + " " + this[c + "Time"].format)
        }
        return Date.parseDate(a, this[c + "Date"].format)
    },
    setValue: function (a) {
        if (Ext.isArray(a)) {
            this.setDT(a[0], "start");
            this.setDT(a[1], "end");
            if(this.allDay)
                this.allDay.setValue( !! a[2])
        } else {
            if (Ext.isDate(a)) {
                this.setDT(a, "start");
                this.setDT(a, "end");
                this.allDay.setValue(false)
            } else {
                if (a[Ext.ensible.cal.EventMappings.StartDate.name]) {
                    this.setDT(a[Ext.ensible.cal.EventMappings.StartDate.name], "start");
                    if (!this.setDT(a[Ext.ensible.cal.EventMappings.EndDate.name], "end")) {
                        this.setDT(a[Ext.ensible.cal.EventMappings.StartDate.name], "end")
                    }
                    this.allDay.setValue( !! a[Ext.ensible.cal.EventMappings.IsAllDay.name])
                }
            }
        }
    },
    setDT: function (a, b) {
        if (a && Ext.isDate(a)) {
            if(this[b + "Date"])
                this[b + "Date"].setValue(a);
            if(this[b + "Time"])
                this[b + "Time"].setValue(a.format(this[b + "Time"].format));
            return true;
        }
        return false;
    },
    isDirty: function () {
        var a = false;
        if (this.rendered && !this.disabled) {
            this.items.each(function (b) {
                if (b.isDirty()) {
                    a = true;
                }
                return false;
            })
        }
        return a
    },
    onDisable: function () {
        this.delegateFn("disable")
    },
    onEnable: function () {
        this.delegateFn("enable")
    },
    reset: function () {
        this.delegateFn("reset")
    },
    delegateFn: function (a) {
        if(this.items)
            this.items.each(function (b) {
                if (b[a]) {
                    b[a]()
                }
            })
    },
    beforeDestroy: function () {
        Ext.destroy(this.fieldCt);
        Ext.SgArqBase.DateRangeField.superclass.beforeDestroy.call(this)
    },
    getRawValue: Ext.emptyFn,
    setRawValue: Ext.emptyFn
});
Ext.reg("sgarqbase.daterangefield", Ext.SgArqBase.DateRangeField);