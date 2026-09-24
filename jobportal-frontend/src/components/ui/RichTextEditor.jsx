import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from "lucide-react";
import { cn } from "@/utils/cn";

function ToolbarButton({ onClick, active, disabled, children, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-accent hover:bg-background disabled:opacity-40",
        active && "bg-secondary/10 text-secondary"
      )}
    >
      {children}
    </button>
  );
}

/**
 * A rich-text field styled to match TextInput/TextArea (label, border,
 * focus ring, error line) so it drops into a form the same way they do.
 * `value`/`onChange` carry HTML — wire it up via react-hook-form's
 * <Controller>, the same pattern PostJobForm already uses for Dropdown.
 */
export function RichTextEditor({ label, error, value, onChange, placeholder, className }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "Write something…" }),
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[120px] text-text",
      },
    },
  });

  const setLink = () => {
    const url = window.prompt("URL");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-sm font-medium text-primary">{label}</label>}

      <div
        className={cn(
          "rounded-lg border border-primary/20 focus-within:border-brand-500",
          error && "border-red-500"
        )}
      >
        <div className="flex items-center gap-1 border-b border-primary/10 px-2 py-1.5">
          <ToolbarButton
            label="Bold"
            active={editor?.isActive("bold")}
            disabled={!editor}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor?.isActive("italic")}
            disabled={!editor}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Bullet list"
            active={editor?.isActive("bulletList")}
            disabled={!editor}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={editor?.isActive("orderedList")}
            disabled={!editor}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Link"
            active={editor?.isActive("link")}
            disabled={!editor}
            onClick={setLink}
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} className="px-3.5 py-3" />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
