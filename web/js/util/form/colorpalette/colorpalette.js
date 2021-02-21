Ext.ns("Ext.SgArqBase");

Ext.SgArqBase.ColorPalette = Ext.extend(Ext.ColorPalette, {
    colorCount: 32,
    initComponent: function () {
        Ext.SgArqBase.ColorPalette.superclass.initComponent.call(this);
        this.addClass("x-calendar-palette");
        this.tpl = new Ext.XTemplate('<tpl for="."><a class="x-unselectable x-cal-color" id="' + this.id + '-color-{.}" href="#" hidefocus="on"><em><span class="x-cal-{.}">&#160;</span></em></a></tpl>');
        if (this.handler) {
            this.on("select", this.handler, this.scope || this)
        }
        this.colors = [];
        for (var a = 1; a <= this.colorCount; a++) {
            this.colors.push(a)
        }
    },
    handleClick: function (c, a) {
        c.preventDefault();
        var b = c.getTarget(".x-cal-color", 3, true);
        if (b) {
            var f = b.id.split("-color-")[1];
            this.select(f)
        }
    },
    select: function (b, a) {
        if (b != this.value) {
            if (this.value) {
                Ext.fly(this.id + "-color-" + this.value).removeClass("x-color-palette-sel")
            }
            Ext.get(this.id + "-color-" + b).addClass("x-color-palette-sel");
            this.value = b;
            if (a !== true) {
                this.fireEvent("select", this, b)
            }
        }
    }
});
Ext.reg("sgarqbase.colorpalette", Ext.SgArqBase.ColorPalette);