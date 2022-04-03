//Drag and drop to draw a area to select gates
document.onmousedown = function (event) {
    if (event.button == 0 && event.ctrlKey) {
        let shiftX = event.clientX + document.documentElement.scrollLeft;
        let shiftY = event.clientY + document.documentElement.scrollTop;
        var select_area = document.createElement("div");
        select_area.style.position = 'absolute';
        select_area.style.zIndex = 1000;
        select_area.className = "drag_section"
        select_area.style.backgroundcircuit_depthor = "black"
        select_area.style.opacity = "0.1"
        select_area.style.left = shiftX + 'px';
        select_area.style.top = shiftY + 'px';
        window.document.body.appendChild(select_area);
        //Justify the drag direction
        function moveAt(pageX, pageY) {
            let x = pageX - shiftX
            let y = pageY - shiftY
            select_area.style.transformOrigin = "top left";
            if (x >= 0 && y >= 0) {
                select_area.style.width = math.abs(x) + 'px';
                select_area.style.height = math.abs(y) + 'px';
                select_area.style.transform = 'scale(1,1)';
            }
            else if (x < 0 && y < 0) {
                select_area.style.width = math.abs(x) + 'px';
                select_area.style.height = math.abs(y) + 'px';
                select_area.style.transform = 'scale(-1,-1)';
            }
            else if (x > 0 && y < 0) {
                select_area.style.width = math.abs(x) + 'px';
                select_area.style.height = math.abs(y) + 'px';
                select_area.style.transform = 'scale(1,-1)';
            }
            else if (x < 0 && y > 0) {
                select_area.style.width = math.abs(x) + 'px';
                select_area.style.height = math.abs(y) + 'px';
                select_area.style.transform = 'scale(-1,1)';
            }
            Selected_Gate(shiftX, shiftY, x, y)
        }
        //When mousemove,draw the area in the document
        document.addEventListener('mousemove', onMouseMove);
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
            select_area.remove()
            var area = document.querySelector("#Dragable_Area")
            var draggables = area.querySelectorAll(".draggable")
            var Whether_Selected = false
            for (var drag_item of draggables) {
                if (drag_item.className == "draggable selected") {
                    Whether_Selected = true
                    break
                }
            }
            if (Whether_Selected) {
                setTimeout(() => {
                    Gate_Pack()
                }, 0);
            }
        }
    }
}
//Return the item the same circuit_depth of ctrl gate
function circuit_depthCG(item) {
    var item_parentNode = item.parentNode;
    var p_parentNode = item_parentNode.parentNode;
    var check_qubit_index = p_parentNode.getAttribute("data-qubit_indexs")
    var check_circuit_depth = item_parentNode.getAttribute("data-circuit_depth")
    var check_order = item.getAttribute("data-order")
    var draggables = document.querySelectorAll(".draggable")
    for (drag_item of draggables) {
        var order = drag_item.getAttribute("data-order")
        var circuit_depth_temp = drag_item.parentNode
        var qubit_index_temp = circuit_depth_temp.parentNode
        var circuit_depth = circuit_depth_temp.getAttribute("data-circuit_depth")
        var qubit_index = qubit_index_temp.getAttribute("data-qubit_indexs")
        if ((check_order == order && check_circuit_depth == circuit_depth) && (check_qubit_index != qubit_index)) {
            return drag_item
        }
    }
}
//Change the class of the gate=>"selected" in the area,which draws above
function Selected_Gate(shiftX, shiftY, width, height) {
    var area = document.querySelector("#Dragable_Area")
    var draggables = area.querySelectorAll(".draggable")
    for (drag_item of draggables) {
        var x = drag_item.getBoundingClientRect().left - shiftX + document.documentElement.scrollLeft;
        var y = drag_item.getBoundingClientRect().top - shiftY + document.documentElement.scrollTop;
        if (width >= 0 && height >= 0) {
            if ((x > 0 && x <= width) && (y > 0 && y <= height)) {
                drag_item.className = "draggable selected"
            }
        }
        else if (width > 0 && height < 0) {
            if (x > 0 && y < 0 && x < width && y > height) {
                drag_item.className = "draggable selected"
            }
        }
        else if (width < 0 && height > 0) {
            if (x < 0 && y > 0 && x > width && y < height) {
                drag_item.className = "draggable selected"
            }
        }
        else if (width < 0 && height < 0) {
            if (x < 0 && y < 0 && x > width && y > height) {
                drag_item.className = "draggable selected"
            }
        }
    }
    setTimeout(() => {
        var draggables = area.querySelectorAll(".draggable")
        for (drag_item of draggables) {
            if (Checkcircuit_depthCG(drag_item) && drag_item.className == "draggable selected") {
                circuit_depthCG(drag_item).className = "draggable selected"
            }
        }
    }, 0);

}
//Visualize the area
function Pack_Element(min_x, max_x, min_y, max_y) {
    var width = math.round(math.abs(max_x - min_x)) + 50
    var height = math.round(math.abs(max_y - min_y)) + 50
    var selects = document.createElement("div");
    selects.style.position = 'absolute';
    selects.className = "gate_package"
    selects.style.zIndex = 500;
    selects.style.width = width + 'px'
    selects.style.height = height + 'px'
    selects.style.left = min_x + 'px';
    selects.style.top = min_y + 'px';
    var add_qubit_indexs = document.createElement("span");
    var del_qubit_indexs = document.createElement("span");
    var add_circuit_depth = document.createElement("span");
    var del_circuit_depth = document.createElement("span");
    add_qubit_indexs.className = "adjust_package_ar"
    add_circuit_depth.className = "adjust_package_ac"
    del_qubit_indexs.className = "adjust_package_dr"
    del_circuit_depth.className = "adjust_package_dc"
    Add_hover(add_qubit_indexs)
    Add_hover(add_circuit_depth)
    Add_hover(del_qubit_indexs)
    Add_hover(del_circuit_depth)
    var click_close = document.createElement("div");
    click_close.className = "click_close"
    click_close.addEventListener("click", close)
    add_qubit_indexs.addEventListener("click", package_ar)
    add_circuit_depth.addEventListener("click", package_ac)
    del_qubit_indexs.addEventListener("click", package_dr)
    del_circuit_depth.addEventListener("click", package_dc)
    del_qubit_indexs.addEventListener("mouseover", package_dr_L)
    del_circuit_depth.addEventListener("mouseover", package_dc_L)
    selects.appendChild(add_qubit_indexs)
    selects.appendChild(add_circuit_depth)
    selects.appendChild(del_qubit_indexs)
    selects.appendChild(del_circuit_depth)
    selects.appendChild(click_close)
    return selects
}





