const RatioEstimationModel = require('../models/ratioEstimation');

function checkMajorityPerception(response, colorAsked) {
    if (response === 50) {
        return 'tie';
    }
    const oppositeColor = colorAsked === 'red' ? 'green' : 'red';

    return response > 50 ? colorAsked : oppositeColor; 
}

function verifyAccuracy(freqGreen, choice) {
    const tie = choice === 'tie' && freqGreen === 0.5;
    const colorMajority = freqGreen > 0.5 ? 'green' : 'red';

    return tie || colorMajority === choice;
}

function cleanUpTrial(element) {
    const { freqGreen, response, colorAsked } = element;
    const responseParsed = Number(response);
    const choice = checkMajorityPerception(responseParsed, colorAsked);
    const userAccuracy = verifyAccuracy(freqGreen, choice);
    
    return {
        colorAsked,
        freqGreen,
        plotId: element.plotID,
        response: responseParsed,
        subject: element.subject,
        trialIndex: element.trial_index - 2,
        reactionTime: Math.floor(element.rt),
        choice,
        userAccuracy
    };
}

function cleanUpFeedback(element) {
    const { rt, responses } = element;
    const parsed = JSON.parse(responses);
    const suggestions = parsed.Q0;
    const naivety = parsed.Q1;

    return {
        reactionTime: Math.floor(rt),
        suggestions,
        naivety
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
            ratioEstimations: []
        };

        data.forEach(element => {
            const { trial } = element;

            if (trial && trial === 'ratio-estimation') {
                answers.ratioEstimations.push(cleanUpTrial(element));
            }

            if (trial) {
                switch (trial) {
                    case 'feedback':
                        answers.feedback = cleanUpFeedback(element);
                        break;
                }}


        });

        RatioEstimationModel.create({ data: answers }, function (err, result) {
            if (err) {
                next(err);
            }
            else {
                res.json({ status: "success", message: "Questionnaire added successfully!", data: null });
            }
        });
    },
}