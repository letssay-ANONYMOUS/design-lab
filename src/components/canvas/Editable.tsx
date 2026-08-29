import { useEditing } from '@/store/useEditing'
import { useEffect, useRef, type ElementType, type KeyboardEvent } from 'react'

interface EditableProps {
  value: string
  editing: boolean
  onCommit: (next: string) => void
  as?: ElementType
  className?: string
  style?: React.CSSProperties
  nodeProps?: Record<string, unknown>
}

/**
 * Uncontrolled on purpose: React re-rendering a contenteditable's children on
 * every keystroke resets the caret to position zero. We seed the DOM once when
 * editing opens and read it back on commit.
 */
export function Editable({
  value,
  editing,
  onCommit,
  as: Tag = 'span',
  className,
  style,
  nodeProps,
}: EditableProps) {
  const ref = useRef<HTMLElement | null>(null)
  const endEdit = useEditing((s) => s.endEdit)

  useEffect(() => {
    if (!editing) return
    const el = ref.current
    if (!el) return
    el.textContent = value
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }, [editing, value])

  const commit = () => {
    const next = ref.current?.textContent?.trim() ?? ''
    endEdit()
    if (next && next !== value) onCommit(next)
    else if (ref.current) ref.current.textContent = value
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      commit()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      if (ref.current) ref.current.textContent = value
      endEdit()
    }
    event.stopPropagation()
  }

  if (editing) {
    return (
      <Tag
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        data-dl-editable="true"
        className={className}
        style={style}
        onBlur={commit}
        onKeyDown={onKeyDown}
        {...nodeProps}
      />
    )
  }

  return (
    <Tag className={className} style={style} {...nodeProps}>
      {value}
    </Tag>
  )
}