function Gate_Pack() {
    var temp = document.getElementById("Dragable_Area")
    var temp = temp.lastChild
    var last_element = temp.lastChild
    var last_x = last_element.getBoundingClientRect().left + document.documentElement.scrollLeft;
    var last_y = last_element.getBoundingClientRect().top + document.documentElement.scrollTop;
    var max_x = 0
    var max_y = 0
    var min_x = last_x
    var min_y = last_y
    var area = document.querySelector("#Dragable_Area")
    var draggables = area.querySelectorAll(".draggable")
    for (var drag_item of draggables) {
        if (drag_item.className == "draggable selected") {
            var curr_x = drag_item.getBoundingClientRect().left + document.documentElement.scrollLeft;
            var curr_y = drag_item.getBoundingClientRect().top + document.documentElement.scrollTop;
            if (curr_x > max_x) {
                max_x = curr_x
            }
            if (curr_y > max_y) {
                max_y = curr_y
            }
            if (curr_x < min_x) {
                min_x = curr_x
            }
            if (curr_y < min_y) {
                min_y = curr_y
            }
        }
    }
    //Ban from generating duplicate area
    var gate_packages = document.querySelectorAll(".gate_package")
    var Have_Selected = true
    for (var item of gate_packages) {
        if ((item.getBoundingClientRect().left + document.documentElement.scrollLeft) == min_x) {
            Have_Selected = false
        }
    }
    if (Have_Selected && (gate_packages.length == 0)) {
        window.document.body.appendChild(Pack_Element(min_x, max_x, min_y, max_y));
    }
}
function Add_Move_qubit_index_L(area) {
    var del_qubit_indexs = area.querySelector(".adjust_package_dr")
    Add_hover(del_qubit_indexs)
}

