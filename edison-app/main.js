const edison = require('./edison');

edison.listen((message) => {
   if (message === 'hello') {
       edison.say('hello, my friend');
   } 
});
