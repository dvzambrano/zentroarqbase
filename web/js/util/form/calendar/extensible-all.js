/*
 * Extensible 1.0-beta1
 * Copyright(c) 2010 Extensible, LLC
 * team@ext.ensible.com
 * http://ext.ensible.com
 */
(function () {
    Ext.ns("Ext.ensible.ux", "Ext.ensible.sample", "Ext.ensible.plugins", "Ext.ensible.cal");
    Ext.apply(Ext.ensible, {
        version: "1.0-beta-1",
        versionDetails: {
            major: 1,
            minor: 0,
            patch: 0
        },
        hasBorderRadius: !(Ext.isIE || Ext.isOpera),
        log: function (a) {},
        Date: {
            use24HourTime: false,
            diff: function (f, a, c) {
                var b = 1,
                e = a.getTime() - f.getTime();
                if (c == "s") {
                    b = 1000
                }
                else {
                    if (c == "m") {
                        b = 1000 * 60
                    } else {
                        if (c == "h") {
                            b = 1000 * 60 * 60
                        }
                    }
                }
                return Math.round(e / b)
            },
            diffDays: function (b, a) {
                day = 1000 * 60 * 60 * 24;
                diff = a.clearTime(true).getTime() - b.clearTime(true).getTime();
                return Math.ceil(diff / day)
            },
            copyTime: function (c, b) {
                var a = b.clone();
                a.setHours(c.getHours(), c.getMinutes(), c.getSeconds(), c.getMilliseconds());
                return a
            },
            compare: function (c, b, a) {
                var f = c,
                e = b;
                if (a !== true) {
                    f = c.clone();
                    f.setMilliseconds(0);
                    e = b.clone();
                    e.setMilliseconds(0)
                }
                return e.getTime() - f.getTime()
            },
            maxOrMin: function (a) {
                var f = (a ? 0 : Number.MAX_VALUE),
                c = 0,
                b = arguments[1],
                e = b.length;
                for (; c < e; c++) {
                    f = Math[a ? "max" : "min"](f, b[c].getTime())
                }
                return new Date(f)
            },
            max: function () {
                return this.maxOrMin.apply(this, [true, arguments])
            },
            min: function () {
                return this.maxOrMin.apply(this, [false, arguments])
            },
            isInRange: function (a, c, b) {
                return (a >= c && a <= b)
            },
            rangesOverlap: function (g, b, f, a) {
                var c = (g >= f && g <= a),
                e = (b >= f && b <= a),
                h = (g < f && b > a);
                return (c || e || h)
            }
        }
    })
})();
var updateRule = function (rule, color) {
    if(color){
        Ext.util.CSS.createStyleSheet('.'+rule+', .'+rule+'-x .ext-cal-evb, .ext-ie .'+rule+'-ad, .ext-opera .'+rule+'-ad { color: #'+color+'; }');
        Ext.util.CSS.createStyleSheet('.ext-cal-day-col .'+rule+', .ext-dd-drag-proxy .'+rule+', .'+rule+'-ad, .'+rule+'-ad .ext-cal-evm, .'+rule+' .ext-cal-picker-icon, .'+rule+'-x dl, .x-calendar-list-menu li em .'+rule+' { background: #'+color+'; }');
    }
};    
Ext.override(Ext.XTemplate, {
    applySubTemplate: function (a, i, h, e, c) {
        var g = this,
        f, l = g.tpls[a],
        k, b = [];
        if ((l.test && !l.test.call(g, i, h, e, c)) || (l.exec && l.exec.call(g, i, h, e, c))) {
            return ""
        }
        k = l.target ? l.target.call(g, i, h) : i;
        f = k.length;
        h = l.target ? i : h;
        if (l.target && Ext.isArray(k)) {
            Ext.each(k, function (m, n) {
                b[b.length] = l.compiled.call(g, m, h, n + 1, f)
            });
            return b.join("")
        }
        return l.compiled.call(g, k, h, e, c)
    }
});
Ext.override(Ext.data.Store, {
    afterEdit: function (a) {
        if (!a.phantom) {
            if (this.modified.indexOf(a) == -1) {
                this.modified.push(a)
            }
            this.fireEvent("update", this, a, Ext.data.Record.EDIT)
        }
    },
    add: function (b) {
        var e, a, c;
        b = [].concat(b);
        if (b.length < 1) {
            return
        }
        for (e = 0, len = b.length; e < len; e++) {
            a = b[e];
            a.join(this);
            if ((a.dirty || a.phantom) && this.modified.indexOf(a) == -1) {
                this.modified.push(a)
            }
        }
        c = this.data.length;
        this.data.addAll(b);
        if (this.snapshot) {
            this.snapshot.addAll(b)
        }
        this.fireEvent("add", this, b, c)
    },
    insert: function (c, b) {
        var e, a;
        b = [].concat(b);
        for (e = 0, len = b.length; e < len; e++) {
            a = b[e];
            this.data.insert(c + e, a);
            a.join(this);
            if ((a.dirty || a.phantom) && this.modified.indexOf(a) == -1) {
                this.modified.push(a)
            }
        }
        if (this.snapshot) {
            this.snapshot.addAll(b)
        }
        this.fireEvent("add", this, b, c)
    },
    createRecords: function (c, b, f) {
        var e = this.modified,
        h = b.length,
        a, g;
        for (g = 0; g < h; g++) {
            a = b[g];
            if (a.phantom && a.isValid()) {
                a.markDirty();
                if (e.indexOf(a) == -1) {
                    e.push(a)
                }
            }
        }
        if (this.autoSave === true) {
            this.save()
        }
    }
});
Ext.data.MemoryProxy = function (b) {
    var a = {};
    a[Ext.data.Api.actions.read] = true;
    a[Ext.data.Api.actions.create] = true;
    a[Ext.data.Api.actions.update] = true;
    a[Ext.data.Api.actions.destroy] = true;
    Ext.data.MemoryProxy.superclass.constructor.call(this, {
        api: a
    });
    this.data = b
};
Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
    doRequest: function (b, c, a, f, h, i, k) {
        if (b === Ext.data.Api.actions.read) {
            a = a || {};
            var l;
            try {
                l = f.readRecords(this.data)
            } catch (g) {
                this.fireEvent("loadexception", this, null, k, g);
                this.fireEvent("exception", this, "response", b, k, null, g);
                h.call(i, null, k, false);
                return
            }
            h.call(i, l, k, true)
        }
    }
});
Ext.ensible.cal.DayHeaderTemplate = function (a) {
    Ext.apply(this, a);
    this.allDayTpl = new Ext.ensible.cal.BoxLayoutTemplate(a);
    this.allDayTpl.compile();
    Ext.ensible.cal.DayHeaderTemplate.superclass.constructor.call(this, '<div class="ext-cal-hd-ct">', '<table class="ext-cal-hd-days-tbl" cellspacing="0" cellpadding="0">', "<tbody>", "<tr>", '<td class="ext-cal-gutter"></td>', '<td class="ext-cal-hd-days-td"><div class="ext-cal-hd-ad-inner">{allDayTpl}</div></td>', '<td class="ext-cal-gutter-rt"></td>', "</tr>", "</tbody>", "</table>", "</div>")
};
Ext.extend(Ext.ensible.cal.DayHeaderTemplate, Ext.XTemplate, {
    applyTemplate: function (a) {
        return Ext.ensible.cal.DayHeaderTemplate.superclass.applyTemplate.call(this, {
            allDayTpl: this.allDayTpl.apply(a)
        })
    }
});
Ext.ensible.cal.DayHeaderTemplate.prototype.apply = Ext.ensible.cal.DayHeaderTemplate.prototype.applyTemplate;
Ext.ensible.cal.DayBodyTemplate = function (a) {
    Ext.apply(this, a);
    Ext.ensible.cal.DayBodyTemplate.superclass.constructor.call(this, '<table class="ext-cal-bg-tbl" cellspacing="0" cellpadding="0">', "<tbody>", '<tr height="1">', '<td class="ext-cal-gutter"></td>', '<td colspan="{dayCount}">', '<div class="ext-cal-bg-rows">', '<div class="ext-cal-bg-rows-inner">', '<tpl for="times">', '<div class="ext-cal-bg-row">', '<div class="ext-cal-bg-row-div ext-row-{[xindex]}"></div>', "</div>", "</tpl>", "</div>", "</div>", "</td>", "</tr>", "<tr>", '<td class="ext-cal-day-times">', '<tpl for="times">', '<div class="ext-cal-bg-row">', '<div class="ext-cal-day-time-inner">{.}</div>', "</div>", "</tpl>", "</td>", '<tpl for="days">', '<td class="ext-cal-day-col">', '<div class="ext-cal-day-col-inner">', '<div id="{[this.id]}-day-col-{.:date("Ymd")}" class="ext-cal-day-col-gutter"></div>', "</div>", "</td>", "</tpl>", "</tr>", "</tbody>", "</table>")
};
Ext.extend(Ext.ensible.cal.DayBodyTemplate, Ext.XTemplate, {
    applyTemplate: function (f) {
        this.today = new Date().clearTime();
        this.dayCount = this.dayCount || 1;
        var b = 0,
        g = [],
        c = f.viewStart.clone();
        for (; b < this.dayCount; b++) {
            g[b] = c.add(Date.DAY, b)
        }
        var e = [],
        c = new Date().clearTime(),
        a = Ext.ensible.Date.use24HourTime ? "G:i" : "ga";
        for (b = 0; b < 24; b++) {
            e.push(c.format(a));
            c = c.add(Date.HOUR, 1)
        }
        return Ext.ensible.cal.DayBodyTemplate.superclass.applyTemplate.call(this, {
            days: g,
            dayCount: g.length,
            times: e
        })
    }
});
Ext.ensible.cal.DayBodyTemplate.prototype.apply = Ext.ensible.cal.DayBodyTemplate.prototype.applyTemplate;
Ext.ensible.cal.BoxLayoutTemplate = function (a) {
    Ext.apply(this, a);
    var b = this.showWeekLinks ? '<div id="{weekLinkId}" class="ext-cal-week-link">{weekNum}</div>' : "";
    Ext.ensible.cal.BoxLayoutTemplate.superclass.constructor.call(this, '<tpl for="weeks">', '<div id="{[this.id]}-wk-{[xindex-1]}" class="ext-cal-wk-ct" style="top:{[this.getRowTop(xindex, xcount)]}%; height:{[this.getRowHeight(xcount)]}%;">', b, '<table class="ext-cal-bg-tbl" cellpadding="0" cellspacing="0">', "<tbody>", "<tr>", '<tpl for=".">', '<td id="{[this.id]}-day-{date:date("Ymd")}" class="{cellCls}">&#160;</td>', "</tpl>", "</tr>", "</tbody>", "</table>", '<table class="ext-cal-evt-tbl" cellpadding="0" cellspacing="0">', "<tbody>", "<tr>", '<tpl for=".">', '<td id="{[this.id]}-ev-day-{date:date("Ymd")}" class="{titleCls}"><div>{title}</div></td>', "</tpl>", "</tr>", "</tbody>", "</table>", "</div>", "</tpl>", {
        getRowTop: function (c, e) {
            return ((c - 1) * (100 / e))
        },
        getRowHeight: function (c) {
            return 100 / c
        }
    })
};
Ext.extend(Ext.ensible.cal.BoxLayoutTemplate, Ext.XTemplate, {
    firstWeekDateFormat: "D j",
    otherWeeksDateFormat: "j",
    singleDayDateFormat: "l, F j, Y",
    multiDayFirstDayFormat: "M j, Y",
    multiDayMonthStartFormat: "M j",
    applyTemplate: function (e) {
        Ext.apply(this, e);
        var p = 0,
        n = "",
        h = true,
        k = false,
        f = false,
        g = false,
        i = false,
        a = [
        []
        ],
        m = new Date().clearTime(),
        c = this.viewStart.clone(),
        b = this.startDate.getMonth();
        for (; p < this.weekCount || this.weekCount == -1; p++) {
            if (c > this.viewEnd) {
                break
            }
            a[p] = [];
            for (var l = 0; l < this.dayCount; l++) {
                k = c.getTime() === m.getTime();
                f = h || (c.getDate() == 1);
                g = (c.getMonth() < b) && this.weekCount == -1;
                i = (c.getMonth() > b) && this.weekCount == -1;
                if (c.getDay() == 1) {
                    a[p].weekNum = this.showWeekNumbers ? c.format("W") : "&#160;";
                    a[p].weekLinkId = "ext-cal-week-" + c.format("Ymd")
                }
                if (f) {
                    if (k) {
                        n = this.getTodayText()
                    } else {
                        n = c.format(this.dayCount == 1 ? this.singleDayDateFormat : (h ? this.multiDayFirstDayFormat : this.multiDayMonthStartFormat))
                    }
                } else {
                    var q = (p == 0 && this.showHeader !== true) ? this.firstWeekDateFormat : this.otherWeeksDateFormat;
                    n = k ? this.getTodayText() : c.format(q)
                }
                a[p].push({
                    title: n,
                    date: c.clone(),
                    titleCls: "ext-cal-dtitle " + (k ? " ext-cal-dtitle-today" : "") + (p == 0 ? " ext-cal-dtitle-first" : "") + (g ? " ext-cal-dtitle-prev" : "") + (i ? " ext-cal-dtitle-next" : ""),
                    cellCls: "ext-cal-day " + (k ? " ext-cal-day-today" : "") + (l == 0 ? " ext-cal-day-first" : "") + (g ? " ext-cal-day-prev" : "") + (i ? " ext-cal-day-next" : "")
                });
                c = c.add(Date.DAY, 1);
                h = false
            }
        }
        return Ext.ensible.cal.BoxLayoutTemplate.superclass.applyTemplate.call(this, {
            weeks: a
        })
    },
    getTodayText: function () {
        var b = Ext.ensible.Date.use24HourTime ? "G:i " : "g:ia ",
        c = this.showTodayText !== false ? this.todayText : "",
        a = this.showTime !== false ? ' <span id="' + this.id + '-clock" class="ext-cal-dtitle-time">' + new Date().format(b) + "</span>" : "",
        e = c.length > 0 || a.length > 0 ? " &#8212; " : "";
        if (this.dayCount == 1) {
            return new Date().format(this.singleDayDateFormat) + e + c + a
        }
        fmt = this.weekCount == 1 ? this.firstWeekDateFormat : this.otherWeeksDateFormat;
        return c.length > 0 ? c + a : new Date().format(fmt) + a
    }
});
Ext.ensible.cal.BoxLayoutTemplate.prototype.apply = Ext.ensible.cal.BoxLayoutTemplate.prototype.applyTemplate;
Ext.ensible.cal.MonthViewTemplate = function (a) {
    Ext.apply(this, a);
    this.weekTpl = new Ext.ensible.cal.BoxLayoutTemplate(a);
    this.weekTpl.compile();
    var b = this.showWeekLinks ? '<div class="ext-cal-week-link-hd">&#160;</div>' : "";
    Ext.ensible.cal.MonthViewTemplate.superclass.constructor.call(this, '<div class="ext-cal-inner-ct {extraClasses}">', '<div class="ext-cal-hd-ct ext-cal-month-hd">', b, '<table class="ext-cal-hd-days-tbl" cellpadding="0" cellspacing="0">', "<tbody>", "<tr>", '<tpl for="days">', '<th class="ext-cal-hd-day{[xindex==1 ? " ext-cal-day-first" : ""]}" title="{title}">{name}</th>', "</tpl>", "</tr>", "</tbody>", "</table>", "</div>", '<div class="ext-cal-body-ct">{weeks}</div>', "</div>")
};
Ext.extend(Ext.ensible.cal.MonthViewTemplate, Ext.XTemplate, {
    dayHeaderFormat: "D",
    dayHeaderTitleFormat: "l, F j, Y",
    applyTemplate: function (g) {
        var h = [],
        e = this.weekTpl.apply(g),
        c = g.viewStart;
        for (var b = 0; b < 7; b++) {
            var f = c.add(Date.DAY, b);
            h.push({
                name: f.format(this.dayHeaderFormat),
                title: f.format(this.dayHeaderTitleFormat)
            })
        }
        var a = this.showHeader === true ? "" : "ext-cal-noheader";
        if (this.showWeekLinks) {
            a += " ext-cal-week-links"
        }
        return Ext.ensible.cal.MonthViewTemplate.superclass.applyTemplate.call(this, {
            days: h,
            weeks: e,
            extraClasses: a
        })
    }
});
Ext.ensible.cal.MonthViewTemplate.prototype.apply = Ext.ensible.cal.MonthViewTemplate.prototype.applyTemplate;
Ext.dd.ScrollManager = function () {
    var c = Ext.dd.DragDropMgr;
    var f = {};
    var b = null;
    var i = {};
    var h = function (m) {
        b = null;
        a()
    };
    var k = function () {
        if (c.dragCurrent) {
            c.refreshCache(c.dragCurrent.groups)
        }
    };
    var e = function () {
        if (c.dragCurrent) {
            var m = Ext.dd.ScrollManager;
            var n = i.el.ddScrollConfig ? i.el.ddScrollConfig.increment : m.increment;
            if (!m.animate) {
                if (i.el.scroll(i.dir, n)) {
                    k()
                }
            } else {
                i.el.scroll(i.dir, n, true, m.animDuration, k)
            }
        }
    };
    var a = function () {
        if (i.id) {
            clearInterval(i.id)
        }
        i.id = 0;
        i.el = null;
        i.dir = ""
    };
    var g = function (n, m) {
        a();
        i.el = n;
        i.dir = m;
        var p = (n.ddScrollConfig && n.ddScrollConfig.frequency) ? n.ddScrollConfig.frequency : Ext.dd.ScrollManager.frequency,
        o = n.ddScrollConfig ? n.ddScrollConfig.ddGroup : undefined;
        if (o === undefined || c.dragCurrent.ddGroup == o) {
            i.id = setInterval(e, p)
        }
    };
    var l = function (p, s) {
        if (s || !c.dragCurrent) {
            return
        }
        var t = Ext.dd.ScrollManager;
        if (!b || b != c.dragCurrent) {
            b = c.dragCurrent;
            t.refreshCache()
        }
        var u = Ext.lib.Event.getXY(p);
        var v = new Ext.lib.Point(u[0], u[1]);
        for (var n in f) {
            var o = f[n],
            m = o._region;
            var q = o.ddScrollConfig ? o.ddScrollConfig : t;
            if (m && m.contains(v) && o.isScrollable()) {
                if (m.bottom - v.y <= q.vthresh) {
                    if (i.el != o) {
                        g(o, "down")
                    }
                    return
                } else {
                    if (m.right - v.x <= q.hthresh) {
                        if (i.el != o) {
                            g(o, "left")
                        }
                        return
                    } else {
                        if (v.y - m.top <= q.vthresh) {
                            if (i.el != o) {
                                g(o, "up")
                            }
                            return
                        } else {
                            if (v.x - m.left <= q.hthresh) {
                                if (i.el != o) {
                                    g(o, "right")
                                }
                                return
                            }
                        }
                    }
                }
            }
        }
        a()
    };
    c.fireEvents = c.fireEvents.createSequence(l, c);
    c.stopDrag = c.stopDrag.createSequence(h, c);
    return {
        register: function (o) {
            if (Ext.isArray(o)) {
                for (var n = 0, m = o.length; n < m; n++) {
                    this.register(o[n])
                }
            } else {
                o = Ext.get(o);
                f[o.id] = o
            }
        },
        unregister: function (o) {
            if (Ext.isArray(o)) {
                for (var n = 0, m = o.length; n < m; n++) {
                    this.unregister(o[n])
                }
            } else {
                o = Ext.get(o);
                delete f[o.id]
            }
        },
        vthresh: 25,
        hthresh: 25,
        increment: 100,
        frequency: 500,
        animate: true,
        animDuration: 0.4,
        refreshCache: function () {
            for (var m in f) {
                if (typeof f[m] == "object") {
                    f[m]._region = f[m].getRegion()
                }
            }
        }
    }
}();
Ext.ensible.cal.StatusProxy = function (a) {
    Ext.apply(this, a);
    this.id = this.id || Ext.id();
    this.el = new Ext.Layer({
        dh: {
            id: this.id,
            cls: "ext-dd-drag-proxy x-dd-drag-proxy " + this.dropNotAllowed,
            cn: [{
                cls: "x-dd-drop-icon"
            }, {
                cls: "ext-dd-ghost-ct",
                cn: [{
                    cls: "x-dd-drag-ghost"
                }, {
                    cls: "ext-dd-msg"
                }]
            }]
        },
        shadow: !a || a.shadow !== false
    });
    this.ghost = Ext.get(this.el.dom.childNodes[1].childNodes[0]);
    this.message = Ext.get(this.el.dom.childNodes[1].childNodes[1]);
    this.dropStatus = this.dropNotAllowed
};
Ext.extend(Ext.ensible.cal.StatusProxy, Ext.dd.StatusProxy, {
    moveEventCls: "ext-cal-dd-move",
    addEventCls: "ext-cal-dd-add",
    update: function (a) {
        if (typeof a == "string") {
            this.ghost.update(a)
        } else {
            this.ghost.update("");
            a.style.margin = "0";
            this.ghost.dom.appendChild(a)
        }
        var b = this.ghost.dom.firstChild;
        if (b) {
            Ext.fly(b).setStyle("float", "none").setHeight("auto");
            Ext.getDom(b).id += "-ddproxy"
        }
    },
    updateMsg: function (a) {
        this.message.update(a)
    }
});
Ext.ensible.cal.DragZone = Ext.extend(Ext.dd.DragZone, {
    ddGroup: "CalendarDD",
    eventSelector: ".ext-cal-evt",
    constructor: function (b, a) {
        if (!Ext.ensible.cal._statusProxyInstance) {
            Ext.ensible.cal._statusProxyInstance = new Ext.ensible.cal.StatusProxy()
        }
        this.proxy = Ext.ensible.cal._statusProxyInstance;
        Ext.ensible.cal.DragZone.superclass.constructor.call(this, b, a)
    },
    getDragData: function (b) {
        var a = b.getTarget(this.eventSelector, 3);
        if (a) {
            var c = this.view.getEventRecordFromEl(a);
            return {
                type: "eventdrag",
                ddel: a,
                eventStart: c.get('StartDate'),
                eventEnd: c.get('EndDate'),
                proxy: this.proxy
            }
        }
        a = this.view.getDayAt(b.getPageX(), b.getPageY());
        if (a.el) {
            return {
                type: "caldrag",
                start: a.date,
                proxy: this.proxy
            }
        }
        return null
    },
    onInitDrag: function (a, e) {
        if (this.dragData.ddel) {
            var b = this.dragData.ddel.cloneNode(true),
            c = Ext.fly(b).child("dl");
            Ext.fly(b).setWidth("auto");
            if (c) {
                c.setHeight("auto")
            }
            this.proxy.update(b);
            this.onStartDrag(a, e)
        } else {
            if (this.dragData.start) {
                this.onStartDrag(a, e)
            }
        }
        this.view.onInitDrag();
        return true
    },
    afterRepair: function () {
        if (Ext.enableFx && this.dragData.ddel) {
            Ext.Element.fly(this.dragData.ddel).highlight(this.hlColor || "c3daf9")
        }
        this.dragging = false
    },
    getRepairXY: function (a) {
        if (this.dragData.ddel) {
            return Ext.Element.fly(this.dragData.ddel).getXY()
        }
    },
    afterInvalidDrop: function (a, b) {
        Ext.select(".ext-dd-shim").hide()
    },
    destroy: function () {
        Ext.ensible.cal.DragZone.superclass.destroy.call(this);
        delete Ext.ensible.cal._statusProxyInstance
    }
});
Ext.ensible.cal.DropZone = Ext.extend(Ext.dd.DropZone, {
    ddGroup: "CalendarDD",
    eventSelector: ".ext-cal-evt",
    dateRangeFormat: "{0}-{1}",
    dateFormat: "j/n",
    shims: [],
    getTargetFromEvent: function (b) {
        var a = this.dragOffset || 0,
        f = b.getPageY() - a,
        c = this.view.getDayAt(b.getPageX(), f);
        return c.el ? c : null
    },
    onNodeOver: function (f, l, k, h) {
        var a = Ext.ensible.Date,
        b = h.type == "eventdrag" ? f.date : a.min(h.start, f.date),
        g = h.type == "eventdrag" ? f.date.add(Date.DAY, a.diffDays(h.eventStart, h.eventEnd)) : a.max(h.start, f.date);
        if (!this.dragStartDate || !this.dragEndDate || (a.diffDays(b, this.dragStartDate) != 0) || (a.diffDays(g, this.dragEndDate) != 0)) {
            this.dragStartDate = b;
            this.dragEndDate = g.clearTime().add(Date.DAY, 1).add(Date.MILLI, -1);
            this.shim(b, g);
            var i = b.format(this.dateFormat);
            if (a.diffDays(b, g) > 0) {
                g = g.format(this.dateFormat);
                i = String.format(this.dateRangeFormat, i, g)
            }
            var c = String.format(h.type == "eventdrag" ? this.moveText : this.createText, i);
            h.proxy.updateMsg(c)
        }
        return this.dropAllowed
    },
    shim: function (a, f) {
        this.currWeek = -1;
        var b = a.clone(),
        g = 0,
        e, h, c = Ext.ensible.Date.diffDays(b, f) + 1;
        Ext.each(this.shims, function (i) {
            if (i) {
                i.isActive = false
            }
        });
        while (g++ < c) {
            var k = this.view.getDayEl(b);
            if (k) {
                var l = this.view.getWeekIndex(b),
                e = this.shims[l];
                if (!e) {
                    e = this.createShim();
                    this.shims[l] = e
                }
                if (l != this.currWeek) {
                    e.boxInfo = k.getBox();
                    this.currWeek = l
                } else {
                    h = k.getBox();
                    e.boxInfo.right = h.right;
                    e.boxInfo.width = h.right - e.boxInfo.x
                }
                e.isActive = true
            }
            b = b.add(Date.DAY, 1)
        }
        Ext.each(this.shims, function (i) {
            if (i) {
                if (i.isActive) {
                    i.show();
                    i.setBox(i.boxInfo)
                } else {
                    if (i.isVisible()) {
                        i.hide()
                    }
                }
            }
        })
    },
    createShim: function () {
        var a = this.view.ownerCalendarPanel ? this.view.ownerCalendarPanel : this.view;
        if (!this.shimCt) {
            this.shimCt = Ext.get("ext-dd-shim-ct-" + a.id);
            if (!this.shimCt) {
                this.shimCt = document.createElement("div");
                this.shimCt.id = "ext-dd-shim-ct-" + a.id;
                a.getEl().parent().appendChild(this.shimCt)
            }
        }
        var b = document.createElement("div");
        b.className = "ext-dd-shim";
        this.shimCt.appendChild(b);
        return new Ext.Layer({
            shadow: false,
            useDisplay: true,
            constrain: false
        }, b)
    },
    clearShims: function () {
        Ext.each(this.shims, function (a) {
            if (a) {
                a.hide()
            }
        })
    },
    onContainerOver: function (a, c, b) {
        return this.dropAllowed
    },
    onCalendarDragComplete: function () {
        delete this.dragStartDate;
        delete this.dragEndDate;
        this.clearShims()
    },
    onNodeDrop: function (h, a, f, c) {
        if (h && c) {
            if (c.type == "eventdrag") {
                var g = this.view.getEventRecordFromEl(c.ddel),
                b = Ext.ensible.Date.copyTime(g.get('StartDate'), h.date);
                this.view.onEventDrop(g, b);
                this.onCalendarDragComplete();
                return true
            }
            if (c.type == "caldrag") {
                this.view.onCalendarEndDrag(this.dragStartDate, this.dragEndDate, this.onCalendarDragComplete.createDelegate(this));
                return true
            }
        }
        this.onCalendarDragComplete();
        return false
    },
    onContainerDrop: function (a, c, b) {
        this.onCalendarDragComplete();
        return false
    }
});
Ext.ensible.cal.DayViewDragZone = Ext.extend(Ext.ensible.cal.DragZone, {
    ddGroup: "DayViewDD",
    resizeSelector: ".ext-evt-rsz",
    getDragData: function (c) {
        var a = c.getTarget(this.resizeSelector, 2, true);
        if (a) {
            var b = a.parent(this.eventSelector),
            f = this.view.getEventRecordFromEl(b);
            return {
                type: "eventresize",
                ddel: b.dom,
                eventStart: f.get('StartDate'),
                eventEnd: f.get('EndDate'),
                proxy: this.proxy
            }
        }
        var a = c.getTarget(this.eventSelector, 3);
        if (a) {
            var f = this.view.getEventRecordFromEl(a);
            return {
                type: "eventdrag",
                ddel: a,
                eventStart: f.get('StartDate'),
                eventEnd: f.get('EndDate'),
                proxy: this.proxy
            }
        }
        a = this.view.getDayAt(c.getPageX(), c.getPageY());
        if (a.el) {
            return {
                type: "caldrag",
                dayInfo: a,
                proxy: this.proxy
            }
        }
        return null
    }
});
Ext.ensible.cal.DayViewDropZone = Ext.extend(Ext.ensible.cal.DropZone, {
    ddGroup: "DayViewDD",
    dateRangeFormat: "{0}-{1}",
    dateFormat: "n/j",
    onNodeOver: function (c, m, l, h) {
        var b, o = this.createText,
        g = Ext.ensible.Date.use24HourTime ? "G:i" : "g:ia";
        if (h.type == "caldrag") {
            if (!this.dragStartMarker) {
                this.dragStartMarker = c.el.parent().createChild({
                    style: "position:absolute;"
                });
                this.dragStartMarker.setBox(c.timeBox);
                this.dragCreateDt = c.date
            }
            var k, i = this.dragStartMarker.getBox();
            i.height = Math.ceil(Math.abs(l.xy[1] - i.y) / c.timeBox.height) * c.timeBox.height;
            if (l.xy[1] < i.y) {
                i.height += c.timeBox.height;
                i.y = i.y - i.height + c.timeBox.height;
                k = this.dragCreateDt.add(Date.MINUTE, 30)
            } else {
                c.date = c.date.add(Date.MINUTE, 30)
            }
            this.shim(this.dragCreateDt, i);
            var r = Ext.ensible.Date.copyTime(c.date, this.dragCreateDt);
            this.dragStartDate = Ext.ensible.Date.min(this.dragCreateDt, r);
            this.dragEndDate = k || Ext.ensible.Date.max(this.dragCreateDt, r);
            b = String.format(this.dateRangeFormat, this.dragStartDate.format(g), this.dragEndDate.format(g))
        } else {
            var q = Ext.get(h.ddel),
            p = q.parent().parent(),
            i = q.getBox();
            i.width = p.getWidth();
            if (h.type == "eventdrag") {
                if (this.dragOffset === undefined) {
                    this.dragOffset = c.timeBox.y - i.y;
                    i.y = c.timeBox.y - this.dragOffset
                } else {
                    i.y = c.timeBox.y
                }
                b = c.date.format(this.dateFormat + " " + g);
                i.x = c.el.getLeft();
                this.shim(c.date, i);
                o = this.moveText
            }
            if (h.type == "eventresize") {
                if (!this.resizeDt) {
                    this.resizeDt = c.date
                }
                i.x = p.getLeft();
                i.height = Math.ceil(Math.abs(l.xy[1] - i.y) / c.timeBox.height) * c.timeBox.height;
                if (l.xy[1] < i.y) {
                    i.y -= i.height
                } else {
                    c.date = c.date.add(Date.MINUTE, 30)
                }
                this.shim(this.resizeDt, i);
                var r = Ext.ensible.Date.copyTime(c.date, this.resizeDt),
                a = Ext.ensible.Date.min(h.eventStart, r),
                f = Ext.ensible.Date.max(h.eventStart, r);
                h.resizeDates = {
                    StartDate: a,
                    EndDate: f
                };
                b = String.format(this.dateRangeFormat, a.format(g), f.format(g));
                o = this.resizeText
            }
        }
        h.proxy.updateMsg(String.format(o, b));
        return this.dropAllowed
    },
    shim: function (b, a) {
        Ext.each(this.shims, function (e) {
            if (e) {
                e.isActive = false;
                e.hide()
            }
        });
        var c = this.shims[0];
        if (!c) {
            c = this.createShim();
            this.shims[0] = c
        }
        c.isActive = true;
        c.show();
        c.setBox(a)
    },
    onNodeDrop: function (g, a, c, b) {
        if (g && b) {
            if (b.type == "eventdrag") {
                var f = this.view.getEventRecordFromEl(b.ddel);
                this.view.onEventDrop(f, g.date);
                this.onCalendarDragComplete();
                delete this.dragOffset;
                return true
            }
            if (b.type == "eventresize") {
                var f = this.view.getEventRecordFromEl(b.ddel);
                this.view.onEventResize(f, b.resizeDates);
                this.onCalendarDragComplete();
                delete this.resizeDt;
                return true
            }
            if (b.type == "caldrag") {
                Ext.destroy(this.dragStartMarker);
                delete this.dragStartMarker;
                delete this.dragCreateDt;
                this.view.onCalendarEndDrag(this.dragStartDate, this.dragEndDate, this.onCalendarDragComplete.createDelegate(this));
                return true
            }
        }
        this.onCalendarDragComplete();
        return false
    }
});
Ext.ensible.cal.EventStore = Ext.extend(Ext.data.Store, {
    constructor: function (a) {
        this.deferLoad = a.autoLoad;
        a.autoLoad = false;
        Ext.ensible.cal.EventStore.superclass.constructor.apply(this, arguments)
    },
    load: function (a) {
        Ext.ensible.log("store load");
        if (a.params) {
            delete this.initialParams
        }
        if (this.initialParams) {
            a = Ext.isObject(a) ? a : {};
            a.params = a.params || {};
            Ext.apply(a.params, this.initialParams);
            delete this.initialParams
        }
        Ext.ensible.cal.EventStore.superclass.load.call(this, a)
    }
});
Ext.reg("extensible.eventstore", Ext.ensible.cal.EventStore);
Ext.ensible.cal.EventMappings = {
    EventId: {
        name: "EventId",
        mapping: "id",
        type: "int"
    },
    CalendarId: {
        name: "CalendarId",
        mapping: "cid",
        type: "int"
    },
    Title: {
        name: "Title",
        mapping: "title",
        type: "string"
    },
    StartDate: {
        name: "StartDate",
        mapping: "start",
        type: "date",
        dateFormat: "c"
    },
    EndDate: {
        name: "EndDate",
        mapping: "end",
        type: "date",
        dateFormat: "c"
    },
    RRule: {
        name: "RecurRule",
        mapping: "recur_rule"
    },
    Location: {
        name: "Location",
        mapping: "loc",
        type: "string"
    },
    Notes: {
        name: "Notes",
        mapping: "notes",
        type: "string"
    },
    Url: {
        name: "Url",
        mapping: "url",
        type: "string"
    },
    IsAllDay: {
        name: "IsAllDay",
        mapping: "ad",
        type: "boolean"
    },
    Reminder: {
        name: "Reminder",
        mapping: "rem",
        type: "string"
    }
};
Ext.ensible.cal.CalendarMappings = {
    CalendarId: {
        name: "CalendarId",
        mapping: "id",
        type: "int"
    },
    Title: {
        name: "Title",
        mapping: "title",
        type: "string"
    },
    Description: {
        name: "Description",
        mapping: "desc",
        type: "string"
    },
    ColorId: {
        name: "ColorId",
        mapping: "color",
        type: "int"
    },
    CustomColor: {
        name: "CustomColor",
        mapping: "customcolor",
        type: "string"
    },
    IsHidden: {
        name: "IsHidden",
        mapping: "hidden",
        type: "boolean"
    }
};
Ext.ensible.cal.EventRecord = Ext.extend(Ext.data.Record, {
    fields: new Ext.util.MixedCollection(false, function (a) {
        return a.name
    })
});
Ext.ensible.cal.EventRecord.reconfigure = function () {
    var f = Ext.ensible.cal,
    g = Ext.ensible.cal.EventMappings,
    e = Ext.ensible.cal.EventRecord.prototype,
    b = [];
    for (prop in g) {
        if (g.hasOwnProperty(prop)) {
            b.push(g[prop])
        }
    }
    e.fields.clear();
    for (var c = 0, a = b.length; c < a; c++) {
        e.fields.add(new Ext.data.Field(b[c]))
    }
    return f.EventRecord
};
Ext.ensible.cal.EventRecord.reconfigure();
Ext.ensible.cal.CalendarRecord = Ext.extend(Ext.data.Record, {
    fields: new Ext.util.MixedCollection(false, function (a) {
        return a.name
    })
});
Ext.ensible.cal.CalendarRecord.reconfigure = function () {
    var f = Ext.ensible.cal,
    g = Ext.ensible.cal.CalendarMappings,
    e = Ext.ensible.cal.CalendarRecord.prototype,
    b = [];
    for (prop in g) {
        if (g.hasOwnProperty(prop)) {
            b.push(g[prop])
        }
    }
    e.fields.clear();
    for (var c = 0, a = b.length; c < a; c++) {
        e.fields.add(new Ext.data.Field(b[c]))
    }
    return f.CalendarRecord
};
Ext.ensible.cal.CalendarRecord.reconfigure();
Ext.ensible.cal.WeekEventRenderer = function () {
    var a = function (i, f, e) {
        var h = 1;
        var c, b = Ext.get(i + "-wk-" + f);
        if (b) {
            var g = b.child(".ext-cal-evt-tbl", true);
            c = g.tBodies[0].childNodes[e + h];
            if (!c) {
                c = Ext.DomHelper.append(g.tBodies[0], "<tr></tr>")
            }
        }
        return Ext.get(c)
    };
    return {
        render: function (n) {
            var g = 0,
            b = n.eventGrid,
            l = n.viewStart.clone(),
            m = n.tpl,
            r = n.maxEventsPerDay != undefined ? n.maxEventsPerDay : 999,
            t = n.weekCount < 1 ? 6 : n.weekCount,
            p = n.weekCount == 1 ? n.dayCount : 7;
            for (; g < t; g++) {
                if (!b[g] || b[g].length == 0) {
                    if (t == 1) {
                        f = a(n.id, g, 0);
                        var q = {
                            tag: "td",
                            cls: "ext-cal-ev",
                            id: n.id + "-empty-0-day-" + l.format("Ymd"),
                            html: "&#160;"
                        };
                        if (p > 1) {
                            q.colspan = p
                        }
                        Ext.DomHelper.append(f, q)
                    }
                    l = l.add(Date.DAY, 7)
                } else {
                    var f, y = 0,
                    c = b[g];
                    var A = l.clone();
                    var h = A.add(Date.DAY, p).add(Date.MILLI, -1);
                    for (; y < p; y++) {
                        if (c[y]) {
                            var x = emptyCells = skipped = 0,
                            s = c[y],
                            e = s.length,
                            k;
                            for (; x < e; x++) {
                                if (!s[x]) {
                                    emptyCells++;
                                    continue
                                }
                                if (emptyCells > 0 && x - emptyCells < r) {
                                    f = a(n.id, g, x - emptyCells);
                                    var q = {
                                        tag: "td",
                                        cls: "ext-cal-ev",
                                        id: n.id + "-empty-" + e + "-day-" + l.format("Ymd")
                                    };
                                    if (emptyCells > 1 && r - x > emptyCells) {
                                        q.rowspan = Math.min(emptyCells, r - x)
                                    }
                                    Ext.DomHelper.append(f, q);
                                    emptyCells = 0
                                }
                                if (x >= r) {
                                    skipped++;
                                    continue
                                }
                                k = s[x];
                                if (!k.isSpan || k.isSpanStart) {
                                    var v = k.data || k.event.data;
                                    v._weekIndex = g;
                                    v._renderAsAllDay = v[Ext.ensible.cal.EventMappings.IsAllDay.name] || k.isSpanStart;
                                    v.spanLeft = v[Ext.ensible.cal.EventMappings.StartDate.name].getTime() < A.getTime();
                                    v.spanRight = v[Ext.ensible.cal.EventMappings.EndDate.name].getTime() > h.getTime();
                                    v.spanCls = (v.spanLeft ? (v.spanRight ? "ext-cal-ev-spanboth" : "ext-cal-ev-spanleft") : (v.spanRight ? "ext-cal-ev-spanright" : ""));
                                    var f = a(n.id, g, x),
                                    q = {
                                        tag: "td",
                                        cls: "ext-cal-ev",
                                        cn: m.apply(n.templateDataFn(v))
                                    },
                                    i = Ext.ensible.Date.diffDays(l, v[Ext.ensible.cal.EventMappings.EndDate.name]) + 1,
                                    u = Math.min(i, p - y);
                                    if (u > 1) {
                                        q.colspan = u
                                    }
                                    Ext.DomHelper.append(f, q)
                                }
                            }
                            if (x > r) {
                                f = a(n.id, g, r);
                                Ext.DomHelper.append(f, {
                                    tag: "td",
                                    cls: "ext-cal-ev-more",
                                    id: "ext-cal-ev-more-" + l.format("Ymd"),
                                    cn: {
                                        tag: "a",
                                        html: String.format(n.moreText, skipped)
                                    }
                                })
                            }
                            if (e < n.evtMaxCount[g]) {
                                f = a(n.id, g, e);
                                if (f) {
                                    var q = {
                                        tag: "td",
                                        cls: "ext-cal-ev",
                                        id: n.id + "-empty-" + (e + 1) + "-day-" + l.format("Ymd")
                                    };
                                    var z = n.evtMaxCount[g] - e;
                                    if (z > 1) {
                                        q.rowspan = z
                                    }
                                    Ext.DomHelper.append(f, q)
                                }
                            }
                        } else {
                            f = a(n.id, g, 0);
                            if (f) {
                                var q = {
                                    tag: "td",
                                    cls: "ext-cal-ev",
                                    id: n.id + "-empty-day-" + l.format("Ymd")
                                };
                                if (n.evtMaxCount[g] > 1) {
                                    q.rowSpan = n.evtMaxCount[g]
                                }
                                Ext.DomHelper.append(f, q)
                            }
                        }
                        l = l.add(Date.DAY, 1)
                    }
                }
            }
        }
    }
}();



