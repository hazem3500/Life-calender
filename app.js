const calendar = document.querySelector('.calendar__content');
const ageElement = document.querySelector('.age__num');
const lifeForm = document.querySelector('#lifeForm');
const modal = document.querySelector('.modal');
const changeDataBtn = document.querySelector('#changeData');
const userData = JSON.parse(localStorage.getItem('userData')) || undefined;

function setMaxDate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = `0${dd}`;
    }
    if (mm < 10) {
        mm = `0${mm}`;
    }

    const todayText = `${yyyy}-${mm}-${dd}`;
    document.getElementById('bday').setAttribute('max', todayText);
}

function calculateLifeExpectancy({
    total_life_expectancy: lifeExpectancy,
    dob
}) {
    const now = new Date();
    const birthDate = new Date(dob);
    const diff = now.getTime() - birthDate.getTime();
    const daysLived = diff / 864e5;
    const monthsLived = daysLived/30.4375;
    const yearsLived = daysLived/365.24;
    let weeksLived = Math.floor(yearsLived * 52);

    const totalWeeks = Math.round(lifeExpectancy) * 52;

    let weeksElement = '<div></div>';

    for (let i = 0; i < 52; i++) {
        weeksElement += `<div class="number">${i + 1}</div>`;
    }

    for (let i = 0; i < totalWeeks; i++) {
        weeksElement += `
        ${i % 52 == 0 ? `<div class="number">${i / 52}</div>` : ''}
        <div id="${i + 1}" class="week ${
            weeksLived-- > 0 ? 'week-lived' : ''
        }"></div>`;
    }
    calendar.innerHTML = weeksElement;
    ageElement.innerHTML = `${Math.round(lifeExpectancy)}`;
}

setMaxDate();

function fadeModal() {
    modal.style.opacity = '0';
}

function fetchLifeExpectancy(e) {
    e.preventDefault();
    const country = e.target.country_name.value;
    const bday = e.target.bday.value;
    const gender = e.target.gender.value;
    fetch(`http://54.72.28.201:80/1.0/life-expectancy/total/${gender}/${country}/${bday}/
`)
        .then((res) => res.json())
        .then((res) => {
            fadeModal();
            localStorage.setItem('userData', JSON.stringify(res));
            calculateLifeExpectancy(res);
        });
}

function reset() {
    localStorage.removeItem('userData');
    window.location.reload();
}

lifeForm.addEventListener('submit', fetchLifeExpectancy);
modal.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'opacity') {
        modal.style.display = 'none';
    }
});
changeDataBtn.addEventListener('click', reset);

if (userData !== undefined) {
    modal.style.display = 'none';
    calculateLifeExpectancy(userData);
}
