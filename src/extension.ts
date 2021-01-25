// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import login, { LoginResult } from './login';
import { TreeNode } from './providers/BaseProvider';
import topicItemClick from './commands/topicItemClick';
import CustomProvider from './providers/CustomProvider';
import addNode from './commands/addNode';
import removeNode from './commands/removeNode';
import { EOL } from 'os';
import Global from './global'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	Global.context = context

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nga-mofish" is now active!');

	const customProvider = new CustomProvider();
	vscode.window.createTreeView('nga-custom', {
		treeDataProvider: customProvider,
		showCollapseAll: true
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let testDisposable = vscode.commands.registerCommand('nga-mofish.test', () => {
		console.log(Global.getCookie());
	});

	let cDisposable1 = vscode.commands.registerCommand('nga-mofish.login', async () => {
		const loginResult = await login();
		if (loginResult === LoginResult.success || loginResult === LoginResult.logout) {
			vscode.window.showInformationMessage('Hello VS Code from NGA-MoFish!');
		}
	});

	// 公共事件：复制链接
	let cDisposable2 = vscode.commands.registerCommand('nga-mofish.copyLink', (item: TreeNode) => vscode.env.clipboard.writeText(item.link));

	// 公共事件：复制标题和链接
	let cDisposable3 = vscode.commands.registerCommand('nga-mofish.copyTitleLink', (item: TreeNode) =>
		vscode.env.clipboard.writeText(item.label + EOL + item.link)
	);

	// 公共事件：在浏览器中打开
	let cDisposable4 = vscode.commands.registerCommand('nga-mofish.viewInBrowser', (item: TreeNode) => vscode.env.openExternal(vscode.Uri.parse(item.link)));

	// 公共事件：点击浏览帖子
	let cDisposable5 = vscode.commands.registerCommand('nga-mofish.topicItemClick', (item: TreeNode) => topicItemClick(item));

	// 自定义视图事件：添加自定义节点
	let cusDisposable1 = vscode.commands.registerCommand('nga-custom.addNode', async () => {
		const isAdd = await addNode();
		isAdd && customProvider.refreshNodeList();
	});

	// 自定义视图事件：刷新全部
	let cusDisposable2 = vscode.commands.registerCommand('nga-custom.refreshAll', () => customProvider.refreshAll());

	// 自定义视图事件：刷新当前节点
	let cusDisposable3 = vscode.commands.registerCommand('nga-custom.refreshNode', (root: TreeNode) => customProvider.refreshRoot(root));

	// 自定义视图事件：删除自定义节点
	let cusDisposable4 = vscode.commands.registerCommand('nga-custom.removeNode', (root: TreeNode) => {
		removeNode(root);
		customProvider.refreshNodeList();
	});

	context.subscriptions.push(
		testDisposable,
		cDisposable1,
		cDisposable2,
		cDisposable3,
		cDisposable4,
		cDisposable5,
		cusDisposable1,
		cusDisposable2,
		cusDisposable3,
		cusDisposable4
		);
}

// this method is called when your extension is deactivated
export function deactivate() { }
