// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Copyright (c) Dormancy.
// Licensed under the MIT license.
//------
//Oct 30 2021
//Author Dormancy
//------
//Jan 2 2022
//Change the varibles names
//Add notes
//------
//Jan 7 2022
//Fix the bug
//1.No placement two cnot gate in the one cols
//And change the view perspective of the result
//Add notes
// ----------------------------------------------------------------
// ----------------------------------------------------------------


//Initialize the Parameter
//------
//Global Varibles
//qvizdraw
//droppablesvar
//draggablesvar
//qubits
//------

var qvizdraw = {
    qubits: [],
    operations: [],
};
function Init_algorithm() {
    var options = document.getElementById('example').children;
    options[0].selected = true
}
function chart_matrix_options(ret, text_exist) {
    var n = ret.length
    var m = getBaseLog(2, n)
    var chart_options = {
        text_exist: text_exist,
        container: "#Matrix",
        start_color: '#ffffff',
        end_color: '#d42517',
        width: 360,
        height: 360,
        margin: { top: 10, right: 10, bottom: 0, left: 15 * m },
        highlight_cell_on_hover: true,
        highlight_cell_color: '#69b3a2',
        labelmarginleft: -m * 16 / 2,
    };
    return chart_options
}
//Initialize the navigation bar
var Whether_View_Result = false
const qubit_number = 6
var num_gates = 2
const circuit_example = document.getElementById("example")
const gettheta = document.getElementById("Rtheta")
const getrows = document.getElementById("rowsinput")
const getcols = document.getElementById("colsinput")
const gatesets = document.querySelectorAll(".Gate_Sets")
const result_display = document.querySelector("#result_display")

var droppablesvar = document.querySelectorAll('.droppable')
var draggablesvar = document.querySelectorAll(".draggable")
var qubits = document.querySelectorAll(".qubit")
document.querySelector("#qvizarea").style.display = "none"
var folders = document.querySelectorAll(".folder")
for (var folder of folders) {
    folder.style.display = "block"
}
function projector()
{
    if(this.getAttribute("data-control")=="false")
    {
        this.setAttribute("data-control","true")
        this.style.background = "url(./images/Measure1.svg)";
    }
    else
    {
        this.setAttribute("data-control","false")
        this.style.background = "url(./images/Measure0.svg)";
    }
     //Update result
    UpdateData()
}

function AddMeasureListener()
{
    var ms = document.querySelectorAll('#measure');
    for(var m of ms)
    {
        m.addEventListener('click', projector)
    }
}
document.querySelector("#addrow").disabled = true;
document.querySelector("#addcol").disabled = true;
document.querySelector("#deleterow").disabled = true;
document.querySelector("#deletecol").disabled = true;
circuit_example.disabled = true;
getrows.value = 3
getcols.value = 5
gettheta.onfocus = function () {
    this.value = ""
};
gettheta.onblur = function () {
    if (this.value == "" || Number(this.value) > 1024 || Number(this.value) < 0) {
        this.value = ""
    }
    var n = Number(gettheta.value)
    if (!isNaN(n) && n > 0) {
        RthetaGate(n)
    }
}

getrows.onfocus = function () {
    if (this.value == "Rows") {
        this.value = ""
    }
};
getrows.onblur = function () {
    if (this.value == "") {
        this.value = "Rows"
    }
}
getcols.onfocus = function () {
    if (this.value == "Cols") {
        this.value = ""
    }
};

getcols.onblur = function () {
    if (this.value == "") {
        this.value = "Cols"
    }
}
//Count the number of element in array
function CountArray(arr, num) {
    var i = 0;
    arr.find(function (ele) {
        ele === num ? i++ : '';
    })
    return i
}

//str[HTML strings]=>append HTML nodes
function parseElement(str) {
    var o = document.createElement("div");
    o.innerHTML = str;
    return o.childNodes;
}
//HTML nodes=>str[HTML strings]
function stringIze(obj) {
    var o = document.createElement("div");
    o.append(obj);
    return o.innerHTML;
}



