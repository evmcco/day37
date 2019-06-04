const db = require ('./conn.js');

class specificBusiness {

    static async getBusiness(businessId) {
        try {
            const response = await db.any(`select name, type, neighborhood from businesses where id = ${businessId};`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async addReview(businessId, reviewerName, reviewText, stars) {
        const query = `insert into reviews(business_id, reviewer_name, review_text, stars) values (${businessId}, '${reviewerName}', '${reviewText}', ${stars});`;
        try {
            let response = await db.result(query);
            return response;
        } catch(err) {
            console.log("ERROR", err.message);
            return err
        }
    }

    static async getBusinessReviews(business_id) {
        let query = `select b.name, b.type, b.neighborhood, r.reviewer_name, r.review_text, r.stars from businesses as b join reviews as r on b.id = r.business_id where b.id = ${business_id};`;
        try {
            let response = await db.result(query);
            return response;
        } catch(err) {
            console.log("ERROR", err.message);
            return err
        }
    }
}

module.exports = specificBusiness;
