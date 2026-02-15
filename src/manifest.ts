import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest(
    {
        "manifest_version": 3,
        "name": "choomame",
        "version": "1.0.0",
        "background": {
            "service_worker": "src/background/index.ts"
        },
        "options_page": "index.html"
        ,
        "action": {
            "default_popup": "src/popup/index.html"
        },
        "content_scripts": [
            {
                "matches": ["https://www.google.com/search*"],
                "js": ["src/content/index.tsx"]
            },
        ],
        "permissions": [
            "storage", "alarms"
        ]
    }
)