//BUTTON Start/restart_dragarea
btn.onclick = function () {
    var rows = getrows.value
    var cols = getcols.value
    if (rows != "Rows" && cols != "Cols") {
        restart_dragarea()
        var addrow = document.querySelector("#addrow")
        var addcol = document.querySelector("#addcol")
        var deleterow = document.querySelector("#deleterow")
        var deletecol = document.querySelector("#deletecol")
        document.querySelector("#qvizarea").style.display = "block"
        addrow.disabled = false
        addcol.disabled = false
        deleterow.disabled = false
        deletecol.disabled = false
        getcols.disabled = false
        getrows.disabled = false
        result_display.style.display = "block"
        circuit_example.disabled = false;
        setTimeout(() => {
            Initialize(rows, cols)
        }, 0);
    }
}
//==========================================================

//==========================================================
function restart_dragarea() {
    setTimeout(() => {
        var rows = document.querySelector("#Dragable_Area")
        rows.innerHTML = '<div class="cols"></div>'
        Init_algorithm()
    }, 0);
}

function Initialize(rows, cols) {
    qvizdraw = { qubits: [], operations: [] }
    var arr1 = [];
    arr1.push()
    for (var i = 0; i < cols; i++) {
        arr1.push(`<div class="droppable row" data-cols = "${i}"></div>`);
    }
    document.querySelector('.cols').innerHTML = arr1.join('');
    var arr2 = [];
    var temp = document.querySelector(".cols").innerHTML
    for (var i = 0; i < rows; i++) {
        arr2.push(`<div class="cols" data-rows = "${i}">` + `<img data-index="0" data-qindex="${i}" class="qubit" src="./images/ket0.svg" alt="\ket{0}" height="50px" width="50px" />` + temp.toString() + '</div>');
        qvizdraw["qubits"].push({ id: i, numChildren: 1 })
    }
    document.querySelector('#Dragable_Area').innerHTML = arr2.join('');
    setTimeout(() => {
        //CHANGE THE GLOBAL VARS
        droppablesvar = document.querySelectorAll('.droppable')
        //CHANGE THE GLOBAL VARS
        qubits = document.querySelectorAll(".qubit")
        //Add Listen to the drop block
        droplisten(droppablesvar)
        //Add Listen to the init qubits
        qubitreverse(qubits)
        //Update gate information
        totoaldrawqc(totoalqcinfor())
        //Update result
        compile()
    }, 0);
}

function addcol() {
    var colslen = document.querySelector(".cols").childElementCount
    if (colslen > 0) {
        document.querySelector("#deletecol").disabled = false;
    }
    var temp = document.getElementsByClassName("cols");
    for (var i = 0; i < temp.length; i++) {
        var o = document.createElement("div");
        o.className = "droppable row";
        o.setAttribute('data-cols', `${colslen - 1}`)
        temp[i].appendChild(o)
    }
    setTimeout(() => {
        //Init the algorithm
        Init_algorithm()
        //CHANGE THE GLOBAL VARS
        droppablesvar = document.querySelectorAll('.droppable')
        //Add listener to the cols added
        droplisten(droppablesvar)
        //Update gate information
        totoaldrawqc(totoalqcinfor())
        //Update result
        compile()
    }, 0);

}