function Add_Move_circuit_depth_L(area) {
    var del_circuit_depth = area.querySelector(".adjust_package_dc")
    Add_hover(del_circuit_depth)
}

function close() {
    var pack = this.parentNode
    var pack_x = parseInt(pack.style.left.slice(0, -2))
    var pack_y = parseInt(pack.style.top.slice(0, -2))
    var width = parseInt(pack.style.width.slice(0, -2)) + 2
    var height = parseInt(pack.style.height.slice(0, -2)) + 5
    pack.remove()
    var area = document.querySelector("#Dragable_Area")
    var draggables = area.querySelectorAll(".selected")
    for (drag_item of draggables) {
        var curr_x = math.round(drag_item.getBoundingClientRect().left + document.documentElement.scrollLeft);
        var curr_y = math.round(drag_item.getBoundingClientRect().top + document.documentElement.scrollTop);
        if ((curr_x >= pack_x) && (curr_y >= pack_y) && (curr_x <= (pack_x + width - 50)) && curr_y <= (pack_y + height - 50)) {
            drag_item.className = "draggable"
        }
    }
}



function Get_Package_Gates(self, whether_remove) {
    var pack = self.parentNode
    var pack_x = parseInt(pack.style.left.slice(0, -2))
    var pack_y = parseInt(pack.style.top.slice(0, -2))
    var width = parseInt(pack.style.width.slice(0, -2)) + 2
    var height = parseInt(pack.style.height.slice(0, -2)) + 5
    var area = document.querySelector("#Dragable_Area")
    var draggables = area.querySelectorAll(".selected")
    var gate_set_div = []
    for (var drag_item of draggables) {
        var curr_x = math.round(drag_item.getBoundingClientRect().left + document.documentElement.scrollLeft);
        var curr_y = math.round(drag_item.getBoundingClientRect().top + document.documentElement.scrollTop);
        if ((curr_x >= pack_x) && (curr_y >= pack_y) && (curr_x <= (pack_x + width - 50)) && curr_y <= (pack_y + height - 50)) {
            var pcircuit_depth = drag_item.parentNode;
            var x = pcircuit_depth.getAttribute("data-circuit_depth");
            var arr = Get_Item_Information(drag_item)
            if (whether_remove) { drag_item.remove() }
            let objCopy = drag_item.cloneNode()
            objCopy.className = "draggable"
            if (x != null) {
                var tmp = {
                    data: arr,
                    gate_div: stringIze(objCopy)
                }
                gate_set_div.push(tmp)
            }
        }
    }
    return gate_set_div
}

function package_dr_L() {
    var pack_gate_infor = Get_Package_Gates(this, false)
    var gate_infor_min = 1
    for (var sg_infor of pack_gate_infor) {
        var gate_qubit_indexs = sg_infor["data"]["qubit_number_index"]
        if (gate_qubit_indexs < gate_infor_min) {
            gate_infor_min = gate_qubit_indexs
        }
    }
    if (parseInt(gate_infor_min) == 0) {
        this.removeEventListener("click", package_dr)
        this.style.cursor = "not-allowed"
    }
}

function package_dc_L() {
    var pack_gate_infor = Get_Package_Gates(this, false)
    var gate_infor_min = 1
    for (var sg_infor of pack_gate_infor) {
        var gate_circuit_depth = sg_infor["data"]["circuit_depth_index"]
        if (gate_circuit_depth < gate_infor_min) {
            gate_infor_min = gate_circuit_depth
        }
    }
    if (parseInt(gate_infor_min) == 0) {
        this.removeEventListener("click", package_dc)
        this.style.cursor = "not-allowed"
    }
}

