function generateReferralCode(userId) {
    return `REF-${userId}`;
}

module.exports = { generateReferralCode };