function addrow() {
    var len = document.getElementsByClassName("cols").length
    if (len > 0) {
        document.querySelector("#deleterow").disabled = false;
    }
    var cols = document.querySelector(".cols").childElementCount
    var arr1 = [];
    var qubitnum = document.querySelectorAll(".qubit")
    arr1.push(`<img data-index="0" data-qindex="${qubitnum.length}" class="qubit" src="./images/ket0.svg" alt="\ket{0}" height="50px" width="50px" />`)
    for (var i = 0; i < cols - 1; i++) {
        arr1.push(`<div class="droppable row" data-cols = "${i}"></div>`);
    }
    let temp = arr1.join('');
    var o = document.createElement("div");
    o.className = "cols"
    for (var i = 0; i < parseElement(temp).length; i++) {
        var rowindex = document.getElementsByClassName("cols")
        o.setAttribute("data-rows", `${rowindex.length}`)
        o.append(parseElement(temp)[i]);
    }
    document.querySelector("#Dragable_Area").append(o)
    var qubits = qvizdraw["qubits"]
    var index = qubits[qubits.length - 1]["id"]
    qvizdraw["qubits"].push({ id: index + 1, numChildren: 1 })
    setTimeout(() => {
        //Init the algorithm
        Init_algorithm()
        //CHANGE THE GLOBAL VARS
        droppablesvar = document.querySelectorAll('.droppable')
        //CHANGE THE GLOBAL VARS
        qubits = document.querySelectorAll(".qubit")
        //Add Listen to the drop block
        droplisten(droppablesvar)
        //Add Listen to the init qubits
        qubitreverse(qubits)
        //Update gate information
        totoaldrawqc(totoalqcinfor())
        //Update result
        compile()
    }, 0);
}



function Remove_Single_Ctrl(x) {
    var draggables = document.querySelectorAll(".draggable")
    for (var i = 0; i < draggables.length; i++) {
        var sdrag = draggables[i];
        var order = sdrag.getAttribute("data-order")
        var gatectrl = sdrag.getAttribute("data-control")
        if (x == order && gatectrl == "true") {
            sdrag.remove()
        }
    }
}

function delete_single_ctrl_gate() {
    var tmp = []
    var draggables = document.querySelectorAll(".draggable")
    for (var dragging of draggables) {
        if (dragging.getAttribute("data-control") == "true" && dragging.getAttribute("id")!="measure") {
            tmp.push(dragging.getAttribute("data-order"))
        }
    }
    for (var i of tmp) {
        if (CountArray(tmp, i) < 2) {
            Remove_Single_Ctrl(i)
        }
    }
}

function deleterow() {
    var len = document.getElementsByClassName("cols").length
    if (len <= 2) {
        document.querySelector("#deleterow").disabled = true;
    }
    var temp = document.querySelectorAll(".cols");
    temp[len - 1].remove()
    var qubits = qvizdraw["qubits"]
    qubits.pop()
    qvizdraw["qubits"] = qubits//CHANGE THE GLOBAL VARS
    setTimeout(() => {
        compile()
        Init_algorithm()
        totoaldrawqc(totoalqcinfor())
        setTimeout(() => {
            delete_single_ctrl_gate()
        }, 0);
    }, 0);
}

function deletecol() {
    var colslen = document.querySelector(".cols").childElementCount
    if (colslen <= 3) {
        document.querySelector("#deletecol").disabled = true;
    }
    var temps = document.getElementsByClassName("cols")
    for (var i = 0; i < temps.length; i++) {
        var temp = temps[i].querySelectorAll(".row")
        var len = temp.length
        temp[len - 1].remove()
    }
    setTimeout(() => {
        delete_single_ctrl_gate()
        totoaldrawqc(totoalqcinfor())
        compile()
        Init_algorithm()
    }, 0);
}
//CLICK TO REVERSE THE QUBIT
function qubitreverse(qubits) {
    for (var qubit of qubits) {
        qubit.addEventListener('click', qreverse);
    }
}



function qreverse() {
    var row = this.parentNode.getAttribute("data-rows")
    var temp = document.querySelectorAll("#qvizdraw> svg >text")
    var qubit = temp[row]
    if (this.getAttribute("data-index") == 0) {
        this.setAttribute("src", "./images/ket1.svg")
        this.setAttribute("data-index", 1)
        qubit.innerHTML = "|1⟩"
        setTimeout(() => {
            UpdateData()
        }, 0);
    }
    else {
        this.setAttribute("src", "./images/ket0.svg")
        this.setAttribute("data-index", 0)
        qubit.innerHTML = "|0⟩"
        setTimeout(() => {
            UpdateData()
        }, 0);
    }
}

