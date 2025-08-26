import { useState, useEffect } from "react"
import { decode } from "html-entities"

export default function Main() {
    /* state variables*/
    const [quizQs, setQuizQs] = useState([])
    const [placeholderAns, setPlaceholderAns] = useState(["", "", "", "", ""])
    const [quizScore, setQuizScore] = useState(0)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isPlayAgain, setIsPlayAgain] = useState(false)
    
    /* derived variables */
    const isAllAnswered = placeholderAns.every(ans => ans !== "")
    
    /* fisher-yates algorithm */
    function shuffleArray(arr) {
        let currentIndex = arr.length
        let randomIndex
        
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
        }
        
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
        
        return arr
    }
    
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple")
                const result = await response.json()
                 
                const mappedData = result.results.map(obj => {
                    const correctAnsObj = {
                        answer: decode(obj.correct_answer),
                        isCorrect: true
                    }
                    
                    const incorrectAnsObjs = obj.incorrect_answers.map(ans => ({
                        answer: decode(ans), 
                        isCorrect: false
                    }))
                    
                    const shuffledAnswers = shuffleArray([
                        ...incorrectAnsObjs,
                        correctAnsObj
                    ])

                    return {
                        question: decode(obj.question),
                        answers: shuffledAnswers,
                        correct_answer: decode(obj.correct_answer)
                    }
                })
                
                setQuizQs(mappedData)
                
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [isPlayAgain])

    function saveAnswer(e) {
        const selectedAnsArr = [...placeholderAns]
        selectedAnsArr[e.target.name] = e.target.value
        
        setPlaceholderAns(selectedAnsArr)
    }
    
    const displayQs = quizQs.map((obj, index) => {
        const answerRadios = obj.answers.map(ans => {
            return <label 
                key={ans.answer}
                className={hasSubmitted 
                    ? ans.isCorrect 
                        ? "correct" 
                        : (ans.answer === placeholderAns[index] ? "incorrect" : "disabled") 
                    : ""}>
                <input 
                    type="radio" 
                    name={index}
                    value={ans.answer}
                    onChange={saveAnswer}
                />
                {ans.answer}
            </label>
        })
        
        return (
            <div key={index} className="question-div">
                <legend>{obj.question}</legend>
                <div className="answers-div">
                    {answerRadios}
                </div>
            </div>
        )
    })
    
    
    const handleSubmit = e => {
        e.preventDefault()
        setHasSubmitted(prevState => !prevState)
        
        for(let i = 0; i < quizQs.length; i++) {
            const selectedAns = quizQs[i].answers.find(obj => obj.answer === placeholderAns[i])
            
            if (selectedAns.isCorrect) {
                setQuizScore(prevScore => prevScore + 1)
            }
        }
        
        
    }
    
    function restartQuiz() {
        setIsPlayAgain(prevState => !prevState)
        setQuizQs([])
        setPlaceholderAns(["", "", "", "", ""])
        setQuizScore(0)
        setHasSubmitted(false)
    }

    return (
        <section className="quiz-page">
            <form name="quiz" onSubmit={handleSubmit}>
                {displayQs}
                <section className="score-section">
                    {!hasSubmitted && 
                        <button 
                            type="submit"
                            disabled={!isAllAnswered}
                        >Check answers
                        </button>
                    }
                    {isAllAnswered && hasSubmitted &&
                        <> 
                            <span>You scored {quizScore}/5 correct answers</span>
                            <button
                                onClick={restartQuiz}
                            >Play again</button>
                        </>
                    }
                </section>
            </form>
        </section>
    )
}