const RatioEstimationConformityModel = require('../models/ratioEstimationConformity');


function verifyChoice(key_press) {
    let choice = 'n/a';

    if (key_press === 37) {
        choice = 'green'
    } else if (key_press === 39) {
        choice = 'red'
    }

    return choice
}

function verifyMajority(leftRate, rightRate) {
    if (leftRate === rightRate) {
        return 'tie'
    }

    return leftRate > rightRate ? 'green' : 'red';
}

function verifyAccuracy(freqGreen, choice) {
    const colorMajority = freqGreen > 0.5 ? 'green' : 'red'

    return colorMajority === choice;
}

function cleanUpTrial(element) {
    const { key_press, leftRate, ratioID, freqGreen, rightRate, rt, subject } = element;
    const choice = verifyChoice(key_press);
    const majority = verifyMajority(leftRate, rightRate);
    const userAgreement = choice === majority;
    const userAccuracy = verifyAccuracy(freqGreen, choice);
    
    return {
        leftRate,
        rightRate,
        ratioID,
        subject,
        trialIndex: element.trial_index - 2,
        choice,
        freqGreen,
        majority,
        userAccuracy,
        userAgreement,
        reactionTime: Math.floor(rt)
    };
}

module.exports = {
    create: function (req, res, next) {
        /* Handle data */
        const { body: { data } } = req;
        const timestamp = Date.now();
        let answers = {
            timestamp,
            ip: req.ip,
            ratioEstimationsConformity: []
        };

        data.forEach(element => {
            const { trial } = element;

            if (trial && trial === 'ratio-estimation-conformity') {
                answers.ratioEstimationsConformity.push(cleanUpTrial(element));
            }

            if (trial) {
                switch (trial) {
                    case 'feedback':
                        answers.feedback = cleanUpFeedback(element);
                        break;
                }}
        });

        RatioEstimationConformityModel.create({ data: answers }, function (err, result) {
            if (err) {
                next(err);
            }
            else {
                res.json({ status: "success", message: "Questionnaire added successfully!", data: null });
            }
        });
    },
}