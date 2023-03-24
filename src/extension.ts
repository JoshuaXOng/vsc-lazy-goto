import * as vscode from 'vscode';
import { lazyGotoLine } from './commands/lazyGotoLine';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vsc-lazy-goto.lazyGotoLine', lazyGotoLine);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
