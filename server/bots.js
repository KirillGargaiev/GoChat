class Bot {
    constructor(name) {
        this.name = name
    }
    answer(req){

    }
}
class echoBot extends Bot {
    constructor(name) {
        super(name);
    }
    answer(req) {
        super.answer(req);
        return req
    }
}

class reverseBot extends Bot {
    constructor(name) {
        super(name);
    }

    answer(req) {
        super.answer(req);
        setTimeout(()=>{
            return req.split('').reverse().join('')
        }, 3000)
    }
}

class spamBot extends Bot {
    constructor(name) {
        super(name);
    }
    answer(req) {
        super.answer(req);
        setInterval(()=>{
            return `${(Math.random() + 1).toString(36).substring(7)}`
        }, getRandomInt(10, 120)*1000)
    }
}

class ignoreBot extends Bot {
    constructor(name) {
        super(name);
    }
    answer(req) {
        super.answer(req);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

