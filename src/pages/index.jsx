import { useRouter } from "next/router"

export default function Index() {
  const router = useRouter()
  function enterChat(id) {
    router.push('/chat/' + id)
  }

  return (
    <>
      <button onClick={() => enterChat(1)}>Enter with ID 1</button>
      <br/>
      <button onClick={() => enterChat(2)}>Enter with ID 2</button>
    </>
  )
}