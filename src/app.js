const scores = {
    Anna: 10,
    Olga: 1,
    Ivan: 5,
};
//Use for... in
function getScore(scores) {
    let totalScore = 0;
    for (let key in scores) {
        totalScore = totalScore + scores[key];
    }
return totalScore;
}
const result = getScore(scores);
console.log(result);

//Use Object.values
function getScore2(scores) {
    let totalScore = null;
    for (let score of Object.values(scores)) {
         totalScore += score;
    }
    return totalScore;
}
const result2 = getScore2(scores);
console.log(result2);
