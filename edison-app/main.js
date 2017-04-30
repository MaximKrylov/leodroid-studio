const edison = require('./edison');

edison.subscribe((message) => {
   if (message === 'hello') {
       edison.say('hello, my friend');
   } 
});