Ext.ensible.cal.CalendarView = Ext.extend(Ext.BoxComponent, {
    startDay: 0,
    spansHavePriority: false,
    trackMouseOver: true,
    enableFx: true,
    enableAddFx: true,
    enableUpdateFx: false,
    enableRemoveFx: true,
    enableDD: true,
    enableContextMenus: true,
    suppressBrowserContextMenu: false,
    monitorResize: true,
    todayText: "Today",
    ddCreateEventText: "Create event for {0}",
    ddMoveEventText: "Move event to {0}",
    ddResizeEventText: "Update event to {0}",
    defaultEventTitleText: "(No title)",
    dateParamFormat: "Y-m-d",
    editModal: false,
    weekCount: 1,
    dayCount: 1,
    eventSelector: ".ext-cal-evt",
    eventOverClass: "ext-evt-over",
    eventElIdDelimiter: "-evt-",
    dayElIdDelimiter: "-day-",
    getEventBodyMarkup: Ext.emptyFn,
    getEventTemplate: Ext.emptyFn,
    initComponent: function () {
        this.setStartDate(this.startDate || new Date());
        Ext.ensible.cal.CalendarView.superclass.initComponent.call(this);
        if (this.readOnly === true) {
            this.addClass("ext-cal-readonly")
        }
        this.addEvents({
            eventsrendered: true,
            eventclick: true,
            eventover: true,
            eventout: true,
            beforedatechange: true,
            datechange: true,
            rangeselect: true,
            beforeeventmove: true,
            eventmove: true,
            initdrag: true,
            dayover: true,
            dayout: true,
            editdetails: true,
            eventadd: true,
            eventupdate: true,
            eventcancel: true,
            beforeeventdelete: true,
            eventdelete: true
        })
    },
    afterRender: function () {
        Ext.ensible.cal.CalendarView.superclass.afterRender.call(this);
        this.renderTemplate();
        if (this.store) {
            this.saveRequired = !this.store.autoSave;
            this.setStore(this.store, true);
            if (this.store.deferLoad) {
                this.reloadStore(this.store.deferLoad);
                delete this.store.deferLoad
            } else {
                this.store.initialParams = this.getStoreParams()
            }
        }
        if (this.calendarStore) {
            this.setCalendarStore(this.calendarStore, true)
        }
        this.el.on({
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
            click: this.onClick,
            resize: this.onResize,
            scope: this
        });
        if (this.enableContextMenus && this.readOnly !== true) {
            this.el.on("contextmenu", this.onContextMenu, this)
        }
        this.el.unselectable();
        if (this.enableDD && this.readOnly !== true && this.initDD) {
            this.initDD()
        }
        this.on("eventsrendered", this.forceSize);
        this.forceSize.defer(100, this)
    },
    getStoreParams: function () {
        return {
            start: this.viewStart.format(this.dateParamFormat),
            end: this.viewEnd.format(this.dateParamFormat)
        }
    },
    reloadStore: function (a) {
        Ext.ensible.log("reloadStore");
        a = Ext.isObject(a) ? a : {};
        a.params = a.params || {};
        Ext.apply(a.params, this.getStoreParams());
        this.store.load(a)
    },
    forceSize: function () {
        if (this.el && this.el.child) {
            var e = this.el.child(".ext-cal-hd-ct"),
            b = this.el.child(".ext-cal-body-ct");
            if (b == null || e == null) {
                return
            }
            var a = e.getHeight(),
            c = this.el.parent().getSize();
            b.setHeight(c.height - a)
        }
    },
    refresh: function (a) {
        Ext.ensible.log("refresh (base), reload = " + a);
        if (a) {
            this.reloadStore()
        }
        this.prepareData();
        this.renderTemplate();
        this.renderItems()
    },
    getWeekCount: function () {
        var a = Ext.ensible.Date.diffDays(this.viewStart, this.viewEnd);
        return Math.ceil(a / this.dayCount)
    },
    prepareData: function () {
        var h = this.startDate.getLastDateOfMonth(),
        c = 0,
        g = 0,
        f = this.viewStart.clone(),
        e = this.weekCount < 1 ? 6 : this.weekCount;
        this.eventGrid = [
        []
        ];
        this.allDayGrid = [
        []
        ];
        this.evtMaxCount = [];
        var b = this.store.queryBy(function (i) {
            return this.isEventVisible(i.data)
        }, this);
        for (; c < e; c++) {
            this.evtMaxCount[c] = 0;
            if (this.weekCount == -1 && f > h) {
                break
            }
            this.eventGrid[c] = this.eventGrid[c] || [];
            this.allDayGrid[c] = this.allDayGrid[c] || [];
            for (d = 0; d < this.dayCount; d++) {
                if (b.getCount() > 0) {
                    var a = b.filterBy(function (l) {
                        var k = (f.getTime() == l.get('StartDate').clearTime(true).getTime());
                        var i = (c == 0 && d == 0 && (f > l.get('StartDate')));
                        return k || i
                    }, this);
                    this.sortEventRecordsForDay(a);
                    this.prepareEventGrid(a, c, d)
                }
                f = f.add(Date.DAY, 1)
            }
        }
        this.currentWeekCount = c
    },
    prepareEventGrid: function (c, b, g) {
        var f = 0,
        e = this.viewStart.clone(),
        a = this.maxEventsPerDay ? this.maxEventsPerDay : 999;
        c.each(function (i) {
            var k = Ext.ensible.cal.EventMappings;
            if (Ext.ensible.Date.diffDays(i.data[k.StartDate.name], i.data[k.EndDate.name]) > 0) {
                var h = Ext.ensible.Date.diffDays(Ext.ensible.Date.max(this.viewStart, i.data[k.StartDate.name]), Ext.ensible.Date.min(this.viewEnd, i.data[k.EndDate.name])) + 1;
                this.prepareEventGridSpans(i, this.eventGrid, b, g, h);
                this.prepareEventGridSpans(i, this.allDayGrid, b, g, h, true)
            } else {
                f = this.findEmptyRowIndex(b, g);
                this.eventGrid[b][g] = this.eventGrid[b][g] || [];
                this.eventGrid[b][g][f] = i;
                if (i.data[k.IsAllDay.name]) {
                    f = this.findEmptyRowIndex(b, g, true);
                    this.allDayGrid[b][g] = this.allDayGrid[b][g] || [];
                    this.allDayGrid[b][g][f] = i
                }
            }
            if (this.evtMaxCount[b] < this.eventGrid[b][g].length) {
                this.evtMaxCount[b] = Math.min(a + 1, this.eventGrid[b][g].length)
            }
            return true
        }, this)
    },
    prepareEventGridSpans: function (i, a, h, g, k, l) {
        var f = h,
        b = g,
        m = this.findEmptyRowIndex(h, g, l),
        e = this.viewStart.clone();
        var c = {
            event: i,
            isSpan: true,
            isSpanStart: true,
            spanLeft: false,
            spanRight: (g == 6)
        };
        a[h][g] = a[h][g] || [];
        a[h][g][m] = c;
        while (--k) {
            e = e.add(Date.DAY, 1);
            if (e > this.viewEnd) {
                break
            }
            if (++b > 6) {
                b = 0;
                f++;
                m = this.findEmptyRowIndex(f, 0)
            }
            a[f] = a[f] || [];
            a[f][b] = a[f][b] || [];
            a[f][b][m] = {
                event: i,
                isSpan: true,
                isSpanStart: (b == 0),
                spanLeft: (f > h) && (b % 7 == 0),
                spanRight: (b == 6) && (k > 1)
            }
        }
    },
    findEmptyRowIndex: function (b, h, a) {
        var f = a ? this.allDayGrid : this.eventGrid,
        c = f[b] ? f[b][h] || [] : [],
        e = 0,
        g = c.length;
        for (; e < g; e++) {
            if (c[e] == null) {
                return e
            }
        }
        return g
    },
    renderTemplate: function () {
        if (this.tpl) {
            this.tpl.overwrite(this.el, this.getParams());
            this.lastRenderStart = this.viewStart.clone();
            this.lastRenderEnd = this.viewEnd.clone()
        }
    },
    disableStoreEvents: function () {
        this.monitorStoreEvents = false
    },
    enableStoreEvents: function (a) {
        this.monitorStoreEvents = true;
        if (a === true) {
            this.refresh()
        }
    },
    onResize: function () {
        this.refresh(false)
    },
    onInitDrag: function () {
        this.fireEvent("initdrag", this)
    },
    onEventDrop: function (b, a) {
        this.moveEvent(b, a)
    },
    onCalendarEndDrag: function (e, a, c) {
        this.dragPending = true;
        var b = {};
        b[Ext.ensible.cal.EventMappings.StartDate.name] = e;
        b[Ext.ensible.cal.EventMappings.EndDate.name] = a;
        this.onRangeSelect(b, null, this.onCalendarEndDragComplete.createDelegate(this, [c]))
    },
    onCalendarEndDragComplete: function (a) {
        a();
        this.dragPending = false
    },
    onUpdate: function (b, c, a) {
        if (this.hidden === true || this.monitorStoreEvents === false) {
            return
        }
        if (a == Ext.data.Record.COMMIT) {
            Ext.ensible.log("onUpdate");
            //            this.dismissEventEditor();
            this.refresh(c.get('RRule') != "");
            if (this.enableFx && this.enableUpdateFx) {
                this.doUpdateFx(this.getEventEls(c.get('EventId')), {
                    scope: this
                })
            }
        }
    },
    doUpdateFx: function (a, b) {
        this.highlightEvent(a, null, b)
    },
    onAdd: function (c, a, b) {
        if (this.hidden === true || this.monitorStoreEvents === false || a[0].phantom) {
            return
        }
        if (a[0]._deleting) {
            delete a[0]._deleting;
            return
        }
        Ext.ensible.log("onAdd");
        var e = a[0],
        f = e.get('RRule');
        //        this.dismissEventEditor();
        this.tempEventId = e.id;
        this.refresh(f !== undefined && f !== "");
        if (this.enableFx && this.enableAddFx) {
            this.doAddFx(this.getEventEls(e.get('EventId')), {
                scope: this
            })
        }
    },
    doAddFx: function (a, b) {
        a.fadeIn(Ext.apply(b, {
            duration: 2
        }))
    },
    onRemove: function (b, c) {
        if (this.hidden === true || this.monitorStoreEvents === false) {
            return
        }
        Ext.ensible.log("onRemove");
        //        this.dismissEventEditor();
        var e = c.get('RRule'),
        a = e !== undefined && e !== "";
        if (this.enableFx && this.enableRemoveFx) {
            this.doRemoveFx(this.getEventEls(c.get('EventId')), {
                remove: true,
                scope: this,
                callback: this.refresh.createDelegate(this, [a])
            })
        } else {
            this.getEventEls(c.get('EventId')).remove();
            this.refresh(a)
        }
    },
    doRemoveFx: function (a, b) {
        if (a.getCount() == 0 && Ext.isFunction(b.callback)) {
            b.callback.call(b.scope || this)
        } else {
            a.fadeOut(b)
        }
    },
    highlightEvent: function (b, a, e) {
        if (this.enableFx) {
            var f;
            !(Ext.isIE || Ext.isOpera) ? b.highlight(a, e) : b.each(function (c) {
                c.highlight(a, Ext.applyIf({
                    attr: "color"
                }, e));
                if (f = c.child(".ext-cal-evm")) {
                    f.highlight(a, e)
                }
            }, this)
        }
    },
    getEventIdFromEl: function (c) {
        c = Ext.get(c);
        var e, f = "",
        a, b = c.dom.className.split(" ");
        Ext.each(b, function (g) {
            e = g.split(this.eventElIdDelimiter);
            if (e.length > 1) {
                f = e[1];
                return false
            }
        }, this);
        return f
    },
    getEventId: function (a) {
        if (a === undefined && this.tempEventId) {
            a = this.tempEventId
        }
        return a
    },
    getEventSelectorCls: function (b, a) {
        var c = a ? "." : "";
        return c + this.id + this.eventElIdDelimiter + this.getEventId(b)
    },
    getEventEls: function (b) {
        var a = this.el.select(this.getEventSelectorCls(this.getEventId(b), true), false);
        return new Ext.CompositeElement(a)
    },
    isToday: function () {
        var a = new Date().clearTime().getTime();
        return this.viewStart.getTime() <= a && this.viewEnd.getTime() >= a
    },
    onDataChanged: function (a) {
        Ext.ensible.log("onDataChanged");
        this.refresh()
    },
    isEventVisible: function (i) {
        var f = Ext.ensible.cal.EventMappings,
        e = i.data ? i.data : i,
        h = e[f.CalendarId.name],
        b = this.calendarStore ? this.calendarStore.getById(h) : null;
        if (b && b.get('IsHidden') === true) {
            return false
        }
        var a = this.viewStart.getTime(),
        c = this.viewEnd.getTime(),
        k = e[f.StartDate.name].getTime(),
        g = e[f.EndDate.name].add(Date.SECOND, -1).getTime();
        return Ext.ensible.Date.rangesOverlap(a, c, k, g)
    },
    isOverlapping: function (m, l) {
        var k = m.data ? m.data : m,
        i = l.data ? l.data : l,
        f = Ext.ensible.cal.EventMappings,
        c = k[f.StartDate.name].getTime(),
        g = k[f.EndDate.name].add(Date.SECOND, -1).getTime(),
        b = i[f.StartDate.name].getTime(),
        e = i[f.EndDate.name].add(Date.SECOND, -1).getTime(),
        h = Ext.ensible.Date.diff(k[f.StartDate.name], i[f.StartDate.name], "m");
        if (g < c) {
            g = c
        }
        if (e < b) {
            e = b
        }
        var n = Ext.ensible.Date.rangesOverlap(c, g, b, e),
        a = (h > -30 && h < 30);
        return (n || a)
    },
    getDayEl: function (a) {
        return Ext.get(this.getDayId(a))
    },
    getDayId: function (a) {
        if (Ext.isDate(a)) {
            a = a.format("Ymd")
        }
        return this.id + this.dayElIdDelimiter + a
    },
    getStartDate: function () {
        return this.startDate
    },
    setStartDate: function (b, a) {
        Ext.ensible.log("setStartDate (base) " + b.format("Y-m-d"));
        if (this.fireEvent("beforedatechange", this, this.startDate, b, this.viewStart, this.viewEnd) !== false) {
            this.startDate = b.clearTime();
            this.setViewBounds(b);
            if (this.rendered) {
                if (a === true) {
                    this.reloadStore()
                }
                this.refresh()
            }
            this.fireEvent("datechange", this, this.startDate, this.viewStart, this.viewEnd)
        }
    },
    setViewBounds: function (a) {
        var e = a || this.startDate,
        c = e.getDay() - this.startDay;
        switch (this.weekCount) {
            case 0:
            case 1:
                this.viewStart = this.dayCount < 7 && !this.startDayIsStatic ? e : e.add(Date.DAY, -c).clearTime(true);
                this.viewEnd = this.viewStart.add(Date.DAY, this.dayCount || 7).add(Date.SECOND, -1);
                return;
            case -1:
                e = e.getFirstDateOfMonth();
                c = e.getDay() - this.startDay;
                if (c < 0) {
                    c += 7
                }
                this.viewStart = e.add(Date.DAY, -c).clearTime(true);
                var b = e.add(Date.MONTH, 1).add(Date.SECOND, -1);
                c = this.startDay;
                if (c > b.getDay()) {
                    c -= 7
                }
                this.viewEnd = b.add(Date.DAY, 6 - b.getDay() + c);
                return;
            default:
                this.viewStart = e.add(Date.DAY, -c).clearTime(true);
                this.viewEnd = this.viewStart.add(Date.DAY, this.weekCount * 7).add(Date.SECOND, -1)
        }
    },
    getViewBounds: function () {
        return {
            start: this.viewStart,
            end: this.viewEnd
        }
    },
    sortEventRecordsForDay: function (a) {
        if (a.length < 2) {
            return
        }
        a.sort("ASC", function (g, f) {
            var e = g.data,
            c = f.data,
            i = Ext.ensible.cal.EventMappings;
            if (e[i.IsAllDay.name]) {
                return -1
            } else {
                if (c[i.IsAllDay.name]) {
                    return 1
                }
            }
            if (this.spansHavePriority) {
                var h = Ext.ensible.Date.diffDays;
                if (h(e[i.StartDate.name], e[i.EndDate.name]) > 0) {
                    if (h(c[i.StartDate.name], c[i.EndDate.name]) > 0) {
                        if (e[i.StartDate.name].getTime() == c[i.StartDate.name].getTime()) {
                            return c[i.EndDate.name].getTime() - e[i.EndDate.name].getTime()
                        }
                        return e[i.StartDate.name].getTime() - c[i.StartDate.name].getTime()
                    }
                    return -1
                } else {
                    if (h(c[i.StartDate.name], c[i.EndDate.name]) > 0) {
                        return 1
                    }
                }
                return e[i.StartDate.name].getTime() - c[i.StartDate.name].getTime()
            } else {
                return e[i.StartDate.name].getTime() - c[i.StartDate.name].getTime()
            }
        }.createDelegate(this))
    },
    moveTo: function (b, a) {
        if (Ext.isDate(b)) {
            this.setStartDate(b, a);
            return this.startDate
        }
        return b
    },
    moveNext: function (a) {
        return this.moveTo(this.viewEnd.add(Date.DAY, 1), a)
    },
    movePrev: function (a) {
        var b = Ext.ensible.Date.diffDays(this.viewStart, this.viewEnd) + 1;
        return this.moveDays(-b, a)
    },
    moveMonths: function (b, a) {
        return this.moveTo(this.startDate.add(Date.MONTH, b), a)
    },
    moveWeeks: function (b, a) {
        return this.moveTo(this.startDate.add(Date.DAY, b * 7), a)
    },
    moveDays: function (b, a) {
        return this.moveTo(this.startDate.add(Date.DAY, b), a)
    },
    moveToday: function (a) {
        return this.moveTo(new Date(), a)
    },
    setStore: function (a, b) {
        var c = this.store;
        if (!b && c) {
            c.un("datachanged", this.onDataChanged, this);
            c.un("add", this.onAdd, this);
            c.un("remove", this.onRemove, this);
            c.un("update", this.onUpdate, this);
            c.un("clear", this.refresh, this);
            c.un("save", this.onSave, this);
            c.un("exception", this.onException, this)
        }
        if (a) {
            a.on("datachanged", this.onDataChanged, this);
            a.on("add", this.onAdd, this);
            a.on("remove", this.onRemove, this);
            a.on("update", this.onUpdate, this);
            a.on("clear", this.refresh, this);
            a.on("save", this.onSave, this);
            a.on("exception", this.onException, this)
        }
        this.store = a
    },
    onException: function (c, e, f, g, b, a) {
        if (a.reject) {
            a.reject()
        }
    },
    setCalendarStore: function (a, b) {
        if (!b && this.calendarStore) {
            this.calendarStore.un("datachanged", this.refresh, this);
            this.calendarStore.un("add", this.refresh, this);
            this.calendarStore.un("remove", this.refresh, this);
            this.calendarStore.un("update", this.refresh, this)
        }
        if (a) {
            a.on("datachanged", this.refresh, this);
            a.on("add", this.refresh, this);
            a.on("remove", this.refresh, this);
            a.on("update", this.refresh, this)
        }
        this.calendarStore = a
    },
    getEventRecord: function (b) {
        var a = this.store.find(Ext.ensible.cal.EventMappings.EventId.name, b);
        return this.store.getAt(a)
    },
    getEventRecordFromEl: function (a) {
        return this.getEventRecord(this.getEventIdFromEl(a))
    },
    getParams: function () {
        return {
            viewStart: this.viewStart,
            viewEnd: this.viewEnd,
            startDate: this.startDate,
            dayCount: this.dayCount,
            weekCount: this.weekCount
        }
    },
    save: function () {
        if (this.saveRequired) {
            this.store.save()
        }
    },
    onSave: function (a, b, c) {
        Ext.ensible.log("onSave")
    },
    onEventAdd: function (a, b) {
        this.store.add(b);
        this.fireEvent("eventadd", this, b)
    },
    onEventUpdate: function (a, b) {
        this.save();
        this.fireEvent("eventupdate", this, b)
    },
    onEventDelete: function (a, b) {
        this.store.remove(b);
        this.fireEvent("eventdelete", this, b)
    },
    onEventCancel: function (a, b) {
        this.fireEvent("eventcancel", this, b)
    },
    onDayClick: function (c, b, a) {
        if (this.readOnly === true) {
            return
        }
        if (this.fireEvent("dayclick", this, c, b, a) !== false) {
            var f = Ext.ensible.cal.EventMappings,
            e = {};
            e[f.StartDate.name] = c;
            e[f.IsAllDay.name] = b;
        //            this.showEventEditor(e, a)
        }
    },
    onRangeSelect: function (c, a, b) {
        if (this.fireEvent("rangeselect", this, c, a, b) !== false) {
        //            this.showEventEditor(c, a);
        //            this.editWin.on("hide", b, this, {
        //                single: true
        //            })
        }
    },
    showEventMenu: function (a, b) {
        if (!this.eventMenu) {
            this.eventMenu = new Ext.ensible.cal.EventContextMenu({
                listeners: {
                    editdetails: this.onEditDetails.createDelegate(this),
                    eventdelete: this.onDeleteEvent.createDelegate(this),
                    eventmove: this.onMoveEvent.createDelegate(this)
                }
            })
        }
        this.eventMenu.showForEvent(this.getEventRecordFromEl(a), a, b);
        this.menuActive = true
    },
    onEditDetails: function (c, b, a) {
        this.fireEvent("editdetails", this, b, a);
        this.menuActive = false
    },
    onMoveEvent: function (c, b, a) {
        this.moveEvent(b, a);
        this.menuActive = false
    },
    moveEvent: function (c, a) {
        if (Ext.ensible.Date.compare(c.get('StartDate'), a) === 0) {
            return
        }
        if (this.fireEvent("beforeeventmove", this, c, a) !== false) {
            var b = a.getTime() - c.get('StartDate').getTime();
            c.beginEdit();
            c.set(Ext.ensible.cal.EventMappings.StartDate.name, a);
            c.set(Ext.ensible.cal.EventMappings.EndDate.name, c.get('EndDate').add(Date.MILLI, b));
            c.endEdit();
            this.save();
            this.fireEvent("eventmove", this, c)
        }
    },
    onDeleteEvent: function (c, b, a) {
        b._deleting = true;
        this.deleteEvent(b, a);
        this.menuActive = false
    },
    deleteEvent: function (b, a) {
        if (this.fireEvent("beforeeventdelete", this, b, a) !== false) {
            this.store.remove(b);
            this.fireEvent("eventdelete", this, b, a)
        }
    },
    onContextMenu: function (f, b) {
        var c, a = false;
        if (c = f.getTarget(this.eventSelector, 5, true)) {
            //            this.dismissEventEditor().showEventMenu(c, f.getXY());
            a = true
        }
        if (a || this.suppressBrowserContextMenu === true) {
            f.preventDefault()
        }
    },
    onClick: function (c, a) {
        if (this.readOnly === true) {
            return true
        }
        if (this.dropZone) {
            this.dropZone.clearShims()
        }
        if (this.menuActive === true) {
            this.menuActive = false;
            return true
        }
        var b = c.getTarget(this.eventSelector, 5);
        if (b) {
            var g = this.getEventIdFromEl(b),
            f = this.getEventRecord(g);
            if (this.fireEvent("eventclick", this, f, b) !== false) {
            //                this.showEventEditor(f, b)
            }
            return true
        }
    },
    onMouseOver: function (b, a) {
        if (this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)) {
            if (!this.handleEventMouseEvent(b, a, "over")) {
                this.handleDayMouseEvent(b, a, "over")
            }
        }
    },
    onMouseOut: function (b, a) {
        if (this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)) {
            if (!this.handleEventMouseEvent(b, a, "out")) {
                this.handleDayMouseEvent(b, a, "out")
            }
        }
    },
    handleEventMouseEvent: function (h, c, g) {
        var f;
        if (f = h.getTarget(this.eventSelector, 5, true)) {
            var a = Ext.get(h.getRelatedTarget());
            if (f == a || f.contains(a)) {
                return true
            }
            var i = this.getEventIdFromEl(f);
            if (this.eventOverClass != "") {
                var b = this.getEventEls(i);
                b[g == "over" ? "addClass" : "removeClass"](this.eventOverClass)
            }
            this.fireEvent("event" + g, this, this.getEventRecord(i), f);
            return true
        }
        return false
    },
    getDateFromId: function (c, b) {
        var a = c.split(b);
        return a[a.length - 1]
    },
    handleDayMouseEvent: function (k, f, h) {
        if (f = k.getTarget("td", 3)) {
            if (f.id && f.id.indexOf(this.dayElIdDelimiter) > -1) {
                var i = this.getDateFromId(f.id, this.dayElIdDelimiter),
                a = Ext.get(k.getRelatedTarget()),
                c, b;
                if (a) {
                    c = a.is("td") ? a : a.up("td", 3);
                    b = c && c.id ? this.getDateFromId(c.id, this.dayElIdDelimiter) : ""
                }
                if (!a || i != b) {
                    var g = this.getDayEl(i);
                    if (g && this.dayOverClass != "") {
                        g[h == "over" ? "addClass" : "removeClass"](this.dayOverClass)
                    }
                    this.fireEvent("day" + h, this, Date.parseDate(i, "Ymd"), g)
                }
            }
        }
    },
    renderItems: function () {
        throw "This method must be implemented by a subclass"
    },
    destroy: function () {
        Ext.ensible.cal.CalendarView.superclass.destroy.call(this);
        Ext.destroy(this.editWin, this.eventMenu, this.dragZone, this.dropZone)
    }
});





