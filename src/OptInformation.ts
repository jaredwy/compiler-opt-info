const R = require("ramda");

function DisplayOptInfo(optInfo: LLVMOptInfo) {
    return optInfo.Args.reduce((acc, x) => { 
        return acc + R.pipe(
                R.partial(R.pickBy, [(v:any, k:string) => k != "DebugLoc"]),
                R.toPairs,
                R.head,
                R.last
            )(x);
    }, "");
}

export { DisplayOptInfo };
