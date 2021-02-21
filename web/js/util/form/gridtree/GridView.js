/*
Example of ussage:
new Ext.grid.EditorGridPanel({
		//autoHeight: true,
		//width: 400,
		//columnLines: false,
		autoExpandColumn: 'col-name',
		view: new Ext.ux.tree.GridView({
			useArrows: true,
			staticTree: false
		}),
		store: {
			xtype: 'store',
			autoDestroy: true,
			reader: new Ext.ux.tree.TreeReader({
				fields: [{
					name: 'id',
					mapping: 'id',
					type: 'int'
				}, {
					name: 'name',
					mapping: 'name'
				}, {
					name: 'cost',
					mapping: 'cost',
					type: 'float'
				}]
			}),
			data: [{
					id: 11,
					name: 'Department AA',
					cost: 800000.00,
					leaf: false,
					expanded: true,
					children: [{
						id: 111,
						name: 'Thing AAA',
						cost: 300000.00,
						leaf: true
					}, {
						id: 112,
						name: 'Thing AAB',
						cost: 500000.00,
						leaf: true
					}]
				}]
		},
		columns: [new Ext.grid.RowNumberer(),{
			header: 'Id',
			dataIndex: 'id',
			width: 30
		}, {
			header: 'Name',
			id: 'col-name',
			dataIndex: 'name',
			treeCol: true
		}, {
			header: 'Cost',
			dataIndex: 'cost',
			width: 80
		}]
	})
*/

