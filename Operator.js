//------
//Nov 6 2021
//Author Dormancy
//------
//Update Measure Operator
//March 2 2022
//------
const pi = math.pi
class SingleGateSets {
    constructor(n) {
        this.n = n;
        this.p = n;
    }

    X() {
        var i = math.complex(1, 0)
        var ret = math.matrix([[0, i], [i, 0]])
        return ret
    }
    Y() {
        var j = math.complex(0, 1)
        var ret = math.matrix([[0, math.multiply(j, -1)], [math.multiply(j, 1), 0]])
        return ret
    }
    Z() {
        var i = math.complex(1, 0)
        var ret = math.matrix([[i, 0], [0, math.multiply(i, -1)]])
        return ret
    }
    H() {
        var i = math.complex(1, 0)
        var m = math.multiply(i, math.pow(0.5, 0.5))
        var ret = math.matrix([[m, m], [m, -1 * m]])
        return ret
    }
    S() {
        var i = math.complex(1, 0)
        var j = math.complex(0, 1)
        var temp = math.exp(math.multiply(j, pi / 2))
        var ret = math.matrix([[i, 0], [0, temp]])
        return ret
    }
    T() {
        var i = math.complex(1, 0)
        var j = math.complex(0, 1)
        var temp = math.exp(math.multiply(j, pi / 4))
        var ret = math.matrix([[i, 0], [0, temp]])
        return ret
    }
    R(n) {
        var i = math.complex(1, 0)
        var j = math.complex(0, 1)
        var tmp = 2 * pi / math.pow(2, n)
        var u = math.exp(math.multiply(j, tmp))
        var ret = math.matrix([[i, 0], [0, u]])
        return ret
    }
    Project(n) {
        if (n == 0) {
            var ret = math.matrix([[1, 0], [0, 0]])
        }
        else {
            var ret = math.matrix([[0, 0], [0, 1]])
        }
        return ret
    }
    KrausX_Operator(p) {
        var ret = math.matrix([[p, 1 - p], [1 - p, p]])
        return ret
    }
    KrausY_Operator(p) {
        var Y = 1 - p
        var j = math.complex(0, 1)
        var jm = math.multiply(j, -1)
        var ret = math.matrix([[p, math.multiply(jm, Y)], [math.multiply(j, Y), p]])
        return ret
    }
    KrausZ_Operator(p) {
        var ret = math.matrix([[1, 0], [0, 2 * p - 1]])
        return ret
    }
}

function SelectGate(Gate) {
    var GateSets = new SingleGateSets()
    if (Gate.length > 7) {
        if (Gate.slice(0, 7) == "measure") {
            if (Gate.slice(7) == "true") {
                var str = "GateSets.Project(1)"
            }
            else {
                var str = "GateSets.Project(0)"
            }
        }
        else if (Gate.slice(4, 8) == "Filp") {
            var p = Gate.slice(8)
            var str = "GateSets.KrausX_Operator" + p
        }
        else if (Gate.slice(6, 10) == "Filp") {
            var p = Gate.slice(10)
            var str = "GateSets.KrausZ_Operator" + p
        }
        else if (Gate.slice(10, 14) == "Filp") {
            var p = Gate.slice(14)
            var str = "GateSets.KrausY_Operator" + p
        }

    }
    else {
        if (Gate.length > 1) {
            var str = "GateSets." + Gate[0] + `(${Gate[1]})`
        }
        else {
            var str = "GateSets." + Gate + "(0)"
        }
    }
    var ret = eval(str)
    return ret
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}


function i2b(int, n) {
    var value = parseInt(int).toString(2);
    var l = value.length;
    if (l < n) {
        for (var i = 0; i < n - l; i++) {
            value = "0" + value;
        }
    }
    return value
}

function init_vec(qubit) {
    var index = 0
    var len = qubit.length
    var n = math.pow(2, qubit.length)
    var state = math.zeros(n).valueOf()
    for (var i = 0; i < len; i++) {
        index += qubit[len - i - 1] * math.pow(2, i);
    }
    state[index] = 1
    return state
}

function sgo(vec_state, index, gate) {
    var sgate = SelectGate(gate)
    var n = vec_state.length
    var m = getBaseLog(2, n)
    var tmp = []
    for (var i = 0; i < n; i++) {
        var k = i + math.pow(2, (m - index - 1));
        if (tmp.indexOf(i) == -1) {
            var temp = math.zeros(2, 1)
            temp.valueOf()[0][0] = vec_state[i]
            temp.valueOf()[1][0] = vec_state[k]
            var state = math.multiply(sgate, temp)
            vec_state[i] = state.valueOf()[0][0]
            vec_state[k] = state.valueOf()[1][0]
            tmp.push(k)
        }
    }
    return vec_state
}


function cgo(vec_state, ctrl, targ, gate) {
    var sgate = SelectGate(gate)
    var n = vec_state.length
    var m = getBaseLog(2, n)
    var tmp = []
    for (var i = 0; i < n; i++) {
        var k = i + math.pow(2, (m - targ - 1));
        if (tmp.indexOf(i) == -1) {
            if (parseInt(i2b(i, m)[ctrl]) == 1) {
                var temp = math.zeros(2, 1)
                temp.valueOf()[0][0] = vec_state[i]
                temp.valueOf()[1][0] = vec_state[k]
                var state = math.multiply(sgate, temp)
                vec_state[i] = state.valueOf()[0][0]
                vec_state[k] = state.valueOf()[1][0]
                tmp.push(k)
            }
            else {
                tmp.push(k)
            }
        }
    }
    return vec_state
}
