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
    measure(project) {
        var MeasureBlock = '<div class="draggable" data-c = "m" draggable="true" id="measure" data-control=' + project + '></div>'
        return MeasureBlock
    }

    CtrlDot(order) {
        var CtrlDot = `<div class="draggable" draggable="true" id="ctrl" data-control="true" data-order="${order}"></div>`
        return CtrlDot
    }
    CtrlX(order) {
        var CtrlX = `<div class="draggable" draggable="true" data-c="controlgate" id="CtrlX" data-control="true"
        data-order="${order}"></div>`
        return CtrlX
    }
    CtrlR(n, order) {
        var CtrlR = `<div class="draggable" draggable="true" data-c="controlgate" id="CtrlR${n}" data-order="${order}"  data-control="true">`
        return CtrlR
    }
}

function UpdateRGate() {
    var CRS = document.querySelectorAll(".draggable")
    for (var CR of CRS) {
        var gateclass = CR.id.slice(0, 5)
        if (gateclass == "CtrlR" && CR.id != "CtrlRx") {
            var n = parseInt(CR.id.slice(5))
            var encoded = window.btoa(GenerateRxBackground(n));
            CR.style.background = "url(data:image/svg+xml;base64," + encoded + ")";
        }
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

function Bell(qubit_indexs, circuit_depth) {
    var n = 2
    var m = 2
    if (qubit_indexs > 2) {
        n = qubit_indexs
    }
    if (circuit_depth > 2) {
        m = circuit_depth
    }
    Initialize(n, m)
    var gate = new GateSet()
    var M = init_matrix(n, m)
    M[0][0] = gate.HBlock
    M[0][1] = gate.CtrlDot(-1)
    M[1][1] = gate.CtrlX(-1)
    return M
}

function GHZ(qubit_indexs, circuit_depth) {
    var order = -1
    var n = 3
    var m = 3
    if (qubit_indexs > 3) {
        n = qubit_indexs
    }
    if (circuit_depth > qubit_indexs) {
        m = circuit_depth
    }
    else {
        m = qubit_indexs
    }
    Initialize(n, m)
    var gate = new GateSet()
    var M = init_matrix(n, m)
    M[0][0] = gate.HBlock
    var startindex = 1
    for (var i = 0; i < n - 1; i++) {
        M[i][startindex] = gate.CtrlDot(order)
        M[i + 1][startindex] = gate.CtrlX(order)
        startindex += 1
        order -= 1
    }
    return M
}


function QFT(qubit_indexs, circuit_depth) {
    var nqubit = qubit_indexs
    var cls = (nqubit + 1) * nqubit / 2
    if (circuit_depth > (nqubit + 1) * nqubit / 2) {
        cls = circuit_depth
    }
    Initialize(qubit_indexs, cls)
    var number_order = -1
    var gate = new GateSet()
    var M = init_matrix(qubit_indexs, cls)
    var startindex = 0
    for (var i = 0; i < qubit_indexs; i++) {
        M[i][startindex] = gate.HBlock
        var k = 1
        for (var j = startindex + 1; j < startindex + nqubit; j++) {
            M[i][j] = gate.CtrlR(k + 1, number_order)
            M[i + k][j] = gate.CtrlDot(number_order)
            k++
            number_order -= 1
        }
        startindex += nqubit;
        nqubit = nqubit - 1
    }
    return M
}

function SuperPosition(qubit_indexs, circuit_depth) {
    Initialize(qubit_indexs, circuit_depth)
    var gate = new GateSet()
    var M = init_matrix(qubit_indexs, circuit_depth)
    for (var i = 0; i < qubit_indexs; i++) {
        M[i][0] = gate.HBlock
    }
    return M
}

function MosaicGate(qubit_indexs, circuit_depth, algorithm) {
    var GateM = algorithm(qubit_indexs, circuit_depth)
    setTimeout(() => {
        var dragarea = document.querySelector("#Dragable_Area")
        var cells = dragarea.querySelectorAll(".qubit_index")
        for (var cell of cells) {
            var Areacircuit_depth = cell.getAttribute("data-circuit_depth")
            var tmp = cell.parentNode
            var Areaqubit_indexs = tmp.getAttribute("data-qubit_indexs")
            if (GateM[Areaqubit_indexs][Areacircuit_depth] != 0) {
                cell.innerHTML = GateM[Areaqubit_indexs][Areacircuit_depth]
            }
        }
    }, 0);

}

function GetAreaqubit_indexcircuit_depth() {
    var qubit_indexs = document.querySelector("#Dragable_Area").childElementCount
    var circuit_depth = document.querySelector(".circuit_depth").childElementCount - 1
    var obj = {
        qubit_index: qubit_indexs,
        circuit_depth: circuit_depth,
    }
    return obj
}

function Execution_algorithm(obj) {
    var object = GetAreaqubit_indexcircuit_depth()
    var qubit_indexs = object["qubit_index"]
    var circuit_depth = object["circuit_depth"]
    var index = obj.selectedIndex;
    var algorithm_class = obj.options[index].value;
    if (algorithm_class == "Superposition") {
        MosaicGate(qubit_indexs, circuit_depth, SuperPosition)
    }
    else if (algorithm_class == "QFT") {
        MosaicGate(qubit_indexs, circuit_depth, QFT)
        setTimeout(() => { UpdateRGate() }, 0);
    }
    else if (algorithm_class == "GHZ") {
        MosaicGate(qubit_indexs, circuit_depth, GHZ)
    }
    else if (algorithm_class == "Bell") {
        MosaicGate(qubit_indexs, circuit_depth, Bell)
    }
    setTimeout(() => {
        var draggablesvar = document.querySelectorAll(".draggable")
        draggableL(draggablesvar)
        totoaldrawqc(totoalqcinfor())
        UpdateData()
    }, 0);

}
