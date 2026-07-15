import * as vscode from 'vscode';
import { SidebarProvider } from './questionPage';

export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context);
	vscode.window.registerWebviewViewProvider("bedrockIaMenu", sidebarProvider);
}

export function deactivate() {}