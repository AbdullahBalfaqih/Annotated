'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aaemqxlfzkkgchwhcisw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_171z2Negckh-UAFXHg91cA_YImBzFxn';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function YouTubeClipPlayer({ postId, clip, mediaUrl }) {
  const containerId = `yt-player-${postId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [clipProgress, setClipProgress] = useState(0); // 0 to duration
  const [isClipFinished, setIsClipFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const formatSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.YT) {
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
    }

    let isMounted = true;

    const setupPlayer = () => {
      if (!isMounted || playerRef.current || !window.YT || !window.YT.Player) return;
      const el = document.getElementById(containerId);
      if (!el) return;

      try {
        playerRef.current = new window.YT.Player(containerId, {
          videoId: clip.videoId,
          playerVars: {
            start: clip.start,
            end: clip.end,
            autoplay: 1,
            mute: 1,
            controls: 0, // HIDE ALL YOUTUBE NATIVE SCRUBBER AND FULL TIMELINE
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            playsinline: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : ''
          },
          events: {
            onStateChange: (event) => {
              if (!isMounted) return;
              // 1: PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
                setHasStartedPlaying(true);
                setIsClipFinished(false);

                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
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
                }, 150);
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
          }
        });
      } catch (err) {
        console.warn('YT player error:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const timer = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(timer);
          setupPlayer();
        }
      }, 200);
      return () => {
        isMounted = false;
        clearInterval(timer);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          try { playerRef.current.destroy(); } catch (_) { }
          playerRef.current = null;
        }
      };
    }

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (_) { }
        playerRef.current = null;
      }
    };
  }, [containerId, clip.videoId, clip.start, clip.end, clip.duration]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') return;
          if (entry.isIntersecting) {
            if (!isClipFinished) {
              playerRef.current.playVideo();
            }
          } else {
            playerRef.current.pauseVideo();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }
    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, [isClipFinished]);

  const togglePlay = (e) => {
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

  const handleReplay = (e) => {
    if (e) e.stopPropagation();
    setIsClipFinished(false);
    setClipProgress(0);
    if (playerRef.current) {
      playerRef.current.seekTo(clip.start, true);
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setClipProgress(val);
    if (playerRef.current) {
      playerRef.current.seekTo(clip.start + val, true);
    }
  };

  const toggleMute = (e) => {
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

  return (
    <div ref={wrapperRef} className="w-full rounded-[14px] overflow-hidden border border-gray-200/90 shadow-2xs bg-black flex flex-col group relative select-none">
      {/* Video Container (Strictly clipped aspect-video) */}
      <div
        className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer"
        onClick={togglePlay}
      >
        {/* Iframe with pointer-events-none so YouTube UI never intercepts or renders.
            Made larger to ensure all native logos (top/bottom edges) are pushed outside the parent container. */}
        <div 
          className="absolute pointer-events-none"
          style={{ width: '135%', height: '135%', left: '-17.5%', top: '-17.5%' }}
        >
          <div id={containerId} className="w-full h-full" />
        </div>

        {/* Initial Poster Thumbnail (Hides the big red YouTube play button before first play) */}
        {!hasStartedPlaying && !isClipFinished && (
          <div 
            className="absolute inset-0 bg-cover bg-center z-10"
            style={{ backgroundImage: `url(https://img.youtube.com/vi/${clip.videoId}/hqdefault.jpg)` }}
          />
        )}

        {/* Anti-branding black bars (Hides title and 'Watch on YouTube' logo when paused) */}
        {!isPlaying && hasStartedPlaying && !isClipFinished && (
          <>
            <div className="absolute top-0 left-0 w-full h-[20%] bg-black z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[20%] bg-black z-10 pointer-events-none" />
          </>
        )}

        {/* Center Big Play Button (When paused or before first start) */}
        {!isPlaying && !isClipFinished && (
          <div className={`absolute inset-0 flex items-center justify-center z-20 transition-all ${!hasStartedPlaying ? 'bg-black/40 backdrop-blur-[2px]' : 'bg-black/30 backdrop-blur-2xs'}`}>
            <button
              type="button"
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white/95 text-[#2475FC] hover:bg-white hover:scale-105 transition-all shadow-xl flex items-center justify-center pl-1 cursor-pointer"
              title="Play Snippet"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </button>
          </div>
        )}

        {/* Clip Finished Overlay (When reaching snippet end limit) */}
        {isClipFinished && (
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20 animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#2475FC] text-white flex items-center justify-center shadow-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="text-center text-white space-y-0.5 px-4">
              <h4 className="text-[14px] font-semibold">Clip Ended ({clip.duration}s)</h4>
              <p className="text-[11px] text-gray-300">Clipped snippet reached its limit and stopped.</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={handleReplay}
                className="px-4 py-1.5 bg-white text-gray-900 rounded-xl text-[12px] font-semibold hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                <span>Replay Clip</span>
              </button>
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Full on YouTube</span> ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Custom Clip Controls Bar (Zero YouTube branding, 100% custom cut timeline) */}
      <div
        className="px-3.5 py-2.5 bg-gray-900 text-white flex flex-col gap-2 border-t border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrubber slider (0 to duration) */}
        <div className="flex items-center gap-2.5">
          <input
            type="range"
            min="0"
            max={clip.duration}
            step="0.1"
            value={clipProgress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2475FC]"
          />
        </div>

        {/* Action row with relative clip time */}
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-300">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-[#2475FC] transition-colors cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              )}
            </button>

            {/* RELATIVE CLIP TIME: e.g. 00:12 / 00:52 (NO full video length like 3:46!) */}
            <span className="font-mono text-gray-200">
              {formatSec(clipProgress)} / {formatSec(clip.duration)}
            </span>
          </div>

          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#38BDF8] flex items-center gap-1 transition-colors text-[11px]"
            title="Open original video"
          >
            <span>Original Video</span> ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ----------------- AUDIO CLIP PLAYER (Spreaker / Podcasts / Direct Audio) -----------------
function AudioClipPlayer({ postId, clip, mediaUrl, post }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clipProgress, setClipProgress] = useState(0); // 0 to duration
  const [isClipFinished, setIsClipFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [artworkUrl, setArtworkUrl] = useState(post?.thumbnail_url || null);
  const [title, setTitle] = useState(post?.content || 'Podcast Audio Clip');
  const [showName, setShowName] = useState(clip?.platform === 'spreaker' ? 'Spreaker' : 'Audio');
  const [streamUrl, setStreamUrl] = useState(clip?.streamUrl || null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(Boolean(clip?.spreakerEpisodeId));
  const [hasArtworkError, setHasArtworkError] = useState(false);

  const formatSec = (sec) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const formatTimestamp = (sec) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const rem = s % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Fetch Spreaker episode metadata (artwork image, show title, audio stream)
  useEffect(() => {
    if (clip?.spreakerEpisodeId) {
      setIsLoadingMetadata(true);
      fetch(`https://api.spreaker.com/v2/episodes/${clip.spreakerEpisodeId}`)
        .then(res => res.json())
        .then(data => {
          const ep = data?.response?.episode;
          if (ep) {
            const img = ep.image_original_url || ep.image_url;
            if (img) setArtworkUrl(img);
            if (ep.title) setTitle(ep.title);
            if (ep.show?.title) setShowName(ep.show.title);
            if (ep.playback_url) setStreamUrl(ep.playback_url);
          }
        })
        .catch((err) => {
          console.warn('Error fetching Spreaker episode metadata:', err);
        })
        .finally(() => {
          setIsLoadingMetadata(false);
        });
    }
  }, [clip?.spreakerEpisodeId]);

  // Handle Play/Pause
  const togglePlay = (e) => {
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
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio playback error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
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

  const handleSeek = (e) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setClipProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = clip.start + val;
    }
    if (isClipFinished) setIsClipFinished(false);
  };

  const handleReplay = (e) => {
    e?.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.currentTime = clip.start;
    setClipProgress(0);
    setIsClipFinished(false);
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => { });
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const displayPlatform = clip.platform === 'spreaker' ? 'Spreaker' : clip.platform === 'spotify' ? 'Spotify' : 'Podcast Clip';

  return (
    <div className="w-full rounded-[14px] overflow-hidden border border-gray-800 bg-black text-white shadow-sm flex flex-col group relative select-none">
      {/* Hidden HTML5 Audio Element */}
      {streamUrl && (
        <audio
          ref={audioRef}
          src={streamUrl}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            setIsClipFinished(true);
          }}
          onError={() => {
            setIsPlaying(false);
          }}
        />
      )}

      {/* Main Top Header: Artwork Image + Platform Name below it + Metadata */}
      <div className="p-3.5 sm:p-4 flex items-start gap-3.5 sm:gap-4 relative">
        {/* Left Column: Cover Artwork Image + Platform Name Under It */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div
            className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden border border-gray-800 bg-neutral-900 flex items-center justify-center cursor-pointer group/cover"
            onClick={togglePlay}
            title={isPlaying ? "Click to Pause" : "Click to Play"}
          >
            {artworkUrl && !hasArtworkError ? (
              <img
                src={artworkUrl}
                alt={title || 'Podcast Cover'}
                className="w-full h-full object-cover"
                onError={() => setHasArtworkError(true)}
              />
            ) : (
              <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center p-2 text-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6" />
                </svg>
              </div>
            )}

            {/* Subtle Play/Pause Overlay indicator on hover over image */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover/cover:opacity-100'}`}>
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </div>
          </div>

          {/* Platform Name: Directly below cover image, plain white, no shape, no highlight, no glow */}
          <span className="text-[12px] text-white font-medium text-center">
            {displayPlatform}
          </span>
        </div>

        {/* Right Details: Timestamp Pill & Episode Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 py-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono text-gray-400">
              {formatTimestamp(clip.start)} – {formatTimestamp(clip.end)} ({clip.duration}s)
            </span>
          </div>

          {/* Episode Title */}
          <h4
            className="text-[15px] font-semibold text-white leading-snug line-clamp-2"
            title={title}
          >
            {title}
          </h4>

          {/* Show / Host Name */}
          <p className="text-[13px] text-gray-400 truncate">
            {showName}
          </p>
        </div>
      </div>

      {/* Clip Finished Alert Bar */}
      {isClipFinished && (
        <div className="mx-3.5 sm:mx-4 mb-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[11px] text-gray-300">
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Clip snippet ended ({clip.duration}s limit)</span>
          </span>
          <button
            type="button"
            onClick={handleReplay}
            className="font-semibold text-white hover:underline cursor-pointer"
          >
            Replay
          </button>
        </div>
      )}

      {/* Bottom Timeline Controls Bar */}
      <div
        className="px-3.5 sm:px-4 py-2.5 bg-black border-t border-gray-800 flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrubber slider (0 to clip.duration) */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={clip.duration}
            step="0.1"
            value={clipProgress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#2475FC]"
          />
        </div>

        {/* Action row with controls and clip time */}
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-300">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-[#38BDF8] transition-colors cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Replay Clip"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              )}
            </button>

            {/* Relative Clip Time */}
            <span className="font-mono text-gray-300">
              {formatSec(clipProgress)} / {formatSec(clip.duration)}
            </span>
          </div>

          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors text-[11px]"
            title={`Open original on ${displayPlatform}`}
          >
            <span>Open on {displayPlatform}</span> ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function detectLanguage(code, url = '') {
  if (url) {
    const ext = url.split('.').pop()?.split(/[?#]/)[0]?.toLowerCase();
    if (ext === 'py') return 'Python';
    if (ext === 'js' || ext === 'mjs' || ext === 'cjs') return 'JavaScript';
    if (ext === 'ts') return 'TypeScript';
    if (ext === 'jsx' || ext === 'tsx') return 'React';
    if (ext === 'json') return 'JSON';
    if (ext === 'html' || ext === 'htm') return 'HTML';
    if (ext === 'css') return 'CSS';
    if (ext === 'sql') return 'SQL';
    if (ext === 'rs') return 'Rust';
    if (ext === 'go') return 'Go';
    if (ext === 'cpp' || ext === 'c' || ext === 'h') return 'C/C++';
    if (ext === 'xml') return 'XML';
    if (ext === 'yaml' || ext === 'yml') return 'YAML';
  }
  const t = (code || '').trim().toLowerCase();
  if (t.includes('def ') || (t.includes('import ') && t.includes(':')) || t.includes('__manifest__') || t.includes('self.')) return 'Python';
  if (t.startsWith('{') || t.startsWith('"{') || t.startsWith('[{')) return 'JSON / Dict';
  if (t.includes('const ') || t.includes('function') || t.includes('console.log') || t.includes('export default')) return 'JavaScript';
  if (t.includes('<html') || t.includes('<!doctype') || t.includes('<div') || t.includes('<script')) return 'HTML';
  if (t.includes('select ') && t.includes('from ')) return 'SQL';
  return 'Code';
}

function isCodeContent(text, mediaUrl = '') {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) return true;

  // Check URL file extension if GitHub/source code link
  if (mediaUrl && /\.(py|js|jsx|ts|tsx|json|html|css|cpp|c|h|rs|go|php|rb|sql|yaml|yml|xml|sh)(\?.*)?$/i.test(mediaUrl)) {
    return true;
  }
  if (mediaUrl && mediaUrl.includes('github.com') && mediaUrl.includes('/blob/')) {
    return true;
  }

  // Check JSON or Python dict syntax like "{ 'name': ... }"
  if ((trimmed.startsWith('{') || trimmed.startsWith('"{') || trimmed.startsWith('[{')) && (trimmed.includes(':') || trimmed.includes('=>'))) {
    return true;
  }

  const lines = trimmed.split('\n');
  if (lines.length >= 2) {
    const codePatterns = [
      /^\s*(import|export|from|require)\s+/m,
      /^\s*(def|class|function|async\s+function|const|let|var)\s+/m,
      /^\s*(if|for|while|switch|return)\s*[\(\{]/m,
      /['"][a-zA-Z0-9_-]+['"]\s*:\s*/,
      /^\s*<(!DOCTYPE|html|div|xml|script|style|\?xml)/i,
      /^\s*(\/\*|\/\/|#|<!--)/m,
      /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\s+/im
    ];

    let matches = 0;
    for (const p of codePatterns) {
      if (p.test(trimmed)) matches++;
    }
    if (matches >= 1 && lines.length >= 3) return true;
    if (matches >= 2) return true;

    // Check indentation density with typical code symbols
    const indented = lines.filter(l => /^\s{2,}|\t/.test(l)).length;
    if (indented >= 2 && /[{}[\]:;,]/.test(trimmed)) return true;
  }

  return false;
}

function PostCodeBlock({ content, mediaUrl, onOpenReviewModal }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  let code = (content || '').trim();
  // Strip outer quotes if the entire code was pasted within double quotes like "{ ... }"
  if ((code.startsWith('"{') && code.endsWith('}"')) || (code.startsWith('"{') && code.endsWith('"'))) {
    code = code.substring(1, code.endsWith('"') ? code.length - 1 : code.length);
  } else if (code.startsWith('"') && code.endsWith('"') && code.length > 30) {
    code = code.slice(1, -1);
  }

  // Strip markdown code fences if present
  let language = '';
  const matchFence = code.match(/^```([a-zA-Z0-9_-]*)\n([\s\S]*?)```$/);
  if (matchFence) {
    language = matchFence[1] || '';
    code = matchFence[2];
  }

  let filename = '';
  if (mediaUrl) {
    try {
      const u = new URL(mediaUrl);
      const parts = u.pathname.split('/');
      const last = parts[parts.length - 1];
      if (last && last.includes('.')) {
        filename = last;
      }
    } catch (_) {}
  }

  if (!language) {
    language = detectLanguage(code, filename || mediaUrl);
  }

  const lines = code.split('\n');
  const totalLines = lines.length;
  const hasMore = totalLines > 8;
  const visibleLines = (isExpanded || !hasMore) ? lines : lines.slice(0, 8);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReview = (e) => {
    e.stopPropagation();
    if (onOpenReviewModal) {
      onOpenReviewModal({
        code,
        language: filename || language,
        totalLines,
        mediaUrl
      });
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#0D1117] border border-black/25 shadow-md my-2 font-mono text-left" dir="ltr">
      {/* Top Mac Window Header with 3 Dots (Traffic Lights) */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#161B22] border-b border-[#30363D] select-none">
        <div className="flex items-center gap-2.5">
          {/* 3 Colored Circles (Mac dots: Red, Yellow, Green) */}
          <div className="flex items-center gap-1.5 mr-1">
            <span 
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-xs hover:opacity-85 transition cursor-pointer" 
              title="Close / Hide"
              onClick={() => setIsExpanded(false)}
            />
            <span 
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-xs hover:opacity-85 transition cursor-pointer" 
              title="Minimize"
              onClick={() => setIsExpanded(false)}
            />
            <span 
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-xs hover:opacity-85 transition cursor-pointer" 
              title="Expand & Review"
              onClick={handleReview}
            />
          </div>

          {/* Code / File Label */}
          <span className="text-[12px] font-medium text-[#7D8590] flex items-center gap-1.5 font-sans">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#58A6FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span className="text-[#E6EDF3] font-mono text-[12px] font-semibold">{filename || language || 'Code'}</span>
            <span className="text-[11px] text-[#6E7681]">({totalLines} lines)</span>
          </span>
        </div>

        {/* Right Action Buttons (Icons only to avoid crowding) */}
        <div className="flex items-center gap-1.5">
          {/* Copy Button (Icon only) */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-7 h-7 flex items-center justify-center text-[#C9D1D9] hover:text-white bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] rounded-md transition-colors cursor-pointer shrink-0"
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3FB950" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
          </button>

          {/* Fullscreen / Review Button (Icon only) */}
          <button
            type="button"
            onClick={handleReview}
            className="w-7 h-7 flex items-center justify-center text-[#58A6FF] hover:text-[#79C0FF] bg-[#388BFD]/10 hover:bg-[#388BFD]/20 border border-[#388BFD]/30 rounded-md transition-colors cursor-pointer shrink-0"
            title="Expand & Review full code"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
          </button>
        </div>
      </div>

      {/* Code Body - Showing max 8 lines */}
      <div className="relative overflow-x-auto p-3 text-[12.5px] leading-[20px] bg-[#0D1117] text-[#E6EDF3]">
        <div className="flex">
          {/* Line Numbers Column */}
          <div className="select-none text-[#484F58] text-right pr-3.5 pl-1 border-r border-[#21262D] shrink-0 font-mono text-[11.5px] leading-[20px]">
            {visibleLines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Text Column */}
          <div className="pl-3.5 pr-2 overflow-x-auto whitespace-pre font-mono flex-1 min-w-0">
            {visibleLines.map((line, i) => (
              <div key={i} className="hover:bg-white/[0.04] px-1 -mx-1 rounded-xs">{line || ' '}</div>
            ))}
          </div>
        </div>

        {/* Gradient fade overlay if more than 8 lines and not expanded */}
        {hasMore && !isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Footer Expand / Review Bar (Appears when lines > 8) */}
      {hasMore && (
        <div className="px-3 py-2 bg-[#161B22] border-t border-[#30363D] flex items-center justify-between text-[12px] font-sans">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[#58A6FF] hover:text-[#79C0FF] font-medium transition-colors cursor-pointer py-0.5"
          >
            {isExpanded ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                <span>Show less</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                <span>Show all {totalLines} lines</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReview}
            className="text-[11.5px] text-[#8B949E] hover:text-[#58A6FF] flex items-center gap-1 transition-colors cursor-pointer"
            title="Review full code"
          >
            <span>Review full code</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [posts, setPosts] = useState([]);
  const [codeReviewModal, setCodeReviewModal] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [postText, setPostText] = useState('');
  const [mediaUrl, setMediaUrl] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [promptModal, setPromptModal] = useState(null);
  const [promptInputValue, setPromptInputValue] = useState('');
  const fileInputRef = useRef(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isExtensionConnected, setIsExtensionConnected] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('Recent');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messagesChat, setMessagesChat] = useState([]);

  useEffect(() => {
    if (!activeChatId || !currentUser) return;
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/messages/${activeChatId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map(m => ({
            id: m.id,
            text: m.content,
            sender: m.sender_id === currentUser.id ? 'me' : 'them',
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessagesChat(formatted);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChatId, currentUser]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChatId || !currentUser) return;
    try {
      const content = messageInput;
      const tempMsg = { id: Date.now(), text: content, sender: 'me', timestamp: 'Just now' };
      setMessagesChat(prev => [...prev, tempMsg]);
      setMessageInput('');
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiver_id: activeChatId, content })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [activities, setActivities] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followedState, setFollowedState] = useState({});

  // Onboarding Modal state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingHandle, setOnboardingHandle] = useState('');
  const [onboardingAvatar, setOnboardingAvatar] = useState('');
  const [onboardingBio, setOnboardingBio] = useState('');
  const [onboardingInterests, setOnboardingInterests] = useState([]);
  const [onboardingError, setOnboardingError] = useState('');
  const [isSubmittingOnboarding, setIsSubmittingOnboarding] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Profile View States (Matching Twitter / Project Data)
  const [profileName, setProfileName] = useState('');
  const [profileHandle, setProfileHandle] = useState('');
  const [profileHeadline, setProfileHeadline] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileBanner, setProfileBanner] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Twitter-style Profile Tabs & Followers States (100% Real DB Data)
  const [activeProfileTab, setActiveProfileTab] = useState('annotations'); // 'annotations' | 'edit' | 'settings'
  const [settingsAutoPublish, setSettingsAutoPublish] = useState(false);
  const [settingsSocials, setSettingsSocials] = useState({ twitter: false, linkedin: false, facebook: false });
  const [settingsAiFeatures, setSettingsAiFeatures] = useState({ summarize: true, autoTag: true });
  const [showFollowersModal, setShowFollowersModal] = useState(null); // 'followers' | 'following' | null
  const [followersSubTab, setFollowersSubTab] = useState('followers'); // 'followers' | 'following'
  const [followersSearchQuery, setFollowersSearchQuery] = useState('');

  // Claim / Report Modal State
  const [claimModalPost, setClaimModalPost] = useState(null);
  const [claimReason, setClaimReason] = useState('Misleading or False Information');
  const [claimDetails, setClaimDetails] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState('');

  const handleOpenClaimModal = (post) => {
    setClaimModalPost(post);
    setClaimReason('Misleading or False Information');
    setClaimDetails('');
    setClaimSuccessMessage('');
  };

  const handleCloseClaimModal = () => {
    setClaimModalPost(null);
    setClaimDetails('');
    setClaimSuccessMessage('');
    setIsSubmittingClaim(false);
  };

  const handleSubmitClaim = async (e) => {
    e?.preventDefault();
    if (!claimModalPost) return;
    setIsSubmittingClaim(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // Send claim report to backend if available
      try {
        await fetch(`http://localhost:5000/api/claims`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            post_id: claimModalPost.id,
            post_author: claimModalPost.author_name,
            reason: claimReason,
            details: claimDetails,
            created_at: new Date().toISOString()
          })
        });
      } catch (_) {}

      setClaimSuccessMessage('Thank you. Your claim has been filed and sent for review.');
      setTimeout(() => {
        handleCloseClaimModal();
      }, 1600);
    } catch (err) {
      console.error(err);
      setClaimSuccessMessage('Claim submitted successfully.');
      setTimeout(() => {
        handleCloseClaimModal();
      }, 1500);
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  // Real Database Records from PostgreSQL
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  // File Upload Refs
  const avatarFileInputRef = React.useRef(null);
  const bannerFileInputRef = React.useRef(null);

  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Avatar size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setProfileAvatar(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setProfileError('Banner size must be less than 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setProfileBanner(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileHandle(currentUser.handle || '');
      setProfileHeadline(currentUser.headline || 'AI & Systems Researcher');
      setProfileBio(currentUser.bio || '');
      setProfileAvatar(currentUser.avatar_url || '');
      setProfileBanner(currentUser.banner_url || '');
    }
  }, [currentUser]);

  const formatJoinDate = (dateStr) => {
    if (!dateStr) return 'October 2026';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (_) {
      return 'October 2026';
    }
  };

  const handleToggleFollowUser = async (targetUser) => {
    const handle = targetUser.handle;
    const isNowFollowing = !targetUser.is_following;

    setFollowersList(prev => prev.map(u => u.handle === handle ? { ...u, is_following: isNowFollowing } : u));
    setFollowingList(prev => {
      if (isNowFollowing) {
        const exists = prev.some(u => u.handle === handle);
        return exists ? prev.map(u => u.handle === handle ? { ...u, is_following: true } : u) : [...prev, { ...targetUser, is_following: true }];
      } else {
        return prev.filter(u => u.handle !== handle);
      }
    });

    setCurrentUser(prev => prev ? ({
      ...prev,
      followingCount: Math.max(0, (prev.followingCount || 0) + (isNowFollowing ? 1 : -1))
    }) : prev);

    const token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;
    if (token) {
      try {
        await fetch(`http://localhost:5000/api/follows/${handle}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (_) { }
    }
  };

  const openFollowersModal = (tab = 'followers') => {
    setFollowersSubTab(tab);
    setShowFollowersModal(tab);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setProfileError('');
    setProfileSaveSuccess(false);

    let clean = (profileHandle || '').trim().toLowerCase().replace(/@gmail\.com|gmailcom/gi, '').replace(/[^a-z0-9_]/g, '');
    if (!clean || clean.length < 3) {
      setProfileError('Username is required and must be at least 3 English characters.');
      return;
    }

    setIsSavingProfile(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;

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
            chrome.storage.local.set({ annotated_user: updated });
          }
          setProfileSaveSuccess(true);
          setTimeout(() => setProfileSaveSuccess(false), 3000);
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
        chrome.storage.local.set({ annotated_user: updated });
      }
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.message || 'Error updating profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleSupport = async () => {
    const nextVal = !supportAccess;
    setSupportAccess(nextVal);
    const token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;
    if (token) {
      try {
        await fetch('http://localhost:5000/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            preferences: { support_access: nextVal }
          })
        });
      } catch (_) { }
    }
  };

  const INTEREST_OPTIONS = [
    'Technology', 'AI', 'Web3', 'Business', 'Science', 'Finance', 'Culture', 'Sports'
  ];

  // Helper for dynamic login route
  const getLoginTarget = (query = '') => {
    if (typeof window === 'undefined') return '/login' + (query ? `?${query}` : '');
    const isExtensionOrFile =
      window.location.protocol === 'chrome-extension:' ||
      window.location.protocol === 'file:' ||
      window.location.pathname.endsWith('.html');
    const base = isExtensionOrFile ? './login.html' : '/login';
    return query ? `${base}?${query}` : base;
  };

  // Helpers for Media Rendering & Link Navigation
  const parseYouTubeClip = (url) => {
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
      } catch (_) { }

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
    } catch (_) { }
    return null;
  };

  const parseAudioClip = (url, post) => {
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
    } catch (_) { }
    return null;
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isDirectImageUrl = (url) => {
    if (!url) return false;
    if (url.startsWith('data:image/')) return true;
    return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(url);
  };

  // Strict Authentication Guard & Real Data Loader
  useEffect(() => {
    const fetchIdentities = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.identities) {
        const twitterConnected = user.identities.some(id => id.provider === 'twitter' || id.provider === 'x');
        const linkedinConnected = user.identities.some(id => id.provider === 'linkedin_oidc' || id.provider === 'linkedin');
        
        setSettingsSocials(prev => ({
          ...prev,
          twitter: twitterConnected,
          linkedin: linkedinConnected
        }));
      }
    };
    fetchIdentities();
  }, []);

  useEffect(() => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;

    // Load stored user immediately for instant rendering
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('annotated_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentUser(parsed);
          if (parsed.onboarding_completed) {
            setShowOnboarding(false);
          }
        } catch (_) { }
      }
    }

    // Capture OAuth token passed in URL from Google / X callbacks
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        token = urlToken;
        localStorage.setItem('annotated_token', urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

    // 1. Verify Session with PostgreSQL Backend API
    fetch('http://localhost:5000/api/auth/me', {
      headers: authHeaders
    })
      .then(res => {
        if (!res.ok) throw new Error('Session invalid or expired');
        return res.json();
      })
      .then(data => {
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
          if (typeof window !== 'undefined') {
            window.postMessage({ type: 'ANNOTATED_AUTH_SUCCESS', token: token || fullUser.id, user: fullUser }, '*');
            if (window.chrome?.storage?.local) {
              window.chrome.storage.local.set({ annotated_token: token || fullUser.id, annotated_user: fullUser }).catch(() => { });
            }
          }
          if (fullUser.onboarding_completed) {
            setShowOnboarding(false);
          }
          setIsLoadingAuth(false);
        }
      })
      .catch(() => {
        setIsLoadingAuth(false);
      });

    // 2. Fetch Real Posts from PostgreSQL Database
    fetch('http://localhost:5000/api/posts', {
      headers: authHeaders
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.posts && data.posts.length > 0) {
          const formatted = data.posts.map(p => ({
            id: p.id,
            author_name: p.author_name || 'Annotated Researcher',
            author_handle: p.author_handle || 'researcher',
            author_avatar: p.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.author_name || 'User')}`,
            time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: p.content,
            hashtags: Array.isArray(p.hashtags) ? p.hashtags : JSON.parse(p.hashtags || '[]'),
            media_url: p.media_url,
            media_type: p.media_type,
            thumbnail_url: p.thumbnail_url || null,
            likes_count: p.likes_count || 0,
            is_liked: Boolean(p.is_liked),
            comments: Array.isArray(p.comments) ? p.comments : [],
            comments_count: p.comments_count != null ? p.comments_count : (Array.isArray(p.comments) ? p.comments.length : 0)
          }));
          setPosts(formatted);
        }
      })
      .catch(() => { });

    // 3. Fetch Trending Research Tags from PostgreSQL
    fetch('http://localhost:5000/api/tags/trending')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tags) {
          setTrendingTags(data.tags);
        }
      })
      .catch(() => { });

    // 4. Fetch Real Suggested Users from PostgreSQL
    fetch('http://localhost:5000/api/users/suggested', {
      headers: authHeaders
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users) {
          setSuggestedUsers(data.users);
        }
      })
      .catch(() => { });

    // 5. Fetch Real Activities from PostgreSQL
    fetch('http://localhost:5000/api/activities', {
      headers: authHeaders
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.activities) {
          setActivities(data.activities);
        }
      })
      .catch(() => { });

    // 6. Fetch User Followers & Following from PostgreSQL
    fetch('http://localhost:5000/api/user/followers', {
      headers: authHeaders
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.followers)) {
          setFollowersList(data.followers);
        }
      })
      .catch(() => { });

    fetch('http://localhost:5000/api/user/following', {
      headers: authHeaders
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.following)) {
          setFollowingList(data.following);
        }
      })
      .catch(() => { });

    // 7. Fetch Real User Annotations from PostgreSQL
    fetch('http://localhost:5000/api/annotations', {
      headers: authHeaders
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.annotations)) {
          setUserAnnotations(data.annotations);
        }
      })
      .catch(() => { });

    // Check Chrome Extension bridge
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'ANNOTATED_EXTENSION_PONG') {
          setIsExtensionConnected(true);
        }
        if (event.data?.type === 'ANNOTATION_PUBLISHED_BY_EXTENSION') {
          const newAnnot = event.data.annotation;
          const newPost = event.data.post;
          if (newAnnot) {
            setUserAnnotations(prev => [newAnnot, ...prev.filter(a => a.id !== newAnnot.id)]);
            setCurrentUser(prev => prev ? {
              ...prev,
              annotationsCount: (prev.annotationsCount || 0) + 1
            } : prev);
          }
          if (newPost) {
            setPosts(prev => [newPost, ...prev.filter(p => p.id !== newPost.id)]);
            setCurrentUser(prev => prev ? {
              ...prev,
              notesCount: (prev.notesCount || 0) + 1
            } : prev);
          }
        }
        if (event.data?.type === 'COMMENT_ADDED_BY_EXTENSION') {
          const { postId, comment } = event.data;
          if (postId && comment) {
            setPosts(prev => prev.map(p => {
              if (p.id === postId) {
                const existing = Array.isArray(p.comments) ? p.comments : [];
                if (!existing.some(c => (typeof c === 'object' ? c.id : null) === comment.id)) {
                  return {
                    ...p,
                    comments: [...existing, comment],
                    comments_count: (p.comments_count || 0) + 1
                  };
                }
              }
              return p;
            }));
          }
        }
      });
      window.postMessage({ type: 'ANNOTATED_EXTENSION_PING' }, '*');
    }
  }, []);

  // Trigger Onboarding Modal only if user has finished auth loading and has not completed onboarding
  useEffect(() => {
    if (!isLoadingAuth && currentUser) {
      const isCompleted = !!(
        currentUser.onboarding_completed ||
        (typeof window !== 'undefined' && (
          localStorage.getItem(`onboarding_completed_${currentUser.id}`) === 'true' ||
          (currentUser.email && localStorage.getItem(`onboarding_completed_${currentUser.email}`) === 'true') ||
          (currentUser.handle && localStorage.getItem(`onboarding_completed_${currentUser.handle}`) === 'true') ||
          localStorage.getItem('annotated_onboarding_done') === 'true'
        ))
      );

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
        const base = baseSource
          .toLowerCase()
          .replace(/@gmail\.com|gmailcom/gi, '')
          .replace(/[^a-z0-9_]/g, '');
        initialHandle = base.length >= 3 ? base : 'user' + Math.floor(Math.random() * 1000);
      }
      setOnboardingHandle(initialHandle);

      setOnboardingAvatar(
        currentUser.avatar_url ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || 'User')}`
      );
      setOnboardingBio(currentUser.bio || '');
      setOnboardingInterests(Array.isArray(currentUser.interests) ? currentUser.interests : []);
    } else if (currentUser?.onboarding_completed) {
      setShowOnboarding(false);
    }
  }, [currentUser, isLoadingAuth]);

  const toggleInterest = (interest) => {
    setOnboardingInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleOnboardingSubmit = async (e) => {
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

    const token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;

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
          Object.assign(updatedUser, data.user, { onboarding_completed: true });
        }
      }

      // Save session locally and in Chrome extension storage ONLY on success
      setCurrentUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`onboarding_completed_${updatedUser.id}`, 'true');
        if (updatedUser.email) localStorage.setItem(`onboarding_completed_${updatedUser.email}`, 'true');
        if (updatedUser.handle) localStorage.setItem(`onboarding_completed_${updatedUser.handle}`, 'true');
        localStorage.setItem('annotated_onboarding_done', 'true');
        localStorage.setItem('annotated_user', JSON.stringify(updatedUser));
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({ annotated_user: updatedUser, annotated_token: token });
        }
      }
      setShowOnboarding(false);
    } catch (err) {
      console.warn('Backend onboarding update warning:', err.message);
      setOnboardingError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmittingOnboarding(false);
    }
  };

  const dismissOnboarding = () => {
    if (currentUser && typeof window !== 'undefined') {
      localStorage.setItem(`onboarding_completed_${currentUser.id}`, 'true');
      if (currentUser.email) localStorage.setItem(`onboarding_completed_${currentUser.email}`, 'true');
      if (currentUser.handle) localStorage.setItem(`onboarding_completed_${currentUser.handle}`, 'true');
      localStorage.setItem('annotated_onboarding_done', 'true');
      const updated = { ...currentUser, onboarding_completed: true };
      setCurrentUser(updated);
      localStorage.setItem('annotated_user', JSON.stringify(updated));
    }
    setShowOnboarding(false);
  };

  const handleSearch = async (term) => {
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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results || []);
      }
    } catch (_) {
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFollow = async (name) => {
    setFollowedState((prev) => ({ ...prev, [name]: !prev[name] }));
    const token = localStorage.getItem('annotated_token');
    if (token) {
      try {
        await fetch(`http://localhost:5000/api/follows/${name}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (_) { }
    }
  };

  const handleLike = async (postId = 'seed-post-1') => {
    if (!currentUser) {
      if (typeof window !== 'undefined') window.location.href = getLoginTarget();
      return;
    }
    setPosts(prev => prev.map(p => {
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
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (_) { }
    }
  };

  const handleScrollToDomain = (domain) => {
    // Find the first post that matches this domain in its media_url
    const targetPost = posts.find(p => p.media_url && p.media_url.includes(domain));
    if (targetPost) {
      const el = document.getElementById(`post-${targetPost.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-[#3297EE]/50', 'transition-all', 'duration-500');
        setTimeout(() => el.classList.remove('ring-4', 'ring-[#3297EE]/50'), 2000);
      }
    } else {
      window.alert("Post not found in the current feed.");
    }
  };

  const handleDeletePost = async (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setPostToDelete(null);
    const token = localStorage.getItem('annotated_token');
    if (token && !postId.toString().startsWith('local-')) {
      try {
        await fetch(`http://localhost:5000/api/posts/${postId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (_) { }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          const reader = new FileReader();
          reader.onloadend = () => {
            setMediaUrl(reader.result);
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    }
  };

  const handleCreatePost = async () => {
    if (!currentUser) {
      if (typeof window !== 'undefined') window.location.href = getLoginTarget();
      return;
    }
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
      hashtags: ['#Annotated', '#WorkspaceNotes'],
      media_url: mediaUrl,
      likes_count: 0,
      is_liked: false,
      comments: []
    };

    setPosts(prev => [newPostItem, ...prev]);
    setPostText('');
    setMediaUrl(null);

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
          setPosts(prev => prev.map(p => p.id === newPostItem.id ? { ...p, id: data.post.id } : p));
        }
      } catch (_) { }
    }

    setIsPosting(false);
  };

  const handleSharePost = async (post) => {
    if (!post) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/home?post=${post.id}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Annotated Post',
          text: post.content || 'Check out this note on Annotated',
          url: shareUrl
        });
        return;
      } catch (_) { }
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
      setTimeout(() => setCopiedPostId(null), 2200);
    } catch (_) {
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2200);
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentUser) {
      if (typeof window !== 'undefined') window.location.href = getLoginTarget();
      return;
    }
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    // Clear input immediately
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    const token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;
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
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const existing = Array.isArray(p.comments) ? p.comments : [];
        return {
          ...p,
          comments: [...existing, newComment],
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
          body: JSON.stringify({ content: text })
        });
        const data = await res.json();
        if (data.success && data.comment) {
          setPosts(prev => prev.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                comments: (p.comments || []).map(c => c.id === tempCommentId ? data.comment : c)
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

  const handleStartEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content || '');
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleSaveEditComment = async (commentId, postId) => {
    const updatedContent = editingCommentText.trim();
    if (!updatedContent) return;

    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: (p.comments || []).map(c => c.id === commentId ? { ...c, content: updatedContent } : c)
        };
      }
      return p;
    }));

    setEditingCommentId(null);
    setEditingCommentText('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;
    if (token) {
      try {
        await fetch(`http://localhost:5000/api/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: updatedContent })
        });
      } catch (err) {
        console.error('Failed to update comment:', err);
      }
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    // Optimistic delete
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const filtered = (p.comments || []).filter(c => c.id !== commentId);
        return {
          ...p,
          comments: filtered,
          comments_count: Math.max(0, (p.comments_count != null ? p.comments_count : 1) - 1)
        };
      }
      return p;
    }));

    const token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;
    if (token) {
      try {
        await fetch(`http://localhost:5000/api/comments/${commentId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to delete comment:', err);
      }
    }
  };

  const handleConnectSocial = async (provider) => {
    try {
      const providerName = provider === 'twitter' ? 'x' : provider;
      let res = await supabase.auth.signInWithOAuth({
        provider: providerName,
        options: {
          redirectTo: window.location.origin + '/home',
        }
      });
      
      if (res.error && res.error.message?.includes('provider is not enabled') && provider === 'twitter') {
        res = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: {
            redirectTo: window.location.origin + '/home',
          }
        });
      }

      if (res.error) {
        console.error('Error connecting identity:', res.error);
        alert('Failed to connect ' + provider + ': ' + res.error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnectSocial = async (provider) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const identityToUnlink = user.identities?.find(id => id.provider === provider || id.provider === provider + '_oidc');
      if (identityToUnlink) {
        const { error } = await supabase.auth.unlinkIdentity(identityToUnlink);
        if (error) throw error;
        
        setSettingsSocials(prev => ({ ...prev, [provider]: false }));
        alert(`Successfully disconnected ${provider}`);
      } else {
        // Fallback for UI if already unlinked
        setSettingsSocials(prev => ({ ...prev, [provider]: false }));
      }
    } catch (err) {
      console.error('Error unlinking identity:', err);
      alert('Failed to disconnect: ' + err.message);
    }
  };

  const handleLogout = async () => {
    // 1. Sign out completely from Supabase Auth client & revoke sessions globally
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (_) { }

    // 2. Notify backend to terminate server session
    const token = typeof window !== 'undefined' ? localStorage.getItem('annotated_token') : null;
    if (token) {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (_) { }
    }

    // 3. Clear ALL local storage tokens & cache (including any sb-* tokens)
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('annotated_') || k.startsWith('sb-') || k.includes('supabase'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        sessionStorage.clear();
      } catch (_) { }

      // 4. Clear Chrome extension storage
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.remove(['annotated_token', 'annotated_user', 'annotated_refresh_token']);
      }

      // 5. Redirect to login with logout flag to enforce fresh state
      window.location.href = getLoginTarget('logout=true');
    }
  };

  const handleViewProfile = (userObj) => {
    if (!currentUser) {
      if (typeof window !== 'undefined') window.location.href = getLoginTarget();
      return;
    }
    if (!userObj) return;
    if (currentUser && (userObj.id === currentUser.id || userObj.handle === currentUser.handle)) {
      setActiveTab('profile');
      return;
    }
    setViewingUser(userObj);
    setActiveTab('user_profile');
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center font-poppins">
        <div className="p-7 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#3297EE] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Compute unique sites from userAnnotations
  const uniqueAnnotatedSites = [];
  if (userAnnotations && userAnnotations.length > 0) {
    const sitesMap = new Map();
    userAnnotations.forEach(ann => {
      if (!ann.page_url) return;

      let domain = ann.page_domain;
      if (!domain) {
        try {
          domain = new URL(ann.page_url).hostname.replace(/^www\./, '');
        } catch (e) {
          domain = 'Unknown Site';
        }
      }

      if (!sitesMap.has(domain)) {
        sitesMap.set(domain, {
          id: domain,
          name: ann.page_title ? (ann.page_title.length > 25 ? ann.page_title.substring(0, 25) + '...' : ann.page_title) : domain,
          category: domain,
          icon_url: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
          url: ann.page_url,
          annotations_count: 1
        });
      } else {
        sitesMap.get(domain).annotations_count += 1;
      }
    });
    uniqueAnnotatedSites.push(...sitesMap.values());
  }

  const sortedPosts = [...posts].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime() || 0;
    const timeB = new Date(b.created_at).getTime() || 0;
    const likesA = a.likes || 0;
    const likesB = b.likes || 0;

    if (sortBy === 'Recent') {
      return timeB - timeA;
    }
    if (sortBy === 'Popular') {
      return likesB - likesA;
    }
    if (sortBy === 'Oldest') {
      return timeA - timeB;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black font-poppins selection:bg-blue-600 selection:text-white">
      {/* URL Prompt Modal */}
      {promptModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[360px] p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{promptModal.title}</h3>
            <input
              type="text"
              value={promptInputValue}
              onChange={(e) => setPromptInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && promptInputValue.trim()) {
                  setMediaUrl(promptInputValue.trim());
                  setPromptModal(null);
                  setPromptInputValue('');
                }
              }}
              placeholder={promptModal.placeholder}
              className="w-full mt-2 mb-6 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3297EE]"
              autoFocus
            />
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => { setPromptModal(null); setPromptInputValue(''); }}
                className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (promptInputValue.trim()) {
                    setMediaUrl(promptInputValue.trim());
                    setPromptModal(null);
                    setPromptInputValue('');
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-[#3297EE] text-white font-medium hover:opacity-90 transition-colors cursor-pointer"
              >
                Attach
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[320px] p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Post</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(postToDelete)}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ══════════════════════════════════════════════════════════
          1. DESKTOP LEFT SIDEBAR (Replaces Top Navbar)
          ══════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] bg-[#3297EE] border-r border-transparent flex-col justify-between p-5 z-40 overflow-y-auto">
        <div className="space-y-7">
          {/* Logo Header */}
          <div className="flex items-center justify-between px-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40"
                alt="Annotated"
                className="w-6 h-6 object-contain"
              />
              <span className="text-[19px] font-medium text-white tracking-tight">Annotated</span>
            </Link>
          </div>

          {/* Search Box */}
          <div>
            <div className="relative">
              <div className="flex items-center gap-2.5 h-[44px] px-3 rounded-[10px] bg-white/10 focus-within:ring-1 focus-within:ring-white/30 transition-all cursor-text">
                <div className="flex items-center justify-center text-white/70 shrink-0 px-1">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-[13px] font-medium text-white placeholder-white/70 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-white/70 hover:text-white shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                )}
              </div>
              {/* Live Search Popup */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 top-[50px] w-full bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 space-y-1">
                  <div className="text-[10px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">Results</div>
                  {searchResults.map((r, i) => (
                    <div key={i} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {r.type}
                        </span>
                        <div className="text-[12px] font-medium text-gray-800 truncate">{r.title}</div>
                      </div>
                      {r.snippet && <p className="text-[11px] text-gray-500 truncate mt-0.5">{r.snippet}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* General Section */}
          <div>
            <div className="text-[12px] text-white/70 font-medium mb-1.5 px-1">General</div>
            <nav className="space-y-0.5">
              <button onClick={() => setActiveTab('home')} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${activeTab === 'home' ? 'text-white font-semibold' : 'text-white/70 font-medium hover:text-white hover:bg-white/10'}`}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={activeTab === 'home' ? 'text-white' : 'text-white/70'}><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" /></svg>
                  <span className="text-[13px]">Home</span>
                </div>
              </button>
              <button onClick={() => setActiveTab('explore')} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${activeTab === 'explore' ? 'text-white font-semibold' : 'text-white/70 font-medium hover:text-white hover:bg-white/10'}`}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={activeTab === 'explore' ? 'text-white' : 'text-white/70'}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" /></svg>
                  <span className="text-[13px]">Explore</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Profile Section */}
          <div>
            <div className="text-[12px] text-white/70 font-medium mb-1.5 px-1">Profile</div>
            <nav className="space-y-0.5">
              <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${activeTab === 'messages' ? 'text-white font-semibold' : 'text-white/70 font-medium hover:text-white hover:bg-white/10'}`}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={activeTab === 'messages' ? 'text-white' : 'text-white/70'}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                  <span className="text-[13px]">Messages</span>
                </div>
                <span className="text-[12px] font-semibold text-white/70">2</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${activeTab === 'notifications' ? 'text-white font-semibold' : 'text-white/70 font-medium hover:text-white hover:bg-white/10'}`}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={activeTab === 'notifications' ? 'text-white' : 'text-white/70'}><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                  <span className="text-[13px]">Notifications</span>
                </div>
              </button>
              <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${activeTab === 'profile' ? 'text-white font-semibold' : 'text-white/70 font-medium hover:text-white hover:bg-white/10'}`}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={activeTab === 'profile' ? 'text-white' : 'text-white/70'}><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>
                  <span className="text-[13px]">Profile</span>
                </div>
              </button>
              <button onClick={handleLogout} className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-white/70 font-medium hover:text-white hover:bg-white/10 mt-1">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-white/70"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
                  <span className="text-[13px]">Log out</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Section: Extension Badge & User Profile */}
        <div className="space-y-4 pt-5 mt-4 border-t border-white/10">
          {isExtensionConnected && (
            <div className="flex items-center px-3 py-1.5">
              <span className="text-[13px] font-medium">
                <span className="text-white">Extension</span>{' '}
                <span className="text-white/90">Connected</span>
              </span>
            </div>
          )}

          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center justify-between px-1 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`}
                alt={currentUser?.name || 'User'}
                className="w-[38px] h-[38px] rounded-full object-cover shrink-0"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                }}
              />
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-white truncate leading-tight">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[11.5px] text-white/70 truncate mt-0.5">
                  {currentUser?.handle ? `@${currentUser.handle}` : 'user@example.com'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════
          2. MOBILE TOP BAR & BOTTOM NAV
          ══════════════════════════════════════════════════════════ */}
      <header className="lg:hidden sticky top-0 z-30 w-full h-[56px] bg-white border-b border-[#EAEAEA] px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40"
            alt="Annotated"
            className="w-5 h-5 object-contain"
          />
          <span className="text-[15px] font-semibold text-[#202020]">Annotated</span>
        </Link>
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`}
            alt="User"
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        </button>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'home' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-400'}`}
        >
          <svg width="20" height="20" viewBox="0 0 19 19" fill="none"><path d="M3.16699 16.625V7.125L9.50033 2.375L15.8337 7.125V16.625H11.0837V11.0833H7.91699V16.625H3.16699Z" fill={activeTab === 'home' ? '#2475FC' : '#94A3B8'} /></svg>
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'explore' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-400'}`}
        >
          <svg width="20" height="20" viewBox="0 0 19 19" fill="none"><path d="M5.99655 13.0018L11.3403 11.3591L12.983 6.01536L7.63926 7.65807L5.99655 13.0018Z" fill={activeTab === 'explore' ? '#2475FC' : '#94A3B8'} /></svg>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'messages' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-400'}`}
        >
          <svg width="20" height="20" viewBox="0 0 19 19" fill="none"><path d="M1.58301 17.4154V2.76953H16.2288V14.2487H4.74967L1.58301 17.4154Z" fill={activeTab === 'messages' ? '#2475FC' : '#94A3B8'} /></svg>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'notifications' ? 'bg-[#EDF5FF] text-[#2475FC]' : 'text-gray-400'}`}
        >
          <svg width="20" height="20" viewBox="0 0 19 19" fill="none"><path d="M3.16699 15.0404V13.8529H15.8337V15.0404H3.16699Z" fill={activeTab === 'notifications' ? '#2475FC' : '#94A3B8'} /></svg>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-[#EDF5FF] text-[#2475FC] ring-1 ring-blue-200' : 'text-gray-400'}`}
        >
          <svg width="20" height="20" viewBox="0 0 19 19" fill="none"><path d="M0.751953 15.8336V13.9732H13.4186V15.8336H0.751953ZM4.94779 8.64922C4.39362 8.09505 4.94779 4.37422 7.08529 4.37422C9.22279 4.37422 9.77695 8.64922 7.08529 8.64922Z" fill={activeTab === 'profile' ? '#2475FC' : '#94A3B8'} /></svg>
        </button>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          3. MAIN CONTENT WRAPPER (Shifted by Sidebar on Desktop)
          ══════════════════════════════════════════════════════════ */}
      <main className="min-h-screen bg-[#F8F9FA] lg:pl-[240px] pb-24 lg:pb-10">

        {/* VIEW 1: PROFILE VIEW (Twitter-style Research Profile with Project Data) */}
        {activeTab === 'profile' && (
          <div className="max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
            {/* Main Profile Card Container */}
            <div className="bg-white rounded-[24px] shadow-xs border border-gray-200/80 overflow-hidden">

              {/* Cover Banner with Direct File Upload */}
              <div className="w-full h-44 sm:h-56 relative bg-gradient-to-r from-[#B9E2FE] via-[#C6EBFD] to-[#DDF0FA] overflow-hidden group">
                <img
                  src={profileBanner || currentUser?.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"}
                  alt="Cover"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";
                  }}
                />

                {/* Banner Upload Button */}
                <button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[12px] font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-md cursor-pointer opacity-90 hover:opacity-100"
                  title="Upload Cover Banner"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Upload banner</span>
                </button>
              </div>

              {/* Avatar, View profile edit Button & Identity */}
              <div className="px-6 sm:px-8 pb-6 border-b border-gray-100">
                <div className="flex items-start justify-between -mt-12 sm:-mt-14 mb-4">
                  {/* Overlapping Avatar with Upload Action */}
                  <div className="relative group cursor-pointer" onClick={() => avatarFileInputRef.current?.click()}>
                    <img
                      src={profileAvatar || currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`}
                      alt={currentUser?.name || 'User'}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md object-cover bg-white ring-1 ring-black/5"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                      }}
                    />

                    {/* Camera Upload Badge on Hover */}
                    <div
                      className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                      title="Upload Profile Photo"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                  </div>

                  {/* Hidden File Inputs */}
                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileSelect}
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    accept="image/*"
                    onChange={handleBannerFileSelect}
                    className="hidden"
                  />

                  {/* Top Right Action Button: View profile edit */}
                  <div className="pt-14 sm:pt-16 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveProfileTab(prev => prev === 'edit' ? 'overview' : 'edit')}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full border text-[13px] sm:text-[14px] font-semibold shadow-xs transition-all cursor-pointer group active:scale-95 ${activeProfileTab === 'edit'
                          ? 'bg-black text-white border-black hover:bg-gray-800'
                          : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                        }`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeProfileTab === 'edit' ? 'text-white' : 'text-gray-500 group-hover:text-blue-600 transition-colors'}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>View profile edit</span>
                    </button>
                  </div>
                </div>

                {/* Name & Handle */}
                <div className="space-y-1 mt-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                      {currentUser?.name || profileName || 'Annotated Researcher'}
                    </h1>
                  </div>
                  <p className="text-[13px] text-gray-500 font-normal">
                    @{currentUser?.handle || profileHandle || 'researcher'}
                  </p>
                </div>

                {/* Bio & Headline */}
                <p className="text-[14px] text-gray-700 font-normal leading-relaxed mt-2.5 max-w-2xl">
                  {currentUser?.bio || profileBio || currentUser?.headline || 'AI & Systems Researcher. Knowledge curator on Annotated AI.'}
                </p>

                {/* Twitter-style Meta Row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[13px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Annotated AI Research Hub</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span className="text-[#2475FC] hover:underline cursor-pointer">
                      annotated.ai/@{currentUser?.handle || 'user'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Joined {formatJoinDate(currentUser?.created_at)}</span>
                  </div>
                </div>

                {/* Twitter-style Following, Followers & Annotations row (Unified line - 100% Real DB Data) */}
                <div className="flex items-center gap-6 mt-4 pt-1 text-[14px]">
                  <button
                    type="button"
                    onClick={() => openFollowersModal('following')}
                    className="hover:underline cursor-pointer group flex items-center gap-1.5 focus:outline-none"
                  >
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {currentUser?.followingCount !== undefined ? currentUser.followingCount : followingList.length}
                    </span>
                    <span className="text-gray-500 font-normal">Following</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openFollowersModal('followers')}
                    className="hover:underline cursor-pointer group flex items-center gap-1.5 focus:outline-none"
                  >
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {currentUser?.followersCount !== undefined ? currentUser.followersCount : followersList.length}
                    </span>
                    <span className="text-gray-500 font-normal">Followers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveProfileTab('annotations')}
                    className="hover:underline cursor-pointer group flex items-center gap-1.5 focus:outline-none"
                  >
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {userAnnotations.length || currentUser?.annotationsCount || 0}
                    </span>
                    <span className="text-gray-500 font-normal">Annotations</span>
                  </button>
                </div>
              </div>

              {/* Twitter-style Profile Navigation Tabs */}
              <div className="flex items-center px-6 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white">
                <button
                  type="button"
                  onClick={() => setActiveProfileTab('annotations')}
                  className={`px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 ${activeProfileTab === 'annotations'
                      ? 'border-[#2475FC] text-[#2475FC]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                >
                  Annotations ({userAnnotations.length || currentUser?.annotationsCount || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveProfileTab('edit')}
                  className={`px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${activeProfileTab === 'edit'
                      ? 'border-[#2475FC] text-[#2475FC]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveProfileTab('settings')}
                  className={`px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${activeProfileTab === 'settings'
                      ? 'border-[#2475FC] text-[#2475FC]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Settings & Integrations</span>
                </button>
              </div>

              {/* TAB 1: ANNOTATIONS (Real User Saved Highlights & Chrome Extension Publishing) */}
              {activeProfileTab === 'annotations' && (
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[15px] font-semibold text-gray-900">Your Research Highlights & Notes</h3>
                      <p className="text-[12px] text-gray-500 mt-0.5">Saved web annotations and research publications</p>
                    </div>
                    <span className="text-[12px] font-semibold text-[#2475FC] bg-blue-50 px-3 py-1 rounded-full">
                      {userAnnotations.length || currentUser?.annotationsCount || 0} Highlights
                    </span>
                  </div>

                  {/* Empty state guidance when publications / annotations are 0 */}
                  {userAnnotations.length === 0 && (
                    <div className="py-12 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                      </div>
                      <h4 className="text-[15px] font-semibold text-gray-800">
                        No annotations or publications yet
                      </h4>
                      <p className="text-[13px] text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                        Use the <strong>Annotated Chrome Extension</strong> to highlight articles and save research notes across the web.
                      </p>
                    </div>
                  )}

                  {/* Saved Annotations List (if any exist in PostgreSQL) */}
                  {userAnnotations.length > 0 && (
                    <div className="space-y-4">
                      {userAnnotations.map((item) => {
                        let domain = item.page_domain || 'Original Source';
                        try {
                          domain = new URL(item.page_url).hostname.replace(/^www\./, '');
                        } catch (_) {}

                        return (
                          <article key={item.id} className="bg-white rounded-[21px] p-5 shadow-xs border border-black/5 space-y-4">
                            {/* Author Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`}
                                  alt={currentUser?.name}
                                  className="w-[37px] h-[37px] rounded-full object-cover"
                                />
                                <div>
                                  <h4 className="text-[14px] font-semibold text-[#202020] leading-none">
                                    {currentUser?.name || 'You'}
                                  </h4>
                                  <span className="text-[10px] text-[#929292] mt-1 block">{formatJoinDate(item.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Content (The Blue/White Web Article Card) */}
                            <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                              {/* Top Blue Part */}
                              <div className="bg-[#3297EE] p-5 text-white">
                                <div className="flex-1 min-w-0 space-y-3">
                                  {item.highlighted_text && (
                                    isCodeContent(item.highlighted_text, item.page_url) ? (
                                      <PostCodeBlock content={item.highlighted_text} mediaUrl={item.page_url} onOpenReviewModal={setCodeReviewModal} />
                                    ) : (
                                      <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap border-l-2 pl-3 border-white/50">
                                        {item.highlighted_text}
                                      </p>
                                    )
                                  )}
                                  {item.note && (
                                    <p className="text-[14px] leading-relaxed text-white/90">
                                      {item.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Bottom White Part */}
                              <div className="bg-white p-5 border-t border-gray-50 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-gray-500 truncate mr-4">
                                  <img
                                    src={item.page_favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                                    alt="favicon"
                                    className="w-5 h-5 rounded-sm object-contain shrink-0"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                  <span className="text-[14px] font-medium text-gray-700 truncate">{item.page_title || domain}</span>
                                </div>
                                <a
                                  href={item.page_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[14px] font-semibold text-gray-400 hover:text-[#3297EE] transition-colors group cursor-pointer shrink-0"
                                >
                                  Visit Page 
                                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#3297EE]/10 group-hover:text-[#3297EE] transition-colors">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                  </span>
                                </a>
                              </div>
                            </div>
                            
                            {/* Engagement Row */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-6">
                                <button className="flex items-center gap-1.5 text-[12px] text-[#595959] hover:text-[#3297EE] transition-colors cursor-pointer">
                                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                  </svg>
                                </button>
                                <div className="flex items-center gap-1.5 text-[12px] text-[#595959]">
                                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.74967 11.1018H10.9445V9.91432H4.74967V11.1018ZM4.74967 8.52891H14.2497V7.34141H4.74967V8.52891ZM4.74967 5.95599H14.2497V4.76849H4.74967V5.95599ZM1.58301 17.4154V2.76953C1.58301 2.45286 1.70176 2.17578 1.93926 1.93828C2.17676 1.70078 2.45384 1.58203 2.77051 1.58203H16.2288C16.5455 1.58203 16.8226 1.70078 17.0601 1.93828C17.2976 2.17578 17.4163 2.45286 17.4163 2.76953V13.0612C17.4163 13.3779 17.2976 13.6549 17.0601 13.8924C16.8226 14.1299 16.5455 14.2487 16.2288 14.2487H4.74967L1.58301 17.4154ZM4.23509 13.0612H16.2288V2.76953H2.77051V14.6445L4.23509 13.0612Z" fill="#242424" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1.5 text-[12px] text-[#595959] hover:text-[#3297EE] transition-colors cursor-pointer">
                                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.95801 16.6263V3.46484C3.95801 3.14818 4.07676 2.87109 4.31426 2.63359C4.55176 2.39609 4.82884 2.27734 5.14551 2.27734H13.8538C14.1705 2.27734 14.4476 2.39609 14.6851 2.63359C14.9226 2.87109 15.0413 3.14818 15.0413 3.46484V16.6263L9.49967 14.2513L3.95801 16.6263ZM5.14551 14.8253L9.49967 12.9846L13.8538 14.8253V3.46484H5.14551V14.8253Z" fill="#242424"/>
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSharePost(item)}
                                  title="Share Post"
                                  className={`p-1.5 rounded-lg flex items-center gap-1.5 text-[12px] font-medium transition-all cursor-pointer ${copiedPostId === item.id
                                      ? 'bg-emerald-50 text-emerald-600 scale-105 shadow-2xs'
                                      : 'text-gray-600 hover:text-[#3297EE] hover:bg-gray-100'
                                    }`}
                                >
                                  {copiedPostId === item.id ? (
                                    <>
                                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="18" cy="5" r="3"></circle>
                                      <circle cx="6" cy="12" r="3"></circle>
                                      <circle cx="18" cy="19" r="3"></circle>
                                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: EDIT PROFILE SETTINGS (Enables editing all user data) */}
              {activeProfileTab === 'edit' && (
                <form onSubmit={handleSaveProfile} className="divide-y divide-gray-100">
                  {/* Public profile */}
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="md:w-[280px]">
                      <h3 className="text-[14px] font-semibold text-gray-900">Public profile</h3>
                      <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                        Update your researcher profile name, username, bio, and avatar.
                      </p>
                    </div>
                    <div className="flex-1 max-w-lg space-y-3.5">
                      {/* Display Name Input */}
                      <div>
                        <label className="text-[12px] font-medium text-gray-700 block mb-1">Display Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white"
                        />
                      </div>

                      {/* Joined Prefix & Username Input */}
                      <div>
                        <label className="text-[12px] font-medium text-gray-700 block mb-1">Handle / Username</label>
                        <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#2475FC] transition-all">
                          <span className="px-3.5 py-2 text-[13px] text-gray-400 bg-gray-50/80 border-r border-gray-200 select-none">
                            annotated.ai/
                          </span>
                          <input
                            type="text"
                            value={profileHandle}
                            onChange={(e) => setProfileHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="handle"
                            className="flex-1 h-10 px-3.5 text-[13px] font-medium text-gray-900 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Headline / Focus */}
                      <div>
                        <label className="text-[12px] font-medium text-gray-700 block mb-1">Research Focus / Headline</label>
                        <input
                          type="text"
                          value={profileHeadline}
                          onChange={(e) => setProfileHeadline(e.target.value)}
                          placeholder="AI & Systems Researcher"
                          className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="text-[12px] font-medium text-gray-700 block mb-1">Bio</label>
                        <textarea
                          rows={2}
                          value={profileBio}
                          onChange={(e) => setProfileBio(e.target.value)}
                          placeholder="AI & Systems Researcher. Knowledge curator on Annotated AI."
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white resize-none"
                        />
                      </div>

                      {/* Avatar Image Upload (Direct File Upload) */}
                      <div>
                        <label className="text-[12px] font-medium text-gray-700 block mb-1.5">Profile Photo</label>
                        <div className="flex items-center gap-4 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200">
                          <img
                            src={profileAvatar || currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`}
                            alt="Avatar Preview"
                            className="w-14 h-14 rounded-full object-cover border border-gray-200 bg-white shrink-0 shadow-xs"
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                            }}
                          />
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => avatarFileInputRef.current?.click()}
                              className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-[12px] font-medium rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:border-gray-400 active:scale-95"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              <span>Upload new photo</span>
                            </button>
                            <p className="text-[11px] text-gray-400">Select an image from your device (PNG, JPG, WebP)</p>
                          </div>
                        </div>
                      </div>

                      {/* Cover Banner Upload (Direct File Upload) */}
                      <div>
                        <label className="text-[12px] font-medium text-gray-700 block mb-1.5">Cover Banner</label>
                        <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2.5">
                          <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-200 border border-gray-200 relative">
                            <img
                              src={profileBanner || currentUser?.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => bannerFileInputRef.current?.click()}
                              className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-[12px] font-medium rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:border-gray-400 active:scale-95"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              <span>Upload cover banner</span>
                            </button>
                            <span className="text-[11px] text-gray-400">Select a banner from your device</span>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex items-center justify-between pt-2">
                        {profileSaveSuccess && (
                          <span className="text-[12px] font-medium text-emerald-600 flex items-center gap-1">
                            ✓ Saved successfully
                          </span>
                        )}
                        {profileError && (
                          <span className="text-[12px] font-medium text-red-500">
                            {profileError}
                          </span>
                        )}
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="ml-auto px-5 py-2.5 bg-[#2475FC] hover:bg-blue-600 text-white rounded-xl text-[13px] font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSavingProfile ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            'Save changes'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>


                  {/* Log out of all devices */}
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="md:w-[280px]">
                      <h3 className="text-[14px] font-semibold text-gray-900">Log out of all devices</h3>
                      <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">
                        Log out of all other active sessions on other devices besides this one.
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-[13px] font-medium text-gray-700 shadow-2xs transition-all cursor-pointer"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 3: SETTINGS & INTEGRATIONS */}
              {activeProfileTab === 'settings' && (
                <div className="divide-y divide-gray-100">
                  {/* Auto-publishing & Social Accounts */}
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="md:w-[280px]">
                      <h3 className="text-[14px] font-semibold text-gray-900">Social Media Auto-Publishing</h3>
                      <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                        Automatically share your new annotations and insights to your connected social networks.
                      </p>
                    </div>
                    <div className="flex-1 max-w-lg space-y-5">
                      {/* Main Toggle */}
                      <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:border-blue-200 transition-colors">
                        <div>
                          <div className="text-[13px] font-semibold text-gray-900">Enable Auto-Publishing</div>
                          <div className="text-[12px] text-gray-500 mt-0.5">Posts will be published immediately after saving.</div>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settingsAutoPublish ? 'bg-[#2475FC]' : 'bg-gray-200'}`} onClick={() => setSettingsAutoPublish(!settingsAutoPublish)}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settingsAutoPublish ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </label>

                      {/* Connect Accounts */}
                      <div className="space-y-3">
                        <div className="text-[12px] font-medium text-gray-700">Connected Accounts</div>
                        
                        {/* Twitter */}
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-gray-900">X (Twitter)</div>
                              <div className="text-[11px] text-gray-500">{settingsSocials.twitter ? '@connected_user' : 'Not connected'}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => settingsSocials.twitter ? handleDisconnectSocial('twitter') : handleConnectSocial('twitter')}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${settingsSocials.twitter ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                          >
                            {settingsSocials.twitter ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-gray-900">LinkedIn</div>
                              <div className="text-[11px] text-gray-500">{settingsSocials.linkedin ? 'Connected' : 'Not connected'}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => settingsSocials.linkedin ? handleDisconnectSocial('linkedin') : handleConnectSocial('linkedin')}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${settingsSocials.linkedin ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90'}`}
                          >
                            {settingsSocials.linkedin ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Features */}
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 border-t border-gray-100">
                    <div className="md:w-[280px]">
                      <h3 className="text-[14px] font-semibold text-gray-900">Advanced AI Features</h3>
                      <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                        Customize how Annotated AI processes your research.
                      </p>
                    </div>
                    <div className="flex-1 max-w-lg space-y-4">
                      <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white cursor-pointer hover:border-blue-200 transition-colors shadow-2xs">
                        <div className="pr-4">
                          <div className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-500"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                            Auto-Summarize Long Articles
                          </div>
                          <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">Automatically generate bullet-point summaries for articles longer than 1,000 words.</div>
                        </div>
                        <div className={`shrink-0 w-10 h-6 rounded-full p-1 transition-colors ${settingsAiFeatures.summarize ? 'bg-purple-500' : 'bg-gray-200'}`} onClick={() => setSettingsAiFeatures(s => ({ ...s, summarize: !s.summarize }))}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settingsAiFeatures.summarize ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white cursor-pointer hover:border-blue-200 transition-colors shadow-2xs">
                        <div className="pr-4">
                          <div className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#3297EE]"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                            Smart Categorization
                          </div>
                          <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">AI automatically adds relevant hashtags and categories to your annotations.</div>
                        </div>
                        <div className={`shrink-0 w-10 h-6 rounded-full p-1 transition-colors ${settingsAiFeatures.autoTag ? 'bg-[#3297EE]' : 'bg-gray-200'}`} onClick={() => setSettingsAiFeatures(s => ({ ...s, autoTag: !s.autoTag }))}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settingsAiFeatures.autoTag ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Twitter-style Floating Followers / Following Modal Popup */}
            {showFollowersModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
                  {/* Modal Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setFollowersSubTab('followers')}
                          className={`px-3 py-1 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${followersSubTab === 'followers' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
                            }`}
                        >
                          Followers ({followersList.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setFollowersSubTab('following')}
                          className={`px-3 py-1 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${followersSubTab === 'following' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
                            }`}
                        >
                          Following ({followingList.length})
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowFollowersModal(null)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modal Search Bar */}
                  <div className="px-5 py-2.5 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative">
                      <input
                        type="text"
                        value={followersSearchQuery}
                        onChange={(e) => setFollowersSearchQuery(e.target.value)}
                        placeholder="Search researchers by name or @handle..."
                        className="w-full h-9 pl-9 pr-3 bg-white border border-gray-200 rounded-xl text-[12px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5 text-gray-400">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                  </div>

                  {/* Modal Users List */}
                  <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100 space-y-2">
                    {(followersSubTab === 'followers' ? followersList : followingList).length === 0 && (
                      <div className="text-center py-10 px-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <p className="text-[13px] font-semibold text-gray-700">
                          {followersSubTab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                        </p>
                      </div>
                    )}
                    {(followersSubTab === 'followers' ? followersList : followingList)
                      .filter(u => !followersSearchQuery || (u.name && u.name.toLowerCase().includes(followersSearchQuery.toLowerCase())) || (u.handle && u.handle.toLowerCase().includes(followersSearchQuery.toLowerCase())))
                      .map((user) => (
                        <div key={user.id || user.handle} className="pt-3 pb-1 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-semibold text-gray-900 truncate">
                                  {user.name}
                                </span>
                                <svg className="w-3.5 h-3.5 text-[#2475FC] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M10.007 2.056c.866-.341 1.848-.341 2.714 0l.707.279c.477.188.995.275 1.51.255l.758-.029c.928-.036 1.83.376 2.457 1.121l.512.609c.348.413.784.73 1.275.927l.714.288c.875.352 1.534 1.109 1.794 2.062l.212.781c.145.534.425 1.018.817 1.411l.575.577c.704.706.993 1.724.786 2.7-.17.804-.17 1.642 0 2.446.207.976-.082 1.994-.786 2.7l-.575.577c-.392.393-.672.877-.817 1.411l-.212.781c-.26.953-.919 1.71-1.794 2.062l-.714.288c-.491.197-.927.514-1.275.927l-.512.609c-.627.745-1.529 1.157-2.457 1.121l-.758-.029c-.515-.02-1.033.067-1.51.255l-.707.279c-.866.341-1.848.341-2.714 0l-.707-.279c-.477-.188-.995-.275-1.51-.255l-.758.029c-.928.036-1.83-.376-2.457-1.121l-.512-.609c-.348-.413-.784-.73-1.275-.927l-.714-.288c-.875-.352-1.534-1.109-1.794-2.062l-.212-.781c-.145-.534-.425-1.018-.817-1.411l-.575-.577c-.704-.706-.993-1.724-.786-2.7.17-.804.17-1.642 0-2.446-.207-.976.082-1.994.786-2.7l.575-.577c.392-.393.672-.877.817-1.411l.212-.781c.26-.953.919-1.71 1.794-2.062l.714-.288c.491-.197.927-.514 1.275-.927l.512-.609c.627-.745 1.529-1.157 2.457-1.121l.758.029c.515.02 1.033-.067 1.51-.255l.707-.279zm1.096 12.355 4.95-4.95a.75.75 0 0 0-1.06-1.06l-4.42 4.419-2.07-2.07a.75.75 0 0 0-1.06 1.06l2.6 2.6a.75.75 0 0 0 1.06 0z" />
                                </svg>
                              </div>
                              <div className="text-[11px] text-gray-400">@{user.handle}</div>
                              {user.bio && (
                                <p className="text-[12px] text-gray-600 truncate max-w-xs mt-0.5">{user.bio}</p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleFollowUser(user)}
                            className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer shrink-0 active:scale-95 ${user.is_following
                                ? 'border border-gray-300 bg-white text-gray-900 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                                : 'bg-[#0F1419] hover:bg-black text-white'
                              }`}
                          >
                            {user.is_following ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: FEED & WORKSPACES (Shown on 'home' tab) */}
        {activeTab === 'home' && (
          <div className="max-w-[1140px] mx-auto py-6 px-4 flex flex-col lg:flex-row items-start justify-center gap-5">
            {/* ================= LEFT COLUMN ================= */}
            <aside className="w-full lg:w-[250px] shrink-0 space-y-5 lg:sticky lg:top-6">
              {/* User Profile Card */}
              <div className="bg-white rounded-[21px] p-5 relative overflow-hidden flex flex-col items-center shadow-xs border border-black/5">
                {/* Cover Banner */}
                <div className="w-full h-[82px] rounded-[15px] overflow-hidden">
                  <img
                    src={currentUser.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"}
                    alt="Workspace Banner"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlapping Avatar */}
                <div className="-mt-[30px] z-10">
                  <img
                    src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`}
                    alt={currentUser?.name || "User"}
                    className="w-[60px] h-[60px] rounded-full border-4 border-white shadow-sm object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                    }}
                  />
                </div>

                {/* Name & Handle */}
                <div className="text-center mt-2.5">
                  <h2 className="text-[13px] font-semibold text-[#202020] leading-tight">{currentUser.name}</h2>
                  <p className="text-[12px] text-[#929292] mt-0.5">@{currentUser.handle}</p>
                </div>

                {/* Stats Box */}
                <div className="w-full mt-4 py-2.5 px-3 bg-[#FAFAFA] rounded-[12px] flex items-center justify-between text-center border border-gray-100/60">
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-[#202020] leading-none">{currentUser.notesCount}</div>
                    <div className="text-[11px] text-[#878787] mt-1">Notes</div>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200" />
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-[#202020] leading-none">{(currentUser.followersCount || 0).toLocaleString()}</div>
                    <div className="text-[11px] text-[#878787] mt-1">Followers</div>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200" />
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-[#202020] leading-none">{currentUser.followingCount || 0}</div>
                    <div className="text-[11px] text-[#878787] mt-1">Following</div>
                  </div>
                </div>

                {/* My Profile Button */}
                <button
                  onClick={() => alert(`Active Workspace: ${currentUser.name} (@${currentUser.handle})`)}
                  className="w-full mt-4 h-[36px] bg-[#3297EE] hover:bg-blue-600 text-white rounded-[12px] text-[11px] font-normal transition-all shadow-xs flex items-center justify-center cursor-pointer"
                >
                  My Workspace
                </button>
              </div>

              {/* Your Annotated Card */}
              <div className="bg-white rounded-[21px] p-5 shadow-xs border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-medium text-gray-900">Your Annotated</h3>
                  <button className="text-[11px] text-gray-400 hover:text-[#3297EE] transition-colors cursor-pointer">
                    See all
                  </button>
                </div>

                <div className="space-y-3.5">
                  {uniqueAnnotatedSites.length === 0 ? (
                    <p className="text-[12px] text-gray-400 text-center py-3">No websites annotated yet</p>
                  ) : (
                    uniqueAnnotatedSites.slice(0, 6).map((item, idx) => (
                      <div key={item.id || idx} onClick={() => handleScrollToDomain(item.id)} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={item.icon_url}
                            alt={item.name}
                            className="w-7 h-7 object-contain drop-shadow-sm rounded shrink-0 group-hover:scale-105 transition-transform"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div className="text-left min-w-0 pr-2">
                            <span className="text-[12px] font-medium text-gray-800 group-hover:text-[#3297EE] transition-colors block truncate" title={item.name}>
                              {item.name}
                            </span>
                            {item.category && (
                              <span className="text-[10px] text-gray-400 font-normal block truncate" title={item.category}>
                                {item.category}
                              </span>
                            )}
                          </div>
                        </div>
                        {item.annotations_count > 0 && (
                          <span className="text-[11px] text-gray-400 font-medium shrink-0">
                            {item.annotations_count}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>

            {/* ================= CENTER COLUMN (FEED) ================= */}
            <section className="w-full lg:w-[527px] flex-1">
              <div className="sticky top-6 z-30 bg-[#F8F9FA] pb-2 mb-4 space-y-4 before:content-[''] before:absolute before:-top-6 before:left-0 before:right-0 before:h-6 before:bg-[#F8F9FA]">
                {/* Post Creation Card */}
                <div className="bg-[#3297EE] rounded-[21px] px-5 py-7 shadow-md space-y-5 text-white">
                  {/* Input Row */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`}
                      alt={currentUser?.name || "Avatar"}
                      className="w-[37px] h-[37px] rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                      }}
                    />
                    <div className="flex-1 h-[37px] px-4 rounded-lg bg-white shadow-sm flex items-center justify-between">
                      <input
                        type="text"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                        onPaste={handlePaste}
                        placeholder="Share an annotation, idea, or AI summary (Press Enter)..."
                        className="w-full bg-transparent text-[12px] font-normal text-[#202020] placeholder-[#929292] focus:outline-none"
                      />
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                      <button
                        onClick={handleCreatePost}
                        disabled={!postText.trim() || isPosting}
                        title="Share to feed"
                        className="p-1 text-[#3297EE] hover:text-blue-700 transition-colors cursor-pointer disabled:opacity-30"
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {mediaUrl && (
                    <div className="relative inline-block mt-2">
                      {mediaUrl.startsWith('data:image/') || mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                        <img src={mediaUrl} alt="Attached" className="h-[120px] w-auto rounded-[14px] object-cover border border-white/20 shadow-sm" />
                      ) : (
                        <div className="text-[12px] font-medium text-blue-100 bg-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>
                          <span>{mediaUrl.length > 40 ? mediaUrl.substring(0, 40) + '...' : mediaUrl}</span>
                        </div>
                      )}
                      <button
                        onClick={() => setMediaUrl(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors cursor-pointer z-10"
                        title="Remove attachment"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Media Actions & Visibility Row */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-5 sm:gap-6">
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[12px] font-medium text-white hover:opacity-80 transition-opacity cursor-pointer">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                        <span>Screenshot</span>
                      </button>

                      <button onClick={() => { setPromptModal({ title: 'Attach Video', placeholder: 'Enter YouTube or media URL...' }); }} className="flex items-center gap-2 text-[12px] font-medium text-white hover:opacity-80 transition-opacity cursor-pointer">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
                        <span>Video URL</span>
                      </button>

                      <button onClick={() => window.alert("Canvas Note feature coming soon!")} className="flex items-center gap-2 text-[12px] font-medium text-white hover:opacity-80 transition-opacity cursor-pointer">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" /></svg>
                        <span>Canvas Note</span>
                      </button>
                    </div>

                    {/* Public Dropdown */}
                    <button className="flex items-center gap-1.5 text-[12px] font-medium text-white hover:opacity-80 transition-opacity cursor-pointer">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                      <span>Workspace</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5 opacity-70"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                  </div>
                </div>

                {/* Sort By Divider Row */}
                <div className="flex items-center gap-3 py-1">
                  <div className="h-[1px] flex-1 bg-[#D1D1D1]" />
                  <div className="relative">
                    <div
                      className="text-[11px] font-normal text-[#929292] cursor-pointer flex items-center gap-1 hover:text-black transition-colors"
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    >
                      Sort by : <span className="text-[#222222] font-medium">{sortBy}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    {isSortDropdownOpen && (
                      <div className="absolute right-0 top-6 bg-white border border-gray-100 shadow-lg rounded-xl py-2 w-32 z-50">
                        {['Recent', 'Popular', 'Oldest'].map(option => (
                          <button
                            key={option}
                            className={`w-full text-left px-4 py-1.5 text-[12px] hover:bg-gray-50 transition-colors ${sortBy === option ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                            onClick={() => {
                              setSortBy(option);
                              setIsSortDropdownOpen(false);
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
              <div className="space-y-4">
                {/* Dynamic Live Feed Posts */}
                {sortedPosts.length === 0 ? (
                  <div className="bg-white rounded-[21px] p-8 text-center shadow-xs border border-black/5 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3297EE] flex items-center justify-center mx-auto mb-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">No posts yet</h4>
                    <p className="text-xs text-gray-500">Be the first to share an annotation, idea, or AI summary using the input above!</p>
                  </div>
                ) : (
                  sortedPosts.map((post) => (
                    <article key={post.id} id={`post-${post.id}`} className="bg-white rounded-[21px] p-5 shadow-xs border border-black/5 space-y-4">
                      {/* Author Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"}
                            alt={post.author_name}
                            className="w-[37px] h-[37px] rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleViewProfile({ id: post.author_id, name: post.author_name, avatar_url: post.author_avatar, handle: post.author_name.replace(/\s+/g, '').toLowerCase(), bio: 'Active researcher on Annotated. Sharing insights and annotations.' })}
                          />
                          <div>
                            <h4
                              className="text-[14px] font-semibold text-[#202020] leading-none cursor-pointer hover:text-[#2475FC] transition-colors"
                              onClick={() => handleViewProfile({ id: post.author_id, name: post.author_name, avatar_url: post.author_avatar, handle: post.author_name.replace(/\s+/g, '').toLowerCase(), bio: 'Active researcher on Annotated. Sharing insights and annotations.' })}
                            >
                              {post.author_name}
                            </h4>
                            <span className="text-[10px] text-[#929292] mt-1 block">{post.time || 'Recently'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Three dots menu */}
                          <button onClick={() => setPostToDelete(post.id)} title="Delete Post" className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.49703 15.8346C9.23499 15.8346 9.01161 15.7414 8.82689 15.5548C8.64217 15.3682 8.5498 15.1439 8.5498 14.8819C8.5498 14.6198 8.64309 14.3964 8.82966 14.2117C9.01623 14.027 9.24053 13.9346 9.50258 13.9346C9.76462 13.9346 9.988 14.0279 10.1727 14.2145C10.3574 14.4011 10.4498 14.6254 10.4498 14.8874C10.4498 15.1494 10.3565 15.3728 10.17 15.5576C9.98338 15.7423 9.75908 15.8346 9.49703 15.8346ZM9.49703 10.4513C9.23499 10.4513 9.01161 10.358 8.82689 10.1714C8.64217 9.98488 8.5498 9.76057 8.5498 9.49853C8.5498 9.23649 8.64309 9.01311 8.82966 8.82839C9.01623 8.64366 9.24053 8.5513 9.50258 8.5513C9.76462 8.5513 9.988 8.64459 10.1727 8.83116C10.3574 9.01773 10.4498 9.24203 10.4498 9.50407C10.4498 9.76611 10.3565 9.9895 10.17 10.1742C9.98338 10.3589 9.75908 10.4513 9.49703 10.4513ZM9.49703 5.06797C9.23499 5.06797 9.01161 4.97468 8.82689 4.78811C8.64217 4.60154 8.5498 4.37724 8.5498 4.1152C8.5498 3.85316 8.64309 3.62977 8.82966 3.44505C9.01623 3.26033 9.24053 3.16797 9.50258 3.16797C9.76462 3.16797 9.988 3.26125 10.1727 3.44782C10.3574 3.63439 10.4498 3.8587 10.4498 4.12074C10.4498 4.38278 10.3565 4.60616 10.17 4.79089C9.98338 4.97561 9.75908 5.06797 9.49703 5.06797Z" fill="#242424" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Post Content & Media */}
                      {(() => {
                        const ytClip = post.media_url ? parseYouTubeClip(post.media_url) : null;
                        const audioClip = post.media_url ? parseAudioClip(post.media_url, post) : null;
                        const isImage = post.media_url ? isDirectImageUrl(post.media_url) : false;
                        const isWebArticle = post.media_url && !ytClip && !audioClip && !isImage;

                        return (
                          <div className="space-y-3">
                            {!isWebArticle && (
                              <div className="text-[15px] font-medium text-[#202020] leading-relaxed">
                                {isCodeContent(post.content, post.media_url) ? (
                                  <PostCodeBlock content={post.content} mediaUrl={post.media_url} onOpenReviewModal={setCodeReviewModal} />
                                ) : (
                                  <p>{post.content}</p>
                                )}
                                {post.hashtags && post.hashtags.length > 0 && (
                                  <p className="mt-1 text-[#509FC6]">
                                    {post.hashtags.join(' ')}
                                  </p>
                                )}
                              </div>
                            )}

                            {post.media_url && (() => {
                              if (ytClip) {
                                return <YouTubeClipPlayer key={post.id} postId={post.id} clip={ytClip} mediaUrl={post.media_url} />;
                              }
                              if (audioClip) {
                                return <AudioClipPlayer key={post.id} postId={post.id} clip={audioClip} mediaUrl={post.media_url} post={post} />;
                              }
                              if (isImage) {
                                return (
                                  <a href={post.media_url} target="_blank" rel="noopener noreferrer" className="block w-full rounded-[14px] overflow-hidden bg-gray-100 border border-gray-200/90 relative group cursor-pointer" title="Click to view original media">
                                    <img src={post.media_url} alt="Original Visual" className="w-full h-auto object-cover max-h-[380px] group-hover:opacity-95 transition-opacity" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[11px] text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span>Open original</span> ↗
                                    </div>
                                  </a>
                                );
                              }
                              if (isWebArticle) {
                                let domain = 'Original Source';
                                try {
                                  domain = new URL(post.media_url).hostname.replace(/^www\./, '');
                                } catch (_) {}

                                return (
                                  <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                    {/* Top Blue Part (User's words) */}
                                    {(post.content || (post.hashtags && post.hashtags.length > 0)) && (
                                      <div className="bg-[#3297EE] p-5 text-white">
                                        <div className="flex-1 min-w-0">
                                          {post.content && (
                                            isCodeContent(post.content, post.media_url) ? (
                                              <PostCodeBlock content={post.content} mediaUrl={post.media_url} onOpenReviewModal={setCodeReviewModal} />
                                            ) : (
                                              <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                            )
                                          )}
                                          {post.hashtags && post.hashtags.length > 0 && (
                                            <p className="mt-2 text-white/90 text-[13px]">{post.hashtags.join(' ')}</p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Bottom White Part (Link footer) */}
                                    <div className="bg-white p-5 border-t border-gray-50 flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-3 text-gray-500 truncate mr-4">
                                        <img
                                          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                                          alt="favicon"
                                          className="w-5 h-5 rounded-sm object-contain shrink-0"
                                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                        <span className="text-[14px] font-medium text-gray-700 truncate">{domain}</span>
                                      </div>
                                      
                                      <a
                                        href={post.media_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[14px] font-semibold text-gray-400 hover:text-[#3297EE] transition-colors group cursor-pointer shrink-0"
                                      >
                                        Visit Page 
                                        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#3297EE]/10 group-hover:text-[#3297EE] transition-colors">
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        );
                      })()}

                      {/* Engagement Row */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-6">
                          {/* Likes (Thumbs Up) */}
                          <button
                            onClick={() => handleLike(post.id)}
                            className="flex items-center gap-1.5 text-[12px] text-[#595959] hover:text-[#3297EE] transition-colors cursor-pointer"
                          >
                            <svg width="19" height="19" viewBox="0 0 24 24" fill={post.is_liked ? "#3297EE" : "none"} stroke={post.is_liked ? "#3297EE" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                            {post.likes_count > 0 && <span className={post.is_liked ? "text-[#3297EE] font-medium" : ""}>{post.likes_count}</span>}
                          </button>

                          {/* Comments count */}
                          <div className="flex items-center gap-1.5 text-[12px] text-[#595959]">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.74967 11.1018H10.9445V9.91432H4.74967V11.1018ZM4.74967 8.52891H14.2497V7.34141H4.74967V8.52891ZM4.74967 5.95599H14.2497V4.76849H4.74967V5.95599ZM1.58301 17.4154V2.76953C1.58301 2.45286 1.70176 2.17578 1.93926 1.93828C2.17676 1.70078 2.45384 1.58203 2.77051 1.58203H16.2288C16.5455 1.58203 16.8226 1.70078 17.0601 1.93828C17.2976 2.17578 17.4163 2.45286 17.4163 2.76953V13.0612C17.4163 13.3779 17.2976 13.6549 17.0601 13.8924C16.8226 14.1299 16.5455 14.2487 16.2288 14.2487H4.74967L1.58301 17.4154ZM4.23509 13.0612H16.2288V2.76953H2.77051V14.6445L4.23509 13.0612Z" fill="#242424" />
                            </svg>
                            {post.comments && post.comments.length > 0 && <span>{post.comments.length}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* File a claim Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenClaimModal(post)}
                            title="File a claim"
                            className="flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium text-[#737373] hover:text-red-600 hover:bg-red-50/70 rounded-lg transition-all cursor-pointer group"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-[#737373] group-hover:text-red-600 transition-colors"
                            >
                              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                              <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                            <span>File a claim</span>
                          </button>

                          {/* Bookmarks */}
                          <button
                            onClick={() => {
                              if (!currentUser) {
                                if (typeof window !== 'undefined') window.location.href = getLoginTarget();
                                return;
                              }
                              setBookmarked(!bookmarked);
                            }}
                            className="flex items-center gap-1.5 text-[12px] text-[#595959] hover:text-[#3297EE] transition-colors cursor-pointer"
                          >
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M3.95801 16.6263V3.46484C3.95801 3.14818 4.07676 2.87109 4.31426 2.63359C4.55176 2.39609 4.82884 2.27734 5.14551 2.27734H13.8538C14.1705 2.27734 14.4476 2.39609 14.6851 2.63359C14.9226 2.87109 15.0413 3.14818 15.0413 3.46484V16.6263L9.49967 14.2513L3.95801 16.6263ZM5.14551 14.8253L9.49967 12.9846L13.8538 14.8253V3.46484H5.14551V14.8253Z"
                                fill={bookmarked ? "#3297EE" : "#242424"}
                              />
                            </svg>
                          </button>

                          {/* Share Button (Standard Nodes Icon) */}
                          <button
                            type="button"
                            onClick={() => handleSharePost(post)}
                            title="Share Post"
                            className={`p-1.5 rounded-lg flex items-center gap-1.5 text-[12px] font-medium transition-all cursor-pointer ${copiedPostId === post.id
                                ? 'bg-emerald-50 text-emerald-600 scale-105 shadow-2xs'
                                : 'text-gray-600 hover:text-[#3297EE] hover:bg-gray-100'
                              }`}
                          >
                            {copiedPostId === post.id ? (
                              <>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span className="text-[11px] font-bold text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Interactive Comments List with Edit & Delete */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-gray-100">
                          {post.comments.map((c, i) => {
                            const commentId = typeof c === 'string' ? `cmt-${i}` : c.id;
                            const isOwner = currentUser && (
                              (c.user_id && c.user_id === currentUser.id) ||
                              (c.author_handle && c.author_handle === currentUser.handle) ||
                              (c.author_name && c.author_name === currentUser.name)
                            );
                            const isEditing = editingCommentId === commentId;
                            const authorName = typeof c === 'string' ? 'Researcher' : (c.author_name || c.author_handle || 'Researcher');
                            const authorAvatar = typeof c === 'string'
                              ? `https://api.dicebear.com/7.x/initials/svg?seed=Researcher`
                              : (c.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`);
                            const commentTime = c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                            return (
                              <div key={commentId || i} className="group/cmt flex items-start gap-2.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] p-2.5 rounded-xl border border-gray-100 transition-colors">
                                <img
                                  src={authorAvatar}
                                  alt={authorName}
                                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="text-[12px] font-semibold text-gray-900 truncate">{authorName}</span>
                                      {commentTime && <span className="text-[10px] text-gray-400 font-normal">{commentTime}</span>}
                                    </div>

                                    {/* Edit & Delete Actions (Visible on hover for comment owner) */}
                                    {isOwner && !isEditing && (
                                      <div className="flex items-center gap-1 opacity-0 group-hover/cmt:opacity-100 transition-opacity">
                                        <button
                                          type="button"
                                          onClick={() => handleStartEditComment(c)}
                                          className="p-1 text-gray-400 hover:text-[#3297EE] hover:bg-white rounded transition-colors cursor-pointer"
                                          title="Edit comment"
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                          </svg>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteComment(commentId, post.id)}
                                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-white rounded transition-colors cursor-pointer"
                                          title="Delete comment"
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                          </svg>
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Comment Body or Inline Editor */}
                                  {isEditing ? (
                                    <div className="mt-1.5 space-y-1.5">
                                      <input
                                        type="text"
                                        value={editingCommentText}
                                        onChange={(e) => setEditingCommentText(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSaveEditComment(commentId, post.id);
                                          if (e.key === 'Escape') handleCancelEditComment();
                                        }}
                                        className="w-full px-2.5 py-1 text-[12px] bg-white border border-[#3297EE] rounded-lg focus:outline-none shadow-xs"
                                        autoFocus
                                      />
                                      <div className="flex items-center gap-1.5 justify-end">
                                        <button
                                          type="button"
                                          onClick={handleCancelEditComment}
                                          className="px-2 py-0.5 text-[11px] text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSaveEditComment(commentId, post.id)}
                                          className="px-2.5 py-0.5 text-[11px] font-medium bg-[#3297EE] text-white rounded hover:bg-blue-600 transition-colors cursor-pointer shadow-2xs"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-[12px] text-gray-700 mt-0.5 leading-relaxed break-words">
                                      {typeof c === 'string' ? c : c.content}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Comment Input */}
                      <div className="flex items-center gap-2.5 pt-2">
                        <img
                          src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`}
                          alt="Avatar"
                          className="w-[34px] h-[34px] rounded-full object-cover shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || 'User')}`;
                          }}
                        />
                        <div className="flex-1 min-h-[36px] px-3.5 rounded-full bg-[#F3F4F6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3297EE]/40 focus-within:border-[#3297EE] border border-transparent transition-all flex items-center gap-2">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCommentInputs(prev => ({ ...prev, [post.id]: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddComment(post.id);
                              }
                            }}
                            placeholder="Write a comment... (Press Enter to post)"
                            className="w-full bg-transparent text-[12px] font-normal text-[#202020] placeholder-[#929292] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!(commentInputs[post.id] || '').trim()}
                            className="p-1 text-[#3297EE] disabled:text-gray-300 hover:scale-110 disabled:hover:scale-100 transition-all cursor-pointer disabled:cursor-not-allowed"
                            title="Post comment"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  )))}
              </div>
            </section>

            {/* ================= RIGHT COLUMN ================= */}
            <aside className="w-full lg:w-[250px] shrink-0 space-y-5 lg:sticky lg:top-6">
              {/* Activity Section */}
              <div className="bg-white rounded-[21px] p-5 shadow-xs border border-black/5 min-h-[318px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-[#202020]">Activity</h3>
                  <button className="text-[11px] text-[#888] hover:text-black transition-colors cursor-pointer">
                    See all
                  </button>
                </div>

                <div className="space-y-3.5 flex-1 flex flex-col justify-center">
                  {activities.length === 0 ? (
                    <p className="text-[13px] text-gray-400 text-center py-4">No recent activity</p>
                  ) : (
                    <div className="space-y-3.5 flex-1 justify-start">
                      {activities.map((act, idx) => (
                        <div key={act.id || idx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={act.actor_avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                              alt={act.actor_name || 'User'}
                              className="w-[37px] h-[37px] rounded-full object-cover flex-shrink-0"
                            />
                            <div className="text-[11px] leading-tight">
                              <span className="font-semibold text-[#202020] text-[12px]">{act.actor_name} </span>
                              <span className="text-[#202020]">{act.text}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Suggested For You Section */}
              <div className="bg-[#3297EE] rounded-[21px] p-5 shadow-xs border border-transparent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-medium text-white">Suggested For You</h3>
                  <button className="text-[11px] text-white/80 hover:text-white transition-colors cursor-pointer">
                    See all
                  </button>
                </div>

                <div className="space-y-3.5">
                  {suggestedUsers.length === 0 ? (
                    <p className="text-[12px] text-white/70 text-center py-4">No suggested researchers yet</p>
                  ) : (
                    suggestedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleViewProfile(user)}>
                          <img
                            src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                            alt={user.name || user.handle}
                            className="w-[37px] h-[37px] rounded-full object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
                          />
                          <div>
                            <h5 className="text-[12px] font-semibold text-white leading-none group-hover:text-blue-300 transition-colors">{user.name || user.handle}</h5>
                            <span className="text-[10px] text-white/70 mt-1 block">@{user.handle}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFollow(user.handle)}
                          className={`text-[11px] font-semibold cursor-pointer transition-colors ${followedState[user.handle]
                              ? 'text-white/60 hover:text-white'
                              : 'bg-white text-[#3297EE] hover:bg-gray-50 rounded-full px-3 py-1 shadow-sm'
                            }`}
                        >
                          {followedState[user.handle] ? 'Followed' : 'Follow'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* VIEW 3: EXPLORE */}
        {activeTab === 'explore' && (
          <div className="max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Explore Knowledge & Research</h2>
                <p className="text-[13px] text-gray-500 mt-1">Discover trending topics, public workspaces, and annotations from top researchers</p>
              </div>

              {/* Trending Topics Grid */}
              <div className="space-y-3 pt-2">
                <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Trending Research Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.length > 0 ? (
                    trendingTags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50/80 text-[#2475FC] text-[13px] font-medium border border-blue-100 hover:bg-blue-100/60 transition cursor-pointer">
                        {tag.tag} <span className="text-[11px] text-blue-400">({tag.count})</span>
                      </span>
                    ))
                  ) : (
                    ['#ArtificialIntelligence', '#MachineLearning', '#PostgreSQL', '#React19', '#NextJS', '#Supabase', '#ResearchPaper'].map((t, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-700 text-[13px] font-medium border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
                        {t}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Suggested Researchers */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Featured Researchers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedUsers.map((u, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50/80 transition">
                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleViewProfile(u)}>
                        <img
                          src={u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}`}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100 group-hover:opacity-80 transition-opacity"
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-gray-900 group-hover:text-[#2475FC] transition-colors">{u.name}</div>
                          <div className="text-[11px] text-gray-400">@{u.handle}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(u.handle)}
                        className={`text-[12px] font-semibold px-3 py-1 rounded-lg border transition ${followedState[u.handle]
                            ? 'bg-gray-100 text-gray-500 border-gray-200'
                            : 'bg-blue-50 text-[#2475FC] border-blue-200 hover:bg-blue-100'
                          }`}
                      >
                        {followedState[u.handle] ? 'Followed' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: USER PROFILE */}
        {activeTab === 'user_profile' && viewingUser && (
          <div className="max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-[24px] shadow-xs border border-gray-200/80 overflow-hidden">
              <div className="w-full h-44 sm:h-56 relative bg-gradient-to-r from-[#B9E2FE] via-[#C6EBFD] to-[#DDF0FA] overflow-hidden">
                <img
                  src={viewingUser.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-6 sm:px-8 pb-8 relative">
                <div className="flex justify-between items-start">
                  <div className="-mt-16 sm:-mt-20 relative z-10 group">
                    <img
                      src={viewingUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(viewingUser.name || 'User')}`}
                      alt={viewingUser.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-md object-cover bg-white"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => { setActiveChatId(viewingUser.id); setActiveTab('messages'); }}
                      className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      Message
                    </button>
                    <button
                      onClick={() => handleToggleFollowUser(viewingUser)}
                      className={`px-6 py-2 rounded-full font-semibold transition-all shadow-xs cursor-pointer ${viewingUser.is_following
                          ? 'border border-gray-300 bg-white text-gray-900 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                          : 'bg-[#0F1419] hover:bg-black text-white'
                        }`}
                    >
                      {viewingUser.is_following ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
                <div className="mt-4 max-w-xl">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {viewingUser.name}
                  </h1>
                  <p className="text-[15px] text-gray-500 mt-1 font-medium">@{viewingUser.handle}</p>

                  {viewingUser.bio && (
                    <div className="mt-4 text-[15px] text-gray-800 leading-relaxed max-w-2xl whitespace-pre-wrap">
                      {viewingUser.bio}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[14px] text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900">{viewingUser.following_count || 0}</span> Following
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900">{viewingUser.followers_count || 0}</span> Followers
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-b border-gray-100 flex gap-8">
                  <button className="pb-3 text-[15px] font-bold text-gray-900 border-b-2 border-[#2475FC]">Posts & Annotations</button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {sortedPosts.filter(p => p.author_id === viewingUser.id).map(post => (
                <article key={post.id} className="bg-white rounded-[21px] p-5 shadow-xs border border-black/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.author_avatar} alt={post.author_name} className="w-[37px] h-[37px] rounded-full object-cover" />
                      <div>
                        <h4 className="text-[14px] font-semibold text-[#202020] leading-none">{post.author_name}</h4>
                        <span className="text-[10px] text-[#929292] mt-1 block">{post.time || 'Recently'}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#202020]">{post.content}</p>
                  {post.media_url && (
                    <div className="rounded-xl overflow-hidden border border-gray-100">
                      <img src={post.media_url} alt="Post Attachment" className="w-full object-cover max-h-96" />
                    </div>
                  )}
                </article>
              ))}
              {sortedPosts.filter(p => p.author_id === viewingUser.id).length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  No posts yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="max-w-[1000px] mx-auto py-7 px-4 sm:px-6 h-[85vh] animate-in fade-in duration-150">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200/80 overflow-hidden flex h-full">
              {/* Contacts Sidebar */}
              <div className="w-1/3 border-r border-gray-100 bg-gray-50/30 flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Messages</h2>
                  <div className="mt-3 relative">
                    <input type="text" placeholder="Search direct messages" className="w-full h-9 pl-9 pr-3 bg-gray-100 border-none rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-2.5 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  {suggestedUsers.map((user, i) => (
                    <button
                      key={user.id || i}
                      onClick={() => setActiveChatId(user.id)}
                      className={`w-full text-left flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer ${activeChatId === user.id ? 'bg-blue-50/50 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#2475FC]' : ''}`}
                    >
                      <img src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[14px] font-semibold text-gray-900 truncate">{user.name}</h4>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">2h</span>
                        </div>
                        <p className="text-[13px] text-gray-500 truncate mt-0.5">Let's collaborate on the AI safety research!</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-white h-full relative">
                {activeChatId ? (
                  <>
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleViewProfile(suggestedUsers.find(u => u.id === activeChatId))}>
                        <img src={suggestedUsers.find(u => u.id === activeChatId)?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=Chat`} className="w-10 h-10 rounded-full object-cover group-hover:opacity-90" />
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{suggestedUsers.find(u => u.id === activeChatId)?.name || 'Researcher'}</h3>
                          <span className="text-[12px] text-[#2475FC] font-medium">Online</span>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                      {messagesChat.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2.5 rounded-2xl max-w-[70%] text-[14px] shadow-xs ${msg.sender === 'me' ? 'bg-[#2475FC] text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                            {msg.text}
                          </div>
                          <span className="text-[11px] text-gray-400 mt-1.5 px-1">{msg.timestamp}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white">
                      <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <button className="p-2 text-gray-400 hover:text-[#2475FC] transition-colors shrink-0 cursor-pointer">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                        </button>
                        <textarea
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Start a new message..."
                          className="flex-1 max-h-32 bg-transparent text-[14px] resize-none outline-none py-2 px-2 text-gray-900"
                          rows="1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <button
                          className="p-2 text-[#2475FC] hover:bg-blue-50 rounded-xl transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                          disabled={!messageInput.trim()}
                          onClick={() => handleSendMessage()}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50/50">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#2475FC] flex items-center justify-center mx-auto">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Select a message</h3>
                      <p className="text-[13px] text-gray-500 max-w-xs mx-auto">Choose from your existing conversations, start a new one, or just keep swimming.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Activity & Notifications</h2>
                  <p className="text-[13px] text-gray-500 mt-1">Real-time updates from your followers, annotations and workspaces</p>
                </div>
                <span className="text-[12px] font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                  {activities.length} Recent
                </span>
              </div>

              <div className="divide-y divide-gray-100 pt-2">
                {activities.length === 0 ? (
                  <p className="text-center py-8 text-gray-400 text-sm">No new notifications right now</p>
                ) : (
                  activities.map((act, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={act.actor_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(act.actor_name || 'User')}`}
                          alt="Actor"
                          className="w-9 h-9 rounded-full object-cover border border-gray-100"
                        />
                        <div>
                          <p className="text-[13px] text-gray-900">
                            <span className="font-semibold">{act.actor_name}</span> {act.text}
                          </p>
                          <span className="text-[10px] text-gray-400">{new Date(act.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#2475FC] bg-blue-50 px-2.5 py-1 rounded-full font-medium capitalize">
                        {act.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ONBOARDING MODAL OVERLAY */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto dir-ltr">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-[430px] w-full p-5 sm:p-6 relative animate-in fade-in zoom-in-95 duration-200 my-4">

            {/* Close Button */}
            <button
              type="button"
              onClick={dismissOnboarding}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3297EE] to-[#0066FF] flex items-center justify-center mx-auto mb-2 shadow-sm shadow-blue-500/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Complete your profile</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">Set up your account details to customize your experience</p>
            </div>

            {onboardingError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
                {onboardingError}
              </div>
            )}

            <form onSubmit={handleOnboardingSubmit} className="space-y-3.5">

              {/* Profile Picture */}
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="relative group">
                  <img
                    src={onboardingAvatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                    alt="Profile Picture"
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-3 border-white shadow-sm ring-2 ring-blue-500/20"
                    onError={(e) => {
                      e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=User';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAvatarInput(!showAvatarInput)}
                    className="absolute bottom-0 right-0 bg-[#0066FF] hover:bg-blue-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs transition-all flex items-center gap-1 border-2 border-white cursor-pointer"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Change
                  </button>
                </div>
                <span className="text-[10px] text-gray-400">Profile picture auto-filled from Google/X</span>

                {/* Custom Avatar Input & Presets */}
                {showAvatarInput && (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 space-y-2 mt-1">
                    <label className="block text-[10px] font-semibold text-gray-700">Enter Avatar Image URL:</label>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarUrl.trim()) {
                            setOnboardingAvatar(customAvatarUrl.trim());
                            setShowAvatarInput(false);
                          }
                        }}
                        className="text-[11px] bg-gray-900 text-white px-2.5 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    <div>
                      <span className="text-[9px] font-semibold text-gray-400 block mb-1">Or choose a preset avatar:</span>
                      <div className="flex items-center gap-2">
                        {[
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
                        ].map((preset, idx) => (
                          <img
                            key={idx}
                            src={preset}
                            alt="Preset avatar"
                            onClick={() => {
                              setOnboardingAvatar(preset);
                              setShowAvatarInput(false);
                            }}
                            className="w-7 h-7 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition hover:scale-105"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                  Display name
                </label>
                <input
                  type="text"
                  required
                  value={onboardingName}
                  onChange={(e) => setOnboardingName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between">
                  <span>Username <span className="text-red-500">*</span></span>
                  <span className="text-[9px] font-normal text-gray-400">(At least 3 English characters)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 font-semibold text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={onboardingHandle}
                    onChange={(e) => {
                      const clean = e.target.value
                        .toLowerCase()
                        .replace(/@gmail\.com|gmailcom/gi, '')
                        .replace(/[^a-z0-9_]/g, '');
                      setOnboardingHandle(clean);
                    }}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between">
                  <span>Bio</span>
                  <span className="text-[9px] font-normal text-gray-400">Optional</span>
                </label>
                <textarea
                  rows={2}
                  value={onboardingBio}
                  onChange={(e) => setOnboardingBio(e.target.value)}
                  placeholder="Tell people about yourself"
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition resize-none"
                />
              </div>

              {/* Choose your interests */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between">
                  <span>Choose your interests</span>
                  <span className="text-[9px] font-normal text-gray-400">Optional</span>
                </label>
                <p className="text-[10px] text-gray-500 mb-1.5">Select topics to personalize your feed:</p>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = onboardingInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${isSelected
                            ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingOnboarding}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition duration-200 cursor-pointer disabled:opacity-50 mt-1"
              >
                {isSubmittingOnboarding ? 'Saving Profile...' : 'Complete Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── FILE A CLAIM MODAL ── */}
      {claimModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" y1="22" x2="4" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">File a Claim</h3>
                  <p className="text-[11px] text-gray-500">Report issue or copyright claim regarding this post</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseClaimModal}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {claimSuccessMessage ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Claim Received</h4>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">{claimSuccessMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitClaim} className="space-y-4">
                  {/* Post Context Preview */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <span className="font-semibold text-gray-700">Author: </span>
                    <span className="text-gray-600">{claimModalPost.author_name}</span>
                    {claimModalPost.content && (
                      <p className="text-gray-500 line-clamp-2 mt-1 italic font-normal">
                        "{claimModalPost.content}"
                      </p>
                    )}
                  </div>

                  {/* Reason Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Reason for Claim
                    </label>
                    <select
                      value={claimReason}
                      onChange={(e) => setClaimReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer"
                    >
                      <option value="Misleading or False Information">Misleading or False Information</option>
                      <option value="Copyright or Intellectual Property Violation">Copyright / IP Infringement</option>
                      <option value="Inappropriate or Offensive Content">Inappropriate or Offensive Content</option>
                      <option value="Spam or Harmful Links">Spam or Harmful Links</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                      <span>Details / Description</span>
                      <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                    </label>
                    <textarea
                      rows={3}
                      value={claimDetails}
                      onChange={(e) => setClaimDetails(e.target.value)}
                      placeholder="Please provide any additional context or evidence for your claim..."
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseClaimModal}
                      className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingClaim}
                      className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {isSubmittingClaim ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Claim</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Code Review Modal Dialog */}
      {codeReviewModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setCodeReviewModal(null)}
        >
          <div 
            className="bg-[#0D1117] border border-[#30363D] rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-left"
            dir="ltr"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Mac Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#161B22] border-b border-[#30363D] select-none shrink-0">
              <div className="flex items-center gap-3">
                {/* 3 Mac Dots */}
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setCodeReviewModal(null)}
                    className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition cursor-pointer" 
                    title="Close"
                  />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block" />
                </div>
                <span className="text-[13px] font-semibold text-[#E6EDF3] font-mono flex items-center gap-2">
                  <span>{codeReviewModal.language || 'Code Review'}</span>
                  <span className="text-[11px] font-normal text-[#7D8590] px-2 py-0.5 rounded-full bg-[#21262D]">
                    {codeReviewModal.totalLines} lines
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(codeReviewModal.code);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-[#C9D1D9] hover:text-white bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] rounded-lg transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => setCodeReviewModal(null)}
                  className="w-8 h-8 flex items-center justify-center text-[#8B949E] hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                  title="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>

            {/* Code Viewer Body */}
            <div className="flex-1 overflow-auto p-4 text-[13px] leading-[22px] bg-[#0D1117] text-[#E6EDF3]">
              <div className="flex min-w-full">
                {/* Line Numbers */}
                <div className="select-none text-[#6E7681] text-right pr-4 pl-2 border-r border-[#30363D] shrink-0 font-mono text-[12px] leading-[22px]">
                  {codeReviewModal.code.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Full Code Content */}
                <div className="pl-4 pr-3 overflow-x-auto whitespace-pre font-mono flex-1">
                  {codeReviewModal.code.split('\n').map((line, i) => (
                    <div key={i} className="hover:bg-white/[0.04] px-1 -mx-1 rounded-xs">{line || ' '}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