Ext.ensible.cal.MonthView = Ext.extend(Ext.ensible.cal.CalendarView, {
    moreText: "+{0} more...",
    detailsTitleDateFormat: "F j",
    showTime: true,
    showTodayText: true,
    showHeader: false,
    showWeekLinks: false,
    showWeekNumbers: false,
    weekLinkOverClass: "ext-week-link-over",
    daySelector: ".ext-cal-day",
    moreSelector: ".ext-cal-ev-more",
    weekLinkSelector: ".ext-cal-week-link",
    weekCount: -1,
    dayCount: 7,
    moreElIdDelimiter: "-more-",
    weekLinkIdDelimiter: "ext-cal-week-",
    initComponent: function () {
        Ext.ensible.cal.MonthView.superclass.initComponent.call(this);
        this.addEvents({
            dayclick: true,
            weekclick: true,
            dayover: true,
            dayout: true
        })
    },
    initDD: function () {
        var a = {
            view: this,
            createText: this.ddCreateEventText,
            moveText: this.ddMoveEventText,
            ddGroup: this.ddGroup || this.id + "-MonthViewDD"
        };
        this.dragZone = new Ext.ensible.cal.DragZone(this.el, a);
        this.dropZone = new Ext.ensible.cal.DropZone(this.el, a)
    },
    onDestroy: function () {
        Ext.destroy(this.ddSelector);
        Ext.destroy(this.dragZone);
        Ext.destroy(this.dropZone);
        Ext.ensible.cal.MonthView.superclass.onDestroy.call(this)
    },
    afterRender: function () {
        if (!this.tpl) {
            this.tpl = new Ext.ensible.cal.MonthViewTemplate({
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime,
                showHeader: this.showHeader,
                showWeekLinks: this.showWeekLinks,
                showWeekNumbers: this.showWeekNumbers
            })
        }
        this.tpl.compile();
        this.addClass("ext-cal-monthview ext-cal-ct");
        Ext.ensible.cal.MonthView.superclass.afterRender.call(this)
    },
    onResize: function () {
        if (this.monitorResize) {
            this.maxEventsPerDay = this.getMaxEventsPerDay();
            this.refresh()
        }
    },
    forceSize: function () {
        if (this.showWeekLinks && this.el && this.el.child) {
            var f = this.el.select(".ext-cal-hd-days-tbl"),
            e = this.el.select(".ext-cal-bg-tbl"),
            c = this.el.select(".ext-cal-evt-tbl"),
            b = this.el.child(".ext-cal-week-link").getWidth(),
            a = this.el.getWidth() - b;
            f.setWidth(a);
            e.setWidth(a);
            c.setWidth(a)
        }
        Ext.ensible.cal.MonthView.superclass.forceSize.call(this)
    },
    initClock: function () {
        if (Ext.fly(this.id + "-clock") !== null) {
            this.prevClockDay = new Date().getDay();
            if (this.clockTask) {
                Ext.TaskMgr.stop(this.clockTask)
            }
            this.clockTask = Ext.TaskMgr.start({
                run: function () {
                    var b = Ext.fly(this.id + "-clock"),
                    a = new Date();
                    if (a.getDay() == this.prevClockDay) {
                        if (b) {
                            b.update(a.format(Ext.ensible.Date.use24HourTime ? "G:i" : "g:ia"))
                        }
                    } else {
                        this.prevClockDay = a.getDay();
                        this.moveTo(a)
                    }
                },
                scope: this,
                interval: 1000
            })
        }
    },
    getEventBodyMarkup: function () {
        if (!this.eventBodyMarkup) {
            this.eventBodyMarkup = ["{Title}", '<tpl if="_isReminder">', '<i class="ext-cal-ic ext-cal-ic-rem">&#160;</i>', "</tpl>", '<tpl if="_isRecurring">', '<i class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>', "</tpl>", '<tpl if="spanLeft">', '<i class="ext-cal-spl">&#160;</i>', "</tpl>", '<tpl if="spanRight">', '<i class="ext-cal-spr">&#160;</i>', "</tpl>"].join("")
        }
        return this.eventBodyMarkup
    },
    getEventTemplate: function () {
        if (!this.eventTpl) {
            var b, a = this.getEventBodyMarkup();
            b = !(Ext.isIE || Ext.isOpera) ? new Ext.XTemplate('<div class="{_selectorCls} {_colorCls} {values.spanCls} ext-cal-evt ext-cal-evr">', a, "</div>") : new Ext.XTemplate('<tpl if="_renderAsAllDay">', '<div class="{_selectorCls} {values.spanCls} {_colorCls} ext-cal-evt ext-cal-evo">', '<div class="ext-cal-evm">', '<div class="ext-cal-evi">', "</tpl>", '<tpl if="!_renderAsAllDay">', '<div class="{_selectorCls} {_colorCls} ext-cal-evt ext-cal-evr">', "</tpl>", a, '<tpl if="_renderAsAllDay">', "</div>", "</div>", "</tpl>", "</div>");
            b.compile();
            this.eventTpl = b
        }
        return this.eventTpl
    },
    getTemplateEventData: function (c) {
        var i = Ext.ensible.cal.EventMappings,
        a = this.getEventSelectorCls(c[i.EventId.name]),
        h = c[i.RRule.name] != "",
        g = c[i.Title.name],
        e = "x-cal-default",
        b = Ext.ensible.Date.use24HourTime ? "G:i " : "g:ia ";
        if (this.calendarStore && c[i.CalendarId.name]) {
            var f = this.calendarStore.getById(c[i.CalendarId.name]);
            if(f){
                e = "x-cal-" + f.get('ColorId');
                updateRule(e, f.get('CustomColor'));
            }
        }
        return Ext.applyIf({
            _selectorCls: a,
            _colorCls: e + (c._renderAsAllDay ? "-ad" : ""),
            _isRecurring: c.Recurrence && c.Recurrence != "",
            _isReminder: c[i.Reminder.name] && c[i.Reminder.name] != "",
            Title: (c[i.IsAllDay.name] ? "" : c[i.StartDate.name].format(b)) + (!g || g.length == 0 ? this.defaultEventTitleText : g)
        }, c)
    },
    refresh: function (a) {
        Ext.ensible.log("refresh (MonthView)");
        if (this.detailPanel) {
            this.detailPanel.hide()
        }
        Ext.ensible.cal.MonthView.superclass.refresh.call(this, a);
        if (this.showTime !== false) {
            this.initClock()
        }
    },
    renderItems: function () {
        Ext.ensible.cal.WeekEventRenderer.render({
            eventGrid: this.allDayOnly ? this.allDayGrid : this.eventGrid,
            viewStart: this.viewStart,
            tpl: this.getEventTemplate(),
            maxEventsPerDay: this.maxEventsPerDay,
            id: this.id,
            templateDataFn: this.getTemplateEventData.createDelegate(this),
            evtMaxCount: this.evtMaxCount,
            weekCount: this.weekCount,
            dayCount: this.dayCount,
            moreText: this.moreText
        });
        this.fireEvent("eventsrendered", this)
    },
    getDayEl: function (a) {
        return Ext.get(this.getDayId(a))
    },
    getDayId: function (a) {
        if (Ext.isDate(a)) {
            a = a.format("Ymd")
        }
        return this.id + this.dayElIdDelimiter + a
    },
    getWeekIndex: function (b) {
        var a = this.getDayEl(b).up(".ext-cal-wk-ct");
        return parseInt(a.id.split("-wk-")[1])
    },
    getDaySize: function (f) {
        var c = this.el.getBox(),
        a = c.width / this.dayCount,
        b = c.height / this.getWeekCount();
        if (f) {
            var e = this.el.select(".ext-cal-dtitle").last().parent("tr");
            b = e ? b - e.getHeight(true) : b
        }
        return {
            height: b,
            width: a
        }
    },
    getEventHeight: function () {
        if (!this.eventHeight) {
            var a = this.el.select(".ext-cal-evt").first();
            this.eventHeight = a ? a.parent("tr").getHeight() : 18
        }
        return this.eventHeight
    },
    getMaxEventsPerDay: function () {
        var b = this.getDaySize(true).height,
        c = this.getEventHeight(),
        a = Math.max(Math.floor((b - c) / c), 0);
        return a
    },
    getDayAt: function (a, i) {
        var f = this.el.getBox(),
        b = this.getDaySize(),
        c = Math.floor(((a - f.x) / b.width)),
        g = Math.floor(((i - f.y) / b.height)),
        h = (g * 7) + c;
        var e = this.viewStart.add(Date.DAY, h);
        return {
            date: e,
            el: this.getDayEl(e)
        }
    },
    moveNext: function () {
        return this.moveMonths(1, true)
    },
    movePrev: function () {
        return this.moveMonths(-1, true)
    },
    onInitDrag: function () {
        Ext.ensible.cal.MonthView.superclass.onInitDrag.call(this);
        Ext.select(this.daySelector).removeClass(this.dayOverClass);
        if (this.detailPanel) {
            this.detailPanel.hide()
        }
    },
    onMoreClick: function (a) {
        if (!this.detailPanel) {
            this.detailPanel = new Ext.Panel({
                id: this.id + "-details-panel",
                title: a.format(this.detailsTitleDateFormat),
                layout: "fit",
                floating: true,
                renderTo: Ext.getBody(),
                tools: [{
                    id: "close",
                    handler: function (f, b, c) {
                        c.hide()
                    }
                }],
                items: {
                    xtype: "extensible.monthdaydetailview",
                    id: this.id + "-details-view",
                    date: a,
                    view: this,
                    store: this.store,
                    listeners: {
                        eventsrendered: this.onDetailViewUpdated.createDelegate(this)
                    }
                }
            })
        } else {
            this.detailPanel.setTitle(a.format(this.detailsTitleDateFormat))
        }
        this.detailPanel.getComponent(this.id + "-details-view").update(a)
    },
    onDetailViewUpdated: function (h, c, i) {
        var b = this.detailPanel,
        f = b.getFrameHeight(),
        k = this.getEventHeight(),
        a = f + (i * k) + 3,
        g = this.getDayEl(c),
        e = g.getBox();
        b.setHeight(a);
        b.setWidth(Math.max(e.width, 220));
        b.show();
        b.getPositionEl().alignTo(g, "t-t?")
    },
    onHide: function () {
        Ext.ensible.cal.MonthView.superclass.onHide.call(this);
        if (this.detailPanel) {
            this.detailPanel.hide()
        }
    },
    onClick: function (f, a) {
        if (this.detailPanel) {
            this.detailPanel.hide()
        }
        if (el = f.getTarget(this.moreSelector, 3)) {
            var b = el.id.split(this.moreElIdDelimiter)[1];
            this.onMoreClick(Date.parseDate(b, "Ymd"));
            return
        }
        if (el = f.getTarget(this.weekLinkSelector, 3)) {
            var b = el.id.split(this.weekLinkIdDelimiter)[1];
            this.fireEvent("weekclick", this, Date.parseDate(b, "Ymd"));
            return
        }
        if (Ext.ensible.cal.MonthView.superclass.onClick.apply(this, arguments)) {
            return
        }
        if (el = f.getTarget("td", 3)) {
            if (el.id && el.id.indexOf(this.dayElIdDelimiter) > -1) {
                var c = el.id.split(this.dayElIdDelimiter),
                b = c[c.length - 1];
                this.onDayClick(Date.parseDate(b, "Ymd"), false, Ext.get(this.getDayId(b)));
                return
            }
        }
    },
    handleDayMouseEvent: function (f, a, c) {
        var b = f.getTarget(this.weekLinkSelector, 3, true);
        if (b) {
            b[c == "over" ? "addClass" : "removeClass"](this.weekLinkOverClass);
            return
        }
        Ext.ensible.cal.MonthView.superclass.handleDayMouseEvent.apply(this, arguments)
    }
});
Ext.reg("extensible.monthview", Ext.ensible.cal.MonthView);

