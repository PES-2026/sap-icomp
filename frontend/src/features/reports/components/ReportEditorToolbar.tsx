"use client";

import { ListNode } from "@lexical/list";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
  UNDO_COMMAND,
} from "lexical";
import { ComponentType, useCallback, useEffect, useState } from "react";

type ListType = "bullet" | "number";

interface ToolbarButtonProps {
  label: string;
  icon: ComponentType<{ size?: number }>;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({
  label,
  icon: Icon,
  onClick,
  active = false,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-[#dff3ec] text-[#24785f]"
          : "text-stone-600 hover:bg-stone-100"
      } disabled:cursor-not-allowed disabled:opacity-35`}
    >
      <Icon size={17} />
    </button>
  );
}

export function ReportEditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [listType, setListType] = useState<ListType>();
  const [alignment, setAlignment] = useState<ElementFormatType>("left");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));

    const anchorNode = selection.anchor.getNode();
    const listNode = $getNearestNodeOfType(anchorNode, ListNode);
    const currentListType = listNode?.getListType();
    setListType(
      currentListType === "bullet" || currentListType === "number"
        ? currentListType
        : undefined,
    );

    const blockNode = anchorNode.getTopLevelElementOrThrow();
    setAlignment(
      $isElementNode(blockNode) && blockNode.getFormatType()
        ? blockNode.getFormatType()
        : "left",
    );
  }, []);

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(updateToolbar);
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            editor.getEditorState().read(updateToolbar);
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload);
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload);
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
      ),
    [editor, updateToolbar],
  );

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatList = (type: ListType) => {
    if (listType === type) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      return;
    }

    editor.dispatchCommand(
      type === "bullet"
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND,
      undefined,
    );
  };

  const formatAlignment = (format: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1 border-b border-stone-200 bg-white/80 px-2 py-1.5"
      role="toolbar"
      aria-label="Formatação do texto"
    >
      <ToolbarButton
        label="Desfazer"
        icon={Undo2}
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      />
      <ToolbarButton
        label="Refazer"
        icon={Redo2}
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      />
      <span className="mx-1 h-5 w-px bg-stone-200" aria-hidden />
      <ToolbarButton
        label="Negrito"
        icon={Bold}
        active={isBold}
        onClick={() => formatText("bold")}
      />
      <ToolbarButton
        label="Itálico"
        icon={Italic}
        active={isItalic}
        onClick={() => formatText("italic")}
      />
      <ToolbarButton
        label="Sublinhado"
        icon={Underline}
        active={isUnderline}
        onClick={() => formatText("underline")}
      />
      <span className="mx-1 h-5 w-px bg-stone-200" aria-hidden />
      <ToolbarButton
        label="Lista com marcadores"
        icon={List}
        active={listType === "bullet"}
        onClick={() => formatList("bullet")}
      />
      <ToolbarButton
        label="Lista numerada"
        icon={ListOrdered}
        active={listType === "number"}
        onClick={() => formatList("number")}
      />
      <span className="mx-1 h-5 w-px bg-stone-200" aria-hidden />
      <ToolbarButton
        label="Alinhar à esquerda"
        icon={AlignLeft}
        active={alignment === "left" || alignment === ""}
        onClick={() => formatAlignment("left")}
      />
      <ToolbarButton
        label="Centralizar"
        icon={AlignCenter}
        active={alignment === "center"}
        onClick={() => formatAlignment("center")}
      />
      <ToolbarButton
        label="Justificar"
        icon={AlignJustify}
        active={alignment === "justify"}
        onClick={() => formatAlignment("justify")}
      />
    </div>
  );
}
