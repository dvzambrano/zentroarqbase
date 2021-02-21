
ChartApp = function() {
    return {
        init : function(ChartApp) {

            Ext.chart.Chart.CHART_URL = config.app_host + '/js/extjs/resources/charts.swf';
			
            this.store = new Ext.data.Store({
                fields: ['name', 'value1', 'value2'],
                reader: new Ext.data.JsonReader()
            }); 

            this.pieChart = {
                store: this.store,
                xtype: 'piechart',
                dataField: 'value1',
                categoryField: 'name',
                extraStyle: {
                    legend: {
                        display: 'bottom',
                        padding: 5,
                        font: {
                            family: 'Tahoma',
                            size: 13
                        }
                    }
                }
            };

            this.columnChart = {
                xtype: 'columnchart',
                store: this.store,
                url: config.app_host + '/js/extjs/resources/charts.swf',
                xField: 'name',
                yAxis: new Ext.chart.NumericAxis({
                    displayName: 'value1',
                    labelRenderer : Ext.util.Format.numberRenderer('0,0')
                }),
                tipRenderer : function(chart, record, index, series){
                    if(series.yField == 'value1')
                        return String.format(bundle.getMsg('chart.value.title'), Ext.util.Format.number(record.data.value1, '0,0'), '', record.data.name);
                    else
                        return String.format(bundle.getMsg('chart.value.title'), Ext.util.Format.number(record.data.value2, '0,0'), '', record.data.name);
                },
                chartStyle: {
                    padding: 10,
                    animationEnabled: true,
                    font: {
                        name: 'Tahoma',
                        color: 0x444444,
                        size: 11
                    },
                    dataTip: {
                        padding: 5,
                        border: {
                            color: 0x99bbe8,
                            size:1
                        },
                        background: {
                            color: 0xDAE7F6,
                            alpha: .9
                        },
                        font: {
                            name: 'Tahoma',
                            color: 0x15428B,
                            size: 10,
                            bold: true
                        }
                    },
                    xAxis: {
                        color: 0x69aBc8,
                        majorTicks: {
                            color: 0x69aBc8, 
                            length: 4
                        },
                        minorTicks: {
                            color: 0x69aBc8, 
                            length: 2
                        },
                        majorGridLines: {
                            size: 1, 
                            color: 0xeeeeee
                        }
                    },
                    yAxis: {
                        color: 0x69aBc8,
                        majorTicks: {
                            color: 0x69aBc8, 
                            length: 4
                        },
                        minorTicks: {
                            color: 0x69aBc8, 
                            length: 2
                        },
                        majorGridLines: {
                            size: 1, 
                            color: 0xdfe8f6
                        }
                    }
                },
                series: [{
                    type: 'column',
                    yField: 'value2',
                    style: {
                        image: config.app_host+'/images/bar.gif',
                        mode: 'stretch',
                        color:0x99BBE8
                    }
                },{
                    type:'line',
                    yField: 'value1',
                    style: {
                        color: 0x15428B
                    }
                }]
            };

            this.stackedChart = {
                xtype: 'stackedbarchart',
                store: this.store,
                yField: 'name',
                xAxis: new Ext.chart.NumericAxis({
                    stackingEnabled: true
                }),
                series: [{
                    xField: 'value1'
                },{
                    xField: 'value2'
                }]
            };
			
            this.panel = new Ext.Panel({
                id: 'gridPanelChart',
                title: bundle.getMsg('chart.grid.title'),
                region:'center',
                layout:'border',
                iconCls: Ext.ux.Icon('chart_bar'),
                tbar: [{
                    xtype: 'spinnerfield',
                    hidden: true,
                    id: 'periodYearSpinner',
                    fieldLabel: bundle.getMsg('plan.report.year')+'<span style="color:red;"><sup>*</sup></span>', 
                    emptyText: 'Año',
                    //maxValue: (new Date()).format('Y'),
                    allowDecimals: false,
                    accelerate: true,
                    allowBlank: false,
                    width: 60
                },new Ext.Toolbar.TextItem(bundle.getMsg('app.form.since')+'<span style="color:red;"><sup>*</sup></span>'+':'), {
                    ref: '../fromField', 
                    xtype:'datefield',
                    allowBlank:false
                }, new Ext.Toolbar.TextItem('  '+bundle.getMsg('app.form.to')+'<span style="color:red;"><sup>*</sup></span>'+':'), {
                    ref: '../toField', 
                    xtype:'datefield',
                    allowBlank:false
                },{
                    text: bundle.getMsg('app.form.apply'),
                    iconCls: Ext.ux.Icon('tickpluss', 'myicons'),
                    handler: function(){
                        window['ChartApp'].generateData();
                    }
                },'-'],

                listeners: {
                    activate: function(gridpanel){
                        window['ChartApp'].generateData();
                    }
                },
                defaults: {
                    border: false,
                    bodyStyle: 'padding:15px'
                },
                items: [{
                    region:'west',
                    margins: '5 0 0 0',
                    cmargins: '5 5 0 0',
                    width: 450,
                    minSize: 450,
                    maxSize: 450,

                    defaults: {
                        border: false
                    },
                    layout:'border',
                    items: [{
                        region:'center',
                        items: this.stackedChart
                    },{
                        region: 'south',
                        height: 250,
                        minSize: 250,
                        maxSize: 250,
                        items:this.pieChart
                    }]
                },new Ext.Panel({
                    region:'center',
                    layout: 'fit', 
                    margins: '5 0 0 0',
                    items: [this.columnChart]
                })]
            });

        },

        showWindow : function(animateTarget){

        },

        applySecurity : function(groups, permissions){

        },

        generateData : function(){
            var sd = window['ChartApp'].panel.fromField.getValue();
            var ed = window['ChartApp'].panel.toField.getValue();

            window['ChartApp'].store.removeAll();
            new Ext.data.Connection().request({
                url: 'calendar/request/method/load/component/stadistics',
                method: 'POST',
                params:{
                    start: sd && sd.format(Date.patterns.ISO8601Long)?sd.format(Date.patterns.ISO8601Long):'',
                    end: ed && ed.format(Date.patterns.ISO8601Long)?ed.format(Date.patterns.ISO8601Long):''
                },
                callback : function(options, success, response) {
                    var json = Ext.decode(response.responseText);
                    var resume = json.data;
                    for(var i = 0; i < resume.length; i++){
                        window['ChartApp'].store.insert(window['ChartApp'].store.getCount(), new Ext.data.Record({
                            name: resume[i].name,
                            value1: resume[i].baramount,
                            value2: resume[i].lineamount
                        })); 
                    }
                }
            });
        }
    }
}();