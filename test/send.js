try {
    const hotenv = require('hotenv');
    hotenv(__dirname+'/../.env');

    const username = process.env.GMAIL_USERNAME
        , password = process.env.GMAIL_PASSWORD
        , sendmail = new (require(__dirname+'/../index.js'))();

    //sendmail.options('smtps://'+encodeURIComponent(username)+':'+encodeURIComponent(password)+'@smtp.gmail.com:465');
    sendmail.options({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: username,
            pass: password
        }
    });
    
    sendmail.from(username);
    sendmail.addRecipient(username);
    sendmail.subject('test mail');
    sendmail.text('test 1');

    sendmail.send()
        .then(console.log)
        .catch(console.log);
} catch(err) {
    console.log(err);
    err.response && err.response.indexOf('log in via your web browser and then try again.') ? console.log('Please log in into your Google Account and check for unknown login attempts waiting for being validated.') : null;
}