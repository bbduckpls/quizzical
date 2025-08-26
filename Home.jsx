export default function Home(props) {
    return (
        <section className="landing-page">
            <h1>Quizzical</h1>
            <p>Test your general knowledge with these 5 random questions. How many can you get right?</p>
            <button onClick={props.toggleQuizStart}>Start quiz</button>
        </section>    
    )   
}