import { window } from 'vscode';

const channel = window.createOutputChannel('vgcode');

export const getOutputChannel = () => channel;
