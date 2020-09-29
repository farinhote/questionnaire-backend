const QuestionnaireModel = require('../models/questionnaires');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const colours = ['Brown', 'Blue'];

function verifyChoice(key_press) {
    let choice = 'n/a';

    if (key_press === 37) {
        choice = 'left'
    } else if (key_press === 39) {
        choice = 'right'
    }

    return choice
}

function verifyMajority(leftRate, rightRate) {
    if (leftRate === rightRate) {
        return 'tie'
    }

    return leftRate > rightRate ? 'left' : 'right';
}

function cleanUpMateChoice(element) {
    const { key_press, leftRate, pairId, rightRate, rt } = element;
    const choice = verifyChoice(key_press);
    const majority = verifyMajority(leftRate, rightRate);
    const userAgreement = choice === majority;

    return {
        pairId,
        leftRate,
        rightRate,
        choice,
        majority,
        userAgreement,
        reactionTime: Math.floor(rt)
    };
}

function cleanUpEyeColour(element) {
    const { rt, button_pressed, imgId } = element;
    const colour = colours[parseInt(button_pressed)];

    return {
        reactionTime: Math.floor(rt),
        imgId,
        colour
    };
}

function cleanUpAgeEstimate(element) {
    const { rt, response, imgId } = element;

    return {
        reactionTime: Math.floor(rt),
        imgId,
        response
    };
}

function cleanUpPerception(element) {
    const { rt, responses } = element;
    const parsed = JSON.parse(responses);
    const perception = parsed.perception[0];

    return {
        reactionTime: Math.floor(rt),
        perception
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
        const { body: { data, personalData, userGender } } = req;
        // const timestamp = Date.now();
        let answers = {
            // timestamp,
            personalData,
            userGender,
            mateChoices: [],
            ageEstimate: []
        };

        data.forEach(element => {
            const { trial } = element;

            if (trial) {
                switch (trial) {
                    case 'mate-choice':
                        answers.mateChoices
                            .push(cleanUpMateChoice(element));
                        break;
                    case 'eye-colour-question':
                        answers.eyeColour = cleanUpEyeColour(element);
                        break;
                    case 'age-estimate':
                        answers.ageEstimate
                            .push(cleanUpAgeEstimate(element));
                        break;
                    case 'eye-colour-attention-check':
                        answers.attentionCheck = cleanUpEyeColour(element);
                        break;
                    case 'perception':
                        answers.perception = cleanUpPerception(element);
                        break;
                    case 'feedback':
                        answers.feedback = cleanUpFeedback(element);
                        break;
                }
            }
        });

        QuestionnaireModel.create({ data: answers }, function (err, result) {
            if (err) {
                next(err);
            }
            else {
                res.json({ status: "success", message: "Questionnaire added successfully!", data: null });
            }
        });
    },
}