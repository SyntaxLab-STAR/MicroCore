// =========================
// CPU VARIABLES
// =========================

let registerA = 0;

let registerB = 0;

let programCounter = 0;

let running = true;


// =========================
// PROGRAM
// =========================

let program = [

    "LOAD 5",

    "LOADB 3",

    "ADD",

    "HALT"

];


// =========================
// MEMORY
// =========================

let memory = [

    5,
    3,
    8,
    0

];


// =========================
// ALU
// =========================

function runALU(operation, inputA, inputB){

    let result = 0;

    if(operation == "ADD"){

        result = inputA + inputB;

    }

    else if(operation == "SUB"){

        result = inputA - inputB;

    }

    return result;

}


// =========================
// SHOW PROGRAM
// =========================

function showProgram(){

    let programHTML = "";

    for(let i = 0; i < program.length; i++){

        let className = "program-cell";

        if(i == programCounter){

            className = "program-cell current";

        }

        programHTML +=

            "<div class='" + className + "'>" +

            "Line " + i +

            "<br>" +

            program[i] +

            "</div>";

    }

    document.getElementById("program").innerHTML =
        programHTML;

}


// =========================
// SHOW MEMORY
// =========================

function showMemory(){

    let memoryHTML = "";

    for(let i = 0; i < memory.length; i++){

        memoryHTML +=

            "<div class='memory-cell'>" +

            "Address " + i +

            "<br>" +

            memory[i] +

            "</div>";

    }

    document.getElementById("memory").innerHTML =
        memoryHTML;

}


// =========================
// UPDATE CPU
// =========================

function updateCPU(){

    document.getElementById("registerA").innerHTML =
        registerA;

    document.getElementById("registerB").innerHTML =
        registerB;

    document.getElementById("programCounter").innerHTML =
        programCounter;

}


// =========================
// UPDATE ALU
// =========================

function updateALU(operation, inputA, inputB, result){

    document.getElementById("aluA").innerHTML =
        inputA;

    document.getElementById("aluB").innerHTML =
        inputB;

    document.getElementById("aluOperation").innerHTML =
        operation;

    document.getElementById("aluResult").innerHTML =
        result;

}


// =========================
// CPU CYCLE DISPLAY
// =========================

function updateCycle(
    stage,
    instruction,
    operation,
    execution
){

    document.getElementById("cycleStage").innerHTML =
        stage;

    document.getElementById("fetchedInstruction").innerHTML =
        instruction;

    document.getElementById("decodedOperation").innerHTML =
        operation;

    document.getElementById("executionResult").innerHTML =
        execution;

}


// =========================
// LOG
// =========================

function addLog(message){

    let log =
        document.getElementById("log");

    log.innerHTML +=

        "<div class='log-item'>" +

        message +

        "</div>";

}


// =========================
// FETCH
// =========================

function fetchInstruction(){

    if(programCounter >= program.length){

        running = false;

        return null;

    }

    let instruction =
        program[programCounter];

    updateCycle(
        "FETCH",
        instruction,
        "---",
        "CPU fetched instruction"
    );

    return instruction;

}


// =========================
// DECODE
// =========================

function decodeInstruction(instruction){

    let operation =
        instruction.split(" ")[0];

    updateCycle(
        "DECODE",
        instruction,
        operation,
        "CPU decoded instruction"
    );

    return operation;

}


// =========================
// EXECUTE
// =========================

