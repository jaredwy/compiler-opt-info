const YAML = require("yamljs");
import {Transform} from "stream";
import * as R from "ramda";
const docEnd = "...";
const docStart = "---";
const appendDocEnd = R.partial(R.append, [docEnd]);
const buildDoc = R.compose(R.partial(R.join, ["\n"]), appendDocEnd)
const splitAtDocEnd = R.partial(R.splitWhen, [(x:string) => x.startsWith(docEnd)]);

interface OptTransformerOptions {}

class OptTransform extends Transform {
    _isInDocument: Boolean;
    _buffer: Array<String>;
    constructor(options: OptTransformerOptions) {
        super(R.merge(options || {} , {objectMode: true}));
        this._isInDocument = false;
        this._buffer = [];
    }
    _transform(chunk: any, encoding: string, done:any) {
        const data = chunk.toString().split("\n");
        const lines = R.concat(this._buffer, data);
        if (!this._isInDocument) {
             const x: (String | null) = R.head(lines);
             if(!x || !x.startsWith(docStart)) {
                done(Error("Expected a new document to start"));
             }
            this._isInDocument = true;
            const doc = splitAtDocEnd(lines);
          
            if(doc.length > 0) {
                this.push(YAML.parse(buildDoc(doc)));
            }
            console.log("rar");
        }
    }
}

module.exports = OptTransform;