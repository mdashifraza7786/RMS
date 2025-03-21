const express = require('express');
const app = express();
const port = 5000;
let a = 0;
app.get('/', (req, res) => {
    a++;
    res.send(`Hello World! ${a}`);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
