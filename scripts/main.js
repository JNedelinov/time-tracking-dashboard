const userCard = `<div class="user-card">
        <div class="user">
          <div class="avatar">
            <img src="/images/image-jeremy.png" alt="" />
          </div>
          <div class="name">
            <p>Report for</p>
            <p>Jeremy Robson</p>
          </div>
        </div>
        <div class="time-span">
          <button class="btn active">Daily</button>
          <button class="btn">Weekly</button>
          <button class="btn">Monthly</button>
        </div>
      </div>
`;

(async () => {
  container.classList.toggle('loading');
  container.innerHTML = `<div>Loading...<div>`;

  const data = await (await fetch('../data.json')).json();
  container.classList.toggle('loading');

  if (data == null) {
    container.classList.toggle('no-data');
    container.innerHTML = `<div>No data...</div>`;
  } else {
    container.innerHTML = userCard;
    renderTimesheets('daily', data);

    let currentlyActiveBtn = document.querySelector(
      '.user-card .time-span button.btn.active',
    );

    document
      .querySelectorAll('.user-card .time-span button.btn')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (e.target.textContent !== currentlyActiveBtn.textContent) {
            currentlyActiveBtn.classList.remove('active');
            e.target.classList.add('active');
            currentlyActiveBtn = e.target;
            renderTimesheets(e.target.textContent.toLowerCase(), data);
          }
        });
      });
  }
})();

function renderTimesheets(timeRange, data) {
  const timesheetCards = container.querySelectorAll('.timesheet-card');

  if (timesheetCards.length > 0) {
    timesheetCards.forEach((timesheetCard) => timesheetCard.remove());
  }

  console.log(container.innerHTML);

  let prevTime = null;
  switch (timeRange) {
    case 'daily':
      prevTime = 'Yesterday';
      break;
    case 'weekly':
      prevTime = 'Last week';
      break;
    case 'monthly':
      prevTime = 'Last month';
      break;
  }

  data.forEach(({ title, timeframes }) => {
    const titleLC = title.toLowerCase();
    const iconName =
      titleLC.length > 1 ? titleLC.split(' ').join('-') : titleLC;
    // ! SOMETHING THAT I LEARNED - insertAdjacentHTML
    container.insertAdjacentHTML(
      'beforeend',
      `<div class="timesheet-card ${iconName}">
        <div class="banner">
          <img src="./images/icon-${iconName}.svg" alt="${titleLC} icon" />
        </div>
        <div class="category">
          <div class="info">
            <p>${title}</p>
            <button class="btn">...</button>
          </div>
          <div class="total-time">
            <p class="curr-hours">${timeframes[timeRange].current}hrs</p>
            <p class="prev-hours">${prevTime} - ${timeframes[timeRange].previous}hrs</p>
          </div>
        </div>
      </div>`,
    );
  });
}
