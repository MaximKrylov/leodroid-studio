const leodroid = require('./leodroid');

leodroid.listen((message) => {
   if (message === 'hello') {
       leodroid.say('hello, my friend');
   } 
});
