# yamailer - Yet Another Mailer

Simple `nodemailer` wrapper.
See `./test` folder for examples.

Accepted options are the same ones accepted by `nodemailer`

## Import
```js
const yamailer = require('yamailer')
    , yam = new yamailer(/* { Optional options object in the nodemailer way } */)
```

## Methods
* **addAttachment**: Add attachment as object. Valid properties are:
```js
    yam.addAttachment({
        filename, //  'text1.txt',
        content, // 'hello world!' // new Buffer('hello world!','utf-8') // fs.createReadStream('file.txt') // 'aGVsbG8gd29ybGQh'
        path, // '/path/to/file.txt' // 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE' // 'data:text/plain;base64,aGVsbG8gd29ybGQ='
        contentType, // 'text/plain'
        encoding, // 'utf-8', 'base64'
        raw// 'Content-Type: text/plain\r\n' + 'Content-Disposition: attachment;\r\n' + '\r\n' + 'Hello world!'
    })
```
* **addAttachments**: Add array of attachments (see method above)\
    `yam.addAttachments([ ... ])`
* **addRecipient**: Add email recipient (this must be a valid email address)\
    `yam.addRecipient('recipient@example.com')`
* **addRecipients**: Add array of email recipients (array of valid email addresses)\
    `yam.addRecipients(['recipient1@example.com', 'recipient2@example.com'])`
* **from**: specify sender email and name\
    `yam.from('mail@example.com', 'Mail sender name')`
* **html**: specify email HTML contents\
    `yam.html('<h1>Hello World!</h1>')`
* **options**: specify options\
    ```js
    yam.options({
        // options object in the nodemailer way
    });
    ```
* **send**: send email (it returns a `<Promise>`)\
    `yam.send()`
* **subject**: specify email subject\
    `yam.subject('What's up?!')`
* **text**: specify email plain text contents\
    `yam.subject('Greetings from Malibù!')`

## Other references
For additional info about `nodemailer` input `options`: https://www.npmjs.com/package/nodemailer