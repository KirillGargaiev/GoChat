import React from 'react';
import st from '../styles/main.module.css'

export const UserList = ({users}) => {
    const userArr = Object.entries(users)
    const activeUsers = Object.values(users).filter(el => el.online)
    return (
        <div className={st.userList}>
            {userArr.map((userId, obj) => (
                <div key={userId} className={st.userList__item}>{obj.userId}</div>
            ))}
        </div>
    );
};

