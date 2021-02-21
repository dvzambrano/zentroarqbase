Ext.ux.tree.TreeReader = Ext.extend(Ext.data.JsonReader, {

	tree: null,

	constructor: function(meta, recordType) {
		Ext.ux.tree.TreeReader.superclass.constructor.call(this, meta, recordType || meta.fields);
	},

	load: function(node){
        if (node.attributes.children){
			var cs = node.attributes.children;
			for (var i = 0, len = cs.length; i < len; i++){
				var cn = node.appendChild(this.createNode(cs[i]));
				this.load(cn);
			}
		}
    },

	createNode: function(attr){
        var node = new Ext.data.Node(attr);
		node.expanded = (attr.expanded === true);
		return node;
    },
	
    /**
     * Create a data block containing Ext.data.Records from a tree.
     */
    readRecords: function(o) {

		var root	= this.createNode({
			text: 'Root',
			id: 'root',
			children: o
		});
		this.tree	= new Ext.data.Tree(root);
		this.load(root);

		var f		= this.recordType.prototype.fields;
		var records	= [];
		root.cascade(function(node) {
			if (node !== root) {
				var record = new this.recordType(this.extractValues(node, f.items), node.id);
				record.node		= node;
				record.depth	= node.getDepth();
				records.push(record);
			}
		}, this);

		return {
            success : true,
            records : records,
            totalRecords : records.length
        };
	},

	/**
     * type-casts a single node
     */
    extractValues : function(node, fields) {
        var f, values = {};
        for(var j = 0; j < fields.length; j++){
            f = fields[j];
            var v = node.attributes[f.mapping];
            values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue, node);
        }
		return values;
    }
});