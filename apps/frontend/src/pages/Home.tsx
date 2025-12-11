import { useEffect, useState } from "react"

export default function HomePage() {
  const [health, setHealth] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch("http://localhost:4000/health")
        const data = await res.json()
        setHealth(data.status)
      } catch (err) {
        console.error("Error fetching health:", err)
        setHealth("Error")
      }
    }

    fetchHealth()
  }, [])

  return (
    <>
      <h2 className='text-2xl font-semibold'>
        Home Page
      </h2>

      <div className="p-4">
        <h3 className="text-2xl font-bold mb-2">Backend Health Check</h3>
        <p>Status: {health ?? "Loading..."}</p>
      </div>
    </>
  )
}