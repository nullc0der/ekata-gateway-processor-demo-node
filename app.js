const express = require('express')
var bodyParser = require('body-parser')
const {
    createPaymentForm,
    verifyPayload,
} = require('@ekataio/ekata-gateway-processor-helper')

const port = 3000
const app = express()

//TODO: Add more content to html, redirect on success, add pug template, proper tailwind, webhook

app.use(express.static('public'))
app.use(bodyParser.json())

app.post('/create-form-id', (req, res) => {
    createPaymentForm({
        amount: 100,
        fiatCurrency: 'USD',
        apiKey: 'p1YnsifSPhkJYWMfJRv77x5gD10J931bOtaTKd3Gi4U',
        projectID: 'd9db8de9-5412-459a-804c-735460b3706c',
        testnet: true,
    })
        .then((formData) => {
            console.log(formData)
            res.json({ formID: formData.id })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'Server error' })
        })
})

app.post('/payment-success', (req, res) => {
    if (
        verifyPayload({
            payload: req.body,
            signatureSecret: 'zWrXQ8rkh7mMWrLtOLvG715MuVMveCvnfVjmGckhMuc',
        })
    ) {
        res.json({ success: true })
        // Do rest of your checkout flow
    } else {
        res.json({ success: false })
        // Show error to user
    }
})

app.listen(port, () => console.log(`Server started on ${port}`))