Ext.ensible.cal.DayHeaderView = Ext.extend(Ext.ensible.cal.MonthView, {
    weekCount: 1,
    dayCount: 1,
    allDayOnly: true,
    monitorResize: false,
    afterRender: function () {
        if (!this.tpl) {
            this.tpl = new Ext.ensible.cal.DayHeaderTemplate({
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            })
        }
        this.tpl.compile();
        this.addClass("ext-cal-day-header");
        Ext.ensible.cal.DayHeaderView.superclass.afterRender.call(this)
    },
    forceSize: Ext.emptyFn,
    refresh: function (a) {
        Ext.ensible.log("refresh (DayHeaderView)");
        Ext.ensible.cal.DayHeaderView.superclass.refresh.call(this, a);
        this.recalcHeaderBox()
    },
    recalcHeaderBox: function () {
        var b = this.el.child(".ext-cal-evt-tbl"),
        a = b.getHeight();
        this.el.setHeight(a + 7);
        if (Ext.isIE && Ext.isStrict) {
            this.el.child(".ext-cal-hd-ad-inner").setHeight(a + 4)
        }
        if (Ext.isOpera) {}
    },
    moveNext: function () {
        this.moveDays(this.dayCount)
    },
    movePrev: function () {
        this.moveDays(-this.dayCount)
    },
    onClick: function (f, a) {
        if (el = f.getTarget("td", 3)) {
            if (el.id && el.id.indexOf(this.dayElIdDelimiter) > -1) {
                var c = el.id.split(this.dayElIdDelimiter),
                b = c[c.length - 1];
                this.onDayClick(Date.parseDate(b, "Ymd"), true, Ext.get(this.getDayId(b, true)));
                return
            }
        }
        Ext.ensible.cal.DayHeaderView.superclass.onClick.apply(this, arguments)
    }
});
Ext.reg("extensible.dayheaderview", Ext.ensible.cal.DayHeaderView);