function Add_Rubbish_L() {
    var rubbish = document.querySelector(".rubbish")
    rubbish.addEventListener('dragover', dragOver);
    rubbish.addEventListener('dragleave', dragLeave);
    rubbish.addEventListener('dragenter', dragEnter);
    rubbish.addEventListener('drop', RubbishDrop);
}
Add_Rubbish_L()
function RubbishDrop(e) {
    e.preventDefault()
    this.className = "rubbish"
    var dragitem = document.querySelector(".dragging")
    var a = dragitem.parentElement
    var b = a.parentElement
    var c = b.parentElement
    if (c.id == "Dragable_Area") { dragitem.remove() }
}


function AddL(tmp) {
    tmp.addEventListener('dragover', dragOver);
    tmp.addEventListener('dragleave', dragLeave);
    tmp.addEventListener('dragenter', dragEnter);
    tmp.addEventListener('drop', dragDrop);
}

function RemoveL(tmp) {
    tmp.removeEventListener('dragover', dragOver);
    tmp.removeEventListener('dragleave', dragLeave);
    tmp.removeEventListener('dragenter', dragEnter);
    tmp.removeEventListener('drop', dragDrop);
}

// --------------------------Dragging Function-------------------
// --------------------------------------------------------------
//Add Listener of all drag
draggableL(draggablesvar)//Initize the function
function draggableL(temp) {
    for (var draggable of temp) {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
    }
}

function dragEnd() {
    delete_single_ctrl_gate()
    this.className = 'draggable';
    var nos = document.querySelectorAll(".noplacement")
    for (var no of nos) {
        no.className = "droppable row"
        AddL(no)
    }
    setTimeout(() => {
        Init_algorithm()
        draggablesvar = document.querySelectorAll(".draggable")
        draggableL(draggablesvar)
        totoaldrawqc(totoalqcinfor())
    }, 0);
}
//Add Listener of all drop
function droplisten(droppables) {
    for (const droppable of droppables) {
        AddL(droppable)
    }
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    if (this.className != "ctrlline row" || this.className != "rubbish") {
        this.className += ' drag-over';
    }

}

function dragLeave(e) {
    e.preventDefault();
    if ((this.className == "ctrlline row") || (this.className.includes('rubbish'))) {
        this.className = 'rubbish';
    }
    else {
        this.className = 'droppable row';
    }

}
function compile() {
    var len = document.getElementsByClassName("cols").length
    if (len > 12) {
        var draw = document.getElementById("histogram")
        draw.innerHTML = ""
    }
    else {
        var vec = init_vec(GetInitQubits())
        var ret = applygate(vec, GetApplyList())
        var alphabet = GetFrequency(ret)
        console.log(alphabet)
        var draw = document.getElementById("histogram")
        draw.innerHTML = ""
        chart = BarChart(alphabet, {
            x: d => d.qubit,
            y: d => d.frequency,
            yFormat: "%",
            yLabel: "↑ Frequency",
            height: 400,
            color: "#69b3a2"
        })
        var draw_m = document.getElementById("Matrix")
        draw_m.innerHTML = ""
        if (len < 5) {
            document.querySelector("#Density_Matrix").style.display = "inline-block";
            if (len > 3) {
                Matrix(DensityMatrix(ret), chart_matrix_options(ret, false))
            }
            else { Matrix(DensityMatrix(ret), chart_matrix_options(ret, Whether_View_Result)) }
        }
        else {
            document.querySelector("#Density_Matrix").style.display = "none"
        }
    }
}

var w_v_r = document.querySelector("#View_Result")

