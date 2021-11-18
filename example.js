class GateSet {
    constructor(n) {
        this.n = n;
    }
    XBlock = '<div class="draggable" draggable="true" id="X" data-control="false"></div>'
    YBlock = '<div class="draggable" draggable="true" id="Y" data-control="false"></div>'
    ZBlock = '<div class="draggable" draggable="true" id="Z" data-control="false"></div>'
    HBlock = '<div class="draggable" draggable="true" id="H" data-control="false"></div>'
    SBlcok = '<div class="draggable" draggable="true" id="S" data-control="false"></div>'
    TBlcok = '<div class="draggable" draggable="true" id="T" data-control="false"></div>'
    CtrlBlock = '<div class="draggable" draggable="true" id="ctrl" data-control="true"></div>'
    CtrlX = '<div class="draggable" draggable="true" data-c="controlgate" id="CtrlX" data-control="true"></div>'
    CtrlR(n) {
        var CtrlR = `<div class="draggable" draggable="true" data-c="controlgate" id="CtrlR${n}" data-control="true">`
        return CtrlR
    }
}




function init_matrix(n, m) {
    var M = []
    for (var i = 0; i < n; i++) {
        var ls = []
        for (var j = 0; j < m; j++) {
            ls[j] = 0
        }
        M[i] = ls
    }
    return M
}

function Bell(rows, cols) {
    var n = 2
    var m = 2
    if (rows > 2) {
        n = rows
    }
    if (cols > 2) {
        m = cols
    }
    Initialize(n, m)
    var gate = new GateSet()
    var M = init_matrix(n, m)
    M[0][0] = gate.HBlock
    M[0][1] = gate.CtrlBlock
    M[1][1] = gate.CtrlX
    return M
}

function GHZ(rows, cols) {
    var n = 3
    var m = 3
    if (rows > 3) {
        n = rows
    }
    if (cols > rows) {
        m = cols
    }
    else {
        m = rows
    }
    Initialize(n, m)
    var gate = new GateSet()
    var M = init_matrix(n, m)
    M[0][0] = gate.HBlock
    var startindex = 1
    for (var i = 0; i < n - 1; i++) {
        M[i][startindex] = gate.CtrlBlock
        M[i + 1][startindex] = gate.CtrlX
        startindex += 1
    }
    return M
}


function QFT(rows, cols) {
    var nqubit = rows
    var cls = (nqubit + 1) * nqubit / 2
    if (cols > (nqubit + 1) * nqubit / 2) {
        cls = cols
    }
    Initialize(rows, cls)
    var gate = new GateSet()
    var M = init_matrix(rows, cls)
    var startindex = 0
    for (var i = 0; i < rows; i++) {
        M[i][startindex] = gate.HBlock
        var k = 1
        for (var j = startindex + 1; j < startindex + nqubit; j++) {
            M[i][j] = gate.CtrlR(k + 1)
            M[i + k][j] = gate.CtrlBlock
            k++
        }
        startindex += nqubit;
        nqubit = nqubit - 1
    }
    return M
}

function SuperPosition(rows, cols) {
    Initialize(rows, cols)
    var gate = new GateSet()
    var M = init_matrix(rows, cols)
    for (var i = 0; i < rows; i++) {
        M[i][0] = gate.HBlock
    }
    return M
}

function MosaicGate(rows, cols, algorithm) {
    var GateM = algorithm(rows, cols)
    setTimeout(() => {
        var dragarea = document.querySelector("#DrawArea")
        var cells = dragarea.querySelectorAll(".row")
        for (var cell of cells) {
            var Areacols = cell.getAttribute("data-cols")
            var tmp = cell.parentNode
            var Arearows = tmp.getAttribute("data-rows")
            if (GateM[Arearows][Areacols] != 0) {
                cell.innerHTML = GateM[Arearows][Areacols]
            }
        }
    }, 0);

}

function GetAreaRowCol() {
    var rows = document.querySelector(".rows").childElementCount
    var cols = document.querySelector(".cols").childElementCount - 1
    var obj = {
        row: rows,
        col: cols,
    }
    return obj
}

function Execution_algorithm(obj) {
    var object = GetAreaRowCol()
    var rows = object["row"]
    var cols = object["col"]
    var index = obj.selectedIndex;
    var algorithm_class = obj.options[index].value;
    if (algorithm_class == "Superposition") {
        MosaicGate(rows, cols, SuperPosition)
    }
    else if (algorithm_class == "QFT") {
        MosaicGate(rows, cols, QFT)
        setTimeout(() => { UpdateRGate() }, 0);
    }
    else if (algorithm_class == "GHZ") {
        MosaicGate(rows, cols, GHZ)
    }
    else if (algorithm_class == "Bell") {
        MosaicGate(rows, cols, Bell)
    }
    setTimeout(() => {
        var draggablesvar = document.querySelectorAll(".draggable")
        draggableL(draggablesvar)
        totoaldrawqc(totoalqcinfor())
        UpdateData()
    }, 0);

}
