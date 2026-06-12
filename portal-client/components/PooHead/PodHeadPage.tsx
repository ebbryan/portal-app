type PodHeadPageProps = {
  visible: boolean
}

export default function PodHeadPage({ visible }: PodHeadPageProps) {
  if (!visible) {
    return null
  }

  return (
    <div>
      <h1>Pod Head Page</h1>
      <p>This is the pod head page of the application.</p>
    </div>
  )
}
