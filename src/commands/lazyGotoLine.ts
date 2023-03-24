import * as vscode from 'vscode';

export const lazyGotoLine = async () => {	
	const documentLength = vscode.window.activeTextEditor?.document.lineCount;
	if (documentLength === undefined || documentLength === null) {
		vscode.window.showErrorMessage("Line count of document could not be determined.");
		return;
	}

	const validateInput = (commandInput: string): string | undefined => {
		if (commandInput.replace(" ", "").length === 0 || !commandInput)
			return "No empty values allowed.";
	
		if (commandInput[0] !== ":")
			return "Put a `:` at the start of the input.";
		else if (!Number.isInteger(Number(commandInput.slice(1)))) 
			return "Only numbers should proceed the colon.";
	
		if (
			parseInt(commandInput.slice(1)) < 1 ||
			documentLength && parseInt(commandInput.slice(1)) > documentLength
		)
			return `Select a value between 1 and ${documentLength}.`;

		return
	} 

	const commandInput = await vscode.window.showInputBox({ 
		prompt: `Type a line number between 1 and ${documentLength}.`, 
		value: ":", 
		valueSelection: [1, 1],
		validateInput: validateInput,
	});
	if (commandInput === undefined || commandInput === null) {
		vscode.window.showErrorMessage("Unexpected error occured.");
		return;
	}

	const currentEditor = vscode.window.activeTextEditor;
	if (!currentEditor) {
		vscode.window.showErrorMessage("Could not find the active text editor to perform line goto command.");
		return;
	}

	const tarLineNum = commandInput.slice(1);
	const targetLine = currentEditor.document.lineAt(Number(tarLineNum) - 1);

	const currentSelection = currentEditor.selection;
	if (currentSelection.isEmpty) {
		currentEditor.selection = new vscode.Selection(targetLine.range.start, targetLine.range.start);
	} else {
		const cursorPosition = currentEditor.selection.active;

		vscode.window.showInformationMessage(`${currentSelection}\n ${cursorPosition}`)

		const newSelRange = ((): [vscode.Position, vscode.Position] | undefined => {
			if (cursorPosition.isBefore(currentSelection.end) === true) {
				return [currentSelection.end, targetLine.range.start];
			} else if (cursorPosition.isAfter(currentSelection.start) === true) {
				return [currentSelection.start, targetLine.range.end];
			} 
			return;
		})()!;

		currentEditor.selection = new vscode.Selection(...newSelRange);
	}

	currentEditor.revealRange(targetLine.range);
}
