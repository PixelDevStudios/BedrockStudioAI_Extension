"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = void 0;
const fastest_levenshtein_1 = require("fastest-levenshtein");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jsonPath = path.join(__dirname, "responses", "responses-extended.json");
const responses = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const titles = responses.res.words;
function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[?!.,;:()]/g, "") // remove pontuação
        .replace(/\s+/g, " ") // espaços duplicados
        .trim();
}
async function searchAnswer(question) {
    const words = (0, fastest_levenshtein_1.closest)(question.toLowerCase(), titles);
    const dist = (0, fastest_levenshtein_1.distance)(question.toLowerCase(), words);
    if (dist > 8) {
        return `Não entendi sua pergunta, ${dist}`;
    }
    const answer = responses.res[words];
    return answer;
}
class SidebarProvider {
    context;
    constructor(context) {
        this.context = context;
    }
    resolveWebviewView(webviewView) {
        webviewView.webview.options = {
            enableScripts: true
        };
        webviewView.webview.html = this.getHtml();
        webviewView.webview.onDidReceiveMessage(async (message) => {
            if (message.command === "question") {
                const answer = await searchAnswer(message.text);
                webviewView.webview.postMessage({
                    command: "answer",
                    text: answer
                });
            }
        });
    }
    getHtml() {
        return /* html */ `
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
        `;
    }
}
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=questionPage.js.map