Ext.ensible.cal.DayBodyView = Ext.extend(Ext.ensible.cal.CalendarView, {
    enableEventResize: true,
    dayColumnElIdDelimiter: "-day-col-",
    initComponent: function () {
        Ext.ensible.cal.DayBodyView.superclass.initComponent.call(this);
        if (this.readOnly === true) {
            this.enableEventResize = false
        }
        this.addEvents({
            beforeeventresize: true,
            eventresize: true,
            dayclick: true
        })
    },
    initDD: function () {
        var a = {
            createText: this.ddCreateEventText,
            moveText: this.ddMoveEventText,
            resizeText: this.ddResizeEventText
        };
        this.el.ddScrollConfig = {
            vthresh: Ext.isIE || Ext.isOpera ? 100 : 40,
            hthresh: -1,
            frequency: 50,
            increment: 100,
            ddGroup: this.ddGroup || this.id + "-DayViewDD"
        };
        this.dragZone = new Ext.ensible.cal.DayViewDragZone(this.el, Ext.apply({
            view: this,
            containerScroll: true
        }, a));
        this.dropZone = new Ext.ensible.cal.DayViewDropZone(this.el, Ext.apply({
            view: this
        }, a))
    },
    refresh: function (a) {
        Ext.ensible.log("refresh (DayBodyView)");
        var b = this.el.getScroll().top;
        Ext.ensible.cal.DayBodyView.superclass.refresh.call(this, a);
        if (this.scrollReady) {
            this.scrollTo(b)
        }
    },
    scrollTo: function (b, a) {
        a = a || (Ext.isIE || Ext.isOpera);
        if (a) {
            (function () {
                this.el.scrollTo("top", b);
                this.scrollReady = true
            }).defer(10, this)
        } else {
            this.el.scrollTo("top", b);
            this.scrollReady = true
        }
    },
    afterRender: function () {
        if (!this.tpl) {
            this.tpl = new Ext.ensible.cal.DayBodyTemplate({
                id: this.id,
                dayCount: this.dayCount,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            })
        }
        this.tpl.compile();
        this.addClass("ext-cal-body-ct");
        Ext.ensible.cal.DayBodyView.superclass.afterRender.call(this);
        this.scrollTo(7 * 42)
    },
    forceSize: Ext.emptyFn,
    onEventResize: function (e, b) {
        if (this.fireEvent("beforeeventresize", this, e) !== false) {
            var c = Ext.ensible.Date,
            f = Ext.ensible.cal.EventMappings.StartDate.name,
            a = Ext.ensible.cal.EventMappings.EndDate.name;
            if (c.compare(e.data[f], b.StartDate) === 0 && c.compare(e.data[a], b.EndDate) === 0) {
                return
            }
            e.set(f, b.StartDate);
            e.set(a, b.EndDate);
            this.onEventUpdate(null, e);
            this.fireEvent("eventresize", this, e)
        }
    },
    getEventBodyMarkup: function () {
        if (!this.eventBodyMarkup) {
            this.eventBodyMarkup = ["{Title}", '<tpl if="_isReminder">', '<i class="ext-cal-ic ext-cal-ic-rem">&#160;</i>', "</tpl>", '<tpl if="_isRecurring">', '<i class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>', "</tpl>"].join("")
        }
        return this.eventBodyMarkup
    },
    getEventTemplate: function () {
        if (!this.eventTpl) {
            this.eventTpl = !(Ext.isIE || Ext.isOpera) ? new Ext.XTemplate('<div id="{_elId}" class="{_selectorCls} {_colorCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">', '<div class="ext-evt-bd">', this.getEventBodyMarkup(), "</div>", this.enableEventResize ? '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&#160;</div></div>' : "", "</div>") : new Ext.XTemplate('<div id="{_elId}" class="ext-cal-evt {_selectorCls} {_colorCls}-x" style="left: {_left}%; width: {_width}%; top: {_top}px;">', '<div class="ext-cal-evb">&#160;</div>', '<dl style="height: {_height}px;" class="ext-cal-evdm">', '<dd class="ext-evt-bd">', this.getEventBodyMarkup(), "</dd>", this.enableEventResize ? '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&#160;</div></div>' : "", "</dl>", '<div class="ext-cal-evb">&#160;</div>', "</div>");
            this.eventTpl.compile()
        }
        return this.eventTpl
    },
    getEventAllDayTemplate: function () {
        if (!this.eventAllDayTpl) {
            var b, a = this.getEventBodyMarkup();
            b = !(Ext.isIE || Ext.isOpera) ? new Ext.XTemplate('<div class="{_selectorCls} {_colorCls} {values.spanCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">', a, "</div>") : new Ext.XTemplate('<div class="ext-cal-evt" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">', '<div class="{_selectorCls} {values.spanCls} {_colorCls} ext-cal-evo">', '<div class="ext-cal-evm">', '<div class="ext-cal-evi">', a, "</div>", "</div>", "</div></div>");
            b.compile();
            this.eventAllDayTpl = b
        }
        return this.eventAllDayTpl
    },
    getTemplateEventData: function (k) {
        var h = Ext.ensible.cal.EventMappings,
        e = this.getEventSelectorCls(k[h.EventId.name]),
        g = {},
        c = k[h.RRule.name] != "";
        this.getTemplateEventBox(k);
        g._selectorCls = e;
        var a = "x-cal-default";
        if (this.calendarStore && k[h.CalendarId.name]) {
            var f = this.calendarStore.getById(k[h.CalendarId.name]);
            if(f){
                a = "x-cal-" + f.get('ColorId');
                updateRule(a, f.get('CustomColor'));
            }
        }
        g._colorCls = a + (k._renderAsAllDay ? "-ad" : "");
        g._isRecurring = k.Recurrence && k.Recurrence != "";
        g._isReminder = k[h.Reminder.name] && k[h.Reminder.name] != "";
        var i = k[h.Title.name],
        b = Ext.ensible.Date.use24HourTime ? "G:i " : "g:ia ";
        g.Title = (k[h.IsAllDay.name] ? "" : k[h.StartDate.name].format(b)) + (!i || i.length == 0 ? this.defaultEventTitleText : i);
        return Ext.applyIf(g, k)
    },
    getTemplateEventBox: function (c) {
        var g = 0.7,
        h = c[Ext.ensible.cal.EventMappings.StartDate.name],
        b = c[Ext.ensible.cal.EventMappings.EndDate.name],
        f = h.getHours() * 60 + h.getMinutes(),
        a = b.getHours() * 60 + b.getMinutes(),
        e = a - f;
        c._left = 0;
        c._width = 100;
        c._top = Math.round(f * g) + 1;
        c._height = Math.max((e * g) - 2, 15)
    },
    renderItems: function () {
        var p = 0,
        u = [];
        for (; p < this.dayCount; p++) {
            var o = emptyCells = skipped = 0,
            n = this.eventGrid[0][p],
            k = n ? n.length : 0,
            r;
            for (; o < k; o++) {
                r = n[o];
                if (!r) {
                    continue
                }
                var t = r.data || r.event.data;
                if (t._renderAsAllDay) {
                    continue
                }
                Ext.apply(t, {
                    cls: "ext-cal-ev",
                    _positioned: true
                });
                u.push({
                    data: this.getTemplateEventData(t),
                    date: this.viewStart.add(Date.DAY, p)
                })
            }
        }
        var h = j = 0,
        c = [],
        e = u.length,
        a;
        for (; h < e; h++) {
            var r = u[h].data,
            q = null,
            b = r[Ext.ensible.cal.EventMappings.StartDate.name].getDate();
            for (j = 0; j < e; j++) {
                if (h == j) {
                    continue
                }
                q = u[j].data;
                if (this.isOverlapping(r, q)) {
                    r._overlap = r._overlap == undefined ? 1 : r._overlap + 1;
                    if (h < j) {
                        if (r._overcol === undefined) {
                            r._overcol = 0
                        }
                        q._overcol = r._overcol + 1;
                        c[b] = c[b] ? Math.max(c[b], q._overcol) : q._overcol
                    }
                }
            }
        }
        for (h = 0; h < e; h++) {
            var r = u[h].data,
            b = r[Ext.ensible.cal.EventMappings.StartDate.name].getDate();
            if (r._overlap !== undefined) {
                var g = 100 / (c[b] + 1),
                f = 100 - (g * r._overlap);
                r._width = g;
                r._left = g * r._overcol
            }
            var s = this.getEventTemplate().apply(r),
            m = this.id + "-day-col-" + u[h].date.format("Ymd");
            Ext.DomHelper.append(m, s)
        }
        this.fireEvent("eventsrendered", this)
    },
    getDayEl: function (a) {
        return Ext.get(this.getDayId(a))
    },
    getDayId: function (a) {
        if (Ext.isDate(a)) {
            a = a.format("Ymd")
        }
        return this.id + this.dayColumnElIdDelimiter + a
    },
    getDaySize: function () {
        var a = this.el.child(".ext-cal-day-col-inner").getBox();
        return {
            height: a.height,
            width: a.width
        }
    },
    getDayAt: function (o, k) {
        var f = ".ext-cal-body-ct",
        h = this.el.child(".ext-cal-day-times").getWidth(),
        s = this.el.getBox(),
        n = this.getDaySize(false),
        p = o - s.x - h,
        a = Math.floor(p / n.width),
        m = this.el.getScroll(),
        r = this.el.child(".ext-cal-bg-row"),
        q = r.getHeight() / 2,
        l = k - s.y - q + m.top,
        i = Math.max(0, Math.ceil(l / q)),
        b = i * 30,
        e = this.viewStart.add(Date.DAY, a).add(Date.MINUTE, b),
        c = this.getDayEl(e),
        g = o;
        if (c) {
            g = c.getLeft()
        }
        return {
            date: e,
            el: c,
            timeBox: {
                x: g,
                y: (i * 21) + s.y - m.top,
                width: n.width,
                height: q
            }
        }
    },
    onClick: function (g, b) {
        if (this.dragPending || Ext.ensible.cal.DayBodyView.superclass.onClick.apply(this, arguments)) {
            return
        }
        if (g.getTarget(".ext-cal-day-times", 3) !== null) {
            return
        }
        var c = g.getTarget("td", 3);
        if (c) {
            if (c.id && c.id.indexOf(this.dayElIdDelimiter) > -1) {
                var f = this.getDateFromId(c.id, this.dayElIdDelimiter);
                this.onDayClick(Date.parseDate(f, "Ymd"), true, Ext.get(this.getDayId(f)));
                return
            }
        }
        var a = this.getDayAt(g.xy[0], g.xy[1]);
        if (a && a.date) {
            this.onDayClick(a.date, false, null)
        }
    }
});
Ext.reg("extensible.daybodyview", Ext.ensible.cal.DayBodyView);

