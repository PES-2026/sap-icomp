"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorState } from "lexical";
import { useEffect, useRef } from "react";
import { normalizeLexicalState } from "../utils/lexicalState";

interface LexicalReportEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  hasError?: boolean;
}

function EditorStatePlugin({
  value,
  onChange,
}: Pick<LexicalReportEditorProps, "value" | "onChange">) {
  const [editor] = useLexicalComposerContext();
  const currentValue = useRef(normalizeLexicalState(value));

  useEffect(() => {
    const normalized = normalizeLexicalState(value);
    if (normalized === currentValue.current) return;

    currentValue.current = normalized;
    editor.setEditorState(editor.parseEditorState(normalized));
  }, [editor, value]);

  const handleChange = (editorState: EditorState) => {
    const serialized = JSON.stringify(editorState.toJSON());
    currentValue.current = serialized;
    onChange?.(serialized);
  };

  return onChange ? <OnChangePlugin onChange={handleChange} /> : null;
}

export function LexicalReportEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo desta seção",
  readOnly = false,
  hasError = false,
}: LexicalReportEditorProps) {
  const normalizedValue = normalizeLexicalState(value);

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "InterventionReport",
        editable: !readOnly,
        editorState: normalizedValue,
        onError: (error) => {
          throw error;
        },
        theme: {
          paragraph: "mb-2 last:mb-0",
        },
      }}
    >
      <div
        className={`relative rounded-xl border-[1.5px] ${
          readOnly
            ? "border-stone-200 bg-stone-50/40"
            : hasError
              ? "border-red-300 bg-red-50 focus-within:border-red-400"
              : "border-[#e8e0d5] bg-[#faf9f5] hover:border-stone-300 focus-within:border-[#6bc4a6] focus-within:bg-white"
        }`}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-label={placeholder}
              className={`min-h-28 px-4 py-3 text-sm leading-7 text-stone-700 outline-none ${
                readOnly ? "cursor-default" : ""
              }`}
            />
          }
          placeholder={
            readOnly ? null : (
              <span className="pointer-events-none absolute left-4 top-3 text-sm leading-7 text-stone-400">
                {placeholder}
              </span>
            )
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <EditorStatePlugin value={normalizedValue} onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}