w_v_r.addEventListener("mousedown", function () {
    Whether_View_Result = true
    compile()
})

w_v_r.addEventListener("mouseup", function () {
    Whether_View_Result = false
    compile()
})

function UpdateData() {
    var len = document.getElementsByClassName("cols").length
    if (len > qubit_number) {
        return ""
    }
    else {
        var vec = init_vec(GetInitQubits())
        var ret = applygate(vec, GetApplyList())
        var alphabet = GetFrequency(ret)
        update = chart.update(alphabet, {
            x: d => d.qubit,
            y: d => d.frequency,
            yFormat: "%",
            yLabel: "↑ Frequency",
            height: 400,
            color: "#69b3a2"
        })
        var drawm = document.getElementById("Matrix")
        drawm.innerHTML = ""
        if (len < 5) {
            if (len > 3) {
                Matrix(DensityMatrix(ret), chart_matrix_options(ret, false))
            }
            else { Matrix(DensityMatrix(ret), chart_matrix_options(ret, Whether_View_Result)) }
        }
    }
}
function CheckContrlGate(cgs) {
    var c0 = cgs[0].childElementCount
    var c1 = cgs[1].childElementCount
    var check1 = (c0 == 1 && c1 == 0)
    var check2 = (c0 == 0 && c1 == 1)
    return check1 || check2
}



function dragDrop(e) {
    e.preventDefault()
    this.className = 'droppable row';
    var dragitem = document.querySelector(".dragging")
    var gateClass = dragitem.getAttribute("id")
    var whether_cgate = dragitem.getAttribute("data-control")
    dragitem.className = "draggable"
    if (whether_cgate == "true" && dragitem.getAttribute("id")!="measure") {
        var cgs = document.querySelector("#cnot").querySelectorAll(".gate")
        var crx = document.querySelector("#crx").querySelectorAll(".gate")
        if (CheckContrlGate(cgs)) {
            num_gates += 1
            cgs[0].innerHTML = `<div class="draggable" draggable="true" id="ctrl" data-control="true" data-order="${num_gates}"></div>`
            cgs[1].innerHTML = `<div class="draggable" draggable="true" data-c="controlgate" id="CtrlX" data-control="true" data-order="${num_gates}"></div>`
        }
        else if (CheckContrlGate(crx)) {
            num_gates += 1
            crx[0].innerHTML = `<div class="draggable" draggable="false" id="ctrl" data-control="true" data-order="${num_gates}"></div>`
            crx[1].innerHTML = `<div class="draggable" draggable="false" data-c="controlgate" id="CtrlRx" data-control="true" data-order="${num_gates}">`
        }
    }
    else {
        var sg = document.querySelector(".Single_Gates").querySelector("." + gateClass.toString())
        sg.innerHTML = (stringIze(dragitem))
        setTimeout(() => { delete_single_ctrl_gate() }, 0);
    }
    this.innerHTML = (stringIze(dragitem))
    setTimeout(() => {
        draggablesvar = document.querySelectorAll(".draggable")
        draggableL(draggablesvar)
        totoaldrawqc(totoalqcinfor())
        UpdateData()
        Init_algorithm()
        AddMeasureListener()
    }, 0);

}


// ----------------Draw The Quantum Circuit with Qviz--------------
// ----------------------------------------------------------------
function init_qubits() {
    var qubits_ls = []
    var qubits = document.querySelectorAll(".qubit")
    for (var qubit of qubits) {
        var init = qubit.getAttribute("data-index")
        qubits_ls.push(init)
    }
    return qubits_ls
}



//USE GLOBAL VAR
function drawQC() {
    if (typeof qviz != 'undefined') {
        var sampleDiv = document.getElementById('qvizdraw');
        qviz.draw(qvizdraw, sampleDiv, qviz.STYLES['Default']);
    }
    var qubits_ls = init_qubits()
    var rows = qubits_ls.length
    var temp = document.querySelectorAll("#qvizdraw> svg >text")
    for (var i = 0; i < rows; i++) {
        if (qubits_ls[i] == "0") { temp[i].innerHTML = "|0⟩" }
        else { temp[i].innerHTML = "|1⟩" }
    }

}

