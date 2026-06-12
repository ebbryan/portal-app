type EditorPageProps = {
  visible: boolean
}

export default function EditorPage({ visible }: EditorPageProps) {
  if (!visible) {
    return null
  }

  return (
    <div>
      <h1>Editor Page</h1>
      <p>This is the editor page of the application.</p>
    </div>
  )
}
