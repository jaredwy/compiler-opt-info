
type Path = string;
type OptType = "Missed" | "Passed" | "Analysis";

interface LLVMOptInfo extends OptInfo {
    Pass: string; //todo: dig into llvm and get a list of this
    Name: string;
    DebugLoc: DebugLoc;
    Function: string;
    Args: Array<object>;
}

interface DebugLoc {
    File: Path;
    Line: number;
    Column: number;
}

interface OptInfo {
    optType: OptType;
    displayString: string;
}