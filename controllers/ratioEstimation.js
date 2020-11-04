const RatioEstimationModel = require('../models/ratioEstimation');



function verifyChoice(response,colorAsked) {
    let choice = 'n/a';

    if (colorAsked === "green") {
      choice = response > 50 ? 'green' : 'red'
    }
     else if (colorAsked === "red") {
      choice = response > 50 ? 'red' : 'green'
    }
     else if ( response === 50) {
        choice = 'tie'
    }
    return choice 
}

/*function verifyChoice(response,colorAsked) {
    let choice = 'n/a';

    if (colorAsked === "green" && response > 50) {
        choice = 'green'
    } else if (colorAsked === "green" && response < 50) {
        choice = 'red'
    } else if (colorAsked === "red" && response > 50) {
        choice = 'red'
    } else if (colorAsked === "red" && response < 50) {
        choice = 'green'
    } else if ( response === 50) {
        choice = 'tie'
    }
    return choice
}*/


function verifyAccuracy(freqGreen, choice) {
    const colorMajority = freqGreen > 0.5 ? 'green' : 'red'

    return colorMajority === choice;
}



function cleanUpTrial(element) {
    const { freqGreen, response, colorAsked } = element;
    const choice = verifyChoice(response,colorAsked);
    const userAccuracy = verifyAccuracy(freqGreen, choice);
    
    return {
        colorAsked: element.colorAsked,
        freqGreen: element.freqGreen,
        plotId: element.plotID,
        response: Number(element.response),
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