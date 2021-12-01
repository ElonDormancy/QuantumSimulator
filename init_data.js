//------
//Nov 6 2021
//Author Dormancy
//------
function GetApplyList() {
    var len = document.querySelector(".cols").childElementCount
    var applylist = []
    for (var i = 0; i < len - 1; i++) {
        applylist.push([])
    }
    var sgs = totoalqcinfor()["sg"]
    var cgs = totoalqcinfor()["cg"]
    for (var sgate of sgs) {
        var tmp = sgate["gateinfor"]["xindex"]
        applylist[tmp].push(sgate)
    }
    for (var cgate of cgs) {
        var tmp = cgate["gateinfor"]["ctrl"]["xindex"]
        applylist[tmp].push(cgate)
    }
    return applylist
}


function DensityMatrix(ret) {
    var object = {
        labels: "",
        values: ""
    }
    var len = ret.length
    var n = getBaseLog(2, len)
    var M = []
    var qubit = []
    for (var i = 0; i < len; i++) {
        var rows = []
        for (var j = 0; j < len; j++) {
            rows[j] = NumtoA((math.multiply(ret[i], ret[j]))).toFixed(3)
        }

        qubit.push(i2b(i, n))
        M[i] = rows
    }
    object["labels"] = qubit
    object["values"] = M
    return object
}
function NumtoA(num) {
    if (typeof (num) == "number") {
        var am = math.pow(num, 2)
    }
    else {
        var am = math.pow(num.re, 2) + math.pow(num.im, 2)
    }
    return am
}

function GetFrequency(ret) {
    var normalized = []
    var len = ret.length
    for (var i = 0; i < len; i++) {
        var object = {
            qubit: "",
            frequency: "",
        }
        var n = getBaseLog(2, len)
        var q = i2b(i, n)
        object["qubit"] = q
        var a = ret[i]
        object["frequency"] = NumtoA(a)
        normalized.push(object)
    }
    return normalized
}


function GetInitQubits() {
    var qubits = document.querySelectorAll(".qubit")
    var init_state = []
    for (qubit of qubits) {
        var q = qubit.getAttribute("data-index")
        init_state.push(parseInt(q))
    }
    return init_state
}

function applygate(vec, applylist) {
    var vec_state = vec
    for (gates of applylist) {
        for (gate of gates) {
            if (gate["gateclass"] == "sg") {
                var gateinformation = gate["gateinfor"]
                var index = gateinformation["yindex"]
                var gateclass = gateinformation["gateclass"]
                vec_state = sgo(vec_state, index, gateclass)
            }
            else {
                var gateinformation = gate["gateinfor"]
                var ctrl = gateinformation["ctrl"]["yindex"]
                var targ = gateinformation["ctrlgate"]["yindex"]
                var gateclass = gateinformation["ctrlgate"]["gateclass"]
                vec_state = cgo(vec_state, ctrl, targ, gateclass)
            }
        }
    }
    return vec_state
}



