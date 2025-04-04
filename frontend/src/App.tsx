import { useEffect, useState } from 'react'

function App() {
    const [message, setMessage] = useState('Loading...')

    useEffect(() => {
        fetch('/api/hello')
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
    }, [])

    return <h1>{message}</h1>
}

export default App