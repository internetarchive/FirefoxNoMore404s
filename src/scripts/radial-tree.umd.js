! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports, require("d3")) : "function" == typeof define && define.amd ? define(["exports", "d3"], t) : t(e.wb = {}, e.d3)
}(this, function(e, t) {
    "use strict";
    e.RadialTree = function(e, n, r) {
        var a, i = 0,
            c = "https://web.archive.org";
        void 0 !== r.baseURL && (c = r.baseURL), r.indicatorImg && (a = r.indicatorImg), r.url && (function(e) {
            var t = document.createElement("div");
            t.setAttribute("class", "rt-content");
            var n = document.createElement("div");
            n.setAttribute("class", "div-btn");
            var r = document.createElement("p");
            r.setAttribute("class", "sequence");
            var i = document.createElement("div");
            if (i.setAttribute("id", "chart"), a) {
                var c = document.createElement("img");
                c.setAttribute("src", a), c.setAttribute("class", "rt-indicator"), i.appendChild(c)
            }
            t.appendChild(n), t.appendChild(r), t.appendChild(i), t.style.display = "block", e.appendChild(t)
        }(e), function(e, t, n) {
            e.replace(/http:\/\//, ""), e.replace(/https:\/\//, ""), e.replace(/\/$/, ""), 0 == t.length && n(!0, []);
            for (var r = [], a = 1; a < t.length; a++) t[a][1].match(/jpg|pdf|png|form|gif/) || (t[a][1] = t[a][1].trim().replace(":80/", "/"), t[a][0] in r ? r[t[a][0]].push(t[a][1]) : r[t[a][0]] = [t[a][1]]);
            var i = [];
            for (var c in r) i.push([c].concat(r[c]));
            var o = function() {
                    for (var e = 0; e < i.length; e++)
                        for (var t = 1; t < i[e].length; t++) {
                            var n;
                            i[e][t].includes("http") ? n = i[e][t].substring(7) : i[e][t].includes("https") && (n = i[e][t].substring(8)), n.includes("//") && (n = n.split("//").join("/")), n = n.split("/").join("/"), i[e][t] = n
                        }
                    return i
                }(),
                l = o.map(function(e) {
                    if (e.length > 1) return e[0]
                });
            n(!0, null, l, o)
        }(r.url, n, function(n, o, l, s) {
            a && (e.querySelector(".rt-indicator").style.display = "none"), n && function(e, n, r, a) {
                var o = e.querySelector(".div-btn");
                e.querySelector(".year-btn") || r.forEach(function(l, s) {
                    var u = document.createElement("button");
                    u.setAttribute("class", "year-btn"), u.setAttribute("id", r[s]), u.innerHTML = r[s], u.onclick = function(o) {
                        var l = o.target;
                        e.querySelector(".active-btn") && e.querySelector(".active-btn").classList.remove("active-btn"), l.classList.add("active-btn"), i = l.id;
                        var s = r.indexOf(l.id),
                            u = function(e, t) {
                                var n = "",
                                    r = 2;
                                2 == t[e].length && (r = 1);
                                for (var a = r; a < t[e].length; a++) n = a != t[e].length - 1 ? n + t[e][a] + " ,1\n" : n + t[e][a] + " ,1";
                                return n
                            }(s, a);
                        ! function(e, n, r) {
                            e.querySelector(".sequence").innerHTML = "", e.querySelector("#chart").innerHTML = "";
                            var a = e.querySelector("#chart").offsetWidth,
                                o = a,
                                l = Math.min(a, o) / 2,
                                s = t.scaleOrdinal(t.schemeCategory20b),
                                u = t.select("#chart").append("svg:svg").attr("width", a).attr("height", o).append("svg:g").attr("id", "d3_container").attr("transform", "translate(" + a / 2 + "," + o / 2 + ")"),
                                d = t.partition().size([2 * Math.PI, l * l]),
                                f = t.arc().startAngle(function(e) {
                                    return e.x0
                                }).endAngle(function(e) {
                                    return e.x1
                                }).innerRadius(function(e) {
                                    return Math.sqrt(e.y0)
                                }).outerRadius(function(e) {
                                    return Math.sqrt(e.y1)
                                });
                            ! function(e) {
                                u.append("svg:circle").attr("r", l).style("opacity", 0);
                                var n = t.hierarchy(e).sum(function(e) {
                                        return e.size
                                    }).sort(function(e, t) {
                                        return t.value - e.value
                                    }),
                                    r = d(n).descendants();
                                u.data([e]).selectAll("path").data(r).enter().append("svg:path").attr("display", function(e) {
                                    return e.depth ? null : "none"
                                }).attr("d", f).attr("fill-rule", "evenodd").style("fill", function(e) {
                                    return "end" == e.data.name ? "#000000" : s((e.children ? e : e.parent).data.name)
                                }).style("opacity", 1).style("cursor", "pointer").on("mouseover", m).on("touchstart", p).on("click", h), t.select("#d3_container").on("mouseleave", g)
                            }(function(e) {
                                e.sort(function(e, t) {
                                    return e[0].length - t[0].length || e[0].localeCompare(t[0])
                                });
                                var t = {};
                                t[n.url] = 1, "/" != n.url.slice(-1) && (t[n.url + "/"] = 1);
                                for (var r = 0, a = e.length; r < a; r++) {
                                    var i = String(e[r][0]).trim().replace(":80/", "/");
                                    t[i] = 1, "/" != i.slice(-1) && (t[i + "/"] = 1)
                                }
                                var c = "|";

                                function o(e) {
                                    for (var n = e.trim().split("/"), r = [], a = 1; a < n.length; a++) {
                                        var i = n.slice(0, a).join("/");
                                        if (i in t == 0 && a > 0) {
                                            var o = n.slice(0, a).join("/").length;
                                            r.push(o)
                                        }
                                    }
                                    if (r.length > 0) {
                                        for (var l = e, s = 1; s < r.length; s++) {
                                            var u = r[s];
                                            l = l.substr(0, u) + c + l.substr(u + 1)
                                        }
                                        return l
                                    }
                                    return e
                                }
                                for (var l = {
                                        name: "root",
                                        children: []
                                    }, r = 0; r < a; r++) {
                                    var s = o(e[r][0]),
                                        u = +e[r][1];
                                    if (!isNaN(u)) {
                                        var d = s.split("/");
                                        d = d.map(function(e) {
                                            return e.replace(/\|/g, "/")
                                        });
                                        for (var f = l, p = 0; p < d.length; p++) {
                                            var v, h = f.children,
                                                m = d[p];
                                            if (p + 1 < d.length) {
                                                for (var g = !1, y = 0; y < h.length; y++)
                                                    if (h[y].name == m) {
                                                        v = h[y], g = !0;
                                                        break
                                                    }
                                                g || (v = {
                                                    name: m,
                                                    children: []
                                                }, h.push(v)), f = v
                                            } else v = {
                                                name: m,
                                                size: u
                                            }, h.push(v)
                                        }
                                    }
                                }
                                return l
                            }(t.csvParseRows(r)));

                            function p(e) {
                                t.event.preventDefault(), t.event.stopPropagation(), m(e)
                            }

                            function v(e) {
                                for (var t = e.ancestors().reverse(), n = "", r = 1; r < t.length && "end" != t[r].data.name; r++) n = n + "/" + t[r].data.name;
                                return c + "/web/" + i + "0630" + n
                            }

                            function h(e) {
                                window.location = v(e)
                            }

                            function m(n) {
                                var r = n.ancestors().reverse();
                                r.shift();
                                var a = v(n);
                                ! function(t, n) {
                                    var r = "",
                                        a = document.createElement("span");
                                    a.setAttribute("class", "symb"), a.innerHTML = "/";
                                    for (var i = 0; i < t.length; i++) r = 0 == i ? " " + t[i].data.name : r + a.innerHTML + t[i].data.name;
                                    r = decodeURIComponent(r), e.querySelector(".sequence").innerHTML = '<a href="' + n + '">' + r + "</a>"
                                }(r, a), t.selectAll("path").style("opacity", .3), u.selectAll("path").filter(function(e) {
                                    return r.indexOf(e) >= 0
                                }).style("opacity", 1)
                            }

                            function g(n) {
                                e.querySelector(".sequence").innerHTML = "", t.selectAll("path").on("mouseover", null), t.selectAll("path").transition().style("opacity", 1).on("end", function() {
                                    t.select(this).on("mouseover", m)
                                })
                            }
                        }(e, n, u)
                    }, o.appendChild(u), s == r.length - 1 && u.click()
                })
            }(e, r, l, s)
        }))
    }, Object.defineProperty(e, "__esModule", {
        value: !0
    })
});
//# sourceMappingURL=radial-tree.umd.js.map