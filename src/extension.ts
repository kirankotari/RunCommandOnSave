import * as vscode from 'vscode';
import {exec} from 'child_process';

const CHANNEL_NAME = "Run command on Save";
const EXTENSION_NAME = "kirankotari.RunCommandOnSave";

export function activate(context: vscode.ExtensionContext) {
    let extension = new RunCommandOnSave(context);
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
            extension.ExecuteCommands();
          }),
        vscode.workspace.onDidChangeConfiguration(() => {
            extension.LoadConfig();
        })
      );
}

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

    private executeCommand(commands: Array<ICommand>) {
        if (commands.length === 0){
            this.output.appendLine("Run command on Save - Done.");
            return;
        }

        let command = commands.shift();
        exec(command!.cmd).on('exit', this.executeCommand.bind(this, commands));
    }

    public ExecuteCommands() {
        if (this.commands.length === 0) {
            return;
        }

        this.output.appendLine("Running command: ");
        this.commands.forEach(element => this.output.appendLine(element.cmd));
        this.executeCommand(this.commands);
    }
}

// In workspace under settings add the following content..!
// "kirankotari.RunCommandOnSave": [
//     {
//       "cmd": "Run command on Save"
//     }
//   ]