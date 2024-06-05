import { $applyNodeReplacement, TextNode } from 'lexical';
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
} from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    mentionEntityId: string;
  },
  SerializedTextNode
>;

function convertMentionElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const mentionId = domNode.getAttribute('data-lexical-mention-id');
  if (textContent !== null && mentionId !== null) {
    const node = $createMentionNode(mentionId, textContent);
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';
export class MentionNode extends TextNode {
  __mention: string;
  __mentionId: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(
      node.__mentionId,
      node.__mention,
      node.__text,
      node.__key
    );
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(
      serializedNode.mentionEntityId,
      serializedNode.mentionName
    );
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(
    mentionEntityId: string,
    mentionName: string,
    text?: string,
    key?: NodeKey
  ) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
    this.__mentionId = mentionEntityId;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      mentionEntityId: this.__mentionId,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = 'mention';
    dom.setAttribute('data-lexical-mention-id', this.__mentionId.toString());
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.setAttribute(
      'data-lexical-mention-id',
      this.__mentionId.toString()
    );
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(
  mentionEntityId: string,
  mentionName: string
): MentionNode {
  const mentionNode = new MentionNode(mentionEntityId, mentionName);
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}
