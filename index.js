const express=require('express');
const keys=require('./config/keys');
// secret key would go to the backend where no one shouls see
const stripe=require('stripe')(keys.stripeSecretKey);
const bodyParser=require('body-parser');
const exphbs= require('express-handlebars');

const app=express();
// Handlebar Middleware
app.engine('handlebars',exphbs({defaultLayout:"main"}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set static folder (img, extra stylesheet)
app.use(express.static(`${__dirname}/public`));

// setup home route
app.get('/',(req,res)=>{
    res.render('home',{
        stripePublishableKey:keys.stripePublishableKey
    });
});

// View Success route. User have to pay to view the success
// app.get('/success',(req,res)=>{
//     res.render('success');
// })

// charge route
app.post('/charge',(req,res)=>{
    const amount=2500;
    const request=req.body;
    
    stripe.customers.create({
        email: request.stripeEmail,
        source:request.stripeToken
    })
    .then(customer=>stripe.charges.create({
        amount,
        description:'Game of thrones',
        currency:'eur',
        customer:customer.id
    }))
    .then(charge => res.render('success'))
    ;
});


// deploy Heroku. Heroku would choose the port, and work locally by port 5000
const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server starts on port ${port}`);
});

