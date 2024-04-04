const Header = (props) => {
  return (
    <h2>{props.name}</h2>
  )
}
  
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => 
          <Part name = {part.name} exercises = {part.exercises} key = {part.id} />
      )}
    </div>
  )
}
  
const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}
  
const Total = ({ parts }) => {
  return (
    <p><b>Total of {parts.map(part => part.exercises).reduce((s, p) => s + p, 0)} exercises</b></p>
  )
}


const Course = (props) => {
  const course = props.course
    return (
        <div>
            <Header name = {course.name}/>
            <Content parts = {course.parts}/>
            <Total parts = {course.parts}/>
        </div>
    )
}

export default Course