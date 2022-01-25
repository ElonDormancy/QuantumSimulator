//Drag and drop to draw a area to select gates
document.onmousedown = function (event) {
    if (event.button == 0 && event.ctrlKey) {
        let shiftX = event.clientX + document.documentElement.scrollLeft;
        let shiftY = event.clientY + document.documentElement.scrollTop;
        var select_area = document.createElement("div");
        select_area.style.position = 'absolute';
        select_area.style.zIndex = 1000;
        select_area.className = "drag_section"
        select_area.style.backgroundColor = "black"
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
//Return the item the same cols of ctrl gate
function ColCG(item) {
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
            if (CheckColCG(drag_item) && drag_item.className == "draggable selected") {
                ColCG(drag_item).className = "draggable selected"
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
    var add_rows = document.createElement("span");
    var del_rows = document.createElement("span");
    var add_cols = document.createElement("span");
    var del_cols = document.createElement("span");
    add_rows.className = "adjust_package_ar"
    add_cols.className = "adjust_package_ac"
    del_rows.className = "adjust_package_dr"
    del_cols.className = "adjust_package_dc"
    Add_hover(add_rows)
    Add_hover(add_cols)
    Add_hover(del_rows)
    Add_hover(del_cols)
    var click_close = document.createElement("div");
    click_close.className = "click_close"
    click_close.addEventListener("click", close)
    add_rows.addEventListener("click", package_ar)
    add_cols.addEventListener("click", package_ac)
    del_rows.addEventListener("click", package_dr)
    del_cols.addEventListener("click", package_dc)
    del_rows.addEventListener("mouseover", package_dr_L)
    del_cols.addEventListener("mouseover", package_dc_L)
    selects.appendChild(add_rows)
    selects.appendChild(add_cols)
    selects.appendChild(del_rows)
    selects.appendChild(del_cols)
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
function Add_Move_Row_L(area) {
    var del_rows = area.querySelector(".adjust_package_dr")
    Add_hover(del_rows)
}

function Add_Move_Col_L(area) {
    var del_cols = area.querySelector(".adjust_package_dc")
    Add_hover(del_cols)
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
            var pcol = drag_item.parentNode;
            var x = pcol.getAttribute("data-cols");
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
        var gate_rows = sg_infor["data"]["yindex"]
        if (gate_rows < gate_infor_min) {
            gate_infor_min = gate_rows
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
        var gate_cols = sg_infor["data"]["xindex"]
        if (gate_cols < gate_infor_min) {
            gate_infor_min = gate_cols
        }
    }
    if (parseInt(gate_infor_min) == 0) {
        this.removeEventListener("click", package_dc)
        this.style.cursor = "not-allowed"
    }
}

function Package_Move_Down(cells, pack_gate_infor) {
    for (var cell of cells) {
        var Areacols = cell.getAttribute("data-cols")
        var tmp = cell.parentNode
        var Arearows = tmp.getAttribute("data-rows")
        for (var pack_gate of pack_gate_infor) {
            var gate_cols = pack_gate["data"]["xindex"]
            var gate_rows = pack_gate["data"]["yindex"]
            var gate_infor = pack_gate["gate_div"]
            if (gate_cols == Areacols) {
                if (parseInt(Arearows) == (parseInt(gate_rows) + 1)) {
                    cell.innerHTML = gate_infor
                }
            }
        }
    }
}

function Package_Move_Up(cells, pack_gate_infor) {
    for (var cell of cells) {
        var Areacols = cell.getAttribute("data-cols")
        var tmp = cell.parentNode
        var Arearows = tmp.getAttribute("data-rows")
        for (var pack_gate of pack_gate_infor) {
            var gate_cols = pack_gate["data"]["xindex"]
            var gate_rows = pack_gate["data"]["yindex"]
            var gate_infor = pack_gate["gate_div"]
            if (gate_cols == Areacols) {
                if (parseInt(Arearows) == (parseInt(gate_rows) - 1)) {
                    cell.innerHTML = gate_infor
                }
            }
        }
    }
}

function Package_Move_Right(cells, pack_gate_infor) {
    for (var cell of cells) {
        var Areacols = cell.getAttribute("data-cols")
        var tmp = cell.parentNode
        var Arearows = tmp.getAttribute("data-rows")
        for (var pack_gate of pack_gate_infor) {
            var gate_cols = pack_gate["data"]["xindex"]
            var gate_rows = pack_gate["data"]["yindex"]
            var gate_infor = pack_gate["gate_div"]
            if (gate_rows == Arearows) {
                if (parseInt(Areacols) == (parseInt(gate_cols) + 1)) {
                    cell.innerHTML = gate_infor
                }
            }
        }
    }
}

function Package_Move_Left(cells, pack_gate_infor) {
    for (var cell of cells) {
        var Areacols = cell.getAttribute("data-cols")
        var tmp = cell.parentNode
        var Arearows = tmp.getAttribute("data-rows")
        for (var pack_gate of pack_gate_infor) {
            var gate_cols = pack_gate["data"]["xindex"]
            var gate_rows = pack_gate["data"]["yindex"]
            var gate_infor = pack_gate["gate_div"]
            if (gate_rows == Arearows) {
                if (parseInt(Areacols) == (parseInt(gate_cols) - 1)) {
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
        var check_cells = dragarea.querySelectorAll(".cols")
        var Area_max = 0
        var gate_infor_max = 0
        for (var cell of check_cells) {
            var Arearows = cell.getAttribute("data-rows")
            if (Arearows > Area_max) {
                Area_max = Arearows
            }
        }
        for (var sg_infor of pack_gate_infor) {
            var gate_rows = sg_infor["data"]["yindex"]
            if (gate_rows > gate_infor_max) {
                gate_infor_max = gate_rows
            }
        }
        if (parseInt(Area_max) >= (parseInt(gate_infor_max) + 1)) {
            var cells = dragarea.querySelectorAll(".row")
            Package_Move_Down(cells, pack_gate_infor)
            totoaldrawqc(totoalqcinfor())
            compile()
            var draggables = document.querySelectorAll(".draggable")
            draggableL(draggables)
        }
        else {
            addrow()
            setTimeout(() => {
                var cells = dragarea.querySelectorAll(".row")
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
    var cells = dragarea.querySelectorAll(".row")
    var Area_max = 0
    var gate_infor_max = 0
    for (var cell of cells) {
        var Areacols = cell.getAttribute("data-cols")
        if (Areacols > Area_max) {
            Area_max = Areacols
        }
    }
    for (var sg_infor of pack_gate_infor) {
        var gate_cols = sg_infor["data"]["xindex"]
        if (gate_cols > gate_infor_max) {
            gate_infor_max = gate_cols
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
            addcol()
            setTimeout(() => {
                var cells = dragarea.querySelectorAll(".row")
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
    var cells = dragarea.querySelectorAll(".row")
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
    var cells = dragarea.querySelectorAll(".row")
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