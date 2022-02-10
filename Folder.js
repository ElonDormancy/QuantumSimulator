var sg_folder = document.querySelector("div.Single_Gates > div.Gate_Name.fold_name")
var cg_folder = document.querySelector("div.Control_Gates > div.Gate_Name.fold_name")
sg_folder.addEventListener("click", Open_Folder)
cg_folder.addEventListener("click", Open_Folder)
function Open_Folder() {
    if (this.getAttribute("data-open") == "false") {
        var p = this.parentNode
        var f = p.querySelector(".folder")
        f.style.display = "block"
        this.setAttribute("data-open", "true")
    }
    else {
        var p = this.parentNode
        var f = p.querySelector(".folder")
        f.style.display = "none"
        this.setAttribute("data-open", "false")
    }
}