Ext.ux.tree.GridView = Ext.extend(Ext.grid.GridView, {

	useArrows: true,

	staticTree: false,

    constructor: function(config) {
		this.emptyIcon	= Ext.BLANK_IMAGE_URL;

		Ext.ux.tree.GridView.superclass.constructor.call(this, config);
		this.templates			= {};
		this.templates.master	= new Ext.Template(
			'<div class="x-grid3 tq-treegrid" hidefocus="true">',
				'<div class="x-grid3-viewport">',
					'<div class="x-grid3-header">',
						'<div class="x-grid3-header-inner">',
							'<div class="x-grid3-header-offset" style="{ostyle}">{header}</div>',
						'</div>',
						'<div class="x-clear"></div>',
					'</div>',
					'<div class="x-grid3-scroller">',
						'<div class="x-grid3-body ', (this.useArrows ? 'x-tree-arrows' : this.lines ? 'x-tree-lines' : 'x-tree-no-lines') , '" style="{bstyle}">{body}</div>',
						'<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
					'</div>',
				'</div>',
				'<div class="x-grid3-resize-marker">&#160;</div>',
				'<div class="x-grid3-resize-proxy">&#160;</div>',
			'</div>'
		);

		this.templates.row	= new Ext.Template(
			'<div class="x-grid3-row {alt}" style="{tstyle}">',
				'<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
					'<tbody class="x-tree-node">',
						'<tr>{cells}</tr>',
						(this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
					'</tbody>',
				'</table>',
			'</div>'
		);
		this.templates.treeCell	= new Ext.Template(
			'<td class="tq-treegrid-col x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
				'<div ext:tree-node-id="{nodeId}" class="x-grid3-col-{id} x-tree-node-el x-unselectable" unselectable="on" {attr}>',
					'<div class="tq-treegrid-icons">',
						'<span class="x-tree-node-indent">{nodeIndent}</span>',
						'<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow {nodeTreeIconCls}" />',
						'<img src="', this.emptyIcon, '" class="x-tree-node-icon {nodeIconCls}" unselectable="on" />',
					'</div>',
					'<div class="x-grid3-cell-inner" unselectable="on" {attr}>',
						'{value}',
					'</div>',
				'</div>',
			'</td>'
		);
	},

	getChildIndentUI: function(node) {
		var indentBuffer	= [];
		var parentNode		= node.parentNode;
		while (parentNode){
			if (!parentNode.isRoot){
				if (!parentNode.isLast()) {
					indentBuffer.unshift('<img src="'+this.emptyIcon+'" class="x-tree-elbow-line" />');
				} else {
					indentBuffer.unshift('<img src="'+this.emptyIcon+'" class="x-tree-icon" />');
				}
			}
			parentNode = parentNode.parentNode;
		}
		return indentBuffer.join("");
	},

	getTreeNodeIcon: function(node) {
		var treeIcon	= node.isLast() ? "x-tree-elbow-end" : "x-tree-elbow";
		if (node.hasChildNodes() && !this.staticTree){
			if (node.expanded){
				treeIcon += "-minus";
			} else {
				treeIcon += "-plus";
			}
			treeIcon += ' tq-tree-node-control';
		}
		return treeIcon;
	},

	// private
    doRender: function(cs, rs, ds, startRow, colCount, stripe){
        // buffers
        var rowBuffer = [];
		var cellBuffer;
		var cell;
		var cellTemplate;
		var cellProperties = {};
		var rowProperties = { 
			tstyle: 'width:'+this.getTotalWidth()+';'
		};
		var record;
		var depthBuffer	= [];
		var hasTreeCol;

        for (var j = 0, len = rs.length; j < len; j++){
			record			= rs[j];
			cellBuffer		= [];
			hasTreeCol		= false;
            var rowIndex	= (j+startRow);


            for (var i = 0; i < colCount; i++){
                cell					= cs[i];
                cellProperties.id		= cell.id;
                cellProperties.css		= (i === 0) ? 'x-grid3-cell-first ' : (i == (colCount - 1) ? 'x-grid3-cell-last ' : '');
                cellProperties.attr		= cellProperties.cellAttr = '';
                cellProperties.value	= cell.renderer.call(cell.scope, record.data[cell.name], cellProperties, record, rowIndex, i, ds);
                cellProperties.style	= cell.style;
                if (Ext.isEmpty(cellProperties.value)){
                    cellProperties.value = '&#160;';
                }
                if (this.markDirty && record.dirty && Ext.isDefined(record.modified[cell.name])){
                    cellProperties.css += ' x-grid3-dirty-cell';
                }

				if (cell.scope.treeCol && !hasTreeCol && record.node) {
					hasTreeCol	= true;
					var node	= record.node;
					
					cellProperties.nodeIndent	= this.getChildIndentUI(node);
					cellProperties.nodeIconCls	= node.attributes.iconCls || '';
				
					cellProperties.nodeTreeIconCls	= this.getTreeNodeIcon(node);

					cellTemplate = this.templates.treeCell;
				} else {
					cellTemplate = this.templates.cell;
				}
				cellBuffer[cellBuffer.length] = cellTemplate.apply(cellProperties);

            }
            var alt = [];

			if (record.depth && record.node) {
				if (depthBuffer.length < record.depth) {
					rowBuffer.push('<div class="x-tree-node-ct">');
					depthBuffer.push('</div>');
				} else {
					while (depthBuffer.length > record.depth) {
						rowBuffer.push(depthBuffer.pop());
					}
				}

				if (this.staticTree) {
					alt.push('tq-treegrid-static');
				}

				if (node.isLeaf()) {
					alt.push('x-tree-node-leaf');
				} else if (node.expanded){
					alt.push('x-tree-node-expanded');
				} else {
					alt.push('x-tree-node-collapsed');
				}
			}

            if(stripe && ((rowIndex+1) % 2 === 0)){
                alt.push('x-grid3-row-alt');
            }
            if(record.dirty){
                alt.push(' x-grid3-dirty-row');
            }

            rowProperties.cols		= colCount;
			rowProperties.nodeId	= record.node.id;
            rowProperties.cells		= cellBuffer.join('');
            if (this.getRowClass){
                alt.push(this.getRowClass(record, rowIndex, rowProperties, ds));
            }
			rowProperties.alt	= alt.join(' ');
			
            rowBuffer[rowBuffer.length] =  this.templates.row.apply(rowProperties);
        }

		while (depthBuffer.length) {
			rowBuffer.push(depthBuffer.pop());
		}
        return rowBuffer.join('');
    },

	afterRender: function() {
		Ext.ux.tree.GridView.superclass.afterRender.call(this);

		if (!this.staticTree) {
			this.mainBody.on('click', function(ev, el) {
				this.toggleNode(el);
			}, this, {
				delegate: '.tq-tree-node-control'
			});
			this.mainBody.on('dblclick', function(ev, el) {
				this.toggleNode(el);
			}, this, {
				delegate: '.x-tree-node-el '
			});
		}
	},

	toggleNode: function(el) {
		var row		= Ext.get(this.findRow(el));
		var node	= this.grid.getStore().getAt(row.dom.rowIndex).node;

		var childCnt	= row.next('.x-tree-node-ct', false);
		var nodeCtrl	= row.child('.tq-tree-node-control', false);

		if (childCnt && nodeCtrl) {
			if (node.expanded) {
				childCnt.enableDisplayMode('block');
				childCnt.stopFx();

				row.removeClass('x-tree-node-expanded');
				nodeCtrl.removeClass(node.isLast() ? "x-tree-elbow-end-minus" : "x-tree-elbow-minus");
				row.addClass('x-tree-node-collapsed');
				nodeCtrl.addClass(node.isLast() ? "x-tree-elbow-end-plus" : "x-tree-elbow-plus");

				childCnt.slideOut('t', {
					callback : function(){
					   row.highlight();
					   node.expanded	= false;
					},
					scope: this,
					duration: .25
				});
				
			} else {
				childCnt.stopFx();

				row.addClass('x-tree-node-expanded');
				nodeCtrl.addClass(node.isLast() ? "x-tree-elbow-end-minus" : "x-tree-elbow-minus");
				row.removeClass('x-tree-node-collapsed');
				nodeCtrl.removeClass(node.isLast() ? "x-tree-elbow-end-plus" : "x-tree-elbow-plus");

				childCnt.slideIn('t', {
				   callback : function(){
						childCnt.highlight();
						node.expanded	= true;
					},
					scope: this,
					duration: .25
				});
			}
		}
	},

    getRows: function() {
        return this.hasRows() ? this.mainBody.query(this.rowSelector) : [];
    }

});