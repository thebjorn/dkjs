

import dk from "../../dk-obj";
import Class from "../../lifecycle/coldboot/dk-class";
import counter from "../../core/counter";
import {json} from "../../browser/dk-client";

export class Leaf extends Class {
    constructor(...args) {
        super({
            id: null,
            kind: '',
            name: '',
            parent: null,
            path: [],
            root: undefined,
            children: [],
        }, ...args);
    }

    visit(location, ctx) {
        return ctx.leaf(location, this);
    }
}


export class Tree extends Leaf {
    visit(location, ctx) {
        return ctx.tree(location, this);
    }
}


export class Data extends Class {
    constructor(...args) {
        super({
            depth: 0,           // int
            height: 0,          // int
            roots: [],          // [id1,... idk]
            cache: {},          // id -> tree|leaf
        }, ...args);

        const self = this;
        let item, node;

        // convert all items in cache to Tree|Leaf objects
        for (let id in this.cache) if (this.cache.hasOwnProperty(id)) {
            item = this.cache[id];
            if (item.children.length === 0 && this.roots.indexOf(id) === -1) {
                node = new Leaf(item);
            } else {
                node = new Tree(item);
            }
            this.cache[id] = node;
        }

        const childid2obj = function (childid) { return self.cache[childid]; };
        // convert all child-ids to child objects.
        for (let id in this.cache) if (this.cache.hasOwnProperty(id)) {
            item = this.cache[id];
            item.children = item.children.map(childid2obj);
        }

        // convert all root-ids to objects.
        this.roots = this.roots.map(function (rootid) {
            return self.cache[rootid];
        });
    }
}


/*
 *  A Forrest is a tree structure with 1-n root nodes.
 *
 *  Each node _must_ have the following properties:
 *
 *    - name (the text to display in the tree)
 *    - children (a list of nodes that are this node's direct descendants).
 *
 *  a node _may_ in addition have
 *
 *    - kind (node type, a string, default will be set to 'tree' or 'leaf')
 *    - id (this should be a string to avoid surprises due to ordering issues
 *          in javascript, by default this will be set to an internally
 *          semi-random number).
 *
 */
export class Forrest {
    constructor(rootnodes) {
        this.depth = undefined;
        this.height = undefined;
        this.roots = null;
        this.cache = undefined;

        const self = this;
        this.cache = {};

        const iter = function iter(nodes, fn, parent) {
            if (!nodes) return;
            nodes.forEach(function (node) {
                fn(node, parent);
                iter(node._children, fn, node);
            });
        };

        // identify (id), categorize (kind), and linearize (cache)
        iter(rootnodes, function (node) {
            if (!node.id) node.id = counter('id');
            if (!node.kind) node.kind = node._children ? 'tree' : 'leaf';
            self.cache[node.id] = node;
        });

        // parent and path
        iter(rootnodes, function (node, parent) {
            node.parent = parent || null;
            if (node.parent) {
                node.path = node.parent.path.concat([node.parent.id]);
            } else {
                node.path = [];
            }
        });

        // childids
        iter(rootnodes, function (node) {
            node.children = (node._children || []).map(function (n) { return n.id; });
        });

        // root node
        rootnodes.forEach(function (r) {
            r.root = r.id;
            iter(r._children, function (node) {
                node.root = r.id;
            });
        });

        this.depth = Math.max.apply(null, this.cachevals().map(function (v) {
            return 1 + v.path.length;
        }));

        this.height = Math.max.apply(null, this.cachevals().map(function (v) {
            return v.children.length;
        }));
        this.height = Math.max(rootnodes.length, this.height);

        // this.outerHeight = this.cachevals().map(function (v) {
        //     return v.children.length + 1;
        // }).reduce(function (a, b) { return a+b;}, 0);

        this.roots = rootnodes;
    }

    cachekeys() {
        return Object.keys(this.cache);
    }

    cachevals() {
        const self = this;
        return this.cachekeys().map(function (key) {
            return self.cache[key];
        });
    }
}


export class DataSource extends Data {
    fetch() {
        dk.trigger(this, 'fetch-data-start', this);
        dk.trigger(this, 'fetch-data', this);
    }
}


export class JSonDataSource extends DataSource {
    constructor(...args) {
        super({
            cache: {},
            roots: [],
            depth: 0,
            height: 0,
        }, ...args);
    }
}


export class AjaxDataSource extends JSonDataSource {
    constructor(...args) {
        super({
            url: '',
        }, ...args);
        this.__in_json = false;
    }
    
    /*
     *  Fetch data from url.
     */
    fetch() {
        if (this.__in_json) return;
        this.__in_json = true;

        const self = this;
        dk.trigger(this, 'fetch-data-start', this);
        return json({
            url: this.url,
            cache: true,
            success: function (data) {
                self.depth = data.depth;
                self.height = data.height;
                self.roots = data.roots;
                self.cache = data.cache;
                self.init();
                self.__in_json = false;
                dk.trigger(self, 'fetch-data', self);
            }
        });
    }
}


const tree_data = {
    Leaf,
    Tree,
    Data,
    Forrest,
    DataSource,
    JSonDataSource,
    AjaxDataSource
};

export default tree_data;
