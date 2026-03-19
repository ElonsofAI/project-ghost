(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ConsoleLog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConsoleLog",
    ()=>ConsoleLog,
    "ghostLog",
    ()=>ghostLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const BOOT_SEQUENCE = [
    {
        tag: 'INIT_PROTOCOL',
        message: 'Ghost Protocol initialized. Standing by.'
    },
    {
        tag: 'DECRYPT_INTEL',
        message: 'Revenue leak data loaded. $280,000 baseline confirmed.'
    },
    {
        tag: 'BYPASS_FRICTION',
        message: 'Authentication layer armed. Awaiting operator.'
    }
];
function ConsoleLog() {
    _s();
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [counter, setCounter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Boot sequence
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleLog.useEffect": ()=>{
            let i = 0;
            const interval = setInterval({
                "ConsoleLog.useEffect.interval": ()=>{
                    if (i < BOOT_SEQUENCE.length) {
                        const entry = BOOT_SEQUENCE[i];
                        setLogs({
                            "ConsoleLog.useEffect.interval": (prev)=>[
                                    ...prev,
                                    {
                                        id: Date.now() + i,
                                        tag: entry.tag,
                                        message: entry.message,
                                        ts: now()
                                    }
                                ]
                        }["ConsoleLog.useEffect.interval"]);
                        i++;
                    } else {
                        clearInterval(interval);
                    }
                }
            }["ConsoleLog.useEffect.interval"], 900);
            return ({
                "ConsoleLog.useEffect": ()=>clearInterval(interval)
            })["ConsoleLog.useEffect"];
        }
    }["ConsoleLog.useEffect"], []);
    // Live log events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleLog.useEffect": ()=>{
            const handler = {
                "ConsoleLog.useEffect.handler": (e)=>{
                    setLogs({
                        "ConsoleLog.useEffect.handler": (prev)=>[
                                ...prev.slice(-24),
                                {
                                    id: Date.now() + counter,
                                    tag: e.detail.tag,
                                    message: e.detail.message,
                                    ts: now()
                                }
                            ]
                    }["ConsoleLog.useEffect.handler"]);
                    setCounter({
                        "ConsoleLog.useEffect.handler": (c)=>c + 1
                    }["ConsoleLog.useEffect.handler"]);
                }
            }["ConsoleLog.useEffect.handler"];
            window.addEventListener('ghost:log', handler);
            return ({
                "ConsoleLog.useEffect": ()=>window.removeEventListener('ghost:log', handler)
            })["ConsoleLog.useEffect"];
        }
    }["ConsoleLog.useEffect"], [
        counter
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "shrink-0 h-10 bg-obsidian border-t border-bone/8 flex items-center px-4 gap-2 overflow-hidden z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-1.5 h-1.5 rounded-full bg-orange pulse-orange shrink-0"
            }, void 0, false, {
                fileName: "[project]/components/ConsoleLog.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-mono text-[9px] text-orange/60 tracking-[0.25em] uppercase shrink-0 mr-2",
                children: "GHOST_TERMINAL"
            }, void 0, false, {
                fileName: "[project]/components/ConsoleLog.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-8 overflow-x-auto scrollbar-none whitespace-nowrap flex-1",
                children: logs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-mono text-[10px] text-bone/20",
                    children: [
                        "Awaiting protocol initialization",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "cursor-blink",
                            children: "_"
                        }, void 0, false, {
                            fileName: "[project]/components/ConsoleLog.tsx",
                            lineNumber: 58,
                            columnNumber: 45
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConsoleLog.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this) : logs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-[10px] shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-bone/20",
                                children: [
                                    log.ts,
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ConsoleLog.tsx",
                                lineNumber: 63,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-orange neon-orange",
                                children: [
                                    "[",
                                    log.tag,
                                    "]"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ConsoleLog.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-bone/45",
                                children: [
                                    " ",
                                    log.message
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ConsoleLog.tsx",
                                lineNumber: 65,
                                columnNumber: 15
                            }, this)
                        ]
                    }, log.id, true, {
                        fileName: "[project]/components/ConsoleLog.tsx",
                        lineNumber: 62,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ConsoleLog.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ConsoleLog.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(ConsoleLog, "lfMuyJpu5SvqXsth9MLKVkKr0/0=");
_c = ConsoleLog;
function ghostLog(tag, message) {
    window.dispatchEvent(new CustomEvent('ghost:log', {
        detail: {
            tag,
            message
        }
    }));
}
function now() {
    return new Date().toISOString().split('T')[1].split('.')[0];
}
var _c;
__turbopack_context__.k.register(_c, "ConsoleLog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_ConsoleLog_tsx_cc6d10c6._.js.map