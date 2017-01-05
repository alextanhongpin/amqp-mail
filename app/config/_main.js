module.exports = {

    port: 3000,
    smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'john.devenv.doe@gmail.com',
            pass: 'qwerty54321'
        }
    }
}