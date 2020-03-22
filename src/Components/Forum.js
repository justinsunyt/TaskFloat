import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import ForumPost from './ForumPost'
import {AuthContext} from '../Auth'

function Forum(props) {
    const filter = props.filter
    const rootRef = firebase.database().ref()
    const [forumState, setForumState] = useState([])
    const [classState, setClassState] = useState([])
    const [filteredState, setFilteredState] = useState([])
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid

    let liked = filteredState.map(post => (post.likes.includes(userId)) ? true : false)
    let classes = []
    // initialize liked array for checkbox prop
    console.log("Liked:")
    console.log(liked)

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter == 0) {
                setClassState(value)
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["students"].includes(userId)) {
                        classes.push(value[i]["id"])
                    }
                }
            }
            if (counter == 1) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["comments"] === undefined){
                        value[i]["comments"] = {}
                    }
                    // initialize "comments" if undefined
                    if (value[i]["likes"] === undefined){
                        value[i]["likes"] = []
                    }
                    // initialize "likes" if undefined
                }
                setForumState(value)
                let filteredForum = value
                if (typeof filter == "number") {
                   filteredForum = value.filter(val => {
                       if (val["classId"] == filter) {
                           return val
                       }
                   })     
                } else {
                    filteredForum = value.filter(val => {
                        if (classes.includes(val["classId"])) {
                            return val
                        }
                    })
                }
                setFilteredState(filteredForum)
            }
            counter ++
        }  
    }

    function handleChange(id) {
        let change = ""
        setForumState(prevForum => {
            const updatedForum = prevForum.map(post => {
                let newPost = post
                if (post.id == id) {
                    if (post.likes.includes(userId)) {
                        const filteredLikes = post.likes.filter(value => {
                            if (value != userId) {
                                return value
                            }
                        })
                        newPost.likes = filteredLikes
                        change = "unliked post"
                        // if post is liked, unlike post
                    } else {
                        if (!newPost.likes) {
                            newPost.likes = []
                        }
                        newPost.likes.push(userId)
                        change = "liked post"
                        // if post is unliked, like post
                    }
                }
                return newPost
            })
            console.log("Writing data to Firebase, change: " + change)
            rootRef.set({"classData": classState, "forumData": updatedForum})
            console.log("Succesfully wrote data")
            return updatedForum
        })
        console.log("New state:")
        console.log(forumState)
    }

    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
        // fetch forum data when component mounts
    }, [])

    const forum = filteredState.map((post, index) => <ForumPost key={post.id} post={post} handleChange={handleChange} liked={liked[index]}/>)
  
    return(
        <div className='forum'>
            {forum}
        </div>
    )
}

export default Forum