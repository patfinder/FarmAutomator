export function addActionDetails(highScores) => {
    return {
        type: 'HIGHSCORES_UPDATED',
        payload: highScores
    }
};
