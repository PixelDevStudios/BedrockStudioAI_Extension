import * as vscode from 'vscode';

import { closest, distance } from "fastest-levenshtein";
import * as fs from "fs";
import * as path from "path";

interface Responses {
    res: {
        words: string[];
        answers: Record<string, string>;
    };
}

const jsonPath = path.join(__dirname, "responses", "responses-extended.json");

const responses = JSON.parse(
    fs.readFileSync(jsonPath, "utf8")
) as Responses;

const titles = responses.res.words;

function normalize(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[?!.,;:()]/g, "")      // remove pontuação
        .replace(/\s+/g, " ")            // espaços duplicados
        .trim();
}

async function searchAnswer(question:string){
    const words = closest(
        question.toLowerCase(),
        titles
    );
    const dist = distance(
        question.toLowerCase(),
        words
    );
    if(dist > 8){
        return `Não entendi sua pergunta, ${dist}`;
    }
    const answer = responses.res[words as keyof typeof responses.res];
    return answer;
}

export class SidebarProvider implements vscode.WebviewViewProvider {
    constructor(private readonly context: vscode.ExtensionContext) {}

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true
        };
        webviewView.webview.html = this.getHtml();
        webviewView.webview.onDidReceiveMessage(
            async message=>{
                if(message.command === "question"){
                    const answer = await searchAnswer(
                        message.text
                    );
                    webviewView.webview.postMessage({
                        command:"answer",
                        text:answer
                    });
                }
            }
        );
    }

    private getHtml(): string {
        return /* html */`
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