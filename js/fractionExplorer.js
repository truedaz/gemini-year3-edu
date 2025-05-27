// js/fractionExplorer.js

let currentDenominator = 2;
let selectedSegments = 0;
const MAX_DENOMINATOR = 12;
const MIN_DENOMINATOR = 2;

const explorerContainerId = 'interactiveFractionExplorer'; // Matches ID in learningMaterial

let svgElement, fractionTextElement, feedbackElement;
const circleRadius = 100;
const circleCenterX = 120;
const circleCenterY = 120;

function createSVGElement(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function calculateSegmentPath(segmentIndex, totalSegments) {
    const anglePerSegment = (2 * Math.PI) / totalSegments;
    const startAngle = segmentIndex * anglePerSegment;
    const endAngle = (segmentIndex + 1) * anglePerSegment;

    // CORRECTED LINES: Added space after 'const'
    const startX = circleCenterX + circleRadius * Math.cos(startAngle - Math.PI / 2);
    const startY = circleCenterY + circleRadius * Math.sin(startAngle - Math.PI / 2);
    const endX = circleCenterX + circleRadius * Math.cos(endAngle - Math.PI / 2);
    const endY = circleCenterY + circleRadius * Math.sin(endAngle - Math.PI / 2);

    const largeArcFlag = totalSegments <= 2 && totalSegments > 0 ? 1 : (anglePerSegment > Math.PI ? 1 : 0);

    const pathData = `M ${circleCenterX},${circleCenterY} L ${startX},${startY} A ${circleRadius},${circleRadius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
    return pathData;
}

function renderCircle() {
    if (!svgElement) return;
    svgElement.innerHTML = ''; 

    for (let i = 0; i < currentDenominator; i++) {
        const segmentPath = createSVGElement('path');
        segmentPath.setAttribute('d', calculateSegmentPath(i, currentDenominator));
        segmentPath.classList.add('fraction-segment');
        segmentPath.dataset.segmentIndex = i;

        if (i < selectedSegments) {
            segmentPath.classList.add('selected');
        }

        segmentPath.addEventListener('click', () => {
            toggleSegmentSelection(segmentPath, i);
            updateFractionText();
            checkUserChallenge(); 
        });
        svgElement.appendChild(segmentPath);
    }
    updateFractionText();
}

function toggleSegmentSelection(segmentElement, index) {
    segmentElement.classList.toggle('selected');
    selectedSegments = svgElement.querySelectorAll('.fraction-segment.selected').length;
}

function updateFractionText() {
    if (fractionTextElement) {
        fractionTextElement.textContent = `${selectedSegments} / ${currentDenominator}`;
    }
}

function changeDenominator(change) {
    const newDenominator = currentDenominator + change;
    if (newDenominator >= MIN_DENOMINATOR && newDenominator <= MAX_DENOMINATOR) {
        currentDenominator = newDenominator;
        if (selectedSegments > currentDenominator) {
            selectedSegments = currentDenominator;
        }
        // Or simply reset:
        // selectedSegments = 0; // Let's keep selected segments if possible, but cap at new denominator
        renderCircle();
        checkUserChallenge();
    }
}

let challengeTargetNumerator = null;
let challengeTargetDenominator = null;

function setupChallenge(num, den) {
    challengeTargetNumerator = num;
    challengeTargetDenominator = den;
    currentDenominator = den; 
    selectedSegments = 0;    
    renderCircle();
    if (feedbackElement) {
        feedbackElement.textContent = `Challenge: Select ${num}/${den}`;
        feedbackElement.className = 'fraction-feedback neutral';
    }
}

function checkUserChallenge() {
    if (challengeTargetNumerator === null || challengeTargetDenominator === null || !feedbackElement) {
        return; 
    }

    if (currentDenominator === challengeTargetDenominator && selectedSegments === challengeTargetNumerator) {
        feedbackElement.textContent = `Correct! You selected ${selectedSegments}/${currentDenominator}. Well done! 🎉`;
        feedbackElement.className = 'fraction-feedback correct';
    } else if (currentDenominator === challengeTargetDenominator) {
        feedbackElement.textContent = `Challenge: Select ${challengeTargetNumerator}/${challengeTargetDenominator}. You have ${selectedSegments}/${currentDenominator}.`;
        feedbackElement.className = 'fraction-feedback neutral';
    } else {
        feedbackElement.textContent = `Challenge: Select ${challengeTargetNumerator}/${challengeTargetDenominator}. Adjust the denominator to ${challengeTargetDenominator}.`;
        feedbackElement.className = 'fraction-feedback incorrect';
    }
}

export function initFractionExplorer(containerElementId) {
    const container = document.getElementById(containerElementId);
    if (!container) {
        console.error(`Fraction explorer container #${containerElementId} not found.`);
        return;
    }
    container.innerHTML = ''; 

    svgElement = createSVGElement('svg');
    svgElement.setAttribute('width', '240');
    svgElement.setAttribute('height', '240');
    svgElement.setAttribute('viewBox', '0 0 240 240');
    svgElement.classList.add('fraction-circle-svg');

    fractionTextElement = document.createElement('div');
    fractionTextElement.classList.add('fraction-text-display');

    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('fraction-controls');

    const minusButton = document.createElement('button');
    minusButton.textContent = '- Denominator';
    minusButton.addEventListener('click', () => changeDenominator(-1));

    const plusButton = document.createElement('button');
    plusButton.textContent = '+ Denominator';
    plusButton.addEventListener('click', () => changeDenominator(1));

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Selection';
    resetButton.addEventListener('click', () => {
        selectedSegments = 0;
        renderCircle();
        checkUserChallenge();
    });

    controlsDiv.appendChild(minusButton);
    controlsDiv.appendChild(plusButton);
    controlsDiv.appendChild(resetButton);

    const challengeDiv = document.createElement('div');
    challengeDiv.classList.add('fraction-challenge-area');
    challengeDiv.innerHTML = '<h4>Test Yourself!</h4>';

    const challengeButton5_10 = document.createElement('button');
    challengeButton5_10.textContent = 'Show 5/10';
    challengeButton5_10.addEventListener('click', () => setupChallenge(5, 10));

    const challengeButton2_3 = document.createElement('button');
    challengeButton2_3.textContent = 'Show 2/3';
    challengeButton2_3.addEventListener('click', () => setupChallenge(2, 3));

    feedbackElement = document.createElement('div');
    feedbackElement.classList.add('fraction-feedback');

    challengeDiv.appendChild(challengeButton5_10);
    challengeDiv.appendChild(challengeButton2_3);
    challengeDiv.appendChild(feedbackElement);

    container.appendChild(svgElement);
    container.appendChild(fractionTextElement);
    container.appendChild(controlsDiv);
    container.appendChild(challengeDiv);

    currentDenominator = 2; 
    selectedSegments = 0;
    renderCircle();
    challengeTargetNumerator = null; 
    challengeTargetDenominator = null;
    if(feedbackElement) feedbackElement.textContent = '';
}