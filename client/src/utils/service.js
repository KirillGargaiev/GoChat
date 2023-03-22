import { v4 as uuidv4 } from 'uuid';

const adjectives = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'black', 'white', 'gray'];
const nouns = ['cat', 'dog', 'bird', 'fish', 'horse', 'lion', 'tiger', 'bear', 'elephant', 'monkey'];

function generateUsername() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}_${randomNoun}`;
}

function getRandomAvatar() {
    const numAvatars = 3;
    const randomNumber = Math.floor(Math.random() * numAvatars) + 1;
    return `avatar${randomNumber}`;
}

function checkUser() {
    const curUsr = JSON.parse(window.localStorage.getItem('user'))
    if (!curUsr) {
        const newUser = {
            id: uuidv4(),
            username: generateUsername(),
            img: getRandomAvatar(),
            online: true,
        }
        window.localStorage.setItem('user', JSON.stringify(newUser))
        return newUser;
    }
    return curUsr;
}

export {generateUsername, getRandomAvatar, checkUser}