function executeInstruction(
    instruction,
    operation
){

    let oldPC =
        programCounter;


    // LOAD

    if(operation == "LOAD"){

        let value =
            Number(instruction.split(" ")[1]);

        registerA = value;

        programCounter++;

        updateCycle(
            "EXECUTE",
            instruction,
            operation,
            "Register A = " + value
        );

        document.getElementById("activity").innerHTML =
            "LOAD executed. Register A = " + value;

        addLog(
            "PC " + oldPC +
            ": LOAD " + value
        );

    }


    // LOADB

    else if(operation == "LOADB"){

        let value =
            Number(instruction.split(" ")[1]);

        registerB = value;

        programCounter++;

        updateCycle(
            "EXECUTE",
            instruction,
            operation,
            "Register B = " + value
        );

        document.getElementById("activity").innerHTML =
            "LOADB executed. Register B = " + value;

        addLog(
            "PC " + oldPC +
            ": LOADB " + value
        );

    }


    // ADD

    else if(operation == "ADD"){

        let result =
            runALU(
                "ADD",
                registerA,
                registerB
            );

        updateALU(
            "ADD",
            registerA,
            registerB,
            result
        );

        registerA = result;

        programCounter++;

        updateCycle(
            "EXECUTE",
            instruction,
            operation,
            "Result = " + result
        );

        document.getElementById("activity").innerHTML =
            "ADD executed. Result = " + result;

        addLog(
            "PC " + oldPC +
            ": ADD → " + result
        );

    }


    // SUB

    else if(operation == "SUB"){

        let result =
            runALU(
                "SUB",
                registerA,
                registerB
            );

        updateALU(
            "SUB",
            registerA,
            registerB,
            result
        );

        registerA = result;

        programCounter++;

        updateCycle(
            "EXECUTE",
            instruction,
            operation,
            "Result = " + result
        );

        document.getElementById("activity").innerHTML =
            "SUB executed. Result = " + result;

        addLog(
            "PC " + oldPC +
            ": SUB → " + result
        );

    }


    // JUMP

    else if(operation == "JUMP"){

        let address =
            Number(instruction.split(" ")[1]);

        programCounter = address;

        updateCycle(
            "EXECUTE",
            instruction,
            operation,
            "Jumped to line " + address
        );

        document.getElementById("activity").innerHTML =
            "JUMP executed. PC = " + address;

        addLog(
            "PC " + oldPC +
            ": JUMP → " + address
        );

    }


    // JUMPZERO

    else if(operation == "JUMPZERO"){

        let address =
            Number(instruction.split(" ")[1]);

        if(registerA == 0){

            programCounter = address;

            updateCycle(
                "EXECUTE",
                instruction,
                operation,
                "Register A is 0. Jumped to " + address
            );

            addLog(
                "PC " + oldPC +
                ": JUMPZERO → " + address
            );

        }

        else{

            programCounter++;

            updateCycle(
                "EXECUTE",
                instruction,
                operation,
                "Register A is not 0. No jump"
            );

            addLog(
                "PC " + oldPC +
                ": JUMPZERO → no jump"
            );

        }

        document.getElementById("activity").innerHTML =
            "JUMPZERO executed.";

    }


    // HALT

    else if(operation == "HALT"){

        running = false;

        updateCycle(
            "EXECUTE",
            instruction,
            operation,
            "CPU stopped"
        );

        document.getElementById("activity").innerHTML =
            "HALT executed. CPU stopped.";

        addLog(
            "PC " + oldPC +
            ": HALT"
        );

    }


    // UNKNOWN INSTRUCTION

    else{

        running = false;

        document.getElementById("activity").innerHTML =
            "Unknown instruction: " + instruction;

        addLog(
            "PC " + oldPC +
            ": Unknown instruction"
        );

    }

}


// =========================
// RUN CPU
// =========================

function runCPU(){

    if(!running){

        document.getElementById("activity").innerHTML =
            "CPU is stopped. Press Reset CPU.";

        return;

    }


    let instruction =
        fetchInstruction();

    if(instruction == null){

        return;

    }


    let operation =
        decodeInstruction(instruction);


    executeInstruction(
        instruction,
        operation
    );


    updateCPU();

    showProgram();

}


// =========================
// LOAD USER PROGRAM
// =========================

function loadProgram(){

    let input =
        document.getElementById("programInput").value;


    let lines =
        input.split("\n");


    let newProgram = [];


    for(let i = 0; i < lines.length; i++){

        let line =
            lines[i].trim();


        if(line != ""){

            newProgram.push(
                line.toUpperCase()
            );

        }

    }


    if(newProgram.length == 0){

        document.getElementById("programMessage").innerHTML =
            "Please enter a program.";

        return;

    }


    program = newProgram;


    resetCPU();


    document.getElementById("programMessage").innerHTML =
        "Program loaded successfully.";

}


// =========================
// RESET CPU
// =========================

function resetCPU(){

    registerA = 0;

    registerB = 0;

    programCounter = 0;

    running = true;


    document.getElementById("instruction").innerHTML =
        "---";


    document.getElementById("activity").innerHTML =
        "CPU is waiting...";


    document.getElementById("log").innerHTML =
        "";


    updateALU(
        "---",
        0,
        0,
        0
    );


    updateCycle(
        "Waiting",
        "---",
        "---",
        "---"
    );


    updateCPU();

    showProgram();

}


// =========================
// START
// =========================

window.onload = function(){

    updateCPU();

    showProgram();

    showMemory();

};