function Get_Item_Information(item) {
    var gate = item.getAttribute("id")
    var c = item.getAttribute("data-c")
    if (gate.length > 4 && c!="m") {
        gate = gate.slice(4)
    }
    var pcol = item.parentNode;
    var prow = pcol.parentNode;
    var x = pcol.getAttribute("data-cols");
    var y = prow.getAttribute("data-rows");
    var control = item.getAttribute("data-control");
    var order = item.getAttribute("data-order");
    var arr = { xindex: x, yindex: y, gateclass: gate, iscontrol: control, ctrlgate_order: order };
    return arr
}

//Draggables List => GateInformation
function GetCoordinates(draggables) {
    var gateinformation = []
    for (var drag_item of draggables) {
        var pcol = drag_item.parentNode;
        var x = pcol.getAttribute("data-cols");
        var arr = Get_Item_Information(drag_item)
        if (x != null) {
            gateinformation.push(arr)
        }
    }
    return gateinformation
}

//GateInformation = > DrawQVIZ
function totoaldrawqc(qcinfor) {
    var sgs = qcinfor["sg"]
    var cgs = qcinfor["cg"]
    var ms = qcinfor["measure"]
    var inforcontainer = []
    qvizdraw["operations"] = []
    var cols = document.querySelector(".cols").childElementCount
    for (var i = 0; i < cols - 1; i++) {
        var container = {
            index: 0,
            gates: [],
        }
        var everycol = []
        for (var j = 0; j < sgs.length; j++) {
            if (sgs[j]['gateinfor']["xindex"] == i.toString()) {
                everycol.push(sgs[j])
            }
        }
        for (var j = 0; j < ms.length; j++) {
            if (ms[j]['gateinfor']["xindex"] == i.toString()) {
                everycol.push(ms[j])
            }
        }
        for (var j = 0; j < cgs.length; j++) {
            if (cgs[j]['gateinfor']["ctrl"]["xindex"] == i.toString()) {
                everycol.push(cgs[j])
            }
        }
        container["index"] = i
        container["gates"] = everycol
        inforcontainer.push(container)
    }
    for (var i = 0; i < inforcontainer.length; i++) {
        for (var j = 0; j < inforcontainer[i]["gates"].length; j++) {
            var gs = inforcontainer[i]["gates"]
            var gateclass = gs[j]["gateclass"]
            var gateinfor = gs[j]["gateinfor"]
            if (gateclass == "sg") {
                var temp = {
                    gate: '',
                    targets: [],
                }
                temp["gate"] = gateinfor["gateclass"]
                temp["targets"] = [{ qId: gateinfor["yindex"] }]
                qvizdraw["operations"].push(temp)
            }
            if (gateclass == "cg") {
                var temp = {
                    gate: '',
                    isControlled: true,
                    controls: [],
                    targets: [],
                }
                temp["gate"] = gateinfor['ctrlgate']["gateclass"]
                temp["targets"] = [{ qId: gateinfor['ctrlgate']["yindex"] }]
                temp["controls"] = [{ qId: gateinfor['ctrl']["yindex"] }]
                qvizdraw["operations"].push(temp)
            }
            if(gateclass == "measure")
            {
                var temp = {
                    gate: '',
                    isMeasurement: true,
                    controls: [],
                    targets: [],
                }
                c = gateinfor["yindex"]
                temp["gate"] = gateinfor["gateclass"]
                temp["targets"] = [{ type: 1, qId: parseInt(c), cId: 0 }]
                temp["controls"] = [{ qId: parseInt(c) }]
                qvizdraw["operations"].push(temp)
            }
        }
    }
    drawQC()
}



