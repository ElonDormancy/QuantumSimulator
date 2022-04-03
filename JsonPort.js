document.querySelector('#exportJSON').onclick = function (evt) {
    evt.preventDefault();
    var qubits_ls = init_qubits()
    var gate_ls = GetApplyList()
    var out = {
        init_qubits: qubits_ls,
        gate_apply_list:gate_ls
    }
    var blob = new Blob([JSON.stringify(out)]);
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Applylist.json';
    a.click();
};


<<<<<<< HEAD
document.querySelector('#exportJSON_applylist').onclick = function (evt) {
    evt.preventDefault();
    var qubits_ls = init_qubits()
    var normalized_infor = GetApplyList()
    var out = {
        init_qubits: qubits_ls,
        gate_information: normalized_infor
    }
    var blob = new Blob([JSON.stringify(out)]);
    var url = URL.createObjectURL(blob);
=======
function save_img(){
    var svg_img = document.querySelector("#qvizdraw > svg")
    var svgXml = svg_img.outerHTML
    var image = new Image();
    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)));
>>>>>>> c9950e35f40d954b6665680b656f987c5984bc38
    var a = document.createElement('a');
    a.href = image.src
    a.download = "Quantum_Circuit";
    a.click()
}

<<<<<<< HEAD
function export_qcinfor(qcinfor) {
    var qubits_ls = init_qubits()
    var sgs = qcinfor["sg"]
    var cgs = qcinfor["cg"]
    var measures = qcinfor["measure"]
    var normalized_infor = {
        init_qubits: qubits_ls,
        single_gate_sets: {},
        control_gate_sets: {},
        measure_sets: {},
    }
    var ctrlgatesets = []
    var singlegatesets = []
    var measuresets = []
    for (var m of measures) {
        var measure_operator = {
            cols: 0,
            rows: 0,
            gateclass: 0,
            project: "false"
        }
        var information = m["gateinfor"]
        measure_operator["cols"] = information["xindex"]
        measure_operator["rows"] = information["yindex"]
        measure_operator["gateclass"] = information["gateclass"]
        measure_operator["project"] = information["iscontrol"]
        measuresets.push(measure_operator)
    }
    for (var sg of sgs) {
        var single_gate = {
            cols: 0,
            rows: 0,
            gateclass: 0,
=======


function import_qcinfor(content){
    var qubits_ls = content["init_qubits"]
    var Quantum_Circuit = content["gate_apply_list"]
    var sgs = []
    var cgs = []
    var mss = []
    for(var depth of Quantum_Circuit)
    {
        for(var qubit_information of depth)
        {
            if (qubit_information["gateclass"] == "sg")
            {
                var sg_information = qubit_information["gateinfor"]
                var single_gate_information = {
                    circuit_depth:0,
                    qubit_indexs:0,
                    gateclass:""
                }
                single_gate_information["circuit_depth"] = sg_information["circuit_depth_index"]
                single_gate_information["qubit_indexs"] = sg_information["qubit_number_index"]
                single_gate_information["gateclass"] = sg_information["gateclass"]
                sgs.push(single_gate_information)
            }
            else if (qubit_information["gateclass"] == "cg")
            {
                var control_information_input = qubit_information["gateinfor"]
                var ctrl_information = {
                    circuit_depth:control_information_input["ctrl"]["circuit_depth_index"],
                    qubit_indexs:control_information_input["ctrl"]["qubit_number_index"],
                    gateclass:"ctrl"
                }
                var ctrl_gate_information = {
                    circuit_depth:control_information_input["ctrlgate"]["circuit_depth_index"],
                    qubit_indexs:control_information_input["ctrlgate"]["qubit_number_index"],
                    gateclass:control_information_input["ctrlgate"]["gateclass"]
                }
                var control_gate_group_information = {
                    ctrl:ctrl_information,
                    ctrlgate:ctrl_gate_information
                }
                cgs.push(control_gate_group_information)
            }
            else if (qubit_information["gateclass"] == "measure")
            {
                var measure_input = qubit_information["gateinfor"]
                var measure_information = {
                    circuit_depth:measure_input["circuit_depth_index"],
                    qubit_indexs:measure_input["qubit_number_index"],
                    gateclass:"measure",
                    projects:measure_input["iscontrol"]
                }
                mss.push(measure_information)
            }
>>>>>>> c9950e35f40d954b6665680b656f987c5984bc38
        }
    }
    var normalized_infor = {
        init_qubits: qubits_ls,
        single_gate_sets: sgs,
        control_gate_sets: cgs,
        measure_sets:mss,
    }
    return normalized_infor
}



function render_init(qcinfor, maxcircuit_depth, maxqubit_indexs) {
    var sgs = qcinfor["single_gate_sets"]
    var cgs = qcinfor["control_gate_sets"]
    var ms = qcinfor["measure_sets"]
<<<<<<< HEAD
    for (var m of ms) {
        var m_cols = m["cols"]
        var m_rows = m["rows"]
        if (parseInt(m_cols) > parseInt(maxcols)) {
            maxcols = m_cols
=======
    for (var m of ms)
    {
        var m_circuit_depth = m["circuit_depth"]
        var m_qubit_indexs = m["qubit_indexs"]
        if (parseInt(m_circuit_depth) > parseInt(maxcircuit_depth)) {
            maxcircuit_depth = m_circuit_depth
>>>>>>> c9950e35f40d954b6665680b656f987c5984bc38
        }
        if (parseInt(m_qubit_indexs) > parseInt(maxqubit_indexs)) {
            maxqubit_indexs = m_qubit_indexs
        }
    }
    for (var sg of sgs) {
        var sg_circuit_depth = sg["circuit_depth"]
        var sg_qubit_indexs = sg["qubit_indexs"]
        if (parseInt(sg_circuit_depth) > parseInt(maxcircuit_depth)) {
            maxcircuit_depth = sg_circuit_depth
        }
        if (parseInt(sg_qubit_indexs) > parseInt(maxqubit_indexs)) {
            maxqubit_indexs = sg_qubit_indexs
        }
    }
    for (var cg of cgs) {
        var ctrl = cg["ctrl"]
        var ctrlgate = cg["ctrlgate"]
        var ctrl_circuit_depth = ctrl["circuit_depth"]
        var ctrl_qubit_indexs = ctrl["qubit_indexs"]
        var ctrlgate_circuit_depth = ctrlgate["circuit_depth"]
        var ctrlgate_qubit_indexs = ctrlgate["qubit_indexs"]
        if (parseInt(ctrl_circuit_depth) > parseInt(maxcircuit_depth)) {
            maxcircuit_depth = ctrl_circuit_depth
        }
        if (parseInt(ctrlgate_circuit_depth) >= parseInt(maxcircuit_depth)) {
            maxcircuit_depth = ctrlgate_circuit_depth
        }
        if (parseInt(ctrl_qubit_indexs) > parseInt(maxqubit_indexs)) {
            maxqubit_indexs = ctrl_qubit_indexs
        }
        if (parseInt(ctrlgate_qubit_indexs) > parseInt(maxqubit_indexs)) {
            maxqubit_indexs = ctrlgate_qubit_indexs
        }
    }
    Initialize(parseInt(maxqubit_indexs) + 1, parseInt(maxcircuit_depth) + 1)
}


function qcinfor_render(qcinfor, maxqubit_indexs = 0, maxcircuit_depth = 0) {
    render_init(qcinfor, maxcircuit_depth, maxqubit_indexs)
    var init_qubits = qcinfor["init_qubits"]
    var qubits = document.querySelectorAll(".qubit")
    for (var i = 0; i < qubits.length; i++) {
        qubits[i].setAttribute("data-index", init_qubits[i])
        qubits[i].setAttribute("src", "./images/ket" + init_qubits[i] + ".svg")
    }
    var gate = new GateSet()
    var sgs = qcinfor["single_gate_sets"]
    var cgs = qcinfor["control_gate_sets"]
    var ms = qcinfor["measure_sets"]
    var area = document.querySelector("#Dragable_Area")
    var droppables = area.querySelectorAll(".qubit_index")
    for (var drop of droppables) {
        var tmp = drop.parentNode
<<<<<<< HEAD
        var rows = tmp.getAttribute("data-rows")
        var cols = drop.getAttribute("data-cols")
        for (var m of ms) {
            var m_cols = m["cols"]
            var m_rows = m["rows"]
            if (m_cols == cols && m_rows == rows) {
                var project = m["project"]
                var element = "gate.measure(" + project + ")"
=======
        var qubit_indexs = tmp.getAttribute("data-qubit_indexs")
        var circuit_depth = drop.getAttribute("data-circuit_depth")
        for (var m of ms)
        {
            var m_circuit_depth = m["circuit_depth"]
            var m_qubit_indexs = m["qubit_indexs"]
            if (m_circuit_depth == circuit_depth && m_qubit_indexs == qubit_indexs) {
                var project = m["projects"]
                var element = "gate.measure("+project+")"
>>>>>>> c9950e35f40d954b6665680b656f987c5984bc38
                drop.innerHTML = eval(element)

            }
            var measurement = document.querySelectorAll("#measure")
            for (var i of measurement) {
                if (i.getAttribute("data-control") == "true") {
                    i.style.background = "url(./images/Measure1.svg)";
                }
                else {
                    i.setAttribute("data-control", "false")
                    i.style.background = "url(./images/Measure0.svg)";
                }
            }
        }
        for (var sg of sgs) {
            var sg_circuit_depth = sg["circuit_depth"]
            var sg_qubit_indexs = sg["qubit_indexs"]
            if (sg_circuit_depth == circuit_depth && sg_qubit_indexs == qubit_indexs) {
                var gateclass = sg["gateclass"]
                var element = "gate." + gateclass + "Block"
                drop.innerHTML = eval(element)
            }
        }
        for (var cg of cgs) {
            var ctrl = cg["ctrl"]
            var ctrlgate = cg["ctrlgate"]
            var order = cg["order"]
            var ctrl_circuit_depth = ctrl["circuit_depth"]
            var ctrl_qubit_indexs = ctrl["qubit_indexs"]
            var ctrlgate_circuit_depth = ctrlgate["circuit_depth"]
            var ctrlgate_qubit_indexs = ctrlgate["qubit_indexs"]
            if (ctrl_circuit_depth == circuit_depth && ctrl_qubit_indexs == qubit_indexs) {
                var gateclass = ctrl["gateclass"]
                var normalized_gateclass = gateclass.slice(0, 1).toUpperCase() + gateclass.slice(1).toLowerCase();
                var element = "gate." + normalized_gateclass + "Dot" + `(${order})`
                drop.innerHTML = eval(element)
            }
            if (ctrlgate_circuit_depth == circuit_depth && ctrlgate_qubit_indexs == qubit_indexs) {
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
    var addqubit_index = document.querySelector("#addqubit_index")
    var addcircuit_depth = document.querySelector("#addcircuit_depth")
    var deletequbit_index = document.querySelector("#deletequbit_index")
    var deletecircuit_depth = document.querySelector("#deletecircuit_depth")
    addqubit_index.disabled = false
    addcircuit_depth.disabled = false
    deletequbit_index.disabled = false
    deletecircuit_depth.disabled = false
    getcircuit_depth.disabled = false
    getqubit_indexs.disabled = false
    result_display.style.display = "block"
    document.querySelector("#qvizarea").style.display = "block"
    circuit_example.disabled = false;
    setTimeout(() => {
        UpdateRGate()
        var draggablesvar = document.querySelectorAll(".draggable")
        draggableL(draggablesvar)
        totoaldrawqc(totoalqcinfor())
        compile()
        AddMeasureListener()
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
            var content = import_qcinfor((JSON.parse(evt.target.result)))
            qcinfor_render(content);
        };
        reader.readAsText(evt.target.files[0]);
    };
    input.click();
};