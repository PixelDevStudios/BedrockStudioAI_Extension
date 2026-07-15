"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/fastest-levenshtein/mod.js
var require_mod = __commonJS({
  "node_modules/fastest-levenshtein/mod.js"(exports2) {
    "use strict";
    exports2.__esModule = true;
    exports2.distance = exports2.closest = void 0;
    var peq = new Uint32Array(65536);
    var myers_32 = function(a, b) {
      var n = a.length;
      var m = b.length;
      var lst = 1 << n - 1;
      var pv = -1;
      var mv = 0;
      var sc = n;
      var i = n;
      while (i--) {
        peq[a.charCodeAt(i)] |= 1 << i;
      }
      for (i = 0; i < m; i++) {
        var eq = peq[b.charCodeAt(i)];
        var xv = eq | mv;
        eq |= (eq & pv) + pv ^ pv;
        mv |= ~(eq | pv);
        pv &= eq;
        if (mv & lst) {
          sc++;
        }
        if (pv & lst) {
          sc--;
        }
        mv = mv << 1 | 1;
        pv = pv << 1 | ~(xv | mv);
        mv &= xv;
      }
      i = n;
      while (i--) {
        peq[a.charCodeAt(i)] = 0;
      }
      return sc;
    };
    var myers_x = function(b, a) {
      var n = a.length;
      var m = b.length;
      var mhc = [];
      var phc = [];
      var hsize = Math.ceil(n / 32);
      var vsize = Math.ceil(m / 32);
      for (var i = 0; i < hsize; i++) {
        phc[i] = -1;
        mhc[i] = 0;
      }
      var j = 0;
      for (; j < vsize - 1; j++) {
        var mv_1 = 0;
        var pv_1 = -1;
        var start_1 = j * 32;
        var vlen_1 = Math.min(32, m) + start_1;
        for (var k = start_1; k < vlen_1; k++) {
          peq[b.charCodeAt(k)] |= 1 << k;
        }
        for (var i = 0; i < n; i++) {
          var eq = peq[a.charCodeAt(i)];
          var pb = phc[i / 32 | 0] >>> i & 1;
          var mb = mhc[i / 32 | 0] >>> i & 1;
          var xv = eq | mv_1;
          var xh = ((eq | mb) & pv_1) + pv_1 ^ pv_1 | eq | mb;
          var ph = mv_1 | ~(xh | pv_1);
          var mh = pv_1 & xh;
          if (ph >>> 31 ^ pb) {
            phc[i / 32 | 0] ^= 1 << i;
          }
          if (mh >>> 31 ^ mb) {
            mhc[i / 32 | 0] ^= 1 << i;
          }
          ph = ph << 1 | pb;
          mh = mh << 1 | mb;
          pv_1 = mh | ~(xv | ph);
          mv_1 = ph & xv;
        }
        for (var k = start_1; k < vlen_1; k++) {
          peq[b.charCodeAt(k)] = 0;
        }
      }
      var mv = 0;
      var pv = -1;
      var start = j * 32;
      var vlen = Math.min(32, m - start) + start;
      for (var k = start; k < vlen; k++) {
        peq[b.charCodeAt(k)] |= 1 << k;
      }
      var score = m;
      for (var i = 0; i < n; i++) {
        var eq = peq[a.charCodeAt(i)];
        var pb = phc[i / 32 | 0] >>> i & 1;
        var mb = mhc[i / 32 | 0] >>> i & 1;
        var xv = eq | mv;
        var xh = ((eq | mb) & pv) + pv ^ pv | eq | mb;
        var ph = mv | ~(xh | pv);
        var mh = pv & xh;
        score += ph >>> m - 1 & 1;
        score -= mh >>> m - 1 & 1;
        if (ph >>> 31 ^ pb) {
          phc[i / 32 | 0] ^= 1 << i;
        }
        if (mh >>> 31 ^ mb) {
          mhc[i / 32 | 0] ^= 1 << i;
        }
        ph = ph << 1 | pb;
        mh = mh << 1 | mb;
        pv = mh | ~(xv | ph);
        mv = ph & xv;
      }
      for (var k = start; k < vlen; k++) {
        peq[b.charCodeAt(k)] = 0;
      }
      return score;
    };
    var distance2 = function(a, b) {
      if (a.length < b.length) {
        var tmp = b;
        b = a;
        a = tmp;
      }
      if (b.length === 0) {
        return a.length;
      }
      if (a.length <= 32) {
        return myers_32(a, b);
      }
      return myers_x(a, b);
    };
    exports2.distance = distance2;
    var closest2 = function(str, arr) {
      var min_distance = Infinity;
      var min_index = 0;
      for (var i = 0; i < arr.length; i++) {
        var dist = distance2(str, arr[i]);
        if (dist < min_distance) {
          min_distance = dist;
          min_index = i;
        }
      }
      return arr[min_index];
    };
    exports2.closest = closest2;
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// src/questionPage.ts
var import_fastest_levenshtein = __toESM(require_mod());
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var jsonPath = path.join(__dirname, "responses", "responses-extended.json");
var responses = JSON.parse(
  fs.readFileSync(jsonPath, "utf8")
);
var titles = responses.res.words;
async function searchAnswer(question) {
  const words = (0, import_fastest_levenshtein.closest)(
    question.toLowerCase(),
    titles
  );
  const dist = (0, import_fastest_levenshtein.distance)(
    question.toLowerCase(),
    words
  );
  if (dist > 8) {
    return `N\xE3o entendi sua pergunta, ${dist}`;
  }
  const answer = responses.res[words];
  return answer;
}
var SidebarProvider = class {
  constructor(context) {
    this.context = context;
  }
  context;
  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true
    };
    webviewView.webview.html = this.getHtml();
    webviewView.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === "question") {
          const answer = await searchAnswer(
            message.text
          );
          webviewView.webview.postMessage({
            command: "answer",
            text: answer
          });
        }
      }
    );
  }
  getHtml() {
    return (
      /* html */
      `
        <!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8" />
            </head>
            <body>
                <div class="IaAsnwers" id="answer">
                
                </div>
                <div class="questions">
                    <textArea type="text" class="textArea" placeholder="Digite sua pergunta aqui" id="input"></textArea>
                    <button class="send" id="send">
                        <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.7071 2.29292C21.9787 2.56456 22.0707 2.96779 21.9438 3.33038L15.3605 22.14C14.9117 23.4223 13.1257 23.4951 12.574 22.2537L9.90437 16.2471L17.3676 7.33665C17.7595 6.86875 17.1312 6.24038 16.6633 6.63229L7.75272 14.0956L1.74631 11.426C0.504876 10.8743 0.577721 9.08834 1.85999 8.63954L20.6696 2.05617C21.0322 1.92926 21.4354 2.02128 21.7071 2.29292Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </body>
            <style>
                body{
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    padding: 10px;
                    height: calc(100vh - 24px);
                    width: 96%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                .IaAsnwers {
                    position: absolute;
                    top: 0;
                    height: 85%;
                    width: 95%;
                    margin-left: 3%;
                    white-space: pre-wrap;
                    overflow-y: auto;
                }
                .questions {
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 6px;
                    width: 95%;
                    height: 120px;
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 6px;
                    bottom: 1%;
                    margin-left: 4%;
                }
                .textArea{
                    position: absolute;
                    width: 95%;
                    height: 70%;
                    flex: 1;
                    background: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: none;
                    padding: 5px;
                    outline: none;
                    font-size: 12px;
                    top: 0;
                }
                .send {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    background: var(--vscode-input-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
                    right: 0;
                    bottom: 0;
                }
                .send svg {
                    width: 16px;
                    height: 16px;
                }
            </style>
            <script>
                const vscode = acquireVsCodeApi();
                document.getElementById("send").onclick = () => {
                    const text = document.getElementById("input").value;
                    vscode.postMessage({
                        command:"question",
                        text
                    });
                    document.getElementById("input").value = "";
                };
                window.addEventListener("message", async event => {
                        if(event.data.command === "answer"){
                            const element = document.getElementById("answer");
                            element.innerText = "";
                            const text = event.data.text;
                            for(let i = 0; i < text.length; i++){
                                element.innerText += text[i];
                                await new Promise(
                                    resolve => setTimeout(resolve, 3)
                                );
                            }
                        }
                    }
                );
            </script>
        </html>
        `
    );
  }
};

// src/extension.ts
function activate(context) {
  const sidebarProvider = new SidebarProvider(context);
  vscode.window.registerWebviewViewProvider("bedrockIaMenu", sidebarProvider);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
