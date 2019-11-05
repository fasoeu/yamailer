try {
    const hotenv = require('hotenv');
    hotenv(__dirname+'/../.env');

    const username = process.env.GMAIL_USERNAME
        , password = process.env.GMAIL_PASSWORD
        , sendmail = new (require(__dirname+'/../index.js'))();

    sendmail.options('smtps://'+encodeURIComponent(username)+':'+encodeURIComponent(password)+'@smtp.gmail.com:465');
    // sendmail.options({
    //     host: 'smtp.gmail.com',
    //     secure: true,
    //     port: 465,
    //     auth: {
    //         user: username,
    //         pass: password
    //     },
    // });
    sendmail.from(username);
    sendmail.addRecipient(username);
    sendmail.subject('test mail');
    sendmail.text('test 1');

    sendmail.send()
        .then(console.log)
        .catch(console.log);
} catch(err) {
    console.log(err);
}