Ext.ensible.cal.DayView = Ext.extend(Ext.Container, {
    ddCreateEventText: Ext.ensible.cal.CalendarView.prototype.ddCreateEventText,
    ddMoveEventText: Ext.ensible.cal.CalendarView.prototype.ddMoveEventText,
    showTime: true,
    showTodayText: true,
    dayCount: 1,
    enableEventResize: true,
    initComponent: function () {
        this.dayCount = this.dayCount > 7 ? 7 : (this.dayCount < 1 ? 1 : this.dayCount);
        var b = Ext.apply({}, this.initialConfig);
        b.showTime = this.showTime;
        b.showTodayText = this.showTodayText;
        b.todayText = this.todayText;
        b.dayCount = this.dayCount;
        b.weekCount = 1;
        b.readOnly = this.readOnly;
        var c = Ext.applyIf({
            xtype: "extensible.dayheaderview",
            id: this.id + "-hd",
            ownerCalendarPanel: this.ownerCalendarPanel
        }, b);
        var a = Ext.applyIf({
            xtype: "extensible.daybodyview",
            enableEventResize: this.enableEventResize,
            id: this.id + "-bd",
            ownerCalendarPanel: this.ownerCalendarPanel
        }, b);
        this.items = [c, a];
        this.addClass("ext-cal-dayview ext-cal-ct");
        Ext.ensible.cal.DayView.superclass.initComponent.call(this)
    },
    afterRender: function () {
        Ext.ensible.cal.DayView.superclass.afterRender.call(this);
        this.header = Ext.getCmp(this.id + "-hd");
        this.body = Ext.getCmp(this.id + "-bd");
        this.body.on("eventsrendered", this.forceSize, this)
    },
    refresh: function () {
        Ext.ensible.log("refresh (DayView)");
        this.header.refresh();
        this.body.refresh()
    },
    forceSize: function () {
        (function () {
            var a = this.el.up(".x-panel-body"),
            c = this.el.child(".ext-cal-day-header"),
            b = a.getHeight() - c.getHeight();
            this.el.child(".ext-cal-body-ct").setHeight(b - 1)
        }).defer(10, this)
    },
    onResize: function () {
        this.forceSize()
    },
    doHide: function () {
        this.header.doHide.apply(this, arguments);
        this.body.doHide.apply(this, arguments)
    },
    getViewBounds: function () {
        return this.header.getViewBounds()
    },
    getStartDate: function () {
        return this.header.getStartDate()
    },
    setStartDate: function (a) {
        this.header.setStartDate(a, true);
        this.body.setStartDate(a)
    },
    renderItems: function () {
        this.header.renderItems();
        this.body.renderItems()
    },
    isToday: function () {
        return this.header.isToday()
    },
    moveTo: function (a) {
        this.header.moveTo(a);
        return this.body.moveTo(a, true)
    },
    moveNext: function () {
        this.header.moveNext();
        return this.body.moveNext(true)
    },
    movePrev: function (a) {
        this.header.movePrev();
        return this.body.movePrev(true)
    },
    moveDays: function (a) {
        this.header.moveDays(a);
        return this.body.moveDays(a, true)
    },
    moveToday: function () {
        this.header.moveToday();
        return this.body.moveToday(true)
    }
});
Ext.reg("extensible.dayview", Ext.ensible.cal.DayView);

