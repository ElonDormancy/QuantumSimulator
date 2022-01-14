document.querySelector('#exportJSON').onclick = function (evt) {
    evt.preventDefault();
    var out = export_qcinfor(totoalqcinfor())
    var blob = new Blob([JSON.stringify(out)]);
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
};

function export_qcinfor(qcinfor) {
    var qubits_ls = init_qubits()
    var sgs = qcinfor["sg"]
    var cgs = qcinfor["cg"]
    var normalized_infor = {
        init_qubits: qubits_ls,
        single_gate_sets: {},
        control_gate_sets: {}
    }
    var ctrlgatesets = []
    var singlegatesets = []
    for (sg of sgs) {
        var single_gate = {
            cols: 0,
            rows: 0,
            gateclass: 0,
        }
        var information = sg["gateinfor"]
        single_gate["cols"] = information["xindex"]
        single_gate["rows"] = information["yindex"]
        single_gate["gateclass"] = information["gateclass"]
        singlegatesets.push(single_gate)
    }
    for (cg of cgs) {
        var control_gate = {
            ctrl: {},
            ctrlgate: {},
            order: 0,
        }
        var CtrlDot = {
            cols: 0,
            rows: 0,
            gateclass: 0,
        }
        var CtrlGate = {
            cols: 0,
            rows: 0,
            gateclass: 0,
        }
        var information = cg["gateinfor"]
        var ctrl = information["ctrl"]
        CtrlDot["cols"] = ctrl["xindex"]
        CtrlDot["rows"] = ctrl["yindex"]
        CtrlDot["gateclass"] = ctrl["gateclass"]
        var ctrlgate = information["ctrlgate"]
        CtrlGate["cols"] = ctrlgate["xindex"]
        CtrlGate["rows"] = ctrlgate["yindex"]
        CtrlGate["gateclass"] = ctrlgate["gateclass"]
        order = ctrlgate["ctrlgate_order"]
        control_gate["ctrl"] = CtrlDot
        control_gate["ctrlgate"] = CtrlGate
        control_gate["order"] = order
        ctrlgatesets.push(control_gate)
    }
    normalized_infor["single_gate_sets"] = singlegatesets
    normalized_infor["control_gate_sets"] = ctrlgatesets
    return normalized_infor
}

function render_init(qcinfor) {
    var maxcols = 0
    var maxrows = 0
    var sgs = qcinfor["single_gate_sets"]
    var cgs = qcinfor["control_gate_sets"]
    for (sg of sgs) {
        var sg_cols = sg["cols"]
        var sg_rows = sg["rows"]
        if (parseInt(sg_cols) > parseInt(maxcols)) {
            maxcols = sg_cols
        }
        if (parseInt(sg_rows) > parseInt(maxrows)) {
            maxrows = sg_rows
        }
    }
    for (cg of cgs) {
        var ctrl = cg["ctrl"]
        var ctrlgate = cg["ctrlgate"]
        var ctrl_cols = ctrl["cols"]
        var ctrl_rows = ctrl["rows"]
        var ctrlgate_cols = ctrlgate["cols"]
        var ctrlgate_rows = ctrlgate["rows"]
        if (parseInt(ctrl_cols) > parseInt(maxcols)) {
            maxcols = ctrl_cols
        }
        if (parseInt(ctrlgate_cols) >= parseInt(maxcols)) {
            maxcols = ctrlgate_cols
        }
        if (parseInt(ctrl_rows) > parseInt(maxrows)) {
            maxrows = ctrl_rows
        }
        if (parseInt(ctrlgate_rows) > parseInt(maxrows)) {
            maxrows = ctrlgate_rows
        }
    }
    console.log(parseInt(maxrows) + 1)
    console.log(parseInt(maxcols) + 1)
    Initialize(parseInt(maxrows) + 1, parseInt(maxcols) + 1)
}


function qcinfor_render(qcinfor) {
    render_init(qcinfor)
    var init_qubits = qcinfor["init_qubits"]
    var qubits = document.querySelectorAll(".qubit")
    for (var i = 0; i < qubits.length; i++) {
        qubits[i].setAttribute("data-index", init_qubits[i])
        qubits[i].setAttribute("src", "./images/ket" + init_qubits[i] + ".svg")
    }
    var gate = new GateSet()
    var sgs = qcinfor["single_gate_sets"]
    var cgs = qcinfor["control_gate_sets"]
    var area = document.querySelector("#Dragable_Area")
    var droppables = area.querySelectorAll(".row")
    for (var drop of droppables) {
        var tmp = drop.parentNode
        var rows = tmp.getAttribute("data-rows")
        var cols = drop.getAttribute("data-cols")
        for (sg of sgs) {
            var sg_cols = sg["cols"]
            var sg_rows = sg["rows"]
            if (sg_cols == cols && sg_rows == rows) {
                var gateclass = sg["gateclass"]
                var element = "gate." + gateclass + "Block"
                drop.innerHTML = eval(element)
            }
        }
        for (cg of cgs) {
            var ctrl = cg["ctrl"]
            var ctrlgate = cg["ctrlgate"]
            var order = cg["order"]
            var ctrl_cols = ctrl["cols"]
            var ctrl_rows = ctrl["rows"]
            var ctrlgate_cols = ctrlgate["cols"]
            var ctrlgate_rows = ctrlgate["rows"]
            if (ctrl_cols == cols && ctrl_rows == rows) {
                var gateclass = ctrl["gateclass"]
                var normalized_gateclass = gateclass.slice(0, 1).toUpperCase() + gateclass.slice(1).toLowerCase();
                var element = "gate." + normalized_gateclass + "Dot" + `(${order})`
                drop.innerHTML = eval(element)
            }
            if (ctrlgate_cols == cols && ctrlgate_rows == rows) {
                var gateclass = ctrlgate["gateclass"]
                if (gateclass.length > 1) {
                    var gate_name = gateclass.slice(0, 1)
                    var number = parseInt(gateclass.slice(1))
                    var element = "gate." + "Ctrl" + gate_name + `(${number},${order})`
                }
                else {
                    var element = "gate." + "Ctrl" + gateclass + `(${order})`
                }
                drop.innerHTML = eval(element)
            }
        }
    }
    var addrow = document.querySelector("#addrow")
    var addcol = document.querySelector("#addcol")
    var deleterow = document.querySelector("#deleterow")
    var deletecol = document.querySelector("#deletecol")
    addrow.disabled = false
    addcol.disabled = false
    deleterow.disabled = false
    deletecol.disabled = false
    getcols.disabled = false
    getrows.disabled = false
    result_display.style.display = "block"
    circuit_example.disabled = false;
    setTimeout(() => {
        UpdateRGate()
        var draggablesvar = document.querySelectorAll(".draggable")
        draggableL(draggablesvar)
        totoaldrawqc(totoalqcinfor())
        compile()
    }, 0);
}


document.querySelector('#importJSON').onclick = function (evt) {
    evt.preventDefault();
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = function (evt) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            if (evt.target.readyState !== FileReader.DONE) {
                return;
            }
            qcinfor_render((JSON.parse(evt.target.result)));
        };
        reader.readAsText(evt.target.files[0]);
    };
    input.click();
};