function Package_Move_Down(cells, pack_gate_infor) {
    for (var cell of cells) {
        var Areacircuit_depth = cell.getAttribute("data-circuit_depth")
        var tmp = cell.parentNode
        var Areaqubit_indexs = tmp.getAttribute("data-qubit_indexs")
        for (var pack_gate of pack_gate_infor) {
            var gate_circuit_depth = pack_gate["data"]["circuit_depth_index"]
            var gate_qubit_indexs = pack_gate["data"]["qubit_number_index"]
            var gate_infor = pack_gate["gate_div"]
            if (gate_circuit_depth == Areacircuit_depth) {
                if (parseInt(Areaqubit_indexs) == (parseInt(gate_qubit_indexs) + 1)) {
                    cell.innerHTML = gate_infor
                }
            }
        }
    }
}

function Package_Move_Up(cells, pack_gate_infor) {
    for (var cell of cells) {
        var Areacircuit_depth = cell.getAttribute("data-circuit_depth")
        var tmp = cell.parentNode
        var Areaqubit_indexs = tmp.getAttribute("data-qubit_indexs")
        for (var pack_gate of pack_gate_infor) {
            var gate_circuit_depth = pack_gate["data"]["circuit_depth_index"]
            var gate_qubit_indexs = pack_gate["data"]["qubit_number_index"]
            var gate_infor = pack_gate["gate_div"]
            if (gate_circuit_depth == Areacircuit_depth) {
                if (parseInt(Areaqubit_indexs) == (parseInt(gate_qubit_indexs) - 1)) {
                    cell.innerHTML = gate_infor
                }
            }
        }
    }
}

function Package_Move_Right(cells, pack_gate_infor) {
    for (var cell of cells) {
        var Areacircuit_depth = cell.getAttribute("data-circuit_depth")
        var tmp = cell.parentNode
        var Areaqubit_indexs = tmp.getAttribute("data-qubit_indexs")
        for (var pack_gate of pack_gate_infor) {
            var gate_circuit_depth = pack_gate["data"]["circuit_depth_index"]
            var gate_qubit_indexs = pack_gate["data"]["qubit_number_index"]
            var gate_infor = pack_gate["gate_div"]
            if (gate_qubit_indexs == Areaqubit_indexs) {
                if (parseInt(Areacircuit_depth) == (parseInt(gate_circuit_depth) + 1)) {
                    cell.innerHTML = gate_infor
                }
            }
        }
    }
}

function Package_Move_Left(cells, pack_gate_infor) {
    for (var cell of cells) {
        var Areacircuit_depth = cell.getAttribute("data-circuit_depth")
        var tmp = cell.parentNode
        var Areaqubit_indexs = tmp.getAttribute("data-qubit_indexs")
        for (var pack_gate of pack_gate_infor) {
            var gate_circuit_depth = pack_gate["data"]["circuit_depth_index"]
            var gate_qubit_indexs = pack_gate["data"]["qubit_number_index"]
            var gate_infor = pack_gate["gate_div"]
            if (gate_qubit_indexs == Areaqubit_indexs) {
                if (parseInt(Areacircuit_depth) == (parseInt(gate_circuit_depth) - 1)) {
                    cell.innerHTML = gate_infor
                }
            }
        }
    }
}


