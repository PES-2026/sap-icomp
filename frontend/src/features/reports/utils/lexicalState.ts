interface SerializedLexicalNode {
  text?: string;
  children?: SerializedLexicalNode[];
}

interface SerializedLexicalState {
  root: SerializedLexicalNode;
}

const createParagraph = (text: string): SerializedLexicalNode => ({
  children: text
    ? [
        {
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
          text,
          type: "text",
          version: 1,
        } as SerializedLexicalNode,
      ]
    : [],
  direction: null,
  format: "",
  indent: 0,
  type: "paragraph",
  version: 1,
  textFormat: 0,
  textStyle: "",
} as SerializedLexicalNode);

export const plainTextToLexical = (text = ""): string =>
  JSON.stringify({
    root: {
      children: text.split(/\r?\n/).map(createParagraph),
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });

export const EMPTY_LEXICAL_STATE = plainTextToLexical();

const parseLexicalState = (value: string): SerializedLexicalState | undefined => {
  try {
    const parsed = JSON.parse(value) as Partial<SerializedLexicalState>;
    return parsed.root && Array.isArray(parsed.root.children)
      ? (parsed as SerializedLexicalState)
      : undefined;
  } catch {
    return undefined;
  }
};

export const normalizeLexicalState = (value?: string): string => {
  if (!value) return EMPTY_LEXICAL_STATE;
  return parseLexicalState(value) ? value : plainTextToLexical(value);
};

const collectText = (node: SerializedLexicalNode): string => {
  const ownText = typeof node.text === "string" ? node.text : "";
  const childrenText = node.children?.map(collectText).join(" ") ?? "";
  return `${ownText} ${childrenText}`;
};

export const getLexicalText = (value?: string): string => {
  if (!value) return "";
  const parsed = parseLexicalState(value);
  return parsed ? collectText(parsed.root).trim() : value.trim();
};

export const isLexicalEmpty = (value?: string): boolean =>
  getLexicalText(value).length === 0;
