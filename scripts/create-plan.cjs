const Razorpay = require('razorpay')

const razorpay = new Razorpay({
    key_id: process.argv[2],
    key_secret: process.argv[3]
})

async function createPlan() {
    try {
        const plan = await razorpay.plans.create({
            period: 'monthly',
            interval: 1,
            item: {
                name: 'StackMind Pro',
                amount: 39900,
                currency: 'INR',
                description: 'Unlimited AI queries, code reviews, and journal history'
            }
        })
        console.log('Plan created successfully!')
        console.log('Plan ID:', plan.id)
    } catch (error) {
        console.error('Error:', error.error?.description || error.message)
    }
}

createPlan()