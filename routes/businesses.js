const express = require('express'),
    router = express.Router();
    businessesModel = require('../models/businesses')
    specificBusinessModel = require('../models/specificBusiness')
/* GET home page. */
router.get('/home', async function(req, res, next) {
    const allBusinesses = await businessesModel.getAll();
    console.log("allBusinesses:", allBusinesses);
    res.render('template', {
        locals: {
            title: 'Belch',
            businessesList: allBusinesses
        },
        partials: {
            partial: 'partial-businesses' //.html is implied
        }
    });
});

function numberToStars(num) {
    let rating = (num == 1) ? "*" 
    : (num == 2) ? "**"
    : (num == 3) ? "***"
    : (num == 4) ? "****"
    : (num == 5) ? "*****"
    : "NA";
    return rating
}

router.get('/business/:business_id', async function(req, res, next) {
    // console.log("Business ID:", req.params.business_id);
    const businessInfo = await specificBusinessModel.getBusiness(req.params.business_id);
    const businessReviewsResponse = await specificBusinessModel.getBusinessReviews(req.params.business_id);
    const businessReviews = businessReviewsResponse.rows;
    for (review in businessReviews) { 
        businessReviews[review].starSymbols = numberToStars(businessReviews[review].stars);
    }
    console.log(businessReviews);
    res.render('template', {
        locals: {
            title: 'Belch',
            businessData: businessInfo,
            reviewsData: businessReviews
        },
        partials: {
            partial: 'partial-specific-business' //.html is implied
        }
    });
});

router.post('/business/:business_id', (req,res) => {
    const name = req.body.Name;
    const rating = req.body.Rating;
    const review = req.body.Review
    console.log(`name: ${name}, rating: ${rating}, review:${review}`)
    specificBusinessModel.addReview(req.params.business_id, name, review, rating)
    .then(async () => {
        // res.status(200).send('SUCCESS!');
        const businessInfo = await specificBusinessModel.getBusiness(req.params.business_id);
        const businessReviewsResponse = await specificBusinessModel.getBusinessReviews(req.params.business_id);
        const businessReviews = businessReviewsResponse.rows
        console.log(businessReviews);
        res.render('template', {
            locals: {
                title: 'Belch',
                businessData: businessInfo,
                reviewsData: businessReviews
            },
            partials: {
                partial: 'partial-specific-business' //.html is implied
            }
        });
    })
    .catch((err) => {
        res.sendStatus(500).send(err.message);
    });
});

module.exports = router;