
const YAML = require("yamljs");
import { Transform } from "stream";
import { DisplayOptInfo } from "../src/OptInformation";

const R = require("ramda");
const optTypeMatcher = /---\s(.*)\r?\n/;
const docStart = "---";
const docEnd = "\n...";
const IsDocumentStart = (x: string) => x.substring(0, 3) === docStart;
const FindDocumentEnd = (x: string) => {
    const index = x.indexOf(docEnd);
    return { found: index > -1, endpos: index + docEnd.length };
};

export class LLVMOptTransformer extends Transform {
    _buffer: string;
    constructor(options: object) {
        super(R.merge(options || {}, { objectMode: true }));
        this._buffer = "";
    }
    _flush(done: Function) {
        this.processBuffer();
        done();
    }
    _transform(chunk: any, encoding: string, done: Function) {
        this._buffer += chunk.toString();
        //buffer until we have a start and and end
        //if at any time i care about improving performance stash the offset
        this.processBuffer();
        done();
    }
    processBuffer() {
        while (IsDocumentStart(this._buffer)) {
            const { found, endpos } = FindDocumentEnd(this._buffer);
            if (found) {
                const [head, tail] = R.splitAt(endpos, this._buffer);
                const optTypeMatch = head.match(optTypeMatcher);
                let opt = YAML.parse(head);
                if (!optTypeMatch) {
                    console.warn("missing optimization type");
                } else {
                    opt.optType = optTypeMatch[1].replace("!", "");
                }
                opt.displayString = DisplayOptInfo(opt);
                this.push(opt as LLVMOptInfo);
                this._buffer = tail.replace(/^\n/, "");
            } else {
                break;
            }
        }
    }
}