function totoalqcinfor() {
    var gatecontainer =
    {
        sg: {},
        cg: {},
        measure:{},
    }
    var draggables = document.querySelectorAll(".draggable")
    var gateinformation = GetCoordinates(draggables)
    var ctrlsets = []
    var ctrlgatesets = []
    var ctrlgatescontainer = []
    var singlegatecontainer = []
    var measurecontainer = []
    for(var e of gateinformation)
    {
        if(e["gateclass"] =="measure")
        {
            var temp = {
                gateclass:"measure",
                gateinfor:e,
            }
            measurecontainer.push(temp)
        }
    }
    for (var sgate of gateinformation) {
        if (sgate['iscontrol'] == "false" && sgate["gateclass"] != "measure") {
            var temp = {
                gateclass: 'sg',
                gateinfor: sgate,
            }
            singlegatecontainer.push(temp)
        }
        else {
            if (sgate["gateclass"] == "ctrl") {
                ctrlsets.push(sgate)
            }
            else { ctrlgatesets.push(sgate) }
            for (var i = 0; i < ctrlsets.length; i++) {
                for (var j = 0; j < ctrlgatesets.length; j++) {
                    var ctrlindex = ctrlsets[i]["xindex"]
                    var ctrlgateindex = ctrlgatesets[j]["xindex"]
                    if (ctrlindex == ctrlgateindex && (ctrlsets[i]["ctrlgate_order"] == ctrlgatesets[j]["ctrlgate_order"])) {
                        var temp = {
                            ctrl: ctrlsets[i],
                            ctrlgate: ctrlgatesets[j]
                        }
                        var tmp = {
                            gateclass: 'cg',
                            gateinfor: temp,
                        }
                        if (JSON.stringify(ctrlgatescontainer).indexOf(JSON.stringify(temp)) == -1) {
                            ctrlgatescontainer.push(tmp); // Available
                        }
                    }
                }
            }
        }
    }
    gatecontainer['sg'] = singlegatecontainer
    gatecontainer['cg'] = ctrlgatescontainer
    gatecontainer['measure'] = measurecontainer
    ctrlplace(ctrlgatescontainer)
    return gatecontainer
}

function ctrlplace(ctrlgatescontainer) {
    remove_ctrlline()
    for (var c of ctrlgatescontainer) {
        var cg = c["gateinfor"]
        add_ctrlline(cg["ctrl"]["xindex"], cg["ctrl"]["yindex"], cg["ctrlgate"]["yindex"], cg["ctrlgate"]["ctrlgate_order"], cg["ctrl"]["ctrlgate_order"])
    }
}

function add_ctrlline(index_x, ctrl_y, ctrlgate_y, ctrl_order, ctrl_gate_order) {
    var droppables = document.querySelectorAll(".droppable")
    for (var drop of droppables) {
        var x = drop.getAttribute("data-cols")
        var temp = drop.parentNode
        var y = parseInt(temp.getAttribute("data-rows"))
        var check1 = (y > parseInt(ctrl_y) && y < parseInt(ctrlgate_y))
        var check2 = (y < parseInt(ctrl_y) && y > parseInt(ctrlgate_y))
        var checkout = (check1 || check2)
        if ((x == index_x && checkout) && (ctrl_order == ctrl_gate_order)) {
            drop.className = "ctrlline row"
            drop.removeEventListener('dragover', dragOver);
            drop.removeEventListener('dragleave', dragLeave);
            drop.removeEventListener('dragenter', dragEnter);
            drop.removeEventListener('drop', dragDrop);
        }
    }
}
//When the two control gate are not in a col,remove the ctrlline
function remove_ctrlline() {
    var ctrlline_placements = document.querySelectorAll(".ctrlline")
    for (var ctrlline of ctrlline_placements) {
        ctrlline.className = "droppable row"
        AddL(ctrlline)
    }
}

