/** For GMAIL:
 * https://myaccount.google.com/lesssecureapps?pli=1
 * https://accounts.google.com/DisplayUnlockCaptcha
 */
const nodemailer = require('nodemailer');
const clean = {
    array: (input)=>{
        return Array.isArray(input) ? input :
            typeof input==='undefined' || input===null ? [] :
            [ input ];
    }
    , bool: (input)=>{
        return !!input;
    }
    , boolean: (input)=>{
        return clean.bool(input);
    }
    , email: (email)=>{
        if (!email.match(/^([a-z0-9\_\+]+\.?)+@([a-z0-9\-]+\.?)*[a-z0-9\-]+\.[a-z0-9]{2,}/ig)){
            throw 'Invalid email format.';
        }
        return email;
    }
    , text: (txt, start, length)=>{
        txt = typeof txt==='undefined' || txt===null ? '' :
        typeof txt==='string' || typeof txt==='number' ? txt :
        typeof txt==='object' ? JSON.stringify(txt) :
        txt.toString ? txt.toString('utf8') : '';
        return txt.substr(!isNaN(start) ? start : 0, !isNaN(length) ? length : txt.length);
    }
    , row: (txt)=>{
        return clean.text(txt).replace(/[\r\n]+/img,'');
    }
    , number: (input)=>{
        return !isNaN(input) && input!==Infinity ? input :
            !isNaN(parseFloat(input)) ? parseFloat(input)
            : NaN;
    }
    , integer: (input)=>{
        return parseInt(clean.number(input));
    }
}

class sendmail {
    constructor(options){
        this._attachments = [];
        this._from = '';
        this._recipients = [];
        this._subject = '';
        this._text = '';
        this._html = '';
        this._options = null;

        this.options = this.options.bind(this);
        this.from = this.from.bind(this);
        this.addRecipient = this.addRecipient.bind(this);
        this.addRecipients = this.addRecipients.bind(this);
        this.subject = this.subject.bind(this);
        this.text = this.text.bind(this);
        this.html = this.html.bind(this);
        this.transporter = this.transporter.bind(this);
        this.send = this.send.bind(this);

        this.options(options);
    }
    from(email, name){
        email = clean.email(email);
        name = clean.row(name);
        this._from = name ? '"' + name + '" ' : '';
        this._from += '<' + email + '>';
        return this;
    }
    addRecipient(email){
        this._recipients = this._recipients || [];
        this._recipients.push(clean.email(email));
        return this;
    }
    addRecipients(emails){
        emails = clean.array(emails);
        while (emails.length) {
            this.addRecipient(emails.shift());
        }
        return this;
    }
    addAttachment(attachment){
        attachment = typeof attachment==='object' && attachment!==null ? {
            filename: attachment.filename, //  'text1.txt',
            content: attachment.content, // 'hello world!' // new Buffer('hello world!','utf-8') // fs.createReadStream('file.txt') // 'hello world!' // 'aGVsbG8gd29ybGQh'
            path: attachment.path, // '/path/to/file.txt' // 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE' // 'data:text/plain;base64,aGVsbG8gd29ybGQ='
            contentType: attachment.contentType, // 'text/plain'
            encoding: attachment.encoding, // 'utf-8', 'base64'
            raw: attachment.raw // 'Content-Type: text/plain\r\n' + 'Content-Disposition: attachment;\r\n' + '\r\n' + 'Hello world!'
        } : null;
        if (attachment!==null) {
            attachment = Object.keys(attachment).reduce((obj, key)=>{
                if (typeof attachment[key]!=='undefined' && attachement[key]!==null) {
                    obj[key] = attachment[key];
                }
                return obj;
            }, {});
            this._attachments = this._attachments || [];
            this._attachments.push(attachment);
        }
        return this;
    }
    addAttachments(attachments){
        attachments = clean.array(attachments);
        while(attachments.length) {
            this.addAttachment(attachments.shift());
        }
        return this;
    }
    html(txt){
        this._html = clean.text(txt);
        return this;
    }
    subject(txt){
        this._subject = clean.text(txt, 0, 250);
        return this;
    }
    text(txt){
        this._text = clean.text(txt);
        return this;
    }
    options(options){
        options = typeof options==='undefined' || options===null || typeof options!=='object' ? {} : options;
        if (typeof options==='string'){
            options = {
                connection: options
            }
        }
        this._options = this._options || {
            host: ''
            , port: ''
            , secure: false
            , username: ''
            , password: ''
            , connection: '' // plain connection string text: 'smtps://user%40gmail.com:pass@smtp.gmail.com:465'
        }
        if (!options.connection) {
            this._options.connection = '';
        }
        this._options = {
            ...this._options
            , ...options
        }
        this._options.host = clean.row(this._options.host);
        this._options.port = clean.integer(this._options.port);
        this._options.secure = clean.bool(this._options.secure);
        this._options.username = clean.row(this._options.username);
        this._options.password = clean.row(this._options.password);
        this._options.auth = this._options.auth || (this._options.username && this._options.password ? {
            user: this._options.username,
            pass: this._options.password
        } : void(0));
        this._options.connection = clean.row(this._options.connection);

        // reset transporter
        this._transporter = null;  
        return this;  
    }
    transporter(){
        if (!this._transporter) {
            // create reusable transporter object using the default SMTP transport
            this._transporter = nodemailer.createTransport(this._options.connection || {...this._options});
        }
        return this._transporter;
    }
    send(){
        return (async ()=>{
            try {
                // send mail with defined transport object
                let outmail = await this.transporter().sendMail({
                    from: this._from, // '"Fred Foo 👻" <foo@example.com>', // sender address
                    to: this._recipients.join(', '), // 'bar@example.com, baz@example.com', // list of receivers
                    subject: this._subject, // 'Hello ✔', // Subject line
                    text: this._text, // 'Hello world?', // plain text body
                    html: this._html, //'<b>Hello world?</b>' // html body
                    attachments: this._attachments
                });
                return outmail;
            } catch(err) {
                throw err;
            }
        })();
    }
}

module.exports = sendmail;