const translate = require('translate-google');
translate('Hello world', {to: 'hi'}).then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});
