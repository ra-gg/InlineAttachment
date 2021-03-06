import * as CodeMirror from 'codemirror'
import {default as InlineAttachment, IEditor, InlineAttachmentSettings} from "../inline-attachment";

export default class CodeMirror4 implements IEditor {
  private inlineAttachment: InlineAttachment
  private instance: CodeMirror.Editor
  private options: Partial<InlineAttachmentSettings>

  constructor(
    instance: any,
    options: Partial<InlineAttachmentSettings>
  ) {
    if (!instance.getWrapperElement) {
      throw "Invalid CodeMirror object given";
    }
    this.instance = instance;
    this.options = options;
    this.bind();
  }

  public getInlineAttachment()
  {
    return this.inlineAttachment;
  }

  public getValue() {
    return this.instance.getValue();
  }

  public insertValue(value) {
    (this.instance as any).replaceSelection(value);
  }

  public setValue(value) {
    let cursor = (this.instance as any).getCursor();
    (this.instance as any).setValue(value);
    (this.instance as any).setCursor(cursor);
  }

  private bind()
  {
    const inlineAttachment = this.inlineAttachment || (this.inlineAttachment = new InlineAttachment(this, this.options));
    let el = (this.instance as any).getWrapperElement();

    el.addEventListener('paste', function (e) {
      inlineAttachment.onPaste(e);
    }, false);

    (this.instance as any).on('drop', (data, e) => {
      if (inlineAttachment.onDrop(e)) {
        e.stopPropagation();
        e.preventDefault();
        return true;
      } else {
        return false;
      }
    });
  }
}
