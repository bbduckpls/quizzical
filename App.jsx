import Home from "./Home"
import Quiz from "./Quiz"
import { useState } from "react"

export default function App() {
    const [quizStarted, setQuizStarted] = useState(false)
    
    function toggleQuizStart() {
        setQuizStarted(prevState => !prevState)
    }
    
    return (
        <main>
            {!quizStarted && <Home 
                toggleQuizStart={toggleQuizStart}
            />}
            {quizStarted && <Quiz />}
        </main>
    )
}