Ext.ensible.cal.MultiDayView = Ext.extend(Ext.ensible.cal.DayView, {
    dayCount: 3,
    startDayIsStatic: false,
    moveNext: function (a) {
        return this.moveDays(this.startDayIsStatic ? 7 : this.dayCount, a)
    },
    movePrev: function (a) {
        return this.moveDays(this.startDayIsStatic ? -7 : -this.dayCount, a)
    }
});
Ext.reg("extensible.multidayview", Ext.ensible.cal.MultiDayView);

Ext.ensible.cal.WeekView = Ext.extend(Ext.ensible.cal.DayView, {
    dayCount: 7
});
Ext.reg("extensible.weekview", Ext.ensible.cal.WeekView);

Ext.ensible.cal.MultiWeekView = Ext.extend(Ext.ensible.cal.MonthView, {
    weekCount: 2,
    moveNext: function () {
        return this.moveWeeks(this.weekCount, true)
    },
    movePrev: function () {
        return this.moveWeeks(-this.weekCount, true)
    }
});
Ext.reg("extensible.multiweekview", Ext.ensible.cal.MultiWeekView);

Ext.ensible.cal.MonthDayDetailView = Ext.extend(Ext.BoxComponent, {
    initComponent: function () {
        Ext.ensible.cal.CalendarView.superclass.initComponent.call(this);
        this.addEvents({
            eventsrendered: true
        });
        if (!this.el) {
            this.el = document.createElement("div")
        }
    },
    afterRender: function () {
        this.tpl = this.getTemplate();
        Ext.ensible.cal.MonthDayDetailView.superclass.afterRender.call(this);
        this.el.on({
            click: this.view.onClick,
            mouseover: this.view.onMouseOver,
            mouseout: this.view.onMouseOut,
            scope: this.view
        })
    },
    getTemplate: function () {
        if (!this.tpl) {
            this.tpl = new Ext.XTemplate('<div class="ext-cal-mdv x-unselectable">', '<table class="ext-cal-mvd-tbl" cellpadding="0" cellspacing="0">', "<tbody>", '<tpl for=".">', '<tr><td class="ext-cal-ev">{markup}</td></tr>', "</tpl>", "</tbody>", "</table>", "</div>")
        }
        this.tpl.compile();
        return this.tpl
    },
    update: function (a) {
        this.date = a;
        this.refresh()
    },
    refresh: function () {
        if (!this.rendered) {
            return
        }
        var a = this.view.getEventTemplate(),
        b = [];
        evts = this.store.queryBy(function (i) {
            var f = this.date.clearTime(true).getTime(),
            e = i.get('StartDate').clearTime(true).getTime(),
            g = (f == e),
            h = false;
            if (!g) {
                var c = i.get('EndDate').clearTime(true).getTime();
                h = e < f && c >= f
            }
            return g || h
        }, this);
        Ext.ensible.cal.CalendarView.prototype.sortEventRecordsForDay.call(this, evts);
        evts.each(function (c) {
            var e = c.data,
            f = Ext.ensible.cal.EventMappings;
            e._renderAsAllDay = e[f.IsAllDay.name] || Ext.ensible.Date.diffDays(e[f.StartDate.name], e[f.EndDate.name]) > 0;
            e.spanLeft = Ext.ensible.Date.diffDays(e[f.StartDate.name], this.date) > 0;
            e.spanRight = Ext.ensible.Date.diffDays(this.date, e[f.EndDate.name]) > 0;
            e.spanCls = (e.spanLeft ? (e.spanRight ? "ext-cal-ev-spanboth" : "ext-cal-ev-spanleft") : (e.spanRight ? "ext-cal-ev-spanright" : ""));
            b.push({
                markup: a.apply(this.getTemplateEventData(e))
            })
        }, this);
        this.tpl.overwrite(this.el, b);
        this.fireEvent("eventsrendered", this, this.date, evts.getCount())
    },
    getTemplateEventData: function (a) {
        var b = this.view.getTemplateEventData(a);
        b._elId = "dtl-" + b._elId;
        return b
    }
});
Ext.reg("extensible.monthdaydetailview", Ext.ensible.cal.MonthDayDetailView);

