import {useState, useEffect} from "react";

export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(()=>{
        const user = window.localStorage.getItem(key)
        return user ? JSON.parse(user) : initialValue
    })

    useEffect(()=>{
        const user = JSON.stringify(value)
        window.localStorage.setItem(key, user)
    }, [value])

    return [value, setValue]
}

