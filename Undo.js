var withdraw = document.querySelector("#withdraw")

withdraw.addEventListener("mousedown", function (event) {
    Undo()
})

function Undo() {
    if ((state.current - 2) >= 0) {
        var out = export_qcinfor(state.timeline[state.current - 2])
        var cols = parseInt(document.querySelector(".cols").childElementCount) - 1
        var rows = document.querySelectorAll(".cols").length
        qcinfor_render(out, rows - 1, cols - 1)
        state.timeline.pop()
        state.current -= 1
    }
}