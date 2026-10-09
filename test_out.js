"use client";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/app/home/page.jsx
  var import_react = __toESM(__require("react"), 1);
  var import_link = __toESM(__require("next/link"), 1);
  var import_supabase_js = __require("@supabase/supabase-js");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var SUPABASE_URL = "https://aaemqxlfzkkgchwhcisw.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_171z2Negckh-UAFXHg91cA_YImBzFxn";
  var supabase = (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
  function HomePage() {
    const [activeTab, setActiveTab] = (0, import_react.useState)("home");
    const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
    const [isLoadingAuth, setIsLoadingAuth] = (0, import_react.useState)(true);
    const [posts, setPosts] = (0, import_react.useState)([]);
    const [bookmarked, setBookmarked] = (0, import_react.useState)(false);
    const [postText, setPostText] = (0, import_react.useState)("");
    const [commentText, setCommentText] = (0, import_react.useState)("");
    const [isPosting, setIsPosting] = (0, import_react.useState)(false);
    const [isExtensionConnected, setIsExtensionConnected] = (0, import_react.useState)(true);
    const [workspaces, setWorkspaces] = (0, import_react.useState)([]);
    const [trendingTags, setTrendingTags] = (0, import_react.useState)([]);
    const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
    const [searchResults, setSearchResults] = (0, import_react.useState)([]);
    const [isSearching, setIsSearching] = (0, import_react.useState)(false);
    const [activities, setActivities] = (0, import_react.useState)([]);
    const [suggestedUsers, setSuggestedUsers] = (0, import_react.useState)([]);
    const [followedState, setFollowedState] = (0, import_react.useState)({});
    const [showOnboarding, setShowOnboarding] = (0, import_react.useState)(false);
    const [onboardingName, setOnboardingName] = (0, import_react.useState)("");
    const [onboardingHandle, setOnboardingHandle] = (0, import_react.useState)("");
    const [onboardingAvatar, setOnboardingAvatar] = (0, import_react.useState)("");
    const [onboardingBio, setOnboardingBio] = (0, import_react.useState)("");
    const [onboardingInterests, setOnboardingInterests] = (0, import_react.useState)([]);
    const [onboardingError, setOnboardingError] = (0, import_react.useState)("");
    const [isSubmittingOnboarding, setIsSubmittingOnboarding] = (0, import_react.useState)(false);
    const [showAvatarInput, setShowAvatarInput] = (0, import_react.useState)(false);
    const [customAvatarUrl, setCustomAvatarUrl] = (0, import_react.useState)("");
    const [profileName, setProfileName] = (0, import_react.useState)("");
    const [profileHandle, setProfileHandle] = (0, import_react.useState)("");
    const [profileHeadline, setProfileHeadline] = (0, import_react.useState)("");
    const [profileBio, setProfileBio] = (0, import_react.useState)("");
    const [profileAvatar, setProfileAvatar] = (0, import_react.useState)("");
    const [profileBanner, setProfileBanner] = (0, import_react.useState)("");
    const [supportAccess, setSupportAccess] = (0, import_react.useState)(true);
    const [isSavingProfile, setIsSavingProfile] = (0, import_react.useState)(false);
    const [profileSaveSuccess, setProfileSaveSuccess] = (0, import_react.useState)(false);
    const [profileError, setProfileError] = (0, import_react.useState)("");
    const [activeProfileTab, setActiveProfileTab] = (0, import_react.useState)("overview");
    const [showFollowersModal, setShowFollowersModal] = (0, import_react.useState)(null);
    const [followersSubTab, setFollowersSubTab] = (0, import_react.useState)("followers");
    const [followersSearchQuery, setFollowersSearchQuery] = (0, import_react.useState)("");
    const [showAvatarPicker, setShowAvatarPicker] = (0, import_react.useState)(false);
    const [showBannerPicker, setShowBannerPicker] = (0, import_react.useState)(false);
    const SEED_RESEARCHERS = [
      {
        id: "res-1",
        name: "Dr. Sarah Chen",
        handle: "sarah_ai",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        headline: "Principal AI Scientist @ DeepMind",
        bio: "Researching multi-modal reasoning, frontier architectures & agentic workflows.",
        is_following: true
      },
      {
        id: "res-2",
        name: "Tariq Mansoor",
        handle: "tariq_m",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        headline: "Systems Architect & ML Engineer",
        bio: "Building real-time neural indexing systems and knowledge extraction pipelines.",
        is_following: true
      },
      {
        id: "res-3",
        name: "Elena Rostova",
        handle: "elena_notes",
        avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
        headline: "Knowledge Graph Researcher",
        bio: "Annotating academic papers and synthesizing literature for AI agents.",
        is_following: false
      },
      {
        id: "res-4",
        name: "Alex Rivera",
        handle: "alex_r",
        avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
        headline: "Cognitive Systems Lead",
        bio: "Active knowledge curator on Annotated. Exploring memory-augmented LLMs.",
        is_following: true
      },
      {
        id: "res-5",
        name: "Omar Al-Hashimi",
        handle: "omar_ai",
        avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
        headline: "Autonomous Agents Researcher",
        bio: "Working on self-reflecting agent chains and web scraping knowledge graphs.",
        is_following: false
      }
    ];
    const [followersList, setFollowersList] = (0, import_react.useState)(SEED_RESEARCHERS);
    const [followingList, setFollowingList] = (0, import_react.useState)(SEED_RESEARCHERS.filter((u) => u.is_following));
    const AVATAR_PRESETS = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80"
    ];
    const BANNER_PRESETS = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80"
    ];
    (0, import_react.useEffect)(() => {
      if (currentUser) {
        setProfileName(currentUser.name || "");
        setProfileHandle(currentUser.handle || "");
        setProfileHeadline(currentUser.headline || "AI & Systems Researcher");
        setProfileBio(currentUser.bio || "");
        setProfileAvatar(currentUser.avatar_url || "");
        setProfileBanner(currentUser.banner_url || "");
      }
    }, [currentUser]);
    const formatJoinDate = (dateStr) => {
      if (!dateStr) return "October 2026";
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      } catch (_) {
        return "October 2026";
      }
    };
    const handleToggleFollowUser = async (targetUser) => {
      const handle = targetUser.handle;
      const isNowFollowing = !targetUser.is_following;
      setFollowersList((prev) => prev.map((u) => u.handle === handle ? { ...u, is_following: isNowFollowing } : u));
      setFollowingList((prev) => {
        if (isNowFollowing) {
          const exists = prev.some((u) => u.handle === handle);
          return exists ? prev.map((u) => u.handle === handle ? { ...u, is_following: true } : u) : [...prev, { ...targetUser, is_following: true }];
        } else {
          return prev.filter((u) => u.handle !== handle);
        }
      });
      setCurrentUser((prev) => prev ? {
        ...prev,
        followingCount: Math.max(0, (prev.followingCount || 0) + (isNowFollowing ? 1 : -1))
      } : prev);
      const token = typeof window !== "undefined" ? localStorage.getItem("annotated_token") : null;
      if (token) {
        try {
          await fetch(`http://localhost:5000/api/follows/${handle}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        } catch (_) {
        }
      }
    };
    const openFollowersModal = (tab = "followers") => {
      setFollowersSubTab(tab);
      setShowFollowersModal(tab);
    };
    const handleSaveProfile = async (e) => {
      if (e) e.preventDefault();
      setProfileError("");
      setProfileSaveSuccess(false);
      let clean = (profileHandle || "").trim().toLowerCase().replace(/@gmail\.com|gmailcom/gi, "").replace(/[^a-z0-9_]/g, "");
      if (!clean || clean.length < 3) {
        setProfileError("Username is required and must be at least 3 English characters.");
        return;
      }
      setIsSavingProfile(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("annotated_token") : null;
      try {
        if (token) {
          const res = await fetch("http://localhost:5000/api/user/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              name: profileName,
              handle: clean,
              headline: profileHeadline,
              bio: profileBio,
              avatarUrl: profileAvatar,
              bannerUrl: profileBanner,
              preferences: { support_access: supportAccess }
            })
          });
          const data = await res.json();
          if (data && data.success && data.user) {
            const updated2 = {
              ...currentUser,
              ...data.user,
              avatar_url: profileAvatar || data.user.avatar_url,
              banner_url: profileBanner || data.user.banner_url
            };
            setCurrentUser(updated2);
            localStorage.setItem("annotated_user", JSON.stringify(updated2));
            if (typeof chrome !== "undefined" && chrome.storage?.local) {
              chrome.storage.local.set({ annotated_user: updated2 });
            }
            setProfileSaveSuccess(true);
            setTimeout(() => setProfileSaveSuccess(false), 3e3);
            return;
          } else if (data && data.error) {
            throw new Error(data.error);
          }
        }
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
        localStorage.setItem("annotated_user", JSON.stringify(updated));
        if (typeof chrome !== "undefined" && chrome.storage?.local) {
          chrome.storage.local.set({ annotated_user: updated });
        }
        setProfileSaveSuccess(true);
        setTimeout(() => setProfileSaveSuccess(false), 3e3);
      } catch (err) {
        setProfileError(err.message || "Error updating profile");
      } finally {
        setIsSavingProfile(false);
      }
    };
    const handleToggleSupport = async () => {
      const nextVal = !supportAccess;
      setSupportAccess(nextVal);
      const token = typeof window !== "undefined" ? localStorage.getItem("annotated_token") : null;
      if (token) {
        try {
          await fetch("http://localhost:5000/api/user/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              preferences: { support_access: nextVal }
            })
          });
        } catch (_) {
        }
      }
    };
    const INTEREST_OPTIONS = [
      "Technology",
      "AI",
      "Web3",
      "Business",
      "Science",
      "Finance",
      "Culture",
      "Sports"
    ];
    const getLoginTarget = (query = "") => {
      if (typeof window === "undefined") return "/login" + (query ? `?${query}` : "");
      const base = window.location.hostname === "localhost" && !window.location.pathname.endsWith(".html") ? "/login" : "./login.html";
      return query ? `${base}?${query}` : base;
    };
    (0, import_react.useEffect)(() => {
      let token = typeof window !== "undefined" ? localStorage.getItem("annotated_token") : null;
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("annotated_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setCurrentUser(parsed);
            if (parsed.onboarding_completed) {
              setShowOnboarding(false);
            }
          } catch (_) {
          }
        }
      }
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");
        if (urlToken) {
          token = urlToken;
          localStorage.setItem("annotated_token", urlToken);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
      if (!token) {
        if (typeof window !== "undefined") {
          window.location.href = getLoginTarget();
        }
        return;
      }
      fetch("http://localhost:5000/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((res) => {
        if (!res.ok) throw new Error("Session invalid or expired");
        return res.json();
      }).then((data) => {
        if (data.success && data.user) {
          const fullUser = {
            ...data.user,
            notesCount: data.stats?.notesCount || 0,
            followersCount: data.stats?.followersCount || 0,
            followingCount: data.stats?.followingCount || 0
          };
          setCurrentUser(fullUser);
          if (data.workspaces && data.workspaces.length > 0) {
            setWorkspaces(data.workspaces);
          }
          localStorage.setItem("annotated_user", JSON.stringify(fullUser));
          if (fullUser.onboarding_completed) {
            setShowOnboarding(false);
          }
          setIsLoadingAuth(false);
        }
      }).catch(() => {
        if (!localStorage.getItem("annotated_user")) {
          localStorage.removeItem("annotated_token");
          if (typeof window !== "undefined") {
            window.location.href = getLoginTarget();
          }
        } else {
          setIsLoadingAuth(false);
        }
      });
      fetch("http://localhost:5000/api/posts", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((res) => res.json()).then((data) => {
        if (data.success && data.posts && data.posts.length > 0) {
          const formatted = data.posts.map((p) => ({
            id: p.id,
            author_name: p.author_name || "Annotated Researcher",
            author_handle: p.author_handle || "researcher",
            author_avatar: p.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.author_name || "User")}`,
            time: new Date(p.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            content: p.content,
            hashtags: Array.isArray(p.hashtags) ? p.hashtags : JSON.parse(p.hashtags || "[]"),
            media_url: p.media_url,
            likes_count: p.likes_count || 0,
            is_liked: Boolean(p.is_liked),
            comments: []
          }));
          setPosts(formatted);
        }
      }).catch(() => {
      });
      fetch("http://localhost:5000/api/tags/trending").then((res) => res.json()).then((data) => {
        if (data.success && data.tags) {
          setTrendingTags(data.tags);
        }
      }).catch(() => {
      });
      fetch("http://localhost:5000/api/users/suggested", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((res) => res.json()).then((data) => {
        if (data.success && data.users) {
          setSuggestedUsers(data.users);
        }
      }).catch(() => {
      });
      fetch("http://localhost:5000/api/activities", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((res) => res.json()).then((data) => {
        if (data.success && data.activities) {
          setActivities(data.activities);
        }
      }).catch(() => {
      });
      fetch("http://localhost:5000/api/user/followers", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((res) => res.json()).then((data) => {
        if (data.success && data.followers && data.followers.length > 0) {
          setFollowersList(data.followers);
        }
      }).catch(() => {
      });
      fetch("http://localhost:5000/api/user/following", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((res) => res.json()).then((data) => {
        if (data.success && data.following && data.following.length > 0) {
          setFollowingList(data.following);
        }
      }).catch(() => {
      });
      if (typeof window !== "undefined") {
        window.addEventListener("message", (event) => {
          if (event.data?.type === "ANNOTATED_EXTENSION_PONG") {
            setIsExtensionConnected(true);
          }
        });
        window.postMessage({ type: "ANNOTATED_EXTENSION_PING" }, "*");
      }
    }, []);
    (0, import_react.useEffect)(() => {
      if (!isLoadingAuth && currentUser) {
        if (currentUser.onboarding_completed) {
          setShowOnboarding(false);
          return;
        }
        setShowOnboarding(true);
        setOnboardingName(currentUser.name || "");
        let initialHandle = (currentUser.handle || "").replace(/@gmail\.com|gmailcom/gi, "");
        if (!initialHandle || initialHandle.startsWith("user_")) {
          const emailPrefix = currentUser.email ? currentUser.email.split("@")[0] : "";
          const namePrefix = currentUser.name ? currentUser.name : "";
          const baseSource = emailPrefix || namePrefix || "user";
          const base = baseSource.toLowerCase().replace(/@gmail\.com|gmailcom/gi, "").replace(/[^a-z0-9_]/g, "");
          initialHandle = base.length >= 3 ? base : "user" + Math.floor(Math.random() * 1e3);
        }
        setOnboardingHandle(initialHandle);
        setOnboardingAvatar(
          currentUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || "User")}`
        );
        setOnboardingBio(currentUser.bio || "");
        setOnboardingInterests(Array.isArray(currentUser.interests) ? currentUser.interests : []);
      } else if (currentUser?.onboarding_completed) {
        setShowOnboarding(false);
      }
    }, [currentUser, isLoadingAuth]);
    const toggleInterest = (interest) => {
      setOnboardingInterests(
        (prev) => prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
      );
    };
    const handleOnboardingSubmit = async (e) => {
      e.preventDefault();
      setOnboardingError("");
      const cleanHandle = onboardingHandle.trim().toLowerCase();
      if (!cleanHandle || cleanHandle.length < 3) {
        setOnboardingError("\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 (Username) \u0645\u0637\u0644\u0648\u0628 \u0648\u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u0642\u0644 \u0639\u0646 3 \u0623\u062D\u0631\u0641 \u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629.");
        return;
      }
      if (!/^[a-zA-Z0-9_]{3,}$/.test(cleanHandle)) {
        setOnboardingError("\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0623\u062D\u0631\u0641 \u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0623\u0648 \u0623\u0631\u0642\u0627\u0645 \u0623\u0648 \u0634\u0631\u0637\u0629 \u0633\u0641\u0644\u064A\u0629 \u0641\u0642\u0637 (3 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644).");
        return;
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("annotated_token") : null;
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
          const res = await fetch("http://localhost:5000/api/user/onboarding", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
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
          if (data && data.success && data.user) {
            Object.assign(updatedUser, data.user, { onboarding_completed: true });
          }
        }
      } catch (err) {
        console.warn("Backend onboarding update warning:", err.message);
      } finally {
        setCurrentUser(updatedUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("annotated_user", JSON.stringify(updatedUser));
          if (typeof chrome !== "undefined" && chrome.storage?.local) {
            chrome.storage.local.set({ annotated_user: updatedUser, annotated_token: token });
          }
        }
        setShowOnboarding(false);
        setIsSubmittingOnboarding(false);
      }
    };
    const handleSearch = async (term) => {
      setSearchQuery(term);
      if (!term || !term.trim()) {
        setSearchResults([]);
        return;
      }
      const token = localStorage.getItem("annotated_token");
      if (!token) return;
      setIsSearching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(term.trim())}`, {
          headers: { "Authorization": `Bearer ${token}` }
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
      const token = localStorage.getItem("annotated_token");
      if (token) {
        try {
          await fetch(`http://localhost:5000/api/follows/${name}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        } catch (_) {
        }
      }
    };
    const handleLike = async (postId = "seed-post-1") => {
      setPosts((prev) => prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            is_liked: !p.is_liked,
            likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1
          };
        }
        return p;
      }));
      const token = localStorage.getItem("annotated_token");
      if (token) {
        try {
          await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        } catch (_) {
        }
      }
    };
    const handleCreatePost = async () => {
      if (!postText.trim() || isPosting) return;
      setIsPosting(true);
      const token = localStorage.getItem("annotated_token");
      const newPostItem = {
        id: "local-" + Date.now(),
        author_name: currentUser.name,
        author_handle: currentUser.handle,
        author_avatar: currentUser.avatar_url,
        time: "Just now",
        content: postText.trim(),
        hashtags: ["#Annotated", "#WorkspaceNotes"],
        media_url: null,
        likes_count: 0,
        is_liked: false,
        comments: []
      };
      setPosts((prev) => [newPostItem, ...prev]);
      setPostText("");
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              content: newPostItem.content,
              hashtags: newPostItem.hashtags
            })
          });
          const data = await res.json();
          if (data.success && data.post) {
            setPosts((prev) => prev.map((p) => p.id === newPostItem.id ? { ...p, id: data.post.id } : p));
          }
        } catch (_) {
        }
      }
      setIsPosting(false);
    };
    const handleAddComment = async (e, postId = "seed-post-1") => {
      if (e.key === "Enter" && commentText.trim()) {
        const text = commentText.trim();
        setCommentText("");
        setPosts((prev) => prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...p.comments || [], text]
            };
          }
          return p;
        }));
        const token = localStorage.getItem("annotated_token");
        if (token) {
          try {
            await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ content: text })
            });
          } catch (_) {
          }
        }
      }
    };
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (_) {
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("annotated_token") : null;
      if (token) {
        try {
          await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        } catch (_) {
        }
      }
      if (typeof window !== "undefined") {
        try {
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && (k.startsWith("annotated_") || k.startsWith("sb-") || k.includes("supabase"))) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k));
          sessionStorage.clear();
        } catch (_) {
        }
        if (typeof chrome !== "undefined" && chrome.storage?.local) {
          chrome.storage.local.remove(["annotated_token", "annotated_user", "annotated_refresh_token"]);
        }
        window.location.href = getLoginTarget("logout=true");
      }
    };
    if (isLoadingAuth || !currentUser) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-[#F3F3F3] flex items-center justify-center font-poppins", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-7 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 border-3 border-[#3297EE] border-t-transparent rounded-full animate-spin" }) }) });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-h-screen bg-[#F8F9FA] text-black font-poppins selection:bg-blue-600 selection:text-white", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "hidden lg:flex fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-[#EAEAEA] flex-col justify-between p-4 z-40 shadow-[1px_0_4px_0_rgba(0,0,0,0.02)]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_link.default, { href: "/", className: "flex items-center gap-2.5 px-2 py-1.5 hover:opacity-85 transition-opacity", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "img",
              {
                src: "https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40",
                alt: "Annotated",
                className: "w-6 h-6 object-contain"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[17px] font-semibold text-[#1F2937] tracking-tight", children: "Annotated" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2.5 h-[38px] px-3 rounded-[12px] bg-[#F1F3F5] text-[#909090] focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 19 19", fill: "none", className: "shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15.7542 16.6055L10.549 11.4003C10.1531 11.7433 9.69132 12.0105 9.16354 12.2018C8.63576 12.3931 8.075 12.4888 7.48125 12.4888C6.05625 12.4888 4.84896 11.994 3.85937 11.0044C2.86979 10.0148 2.375 8.82075 2.375 7.42214C2.375 6.02352 2.86979 4.82943 3.85937 3.83984C4.84896 2.85026 6.04965 2.35547 7.46146 2.35547C8.86007 2.35547 10.0509 2.85026 11.0339 3.83984C12.0168 4.82943 12.5083 6.02352 12.5083 7.42214C12.5083 7.9895 12.416 8.53707 12.2312 9.06484C12.0465 9.59262 11.7694 10.0874 11.4 10.5492L16.625 15.7346L15.7542 16.6055ZM7.46146 11.3013C8.53021 11.3013 9.44062 10.922 10.1927 10.1633C10.9448 9.4046 11.3208 8.49089 11.3208 7.42214C11.3208 6.35339 10.9448 5.43967 10.1927 4.68099C9.44062 3.92231 8.53021 3.54297 7.46146 3.54297C6.37951 3.54297 5.4592 3.92231 4.70052 4.68099C3.94184 5.43967 3.5625 6.35339 3.5625 7.42214C3.5625 8.49089 3.94184 9.4046 4.70052 10.1633C5.4592 10.922 6.37951 11.3013 7.46146 11.3013Z", fill: "#939393" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "input",
                {
                  type: "text",
                  value: searchQuery,
                  onChange: (e) => handleSearch(e.target.value),
                  placeholder: "Search notes...",
                  className: "w-full bg-transparent text-[12px] font-normal text-black placeholder-[#94A3B8] focus:outline-none"
                }
              ),
              searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => {
                setSearchQuery("");
                setSearchResults([]);
              }, className: "text-xs text-gray-400 hover:text-black", children: "\u2715" })
            ] }),
            searchResults.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute left-0 top-[44px] w-[260px] bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 z-50 space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider", children: "Search Results" }),
              searchResults.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-2 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-colors text-left", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600", children: r.type }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[12px] font-medium text-gray-800 truncate", children: r.title })
                ] }),
                r.snippet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[11px] text-gray-500 truncate mt-0.5", children: r.snippet })
              ] }, i))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { className: "space-y-1 pt-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setActiveTab("home"),
                className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === "home" ? "bg-[#EDF5FF] text-[#2475FC] font-semibold" : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === "home" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-500"}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.16699 16.625V7.125L9.50033 2.375L15.8337 7.125V16.625H11.0837V11.0833H7.91699V16.625H3.16699Z", fill: activeTab === "home" ? "#2475FC" : "#94A3B8" }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[13px]", children: "Home" })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setActiveTab("explore"),
                className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === "explore" ? "bg-[#EDF5FF] text-[#2475FC] font-semibold" : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === "explore" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-500"}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.99655 13.0018L11.3403 11.3591L12.983 6.01536L7.63926 7.65807L5.99655 13.0018ZM9.49492 10.2904C9.27379 10.2904 9.08735 10.2129 8.93561 10.058C8.78388 9.90324 8.70801 9.71522 8.70801 9.49395C8.70801 9.27281 8.78546 9.08637 8.94036 8.93464C9.09513 8.7829 9.28315 8.70703 9.50442 8.70703C9.72556 8.70703 9.912 8.78448 10.0637 8.93939C10.2155 9.09416 10.2913 9.28218 10.2913 9.50345C10.2913 9.72459 10.2139 9.91102 10.059 10.0628C9.90422 10.2145 9.7162 10.2904 9.49492 10.2904ZM9.50502 17.4154C8.41331 17.4154 7.38744 17.2076 6.42741 16.7919C5.46725 16.3763 4.62763 15.8089 3.90853 15.0898C3.18943 14.3707 2.62207 13.5307 2.20645 12.5696C1.79082 11.6085 1.58301 10.5816 1.58301 9.4888C1.58301 8.39604 1.79082 7.36912 2.20645 6.40803C2.62207 5.44695 3.18943 4.61016 3.90853 3.89766C4.62763 3.18516 5.46772 2.62109 6.4288 2.20547C7.38988 1.78984 8.41681 1.58203 9.50957 1.58203C10.6023 1.58203 11.6293 1.78984 12.5903 2.20547C13.5514 2.62109 14.3882 3.18516 15.1007 3.89766C15.8132 4.61016 16.3773 5.448 16.7929 6.4112C17.2085 7.37439 17.4163 8.40178 17.4163 9.4987C17.4163 10.5938 17.2085 11.623 16.7929 12.5862C16.3773 13.5494 15.8132 14.3872 15.1007 15.0997C14.3882 15.8122 13.5504 16.3763 12.5872 16.7919C11.624 17.2076 10.5948 17.4154 9.49967 17.4154C8.40454 17.4154 7.37537 17.2076 6.41217 16.7919ZM8.64863 16.2081V14.5852C8.18683 14.5852 7.79759 14.4136 7.48092 14.0706C7.16426 13.7275 7.00592 13.3251 7.00592 12.8633V11.9924L2.94863 7.93516C2.88266 8.19905 2.83648 8.45964 2.81009 8.71693C2.7837 8.97422 2.77051 9.23481 2.77051 9.4987C2.77051 11.214 3.32797 12.7115 4.4429 13.9914C5.55783 15.2713 6.95974 16.0102 8.64863 16.2081ZM14.4674 14.0706C15.0479 13.4372 15.4867 12.728 15.7835 11.943C16.0804 11.1579 16.2288 10.3431 16.2288 9.4987C16.2288 8.10009 15.8462 6.83012 15.0809 5.6888C14.3156 4.54748 13.2931 3.71293 12.0132 3.18516V3.54141C12.0132 4.00321 11.8549 4.40564 11.5382 4.7487C11.2215 5.09175 10.8323 5.26328 10.3705 5.26328H8.64863V6.98516C8.64863 7.20946 8.55957 7.39418 8.38145 7.53932C8.20332 7.68446 8.0021 7.75703 7.7778 7.75703H6.13509V9.4987H11.2413C11.4656 9.4987 11.6504 9.58446 11.7955 9.75599C11.9406 9.92752 12.0132 10.1254 12.0132 10.3497V12.8633H12.8643C13.2469 12.8633 13.5834 12.9754 13.8736 13.1997C14.1639 13.424 14.3618 13.7143 14.4674 14.0706Z", fill: activeTab === "explore" ? "#2475FC" : "#94A3B8" }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[13px]", children: "Explore" })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setActiveTab("messages"),
                className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === "messages" ? "bg-[#EDF5FF] text-[#2475FC] font-semibold" : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === "messages" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-500"}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M1.58301 17.4154V2.76953C1.58301 2.45286 1.70176 2.17578 1.93926 1.93828C2.17676 1.70078 2.45384 1.58203 2.77051 1.58203H16.2288C16.5455 1.58203 16.8226 1.70078 17.0601 1.93828C17.2976 2.17578 17.4163 2.45286 17.4163 2.76953V13.0612C17.4163 13.3779 17.2976 13.6549 17.0601 13.8924C16.8226 14.1299 16.5455 14.2487 16.2288 14.2487H4.74967L1.58301 17.4154ZM4.23509 13.0612H16.2288V2.76953H2.77051V14.6445L4.23509 13.0612Z", fill: activeTab === "messages" ? "#2475FC" : "#94A3B8" }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[13px]", children: "Messages" })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setActiveTab("notifications"),
                className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === "notifications" ? "bg-[#EDF5FF] text-[#2475FC] font-semibold" : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === "notifications" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-500"}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.16699 15.0404V13.8529H4.75033V7.8362C4.75033 6.72786 5.07689 5.73498 5.73001 4.85755C6.38314 3.98012 7.24408 3.42925 8.31283 3.20495V2.76953C8.31283 2.43967 8.42828 2.15929 8.65918 1.92839C8.89008 1.69748 9.17046 1.58203 9.50033 1.58203C9.83019 1.58203 10.1106 1.69748 10.3415 1.92839C10.5724 2.15929 10.6878 2.43967 10.6878 2.76953V3.20495C11.7566 3.42925 12.6175 3.98012 13.2706 4.85755C13.9238 5.73498 14.2503 6.72786 14.2503 7.8362V13.8529H15.8337V15.0404H3.16699ZM9.50033 17.4154C9.06491 17.4154 8.69217 17.2603 8.3821 16.9503C8.07203 16.6402 7.91699 16.2674 7.91699 15.832H11.0837C11.0837 16.2674 10.9286 16.6402 10.6186 16.9503C10.3085 17.2603 9.93574 17.4154 9.50033 17.4154ZM5.93783 13.8529H13.0628V7.8362C13.0628 6.84661 12.7165 6.00547 12.0238 5.31276C11.3311 4.62005 10.4899 4.2737 9.50033 4.2737C8.51074 4.2737 7.6696 4.62005 6.97689 5.31276C6.28418 6.00547 5.93783 6.84661 5.93783 7.8362V13.8529Z", fill: activeTab === "notifications" ? "#2475FC" : "#94A3B8" }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[13px]", children: "Notifications" })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setActiveTab("profile"),
                className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all cursor-pointer ${activeTab === "profile" ? "bg-[#EDF5FF] text-[#2475FC] font-semibold ring-1 ring-[#3297EE]/20 shadow-xs" : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 font-medium"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === "profile" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-500"}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0.751953 15.8336V13.9732C0.751953 13.5114 0.870703 13.0924 1.1082 12.7164C1.3457 12.3404 1.67556 12.06 2.09779 11.8753C3.06098 11.453 3.92852 11.1496 4.70039 10.9648C5.47227 10.7801 6.26723 10.6878 7.08529 10.6878C7.90334 10.6878 8.69501 10.7801 9.46029 10.9648C10.2256 11.1496 11.0898 11.453 12.053 11.8753C12.4752 12.06 12.8084 12.3404 13.0525 12.7164C13.2966 13.0924 13.4186 13.5114 13.4186 13.9732V15.8336H0.751953ZM14.6061 15.8336V13.9732C14.6061 13.1419 14.395 12.4591 13.9728 11.9247C13.5506 11.3904 12.9964 10.9582 12.3103 10.6284C13.2207 10.7339 14.0783 10.889 14.8832 11.0935C15.6881 11.298 16.3412 11.5322 16.8426 11.7961C17.278 12.0468 17.6211 12.3569 17.8717 12.7263C18.1224 13.0957 18.2478 13.5114 18.2478 13.9732V15.8336H14.6061ZM4.94779 8.64922C4.39362 8.09505 4.11654 7.38255 4.11654 6.51172C4.11654 5.64089 4.39362 4.92839 4.94779 4.37422C5.50195 3.82005 6.21445 3.54297 7.08529 3.54297C7.95612 3.54297 8.66862 3.82005 9.22279 4.37422C9.77695 4.92839 10.054 5.64089 10.054 6.51172C10.054 7.38255 9.77695 8.09505 9.22279 8.64922C8.66862 9.20339 7.95612 9.48047 7.08529 9.48047C6.21445 9.48047 5.50195 9.20339 4.94779 8.64922ZM13.379 8.64922C12.8249 9.20339 12.1124 9.48047 11.2415 9.48047C11.0964 9.48047 10.9348 9.47057 10.7566 9.45078C10.5785 9.43099 10.4169 9.39471 10.2717 9.34193C10.5884 9.01207 10.8292 8.60634 10.9941 8.12474C11.1591 7.64314 11.2415 7.10547 11.2415 6.51172C11.2415 5.91797 11.1591 5.39349 10.9941 4.93828C10.8292 4.48307 10.5884 4.06415 10.2717 3.68151C10.4169 3.64193 10.5785 3.60894 10.7566 3.58255C10.9348 3.55616 11.0964 3.54297 11.2415 3.54297C12.1124 3.54297 12.8249 3.82005 13.379 4.37422C13.9332 4.92839 14.2103 5.64089 14.2103 6.51172C14.2103 7.38255 13.9332 8.09505 13.379 8.64922ZM1.93945 14.6461H12.2311V13.9732C12.2311 13.7621 12.1684 13.5576 12.0431 13.3596C11.9178 13.1617 11.7627 13.0232 11.578 12.944C10.628 12.5218 9.82973 12.2381 9.1832 12.093C8.53668 11.9478 7.83737 11.8753 7.08529 11.8753C6.3332 11.8753 5.6306 11.9478 4.97747 12.093C4.32435 12.2381 3.52279 12.5218 2.57279 12.944C2.38806 13.0232 2.23633 13.1617 2.11758 13.3596C1.99883 13.5576 1.93945 13.7621 1.93945 13.9732V14.6461ZM8.36185 7.78828C8.69831 7.45182 8.86654 7.0263 8.86654 6.51172C8.86654 5.99714 8.69831 5.57161 8.36185 5.23516C8.02539 4.8987 7.59987 4.73047 7.08529 4.73047C6.5707 4.73047 6.14518 4.8987 5.80872 5.23516C5.47227 5.57161 5.30404 5.99714 5.30404 6.51172C5.30404 7.0263 5.47227 7.45182 5.80872 7.78828C6.14518 8.12474 6.5707 8.29297 7.08529 8.29297C7.59987 8.29297 8.02539 8.12474 8.36185 7.78828Z", fill: activeTab === "profile" ? "#2475FC" : "#94A3B8" }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[13px]", children: "Profile" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3 pt-4 border-t border-gray-100", children: [
          isExtensionConnected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Extension Connected" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              onClick: () => setActiveTab("profile"),
              className: "flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group",
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`,
                    alt: currentUser?.name || "User",
                    className: "w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0",
                    onError: (e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`;
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[13px] font-semibold text-gray-900 truncate leading-tight group-hover:text-blue-600 transition-colors", children: currentUser?.name || "User" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[11px] text-gray-400 truncate", children: [
                    "@",
                    currentUser?.handle || "user"
                  ] })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "button",
            {
              onClick: handleLogout,
              className: "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "16 17 21 12 16 7" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "21", y1: "12", x2: "9", y2: "12" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Log out" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "lg:hidden sticky top-0 z-30 w-full h-[56px] bg-white border-b border-[#EAEAEA] px-4 flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_link.default, { href: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "img",
            {
              src: "https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40",
              alt: "Annotated",
              className: "w-5 h-5 object-contain"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[15px] font-semibold text-[#202020]", children: "Annotated" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => setActiveTab("profile"),
            className: "flex items-center gap-2 cursor-pointer",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "img",
              {
                src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || "User")}`,
                alt: "User",
                className: "w-8 h-8 rounded-full object-cover border border-gray-200"
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { className: "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] px-3 py-2 flex items-center justify-around", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => setActiveTab("home"),
            className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === "home" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-400"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.16699 16.625V7.125L9.50033 2.375L15.8337 7.125V16.625H11.0837V11.0833H7.91699V16.625H3.16699Z", fill: activeTab === "home" ? "#2475FC" : "#94A3B8" }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => setActiveTab("explore"),
            className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === "explore" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-400"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.99655 13.0018L11.3403 11.3591L12.983 6.01536L7.63926 7.65807L5.99655 13.0018Z", fill: activeTab === "explore" ? "#2475FC" : "#94A3B8" }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => setActiveTab("messages"),
            className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === "messages" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-400"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M1.58301 17.4154V2.76953H16.2288V14.2487H4.74967L1.58301 17.4154Z", fill: activeTab === "messages" ? "#2475FC" : "#94A3B8" }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => setActiveTab("notifications"),
            className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === "notifications" ? "bg-[#EDF5FF] text-[#2475FC]" : "text-gray-400"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.16699 15.0404V13.8529H15.8337V15.0404H3.16699Z", fill: activeTab === "notifications" ? "#2475FC" : "#94A3B8" }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => setActiveTab("profile"),
            className: `p-2 rounded-xl transition-all cursor-pointer ${activeTab === "profile" ? "bg-[#EDF5FF] text-[#2475FC] ring-1 ring-blue-200" : "text-gray-400"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 19 19", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0.751953 15.8336V13.9732H13.4186V15.8336H0.751953ZM4.94779 8.64922C4.39362 8.09505 4.94779 4.37422 7.08529 4.37422C9.22279 4.37422 9.77695 8.64922 7.08529 8.64922Z", fill: activeTab === "profile" ? "#2475FC" : "#94A3B8" }) })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { className: "min-h-screen bg-[#F8F9FA] lg:pl-[240px] pb-24 lg:pb-10", children: [
        activeTab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[24px] shadow-xs border border-gray-200/80 overflow-hidden", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-full h-44 sm:h-56 relative bg-gradient-to-r from-[#B9E2FE] via-[#C6EBFD] to-[#DDF0FA] overflow-hidden group", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: profileBanner || currentUser?.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
                  alt: "Cover",
                  className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                  onError: (e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => setShowBannerPicker((prev) => !prev),
                  className: "absolute top-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[12px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-md cursor-pointer opacity-90 hover:opacity-100",
                  title: "Change Cover Banner",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "13", r: "4" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit banner" })
                  ]
                }
              ),
              showBannerPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute top-14 right-4 bg-white/95 backdrop-blur-md border border-gray-200 p-3 rounded-2xl shadow-xl z-20 space-y-2 animate-in fade-in zoom-in-95 duration-100", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] font-semibold text-gray-500 uppercase tracking-wider", children: "Choose Cover Theme" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center gap-2", children: BANNER_PRESETS.map((preset, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setProfileBanner(preset);
                      setShowBannerPicker(false);
                    },
                    className: "w-12 h-8 rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer",
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: preset, alt: "preset", className: "w-full h-full object-cover" })
                  },
                  idx
                )) })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "px-6 sm:px-8 pb-6 border-b border-gray-100", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start justify-between -mt-12 sm:-mt-14 mb-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative group", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      src: profileAvatar || currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`,
                      alt: currentUser?.name || "User",
                      className: "w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md object-cover bg-white ring-1 ring-black/5",
                      onError: (e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`;
                      }
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowAvatarPicker((prev) => !prev),
                      className: "absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg",
                      title: "Change Profile Photo",
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "13", r: "4" })
                      ] })
                    }
                  ),
                  showAvatarPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute left-0 top-full mt-2 bg-white border border-gray-200 p-3 rounded-2xl shadow-2xl z-30 space-y-2 animate-in fade-in zoom-in-95 duration-100 w-64", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] font-semibold text-gray-500 uppercase tracking-wider", children: "Select Avatar" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid grid-cols-3 gap-2", children: AVATAR_PRESETS.map((preset, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setProfileAvatar(preset);
                          setShowAvatarPicker(false);
                        },
                        className: "w-12 h-12 rounded-full overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: preset, alt: "preset", className: "w-full h-full object-cover" })
                      },
                      idx
                    )) })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pt-14 sm:pt-16 flex items-center gap-2.5", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    onClick: () => setActiveProfileTab((prev) => prev === "edit" ? "overview" : "edit"),
                    className: `flex items-center gap-2 px-5 py-2 rounded-full border text-[13px] sm:text-[14px] font-semibold shadow-xs transition-all cursor-pointer group active:scale-95 ${activeProfileTab === "edit" ? "bg-black text-white border-black hover:bg-gray-800" : "border-gray-300 bg-white hover:bg-gray-50 text-gray-900"}`,
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: activeProfileTab === "edit" ? "text-white" : "text-gray-500 group-hover:text-blue-600 transition-colors", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View profile edit" })
                    ]
                  }
                ) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1 mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "text-xl sm:text-2xl font-bold text-gray-900 tracking-tight", children: currentUser?.name || profileName || "Annotated Researcher" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-[#2475FC] shrink-0", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10.007 2.056c.866-.341 1.848-.341 2.714 0l.707.279c.477.188.995.275 1.51.255l.758-.029c.928-.036 1.83.376 2.457 1.121l.512.609c.348.413.784.73 1.275.927l.714.288c.875.352 1.534 1.109 1.794 2.062l.212.781c.145.534.425 1.018.817 1.411l.575.577c.704.706.993 1.724.786 2.7-.17.804-.17 1.642 0 2.446.207.976-.082 1.994-.786 2.7l-.575.577c-.392.393-.672.877-.817 1.411l-.212.781c-.26.953-.919 1.71-1.794 2.062l-.714.288c-.491.197-.927.514-1.275.927l-.512.609c-.627.745-1.529 1.157-2.457 1.121l-.758-.029c-.515-.02-1.033.067-1.51.255l-.707.279c-.866.341-1.848.341-2.714 0l-.707-.279c-.477-.188-.995-.275-1.51-.255l-.758.029c-.928.036-1.83-.376-2.457-1.121l-.512-.609c-.348-.413-.784-.73-1.275-.927l-.714-.288c-.875-.352-1.534-1.109-1.794-2.062l-.212-.781c-.145-.534-.425-1.018-.817-1.411l-.575-.577c-.704-.706-.993-1.724-.786-2.7.17-.804.17-1.642 0-2.446-.207-.976.082-1.994.786-2.7l.575-.577c.392-.393.672-.877.817-1.411l.212-.781c.26-.953.919-1.71 1.794-2.062l.714-.288c.491-.197.927-.514 1.275-.927l.512-.609c.627-.745 1.529-1.157 2.457-1.121l.758.029c.515.02 1.033-.067 1.51-.255l.707-.279zm1.096 12.355 4.95-4.95a.75.75 0 0 0-1.06-1.06l-4.42 4.419-2.07-2.07a.75.75 0 0 0-1.06 1.06l2.6 2.6a.75.75 0 0 0 1.06 0z" }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-[13px] text-gray-500 font-normal", children: [
                  "@",
                  currentUser?.handle || profileHandle || "researcher"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[14px] text-gray-700 font-normal leading-relaxed mt-2.5 max-w-2xl", children: currentUser?.bio || profileBio || currentUser?.headline || "AI & Systems Researcher. Knowledge curator on Annotated AI." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[13px] text-gray-500", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-gray-400", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "10", r: "3" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annotated AI Research Hub" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-gray-400", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[#2475FC] hover:underline cursor-pointer", children: [
                    "annotated.ai/@",
                    currentUser?.handle || "user"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-gray-400", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "Joined ",
                    formatJoinDate(currentUser?.created_at)
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-6 mt-4 pt-1 text-[14px]", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    onClick: () => openFollowersModal("following"),
                    className: "hover:underline cursor-pointer group flex items-center gap-1.5 focus:outline-none",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-gray-900 group-hover:text-blue-600 transition-colors", children: followingList.length || currentUser?.followingCount || 86 }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-500 font-normal", children: "Following" })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    onClick: () => openFollowersModal("followers"),
                    className: "hover:underline cursor-pointer group flex items-center gap-1.5 focus:outline-none",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-gray-900 group-hover:text-blue-600 transition-colors", children: followersList.length || currentUser?.followersCount || 148 }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-500 font-normal", children: "Followers" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-gray-100", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    onClick: () => setActiveProfileTab("overview"),
                    className: "p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] font-semibold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors", children: "Annotations" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[19px] sm:text-[22px] font-bold text-gray-900 mt-0.5", children: currentUser?.annotationsCount || currentUser?.notesCount || 24 }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] text-gray-400 mt-0.5", children: "Saved highlights" })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    onClick: () => setActiveProfileTab("workspaces"),
                    className: "p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] font-semibold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors", children: "Workspaces" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[19px] sm:text-[22px] font-bold text-gray-900 mt-0.5", children: workspaces.length || 4 }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] text-gray-400 mt-0.5", children: "Collections" })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    onClick: () => openFollowersModal("followers"),
                    className: "p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] font-semibold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors", children: "Followers" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[19px] sm:text-[22px] font-bold text-gray-900 mt-0.5", children: followersList.length || currentUser?.followersCount || 148 }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] text-blue-500 font-medium mt-0.5", children: "View followers \u2192" })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    onClick: () => openFollowersModal("following"),
                    className: "p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] font-semibold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors", children: "Following" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[19px] sm:text-[22px] font-bold text-gray-900 mt-0.5", children: followingList.length || currentUser?.followingCount || 86 }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] text-blue-500 font-medium mt-0.5", children: "View network \u2192" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center px-6 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveProfileTab("overview"),
                  className: `px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 ${activeProfileTab === "overview" ? "border-[#2475FC] text-[#2475FC]" : "border-transparent text-gray-500 hover:text-gray-900"}`,
                  children: [
                    "Research Feed (",
                    posts.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveProfileTab("workspaces"),
                  className: `px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 ${activeProfileTab === "workspaces" ? "border-[#2475FC] text-[#2475FC]" : "border-transparent text-gray-500 hover:text-gray-900"}`,
                  children: [
                    "Workspaces (",
                    workspaces.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveProfileTab("followers"),
                  className: `px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 ${activeProfileTab === "followers" ? "border-[#2475FC] text-[#2475FC]" : "border-transparent text-gray-500 hover:text-gray-900"}`,
                  children: [
                    "Followers & Following (",
                    followersList.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveProfileTab("edit"),
                  className: `px-4 py-3.5 text-[13px] font-semibold transition-all relative border-b-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${activeProfileTab === "edit" ? "border-[#2475FC] text-[#2475FC]" : "border-transparent text-gray-500 hover:text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20h9" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit Profile" })
                  ]
                }
              )
            ] }),
            activeProfileTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 sm:p-8 space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[15px] font-semibold text-gray-900", children: "Your Research Notes & Activities" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[12px] font-medium text-gray-400", children: [
                  posts.length,
                  " Publications"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-3 pt-2", children: posts.slice(0, 3).map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all bg-white shadow-2xs", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    src: post.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(post.author_name)}`,
                    alt: post.author_name,
                    className: "w-10 h-10 rounded-full object-cover shrink-0"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[13px] font-semibold text-gray-900 truncate", children: post.author_name }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[12px] text-gray-400", children: [
                      "@",
                      post.author_handle
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[12px] text-gray-400", children: [
                      "\xB7 ",
                      post.time
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[13px] text-gray-800 mt-1 leading-relaxed", children: post.content }),
                  post.hashtags && post.hashtags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-1.5 mt-2", children: post.hashtags.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[11px] font-medium text-[#2475FC] hover:underline cursor-pointer", children: h }, i)) })
                ] })
              ] }) }, post.id)) })
            ] }),
            activeProfileTab === "workspaces" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 sm:p-8 space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[15px] font-semibold text-gray-900", children: "Research Workspaces" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-500 mt-0.5", children: "PostgreSQL database workspace records" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[12px] font-semibold text-[#2475FC] bg-blue-50 px-2.5 py-1 rounded-full", children: [
                  workspaces.length,
                  " Collections"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2", children: workspaces.map((ws, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex items-center justify-between group", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      src: ws.icon_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120",
                      alt: ws.name,
                      className: "w-10 h-10 rounded-xl object-cover border border-gray-100 group-hover:scale-105 transition-transform"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "text-[13px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors", children: ws.name }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[11px] text-gray-400 mt-0.5", children: ws.category || "Research Collection" })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100", children: [
                  ws.annotations_count || 0,
                  " items"
                ] })
              ] }, ws.id || i)) })
            ] }),
            activeProfileTab === "followers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 sm:p-8 space-y-5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center bg-gray-100 p-1 rounded-xl", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFollowersSubTab("followers"),
                      className: `px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${followersSubTab === "followers" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"}`,
                      children: [
                        "Followers (",
                        followersList.length,
                        ")"
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFollowersSubTab("following"),
                      className: `px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${followersSubTab === "following" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"}`,
                      children: [
                        "Following (",
                        followingList.length,
                        ")"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative w-full sm:w-64", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "input",
                    {
                      type: "text",
                      value: followersSearchQuery,
                      onChange: (e) => setFollowersSearchQuery(e.target.value),
                      placeholder: "Search researchers...",
                      className: "w-full h-9 pl-8 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "absolute left-2.5 top-2.5 text-gray-400", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "divide-y divide-gray-100", children: (followersSubTab === "followers" ? followersList : followingList).filter((u) => !followersSearchQuery || u.name.toLowerCase().includes(followersSearchQuery.toLowerCase()) || u.handle.toLowerCase().includes(followersSearchQuery.toLowerCase())).map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "py-3.5 flex items-center justify-between gap-3 group", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      src: user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
                      alt: user.name,
                      className: "w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[13px] font-semibold text-gray-900 truncate hover:underline cursor-pointer", children: user.name }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "w-4 h-4 text-[#2475FC] shrink-0", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10.007 2.056c.866-.341 1.848-.341 2.714 0l.707.279c.477.188.995.275 1.51.255l.758-.029c.928-.036 1.83.376 2.457 1.121l.512.609c.348.413.784.73 1.275.927l.714.288c.875.352 1.534 1.109 1.794 2.062l.212.781c.145.534.425 1.018.817 1.411l.575.577c.704.706.993 1.724.786 2.7-.17.804-.17 1.642 0 2.446.207.976-.082 1.994-.786 2.7l-.575.577c-.392.393-.672.877-.817 1.411l-.212.781c-.26.953-.919 1.71-1.794 2.062l-.714.288c-.491.197-.927.514-1.275.927l-.512.609c-.627.745-1.529 1.157-2.457 1.121l-.758-.029c-.515-.02-1.033.067-1.51.255l-.707.279c-.866.341-1.848.341-2.714 0l-.707-.279c-.477-.188-.995-.275-1.51-.255l-.758.029c-.928.036-1.83-.376-2.457-1.121l-.512-.609c-.348-.413-.784-.73-1.275-.927l-.714-.288c-.875-.352-1.534-1.109-1.794-2.062l-.212-.781c-.145-.534-.425-1.018-.817-1.411l-.575-.577c-.704-.706-.993-1.724-.786-2.7.17-.804.17-1.642 0-2.446-.207-.976.082-1.994.786-2.7l.575-.577c.392-.393.672-.877.817-1.411l.212-.781c.26-.953.919-1.71 1.794-2.062l.714-.288c.491-.197.927-.514 1.275-.927l.512-.609c.627-.745 1.529-1.157 2.457-1.121l.758.029c.515.02 1.033-.067 1.51-.255l.707-.279zm1.096 12.355 4.95-4.95a.75.75 0 0 0-1.06-1.06l-4.42 4.419-2.07-2.07a.75.75 0 0 0-1.06 1.06l2.6 2.6a.75.75 0 0 0 1.06 0z" }) })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[12px] text-gray-500 font-normal", children: [
                      "@",
                      user.handle
                    ] }),
                    user.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-600 truncate max-w-sm mt-0.5", children: user.bio })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleToggleFollowUser(user),
                    className: `px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer shrink-0 active:scale-95 ${user.is_following ? "border border-gray-300 bg-white text-gray-900 hover:border-red-200 hover:bg-red-50 hover:text-red-600" : "bg-[#0F1419] hover:bg-black text-white"}`,
                    children: user.is_following ? "Following" : "Follow"
                  }
                )
              ] }, user.id || user.handle)) })
            ] }),
            activeProfileTab === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: handleSaveProfile, className: "divide-y divide-gray-100", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:w-[280px]", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[14px] font-semibold text-gray-900", children: "Public profile" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-500 mt-1 leading-relaxed", children: "Update your researcher profile name, username, bio, and avatar." })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1 max-w-lg space-y-3.5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-[12px] font-medium text-gray-700 block mb-1", children: "Display Name" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        type: "text",
                        value: profileName,
                        onChange: (e) => setProfileName(e.target.value),
                        placeholder: "Your Name",
                        className: "w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-[12px] font-medium text-gray-700 block mb-1", children: "Handle / Username" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#2475FC] transition-all", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "px-3.5 py-2 text-[13px] text-gray-400 bg-gray-50/80 border-r border-gray-200 select-none", children: "annotated.ai/" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          type: "text",
                          value: profileHandle,
                          onChange: (e) => setProfileHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")),
                          placeholder: "handle",
                          className: "flex-1 h-10 px-3.5 text-[13px] font-medium text-gray-900 focus:outline-none bg-transparent"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-[12px] font-medium text-gray-700 block mb-1", children: "Research Focus / Headline" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        type: "text",
                        value: profileHeadline,
                        onChange: (e) => setProfileHeadline(e.target.value),
                        placeholder: "AI & Systems Researcher",
                        className: "w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-[12px] font-medium text-gray-700 block mb-1", children: "Bio" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "textarea",
                      {
                        rows: 2,
                        value: profileBio,
                        onChange: (e) => setProfileBio(e.target.value),
                        placeholder: "AI & Systems Researcher. Knowledge curator on Annotated AI.",
                        className: "w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white resize-none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-[12px] font-medium text-gray-700 block mb-1", children: "Avatar Image URL" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        type: "text",
                        value: profileAvatar,
                        onChange: (e) => setProfileAvatar(e.target.value),
                        placeholder: "https://...",
                        className: "w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-[12px] font-medium text-gray-700 block mb-1", children: "Cover Banner URL" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        type: "text",
                        value: profileBanner,
                        onChange: (e) => setProfileBanner(e.target.value),
                        placeholder: "https://images.unsplash.com/...",
                        className: "w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2475FC] transition-all bg-white"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between pt-2", children: [
                    profileSaveSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[12px] font-medium text-emerald-600 flex items-center gap-1", children: "\u2713 Saved successfully" }),
                    profileError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[12px] font-medium text-red-500", children: profileError }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "button",
                      {
                        type: "submit",
                        disabled: isSavingProfile,
                        className: "ml-auto px-5 py-2.5 bg-[#2475FC] hover:bg-blue-600 text-white rounded-xl text-[13px] font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2",
                        children: isSavingProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saving..." })
                        ] }) : "Save changes"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:w-[280px]", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[14px] font-semibold text-gray-900", children: "Support access" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-400 mt-1 leading-relaxed", children: "Grant access to your account for technical support purposes." })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    role: "switch",
                    "aria-checked": supportAccess,
                    onClick: handleToggleSupport,
                    className: `w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${supportAccess ? "bg-[#0A0A0A]" : "bg-gray-200"}`,
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "div",
                      {
                        className: `bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${supportAccess ? "translate-x-5" : "translate-x-0"}`
                      }
                    )
                  }
                ) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:w-[280px]", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[14px] font-semibold text-gray-900", children: "Log out of all devices" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-400 mt-1 leading-relaxed", children: "Log out of all other active sessions on other devices besides this one." })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: handleLogout,
                    className: "px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-[13px] font-medium text-gray-700 shadow-2xs transition-all cursor-pointer",
                    children: "Log out"
                  }
                ) })
              ] })
            ] })
          ] }),
          showFollowersModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center bg-gray-100 p-1 rounded-xl", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    onClick: () => setFollowersSubTab("followers"),
                    className: `px-3 py-1 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${followersSubTab === "followers" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500"}`,
                    children: [
                      "Followers (",
                      followersList.length,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    onClick: () => setFollowersSubTab("following"),
                    className: `px-3 py-1 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${followersSubTab === "following" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500"}`,
                    children: [
                      "Following (",
                      followingList.length,
                      ")"
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => setShowFollowersModal(null),
                  className: "w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer",
                  children: "\u2715"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "px-5 py-2.5 border-b border-gray-100 bg-gray-50/50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "input",
                {
                  type: "text",
                  value: followersSearchQuery,
                  onChange: (e) => setFollowersSearchQuery(e.target.value),
                  placeholder: "Search researchers by name or @handle...",
                  className: "w-full h-9 pl-9 pr-3 bg-white border border-gray-200 rounded-xl text-[12px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "absolute left-3 top-2.5 text-gray-400", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
              ] })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 overflow-y-auto p-5 divide-y divide-gray-100 space-y-2", children: (followersSubTab === "followers" ? followersList : followingList).filter((u) => !followersSearchQuery || u.name.toLowerCase().includes(followersSearchQuery.toLowerCase()) || u.handle.toLowerCase().includes(followersSearchQuery.toLowerCase())).map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-3 pb-1 flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    src: user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
                    alt: user.name,
                    className: "w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[13px] font-semibold text-gray-900 truncate", children: user.name }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "w-3.5 h-3.5 text-[#2475FC] shrink-0", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10.007 2.056c.866-.341 1.848-.341 2.714 0l.707.279c.477.188.995.275 1.51.255l.758-.029c.928-.036 1.83.376 2.457 1.121l.512.609c.348.413.784.73 1.275.927l.714.288c.875.352 1.534 1.109 1.794 2.062l.212.781c.145.534.425 1.018.817 1.411l.575.577c.704.706.993 1.724.786 2.7-.17.804-.17 1.642 0 2.446.207.976-.082 1.994-.786 2.7l-.575.577c-.392.393-.672.877-.817 1.411l-.212.781c-.26.953-.919 1.71-1.794 2.062l-.714.288c-.491.197-.927.514-1.275.927l-.512.609c-.627.745-1.529 1.157-2.457 1.121l-.758-.029c-.515-.02-1.033.067-1.51.255l-.707.279c-.866.341-1.848.341-2.714 0l-.707-.279c-.477-.188-.995-.275-1.51-.255l-.758.029c-.928.036-1.83-.376-2.457-1.121l-.512-.609c-.348-.413-.784-.73-1.275-.927l-.714-.288c-.875-.352-1.534-1.109-1.794-2.062l-.212-.781c-.145-.534-.425-1.018-.817-1.411l-.575-.577c-.704-.706-.993-1.724-.786-2.7.17-.804.17-1.642 0-2.446-.207-.976.082-1.994.786-2.7l.575-.577c.392-.393.672-.877.817-1.411l.212-.781c.26-.953.919-1.71 1.794-2.062l.714-.288c.491-.197.927-.514 1.275-.927l.512-.609c.627-.745 1.529-1.157 2.457-1.121l.758.029c.515.02 1.033-.067 1.51-.255l.707-.279zm1.096 12.355 4.95-4.95a.75.75 0 0 0-1.06-1.06l-4.42 4.419-2.07-2.07a.75.75 0 0 0-1.06 1.06l2.6 2.6a.75.75 0 0 0 1.06 0z" }) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[11px] text-gray-400", children: [
                    "@",
                    user.handle
                  ] }),
                  user.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-600 truncate max-w-xs mt-0.5", children: user.bio })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => handleToggleFollowUser(user),
                  className: `px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer shrink-0 active:scale-95 ${user.is_following ? "border border-gray-300 bg-white text-gray-900 hover:border-red-200 hover:bg-red-50 hover:text-red-600" : "bg-[#0F1419] hover:bg-black text-white"}`,
                  children: user.is_following ? "Following" : "Follow"
                }
              )
            ] }, user.id || user.handle)) })
          ] }) })
        ] }),
        activeTab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-[1140px] mx-auto py-6 px-4 flex flex-col lg:flex-row items-start justify-center gap-5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "w-full lg:w-[250px] shrink-0 space-y-5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[21px] p-5 relative overflow-hidden flex flex-col items-center shadow-xs border border-black/5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full h-[82px] rounded-[15px] overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: currentUser.banner_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
                  alt: "Workspace Banner",
                  className: "w-full h-full object-cover"
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "-mt-[30px] z-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`,
                  alt: currentUser?.name || "User",
                  className: "w-[60px] h-[60px] rounded-full border-4 border-white shadow-sm object-cover",
                  onError: (e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`;
                  }
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center mt-2.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-[13px] font-semibold text-[#202020] leading-tight", children: currentUser.name }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-[12px] text-[#929292] mt-0.5", children: [
                  "@",
                  currentUser.handle
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-full mt-4 py-2.5 px-3 bg-[#FAFAFA] rounded-[12px] flex items-center justify-between text-center border border-gray-100/60", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[14px] font-medium text-[#202020] leading-none", children: currentUser.notesCount }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] text-[#878787] mt-1", children: "Notes" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-[1px] h-6 bg-gray-200" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[14px] font-medium text-[#202020] leading-none", children: (currentUser.followersCount || 0).toLocaleString() }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] text-[#878787] mt-1", children: "Followers" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-[1px] h-6 bg-gray-200" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[14px] font-medium text-[#202020] leading-none", children: currentUser.followingCount || 0 }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] text-[#878787] mt-1", children: "Following" })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  onClick: () => alert(`Active Workspace: ${currentUser.name} (@${currentUser.handle})`),
                  className: "w-full mt-4 h-[36px] bg-[#3297EE] hover:bg-blue-600 text-white rounded-[12px] text-[11px] font-normal transition-all shadow-xs flex items-center justify-center cursor-pointer",
                  children: "My Workspace"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[21px] p-5 shadow-xs border border-black/5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[13px] font-medium text-[#202020]", children: "Your Annotated" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "text-[11px] text-[#888] hover:text-black transition-colors cursor-pointer", children: "See all" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-3.5", children: workspaces.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-400 text-center py-3", children: "No workspaces yet" }) : workspaces.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between group cursor-pointer", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3.5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      src: item.icon_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
                      alt: item.name,
                      className: "w-[37px] h-[37px] rounded-full object-cover group-hover:scale-105 transition-transform"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-left", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[12px] font-medium text-[#202020] group-hover:text-[#3297EE] transition-colors block", children: item.name }),
                    item.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-gray-400 font-normal", children: item.category })
                  ] })
                ] }),
                item.annotations_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium", children: item.annotations_count })
              ] }, item.id || idx)) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "w-full lg:w-[527px] flex-1 space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[21px] p-4 shadow-xs border border-black/5 space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`,
                    alt: currentUser?.name || "Avatar",
                    className: "w-[37px] h-[37px] rounded-full object-cover flex-shrink-0",
                    onError: (e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`;
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1 h-[37px] px-4 rounded-[24px] bg-[#F1F1F1] flex items-center justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "input",
                    {
                      type: "text",
                      value: postText,
                      onChange: (e) => setPostText(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && handleCreatePost(),
                      placeholder: "Share an annotation, idea, or AI summary (Press Enter)...",
                      className: "w-full bg-transparent text-[12px] font-normal text-[#202020] placeholder-[#929292] focus:outline-none"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      onClick: handleCreatePost,
                      disabled: !postText.trim() || isPosting,
                      title: "Share to feed",
                      className: "p-1 text-[#3297EE] hover:text-blue-700 transition-colors cursor-pointer disabled:opacity-30",
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
                      ] })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between pt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-5 sm:gap-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "flex items-center gap-2 text-[12px] font-normal text-[#202020] hover:text-[#3297EE] transition-colors cursor-pointer", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.5625 16.625C3.24583 16.625 2.96875 16.5062 2.73125 16.2687C2.49375 16.0312 2.375 15.7542 2.375 15.4375V3.5625C2.375 3.24583 2.49375 2.96875 2.73125 2.73125C2.96875 2.49375 3.24583 2.375 3.5625 2.375H15.4375C15.7542 2.375 16.0312 2.49375 16.2687 2.73125C16.5062 2.96875 16.625 3.24583 16.625 3.5625V15.4375C16.625 15.7542 16.5062 16.0312 16.2687 16.2687C16.0312 16.5062 15.7542 16.625 15.4375 16.625H3.5625ZM3.5625 15.4375H15.4375V3.5625H3.5625V15.4375ZM4.67083 13.5177H14.349L11.4396 9.63854L8.82708 13.0229L6.98646 10.5094L4.67083 13.5177Z", fill: "#242424" }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Screenshot" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "flex items-center gap-2 text-[12px] font-normal text-[#202020] hover:text-[#3297EE] transition-colors cursor-pointer", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.77051 15.8346C2.45384 15.8346 2.17676 15.7159 1.93926 15.4784C1.70176 15.2409 1.58301 14.9638 1.58301 14.6471V4.35547C1.58301 4.0388 1.70176 3.76172 1.93926 3.52422C2.17676 3.28672 2.45384 3.16797 2.77051 3.16797H13.0622C13.3788 3.16797 13.6559 3.28672 13.8934 3.52422C14.1309 3.76172 14.2497 4.0388 14.2497 4.35547V8.61068L17.4163 5.44401V13.5586L14.2497 10.3919V14.6471C14.2497 14.9638 14.1309 15.2409 13.8934 15.4784C13.6559 15.7159 13.3788 15.8346 13.0622 15.8346H2.77051ZM2.77051 14.6471H13.0622V4.35547H2.77051V14.6471Z", fill: "#242424" }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Video URL" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "flex items-center gap-2 text-[12px] font-normal text-[#202020] hover:text-[#3297EE] transition-colors cursor-pointer", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8.45104 16.625V12.1719H9.63854V13.8146H16.625V15.0021H9.63854V16.625H8.45104ZM2.375 15.0021V13.8146H7.26354V15.0021H2.375ZM6.07604 11.7167V10.0937H2.375V8.90625H6.07604V7.24375H7.26354V11.7167H6.07604ZM8.45104 10.0937V8.90625H16.625V10.0937H8.45104ZM11.7365 6.82812V2.375H12.924V3.99792H16.625V5.18542H12.924V6.82812H11.7365ZM2.375 5.18542V3.99792H10.549V5.18542H2.375Z", fill: "#242424" }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Canvas Note" })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "flex items-center gap-2 text-[12px] font-normal text-[#202020] hover:text-black transition-colors cursor-pointer", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6.41217 16.7919C5.44898 16.3763 4.61113 15.8122 3.89863 15.0997C3.18613 14.3872 2.62207 13.5494 2.20645 12.5862C1.79082 11.623 1.58301 10.5938 1.58301 9.4987C1.58301 8.40356 1.79082 7.37439 2.20645 6.4112C2.62207 5.448 3.18613 4.61016 3.89863 3.89766C4.61113 3.18516 5.44898 2.62109 6.41217 2.20547C7.37537 1.78984 8.40454 1.58203 9.49967 1.58203C10.5948 1.58203 11.624 1.78984 12.5872 2.20547C13.5504 2.62109 14.3882 3.18516 15.1007 3.89766C15.8132 4.61016 16.3773 5.448 16.7929 6.4112C17.2085 7.37439 17.4163 8.40356 17.4163 9.4987C17.4163 10.5938 17.2085 11.623 16.7929 12.5862C16.3773 13.5494 15.8132 14.3872 15.1007 15.0997C14.3882 15.8122 13.5504 16.3763 12.5872 16.7919C11.624 17.2076 10.5948 17.4154 9.49967 17.4154C8.40454 17.4154 7.37537 17.2076 6.41217 16.7919ZM8.64863 16.2081V14.5852C8.18683 14.5852 7.79759 14.4136 7.48092 14.0706C7.16426 13.7275 7.00592 13.3251 7.00592 12.8633V11.9924L2.94863 7.93516C2.88266 8.19905 2.83648 8.45964 2.81009 8.71693C2.7837 8.97422 2.77051 9.23481 2.77051 9.4987C2.77051 11.214 3.32797 12.7115 4.4429 13.9914C5.55783 15.2713 6.95974 16.0102 8.64863 16.2081ZM14.4674 14.0706C15.0479 13.4372 15.4867 12.728 15.7835 11.943C16.0804 11.1579 16.2288 10.3431 16.2288 9.4987C16.2288 8.10009 15.8462 6.83012 15.0809 5.6888C14.3156 4.54748 13.2931 3.71293 12.0132 3.18516V3.54141C12.0132 4.00321 11.8549 4.40564 11.5382 4.7487C11.2215 5.09175 10.8323 5.26328 10.3705 5.26328H8.64863V6.98516C8.64863 7.20946 8.55957 7.39418 8.38145 7.53932C8.20332 7.68446 8.0021 7.75703 7.7778 7.75703H6.13509V9.4987H11.2413C11.4656 9.4987 11.6504 9.58446 11.7955 9.75599C11.9406 9.92752 12.0132 10.1254 12.0132 10.3497V12.8633H12.8643C13.2469 12.8633 13.5834 12.9754 13.8736 13.1997C14.1639 13.424 14.3618 13.7143 14.4674 14.0706Z", fill: "#242424" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Workspace" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#777] text-[11px]", children: "\u2304" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 py-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[1px] flex-1 bg-[#D1D1D1]" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[11px] font-normal text-[#929292]", children: [
                "Sort by : ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#222222] font-medium", children: "Recent" }),
                " \u2304"
              ] })
            ] }),
            posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[21px] p-8 text-center shadow-xs border border-black/5 space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-full bg-blue-50 text-[#3297EE] flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "text-sm font-semibold text-gray-900", children: "No posts yet" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Be the first to share an annotation, idea, or AI summary using the input above!" })
            ] }) : posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "bg-white rounded-[21px] p-5 shadow-xs border border-black/5 space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      src: post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
                      alt: post.author_name,
                      className: "w-[37px] h-[37px] rounded-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "text-[14px] font-semibold text-[#202020] leading-none", children: post.author_name }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-[#929292] mt-1 block", children: post.time || "Recently" })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "p-1 text-gray-400 hover:text-black transition-colors cursor-pointer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.49703 15.8346C9.23499 15.8346 9.01161 15.7414 8.82689 15.5548C8.64217 15.3682 8.5498 15.1439 8.5498 14.8819C8.5498 14.6198 8.64309 14.3964 8.82966 14.2117C9.01623 14.027 9.24053 13.9346 9.50258 13.9346C9.76462 13.9346 9.988 14.0279 10.1727 14.2145C10.3574 14.4011 10.4498 14.6254 10.4498 14.8874C10.4498 15.1494 10.3565 15.3728 10.17 15.5576C9.98338 15.7423 9.75908 15.8346 9.49703 15.8346ZM9.49703 10.4513C9.23499 10.4513 9.01161 10.358 8.82689 10.1714C8.64217 9.98488 8.5498 9.76057 8.5498 9.49853C8.5498 9.23649 8.64309 9.01311 8.82966 8.82839C9.01623 8.64366 9.24053 8.5513 9.50258 8.5513C9.76462 8.5513 9.988 8.64459 10.1727 8.83116C10.3574 9.01773 10.4498 9.24203 10.4498 9.50407C10.4498 9.76611 10.3565 9.9895 10.17 10.1742C9.98338 10.3589 9.75908 10.4513 9.49703 10.4513ZM9.49703 5.06797C9.23499 5.06797 9.01161 4.97468 8.82689 4.78811C8.64217 4.60154 8.5498 4.37724 8.5498 4.1152C8.5498 3.85316 8.64309 3.62977 8.82966 3.44505C9.01623 3.26033 9.24053 3.16797 9.50258 3.16797C9.76462 3.16797 9.988 3.26125 10.1727 3.44782C10.3574 3.63439 10.4498 3.8587 10.4498 4.12074C10.4498 4.38278 10.3565 4.60616 10.17 4.79089C9.98338 4.97561 9.75908 5.06797 9.49703 5.06797Z", fill: "#242424" }) }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-[11px] font-medium text-[#202020] leading-relaxed", children: [
                post.content,
                " ",
                post.hashtags && post.hashtags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#509FC6]", children: post.hashtags.join(" ") })
              ] }),
              post.media_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full rounded-[10px] overflow-hidden bg-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: post.media_url,
                  alt: "Workspace Visual",
                  className: "w-full h-auto object-cover max-h-[380px]"
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between pt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      onClick: () => handleLike(post.id),
                      className: "flex items-center gap-1.5 text-[12px] text-[#595959] hover:text-[#F45B69] transition-colors cursor-pointer",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "path",
                          {
                            d: "M9.49967 16.6049L8.68822 15.8727C7.28961 14.5928 6.13509 13.4878 5.22467 12.5576C4.31426 11.6273 3.58856 10.7961 3.04759 10.0638C2.50662 9.33151 2.12728 8.66849 1.90957 8.07474C1.69186 7.48099 1.58301 6.88064 1.58301 6.2737C1.58301 5.0862 1.98214 4.09332 2.7804 3.29505C3.57867 2.49679 4.56495 2.09766 5.73926 2.09766C6.49134 2.09766 7.18735 2.27578 7.82728 2.63203C8.46721 2.98828 9.02467 3.50286 9.49967 4.17578C10.0538 3.46328 10.641 2.9388 11.2611 2.60234C11.8813 2.26589 12.5476 2.09766 13.2601 2.09766C14.4344 2.09766 15.4207 2.49679 16.2189 3.29505C17.0172 4.09332 17.4163 5.0862 17.4163 6.2737C17.4163 6.88064 17.3075 7.48099 17.0898 8.07474C16.8721 8.66849 16.4927 9.33151 15.9518 10.0638C15.4108 10.7961 14.6851 11.6273 13.7747 12.5576C12.8643 13.4878 11.7097 14.5928 10.3111 15.8727L9.49967 16.6049Z",
                            fill: post.is_liked ? "#F45B69" : "#939393"
                          }
                        ) }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: post.likes_count })
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5 text-[12px] text-[#595959]", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4.74967 11.1018H10.9445V9.91432H4.74967V11.1018ZM4.74967 8.52891H14.2497V7.34141H4.74967V8.52891ZM4.74967 5.95599H14.2497V4.76849H4.74967V5.95599ZM1.58301 17.4154V2.76953C1.58301 2.45286 1.70176 2.17578 1.93926 1.93828C2.17676 1.70078 2.45384 1.58203 2.77051 1.58203H16.2288C16.5455 1.58203 16.8226 1.70078 17.0601 1.93828C17.2976 2.17578 17.4163 2.45286 17.4163 2.76953V13.0612C17.4163 13.3779 17.2976 13.6549 17.0601 13.8924C16.8226 14.1299 16.5455 14.2487 16.2288 14.2487H4.74967L1.58301 17.4154ZM4.23509 13.0612H16.2288V2.76953H2.77051V14.6445L4.23509 13.0612Z", fill: "#242424" }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: post.comments ? post.comments.length : 0 })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      onClick: () => setBookmarked(!bookmarked),
                      className: "flex items-center gap-1.5 text-[12px] text-[#595959] hover:text-[#3297EE] transition-colors cursor-pointer",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "path",
                          {
                            d: "M3.95801 16.6263V3.46484C3.95801 3.14818 4.07676 2.87109 4.31426 2.63359C4.55176 2.39609 4.82884 2.27734 5.14551 2.27734H13.8538C14.1705 2.27734 14.4476 2.39609 14.6851 2.63359C14.9226 2.87109 15.0413 3.14818 15.0413 3.46484V16.6263L9.49967 14.2513L3.95801 16.6263ZM5.14551 14.8253L9.49967 12.9846L13.8538 14.8253V3.46484H5.14551V14.8253Z",
                            fill: bookmarked ? "#3297EE" : "#242424"
                          }
                        ) }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { title: "Share", className: "p-1 text-gray-700 hover:text-blue-500 transition-colors cursor-pointer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "19", height: "19", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.375 15.8346V3.16797L17.4167 9.5013L2.375 15.8346ZM3.5625 13.994L14.3292 9.5013L3.5625 4.94922V8.27422L8.35208 9.5013L3.5625 10.6888V13.994Z", fill: "#242424" }) }) })
              ] }),
              post.comments && post.comments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-2 pt-2 border-t border-gray-100", children: post.comments.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[12px] bg-[#FAFAFA] p-2.5 rounded-xl text-gray-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold text-black mr-2", children: "Researcher:" }),
                typeof c === "string" ? c : c.content
              ] }, i)) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 pt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    src: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`,
                    alt: "Avatar",
                    className: "w-[37px] h-[37px] rounded-full object-cover flex-shrink-0",
                    onError: (e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || currentUser?.handle || "User")}`;
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-[37px] px-4 rounded-[24px] bg-[#F1F1F1] flex items-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    type: "text",
                    onKeyDown: (e) => handleAddComment(e, post.id),
                    placeholder: "Write your comment (Press enter to post)",
                    className: "w-full bg-transparent text-[12px] font-normal text-[#202020] placeholder-[#929292] focus:outline-none"
                  }
                ) })
              ] })
            ] }, post.id))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "w-full lg:w-[250px] shrink-0 space-y-5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[21px] p-5 shadow-xs border border-black/5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[13px] font-semibold text-[#202020]", children: "Activity" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "text-[11px] text-[#888] hover:text-black transition-colors cursor-pointer", children: "See all" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-3.5", children: activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-400 text-center py-4", children: "No recent activity" }) : activities.map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center justify-between gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    src: act.actor_avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User",
                    alt: act.actor_name || "User",
                    className: "w-[37px] h-[37px] rounded-full object-cover flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[11px] leading-tight", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-[#202020] text-[12px]", children: [
                    act.actor_name,
                    " "
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[#202020]", children: act.text })
                ] })
              ] }) }, act.id || idx)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[21px] p-5 shadow-xs border border-black/5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[14px] font-medium text-[#202020]", children: "Suggested For You" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "text-[11px] text-[#888] hover:text-black transition-colors cursor-pointer", children: "See all" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-3.5", children: suggestedUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[12px] text-gray-400 text-center py-4", children: "No suggested researchers yet" }) : suggestedUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      src: user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || "User")}`,
                      alt: user.name || user.handle,
                      className: "w-[37px] h-[37px] rounded-full object-cover flex-shrink-0"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", { className: "text-[12px] font-semibold text-[#202020] leading-none", children: user.name || user.handle }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[9px] text-[#929292] mt-1 block", children: [
                      "@",
                      user.handle
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    onClick: () => toggleFollow(user.handle),
                    className: `text-[12px] font-semibold cursor-pointer ${followedState[user.handle] ? "text-gray-400" : "text-[#4F9BC8] hover:underline"}`,
                    children: followedState[user.handle] ? "Followed" : "Follow"
                  }
                )
              ] }, user.id)) })
            ] })
          ] })
        ] }),
        activeTab === "explore" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Explore Knowledge & Research" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[13px] text-gray-500 mt-1", children: "Discover trending topics, public workspaces, and annotations from top researchers" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3 pt-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[12px] font-semibold text-gray-400 uppercase tracking-wider", children: "Trending Research Tags" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: trendingTags.length > 0 ? trendingTags.map((tag, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "px-3 py-1.5 rounded-xl bg-blue-50/80 text-[#2475FC] text-[13px] font-medium border border-blue-100 hover:bg-blue-100/60 transition cursor-pointer", children: [
              tag.tag,
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[11px] text-blue-400", children: [
                "(",
                tag.count,
                ")"
              ] })
            ] }, idx)) : ["#ArtificialIntelligence", "#MachineLearning", "#PostgreSQL", "#React19", "#NextJS", "#Supabase", "#ResearchPaper"].map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "px-3 py-1.5 rounded-xl bg-gray-50 text-gray-700 text-[13px] font-medium border border-gray-200 hover:bg-gray-100 transition cursor-pointer", children: t }, idx)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3 pt-4 border-t border-gray-100", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-[12px] font-semibold text-gray-400 uppercase tracking-wider", children: "Featured Researchers" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: suggestedUsers.map((u, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3.5 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50/80 transition", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    src: u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || "User")}`,
                    alt: u.name,
                    className: "w-10 h-10 rounded-full object-cover border border-gray-100"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[13px] font-semibold text-gray-900", children: u.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[11px] text-gray-400", children: [
                    "@",
                    u.handle
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  onClick: () => toggleFollow(u.handle),
                  className: `text-[12px] font-semibold px-3 py-1 rounded-lg border transition ${followedState[u.handle] ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-blue-50 text-[#2475FC] border-blue-200 hover:bg-blue-100"}`,
                  children: followedState[u.handle] ? "Followed" : "Follow"
                }
              )
            ] }, idx)) })
          ] })
        ] }) }),
        activeTab === "messages" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-[880px] mx-auto py-7 px-4 sm:px-6 animate-in fade-in duration-150", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[24px] p-8 shadow-xs border border-gray-200/80 text-center space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-14 h-14 rounded-2xl bg-blue-50 text-[#2475FC] flex items-center justify-center mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Direct Messages & Discussions" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[13px] text-gray-500 max-w-md mx-auto", children: "Connect and exchange notes with fellow researchers on Annotated. No active message threads yet." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => setActiveTab("explore"),
              className: "px-5 py-2.5 bg-[#2475FC] text-white rounded-xl text-[13px] font-medium shadow-xs hover:bg-blue-600 transition cursor-pointer",
              children: "Find Researchers to Message"
            }
          )
        ] }) }),
        activeTab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-[880px] mx-auto py-7 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Activity & Notifications" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[13px] text-gray-500 mt-1", children: "Real-time updates from your followers, annotations and workspaces" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[12px] font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100", children: [
              activities.length,
              " Recent"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "divide-y divide-gray-100 pt-2", children: activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-center py-8 text-gray-400 text-sm", children: "No new notifications right now" }) : activities.map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "py-3.5 flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: act.actor_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(act.actor_name || "User")}`,
                  alt: "Actor",
                  className: "w-9 h-9 rounded-full object-cover border border-gray-100"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-[13px] text-gray-900", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: act.actor_name }),
                  " ",
                  act.text
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-gray-400", children: new Date(act.created_at).toLocaleDateString() })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[11px] text-[#2475FC] bg-blue-50 px-2.5 py-1 rounded-full font-medium capitalize", children: act.type })
          ] }, idx)) })
        ] }) })
      ] }),
      showOnboarding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto dir-ltr", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-[430px] w-full p-5 sm:p-6 relative animate-in fade-in zoom-in-95 duration-200 my-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3297EE] to-[#0066FF] flex items-center justify-center mx-auto mb-2 shadow-sm shadow-blue-500/20", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "7", r: "4" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Complete your profile" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[11px] text-gray-500 mt-0.5", children: "Set up your account details to customize your experience" })
        ] }),
        onboardingError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center", children: onboardingError }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: handleOnboardingSubmit, className: "space-y-3.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col items-center justify-center space-y-1.5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative group", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: onboardingAvatar || "https://api.dicebear.com/7.x/initials/svg?seed=User",
                  alt: "Profile Picture",
                  className: "w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-3 border-white shadow-sm ring-2 ring-blue-500/20",
                  onError: (e) => {
                    e.target.src = "https://api.dicebear.com/7.x/initials/svg?seed=User";
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAvatarInput(!showAvatarInput),
                  className: "absolute bottom-0 right-0 bg-[#0066FF] hover:bg-blue-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs transition-all flex items-center gap-1 border-2 border-white cursor-pointer",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20h9" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })
                    ] }),
                    "Change"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-gray-400", children: "Profile picture auto-filled from Google/X" }),
            showAvatarInput && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 space-y-2 mt-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-[10px] font-semibold text-gray-700", children: "Enter Avatar Image URL:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    type: "url",
                    value: customAvatarUrl,
                    onChange: (e) => setCustomAvatarUrl(e.target.value),
                    placeholder: "https://images.unsplash.com/...",
                    className: "flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (customAvatarUrl.trim()) {
                        setOnboardingAvatar(customAvatarUrl.trim());
                        setShowAvatarInput(false);
                      }
                    },
                    className: "text-[11px] bg-gray-900 text-white px-2.5 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer",
                    children: "Apply"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] font-semibold text-gray-400 block mb-1", children: "Or choose a preset avatar:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center gap-2", children: [
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
                ].map((preset, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    src: preset,
                    alt: "Preset avatar",
                    onClick: () => {
                      setOnboardingAvatar(preset);
                      setShowAvatarInput(false);
                    },
                    className: "w-7 h-7 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition hover:scale-105"
                  },
                  idx
                )) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-[11px] font-semibold text-gray-700 mb-0.5", children: "Display name" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                type: "text",
                required: true,
                value: onboardingName,
                onChange: (e) => setOnboardingName(e.target.value),
                placeholder: "Your full name",
                className: "w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                "Username ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] font-normal text-gray-400", children: "(At least 3 English characters)" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-3 top-2 text-gray-400 font-semibold text-xs", children: "@" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "input",
                {
                  type: "text",
                  required: true,
                  value: onboardingHandle,
                  onChange: (e) => {
                    const clean = e.target.value.toLowerCase().replace(/@gmail\.com|gmailcom/gi, "").replace(/[^a-z0-9_]/g, "");
                    setOnboardingHandle(clean);
                  },
                  placeholder: "username",
                  className: "w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bio" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] font-normal text-gray-400", children: "Optional" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "textarea",
              {
                rows: 2,
                value: onboardingBio,
                onChange: (e) => setOnboardingBio(e.target.value),
                placeholder: "Tell people about yourself",
                className: "w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] transition resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "block text-[11px] font-semibold text-gray-700 mb-0.5 flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Choose your interests" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] font-normal text-gray-400", children: "Optional" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[10px] text-gray-500 mb-1.5", children: "Select topics to personalize your feed:" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-1.5", children: INTEREST_OPTIONS.map((interest) => {
              const isSelected = onboardingInterests.includes(interest);
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => toggleInterest(interest),
                  className: `text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${isSelected ? "bg-[#0066FF] text-white border-[#0066FF] shadow-xs" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`,
                  children: [
                    isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "20 6 9 17 4 12" }) }),
                    interest
                  ]
                },
                interest
              );
            }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "submit",
              disabled: isSubmittingOnboarding,
              className: "w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition duration-200 cursor-pointer disabled:opacity-50 mt-1",
              children: isSubmittingOnboarding ? "Saving Profile..." : "Complete Profile"
            }
          )
        ] })
      ] }) })
    ] });
  }
})();
