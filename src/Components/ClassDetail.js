import React, {useState, useEffect} from 'react'
import Forum from './Forum'
import * as firebase from 'firebase'

function ClassDetail({match}) {
    const forumRef = firebase.database().ref()
    const [forumState, setForumState] = useState()
    const [classState, setClassState] = useState([{
        "id" : 0,
        "name" : "",
        "students" : []
    }])
    const [id, setId] = useState(0)

    let className = classState[id].name
    let numStudents = classState[id].students.length
    let forum = forumState

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter == 0) {
                const idNum = Number(match.params.id)
                setClassState(value)
                setForumState(<Forum filter={idNum} />)
                setId(match.params.id)
            }
            counter ++
        }
    }

    useEffect(() => {
        forumRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
        // fetch forum data when component mounts 
    }, [])

    return (
        <div>
            <div className={"class-header"}>
                <h1>
                    {className}
                </h1>
                <h5>
                    <i>{(numStudents > 0 && numStudents + ((numStudents == 1) ? " student" : " students") + " joined")}</i>
                </h5>
            </div>
            {forum}
        </div>
    )
}

export default ClassDetail