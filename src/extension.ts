import * as vscode from 'vscode';
import {exec} from 'child_process';

const CHANNEL_NAME = "Run command on Save";
const EXTENSION_NAME = "kirankotari.RunCommandOnSave";
export function activate(context: vscode.ExtensionContext) {
    let extension = new RunCommandOnSave(context);

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
            extension.ExecuteCommands(document);
        }),
        vscode.workspace.onDidChangeConfiguration(() => {
            extension.LoadConfig();
        })
      );

    console.log('Congratulations, your extension "RunCommandOnSave" is now active!');
    let disposable = vscode.commands.registerCommand('RunCommandOnSave.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from RunCommandOnSave!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

interface ICommand {
    cmd: string;
}

class RunCommandOnSave {
    output: vscode.OutputChannel;
    context: vscode.ExtensionContext;
    commands: Array<ICommand>;

    constructor(context: vscode.ExtensionContext) {
        this.output = vscode.window.createOutputChannel(CHANNEL_NAME);
        this.context = context;
        this.commands = [];
        this.LoadConfig();
    }

    public LoadConfig() {
        this.commands = <Array<ICommand>>(
            vscode.workspace.getConfiguration().get(EXTENSION_NAME)
        );
    }

    private executeCommand(commands: Array<ICommand>, document: vscode.TextDocument) {
        if (commands.length === 0){
            this.output.appendLine("Run command on Save - Done.");
            return;
        }

        // Yet to add code
    }

    public ExecuteCommands(document: vscode.TextDocument) {
    }
}