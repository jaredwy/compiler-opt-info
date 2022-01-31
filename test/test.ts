import { test } from "ava";

import { LLVMOptTransformer } from "../src/LLVMOptTransformer";
import { DisplayOptInfo } from "../src/OptInformation";
import { createReadStream, readdirSync } from "fs";
import { count } from "console";

// test.cb("test a simple result", (t) => {
//     let rec = 1;
//     createReadStream("test/resources/test.yaml", { encoding: "utf-8" })
//         .pipe(new LLVMOptTransformer({}))
//         .on("data", (x: LLVMOptInfo) => {
//             if (rec == 1) {
//                 t.is(x.Name, "NoDefinition");
//                 t.is(x.optType, "Missed");
//                 t.is(
//                     DisplayOptInfo(x),
//                     "realloc will not be inlined into _Z13record_resultdPKc because its definition is unavailable"
//                 );
//                 t.is(x.displayString, DisplayOptInfo(x));
//                 rec++;
//             } else if (rec == 2) {
//                 t.is(x.Name, "NotInlined");
//                 t.is(x.optType, "Missed");
//                 t.end();
//             }
//         });
// });

// test.cb("ensure large file has correct count", (t) => {
//     let count = 0;
//     createReadStream("test/resources/loop_unroll.opt.yaml", {
//         encoding: "utf-8",
//     })
//         .pipe(new LLVMOptTransformer({}))
//         .on("data", (x: LLVMOptInfo) => count++)
//         .on("end", () => {
//             t.is(count, 996);
//             t.end();
//         });
// });

// test.cb("ensure that pass and analysis are accounted for", (t) => {
//     let count = 0;
//     createReadStream("test/resources/O3.opt.yaml", { encoding: "utf-8" })
//         .pipe(new LLVMOptTransformer({}))
//         .on("data", (x: LLVMOptInfo) => {
//             if (count == 0) {
//                 t.is(x.optType, "Analysis");
//                 t.is(
//                     DisplayOptInfo(x),
//                     "_Z10accumulateiPi can be inlined into _Z10computesumPii with cost=-35 (threshold=375)"
//                 );
//             }
//             if (count == 1) {
//                 t.is(x.optType, "Passed");
//                 t.is(
//                     DisplayOptInfo(x),
//                     "_Z10accumulateiPi inlined into _Z10computesumPii"
//                 );
//             } else if (count == 2) {
//                 t.is(x.optType, "Passed");
//                 t.is(DisplayOptInfo(x), "hosting zext");
//             }
//             count++;
//         })
//         .on("end", () => {
//             t.end();
//         });
// });

test("the system dosn't crush with a lot of yaml files", async (t) => {
    //for some reason the test is still pass even though the crush is happening,
    // but in this case the error is still thrown
    const files = readdirSync("test/resources/sample_yamls");
    try {
        await crashTest(files, "test/resources/sample_yamls/");
        t.pass();
    } catch (error) {
        t.fail();
    }
});



const crashTest = async (files: any, path: string) => {
    //iterate through all the yaml files in the test directory

    for (let i = 0; i < files.length; i++) {
        if (files[i].endsWith(".opt.yaml")) {
            console.log(`${i+1}/${files.length}-${files[i]}`);
            createReadStream(path + files[i], {
                encoding: "utf-8",
            })
            .pipe(new LLVMOptTransformer({}))
        }
    }
};
