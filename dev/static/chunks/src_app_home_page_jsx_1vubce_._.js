(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/home/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
const SUPABASE_URL = 'https://aaemqxlfzkkgchwhcisw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_171z2Negckh-UAFXHg91cA_YImBzFxn';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(SUPABASE_URL, SUPABASE_ANON_KEY);
function YouTubeClipPlayer({ postId, clip, mediaUrl }) {
    _s();
    const containerId = `yt-player-${postId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const playerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [clipProgress, setClipProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // 0 to duration
    const [isClipFinished, setIsClipFinished] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMuted, setIsMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const formatSec = (sec)=>{
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "YouTubeClipPlayer.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && !window.YT) {
                if (!document.getElementById('yt-iframe-api')) {
                    const tag = document.createElement('script');
                    tag.id = 'yt-iframe-api';
                    tag.src = 'https://www.youtube.com/iframe_api';
                    document.body.appendChild(tag);
                }
            }
            let isMounted = true;
            const setupPlayer = {
                "YouTubeClipPlayer.useEffect.setupPlayer": ()=>{
                    if (!isMounted || playerRef.current || !window.YT || !window.YT.Player) return;
                    const el = document.getElementById(containerId);
                    if (!el) return;
                    try {
                        playerRef.current = new window.YT.Player(containerId, {
                            videoId: clip.videoId,
                            playerVars: {
                                start: clip.start,
                                end: clip.end,
                                autoplay: 0,
                                controls: 0,
                                disablekb: 1,
                                fs: 0,
                                modestbranding: 1,
                                rel: 0,
                                iv_load_policy: 3,
                                playsinline: 1,
                                enablejsapi: 1,
                                origin: ("TURBOPACK compile-time truthy", 1) ? window.location.origin : "TURBOPACK unreachable"
                            },
                            events: {
                                onStateChange: {
                                    "YouTubeClipPlayer.useEffect.setupPlayer": (event)=>{
                                        if (!isMounted) return;
                                        // 1: PLAYING
                                        if (event.data === 1) {
                                            setIsPlaying(true);
                                            setIsClipFinished(false);
                                            if (intervalRef.current) clearInterval(intervalRef.current);
                                            intervalRef.current = setInterval({
                                                "YouTubeClipPlayer.useEffect.setupPlayer": ()=>{
                                                    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                                                        const cur = playerRef.current.getCurrentTime();
                                                        const elapsed = Math.max(0, cur - clip.start);
                                                        setClipProgress(Math.min(clip.duration, elapsed));
                                                        // HARD CEILING: Video CANNOT continue past end (strictly cut clip)!
                                                        if (cur >= clip.end) {
                                                            playerRef.current.pauseVideo();
                                                            playerRef.current.seekTo(clip.start, true);
                                                            setIsPlaying(false);
                                                            setIsClipFinished(true);
                                                            setClipProgress(clip.duration);
                                                            clearInterval(intervalRef.current);
                                                        }
                                                    }
                                                }
                                            }["YouTubeClipPlayer.useEffect.setupPlayer"], 150);
                                        } else if (event.data === 2 || event.data === 0) {
                                            // 2: PAUSED, 0: ENDED
                                            setIsPlaying(false);
                                            if (intervalRef.current) clearInterval(intervalRef.current);
                                            if (event.data === 0) {
                                                setIsClipFinished(true);
                                                setClipProgress(clip.duration);
                                                if (playerRef.current) playerRef.current.seekTo(clip.start, true);
                                            }
                                        }
                                    }
                                }["YouTubeClipPlayer.useEffect.setupPlayer"]
                            }
                        });
                    } catch (err) {
                        console.warn('YT player error:', err);
                    }
                }
            }["YouTubeClipPlayer.useEffect.setupPlayer"];
            if (window.YT && window.YT.Player) {
                setupPlayer();
            } else {
                const timer = setInterval({
                    "YouTubeClipPlayer.useEffect.timer": ()=>{
                        if (window.YT && window.YT.Player) {
                            clearInterval(timer);
                            setupPlayer();
                        }
                    }
                }["YouTubeClipPlayer.useEffect.timer"], 200);
                return ({
                    "YouTubeClipPlayer.useEffect": ()=>{
                        isMounted = false;
                        clearInterval(timer);
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                            try {
                                playerRef.current.destroy();
                            } catch (_) {}
                            playerRef.current = null;
                        }
                    }
                })["YouTubeClipPlayer.useEffect"];
            }
            return ({
                "YouTubeClipPlayer.useEffect": ()=>{
                    isMounted = false;
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                        try {
                            playerRef.current.destroy();
                        } catch (_) {}
                        playerRef.current = null;
                    }
                }
            })["YouTubeClipPlayer.useEffect"];
        }
    }["YouTubeClipPlayer.useEffect"], [
        containerId,
        clip.videoId,
        clip.start,
        clip.end,
        clip.duration
    ]);
    const togglePlay = (e)=>{
        if (e) e.stopPropagation();
        if (!playerRef.current) return;
        if (isClipFinished) {
            handleReplay(e);
            return;
        }
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };
    const handleReplay = (e)=>{
        if (e) e.stopPropagation();
        setIsClipFinished(false);
        setClipProgress(0);
        if (playerRef.current) {
            playerRef.current.seekTo(clip.start, true);
            playerRef.current.playVideo();
        }
    };
    const handleSeek = (e)=>{
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        setClipProgress(val);
        if (playerRef.current) {
            playerRef.current.seekTo(clip.start + val, true);
        }
    };
    const toggleMute = (e)=>{
        e.stopPropagation();
        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full rounded-[14px] overflow-hidden border border-gray-200/90 shadow-2xs bg-black flex flex-col group relative select-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full aspect-video bg-black overflow-hidden cursor-pointer",
                onClick: togglePlay,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: containerId,
                        className: "w-full h-full pointer-events-none"
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    !isPlaying && !isClipFinished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-2xs z-10 transition-all",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: togglePlay,
                            className: "w-14 h-14 rounded-full bg-white/95 text-[#2475FC] hover:bg-white hover:scale-105 transition-all shadow-xl flex items-center justify-center pl-1 cursor-pointer",
                            title: "Play Snippet",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "24",
                                height: "24",
                                viewBox: "0 0 24 24",
                                fill: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                    points: "6 3 20 12 6 21 6 3"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 198,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this),
                    isClipFinished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20 animate-in fade-in duration-200",
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-12 h-12 rounded-full bg-[#2475FC] text-white flex items-center justify-center shadow-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "22",
                                    height: "22",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2.5",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "20 6 9 17 4 12"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 213,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 212,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center text-white space-y-0.5 px-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-[14px] font-semibold",
                                        children: [
                                            "Clip Ended (",
                                            clip.duration,
                                            "s)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 217,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-gray-300",
                                        children: "Clipped snippet reached its limit and stopped."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleReplay,
                                        className: "px-4 py-1.5 bg-white text-gray-900 rounded-xl text-[12px] font-semibold hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "13",
                                                height: "13",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M1 4v6h6M23 20v-6h-6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 227,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 228,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 226,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Replay Clip"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 230,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: mediaUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Full on YouTube"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 238,
                                                columnNumber: 17
                                            }, this),
                                            " ↗"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 207,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3.5 py-2.5 bg-gray-900 text-white flex flex-col gap-2 border-t border-gray-800",
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "range",
                            min: "0",
                            max: clip.duration,
                            step: "0.1",
                            value: clipProgress,
                            onChange: handleSeek,
                            className: "w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2475FC]"
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-[11px] font-medium text-gray-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: togglePlay,
                                        className: "text-white hover:text-[#2475FC] transition-colors cursor-pointer",
                                        title: isPlaying ? "Pause" : "Play",
                                        children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "15",
                                            height: "15",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "6",
                                                    y: "4",
                                                    width: "4",
                                                    height: "16"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 274,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "14",
                                                    y: "4",
                                                    width: "4",
                                                    height: "16"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 274,
                                                    columnNumber: 60
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 273,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "15",
                                            height: "15",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                points: "5 3 19 12 5 21 5 3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 278,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 277,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 266,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: toggleMute,
                                        className: "text-gray-400 hover:text-white transition-colors cursor-pointer",
                                        title: isMuted ? "Unmute" : "Mute",
                                        children: isMuted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 290,
                                                    columnNumber: 115
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "23",
                                                    y1: "9",
                                                    x2: "17",
                                                    y2: "15"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 290,
                                                    columnNumber: 168
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "17",
                                                    y1: "9",
                                                    x2: "23",
                                                    y2: "15"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 290,
                                                    columnNumber: 206
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 290,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 292,
                                                    columnNumber: 115
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 292,
                                                    columnNumber: 168
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 292,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-gray-200",
                                        children: [
                                            formatSec(clipProgress),
                                            " / ",
                                            formatSec(clip.duration)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 297,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: mediaUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-gray-400 hover:text-[#38BDF8] flex items-center gap-1 transition-colors text-[11px]",
                                title: "Open original full video on YouTube",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Open on YouTube"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 309,
                                        columnNumber: 13
                                    }, this),
                                    " ↗"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 302,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 246,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/home/page.jsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
}
_s(YouTubeClipPlayer, "9PXIvgS/iGrkPkH8/Ogy/KgUSZo=");
_c = YouTubeClipPlayer;
// ----------------- AUDIO CLIP PLAYER (Spreaker / Podcasts / Direct Audio) -----------------
function AudioClipPlayer({ postId, clip, mediaUrl, post }) {
    _s1();
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [clipProgress, setClipProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // 0 to duration
    const [isClipFinished, setIsClipFinished] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMuted, setIsMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [artworkUrl, setArtworkUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(post?.thumbnail_url || null);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(post?.content || 'Podcast Audio Clip');
    const [showName, setShowName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(clip?.platform === 'spreaker' ? 'Spreaker' : 'Audio');
    const [streamUrl, setStreamUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(clip?.streamUrl || null);
    const [isLoadingMetadata, setIsLoadingMetadata] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Boolean(clip?.spreakerEpisodeId));
    const [hasArtworkError, setHasArtworkError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const formatSec = (sec)=>{
        const s = Math.max(0, Math.floor(sec || 0));
        const m = Math.floor(s / 60);
        const rem = s % 60;
        return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
    };
    const formatTimestamp = (sec)=>{
        const s = Math.max(0, Math.floor(sec || 0));
        const h = Math.floor(s / 3600);
        const m = Math.floor(s % 3600 / 60);
        const rem = s % 60;
        if (h > 0) {
            return `${h}:${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
        }
        return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
    };
    // Fetch Spreaker episode metadata (artwork image, show title, audio stream)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AudioClipPlayer.useEffect": ()=>{
            if (clip?.spreakerEpisodeId) {
                setIsLoadingMetadata(true);
                fetch(`https://api.spreaker.com/v2/episodes/${clip.spreakerEpisodeId}`).then({
                    "AudioClipPlayer.useEffect": (res)=>res.json()
                }["AudioClipPlayer.useEffect"]).then({
                    "AudioClipPlayer.useEffect": (data)=>{
                        const ep = data?.response?.episode;
                        if (ep) {
                            const img = ep.image_original_url || ep.image_url;
                            if (img) setArtworkUrl(img);
                            if (ep.title) setTitle(ep.title);
                            if (ep.show?.title) setShowName(ep.show.title);
                            if (ep.playback_url) setStreamUrl(ep.playback_url);
                        }
                    }
                }["AudioClipPlayer.useEffect"]).catch({
                    "AudioClipPlayer.useEffect": (err)=>{
                        console.warn('Error fetching Spreaker episode metadata:', err);
                    }
                }["AudioClipPlayer.useEffect"]).finally({
                    "AudioClipPlayer.useEffect": ()=>{
                        setIsLoadingMetadata(false);
                    }
                }["AudioClipPlayer.useEffect"]);
            }
        }
    }["AudioClipPlayer.useEffect"], [
        clip?.spreakerEpisodeId
    ]);
    // Handle Play/Pause
    const togglePlay = (e)=>{
        e?.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            if (isClipFinished || clipProgress >= clip.duration) {
                audioRef.current.currentTime = clip.start;
                setClipProgress(0);
                setIsClipFinished(false);
            } else {
                const targetTime = clip.start + clipProgress;
                if (Math.abs(audioRef.current.currentTime - targetTime) > 0.5) {
                    audioRef.current.currentTime = targetTime;
                }
            }
            audioRef.current.play().then(()=>{
                setIsPlaying(true);
            }).catch((err)=>{
                console.warn('Audio playback error:', err);
            });
        }
    };
    const handleTimeUpdate = ()=>{
        if (!audioRef.current) return;
        const cur = audioRef.current.currentTime;
        // Strictly enforce clip end boundary (max 90s snippet)
        if (cur >= clip.end) {
            audioRef.current.pause();
            audioRef.current.currentTime = clip.start;
            setIsPlaying(false);
            setClipProgress(clip.duration);
            setIsClipFinished(true);
        } else {
            const prog = Math.max(0, cur - clip.start);
            setClipProgress(prog);
            if (isClipFinished) setIsClipFinished(false);
        }
    };
    const handleSeek = (e)=>{
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        setClipProgress(val);
        if (audioRef.current) {
            audioRef.current.currentTime = clip.start + val;
        }
        if (isClipFinished) setIsClipFinished(false);
    };
    const handleReplay = (e)=>{
        e?.stopPropagation();
        if (!audioRef.current) return;
        audioRef.current.currentTime = clip.start;
        setClipProgress(0);
        setIsClipFinished(false);
        audioRef.current.play().then(()=>{
            setIsPlaying(true);
        }).catch(()=>{});
    };
    const toggleMute = (e)=>{
        e.stopPropagation();
        if (!audioRef.current) return;
        const nextMuted = !isMuted;
        audioRef.current.muted = nextMuted;
        setIsMuted(nextMuted);
    };
    const displayPlatform = clip.platform === 'spreaker' ? 'Spreaker' : clip.platform === 'spotify' ? 'Spotify' : 'Podcast Clip';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full rounded-[14px] overflow-hidden border border-gray-800 bg-black text-white shadow-sm flex flex-col group relative select-none",
        children: [
            streamUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                ref: audioRef,
                src: streamUrl,
                preload: "metadata",
                onTimeUpdate: handleTimeUpdate,
                onEnded: ()=>{
                    setIsPlaying(false);
                    setIsClipFinished(true);
                },
                onError: ()=>{
                    setIsPlaying(false);
                }
            }, void 0, false, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 454,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3.5 sm:p-4 flex items-start gap-3.5 sm:gap-4 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-1.5 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden border border-gray-800 bg-neutral-900 flex items-center justify-center cursor-pointer group/cover",
                                onClick: togglePlay,
                                title: isPlaying ? "Click to Pause" : "Click to Play",
                                children: [
                                    artworkUrl && !hasArtworkError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: artworkUrl,
                                        alt: title || 'Podcast Cover',
                                        className: "w-full h-full object-cover",
                                        onError: ()=>setHasArtworkError(true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 479,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-full bg-neutral-900 flex flex-col items-center justify-center p-2 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "24",
                                            height: "24",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "#FFFFFF",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 488,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 487,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 486,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover/cover:opacity-100'}`,
                                        children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "22",
                                            height: "22",
                                            viewBox: "0 0 24 24",
                                            fill: "white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "6",
                                                    y: "4",
                                                    width: "4",
                                                    height: "16",
                                                    rx: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 497,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "14",
                                                    y: "4",
                                                    width: "4",
                                                    height: "16",
                                                    rx: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 498,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 496,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "22",
                                            height: "22",
                                            viewBox: "0 0 24 24",
                                            fill: "white",
                                            className: "ml-0.5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                points: "5 3 19 12 5 21 5 3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 502,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 494,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 473,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[12px] text-white font-medium text-center",
                                children: displayPlatform
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 509,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 472,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0 flex flex-col justify-center gap-1.5 py-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12px] font-mono text-gray-400",
                                    children: [
                                        formatTimestamp(clip.start),
                                        " – ",
                                        formatTimestamp(clip.end),
                                        " (",
                                        clip.duration,
                                        "s)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 517,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-[15px] font-semibold text-white leading-snug line-clamp-2",
                                title: title,
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] text-gray-400 truncate",
                                children: showName
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 531,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 515,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 470,
                columnNumber: 7
            }, this),
            isClipFinished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-3.5 sm:mx-4 mb-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[11px] text-gray-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "13",
                                height: "13",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                    points: "20 6 9 17 4 12"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 542,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 541,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Clip snippet ended (",
                                    clip.duration,
                                    "s limit)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 544,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 540,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleReplay,
                        className: "font-semibold text-white hover:underline cursor-pointer",
                        children: "Replay"
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 546,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 539,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3.5 sm:px-4 py-2.5 bg-black border-t border-gray-800 flex flex-col gap-2",
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "range",
                            min: "0",
                            max: clip.duration,
                            step: "0.1",
                            value: clipProgress,
                            onChange: handleSeek,
                            className: "w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#2475FC]"
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 563,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 562,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-[11px] font-medium text-gray-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: togglePlay,
                                        className: "text-white hover:text-[#38BDF8] transition-colors cursor-pointer",
                                        title: isPlaying ? "Pause" : "Play",
                                        children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "6",
                                                    y: "4",
                                                    width: "4",
                                                    height: "16"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 585,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "14",
                                                    y: "4",
                                                    width: "4",
                                                    height: "16"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 585,
                                                    columnNumber: 60
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 584,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                points: "5 3 19 12 5 21 5 3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 589,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 588,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 577,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleReplay,
                                        className: "text-gray-400 hover:text-white transition-colors cursor-pointer",
                                        title: "Replay Clip",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "13",
                                            height: "13",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2.2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M1 4v6h6M23 20v-6h-6"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 601,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 602,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 600,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 594,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: toggleMute,
                                        className: "text-gray-400 hover:text-white transition-colors cursor-pointer",
                                        title: isMuted ? "Unmute" : "Mute",
                                        children: isMuted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 613,
                                                    columnNumber: 115
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "23",
                                                    y1: "9",
                                                    x2: "17",
                                                    y2: "15"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 613,
                                                    columnNumber: 168
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "17",
                                                    y1: "9",
                                                    x2: "23",
                                                    y2: "15"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 613,
                                                    columnNumber: 206
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 613,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 615,
                                                    columnNumber: 115
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 615,
                                                    columnNumber: 168
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 615,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 606,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-gray-300",
                                        children: [
                                            formatSec(clipProgress),
                                            " / ",
                                            formatSec(clip.duration)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 620,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 576,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: mediaUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-gray-400 hover:text-white flex items-center gap-1 transition-colors text-[11px]",
                                title: `Open original on ${displayPlatform}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Open on ",
                                            displayPlatform
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 632,
                                        columnNumber: 13
                                    }, this),
                                    " ↗"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 625,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 575,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 557,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/home/page.jsx",
        lineNumber: 451,
        columnNumber: 5
    }, this);
}
_s1(AudioClipPlayer, "4erkEEygN+LaPl+/AdyezT2gYcw=");
_c1 = AudioClipPlayer;
function HomePage() {
    _s2();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('home');
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoadingAuth, setIsLoadingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [bookmarked, setBookmarked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [postText, setPostText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [commentInputs, setCommentInputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [editingCommentId, setEditingCommentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingCommentText, setEditingCommentText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [copiedPostId, setCopiedPostId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPosting, setIsPosting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExtensionConnected, setIsExtensionConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [workspaces, setWorkspaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [trendingTags, setTrendingTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [suggestedUsers, setSuggestedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [followedState, setFollowedState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Onboarding Modal state
    const [showOnboarding, setShowOnboarding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [onboardingName, setOnboardingName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [onboardingHandle, setOnboardingHandle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [onboardingAvatar, setOnboardingAvatar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [onboardingBio, setOnboardingBio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [onboardingInterests, setOnboardingInterests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [onboardingError, setOnboardingError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSubmittingOnboarding, setIsSubmittingOnboarding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAvatarInput, setShowAvatarInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customAvatarUrl, setCustomAvatarUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Profile View States (Matching Twitter / Project Data)
    const [profileName, setProfileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [profileHandle, setProfileHandle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [profileHeadline, setProfileHeadline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [profileBio, setProfileBio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [profileAvatar, setProfileAvatar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [profileBanner, setProfileBanner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSavingProfile, setIsSavingProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [profileSaveSuccess, setProfileSaveSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [profileError, setProfileError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Twitter-style Profile Tabs & Followers States (100% Real DB Data)
    const [activeProfileTab, setActiveProfileTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('annotations'); // 'annotations' | 'edit'
    const [showFollowersModal, setShowFollowersModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // 'followers' | 'following' | null
    const [followersSubTab, setFollowersSubTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('followers'); // 'followers' | 'following'
    const [followersSearchQuery, setFollowersSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Real Database Records from PostgreSQL
    const [userAnnotations, setUserAnnotations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [followersList, setFollowersList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [followingList, setFollowingList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // File Upload Refs
    const avatarFileInputRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const bannerFileInputRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const handleAvatarFileSelect = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setProfileError('Avatar size must be less than 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev)=>{
            if (ev.target?.result) {
                setProfileAvatar(ev.target.result);
            }
        };
        reader.readAsDataURL(file);
    };
    const handleBannerFileSelect = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) {
            setProfileError('Banner size must be less than 8MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev)=>{
            if (ev.target?.result) {
                setProfileBanner(ev.target.result);
            }
        };
        reader.readAsDataURL(file);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            if (currentUser) {
                setProfileName(currentUser.name || '');
                setProfileHandle(currentUser.handle || '');
                setProfileHeadline(currentUser.headline || 'AI & Systems Researcher');
                setProfileBio(currentUser.bio || '');
                setProfileAvatar(currentUser.avatar_url || '');
                setProfileBanner(currentUser.banner_url || '');
            }
        }
    }["HomePage.useEffect"], [
        currentUser
    ]);
    const formatJoinDate = (dateStr)=>{
        if (!dateStr) return 'October 2026';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        } catch (_) {
            return 'October 2026';
        }
    };
    const handleToggleFollowUser = async (targetUser)=>{
        const handle = targetUser.handle;
        const isNowFollowing = !targetUser.is_following;
        setFollowersList((prev)=>prev.map((u)=>u.handle === handle ? {
                    ...u,
                    is_following: isNowFollowing
                } : u));
        setFollowingList((prev)=>{
            if (isNowFollowing) {
                const exists = prev.some((u)=>u.handle === handle);
                return exists ? prev.map((u)=>u.handle === handle ? {
                        ...u,
                        is_following: true
                    } : u) : [
                    ...prev,
                    {
                        ...targetUser,
                        is_following: true
                    }
                ];
            } else {
                return prev.filter((u)=>u.handle !== handle);
            }
        });
        setCurrentUser((prev)=>prev ? {
                ...prev,
                followingCount: Math.max(0, (prev.followingCount || 0) + (isNowFollowing ? 1 : -1))
            } : prev);
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
        if (token) {
            try {
                await fetch(`http://localhost:5000/api/follows/${handle}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (_) {}
        }
    };
    const openFollowersModal = (tab = 'followers')=>{
        setFollowersSubTab(tab);
        setShowFollowersModal(tab);
    };
    const handleSaveProfile = async (e)=>{
        if (e) e.preventDefault();
        setProfileError('');
        setProfileSaveSuccess(false);
        let clean = (profileHandle || '').trim().toLowerCase().replace(/@gmail\.com|gmailcom/gi, '').replace(/[^a-z0-9_]/g, '');
        if (!clean || clean.length < 3) {
            setProfileError('Username is required and must be at least 3 English characters.');
            return;
        }
        setIsSavingProfile(true);
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
        try {
            if (token) {
                const res = await fetch('http://localhost:5000/api/user/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: profileName,
                        handle: clean,
                        headline: profileHeadline,
                        bio: profileBio,
                        avatarUrl: profileAvatar,
                        bannerUrl: profileBanner
                    })
                });
                const data = await res.json();
                if (data && data.success && data.user) {
                    const updated = {
                        ...currentUser,
                        ...data.user,
                        avatar_url: profileAvatar || data.user.avatar_url,
                        banner_url: profileBanner || data.user.banner_url
                    };
                    setCurrentUser(updated);
                    localStorage.setItem('annotated_user', JSON.stringify(updated));
                    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
                        chrome.storage.local.set({
                            annotated_user: updated
                        });
                    }
                    setProfileSaveSuccess(true);
                    setTimeout(()=>setProfileSaveSuccess(false), 3000);
                    return;
                } else if (data && data.error) {
                    throw new Error(data.error);
                }
            }
            // Local update fallback
            const updated = {
                ...currentUser,
                name: profileName,
                handle: clean,
                headline: profileHeadline,
                bio: profileBio,
                avatar_url: profileAvatar,
                banner_url: profileBanner
            };
            setCurrentUser(updated);
            localStorage.setItem('annotated_user', JSON.stringify(updated));
            if (typeof chrome !== 'undefined' && chrome.storage?.local) {
                chrome.storage.local.set({
                    annotated_user: updated
                });
            }
            setProfileSaveSuccess(true);
            setTimeout(()=>setProfileSaveSuccess(false), 3000);
        } catch (err) {
            setProfileError(err.message || 'Error updating profile');
        } finally{
            setIsSavingProfile(false);
        }
    };
    const handleToggleSupport = async ()=>{
        const nextVal = !supportAccess;
        setSupportAccess(nextVal);
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
        if (token) {
            try {
                await fetch('http://localhost:5000/api/user/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        preferences: {
                            support_access: nextVal
                        }
                    })
                });
            } catch (_) {}
        }
    };
    const INTEREST_OPTIONS = [
        'Technology',
        'AI',
        'Web3',
        'Business',
        'Science',
        'Finance',
        'Culture',
        'Sports'
    ];
    // Helper for dynamic login route
    const getLoginTarget = (query = '')=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const base = window.location.hostname === 'localhost' && !window.location.pathname.endsWith('.html') ? '/login' : './login.html';
        return query ? `${base}?${query}` : base;
    };
    // Helpers for Media Rendering & Link Navigation
    const parseYouTubeClip = (url)=>{
        if (!url) return null;
        try {
            const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
            const match = url.match(regExp);
            if (!match || !match[1]) return null;
            const videoId = match[1];
            let start = 0;
            let end = null;
            try {
                const u = new URL(url);
                if (u.searchParams.has('start')) {
                    start = parseInt(u.searchParams.get('start'), 10) || 0;
                } else if (u.searchParams.has('t')) {
                    const t = u.searchParams.get('t') || '';
                    const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/);
                    if (m && (m[1] || m[2] || m[3])) {
                        const h = parseInt(m[1] || '0', 10);
                        const min = parseInt(m[2] || '0', 10);
                        const s = parseInt(m[3] || '0', 10);
                        start = h * 3600 + min * 60 + s;
                    } else {
                        start = parseInt(t, 10) || 0;
                    }
                }
                if (u.searchParams.has('end')) {
                    end = parseInt(u.searchParams.get('end'), 10) || null;
                }
            } catch (_) {}
            start = Math.max(0, start);
            // Strictly enforce max clip duration of 90 seconds
            if (end == null || end <= start) {
                end = start + 90;
            }
            if (end - start > 90) {
                end = start + 90;
            }
            const duration = end - start;
            const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?start=${start}&end=${end}&rel=0`;
            return {
                videoId,
                start,
                end,
                duration,
                embedUrl
            };
        } catch (_) {}
        return null;
    };
    const parseAudioClip = (url, post)=>{
        if (!url) return null;
        try {
            const u = new URL(url);
            const host = u.hostname.toLowerCase();
            const path = u.pathname.toLowerCase();
            const isSpreaker = host.includes('spreaker.com');
            const isSoundCloud = host.includes('soundcloud.com');
            const isSpotify = host.includes('spotify.com');
            const isApplePodcasts = host.includes('podcasts.apple.com');
            const isPodcast = host.includes('podbean.com') || host.includes('anchor.fm') || host.includes('castbox.fm');
            const isAudioFile = /\.(mp3|m4a|wav|aac|ogg|webm|opus)(\?.*)?$/i.test(url);
            const isAudioType = post?.media_type === 'audio';
            if (!isSpreaker && !isSoundCloud && !isSpotify && !isApplePodcasts && !isPodcast && !isAudioFile && !isAudioType) {
                return null;
            }
            let spreakerEpisodeId = null;
            let streamUrl = null;
            if (isSpreaker) {
                // e.g. /episode/yasr-alhzymy-1-alshkhsyt-alqwyt-1--70015408 or /episode/70015408
                const match = url.match(/(?:--|\/episode\/|episode_id=)(\d+)/i);
                if (match && match[1]) {
                    spreakerEpisodeId = match[1];
                    streamUrl = `https://api.spreaker.com/v2/episodes/${spreakerEpisodeId}/play.mp3`;
                }
            } else if (isAudioFile) {
                streamUrl = url;
            }
            let start = 0;
            let end = null;
            if (u.searchParams.has('start')) {
                start = parseInt(u.searchParams.get('start'), 10) || 0;
            } else if (u.searchParams.has('t')) {
                const t = u.searchParams.get('t') || '';
                const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/);
                if (m && (m[1] || m[2] || m[3])) {
                    const h = parseInt(m[1] || '0', 10);
                    const min = parseInt(m[2] || '0', 10);
                    const s = parseInt(m[3] || '0', 10);
                    start = h * 3600 + min * 60 + s;
                } else {
                    start = parseInt(t, 10) || 0;
                }
            }
            if (u.searchParams.has('end')) {
                end = parseInt(u.searchParams.get('end'), 10) || null;
            }
            start = Math.max(0, start);
            if (end == null || end <= start) {
                end = start + 90;
            }
            if (end - start > 90) {
                end = start + 90;
            }
            const duration = end - start;
            let platform = 'audio';
            if (isSpreaker) platform = 'spreaker';
            else if (isSoundCloud) platform = 'soundcloud';
            else if (isSpotify) platform = 'spotify';
            else if (isApplePodcasts) platform = 'apple';
            return {
                platform,
                spreakerEpisodeId,
                streamUrl,
                start,
                end,
                duration
            };
        } catch (_) {}
        return null;
    };
    const formatSeconds = (sec)=>{
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    const isDirectImageUrl = (url)=>{
        if (!url) return false;
        if (url.startsWith('data:image/')) return true;
        return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(url);
    };
    // Strict Authentication Guard & Real Data Loader
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            let token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
            // Load stored user immediately for instant rendering
            if ("TURBOPACK compile-time truthy", 1) {
                const storedUser = localStorage.getItem('annotated_user');
                if (storedUser) {
                    try {
                        const parsed = JSON.parse(storedUser);
                        setCurrentUser(parsed);
                        if (parsed.onboarding_completed) {
                            setShowOnboarding(false);
                        }
                    } catch (_) {}
                }
            }
            // Capture OAuth token passed in URL from Google / X callbacks
            if ("TURBOPACK compile-time truthy", 1) {
                const params = new URLSearchParams(window.location.search);
                const urlToken = params.get('token');
                if (urlToken) {
                    token = urlToken;
                    localStorage.setItem('annotated_token', urlToken);
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
            // 1. Strict Auth Barrier: If not logged in, immediately redirect to Login!
            if (!token) {
                if ("TURBOPACK compile-time truthy", 1) {
                    window.location.href = getLoginTarget();
                }
                return;
            }
            // 2. Verify Session with PostgreSQL Backend API
            fetch('http://localhost:5000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then({
                "HomePage.useEffect": (res)=>{
                    if (!res.ok) throw new Error('Session invalid or expired');
                    return res.json();
                }
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success && data.user) {
                        const fullUser = {
                            ...data.user,
                            notesCount: data.stats?.notesCount || 0,
                            annotationsCount: data.stats?.annotationsCount || 0,
                            workspacesCount: data.stats?.workspacesCount || 0,
                            followersCount: data.stats?.followersCount || 0,
                            followingCount: data.stats?.followingCount || 0
                        };
                        setCurrentUser(fullUser);
                        if (data.workspaces && data.workspaces.length > 0) {
                            setWorkspaces(data.workspaces);
                        }
                        localStorage.setItem('annotated_user', JSON.stringify(fullUser));
                        if ("TURBOPACK compile-time truthy", 1) {
                            window.postMessage({
                                type: 'ANNOTATED_AUTH_SUCCESS',
                                token,
                                user: fullUser
                            }, '*');
                            if (window.chrome?.storage?.local) {
                                window.chrome.storage.local.set({
                                    annotated_token: token,
                                    annotated_user: fullUser
                                }).catch({
                                    "HomePage.useEffect": ()=>{}
                                }["HomePage.useEffect"]);
                            }
                        }
                        if (fullUser.onboarding_completed) {
                            setShowOnboarding(false);
                        }
                        setIsLoadingAuth(false);
                    }
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{
                    // If server is offline but we have valid local user, keep user logged in
                    if (!localStorage.getItem('annotated_user')) {
                        localStorage.removeItem('annotated_token');
                        if ("TURBOPACK compile-time truthy", 1) {
                            window.location.href = getLoginTarget();
                        }
                    } else {
                        setIsLoadingAuth(false);
                    }
                }
            }["HomePage.useEffect"]);
            // 3. Fetch Real Posts from SQLite
            fetch('http://localhost:5000/api/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then({
                "HomePage.useEffect": (res)=>res.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success && data.posts && data.posts.length > 0) {
                        const formatted = data.posts.map({
                            "HomePage.useEffect.formatted": (p)=>({
                                    id: p.id,
                                    author_name: p.author_name || 'Annotated Researcher',
                                    author_handle: p.author_handle || 'researcher',
                                    author_avatar: p.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.author_name || 'User')}`,
                                    time: new Date(p.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }),
                                    content: p.content,
                                    hashtags: Array.isArray(p.hashtags) ? p.hashtags : JSON.parse(p.hashtags || '[]'),
                                    media_url: p.media_url,
                                    media_type: p.media_type,
                                    thumbnail_url: p.thumbnail_url || null,
                                    likes_count: p.likes_count || 0,
                                    is_liked: Boolean(p.is_liked),
                                    comments: Array.isArray(p.comments) ? p.comments : [],
                                    comments_count: p.comments_count != null ? p.comments_count : Array.isArray(p.comments) ? p.comments.length : 0
                                })
                        }["HomePage.useEffect.formatted"]);
                        setPosts(formatted);
                    }
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{}
            }["HomePage.useEffect"]);
            // 4. Fetch Trending Research Tags from PostgreSQL
            fetch('http://localhost:5000/api/tags/trending').then({
                "HomePage.useEffect": (res)=>res.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success && data.tags) {
                        setTrendingTags(data.tags);
                    }
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{}
            }["HomePage.useEffect"]);
            // 5. Fetch Real Suggested Users from PostgreSQL
            fetch('http://localhost:5000/api/users/suggested', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then({
                "HomePage.useEffect": (res)=>res.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success && data.users) {
                        setSuggestedUsers(data.users);
                    }
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{}
            }["HomePage.useEffect"]);
            // 6. Fetch Real Activities from PostgreSQL
            fetch('http://localhost:5000/api/activities', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then({
                "HomePage.useEffect": (res)=>res.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success && data.activities) {
                        setActivities(data.activities);
                    }
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{}
            }["HomePage.useEffect"]);
            // 7. Fetch User Followers & Following from PostgreSQL
            fetch('http://localhost:5000/api/user/followers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then({
                "HomePage.useEffect": (res)=>res.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success && Array.isArray(data.followers)) {
                        setFollowersList(data.followers);
                    }
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{}
            }["HomePage.useEffect"]);
            fetch('http://localhost:5000/api/user/following', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then({
                "HomePage.useEffect": (res)=>res.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success && Array.isArray(data.following)) {
                        setFollowingList(data.following);
                    }
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{}
            }["HomePage.useEffect"]);
            // 8. Fetch Real User Annotations from PostgreSQL
            fetch('http://localhost:5000/api/annotations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then({
                "HomePage.useEffect": (res)=>res.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success && Array.isArray(data.annotations)) {
                        setUserAnnotations(data.annotations);
                    }
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": ()=>{}
            }["HomePage.useEffect"]);
            // Check Chrome Extension bridge
            if ("TURBOPACK compile-time truthy", 1) {
                window.addEventListener('message', {
                    "HomePage.useEffect": (event)=>{
                        if (event.data?.type === 'ANNOTATED_EXTENSION_PONG') {
                            setIsExtensionConnected(true);
                        }
                        if (event.data?.type === 'ANNOTATION_PUBLISHED_BY_EXTENSION') {
                            const newAnnot = event.data.annotation;
                            const newPost = event.data.post;
                            if (newAnnot) {
                                setUserAnnotations({
                                    "HomePage.useEffect": (prev)=>[
                                            newAnnot,
                                            ...prev.filter({
                                                "HomePage.useEffect": (a)=>a.id !== newAnnot.id
                                            }["HomePage.useEffect"])
                                        ]
                                }["HomePage.useEffect"]);
                                setCurrentUser({
                                    "HomePage.useEffect": (prev)=>prev ? {
                                            ...prev,
                                            annotationsCount: (prev.annotationsCount || 0) + 1
                                        } : prev
                                }["HomePage.useEffect"]);
                            }
                            if (newPost) {
                                setPosts({
                                    "HomePage.useEffect": (prev)=>[
                                            newPost,
                                            ...prev.filter({
                                                "HomePage.useEffect": (p)=>p.id !== newPost.id
                                            }["HomePage.useEffect"])
                                        ]
                                }["HomePage.useEffect"]);
                                setCurrentUser({
                                    "HomePage.useEffect": (prev)=>prev ? {
                                            ...prev,
                                            notesCount: (prev.notesCount || 0) + 1
                                        } : prev
                                }["HomePage.useEffect"]);
                            }
                        }
                        if (event.data?.type === 'COMMENT_ADDED_BY_EXTENSION') {
                            const { postId, comment } = event.data;
                            if (postId && comment) {
                                setPosts({
                                    "HomePage.useEffect": (prev)=>prev.map({
                                            "HomePage.useEffect": (p)=>{
                                                if (p.id === postId) {
                                                    const existing = Array.isArray(p.comments) ? p.comments : [];
                                                    if (!existing.some({
                                                        "HomePage.useEffect": (c)=>(typeof c === 'object' ? c.id : null) === comment.id
                                                    }["HomePage.useEffect"])) {
                                                        return {
                                                            ...p,
                                                            comments: [
                                                                ...existing,
                                                                comment
                                                            ],
                                                            comments_count: (p.comments_count || 0) + 1
                                                        };
                                                    }
                                                }
                                                return p;
                                            }
                                        }["HomePage.useEffect"])
                                }["HomePage.useEffect"]);
                            }
                        }
                    }
                }["HomePage.useEffect"]);
                window.postMessage({
                    type: 'ANNOTATED_EXTENSION_PING'
                }, '*');
            }
        }
    }["HomePage.useEffect"], []);
    // Trigger Onboarding Modal only if user has finished auth loading and has not completed onboarding
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            if (!isLoadingAuth && currentUser) {
                const isCompleted = !!(currentUser.onboarding_completed || ("TURBOPACK compile-time value", "object") !== 'undefined' && (localStorage.getItem(`onboarding_completed_${currentUser.id}`) === 'true' || currentUser.email && localStorage.getItem(`onboarding_completed_${currentUser.email}`) === 'true' || currentUser.handle && localStorage.getItem(`onboarding_completed_${currentUser.handle}`) === 'true' || localStorage.getItem('annotated_onboarding_done') === 'true'));
                if (isCompleted) {
                    setShowOnboarding(false);
                    return;
                }
                setShowOnboarding(true);
                setOnboardingName(currentUser.name || '');
                let initialHandle = (currentUser.handle || '').replace(/@gmail\.com|gmailcom/gi, '');
                if (!initialHandle || initialHandle.startsWith('user_')) {
                    const emailPrefix = currentUser.email ? currentUser.email.split('@')[0] : '';
                    const namePrefix = currentUser.name ? currentUser.name : '';
                    const baseSource = emailPrefix || namePrefix || 'user';
                    const base = baseSource.toLowerCase().replace(/@gmail\.com|gmailcom/gi, '').replace(/[^a-z0-9_]/g, '');
                    initialHandle = base.length >= 3 ? base : 'user' + Math.floor(Math.random() * 1000);
                }
                setOnboardingHandle(initialHandle);
                setOnboardingAvatar(currentUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || 'User')}`);
                setOnboardingBio(currentUser.bio || '');
                setOnboardingInterests(Array.isArray(currentUser.interests) ? currentUser.interests : []);
            } else if (currentUser?.onboarding_completed) {
                setShowOnboarding(false);
            }
        }
    }["HomePage.useEffect"], [
        currentUser,
        isLoadingAuth
    ]);
    const toggleInterest = (interest)=>{
        setOnboardingInterests((prev)=>prev.includes(interest) ? prev.filter((i)=>i !== interest) : [
                ...prev,
                interest
            ]);
    };
    const handleOnboardingSubmit = async (e)=>{
        e.preventDefault();
        setOnboardingError('');
        const cleanHandle = onboardingHandle.trim().toLowerCase();
        if (!cleanHandle || cleanHandle.length < 3) {
            setOnboardingError('اسم المستخدم (Username) مطلوب ويجب أن لا يقل عن 3 أحرف إنجليزية.');
            return;
        }
        if (!/^[a-zA-Z0-9_]{3,}$/.test(cleanHandle)) {
            setOnboardingError('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية أو أرقام أو شرطة سفلية فقط (3 أحرف على الأقل).');
            return;
        }
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
        setIsSubmittingOnboarding(true);
        const updatedUser = {
            ...currentUser,
            name: onboardingName,
            handle: cleanHandle,
            avatar_url: onboardingAvatar,
            bio: onboardingBio,
            interests: onboardingInterests,
            onboarding_completed: true
        };
        try {
            if (token) {
                const res = await fetch('http://localhost:5000/api/user/onboarding', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: onboardingName,
                        handle: cleanHandle,
                        avatarUrl: onboardingAvatar,
                        bio: onboardingBio,
                        interests: onboardingInterests
                    })
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Failed to update profile');
                }
                if (data && data.success && data.user) {
                    Object.assign(updatedUser, data.user, {
                        onboarding_completed: true
                    });
                }
            }
            // Save session locally and in Chrome extension storage ONLY on success
            setCurrentUser(updatedUser);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem(`onboarding_completed_${updatedUser.id}`, 'true');
                if (updatedUser.email) localStorage.setItem(`onboarding_completed_${updatedUser.email}`, 'true');
                if (updatedUser.handle) localStorage.setItem(`onboarding_completed_${updatedUser.handle}`, 'true');
                localStorage.setItem('annotated_onboarding_done', 'true');
                localStorage.setItem('annotated_user', JSON.stringify(updatedUser));
                if (typeof chrome !== 'undefined' && chrome.storage?.local) {
                    chrome.storage.local.set({
                        annotated_user: updatedUser,
                        annotated_token: token
                    });
                }
            }
            setShowOnboarding(false);
        } catch (err) {
            console.warn('Backend onboarding update warning:', err.message);
            setOnboardingError(err.message || 'An error occurred while saving.');
        } finally{
            setIsSubmittingOnboarding(false);
        }
    };
    const dismissOnboarding = ()=>{
        if (currentUser && ("TURBOPACK compile-time value", "object") !== 'undefined') {
            localStorage.setItem(`onboarding_completed_${currentUser.id}`, 'true');
            if (currentUser.email) localStorage.setItem(`onboarding_completed_${currentUser.email}`, 'true');
            if (currentUser.handle) localStorage.setItem(`onboarding_completed_${currentUser.handle}`, 'true');
            localStorage.setItem('annotated_onboarding_done', 'true');
            const updated = {
                ...currentUser,
                onboarding_completed: true
            };
            setCurrentUser(updated);
            localStorage.setItem('annotated_user', JSON.stringify(updated));
        }
        setShowOnboarding(false);
    };
    const handleSearch = async (term)=>{
        setSearchQuery(term);
        if (!term || !term.trim()) {
            setSearchResults([]);
            return;
        }
        const token = localStorage.getItem('annotated_token');
        if (!token) return;
        setIsSearching(true);
        try {
            const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(term.trim())}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setSearchResults(data.results || []);
            }
        } catch (_) {} finally{
            setIsSearching(false);
        }
    };
    const toggleFollow = async (name)=>{
        setFollowedState((prev)=>({
                ...prev,
                [name]: !prev[name]
            }));
        const token = localStorage.getItem('annotated_token');
        if (token) {
            try {
                await fetch(`http://localhost:5000/api/follows/${name}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (_) {}
        }
    };
    const handleLike = async (postId = 'seed-post-1')=>{
        setPosts((prev)=>prev.map((p)=>{
                if (p.id === postId) {
                    return {
                        ...p,
                        is_liked: !p.is_liked,
                        likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1
                    };
                }
                return p;
            }));
        const token = localStorage.getItem('annotated_token');
        if (token) {
            try {
                await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (_) {}
        }
    };
    const handleCreatePost = async ()=>{
        if (!postText.trim() || isPosting) return;
        setIsPosting(true);
        const token = localStorage.getItem('annotated_token');
        const newPostItem = {
            id: 'local-' + Date.now(),
            author_name: currentUser.name,
            author_handle: currentUser.handle,
            author_avatar: currentUser.avatar_url,
            time: 'Just now',
            content: postText.trim(),
            hashtags: [
                '#Annotated',
                '#WorkspaceNotes'
            ],
            media_url: null,
            likes_count: 0,
            is_liked: false,
            comments: []
        };
        setPosts((prev)=>[
                newPostItem,
                ...prev
            ]);
        setPostText('');
        if (token) {
            try {
                const res = await fetch('http://localhost:5000/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        content: newPostItem.content,
                        hashtags: newPostItem.hashtags
                    })
                });
                const data = await res.json();
                if (data.success && data.post) {
                    // Update temp id with real backend id
                    setPosts((prev)=>prev.map((p)=>p.id === newPostItem.id ? {
                                ...p,
                                id: data.post.id
                            } : p));
                }
            } catch (_) {}
        }
        setIsPosting(false);
    };
    const handleSharePost = async (post)=>{
        if (!post) return;
        const origin = ("TURBOPACK compile-time truthy", 1) ? window.location.origin : "TURBOPACK unreachable";
        const shareUrl = `${origin}/home?post=${post.id}`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: 'Annotated Post',
                    text: post.content || 'Check out this note on Annotated',
                    url: shareUrl
                });
                return;
            } catch (_) {}
        }
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopiedPostId(post.id);
            setTimeout(()=>setCopiedPostId(null), 2200);
        } catch (_) {
            setCopiedPostId(post.id);
            setTimeout(()=>setCopiedPostId(null), 2200);
        }
    };
    const handleAddComment = async (postId)=>{
        const text = (commentInputs[postId] || '').trim();
        if (!text) return;
        // Clear input immediately
        setCommentInputs((prev)=>({
                ...prev,
                [postId]: ''
            }));
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
        const tempCommentId = 'temp-' + Date.now();
        const newComment = {
            id: tempCommentId,
            post_id: postId,
            user_id: currentUser?.id,
            content: text,
            created_at: new Date().toISOString(),
            author_name: currentUser?.name || currentUser?.handle || 'User',
            author_handle: currentUser?.handle || 'user',
            author_avatar: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`
        };
        // Optimistic add
        setPosts((prev)=>prev.map((p)=>{
                if (p.id === postId) {
                    const existing = Array.isArray(p.comments) ? p.comments : [];
                    return {
                        ...p,
                        comments: [
                            ...existing,
                            newComment
                        ],
                        comments_count: (p.comments_count != null ? p.comments_count : existing.length) + 1
                    };
                }
                return p;
            }));
        if (token) {
            try {
                const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        content: text
                    })
                });
                const data = await res.json();
                if (data.success && data.comment) {
                    setPosts((prev)=>prev.map((p)=>{
                            if (p.id === postId) {
                                return {
                                    ...p,
                                    comments: (p.comments || []).map((c)=>c.id === tempCommentId ? data.comment : c)
                                };
                            }
                            return p;
                        }));
                }
            } catch (err) {
                console.error('Failed to post comment:', err);
            }
        }
    };
    const handleStartEditComment = (comment)=>{
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.content || '');
    };
    const handleCancelEditComment = ()=>{
        setEditingCommentId(null);
        setEditingCommentText('');
    };
    const handleSaveEditComment = async (commentId, postId)=>{
        const updatedContent = editingCommentText.trim();
        if (!updatedContent) return;
        // Optimistic update
        setPosts((prev)=>prev.map((p)=>{
                if (p.id === postId) {
                    return {
                        ...p,
                        comments: (p.comments || []).map((c)=>c.id === commentId ? {
                                ...c,
                                content: updatedContent
                            } : c)
                    };
                }
                return p;
            }));
        setEditingCommentId(null);
        setEditingCommentText('');
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
        if (token) {
            try {
                await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        content: updatedContent
                    })
                });
            } catch (err) {
                console.error('Failed to update comment:', err);
            }
        }
    };
    const handleDeleteComment = async (commentId, postId)=>{
        // Optimistic delete
        setPosts((prev)=>prev.map((p)=>{
                if (p.id === postId) {
                    const filtered = (p.comments || []).filter((c)=>c.id !== commentId);
                    return {
                        ...p,
                        comments: filtered,
                        comments_count: Math.max(0, (p.comments_count != null ? p.comments_count : 1) - 1)
                    };
                }
                return p;
            }));
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
        if (token) {
            try {
                await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (err) {
                console.error('Failed to delete comment:', err);
            }
        }
    };
    const handleLogout = async ()=>{
        // 1. Sign out completely from Supabase Auth client & revoke sessions globally
        try {
            await supabase.auth.signOut({
                scope: 'global'
            });
        } catch (_) {}
        // 2. Notify backend to terminate server session
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('annotated_token') : "TURBOPACK unreachable";
        if (token) {
            try {
                await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (_) {}
        }
        // 3. Clear ALL local storage tokens & cache (including any sb-* tokens)
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                const keysToRemove = [];
                for(let i = 0; i < localStorage.length; i++){
                    const k = localStorage.key(i);
                    if (k && (k.startsWith('annotated_') || k.startsWith('sb-') || k.includes('supabase'))) {
                        keysToRemove.push(k);
                    }
                }
                keysToRemove.forEach((k)=>localStorage.removeItem(k));
                sessionStorage.clear();
            } catch (_) {}
            // 4. Clear Chrome extension storage
            if (typeof chrome !== 'undefined' && chrome.storage?.local) {
                chrome.storage.local.remove([
                    'annotated_token',
                    'annotated_user',
                    'annotated_refresh_token'
                ]);
            }
            // 5. Redirect to login with logout flag to enforce fresh state
            window.location.href = getLoginTarget('logout=true');
        }
    };
    if (isLoadingAuth || !currentUser) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#F3F3F3] flex items-center justify-center font-poppins",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-7 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 border-3 border-[#3297EE] border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/src/app/home/page.jsx",
                    lineNumber: 1735,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 1734,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/home/page.jsx",
            lineNumber: 1733,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#F8F9FA] text-black font-poppins selection:bg-blue-600 selection:text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "hidden lg:flex fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-[#EAEAEA] flex-col justify-between p-4 z-40 shadow-[1px_0_4px_0_rgba(0,0,0,0.02)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "flex items-center gap-2.5 px-2 py-1.5 hover:opacity-85 transition-opacity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40",
                                        alt: "Annotated",
                                        className: "w-6 h-6 object-contain"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1751,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[17px] font-semibold text-[#1F2937] tracking-tight",
                                        children: "Annotated"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1756,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1750,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2.5 h-[38px] px-3 rounded-[12px] bg-[#F1F3F5] text-[#909090] focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "16",
                                                height: "16",
                                                viewBox: "0 0 19 19",
                                                fill: "none",
                                                className: "shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M15.7542 16.6055L10.549 11.4003C10.1531 11.7433 9.69132 12.0105 9.16354 12.2018C8.63576 12.3931 8.075 12.4888 7.48125 12.4888C6.05625 12.4888 4.84896 11.994 3.85937 11.0044C2.86979 10.0148 2.375 8.82075 2.375 7.42214C2.375 6.02352 2.86979 4.82943 3.85937 3.83984C4.84896 2.85026 6.04965 2.35547 7.46146 2.35547C8.86007 2.35547 10.0509 2.85026 11.0339 3.83984C12.0168 4.82943 12.5083 6.02352 12.5083 7.42214C12.5083 7.9895 12.416 8.53707 12.2312 9.06484C12.0465 9.59262 11.7694 10.0874 11.4 10.5492L16.625 15.7346L15.7542 16.6055ZM7.46146 11.3013C8.53021 11.3013 9.44062 10.922 10.1927 10.1633C10.9448 9.4046 11.3208 8.49089 11.3208 7.42214C11.3208 6.35339 10.9448 5.43967 10.1927 4.68099C9.44062 3.92231 8.53021 3.54297 7.46146 3.54297C6.37951 3.54297 5.4592 3.92231 4.70052 4.68099C3.94184 5.43967 3.5625 6.35339 3.5625 7.42214C3.5625 8.49089 3.94184 9.4046 4.70052 10.1633C5.4592 10.922 6.37951 11.3013 7.46146 11.3013Z",
                                                    fill: "#939393"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1763,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1762,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: searchQuery,
                                                onChange: (e)=>handleSearch(e.target.value),
                                                placeholder: "Search notes...",
                                                className: "w-full bg-transparent text-[12px] font-normal text-black placeholder-[#94A3B8] focus:outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1765,
                                                columnNumber: 15
                                            }, this),
                                            searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setSearchQuery('');
                                                    setSearchResults([]);
                                                },
                                                className: "text-xs text-gray-400 hover:text-black",
                                                children: "✕"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1773,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1761,
                                        columnNumber: 13
                                    }, this),
                                    searchResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute left-0 top-[44px] w-[260px] bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 z-50 space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider",
                                                children: "Search Results"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1780,
                                                columnNumber: 17
                                            }, this),
                                            searchResults.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-2 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-colors text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600",
                                                                    children: r.type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 1784,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-[12px] font-medium text-gray-800 truncate",
                                                                    children: r.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 1787,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 1783,
                                                            columnNumber: 21
                                                        }, this),
                                                        r.snippet && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] text-gray-500 truncate mt-0.5",
                                                            children: r.snippet
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 1789,
                                                            columnNumber: 35
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1782,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1779,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1760,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "space-y-1 pt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('home'),
                                        className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === 'home' ? 'bg-[#EDF5FF] text-[#2475FC] font-semibold' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === 'home' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-500'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "19",
                                                    height: "19",
                                                    viewBox: "0 0 19 19",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M3.16699 16.625V7.125L9.50033 2.375L15.8337 7.125V16.625H11.0837V11.0833H7.91699V16.625H3.16699Z",
                                                        fill: activeTab === 'home' ? '#2475FC' : '#94A3B8'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 1811,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1810,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1807,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[13px]",
                                                children: "Home"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1814,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1799,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('explore'),
                                        className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === 'explore' ? 'bg-[#EDF5FF] text-[#2475FC] font-semibold' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === 'explore' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-500'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "19",
                                                    height: "19",
                                                    viewBox: "0 0 19 19",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M5.99655 13.0018L11.3403 11.3591L12.983 6.01536L7.63926 7.65807L5.99655 13.0018ZM9.49492 10.2904C9.27379 10.2904 9.08735 10.2129 8.93561 10.058C8.78388 9.90324 8.70801 9.71522 8.70801 9.49395C8.70801 9.27281 8.78546 9.08637 8.94036 8.93464C9.09513 8.7829 9.28315 8.70703 9.50442 8.70703C9.72556 8.70703 9.912 8.78448 10.0637 8.93939C10.2155 9.09416 10.2913 9.28218 10.2913 9.50345C10.2913 9.72459 10.2139 9.91102 10.059 10.0628C9.90422 10.2145 9.7162 10.2904 9.49492 10.2904ZM9.50502 17.4154C8.41331 17.4154 7.38744 17.2076 6.42741 16.7919C5.46725 16.3763 4.62763 15.8089 3.90853 15.0898C3.18943 14.3707 2.62207 13.5307 2.20645 12.5696C1.79082 11.6085 1.58301 10.5816 1.58301 9.4888C1.58301 8.39604 1.79082 7.36912 2.20645 6.40803C2.62207 5.44695 3.18943 4.61016 3.90853 3.89766C4.62763 3.18516 5.46772 2.62109 6.4288 2.20547C7.38988 1.78984 8.41681 1.58203 9.50957 1.58203C10.6023 1.58203 11.6293 1.78984 12.5903 2.20547C13.5514 2.62109 14.3882 3.18516 15.1007 3.89766C15.8132 4.61016 16.3773 5.448 16.7929 6.4112C17.2085 7.37439 17.4163 8.40178 17.4163 9.4987C17.4163 10.5938 17.2085 11.623 16.7929 12.5862C16.3773 13.5494 15.8132 14.3872 15.1007 15.0997C14.3882 15.8122 13.5504 16.3763 12.5872 16.7919C11.624 17.2076 10.5948 17.4154 9.49967 17.4154C8.40454 17.4154 7.37537 17.2076 6.41217 16.7919ZM8.64863 16.2081V14.5852C8.18683 14.5852 7.79759 14.4136 7.48092 14.0706C7.16426 13.7275 7.00592 13.3251 7.00592 12.8633V11.9924L2.94863 7.93516C2.88266 8.19905 2.83648 8.45964 2.81009 8.71693C2.7837 8.97422 2.77051 9.23481 2.77051 9.4987C2.77051 11.214 3.32797 12.7115 4.4429 13.9914C5.55783 15.2713 6.95974 16.0102 8.64863 16.2081ZM14.4674 14.0706C15.0479 13.4372 15.4867 12.728 15.7835 11.943C16.0804 11.1579 16.2288 10.3431 16.2288 9.4987C16.2288 8.10009 15.8462 6.83012 15.0809 5.6888C14.3156 4.54748 13.2931 3.71293 12.0132 3.18516V3.54141C12.0132 4.00321 11.8549 4.40564 11.5382 4.7487C11.2215 5.09175 10.8323 5.26328 10.3705 5.26328H8.64863V6.98516C8.64863 7.20946 8.55957 7.39418 8.38145 7.53932C8.20332 7.68446 8.0021 7.75703 7.7778 7.75703H6.13509V9.4987H11.2413C11.4656 9.4987 11.6504 9.58446 11.7955 9.75599C11.9406 9.92752 12.0132 10.1254 12.0132 10.3497V12.8633H12.8643C13.2469 12.8633 13.5834 12.9754 13.8736 13.1997C14.1639 13.424 14.3618 13.7143 14.4674 14.0706Z",
                                                        fill: activeTab === 'explore' ? '#2475FC' : '#94A3B8'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 1830,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1829,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1826,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[13px]",
                                                children: "Explore"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1833,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1818,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('messages'),
                                        className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === 'messages' ? 'bg-[#EDF5FF] text-[#2475FC] font-semibold' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === 'messages' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-500'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "19",
                                                    height: "19",
                                                    viewBox: "0 0 19 19",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M1.58301 17.4154V2.76953C1.58301 2.45286 1.70176 2.17578 1.93926 1.93828C2.17676 1.70078 2.45384 1.58203 2.77051 1.58203H16.2288C16.5455 1.58203 16.8226 1.70078 17.0601 1.93828C17.2976 2.17578 17.4163 2.45286 17.4163 2.76953V13.0612C17.4163 13.3779 17.2976 13.6549 17.0601 13.8924C16.8226 14.1299 16.5455 14.2487 16.2288 14.2487H4.74967L1.58301 17.4154ZM4.23509 13.0612H16.2288V2.76953H2.77051V14.6445L4.23509 13.0612Z",
                                                        fill: activeTab === 'messages' ? '#2475FC' : '#94A3B8'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 1849,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1848,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1845,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[13px]",
                                                children: "Messages"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1852,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1837,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('notifications'),
                                        className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === 'notifications' ? 'bg-[#EDF5FF] text-[#2475FC] font-semibold' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === 'notifications' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-500'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "19",
                                                    height: "19",
                                                    viewBox: "0 0 19 19",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M3.16699 15.0404V13.8529H4.75033V7.8362C4.75033 6.72786 5.07689 5.73498 5.73001 4.85755C6.38314 3.98012 7.24408 3.42925 8.31283 3.20495V2.76953C8.31283 2.43967 8.42828 2.15929 8.65918 1.92839C8.89008 1.69748 9.17046 1.58203 9.50033 1.58203C9.83019 1.58203 10.1106 1.69748 10.3415 1.92839C10.5724 2.15929 10.6878 2.43967 10.6878 2.76953V3.20495C11.7566 3.42925 12.6175 3.98012 13.2706 4.85755C13.9238 5.73498 14.2503 6.72786 14.2503 7.8362V13.8529H15.8337V15.0404H3.16699ZM9.50033 17.4154C9.06491 17.4154 8.69217 17.2603 8.3821 16.9503C8.07203 16.6402 7.91699 16.2674 7.91699 15.832H11.0837C11.0837 16.2674 10.9286 16.6402 10.6186 16.9503C10.3085 17.2603 9.93574 17.4154 9.50033 17.4154ZM5.93783 13.8529H13.0628V7.8362C13.0628 6.84661 12.7165 6.00547 12.0238 5.31276C11.3311 4.62005 10.4899 4.2737 9.50033 4.2737C8.51074 4.2737 7.6696 4.62005 6.97689 5.31276C6.28418 6.00547 5.93783 6.84661 5.93783 7.8362V13.8529Z",
                                                        fill: activeTab === 'notifications' ? '#2475FC' : '#94A3B8'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 1868,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1867,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1864,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[13px]",
                                                children: "Notifications"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1871,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1856,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab('profile'),
                                        className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-[#EDF5FF] text-[#2475FC] font-semibold ring-1 ring-[#3297EE]/20 shadow-xs' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === 'profile' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-500'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "19",
                                                    height: "19",
                                                    viewBox: "0 0 19 19",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M0.751953 15.8336V13.9732C0.751953 13.5114 0.870703 13.0924 1.1082 12.7164C1.3457 12.3404 1.67556 12.06 2.09779 11.8753C3.06098 11.453 3.92852 11.1496 4.70039 10.9648C5.47227 10.7801 6.26723 10.6878 7.08529 10.6878C7.90334 10.6878 8.69501 10.7801 9.46029 10.9648C10.2256 11.1496 11.0898 11.453 12.053 11.8753C12.4752 12.06 12.8084 12.3404 13.0525 12.7164C13.2966 13.0924 13.4186 13.5114 13.4186 13.9732V15.8336H0.751953ZM14.6061 15.8336V13.9732C14.6061 13.1419 14.395 12.4591 13.9728 11.9247C13.5506 11.3904 12.9964 10.9582 12.3103 10.6284C13.2207 10.7339 14.0783 10.889 14.8832 11.0935C15.6881 11.298 16.3412 11.5322 16.8426 11.7961C17.278 12.0468 17.6211 12.3569 17.8717 12.7263C18.1224 13.0957 18.2478 13.5114 18.2478 13.9732V15.8336H14.6061ZM4.94779 8.64922C4.39362 8.09505 4.11654 7.38255 4.11654 6.51172C4.11654 5.64089 4.39362 4.92839 4.94779 4.37422C5.50195 3.82005 6.21445 3.54297 7.08529 3.54297C7.95612 3.54297 8.66862 3.82005 9.22279 4.37422C9.77695 4.92839 10.054 5.64089 10.054 6.51172C10.054 7.38255 9.77695 8.09505 9.22279 8.64922C8.66862 9.20339 7.95612 9.48047 7.08529 9.48047C6.21445 9.48047 5.50195 9.20339 4.94779 8.64922ZM13.379 8.64922C12.8249 9.20339 12.1124 9.48047 11.2415 9.48047C11.0964 9.48047 10.9348 9.47057 10.7566 9.45078C10.5785 9.43099 10.4169 9.39471 10.2717 9.34193C10.5884 9.01207 10.8292 8.60634 10.9941 8.12474C11.1591 7.64314 11.2415 7.10547 11.2415 6.51172C11.2415 5.91797 11.1591 5.39349 10.9941 4.93828C10.8292 4.48307 10.5884 4.06415 10.2717 3.68151C10.4169 3.64193 10.5785 3.60894 10.7566 3.58255C10.9348 3.55616 11.0964 3.54297 11.2415 3.54297C12.1124 3.54297 12.8249 3.82005 13.379 4.37422C13.9332 4.92839 14.2103 5.64089 14.2103 6.51172C14.2103 7.38255 13.9332 8.09505 13.379 8.64922ZM1.93945 14.6461H12.2311V13.9732C12.2311 13.7621 12.1684 13.5576 12.0431 13.3596C11.9178 13.1617 11.7627 13.0232 11.578 12.944C10.628 12.5218 9.82973 12.2381 9.1832 12.093C8.53668 11.9478 7.83737 11.8753 7.08529 11.8753C6.3332 11.8753 5.6306 11.9478 4.97747 12.093C4.32435 12.2381 3.52279 12.5218 2.57279 12.944C2.38806 13.0232 2.23633 13.1617 2.11758 13.3596C1.99883 13.5576 1.93945 13.7621 1.93945 13.9732V14.6461ZM8.36185 7.78828C8.69831 7.45182 8.86654 7.0263 8.86654 6.51172C8.86654 5.99714 8.69831 5.57161 8.36185 5.23516C8.02539 4.8987 7.59987 4.73047 7.08529 4.73047C6.5707 4.73047 6.14518 4.8987 5.80872 5.23516C5.47227 5.57161 5.30404 5.99714 5.30404 6.51172C5.30404 7.0263 5.47227 7.45182 5.80872 7.78828C6.14518 8.12474 6.5707 8.29297 7.08529 8.29297C7.59987 8.29297 8.02539 8.12474 8.36185 7.78828Z",
                                                        fill: activeTab === 'profile' ? '#2475FC' : '#94A3B8'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 1887,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1886,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1883,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[13px]",
                                                children: "Profile"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1890,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1875,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1797,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1748,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3 pt-4 border-t border-gray-100",
                        children: [
                            isExtensionConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1900,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Extension Connected"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1901,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1899,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>setActiveTab('profile'),
                                className: "flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2.5 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`,
                                            alt: currentUser?.name || 'User',
                                            className: "w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0",
                                            onError: (e)=>{
                                                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 1911,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[13px] font-semibold text-gray-900 truncate leading-tight group-hover:text-blue-600 transition-colors",
                                                    children: currentUser?.name || 'User'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1920,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[11px] text-gray-400 truncate",
                                                    children: [
                                                        "@",
                                                        currentUser?.handle || 'user'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 1923,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 1919,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 1910,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1906,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                className: "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "15",
                                        height: "15",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1936,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "16 17 21 12 16 7"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1937,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "21",
                                                y1: "12",
                                                x2: "9",
                                                y2: "12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 1938,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1935,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Log out"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 1940,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1931,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1896,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 1746,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "lg:hidden sticky top-0 z-30 w-full h-[56px] bg-white border-b border-[#EAEAEA] px-4 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40",
                                alt: "Annotated",
                                className: "w-5 h-5 object-contain"
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1950,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[15px] font-semibold text-[#202020]",
                                children: "Annotated"
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1955,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1949,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('profile'),
                        className: "flex items-center gap-2 cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`,
                            alt: "User",
                            className: "w-8 h-8 rounded-full object-cover border border-gray-200"
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 1961,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1957,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 1948,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] px-3 py-2 flex items-center justify-around",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('home'),
                        className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'home' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-400'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 19 19",
                            fill: "none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M3.16699 16.625V7.125L9.50033 2.375L15.8337 7.125V16.625H11.0837V11.0833H7.91699V16.625H3.16699Z",
                                fill: activeTab === 'home' ? '#2475FC' : '#94A3B8'
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1975,
                                columnNumber: 71
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 1975,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1971,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('explore'),
                        className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'explore' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-400'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 19 19",
                            fill: "none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M5.99655 13.0018L11.3403 11.3591L12.983 6.01536L7.63926 7.65807L5.99655 13.0018Z",
                                fill: activeTab === 'explore' ? '#2475FC' : '#94A3B8'
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1981,
                                columnNumber: 71
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 1981,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1977,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('messages'),
                        className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'messages' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-400'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 19 19",
                            fill: "none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M1.58301 17.4154V2.76953H16.2288V14.2487H4.74967L1.58301 17.4154Z",
                                fill: activeTab === 'messages' ? '#2475FC' : '#94A3B8'
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1987,
                                columnNumber: 71
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 1987,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1983,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('notifications'),
                        className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'notifications' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-400'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 19 19",
                            fill: "none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M3.16699 15.0404V13.8529H15.8337V15.0404H3.16699Z",
                                fill: activeTab === 'notifications' ? '#2475FC' : '#94A3B8'
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1993,
                                columnNumber: 71
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 1993,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1989,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('profile'),
                        className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-[#EDF5FF] text-[#2475FC] ring-1 ring-blue-200' : 'text-gray-400'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 19 19",
                            fill: "none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M0.751953 15.8336V13.9732H13.4186V15.8336H0.751953ZM4.94779 8.64922C4.39362 8.09505 4.94779 4.37422 7.08529 4.37422C9.22279 4.37422 9.77695 8.64922 7.08529 8.64922Z",
                                fill: activeTab === 'profile' ? '#2475FC' : '#94A3B8'
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 1999,
                                columnNumber: 71
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 1999,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 1995,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 1970,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "min-h-screen bg-[#F8F9FA] lg:pl-[240px] pb-24 lg:pb-10",
                children: [
                    activeTab === 'profile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-[24px] shadow-xs border border-gray-200/80 overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-44 sm:h-56 relative bg-gradient-to-r from-[#B9E2FE] via-[#C6EBFD] to-[#DDF0FA] overflow-hidden group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: profileBanner || currentUser?.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
                                                alt: "Cover",
                                                className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                                                onError: (e)=>{
                                                    e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2016,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>bannerFileInputRef.current?.click(),
                                                className: "absolute top-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[12px] font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-md cursor-pointer opacity-90 hover:opacity-100",
                                                title: "Upload Cover Banner",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "14",
                                                        height: "14",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2033,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                points: "17 8 12 3 7 8"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2034,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                x1: "12",
                                                                y1: "3",
                                                                x2: "12",
                                                                y2: "15"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2035,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2032,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Upload banner"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2037,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2026,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2015,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 sm:px-8 pb-6 border-b border-gray-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between -mt-12 sm:-mt-14 mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group cursor-pointer",
                                                        onClick: ()=>avatarFileInputRef.current?.click(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: profileAvatar || currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`,
                                                                alt: currentUser?.name || 'User',
                                                                className: "w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md object-cover bg-white ring-1 ring-black/5",
                                                                onError: (e)=>{
                                                                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2046,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg",
                                                                title: "Upload Profile Photo",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    width: "18",
                                                                    height: "18",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2061,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                            cx: "12",
                                                                            cy: "13",
                                                                            r: "4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2062,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2060,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2056,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2045,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "file",
                                                        ref: avatarFileInputRef,
                                                        accept: "image/*",
                                                        onChange: handleAvatarFileSelect,
                                                        className: "hidden"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2068,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "file",
                                                        ref: bannerFileInputRef,
                                                        accept: "image/*",
                                                        onChange: handleBannerFileSelect,
                                                        className: "hidden"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2075,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "pt-14 sm:pt-16 flex items-center gap-2.5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setActiveProfileTab((prev)=>prev === 'edit' ? 'overview' : 'edit'),
                                                            className: `flex items-center gap-2 px-5 py-2 rounded-full border text-[13px] sm:text-[14px] font-semibold shadow-xs transition-all cursor-pointer group active:scale-95 ${activeProfileTab === 'edit' ? 'bg-black text-white border-black hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    width: "15",
                                                                    height: "15",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    className: activeProfileTab === 'edit' ? 'text-white' : 'text-gray-500 group-hover:text-blue-600 transition-colors',
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2095,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2096,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2094,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "View profile edit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2098,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2085,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2084,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2043,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1 mt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                className: "text-xl sm:text-2xl font-bold text-gray-900 tracking-tight",
                                                                children: currentUser?.name || profileName || 'Annotated Researcher'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2106,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5 text-[#2475FC] shrink-0",
                                                                viewBox: "0 0 24 24",
                                                                fill: "currentColor",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M10.007 2.056c.866-.341 1.848-.341 2.714 0l.707.279c.477.188.995.275 1.51.255l.758-.029c.928-.036 1.83.376 2.457 1.121l.512.609c.348.413.784.73 1.275.927l.714.288c.875.352 1.534 1.109 1.794 2.062l.212.781c.145.534.425 1.018.817 1.411l.575.577c.704.706.993 1.724.786 2.7-.17.804-.17 1.642 0 2.446.207.976-.082 1.994-.786 2.7l-.575.577c-.392.393-.672.877-.817 1.411l-.212.781c-.26.953-.919 1.71-1.794 2.062l-.714.288c-.491.197-.927.514-1.275.927l-.512.609c-.627.745-1.529 1.157-2.457 1.121l-.758-.029c-.515-.02-1.033.067-1.51.255l-.707.279c-.866.341-1.848.341-2.714 0l-.707-.279c-.477-.188-.995-.275-1.51-.255l-.758.029c-.928.036-1.83-.376-2.457-1.121l-.512-.609c-.348-.413-.784-.73-1.275-.927l-.714-.288c-.875-.352-1.534-1.109-1.794-2.062l-.212-.781c-.145-.534-.425-1.018-.817-1.411l-.575-.577c-.704-.706-.993-1.724-.786-2.7.17-.804.17-1.642 0-2.446-.207-.976.082-1.994.786-2.7l.575-.577c.392-.393.672-.877.817-1.411l.212-.781c.26-.953.919-1.71 1.794-2.062l.714-.288c.491-.197.927-.514 1.275-.927l.512-.609c.627-.745 1.529-1.157 2.457-1.121l.758.029c.515.02 1.033-.067 1.51-.255l.707-.279zm1.096 12.355 4.95-4.95a.75.75 0 0 0-1.06-1.06l-4.42 4.419-2.07-2.07a.75.75 0 0 0-1.06 1.06l2.6 2.6a.75.75 0 0 0 1.06 0z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2111,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2110,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2105,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[13px] text-gray-500 font-normal",
                                                        children: [
                                                            "@",
                                                            currentUser?.handle || profileHandle || 'researcher'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2114,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2104,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[14px] text-gray-700 font-normal leading-relaxed mt-2.5 max-w-2xl",
                                                children: currentUser?.bio || profileBio || currentUser?.headline || 'AI & Systems Researcher. Knowledge curator on Annotated AI.'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2120,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[13px] text-gray-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "15",
                                                                height: "15",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                className: "text-gray-400",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2128,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                        cx: "12",
                                                                        cy: "10",
                                                                        r: "3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2129,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2127,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Annotated AI Research Hub"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2131,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2126,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "15",
                                                                height: "15",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                className: "text-gray-400",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2136,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2137,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2135,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[#2475FC] hover:underline cursor-pointer",
                                                                children: [
                                                                    "annotated.ai/@",
                                                                    currentUser?.handle || 'user'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2139,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2134,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "15",
                                                                height: "15",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                className: "text-gray-400",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                        x: "3",
                                                                        y: "4",
                                                                        width: "18",
                                                                        height: "18",
                                                                        rx: "2",
                                                                        ry: "2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2146,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                        x1: "16",
                                                                        y1: "2",
                                                                        x2: "16",
                                                                        y2: "6"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2147,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                        x1: "8",
                                                                        y1: "2",
                                                                        x2: "8",
                                                                        y2: "6"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2148,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                        x1: "3",
                                                                        y1: "10",
                                                                        x2: "21",
                                                                        y2: "10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2149,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2145,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Joined ",
                                                                    formatJoinDate(currentUser?.created_at)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2151,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2144,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2125,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-6 mt-4 pt-1 text-[14px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>openFollowersModal('following'),
                                                        className: "hover:underline cursor-pointer group flex items-center gap-1.5 focus:outline-none",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-gray-900 group-hover:text-blue-600 transition-colors",
                                                                children: currentUser?.followingCount !== undefined ? currentUser.followingCount : followingList.length
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2162,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500 font-normal",
                                                                children: "Following"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2165,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2157,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>openFollowersModal('followers'),
                                                        className: "hover:underline cursor-pointer group flex items-center gap-1.5 focus:outline-none",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-gray-900 group-hover:text-blue-600 transition-colors",
                                                                children: currentUser?.followersCount !== undefined ? currentUser.followersCount : followersList.length
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2173,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500 font-normal",
                                                                children: "Followers"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2176,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2168,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setActiveProfileTab('annotations'),
                                                        className: "hover:underline cursor-pointer group flex items-center gap-1.5 focus:outline-none",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-gray-900 group-hover:text-blue-600 transition-colors",
                                                                children: userAnnotations.length || currentUser?.annotationsCount || 0
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2184,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500 font-normal",
                                                                children: "Annotations"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2187,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2179,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2156,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2042,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center px-6 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setActiveProfileTab('annotations'),
                                                className: `px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 ${activeProfileTab === 'annotations' ? 'border-[#2475FC] text-[#2475FC]' : 'border-transparent text-gray-500 hover:text-gray-900'}`,
                                                children: [
                                                    "Annotations (",
                                                    userAnnotations.length || currentUser?.annotationsCount || 0,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2194,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setActiveProfileTab('edit'),
                                                className: `px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${activeProfileTab === 'edit' ? 'border-[#2475FC] text-[#2475FC]' : 'border-transparent text-gray-500 hover:text-gray-900'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "14",
                                                        height: "14",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M12 20h9"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2216,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2216,
                                                                columnNumber: 42
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2215,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Edit Profile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2218,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2206,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2193,
                                        columnNumber: 15
                                    }, this),
                                    activeProfileTab === 'annotations' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6 sm:p-8 space-y-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-[15px] font-semibold text-gray-900",
                                                                children: "Your Research Highlights & Notes"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2227,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[12px] text-gray-500 mt-0.5",
                                                                children: "Saved web annotations and research publications"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2228,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2226,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[12px] font-semibold text-[#2475FC] bg-blue-50 px-3 py-1 rounded-full",
                                                        children: [
                                                            userAnnotations.length || currentUser?.annotationsCount || 0,
                                                            " Highlights"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2230,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2225,
                                                columnNumber: 19
                                            }, this),
                                            userAnnotations.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "py-12 px-4 text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-400",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "22",
                                                            height: "22",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "2",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2240,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2239,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2238,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-[15px] font-semibold text-gray-800",
                                                        children: "No annotations or publications yet"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2243,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[13px] text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed",
                                                        children: [
                                                            "Use the ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Annotated Chrome Extension"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2247,
                                                                columnNumber: 33
                                                            }, this),
                                                            " to highlight articles and save research notes across the web."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2246,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2237,
                                                columnNumber: 21
                                            }, this),
                                            userAnnotations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3.5",
                                                children: userAnnotations.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all bg-white shadow-2xs space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start justify-between gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "min-w-0 flex items-center gap-2",
                                                                        children: [
                                                                            item.page_favicon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                src: item.page_favicon,
                                                                                alt: "",
                                                                                className: "w-4 h-4 rounded-xs shrink-0",
                                                                                onError: (e)=>{
                                                                                    e.currentTarget.style.display = 'none';
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2260,
                                                                                columnNumber: 33
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-2 h-2 rounded-full bg-blue-500 shrink-0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2262,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                href: item.page_url,
                                                                                target: "_blank",
                                                                                rel: "noreferrer",
                                                                                className: "text-[13px] font-semibold text-gray-900 hover:text-blue-600 truncate transition-colors flex items-center gap-1.5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: item.page_title || item.page_domain || 'Web Page'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2270,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                        width: "12",
                                                                                        height: "12",
                                                                                        viewBox: "0 0 24 24",
                                                                                        fill: "none",
                                                                                        stroke: "currentColor",
                                                                                        strokeWidth: "2",
                                                                                        strokeLinecap: "round",
                                                                                        strokeLinejoin: "round",
                                                                                        className: "text-gray-400",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 2272,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                                                points: "15 3 21 3 21 9"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 2273,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                                x1: "10",
                                                                                                y1: "14",
                                                                                                x2: "21",
                                                                                                y2: "3"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 2274,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2271,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2264,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2258,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[11px] text-gray-400 shrink-0",
                                                                        children: formatJoinDate(item.created_at)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2278,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2257,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-3.5 rounded-xl border-l-4 bg-gray-50/70 text-[13px] text-gray-800 leading-relaxed font-normal",
                                                                style: {
                                                                    borderLeftColor: item.color || '#3297EE'
                                                                },
                                                                children: [
                                                                    "“",
                                                                    item.highlighted_text,
                                                                    "”"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2283,
                                                                columnNumber: 27
                                                            }, this),
                                                            item.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-2 text-[12px] text-gray-600 bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-blue-700 shrink-0",
                                                                        children: "Note:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2292,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "leading-relaxed",
                                                                        children: item.note
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2293,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2291,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2256,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2254,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2224,
                                        columnNumber: 17
                                    }, this),
                                    activeProfileTab === 'edit' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSaveProfile,
                                        className: "divide-y divide-gray-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:w-[280px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-[14px] font-semibold text-gray-900",
                                                                children: "Public profile"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2309,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[12px] text-gray-500 mt-1 leading-relaxed",
                                                                children: "Update your researcher profile name, username, bio, and avatar."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2310,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2308,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 max-w-lg space-y-3.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[12px] font-medium text-gray-700 block mb-1",
                                                                        children: "Display Name"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2317,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: profileName,
                                                                        onChange: (e)=>setProfileName(e.target.value),
                                                                        placeholder: "Your Name",
                                                                        className: "w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2318,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2316,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[12px] font-medium text-gray-700 block mb-1",
                                                                        children: "Handle / Username"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2329,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#2475FC] transition-all",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "px-3.5 py-2 text-[13px] text-gray-400 bg-gray-50/80 border-r border-gray-200 select-none",
                                                                                children: "annotated.ai/"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2331,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: profileHandle,
                                                                                onChange: (e)=>setProfileHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')),
                                                                                placeholder: "handle",
                                                                                className: "flex-1 h-10 px-3.5 text-[13px] font-medium text-gray-900 focus:outline-none bg-transparent"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2334,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2330,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2328,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[12px] font-medium text-gray-700 block mb-1",
                                                                        children: "Research Focus / Headline"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2346,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: profileHeadline,
                                                                        onChange: (e)=>setProfileHeadline(e.target.value),
                                                                        placeholder: "AI & Systems Researcher",
                                                                        className: "w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2347,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2345,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[12px] font-medium text-gray-700 block mb-1",
                                                                        children: "Bio"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2358,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                        rows: 2,
                                                                        value: profileBio,
                                                                        onChange: (e)=>setProfileBio(e.target.value),
                                                                        placeholder: "AI & Systems Researcher. Knowledge curator on Annotated AI.",
                                                                        className: "w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white resize-none"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2359,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2357,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[12px] font-medium text-gray-700 block mb-1.5",
                                                                        children: "Profile Photo"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2370,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-4 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                src: profileAvatar || currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`,
                                                                                alt: "Avatar Preview",
                                                                                className: "w-14 h-14 rounded-full object-cover border border-gray-200 bg-white shrink-0 shadow-xs",
                                                                                onError: (e)=>{
                                                                                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2372,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "space-y-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        onClick: ()=>avatarFileInputRef.current?.click(),
                                                                                        className: "px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-[12px] font-medium rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:border-gray-400 active:scale-95",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                width: "13",
                                                                                                height: "13",
                                                                                                viewBox: "0 0 24 24",
                                                                                                fill: "none",
                                                                                                stroke: "currentColor",
                                                                                                strokeWidth: "2",
                                                                                                strokeLinecap: "round",
                                                                                                strokeLinejoin: "round",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 2387,
                                                                                                        columnNumber: 33
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                                                        points: "17 8 12 3 7 8"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 2388,
                                                                                                        columnNumber: 33
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                                        x1: "12",
                                                                                                        y1: "3",
                                                                                                        x2: "12",
                                                                                                        y2: "15"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 2389,
                                                                                                        columnNumber: 33
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 2386,
                                                                                                columnNumber: 31
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                children: "Upload new photo"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 2391,
                                                                                                columnNumber: 31
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2381,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[11px] text-gray-400",
                                                                                        children: "Select an image from your device (PNG, JPG, WebP)"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2393,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2380,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2371,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2369,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[12px] font-medium text-gray-700 block mb-1.5",
                                                                        children: "Cover Banner"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2400,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "w-full h-28 rounded-xl overflow-hidden bg-gray-200 border border-gray-200 relative",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                    src: profileBanner || currentUser?.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
                                                                                    alt: "Cover Preview",
                                                                                    className: "w-full h-full object-cover",
                                                                                    onError: (e)=>{
                                                                                        e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                                    lineNumber: 2403,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2402,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center justify-between",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        onClick: ()=>bannerFileInputRef.current?.click(),
                                                                                        className: "px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-[12px] font-medium rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:border-gray-400 active:scale-95",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                width: "13",
                                                                                                height: "13",
                                                                                                viewBox: "0 0 24 24",
                                                                                                fill: "none",
                                                                                                stroke: "currentColor",
                                                                                                strokeWidth: "2",
                                                                                                strokeLinecap: "round",
                                                                                                strokeLinejoin: "round",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 2419,
                                                                                                        columnNumber: 33
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                                                        points: "17 8 12 3 7 8"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 2420,
                                                                                                        columnNumber: 33
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                                        x1: "12",
                                                                                                        y1: "3",
                                                                                                        x2: "12",
                                                                                                        y2: "15"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 2421,
                                                                                                        columnNumber: 33
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 2418,
                                                                                                columnNumber: 31
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                children: "Upload cover banner"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 2423,
                                                                                                columnNumber: 31
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2413,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[11px] text-gray-400",
                                                                                        children: "Select a banner from your device"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2425,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2412,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2401,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2399,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between pt-2",
                                                                children: [
                                                                    profileSaveSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[12px] font-medium text-emerald-600 flex items-center gap-1",
                                                                        children: "✓ Saved successfully"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2433,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    profileError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[12px] font-medium text-red-500",
                                                                        children: profileError
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2438,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "submit",
                                                                        disabled: isSavingProfile,
                                                                        className: "ml-auto px-5 py-2.5 bg-[#2475FC] hover:bg-blue-600 text-white rounded-xl text-[13px] font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2",
                                                                        children: isSavingProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                                    lineNumber: 2449,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Saving..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                                    lineNumber: 2450,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2448,
                                                                            columnNumber: 29
                                                                        }, this) : 'Save changes'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2442,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2431,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2314,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2307,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:w-[280px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-[14px] font-semibold text-gray-900",
                                                                children: "Log out of all devices"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2464,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[12px] text-gray-400 mt-1 leading-relaxed",
                                                                children: "Log out of all other active sessions on other devices besides this one."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2465,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2463,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: handleLogout,
                                                            className: "px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-[13px] font-medium text-gray-700 shadow-2xs transition-all cursor-pointer",
                                                            children: "Log out"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2470,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2469,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2462,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2305,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 2012,
                                columnNumber: 13
                            }, this),
                            showFollowersModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center bg-gray-100 p-1 rounded-xl",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setFollowersSubTab('followers'),
                                                                className: `px-3 py-1 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${followersSubTab === 'followers' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'}`,
                                                                children: [
                                                                    "Followers (",
                                                                    followersList.length,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2491,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setFollowersSubTab('following'),
                                                                className: `px-3 py-1 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${followersSubTab === 'following' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'}`,
                                                                children: [
                                                                    "Following (",
                                                                    followingList.length,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2500,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2490,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2489,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setShowFollowersModal(null),
                                                    className: "w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer",
                                                    children: "✕"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2512,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 2488,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-5 py-2.5 border-b border-gray-100 bg-gray-50/50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: followersSearchQuery,
                                                        onChange: (e)=>setFollowersSearchQuery(e.target.value),
                                                        placeholder: "Search researchers by name or @handle...",
                                                        className: "w-full h-9 pl-9 pr-3 bg-white border border-gray-200 rounded-xl text-[12px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2524,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "14",
                                                        height: "14",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        className: "absolute left-3 top-2.5 text-gray-400",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: "11",
                                                                cy: "11",
                                                                r: "8"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2532,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                x1: "21",
                                                                y1: "21",
                                                                x2: "16.65",
                                                                y2: "16.65"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2533,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2531,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2523,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 2522,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto p-5 divide-y divide-gray-100 space-y-2",
                                            children: [
                                                (followersSubTab === 'followers' ? followersList : followingList).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center py-10 px-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "20",
                                                                height: "20",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2544,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                        cx: "9",
                                                                        cy: "7",
                                                                        r: "4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2545,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M22 21v-2a4 4 0 0 0-3-3.87"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2546,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M16 3.13a4 4 0 0 1 0 7.75"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2547,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2543,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2542,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[13px] font-semibold text-gray-700",
                                                            children: followersSubTab === 'followers' ? 'No followers yet' : 'Not following anyone yet'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2550,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2541,
                                                    columnNumber: 23
                                                }, this),
                                                (followersSubTab === 'followers' ? followersList : followingList).filter((u)=>!followersSearchQuery || u.name && u.name.toLowerCase().includes(followersSearchQuery.toLowerCase()) || u.handle && u.handle.toLowerCase().includes(followersSearchQuery.toLowerCase())).map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "pt-3 pb-1 flex items-center justify-between gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
                                                                        alt: user.name,
                                                                        className: "w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2560,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1.5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[13px] font-semibold text-gray-900 truncate",
                                                                                        children: user.name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2567,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                        className: "w-3.5 h-3.5 text-[#2475FC] shrink-0",
                                                                                        viewBox: "0 0 24 24",
                                                                                        fill: "currentColor",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                            d: "M10.007 2.056c.866-.341 1.848-.341 2.714 0l.707.279c.477.188.995.275 1.51.255l.758-.029c.928-.036 1.83.376 2.457 1.121l.512.609c.348.413.784.73 1.275.927l.714.288c.875.352 1.534 1.109 1.794 2.062l.212.781c.145.534.425 1.018.817 1.411l.575.577c.704.706.993 1.724.786 2.7-.17.804-.17 1.642 0 2.446.207.976-.082 1.994-.786 2.7l-.575.577c-.392.393-.672.877-.817 1.411l-.212.781c-.26.953-.919 1.71-1.794 2.062l-.714.288c-.491.197-.927.514-1.275.927l-.512.609c-.627.745-1.529 1.157-2.457 1.121l-.758-.029c-.515-.02-1.033.067-1.51.255l-.707.279c-.866.341-1.848.341-2.714 0l-.707-.279c-.477-.188-.995-.275-1.51-.255l-.758.029c-.928.036-1.83-.376-2.457-1.121l-.512-.609c-.348-.413-.784-.73-1.275-.927l-.714-.288c-.875-.352-1.534-1.109-1.794-2.062l-.212-.781c-.145-.534-.425-1.018-.817-1.411l-.575-.577c-.704-.706-.993-1.724-.786-2.7.17-.804.17-1.642 0-2.446-.207-.976.082-1.994.786-2.7l.575-.577c.392-.393.672-.877.817-1.411l.212-.781c.26-.953.919-1.71 1.794-2.062l.714-.288c.491-.197.927-.514 1.275-.927l.512-.609c.627-.745 1.529-1.157 2.457-1.121l.758.029c.515.02 1.033-.067 1.51-.255l.707-.279zm1.096 12.355 4.95-4.95a.75.75 0 0 0-1.06-1.06l-4.42 4.419-2.07-2.07a.75.75 0 0 0-1.06 1.06l2.6 2.6a.75.75 0 0 0 1.06 0z"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                                            lineNumber: 2571,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2570,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2566,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[11px] text-gray-400",
                                                                                children: [
                                                                                    "@",
                                                                                    user.handle
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2574,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            user.bio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[12px] text-gray-600 truncate max-w-xs mt-0.5",
                                                                                children: user.bio
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2576,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2565,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2559,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleToggleFollowUser(user),
                                                                className: `px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer shrink-0 active:scale-95 ${user.is_following ? 'border border-gray-300 bg-white text-gray-900 hover:border-red-200 hover:bg-red-50 hover:text-red-600' : 'bg-[#0F1419] hover:bg-black text-white'}`,
                                                                children: user.is_following ? 'Following' : 'Follow'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2581,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, user.id || user.handle, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2558,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 2539,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 2486,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 2485,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 2010,
                        columnNumber: 11
                    }, this),
                    activeTab === 'home' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-[1140px] mx-auto py-6 px-4 flex flex-col lg:flex-row items-start justify-center gap-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                className: "w-full lg:w-[250px] shrink-0 space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-[21px] p-5 relative overflow-hidden flex flex-col items-center shadow-xs border border-black/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full h-[82px] rounded-[15px] overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: currentUser.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
                                                    alt: "Workspace Banner",
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2610,
                                                    columnNumber: 15
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2609,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "-mt-[30px] z-10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`,
                                                    alt: currentUser?.name || "User",
                                                    className: "w-[60px] h-[60px] rounded-full border-4 border-white shadow-sm object-cover",
                                                    onError: (e)=>{
                                                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2619,
                                                    columnNumber: 15
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2618,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center mt-2.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-[13px] font-semibold text-[#202020] leading-tight",
                                                        children: currentUser.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2631,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[12px] text-[#929292] mt-0.5",
                                                        children: [
                                                            "@",
                                                            currentUser.handle
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2632,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2630,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full mt-4 py-2.5 px-3 bg-[#FAFAFA] rounded-[12px] flex items-center justify-between text-center border border-gray-100/60",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[14px] font-medium text-[#202020] leading-none",
                                                                children: currentUser.notesCount
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2638,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[11px] text-[#878787] mt-1",
                                                                children: "Notes"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2639,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2637,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-[1px] h-6 bg-gray-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2641,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[14px] font-medium text-[#202020] leading-none",
                                                                children: (currentUser.followersCount || 0).toLocaleString()
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2643,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[11px] text-[#878787] mt-1",
                                                                children: "Followers"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2644,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2642,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-[1px] h-6 bg-gray-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2646,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[14px] font-medium text-[#202020] leading-none",
                                                                children: currentUser.followingCount || 0
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2648,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[11px] text-[#878787] mt-1",
                                                                children: "Following"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2649,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2647,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2636,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>alert(`Active Workspace: ${currentUser.name} (@${currentUser.handle})`),
                                                className: "w-full mt-4 h-[36px] bg-[#3297EE] hover:bg-blue-600 text-white rounded-[12px] text-[11px] font-normal transition-all shadow-xs flex items-center justify-center cursor-pointer",
                                                children: "My Workspace"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2654,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2607,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-[21px] p-5 shadow-xs border border-black/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-[13px] font-medium text-[#202020]",
                                                        children: "Your Annotated"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2665,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "text-[11px] text-[#888] hover:text-black transition-colors cursor-pointer",
                                                        children: "See all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2666,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2664,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3.5",
                                                children: workspaces.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] text-gray-400 text-center py-3",
                                                    children: "No workspaces yet"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2673,
                                                    columnNumber: 17
                                                }, this) : workspaces.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between group cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: item.icon_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
                                                                        alt: item.name,
                                                                        className: "w-[37px] h-[37px] rounded-full object-cover group-hover:scale-105 transition-transform"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2678,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-left",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[12px] font-medium text-[#202020] group-hover:text-[#3297EE] transition-colors block",
                                                                                children: item.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2684,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            item.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-gray-400 font-normal",
                                                                                children: item.category
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2688,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2683,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2677,
                                                                columnNumber: 21
                                                            }, this),
                                                            item.annotations_count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium",
                                                                children: item.annotations_count
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2695,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, item.id || idx, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2676,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2671,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2663,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 2605,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "w-full lg:w-[527px] flex-1 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-[21px] p-4 shadow-xs border border-black/5 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`,
                                                        alt: currentUser?.name || "Avatar",
                                                        className: "w-[37px] h-[37px] rounded-full object-cover flex-shrink-0",
                                                        onError: (e)=>{
                                                            e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2712,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 h-[37px] px-4 rounded-[24px] bg-[#F1F1F1] flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: postText,
                                                                onChange: (e)=>setPostText(e.target.value),
                                                                onKeyDown: (e)=>e.key === 'Enter' && handleCreatePost(),
                                                                placeholder: "Share an annotation, idea, or AI summary (Press Enter)...",
                                                                className: "w-full bg-transparent text-[12px] font-normal text-[#202020] placeholder-[#929292] focus:outline-none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2721,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: handleCreatePost,
                                                                disabled: !postText.trim() || isPosting,
                                                                title: "Share to feed",
                                                                className: "p-1 text-[#3297EE] hover:text-blue-700 transition-colors cursor-pointer disabled:opacity-30",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    width: "17",
                                                                    height: "17",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                            x1: "22",
                                                                            y1: "2",
                                                                            x2: "11",
                                                                            y2: "13"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2736,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                                            points: "22 2 15 22 11 13 2 9 22 2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2737,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2735,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2729,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2720,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2711,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between pt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-5 sm:gap-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "flex items-center gap-2 text-[12px] font-normal text-[#202020] hover:text-[#3297EE] transition-colors cursor-pointer",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "19",
                                                                        height: "19",
                                                                        viewBox: "0 0 19 19",
                                                                        fill: "none",
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M3.5625 16.625C3.24583 16.625 2.96875 16.5062 2.73125 16.2687C2.49375 16.0312 2.375 15.7542 2.375 15.4375V3.5625C2.375 3.24583 2.49375 2.96875 2.73125 2.73125C2.96875 2.49375 3.24583 2.375 3.5625 2.375H15.4375C15.7542 2.375 16.0312 2.49375 16.2687 2.73125C16.5062 2.96875 16.625 3.24583 16.625 3.5625V15.4375C16.625 15.7542 16.5062 16.0312 16.2687 16.2687C16.0312 16.5062 15.7542 16.625 15.4375 16.625H3.5625ZM3.5625 15.4375H15.4375V3.5625H3.5625V15.4375ZM4.67083 13.5177H14.349L11.4396 9.63854L8.82708 13.0229L6.98646 10.5094L4.67083 13.5177Z",
                                                                            fill: "#242424"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2748,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2747,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Screenshot"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2750,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2746,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "flex items-center gap-2 text-[12px] font-normal text-[#202020] hover:text-[#3297EE] transition-colors cursor-pointer",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "19",
                                                                        height: "19",
                                                                        viewBox: "0 0 19 19",
                                                                        fill: "none",
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M2.77051 15.8346C2.45384 15.8346 2.17676 15.7159 1.93926 15.4784C1.70176 15.2409 1.58301 14.9638 1.58301 14.6471V4.35547C1.58301 4.0388 1.70176 3.76172 1.93926 3.52422C2.17676 3.28672 2.45384 3.16797 2.77051 3.16797H13.0622C13.3788 3.16797 13.6559 3.28672 13.8934 3.52422C14.1309 3.76172 14.2497 4.0388 14.2497 4.35547V8.61068L17.4163 5.44401V13.5586L14.2497 10.3919V14.6471C14.2497 14.9638 14.1309 15.2409 13.8934 15.4784C13.6559 15.7159 13.3788 15.8346 13.0622 15.8346H2.77051ZM2.77051 14.6471H13.0622V4.35547H2.77051V14.6471Z",
                                                                            fill: "#242424"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2755,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2754,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Video URL"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2757,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2753,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "flex items-center gap-2 text-[12px] font-normal text-[#202020] hover:text-[#3297EE] transition-colors cursor-pointer",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "19",
                                                                        height: "19",
                                                                        viewBox: "0 0 19 19",
                                                                        fill: "none",
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M8.45104 16.625V12.1719H9.63854V13.8146H16.625V15.0021H9.63854V16.625H8.45104ZM2.375 15.0021V13.8146H7.26354V15.0021H2.375ZM6.07604 11.7167V10.0937H2.375V8.90625H6.07604V7.24375H7.26354V11.7167H6.07604ZM8.45104 10.0937V8.90625H16.625V10.0937H8.45104ZM11.7365 6.82812V2.375H12.924V3.99792H16.625V5.18542H12.924V6.82812H11.7365ZM2.375 5.18542V3.99792H10.549V5.18542H2.375Z",
                                                                            fill: "#242424"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2762,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2761,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Canvas Note"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2764,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2760,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2745,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "flex items-center gap-2 text-[12px] font-normal text-[#202020] hover:text-black transition-colors cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "19",
                                                                height: "19",
                                                                viewBox: "0 0 19 19",
                                                                fill: "none",
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M6.41217 16.7919C5.44898 16.3763 4.61113 15.8122 3.89863 15.0997C3.18613 14.3872 2.62207 13.5494 2.20645 12.5862C1.79082 11.623 1.58301 10.5938 1.58301 9.4987C1.58301 8.40356 1.79082 7.37439 2.20645 6.4112C2.62207 5.448 3.18613 4.61016 3.89863 3.89766C4.61113 3.18516 5.44898 2.62109 6.41217 2.20547C7.37537 1.78984 8.40454 1.58203 9.49967 1.58203C10.5948 1.58203 11.624 1.78984 12.5872 2.20547C13.5504 2.62109 14.3882 3.18516 15.1007 3.89766C15.8132 4.61016 16.3773 5.448 16.7929 6.4112C17.2085 7.37439 17.4163 8.40356 17.4163 9.4987C17.4163 10.5938 17.2085 11.623 16.7929 12.5862C16.3773 13.5494 15.8132 14.3872 15.1007 15.0997C14.3882 15.8122 13.5504 16.3763 12.5872 16.7919C11.624 17.2076 10.5948 17.4154 9.49967 17.4154C8.40454 17.4154 7.37537 17.2076 6.41217 16.7919ZM8.64863 16.2081V14.5852C8.18683 14.5852 7.79759 14.4136 7.48092 14.0706C7.16426 13.7275 7.00592 13.3251 7.00592 12.8633V11.9924L2.94863 7.93516C2.88266 8.19905 2.83648 8.45964 2.81009 8.71693C2.7837 8.97422 2.77051 9.23481 2.77051 9.4987C2.77051 11.214 3.32797 12.7115 4.4429 13.9914C5.55783 15.2713 6.95974 16.0102 8.64863 16.2081ZM14.4674 14.0706C15.0479 13.4372 15.4867 12.728 15.7835 11.943C16.0804 11.1579 16.2288 10.3431 16.2288 9.4987C16.2288 8.10009 15.8462 6.83012 15.0809 5.6888C14.3156 4.54748 13.2931 3.71293 12.0132 3.18516V3.54141C12.0132 4.00321 11.8549 4.40564 11.5382 4.7487C11.2215 5.09175 10.8323 5.26328 10.3705 5.26328H8.64863V6.98516C8.64863 7.20946 8.55957 7.39418 8.38145 7.53932C8.20332 7.68446 8.0021 7.75703 7.7778 7.75703H6.13509V9.4987H11.2413C11.4656 9.4987 11.6504 9.58446 11.7955 9.75599C11.9406 9.92752 12.0132 10.1254 12.0132 10.3497V12.8633H12.8643C13.2469 12.8633 13.5834 12.9754 13.8736 13.1997C14.1639 13.424 14.3618 13.7143 14.4674 14.0706Z",
                                                                    fill: "#242424"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2771,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2770,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Workspace"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2773,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[#777] text-[11px]",
                                                                children: "⌄"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2774,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2769,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2744,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2709,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 py-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-[1px] flex-1 bg-[#D1D1D1]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2781,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[11px] font-normal text-[#929292]",
                                                children: [
                                                    "Sort by : ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#222222] font-medium",
                                                        children: "Recent"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2783,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ⌄"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2782,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2780,
                                        columnNumber: 11
                                    }, this),
                                    posts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-[21px] p-8 text-center shadow-xs border border-black/5 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-full bg-blue-50 text-[#3297EE] flex items-center justify-center mx-auto mb-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "20",
                                                    height: "20",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2792,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2791,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2790,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-semibold text-gray-900",
                                                children: "No posts yet"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2795,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: "Be the first to share an annotation, idea, or AI summary using the input above!"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 2796,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 2789,
                                        columnNumber: 13
                                    }, this) : posts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "bg-white rounded-[21px] p-5 shadow-xs border border-black/5 space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
                                                                    alt: post.author_name,
                                                                    className: "w-[37px] h-[37px] rounded-full object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2804,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                            className: "text-[14px] font-semibold text-[#202020] leading-none",
                                                                            children: post.author_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2810,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] text-[#929292] mt-1 block",
                                                                            children: post.time || 'Recently'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2811,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2809,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2803,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "p-1 text-gray-400 hover:text-black transition-colors cursor-pointer",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "19",
                                                                height: "19",
                                                                viewBox: "0 0 19 19",
                                                                fill: "none",
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M9.49703 15.8346C9.23499 15.8346 9.01161 15.7414 8.82689 15.5548C8.64217 15.3682 8.5498 15.1439 8.5498 14.8819C8.5498 14.6198 8.64309 14.3964 8.82966 14.2117C9.01623 14.027 9.24053 13.9346 9.50258 13.9346C9.76462 13.9346 9.988 14.0279 10.1727 14.2145C10.3574 14.4011 10.4498 14.6254 10.4498 14.8874C10.4498 15.1494 10.3565 15.3728 10.17 15.5576C9.98338 15.7423 9.75908 15.8346 9.49703 15.8346ZM9.49703 10.4513C9.23499 10.4513 9.01161 10.358 8.82689 10.1714C8.64217 9.98488 8.5498 9.76057 8.5498 9.49853C8.5498 9.23649 8.64309 9.01311 8.82966 8.82839C9.01623 8.64366 9.24053 8.5513 9.50258 8.5513C9.76462 8.5513 9.988 8.64459 10.1727 8.83116C10.3574 9.01773 10.4498 9.24203 10.4498 9.50407C10.4498 9.76611 10.3565 9.9895 10.17 10.1742C9.98338 10.3589 9.75908 10.4513 9.49703 10.4513ZM9.49703 5.06797C9.23499 5.06797 9.01161 4.97468 8.82689 4.78811C8.64217 4.60154 8.5498 4.37724 8.5498 4.1152C8.5498 3.85316 8.64309 3.62977 8.82966 3.44505C9.01623 3.26033 9.24053 3.16797 9.50258 3.16797C9.76462 3.16797 9.988 3.26125 10.1727 3.44782C10.3574 3.63439 10.4498 3.8587 10.4498 4.12074C10.4498 4.38278 10.3565 4.60616 10.17 4.79089C9.98338 4.97561 9.75908 5.06797 9.49703 5.06797Z",
                                                                    fill: "#242424"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2818,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2817,
                                                                columnNumber: 19
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2816,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2802,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] font-medium text-[#202020] leading-relaxed",
                                                    children: [
                                                        post.content,
                                                        ' ',
                                                        post.hashtags && post.hashtags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[#509FC6]",
                                                            children: post.hashtags.join(' ')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2827,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2824,
                                                    columnNumber: 15
                                                }, this),
                                                post.media_url && (()=>{
                                                    const ytClip = parseYouTubeClip(post.media_url);
                                                    const audioClip = parseAudioClip(post.media_url, post);
                                                    const isImage = isDirectImageUrl(post.media_url);
                                                    if (ytClip) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YouTubeClipPlayer, {
                                                            postId: post.id,
                                                            clip: ytClip,
                                                            mediaUrl: post.media_url
                                                        }, post.id, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2841,
                                                            columnNumber: 21
                                                        }, this);
                                                    }
                                                    if (audioClip) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AudioClipPlayer, {
                                                            postId: post.id,
                                                            clip: audioClip,
                                                            mediaUrl: post.media_url,
                                                            post: post
                                                        }, post.id, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2852,
                                                            columnNumber: 21
                                                        }, this);
                                                    }
                                                    if (isImage) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: post.media_url,
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                            className: "block w-full rounded-[14px] overflow-hidden bg-gray-100 border border-gray-200/90 relative group cursor-pointer",
                                                            title: "Click to view original media",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: post.media_url,
                                                                    alt: "Original Visual",
                                                                    className: "w-full h-auto object-cover max-h-[380px] group-hover:opacity-95 transition-opacity",
                                                                    onError: (e)=>{
                                                                        e.currentTarget.style.display = 'none';
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2871,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[11px] text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "Open original"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2880,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " ↗"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2879,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2864,
                                                            columnNumber: 21
                                                        }, this);
                                                    }
                                                    // Web Article / Source Link
                                                    let domain = 'Original Source';
                                                    try {
                                                        domain = new URL(post.media_url).hostname.replace(/^www\./, '');
                                                    } catch (_) {}
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: post.media_url,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "block w-full p-3.5 rounded-[14px] bg-[#F8FAFC] hover:bg-blue-50/40 border border-gray-200/90 hover:border-[#3297EE] transition-all group cursor-pointer",
                                                        title: `Click to open ${post.media_url}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between gap-3 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 truncate text-[13px] font-semibold text-gray-800 group-hover:text-[#3297EE] transition-colors",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                width: "15",
                                                                                height: "15",
                                                                                viewBox: "0 0 24 24",
                                                                                fill: "none",
                                                                                stroke: "currentColor",
                                                                                strokeWidth: "2",
                                                                                strokeLinecap: "round",
                                                                                strokeLinejoin: "round",
                                                                                className: "text-[#3297EE] shrink-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                        cx: "12",
                                                                                        cy: "12",
                                                                                        r: "10"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2903,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                        x1: "2",
                                                                                        y1: "12",
                                                                                        x2: "22",
                                                                                        y2: "12"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2904,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                        d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                        lineNumber: 2905,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2902,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "truncate",
                                                                                children: domain
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2907,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2901,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[11px] font-medium text-[#3297EE] flex items-center gap-1 shrink-0 group-hover:underline",
                                                                        children: "Open original ↗"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2909,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2900,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[11px] text-gray-500 truncate font-mono",
                                                                children: post.media_url
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2913,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 2893,
                                                        columnNumber: 19
                                                    }, this);
                                                })(),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between pt-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleLike(post.id),
                                                                    className: "flex items-center gap-1.5 text-[12px] text-[#595959] hover:text-[#F45B69] transition-colors cursor-pointer",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            width: "19",
                                                                            height: "19",
                                                                            viewBox: "0 0 19 19",
                                                                            fill: "none",
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M9.49967 16.6049L8.68822 15.8727C7.28961 14.5928 6.13509 13.4878 5.22467 12.5576C4.31426 11.6273 3.58856 10.7961 3.04759 10.0638C2.50662 9.33151 2.12728 8.66849 1.90957 8.07474C1.69186 7.48099 1.58301 6.88064 1.58301 6.2737C1.58301 5.0862 1.98214 4.09332 2.7804 3.29505C3.57867 2.49679 4.56495 2.09766 5.73926 2.09766C6.49134 2.09766 7.18735 2.27578 7.82728 2.63203C8.46721 2.98828 9.02467 3.50286 9.49967 4.17578C10.0538 3.46328 10.641 2.9388 11.2611 2.60234C11.8813 2.26589 12.5476 2.09766 13.2601 2.09766C14.4344 2.09766 15.4207 2.49679 16.2189 3.29505C17.0172 4.09332 17.4163 5.0862 17.4163 6.2737C17.4163 6.88064 17.3075 7.48099 17.0898 8.07474C16.8721 8.66849 16.4927 9.33151 15.9518 10.0638C15.4108 10.7961 14.6851 11.6273 13.7747 12.5576C12.8643 13.4878 11.7097 14.5928 10.3111 15.8727L9.49967 16.6049Z",
                                                                                fill: post.is_liked ? "#F45B69" : "#939393"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2929,
                                                                                columnNumber: 23
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2928,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: post.likes_count
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2934,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2924,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1.5 text-[12px] text-[#595959]",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            width: "19",
                                                                            height: "19",
                                                                            viewBox: "0 0 19 19",
                                                                            fill: "none",
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M4.74967 11.1018H10.9445V9.91432H4.74967V11.1018ZM4.74967 8.52891H14.2497V7.34141H4.74967V8.52891ZM4.74967 5.95599H14.2497V4.76849H4.74967V5.95599ZM1.58301 17.4154V2.76953C1.58301 2.45286 1.70176 2.17578 1.93926 1.93828C2.17676 1.70078 2.45384 1.58203 2.77051 1.58203H16.2288C16.5455 1.58203 16.8226 1.70078 17.0601 1.93828C17.2976 2.17578 17.4163 2.45286 17.4163 2.76953V13.0612C17.4163 13.3779 17.2976 13.6549 17.0601 13.8924C16.8226 14.1299 16.5455 14.2487 16.2288 14.2487H4.74967L1.58301 17.4154ZM4.23509 13.0612H16.2288V2.76953H2.77051V14.6445L4.23509 13.0612Z",
                                                                                fill: "#242424"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2940,
                                                                                columnNumber: 23
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2939,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: post.comments ? post.comments.length : 0
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2942,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2938,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setBookmarked(!bookmarked),
                                                                    className: "flex items-center gap-1.5 text-[12px] text-[#595959] hover:text-[#3297EE] transition-colors cursor-pointer",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            width: "19",
                                                                            height: "19",
                                                                            viewBox: "0 0 19 19",
                                                                            fill: "none",
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M3.95801 16.6263V3.46484C3.95801 3.14818 4.07676 2.87109 4.31426 2.63359C4.55176 2.39609 4.82884 2.27734 5.14551 2.27734H13.8538C14.1705 2.27734 14.4476 2.39609 14.6851 2.63359C14.9226 2.87109 15.0413 3.14818 15.0413 3.46484V16.6263L9.49967 14.2513L3.95801 16.6263ZM5.14551 14.8253L9.49967 12.9846L13.8538 14.8253V3.46484H5.14551V14.8253Z",
                                                                                fill: bookmarked ? "#3297EE" : "#242424"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 2951,
                                                                                columnNumber: 23
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2950,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "Save"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2956,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2946,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2922,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>handleSharePost(post),
                                                            title: "Share Post",
                                                            className: `p-1.5 rounded-lg flex items-center gap-1.5 text-[12px] font-medium transition-all cursor-pointer ${copiedPostId === post.id ? 'bg-emerald-50 text-emerald-600 scale-105 shadow-2xs' : 'text-gray-600 hover:text-[#3297EE] hover:bg-gray-100'}`,
                                                            children: copiedPostId === post.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "15",
                                                                        height: "15",
                                                                        viewBox: "0 0 24 24",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        strokeWidth: "2.5",
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        className: "text-emerald-600",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                            points: "20 6 9 17 4 12"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 2974,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2973,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[11px] font-bold text-emerald-600",
                                                                        children: "Link Copied!"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 2976,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2972,
                                                                columnNumber: 21
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "19",
                                                                height: "19",
                                                                viewBox: "0 0 19 19",
                                                                fill: "none",
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M2.375 15.8346V3.16797L17.4167 9.5013L2.375 15.8346ZM3.5625 13.994L14.3292 9.5013L3.5625 4.94922V8.27422L8.35208 9.5013L3.5625 10.6888V13.994Z",
                                                                    fill: "currentColor"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 2980,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 2979,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 2961,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2921,
                                                    columnNumber: 15
                                                }, this),
                                                post.comments && post.comments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 pt-3 border-t border-gray-100",
                                                    children: post.comments.map((c, i)=>{
                                                        const commentId = typeof c === 'string' ? `cmt-${i}` : c.id;
                                                        const isOwner = currentUser && (c.user_id && c.user_id === currentUser.id || c.author_handle && c.author_handle === currentUser.handle || c.author_name && c.author_name === currentUser.name);
                                                        const isEditing = editingCommentId === commentId;
                                                        const authorName = typeof c === 'string' ? 'Researcher' : c.author_name || c.author_handle || 'Researcher';
                                                        const authorAvatar = typeof c === 'string' ? `https://api.dicebear.com/7.x/initials/svg?seed=Researcher` : c.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
                                                        const commentTime = c.created_at ? new Date(c.created_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : '';
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "group/cmt flex items-start gap-2.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] p-2.5 rounded-xl border border-gray-100 transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: authorAvatar,
                                                                    alt: authorName,
                                                                    className: "w-7 h-7 rounded-full object-cover shrink-0 mt-0.5",
                                                                    onError: (e)=>{
                                                                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3005,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-between gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-1.5 truncate",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[12px] font-semibold text-gray-900 truncate",
                                                                                            children: authorName
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                                            lineNumber: 3016,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        commentTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[10px] text-gray-400 font-normal",
                                                                                            children: commentTime
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                                            lineNumber: 3017,
                                                                                            columnNumber: 47
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                                    lineNumber: 3015,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                isOwner && !isEditing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-1 opacity-0 group-hover/cmt:opacity-100 transition-opacity",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>handleStartEditComment(c),
                                                                                            className: "p-1 text-gray-400 hover:text-[#3297EE] hover:bg-white rounded transition-colors cursor-pointer",
                                                                                            title: "Edit comment",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                width: "12",
                                                                                                height: "12",
                                                                                                viewBox: "0 0 24 24",
                                                                                                fill: "none",
                                                                                                stroke: "currentColor",
                                                                                                strokeWidth: "2",
                                                                                                strokeLinecap: "round",
                                                                                                strokeLinejoin: "round",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                        d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 3030,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                        d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 3031,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 3029,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                                            lineNumber: 3023,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>handleDeleteComment(commentId, post.id),
                                                                                            className: "p-1 text-gray-400 hover:text-red-500 hover:bg-white rounded transition-colors cursor-pointer",
                                                                                            title: "Delete comment",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                width: "12",
                                                                                                height: "12",
                                                                                                viewBox: "0 0 24 24",
                                                                                                fill: "none",
                                                                                                stroke: "currentColor",
                                                                                                strokeWidth: "2",
                                                                                                strokeLinecap: "round",
                                                                                                strokeLinejoin: "round",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                                                        points: "3 6 5 6 21 6"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 3041,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                                                        lineNumber: 3042,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                                lineNumber: 3040,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                                            lineNumber: 3034,
                                                                                            columnNumber: 33
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                                    lineNumber: 3022,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 3014,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1.5 space-y-1.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    value: editingCommentText,
                                                                                    onChange: (e)=>setEditingCommentText(e.target.value),
                                                                                    onKeyDown: (e)=>{
                                                                                        if (e.key === 'Enter') handleSaveEditComment(commentId, post.id);
                                                                                        if (e.key === 'Escape') handleCancelEditComment();
                                                                                    },
                                                                                    className: "w-full px-2.5 py-1 text-[12px] bg-white border border-[#3297EE] rounded-lg focus:outline-none shadow-xs",
                                                                                    autoFocus: true
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                                    lineNumber: 3052,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-1.5 justify-end",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: handleCancelEditComment,
                                                                                            className: "px-2 py-0.5 text-[11px] text-gray-500 hover:text-gray-700 cursor-pointer",
                                                                                            children: "Cancel"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                                            lineNumber: 3064,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>handleSaveEditComment(commentId, post.id),
                                                                                            className: "px-2.5 py-0.5 text-[11px] font-medium bg-[#3297EE] text-white rounded hover:bg-blue-600 transition-colors cursor-pointer shadow-2xs",
                                                                                            children: "Save"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                                            lineNumber: 3071,
                                                                                            columnNumber: 33
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                                    lineNumber: 3063,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 3051,
                                                                            columnNumber: 29
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[12px] text-gray-700 mt-0.5 leading-relaxed break-words",
                                                                            children: typeof c === 'string' ? c : c.content
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 3081,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3013,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, commentId || i, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3004,
                                                            columnNumber: 23
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 2988,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2.5 pt-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`,
                                                            alt: "Avatar",
                                                            className: "w-[34px] h-[34px] rounded-full object-cover shrink-0",
                                                            onError: (e)=>{
                                                                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3094,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-h-[36px] px-3.5 rounded-full bg-[#F3F4F6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3297EE]/40 focus-within:border-[#3297EE] border border-transparent transition-all flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: commentInputs[post.id] || '',
                                                                    onChange: (e)=>{
                                                                        const val = e.target.value;
                                                                        setCommentInputs((prev)=>({
                                                                                ...prev,
                                                                                [post.id]: val
                                                                            }));
                                                                    },
                                                                    onKeyDown: (e)=>{
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            handleAddComment(post.id);
                                                                        }
                                                                    },
                                                                    placeholder: "Write a comment... (Press Enter to post)",
                                                                    className: "w-full bg-transparent text-[12px] font-normal text-[#202020] placeholder-[#929292] focus:outline-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3103,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>handleAddComment(post.id),
                                                                    disabled: !(commentInputs[post.id] || '').trim(),
                                                                    className: "p-1 text-[#3297EE] disabled:text-gray-300 hover:scale-110 disabled:hover:scale-100 transition-all cursor-pointer disabled:cursor-not-allowed",
                                                                    title: "Post comment",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "15",
                                                                        height: "15",
                                                                        viewBox: "0 0 24 24",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        strokeWidth: "2.5",
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                x1: "22",
                                                                                y1: "2",
                                                                                x2: "11",
                                                                                y2: "13"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 3127,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                                                points: "22 2 15 22 11 13 2 9 22 2"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 3128,
                                                                                columnNumber: 23
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 3126,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3119,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3102,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3093,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, post.id, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 2800,
                                            columnNumber: 13
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 2707,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                className: "w-full lg:w-[250px] shrink-0 space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-[21px] p-5 shadow-xs border border-black/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-[13px] font-semibold text-[#202020]",
                                                        children: "Activity"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 3142,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "text-[11px] text-[#888] hover:text-black transition-colors cursor-pointer",
                                                        children: "See all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 3143,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 3141,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3.5",
                                                children: activities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] text-gray-400 text-center py-4",
                                                    children: "No recent activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3150,
                                                    columnNumber: 17
                                                }, this) : activities.map((act, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between gap-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: act.actor_avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User',
                                                                    alt: act.actor_name || 'User',
                                                                    className: "w-[37px] h-[37px] rounded-full object-cover flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3155,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-[11px] leading-tight",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold text-[#202020] text-[12px]",
                                                                            children: [
                                                                                act.actor_name,
                                                                                " "
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 3161,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[#202020]",
                                                                            children: act.text
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 3162,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3160,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3154,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, act.id || idx, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 3153,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 3148,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 3140,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-[21px] p-5 shadow-xs border border-black/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-[14px] font-medium text-[#202020]",
                                                        children: "Suggested For You"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 3174,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "text-[11px] text-[#888] hover:text-black transition-colors cursor-pointer",
                                                        children: "See all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 3175,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 3173,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3.5",
                                                children: suggestedUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] text-gray-400 text-center py-4",
                                                    children: "No suggested researchers yet"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3182,
                                                    columnNumber: 17
                                                }, this) : suggestedUsers.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`,
                                                                        alt: user.name || user.handle,
                                                                        className: "w-[37px] h-[37px] rounded-full object-cover flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 3187,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                className: "text-[12px] font-semibold text-[#202020] leading-none",
                                                                                children: user.name || user.handle
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 3193,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[9px] text-[#929292] mt-1 block",
                                                                                children: [
                                                                                    "@",
                                                                                    user.handle
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                                lineNumber: 3194,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.jsx",
                                                                        lineNumber: 3192,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 3186,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>toggleFollow(user.handle),
                                                                className: `text-[12px] font-semibold cursor-pointer ${followedState[user.handle] ? 'text-gray-400' : 'text-[#4F9BC8] hover:underline'}`,
                                                                children: followedState[user.handle] ? 'Followed' : 'Follow'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 3197,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, user.id, true, {
                                                        fileName: "[project]/src/app/home/page.jsx",
                                                        lineNumber: 3185,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 3180,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 3172,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 3138,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 2603,
                        columnNumber: 11
                    }, this),
                    activeTab === 'explore' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-bold text-gray-900 tracking-tight",
                                            children: "Explore Knowledge & Research"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3219,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[13px] text-gray-500 mt-1",
                                            children: "Discover trending topics, public workspaces, and annotations from top researchers"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3220,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3218,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[12px] font-semibold text-gray-400 uppercase tracking-wider",
                                            children: "Trending Research Tags"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3225,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: trendingTags.length > 0 ? trendingTags.map((tag, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-3 py-1.5 rounded-xl bg-blue-50/80 text-[#2475FC] text-[13px] font-medium border border-blue-100 hover:bg-blue-100/60 transition cursor-pointer",
                                                    children: [
                                                        tag.tag,
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[11px] text-blue-400",
                                                            children: [
                                                                "(",
                                                                tag.count,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3230,
                                                            columnNumber: 35
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3229,
                                                    columnNumber: 23
                                                }, this)) : [
                                                '#ArtificialIntelligence',
                                                '#MachineLearning',
                                                '#PostgreSQL',
                                                '#React19',
                                                '#NextJS',
                                                '#Supabase',
                                                '#ResearchPaper'
                                            ].map((t, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-3 py-1.5 rounded-xl bg-gray-50 text-gray-700 text-[13px] font-medium border border-gray-200 hover:bg-gray-100 transition cursor-pointer",
                                                    children: t
                                                }, idx, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3235,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3226,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3224,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 pt-4 border-t border-gray-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[12px] font-semibold text-gray-400 uppercase tracking-wider",
                                            children: "Featured Researchers"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3245,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                            children: suggestedUsers.map((u, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-3.5 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50/80 transition",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}`,
                                                                    alt: u.name,
                                                                    className: "w-10 h-10 rounded-full object-cover border border-gray-100"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3250,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-[13px] font-semibold text-gray-900",
                                                                            children: u.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 3256,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-[11px] text-gray-400",
                                                                            children: [
                                                                                "@",
                                                                                u.handle
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 3257,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3255,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3249,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>toggleFollow(u.handle),
                                                            className: `text-[12px] font-semibold px-3 py-1 rounded-lg border transition ${followedState[u.handle] ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-blue-50 text-[#2475FC] border-blue-200 hover:bg-blue-100'}`,
                                                            children: followedState[u.handle] ? 'Followed' : 'Follow'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3260,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3248,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3246,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3244,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 3217,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 3216,
                        columnNumber: 11
                    }, this),
                    activeTab === 'messages' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-[880px] mx-auto py-7 px-4 sm:px-6 animate-in fade-in duration-150",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-[24px] p-8 shadow-xs border border-gray-200/80 text-center space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-14 h-14 rounded-2xl bg-blue-50 text-[#2475FC] flex items-center justify-center mx-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "28",
                                        height: "28",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3284,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 3283,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3282,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-gray-900 tracking-tight",
                                    children: "Direct Messages & Discussions"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3287,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[13px] text-gray-500 max-w-md mx-auto",
                                    children: "Connect and exchange notes with fellow researchers on Annotated. No active message threads yet."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3288,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab('explore'),
                                    className: "px-5 py-2.5 bg-[#2475FC] text-white rounded-xl text-[13px] font-medium shadow-xs hover:bg-blue-600 transition cursor-pointer",
                                    children: "Find Researchers to Message"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3291,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 3281,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 3280,
                        columnNumber: 11
                    }, this),
                    activeTab === 'notifications' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-bold text-gray-900 tracking-tight",
                                                    children: "Activity & Notifications"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3307,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[13px] text-gray-500 mt-1",
                                                    children: "Real-time updates from your followers, annotations and workspaces"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3308,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3306,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[12px] font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100",
                                            children: [
                                                activities.length,
                                                " Recent"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3310,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3305,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "divide-y divide-gray-100 pt-2",
                                    children: activities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-center py-8 text-gray-400 text-sm",
                                        children: "No new notifications right now"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 3317,
                                        columnNumber: 19
                                    }, this) : activities.map((act, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "py-3.5 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: act.actor_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(act.actor_name || 'User')}`,
                                                            alt: "Actor",
                                                            className: "w-9 h-9 rounded-full object-cover border border-gray-100"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3322,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[13px] text-gray-900",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold",
                                                                            children: act.actor_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.jsx",
                                                                            lineNumber: 3329,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        act.text
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3328,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-gray-400",
                                                                    children: new Date(act.created_at).toLocaleDateString()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3331,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3327,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3321,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] text-[#2475FC] bg-blue-50 px-2.5 py-1 rounded-full font-medium capitalize",
                                                    children: act.type
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3334,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, idx, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3320,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3315,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 3304,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.jsx",
                        lineNumber: 3303,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 2006,
                columnNumber: 7
            }, this),
            showOnboarding && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto dir-ltr",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-[430px] w-full p-5 sm:p-6 relative animate-in fade-in zoom-in-95 duration-200 my-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: dismissOnboarding,
                            className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
                            title: "Close",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "18",
                                height: "18",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2.2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "18",
                                        y1: "6",
                                        x2: "6",
                                        y2: "18"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 3359,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "6",
                                        y1: "6",
                                        x2: "18",
                                        y2: "18"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 3360,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.jsx",
                                lineNumber: 3358,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 3352,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3297EE] to-[#0066FF] flex items-center justify-center mx-auto mb-2 shadow-sm shadow-blue-500/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "20",
                                        height: "20",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "white",
                                        strokeWidth: "2.2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 3368,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "12",
                                                cy: "7",
                                                r: "4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.jsx",
                                                lineNumber: 3369,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.jsx",
                                        lineNumber: 3367,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3366,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-gray-900 tracking-tight",
                                    children: "Complete your profile"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3372,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] text-gray-500 mt-0.5",
                                    children: "Set up your account details to customize your experience"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3373,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 3365,
                            columnNumber: 13
                        }, this),
                        onboardingError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center",
                            children: onboardingError
                        }, void 0, false, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 3377,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleOnboardingSubmit,
                            className: "space-y-3.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: onboardingAvatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User',
                                                    alt: "Profile Picture",
                                                    className: "w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-3 border-white shadow-sm ring-2 ring-blue-500/20",
                                                    onError: (e)=>{
                                                        e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=User';
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3387,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setShowAvatarInput(!showAvatarInput),
                                                    className: "absolute bottom-0 right-0 bg-[#0066FF] hover:bg-blue-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs transition-all flex items-center gap-1 border-2 border-white cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "10",
                                                            height: "10",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "2.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 20h9"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3401,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3402,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3400,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Change"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3395,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3386,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-gray-400",
                                            children: "Profile picture auto-filled from Google/X"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3407,
                                            columnNumber: 17
                                        }, this),
                                        showAvatarInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 space-y-2 mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-[10px] font-semibold text-gray-700",
                                                    children: "Enter Avatar Image URL:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3412,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "url",
                                                            value: customAvatarUrl,
                                                            onChange: (e)=>setCustomAvatarUrl(e.target.value),
                                                            placeholder: "https://images.unsplash.com/...",
                                                            className: "flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3414,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                if (customAvatarUrl.trim()) {
                                                                    setOnboardingAvatar(customAvatarUrl.trim());
                                                                    setShowAvatarInput(false);
                                                                }
                                                            },
                                                            className: "text-[11px] bg-gray-900 text-white px-2.5 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer",
                                                            children: "Apply"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3421,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3413,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[9px] font-semibold text-gray-400 block mb-1",
                                                            children: "Or choose a preset avatar:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3436,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                                                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                                                                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                                                                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
                                                            ].map((preset, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: preset,
                                                                    alt: "Preset avatar",
                                                                    onClick: ()=>{
                                                                        setOnboardingAvatar(preset);
                                                                        setShowAvatarInput(false);
                                                                    },
                                                                    className: "w-7 h-7 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition hover:scale-105"
                                                                }, idx, false, {
                                                                    fileName: "[project]/src/app/home/page.jsx",
                                                                    lineNumber: 3444,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3437,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3435,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3411,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3385,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-semibold text-gray-700 mb-0.5",
                                            children: "Display name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3463,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            required: true,
                                            value: onboardingName,
                                            onChange: (e)=>setOnboardingName(e.target.value),
                                            placeholder: "Your full name",
                                            className: "w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3466,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3462,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Username ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-500",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3479,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3479,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9px] font-normal text-gray-400",
                                                    children: "(At least 3 English characters)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3480,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3478,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute left-3 top-2 text-gray-400 font-semibold text-xs",
                                                    children: "@"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3483,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    required: true,
                                                    value: onboardingHandle,
                                                    onChange: (e)=>{
                                                        const clean = e.target.value.toLowerCase().replace(/@gmail\.com|gmailcom/gi, '').replace(/[^a-z0-9_]/g, '');
                                                        setOnboardingHandle(clean);
                                                    },
                                                    placeholder: "username",
                                                    className: "w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3484,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3482,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3477,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Bio"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3504,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9px] font-normal text-gray-400",
                                                    children: "Optional"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3505,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3503,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            rows: 2,
                                            value: onboardingBio,
                                            onChange: (e)=>setOnboardingBio(e.target.value),
                                            placeholder: "Tell people about yourself",
                                            className: "w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition resize-none"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3507,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3502,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Choose your interests"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3519,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9px] font-normal text-gray-400",
                                                    children: "Optional"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3520,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3518,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-gray-500 mb-1.5",
                                            children: "Select topics to personalize your feed:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3522,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-1.5",
                                            children: INTEREST_OPTIONS.map((interest)=>{
                                                const isSelected = onboardingInterests.includes(interest);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>toggleInterest(interest),
                                                    className: `text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${isSelected ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`,
                                                    children: [
                                                        isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "10",
                                                            height: "10",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                points: "20 6 9 17 4 12"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.jsx",
                                                                lineNumber: 3539,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/home/page.jsx",
                                                            lineNumber: 3538,
                                                            columnNumber: 27
                                                        }, this),
                                                        interest
                                                    ]
                                                }, interest, true, {
                                                    fileName: "[project]/src/app/home/page.jsx",
                                                    lineNumber: 3527,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.jsx",
                                            lineNumber: 3523,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3517,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: isSubmittingOnboarding,
                                    className: "w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition duration-200 cursor-pointer disabled:opacity-50 mt-1",
                                    children: isSubmittingOnboarding ? 'Saving Profile...' : 'Complete Profile'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.jsx",
                                    lineNumber: 3550,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.jsx",
                            lineNumber: 3382,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/home/page.jsx",
                    lineNumber: 3349,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/home/page.jsx",
                lineNumber: 3348,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/home/page.jsx",
        lineNumber: 1742,
        columnNumber: 5
    }, this);
}
_s2(HomePage, "KYf2gY/jMNX5HY57khV4B3xpBUI=");
_c2 = HomePage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "YouTubeClipPlayer");
__turbopack_context__.k.register(_c1, "AudioClipPlayer");
__turbopack_context__.k.register(_c2, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_home_page_jsx_1vubce_._.js.map