function package_ar() {
    var pack_gate_infor = Get_Package_Gates(this, true)
    var pack = this.parentNode
    pack.remove()
    setTimeout(() => {
        var dragarea = document.querySelector("#Dragable_Area")
        var check_cells = dragarea.querySelectorAll(".circuit_depth")
        var Area_max = 0
        var gate_infor_max = 0
        for (var cell of check_cells) {
            var Areaqubit_indexs = cell.getAttribute("data-qubit_indexs")
            if (Areaqubit_indexs > Area_max) {
                Area_max = Areaqubit_indexs
            }
        }
        for (var sg_infor of pack_gate_infor) {
            var gate_qubit_indexs = sg_infor["data"]["qubit_number_index"]
            if (gate_qubit_indexs > gate_infor_max) {
                gate_infor_max = gate_qubit_indexs
            }
        }
        if (parseInt(Area_max) >= (parseInt(gate_infor_max) + 1)) {
            var cells = dragarea.querySelectorAll(".qubit_index")
            Package_Move_Down(cells, pack_gate_infor)
            totoaldrawqc(totoalqcinfor())
            compile()
            var draggables = document.querySelectorAll(".draggable")
            draggableL(draggables)
        }
        else {
            addqubit_index()
            setTimeout(() => {
                var cells = dragarea.querySelectorAll(".qubit_index")
                Package_Move_Down(cells, pack_gate_infor)
                totoaldrawqc(totoalqcinfor())
                compile()
                var draggables = document.querySelectorAll(".draggable")
                draggableL(draggables)
            }, 0);
        }
    }, 0);
}

function package_ac() {
    var pack_gate_infor = Get_Package_Gates(this, true)
    var pack = this.parentNode
    pack.remove()
    var dragarea = document.querySelector("#Dragable_Area")
    var cells = dragarea.querySelectorAll(".qubit_index")
    var Area_max = 0
    var gate_infor_max = 0
    for (var cell of cells) {
        var Areacircuit_depth = cell.getAttribute("data-circuit_depth")
        if (Areacircuit_depth > Area_max) {
            Area_max = Areacircuit_depth
        }
    }
    for (var sg_infor of pack_gate_infor) {
        var gate_circuit_depth = sg_infor["data"]["circuit_depth_index"]
        if (gate_circuit_depth > gate_infor_max) {
            gate_infor_max = gate_circuit_depth
        }
    }
    setTimeout(() => {
        if (parseInt(Area_max) >= (parseInt(gate_infor_max) + 1)) {
            Package_Move_Right(cells, pack_gate_infor)
            totoaldrawqc(totoalqcinfor())
            compile()
            var draggables = document.querySelectorAll(".draggable")
            draggableL(draggables)
            setTimeout(() => {
                delete_single_ctrl_gate()
            }, 0);
        }
        else {
            addcircuit_depth()
            setTimeout(() => {
                var cells = dragarea.querySelectorAll(".qubit_index")
                Package_Move_Right(cells, pack_gate_infor)
                totoaldrawqc(totoalqcinfor())
                compile()
                var draggables = document.querySelectorAll(".draggable")
                draggableL(draggables)
            }, 0);
        }
    }, 0);
}

function package_dc() {
    var pack_gate_infor = Get_Package_Gates(this, true)
    var dragarea = document.querySelector("#Dragable_Area")
    var cells = dragarea.querySelectorAll(".qubit_index")
    var pack = this.parentNode
    pack.remove()
    setTimeout(() => {
        Package_Move_Left(cells, pack_gate_infor)
        totoaldrawqc(totoalqcinfor())
        compile()
        var draggables = document.querySelectorAll(".draggable")
        draggableL(draggables)
        setTimeout(() => {
            delete_single_ctrl_gate()
        }, 0);
    }, 0);

}

function package_dr() {
    var pack_gate_infor = Get_Package_Gates(this, true)
    var dragarea = document.querySelector("#Dragable_Area")
    var cells = dragarea.querySelectorAll(".qubit_index")
    var pack = this.parentNode
    pack.remove()
    setTimeout(() => {
        Package_Move_Up(cells, pack_gate_infor)
        totoaldrawqc(totoalqcinfor())
        compile()
        var draggables = document.querySelectorAll(".draggable")
        draggableL(draggables)
        setTimeout(() => {
            delete_single_ctrl_gate()
        }, 0);
    }, 0);
}


function Add_hover(button) {
    button.addEventListener("mouseover", function (e) {
        button.style.opacity = "100"
        button.style.cursor = "pointer"
    })
    button.addEventListener("mouseout", function (e) {
        button.style.opacity = "0"
        button.style.cursor = "auto"
    })
}