class Bot {
    constructor(type) {
        this.type = type;
    }

    answer(req = null) {

    }
}

class EchoBot extends Bot {
    constructor(type) {
        super(type);
    }

    answer(req) {
        return req
    }
}

class ReverseBot extends Bot {
    constructor(type) {
        super(type);
    }

    answer(req) {
        setTimeout(() => {
            return req.split('').reverse().join('')
        }, 3000)
    }
}

class SpamBot extends Bot {
    constructor(type) {
        super(type);
    }

    answer(receiver, req = null) {
        const message = this.getRandomString();
        return {messageText: message, sender: `${this.type} Bot`, receiver: receiver}
    }

}

class IgnoreBot extends Bot {
    constructor(type) {
        super(type);
    }

    answer(req = null) {
        super.answer(req);
    }
}

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;

    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

module.exports = {
    EchoBot,
    ReverseBot,
    SpamBot,
    IgnoreBot,
    generateRandomString
}