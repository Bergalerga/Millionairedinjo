Millionaire
-----------

Due to the `Access-Control-Allow-Origin` restrictions in Chrome, you will not be able to load `questions.json`. A simple workaround for this is to run the following in the root folder:
```bash
$ python -m SimpleHTTPServer
```
and thereafter access the website from `localhost:8000`. Keep in mind that the page does not work in Safari or Firefox due to using .waw and .mp4 sound files.

### Changing questions  

To change the questions, edit the call to init with the path to your questions. This call is located at the end of the `millionare.js` file. Example:  

```javascript
Millionaire.init('path/to/questions.json')
```