Ext.ensible.cal.CalendarPanel = Ext.extend(Ext.Panel, {
    enableRecurrence: false,
    showDayView: true,
    showMultiDayView: false,
    showWeekView: true,
    showMultiWeekView: true,
    showMonthView: true,
    showNavBar: true,
    todayText: "Today",
    showTodayText: true,
    showTime: true,
    readOnly: false,
    showNavToday: true,
    showNavJump: true,
    showNavNextPrev: true,
    jumpToText: "Jump to:",
    goText: "Go",
    dayText: "Day",
    multiDayText: "{0} Days",
    weekText: "Week",
    multiWeekText: "{0} Weeks",
    monthText: "Month",
    editModal: false,
    layoutConfig: {
        layoutOnCardChange: true,
        deferredRender: true
    },
    startDate: new Date(),
    initComponent: function () {
        this.tbar = {
            cls: "ext-cal-toolbar",
            border: true,
            items: []
        };
        this.tbar.items.push({
            id: this.id + "-tb-feed"
        })
        this.viewCount = 0;
        if (this.showNavToday) {
            this.tbar.items.push({
                id: this.id + "-tb-today",
                text: this.todayText,
                handler: this.onTodayClick,
                scope: this
            })
        }
        if (this.showNavNextPrev) {
            this.tbar.items.push([{
                id: this.id + "-tb-prev",
                handler: this.onPrevClick,
                scope: this,
                iconCls: "x-tbar-page-prev"
            }, {
                id: this.id + "-tb-next",
                handler: this.onNextClick,
                scope: this,
                iconCls: "x-tbar-page-next"
            }])
        }
        if (this.showNavJump) {
            this.tbar.items.push([this.jumpToText,
            {
                id: this.id + "-tb-jump-dt",
                xtype: "datefield",
                showToday: false
            }, {
                id: this.id + "-tb-jump",
                text: this.goText,
                handler: this.onJumpClick,
                scope: this
            }])
        }
        this.tbar.items.push("->");
        if (this.showDayView) {
            this.tbar.items.push({
                id: this.id + "-tb-day",
                text: this.dayText,
                handler: this.onDayNavClick,
                scope: this,
                toggleGroup: this.id + "-tb-views"
            });
            this.viewCount++
        }
        if (this.showMultiDayView) {
            var i = String.format(this.multiDayText, (this.multiDayViewCfg && this.multiDayViewCfg.dayCount) || 3);
            this.tbar.items.push({
                id: this.id + "-tb-multiday",
                text: i,
                handler: this.onMultiDayNavClick,
                scope: this,
                toggleGroup: this.id + "-tb-views"
            });
            this.viewCount++
        }
        if (this.showWeekView) {
            this.tbar.items.push({
                id: this.id + "-tb-week",
                text: this.weekText,
                handler: this.onWeekNavClick,
                scope: this,
                toggleGroup: this.id + "-tb-views"
            });
            this.viewCount++
        }
        if (this.showMultiWeekView) {
            var i = String.format(this.multiWeekText, (this.multiWeekViewCfg && this.multiWeekViewCfg.weekCount) || 2);
            this.tbar.items.push({
                id: this.id + "-tb-multiweek",
                text: i,
                handler: this.onMultiWeekNavClick,
                scope: this,
                toggleGroup: this.id + "-tb-views"
            });
            this.viewCount++
        }
        if (this.showMonthView || this.viewCount == 0) {
            this.tbar.items.push({
                id: this.id + "-tb-month",
                text: this.monthText,
                handler: this.onMonthNavClick,
                scope: this,
                toggleGroup: this.id + "-tb-views"
            });
            this.viewCount++;
            this.showMonthView = true
        }
        var a = this.viewCount - 1;
        this.activeItem = this.activeItem === undefined ? a : (this.activeItem > a ? a : this.activeItem);
        if (this.showNavBar === false) {
            delete this.tbar;
            this.addClass("x-calendar-nonav")
        }
        Ext.ensible.cal.CalendarPanel.superclass.initComponent.call(this);
        this.addEvents({
            eventadd: true,
            eventupdate: true,
            beforeeventdelete: true,
            eventdelete: true,
            eventcancel: true,
            viewchange: true,
            editdetails: true
        });
        this.layout = "card";
        this.addClass("x-cal-panel");
        if (this.eventStore) {
            this.store = this.eventStore;
            delete this.eventStore
        }
        this.setStore(this.store);
        var f = {
            showToday: this.showToday,
            todayText: this.todayText,
            showTodayText: this.showTodayText,
            showTime: this.showTime,
            readOnly: this.readOnly,
            enableRecurrence: this.enableRecurrence,
            store: this.store,
            calendarStore: this.calendarStore,
            editModal: this.editModal,
            ownerCalendarPanel: this
        };
        if (this.showDayView) {
            var c = Ext.apply({
                xtype: "extensible.dayview",
                title: this.dayText
            }, f);
            c = Ext.apply(Ext.apply(c, this.viewConfig), this.dayViewCfg);
            c.id = this.id + "-day";
            this.initEventRelay(c);
            this.add(c)
        }
        if (this.showMultiDayView) {
            var e = Ext.apply({
                xtype: "extensible.multidayview",
                title: this.multiDayText
            }, f);
            e = Ext.apply(Ext.apply(e, this.viewConfig), this.multiDayViewCfg);
            e.id = this.id + "-multiday";
            this.initEventRelay(e);
            this.add(e)
        }
        if (this.showWeekView) {
            var h = Ext.applyIf({
                xtype: "extensible.weekview",
                title: this.weekText
            }, f);
            h = Ext.apply(Ext.apply(h, this.viewConfig), this.weekViewCfg);
            h.id = this.id + "-week";
            this.initEventRelay(h);
            this.add(h)
        }
        if (this.showMultiWeekView) {
            var b = Ext.applyIf({
                xtype: "extensible.multiweekview",
                title: this.multiWeekText
            }, f);
            b = Ext.apply(Ext.apply(b, this.viewConfig), this.multiWeekViewCfg);
            b.id = this.id + "-multiweek";
            this.initEventRelay(b);
            this.add(b)
        }
        if (this.showMonthView) {
            var g = Ext.applyIf({
                xtype: "extensible.monthview",
                title: this.monthText,
                listeners: {
                    weekclick: {
                        fn: function (l, k) {
                            this.showWeek(k)
                        },
                        scope: this
                    }
                }
            }, f);
            g = Ext.apply(Ext.apply(g, this.viewConfig), this.monthViewCfg);
            g.id = this.id + "-month";
            this.initEventRelay(g);
            this.add(g)
        }
    },
    initEventRelay: function (a) {
        a.listeners = a.listeners || {};
        a.listeners.afterrender = {
            fn: function (b) {
                this.relayEvents(b, ["eventsrendered", "eventclick", "dayclick", "eventover", "eventout", "beforedatechange", "datechange", "rangeselect", "beforeeventmove", "eventmove", "initdrag", "dayover", "dayout", "beforeeventresize", "eventresize", "eventadd", "eventupdate", "eventdelete", "eventcancel"]);
                b.on("editdetails", this.onEditDetails, this)
            },
            scope: this,
            single: true
        }
    },
    afterRender: function () {
        Ext.ensible.cal.CalendarPanel.superclass.afterRender.call(this);
        this.body.addClass("x-cal-body");
        this.fireViewChange();
        this.layout.activeItem.refresh()
    },
    onLayout: function () {
        Ext.ensible.cal.CalendarPanel.superclass.onLayout.call(this);
        if (!this.navInitComplete) {
            this.updateNavState();
            this.navInitComplete = true
        }
    },
    setStore: function (a, b) {
        var c = this.store;
        if (!b && c) {
            c.un("add", this.onStoreAdd, this);
            c.un("remove", this.onStoreRemove, this);
            c.un("update", this.onStoreUpdate, this)
        }
        if (a) {
            a.on("add", this.onStoreAdd, this);
            a.on("remove", this.onStoreRemove, this);
            a.on("update", this.onStoreUpdate, this)
        }
        this.store = a
    },
    onStoreAdd: function (c, a, b) {
        if (a[0].phantom) {
            return
        }
        if (a[0]._deleting) {
            delete a[0]._deleting;
            return
        }
    },
    onStoreUpdate: function (b, c, a) {
        
    },
    onStoreRemove: function (a, b) {
        
    },
    onEditDetails: function (b, c, a) {
        if (this.fireEvent("editdetails", this, b, c, a) !== false) {
            
        }
    },
    onEventAdd: function (a, b) {
        this.store.add(b);
        this.fireEvent("eventadd", this, b)
    },
    onEventUpdate: function (a, b) {
        if (!this.store.autoSave) {
            this.store.save()
        }
        this.fireEvent("eventupdate", this, b)
    },
    onEventDelete: function (a, b) {
        b._deleting = true;
        this.store.remove(b);
        this.fireEvent("eventdelete", this, b)
    },
    onEventCancel: function (a, b) {
        this.fireEvent("eventcancel", this, b)
    },
    setActiveView: function (c) {
        var b = this.layout,
        a = this.getTopToolbar();
        b.setActiveItem(c);
        if (c == this.id + "-edit") {
            if (a) {
                a.hide()
            }
            this.doLayout()
        } else {
            b.activeItem.setStartDate(this.startDate, true);
            if (a) {
                a.show()
            }
            this.updateNavState()
        }
        this.activeView = b.activeItem;
        this.fireViewChange()
    },
    fireViewChange: function () {
        var c = null,
        a = this.layout.activeItem;
        if (a.getViewBounds) {
            var b = a.getViewBounds(),
            c = {
                activeDate: a.getStartDate(),
                viewStart: b.start,
                viewEnd: b.end
            }
        }
        //        if (a.dismissEventEditor) {
        //            a.dismissEventEditor()
        //        }
        this.fireEvent("viewchange", this, a, c)
    },
    updateNavState: function () {
        if (this.showNavBar !== false) {
            var b = this.layout.activeItem,
            c = b.id.split(this.id + "-")[1];
            if (this.showNavToday) {
                Ext.getCmp(this.id + "-tb-today").setDisabled(b.isToday())
            }
            var a = Ext.getCmp(this.id + "-tb-" + c);
            a.toggle(true)
        }
    },
    setStartDate: function (a) {
        Ext.ensible.log("setStartDate (CalendarPanel");
        this.startDate = a;
        this.layout.activeItem.setStartDate(a, true);
        this.updateNavState();
        this.fireViewChange();
        return this
    },
    showWeek: function (a) {
        this.setActiveView(this.id + "-week");
        this.setStartDate(a)
    },
    onTodayClick: function () {
        this.startDate = this.layout.activeItem.moveToday(true);
        this.updateNavState();
        this.fireViewChange()
    },
    onJumpClick: function () {
        var a = Ext.getCmp(this.id + "-tb-jump-dt").getValue();
        if (a !== "") {
            this.startDate = this.layout.activeItem.moveTo(a, true);
            this.updateNavState();
            this.fireViewChange()
        }
    },
    onPrevClick: function () {
        this.startDate = this.layout.activeItem.movePrev(true);
        this.updateNavState();
        this.fireViewChange()
    },
    onNextClick: function () {
        this.startDate = this.layout.activeItem.moveNext(true);
        this.updateNavState();
        this.fireViewChange()
    },
    onDayNavClick: function () {
        this.setActiveView(this.id + "-day")
    },
    onMultiDayNavClick: function () {
        this.setActiveView(this.id + "-multiday")
    },
    onWeekNavClick: function () {
        this.setActiveView(this.id + "-week")
    },
    onMultiWeekNavClick: function () {
        this.setActiveView(this.id + "-multiweek")
    },
    onMonthNavClick: function () {
        this.setActiveView(this.id + "-month")
    },
    getActiveView: function () {
        return this.layout.activeItem
    }
});
Ext.reg("extensible.calendarpanel", Ext.ensible.cal.CalendarPanel);