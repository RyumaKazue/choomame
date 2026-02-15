import { createRoot } from "react-dom/client";
import { App } from "./App";

const choomameRoot = document.createElement("div");
choomameRoot.id = "choomameRoot";

choomameRoot.style.zIndex = "127";
choomameRoot.style.position = "fixed";
choomameRoot.style.top = "0";
choomameRoot.style.left = "0";

document.body.appendChild(choomameRoot);

console.log("Choomame content script loaded");

const root = createRoot(choomameRoot);

const url = new URL(location.href);
console.log(url);

root.render(
    <div>
        <App />
    </div>

)