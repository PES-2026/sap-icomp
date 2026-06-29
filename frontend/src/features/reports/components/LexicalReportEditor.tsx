"use client";

import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorState } from "lexical";
import { useEffect, useRef } from "react";
import { normalizeLexicalState } from "../utils/lexicalState";
import { ReportEditorToolbar } from "./ReportEditorToolbar";

interface LexicalReportEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  hasError?: boolean;
  appearance?: "form" | "document";
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
  appearance = "form",
}: LexicalReportEditorProps) {
  const normalizedValue = normalizeLexicalState(value);
  const documentAppearance = appearance === "document";

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "PedagogicalReport",
        editable: !readOnly,
        editorState: normalizedValue,
        nodes: [ListNode, ListItemNode],
        onError: (error) => {
          throw error;
        },
        theme: {
          list: {
            listitem: "ml-1",
            nested: { listitem: "list-none" },
            ol: "ml-6 list-decimal space-y-1",
            ul: "ml-6 list-disc space-y-1",
          },
          paragraph: documentAppearance ? "mb-3 last:mb-0" : "mb-2 last:mb-0",
          text: {
            bold: "font-bold",
            italic: "italic",
            underline: "underline",
          },
        },
      }}
    >
      <div
        className={
          documentAppearance
            ? "relative"
            : `relative overflow-hidden rounded-xl border-[1.5px] ${
                hasError
                  ? "border-red-300 bg-red-50 focus-within:border-red-400"
                  : "border-[#e8e0d5] bg-[#faf9f5] hover:border-stone-300 focus-within:border-[#6bc4a6] focus-within:bg-white"
              }`
        }
      >
        {!readOnly && <ReportEditorToolbar />}
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label={placeholder}
                className={
                  documentAppearance
                    ? "report-rich-text min-h-0 text-black outline-none"
                    : "min-h-28 px-4 py-3 text-sm leading-7 text-stone-700 outline-none"
                }
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
        </div>
        {!readOnly && <HistoryPlugin />}
        <ListPlugin />
        <EditorStatePlugin value={normalizedValue} onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}
