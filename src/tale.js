// Task 1
function kolobok(characterName) {
    switch (characterName) {
        case 'grandfather': {
            return 'I left my grandfather';
        }
        case 'rabbit': {
            return 'I left the rabbit';
        }
        case 'fox': {
            return 'I was eaten';
        }
        default: {
            return 'I have not met anyone';
        }
    }
}

console.log(kolobok( 'grandfather'));
console.log(kolobok('rabbit'));
console.log(kolobok('fox'));
console.log(kolobok());

// Task 2
function newYear (newYearName) {
    switch (newYearName) {
        case 'Father Frost': {
            console.log(`${newYearName}! ${newYearName}! ${newYearName}!`);
            break;
        }
        case 'Snow Maiden': {
            console.log(`${newYearName}! ${newYearName}! ${newYearName}!`);
            break;
        }
    }
}

newYear('Father Frost');
newYear('Snow Maiden');
