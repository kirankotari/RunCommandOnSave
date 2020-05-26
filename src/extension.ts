import * as vscode from 'vscode';
import {exec} from 'child_process';

const CHANNEL_NAME = "Run command on Save";
const EXTENSION_NAME = "RunCommandOnSave";
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
        vscode.window.showInformationMessage('typescript2222: '+ vscode.workspace.getConfiguration().get('RunCommandOnSave'));
        vscode.window.showInformationMessage('RunCommandOnSave config: '+ vscode.workspace.getConfiguration().get(EXTENSION_NAME));
        this.commands = <Array<ICommand>>(
            vscode.workspace.getConfiguration().get(EXTENSION_NAME)
        );
        // vscode.window.showInformationMessage('I am inside LoadConfig');
        // vscode.window.showInformationMessage('commands: '+ this.commands);
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
        // vscode.window.showInformationMessage('I am inside ExecuteCommands');
        if (this.commands.length === 0) {
            // vscode.window.showInformationMessage('commands length is 0');
            // vscode.window.showInformationMessage(' '+this.commands);
            return;
        }

        this.output.appendLine("Running command: "+ this.commands);
        this.executeCommand(this.commands);
    }
}

// "kirankotari.RunCommandOnSave": [
//     {
//       "cmd": "Run command on Save"
//     }
//   ]