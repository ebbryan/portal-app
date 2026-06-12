type OperationPageProps = {
  visible: boolean
}

export default function OperationPage({ visible }: OperationPageProps) {
  if (!visible) {
    return null
  }

  return (
    <div>
      <h1>Operation Page</h1>
      <p>This is the operation page of the application.</p>
    </div>
  )
}
