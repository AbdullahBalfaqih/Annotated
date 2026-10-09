self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/index.html",
        "destination": "/"
      },
      {
        "source": "/home.html",
        "destination": "/home"
      },
      {
        "source": "/login.html",
        "destination": "/login"
      },
      {
        "source": "/auth/callback.html",
        "destination": "/auth/callback"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()