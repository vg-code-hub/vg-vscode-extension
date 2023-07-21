/*
 * @Author: zdd
 * @Date: 2023-06-29 15:25:43
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-21 17:57:07
 * @FilePath: /vg-vscode-extension/webview-react/src/components/CodeMirror/index.tsx
 * @Description: 
 */
import React, { useEffect, useRef } from 'react';
import * as codemirror from 'codemirror';

require('script-loader!jsonlint');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/lint/lint.js');
// require('codemirror/addon/lint/javascript-lint.js');
require('codemirror/addon/lint/json-lint.js');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');
require('codemirror/addon/lint/lint.css');

interface IProps {
  domId: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  height?: string | number;
  value?: string;
  mode?: 'application/json' | 'javascript';
  lint?: boolean;
  readonly?: boolean;
}

const CodeMirror: React.FC<IProps> = ({
  domId,
  height,
  onChange,
  defaultValue,
  value = '',
  mode = 'application/json',
  lint = false,
  readonly = false,
}) => {
  const codeMirrorInstant = useRef<CodeMirror.EditorFromTextArea>();
  useEffect(() => {
    codeMirrorInstant.current = codemirror.fromTextArea(
      document.getElementById(domId) as any,
      {
        value: defaultValue || value,
        // lineNumbers: true,
        mode,
        readOnly: readonly,
        // gutters: ['CodeMirror-lint-markers'],
        lint,
        theme: 'monokai',
      },
    );
    if (height) codeMirrorInstant.current.setSize('auto', height);
    if (typeof onChange === 'function') {
      codeMirrorInstant.current.on('change', () => {
        const value = codeMirrorInstant.current!.getValue();
        if (mode === 'application/json' && lint) {
          try {
            JSON.parse(value);
            onChange(value);
          } catch (ex) { }
        } else {
          onChange(value);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (value !== codeMirrorInstant.current?.getValue()) {
      codeMirrorInstant.current?.setValue(value);
    }
  }, [value]);
  return <textarea id={domId}></textarea>;
};
export default CodeMirror;
