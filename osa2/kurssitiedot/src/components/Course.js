const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <b>total of exercises {sum}</b>

const Part = ({ part }) => 
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) => 
    <>
        {parts.map(part => <Part key={part.id} part={part} />)}
    </>

const Course = ({ course }) => {
    const sum = (parts) => parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <>
            <Header course={course.name} />     
            <Content parts={course.parts} />
            <Total sum={sum(course.parts)} />
        </>
    )
}

export default Course