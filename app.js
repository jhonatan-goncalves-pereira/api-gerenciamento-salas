const express = require('express')
const routes = require('./routes/rotas')
const day = require('./middleware/day')
const app = express()

app.use(express.json())

app.use(day)

app.use(routes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


module.exports = app;