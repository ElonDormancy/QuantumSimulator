!function (t, e) { "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).d3 = {}) }(this, function (t) { "use strict"; function g(t) { var e = t.slice(0), r = 0; e.push(e[0]); for (var o = 0; o <= t.length - 1; o++) { var n = e[o].rotated, c = e[o + 1].rotated; r += (c.x - n.x) * (c.y + n.y) } return 0 < r } function s(t) { for (var e = 0, r = 0, o = 0, n = t.length, c = n - 1; 0 <= c; c--)e += t[c].rotated.x, r += t[c].rotated.y, o += t[c].rotated.z; return { x: e / n, y: r / n, z: o / n } } function f(t, e) { var r = e.rotateCenter; t.x -= r[0], t.y -= r[1], t.z -= r[2]; var o, n, t = (o = t, n = e.z, t = Math.sin(n), n = Math.cos(n), { x: o.x * n - o.y * t, y: o.x * t + o.y * n, z: o.z }), n = (n = t, o = e.y, t = Math.sin(o), o = Math.cos(o), { x: n.z * t + n.x * o, y: n.y, z: n.z * o - n.x * t }), n = (t = n, n = e.x, e = Math.sin(n), n = Math.cos(n), { x: t.x, y: t.y * n - t.z * e, z: t.y * e + t.z * n }); return n.x += r[0], n.y += r[1], n.z += r[2], n } function v(t, e, r, o) { for (var n = t.length - 1; 0 <= n; n--) { var c = t[n]; c.rotated = f({ x: r.x(c), y: r.y(c), z: r.z(c) }, o), c.centroid = c.rotated, c.projected = e.project(c.rotated, e) } return t } function l(t, e, r, o) { for (var n = t.length - 1; 0 <= n; n--) { var c = t[n], d = v([c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]], e, r, o), a = d[0], i = d[1], u = d[2], f = d[3], y = d[4], x = d[5], p = d[6], z = d[7], j = [a, i, u, f], l = [z, p, x, y], h = [y, x, i, a], d = [f, u, p, z], z = [y, a, f, z], u = [i, x, p, u]; j.centroid = s(j), l.centroid = s(l), h.centroid = s(h), d.centroid = s(d), z.centroid = s(z), u.centroid = s(u), j.ccw = g(j), l.ccw = g(l), h.ccw = g(h), d.ccw = g(d), z.ccw = g(z), u.ccw = g(u), j.face = "front", l.face = "back", h.face = "left", d.face = "right", z.face = "top", u.face = "bottom", c.faces = [j, l, h, d, z, u], c.centroid = { x: (h.centroid.x + d.centroid.x) / 2, y: (z.centroid.y + u.centroid.y) / 2, z: j.centroid.z + l.centroid.z / 2 } } return t } function h(t, e, r, o) { for (var n = v(t, e, r, o), c = 0, d = [], a = e.row, i = n.length / a - 1; 0 < i; i--)for (var u = a - 1; 0 < u; u--) { var f = u + i * a, y = f - 1, x = y - a + 1, y = [n[f], n[x], n[x - 1], n[y]]; y.plane = "plane_" + c++, y.ccw = g(y), y.centroid = s(y), d.push(y) } return d } function I(t, e, r, o) { for (var n = t.length - 1; 0 <= n; n--) { for (var c = t[n], d = c.length / 2, a = parseInt(d), i = c.length - 1; 0 <= i; i--) { var u = c[i]; u.rotated = f({ x: r.x(u), y: r.y(u), z: r.z(u) }, o), u.projected = e.project(u.rotated, e) } c.centroid = a === d ? s([c[d - 1], c[d]]) : { x: c[a].rotated.x, y: c[a].rotated.y, z: c[a].rotated.z } } return t } function L(t, e, r, o) { for (var n = t.length - 1; 0 <= n; n--) { var c = t[n], d = c[0], a = c[1]; d.rotated = f({ x: r.x(d), y: r.y(d), z: r.z(d) }, o), a.rotated = f({ x: r.x(a), y: r.y(a), z: r.z(a) }, o), d.projected = e.project(d.rotated, e), a.projected = e.project(a.rotated, e), c.centroid = s(c) } return t } function N(t, e, r, o) { for (var n = t.length - 1; 0 <= n; n--) { var c = t[n], d = c[0], a = c[1], i = c[2], u = c[3]; d.rotated = f({ x: r.x(d), y: r.y(d), z: r.z(d) }, o), a.rotated = f({ x: r.x(a), y: r.y(a), z: r.z(a) }, o), i.rotated = f({ x: r.x(i), y: r.y(i), z: r.z(i) }, o), u.rotated = f({ x: r.x(u), y: r.y(u), z: r.z(u) }, o), d.projected = e.project(d.rotated, e), a.projected = e.project(a.rotated, e), i.projected = e.project(i.rotated, e), u.projected = e.project(u.rotated, e), c.ccw = g(c), c.centroid = s(c) } return t } function w(t, e, r, o) { for (var n = t.length - 1; 0 <= n; n--) { var c = t[n], d = c[0], a = c[1], i = c[2]; d.rotated = f({ x: r.x(d), y: r.y(d), z: r.z(d) }, o), a.rotated = f({ x: r.x(a), y: r.y(a), z: r.z(a) }, o), i.rotated = f({ x: r.x(i), y: r.y(i), z: r.z(i) }, o), d.projected = e.project(d.rotated, e), a.projected = e.project(a.rotated, e), i.projected = e.project(i.rotated, e), c.ccw = g(c), c.centroid = s(c) } return t } function E(t) { for (var e = t[t.length - 1], r = "M" + e.projected.x + "," + e.projected.y, o = t.length - 2; 0 <= o; o--) { var n = t[o].projected; r += "L" + n.x + "," + n.y } return r } function M(t) { return "M" + t[0].projected.x + "," + t[0].projected.y + "L" + t[1].projected.x + "," + t[1].projected.y + "L" + t[2].projected.x + "," + t[2].projected.y + "L" + t[3].projected.x + "," + t[3].projected.y + "Z" } function T(t) { return "M" + t[0].projected.x + "," + t[0].projected.y + "L" + t[1].projected.x + "," + t[1].projected.y + "L" + t[2].projected.x + "," + t[2].projected.y + "Z" } function P(t, e) { return { x: e.origin[0] + e.scale * t.x, y: e.origin[1] + e.scale * t.y } } function R(t) { return t[0] } function C(t) { return t[1] } function b(t) { return t[2] } t._3d = function () { var e = [0, 0], r = 1, o = P, n = 0, c = 0, d = 0, a = [0, 0, 0], i = R, u = C, f = b, y = void 0, x = "POINT", p = { CUBE: l, GRID: h, LINE: L, LINE_STRIP: I, PLANE: N, POINT: v, SURFACE: h, TRIANGLE: w }, z = { CUBE: M, GRID: M, LINE_STRIP: E, PLANE: M, SURFACE: M, TRIANGLE: T }; function j(t) { return p[x](t, { scale: r, origin: e, project: o, row: y }, { x: i, y: u, z: f }, { x: n, y: c, z: d, rotateCenter: a }) } return j.origin = function (t) { return arguments.length ? (e = t, j) : e }, j.scale = function (t) { return arguments.length ? (r = t, j) : r }, j.rotateX = function (t) { return arguments.length ? (n = t, j) : n }, j.rotateY = function (t) { return arguments.length ? (c = t, j) : c }, j.rotateZ = function (t) { return arguments.length ? (d = t, j) : d }, j.shape = function (t, e) { return arguments.length ? (x = t, y = e, j) : x }, j.rotateCenter = function (t) { return arguments.length ? (a = t, j) : a }, j.x = function (t) { return arguments.length ? (i = "function" == typeof t ? t : +t, j) : i }, j.y = function (t) { return arguments.length ? (u = "function" == typeof t ? t : +t, j) : u }, j.z = function (t) { return arguments.length ? (f = "function" == typeof t ? t : +t, j) : f }, j.sort = function (t, e) { t = t.centroid.z, e = e.centroid.z; return t < e ? -1 : e < t ? 1 : e <= t ? 0 : NaN }, j.draw = function (t) { if ("POINT" !== x && "LINE" !== x) return z[x](t) }, j }, Object.defineProperty(t, "__esModule", { value: !0 }) });