function activate_ctrlline(col) {
    var lines = document.querySelectorAll(".ctrlline")
    for (line of lines) {
        if (line.getAttribute("data-cols") == col) {
            AddL(line)
        }
    }
}
function ProhibitedCol(col) {
    var droppables = document.querySelectorAll(".droppable")
    for (var drop of droppables) {
        var x = drop.getAttribute("data-cols")
        var element = drop.childElementCount
        if (x == col && (element == 0)) {
            drop.className = "noplacement"
            drop.removeEventListener('dragover', dragOver);
            drop.removeEventListener('dragleave', dragLeave);
            drop.removeEventListener('dragenter', dragEnter);
            drop.removeEventListener('drop', dragDrop);
        }
    }
}
//Check what you are dragging whether has the matched ctrl gate in the same cols
function CheckColCG(item) {
    var whether_cgate = item.getAttribute("data-control")
    var whether_measure = item.getAttribute("id")
    var result = false
    if (whether_cgate == "true" && whether_measure != "measure") {
        var item_parentNode = item.parentNode;
        var p_parentNode = item_parentNode.parentNode;
        var check_row = p_parentNode.getAttribute("data-rows")
        var check_col = item_parentNode.getAttribute("data-cols")
        var check_order = item.getAttribute("data-order")
        var draggables = document.querySelectorAll(".draggable")
        for (drag_item of draggables) {
            var order = drag_item.getAttribute("data-order")
            var col_temp = drag_item.parentNode
            var row_temp = col_temp.parentNode
            var col = col_temp.getAttribute("data-cols")
            var row = row_temp.getAttribute("data-rows")
            if ((check_order == order && check_col == col) && (check_row != row)) {
                result = true
                break
            }
        }
    }
    return result
}



function dragStart() {
    this.className += ' dragging';
    var col_temp = this.parentNode;
    var this_col = col_temp.getAttribute("data-cols")
    var all_draggables = document.querySelectorAll(".draggable")
    var tmp = []
    if (this.getAttribute("data-control") == "false" || this.getAttribute("id") == "measure") {
        var nos = document.querySelectorAll(".ctrlline")
        for (var no of nos) {
            no.className = "noplacement"
        }
    }
    else {
        var area = document.querySelector("#Dragable_Area")
        var area_draggables = area.querySelectorAll(".draggable")
        for (var dragging of area_draggables) {
            if (dragging.getAttribute("data-control") == "true") {
                tmp.push(dragging.getAttribute("data-order"))
            }
        }
        for (var drag_item of all_draggables) {
            var drag_item_parentNode = drag_item.parentNode;
            var everycol = drag_item_parentNode.getAttribute("data-cols")
            var everyorder = drag_item.getAttribute("data-order")
            if (CountArray(tmp, everyorder) == 2 && CheckColCG(drag_item)) {
                if (this_col != everycol) {
                    ProhibitedCol(everycol)
                }
            }
        }
        activate_ctrlline(this_col)
    }
}

function GenerateRxBackground(n) {
    var ret = `<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><g><rect id="svg_1" height="50" width="50" y="0" x="0" stroke-width="3" stroke="#000" fill="#ccccd6"/><text style="cursor: move;" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_3" y="32.997583" x="10.33415" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">R</text><text style="cursor: move;" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="12" id="svg_3" y="32.997583" x="28" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">${n}</text></g></svg>`
    return ret
}


function RthetaGate(n) {
    var rxgate = document.querySelector("#crx > div.gate.CtrlRx > div");
    var encoded = window.btoa(GenerateRxBackground(n));
    document.querySelector("#crx > div.gate.ctrl > div").setAttribute("draggable", "true");
    rxgate.setAttribute("draggable", "true");
    rxgate.style.background = "url(data:image/svg+xml;base64," + encoded + ")";
    rxgate.id = `CtrlR${n}`
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


// ----------------------------------------------------------------
// ----------------------------------------------------------------