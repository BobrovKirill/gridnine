window.onload = function () {
  const form = document.querySelector('.header__form');

  renderTickets();

  //Button click

  document.addEventListener('click', function (e) {
    const target = e.target;
    if (target.classList.contains('tickets__btn')) {
      document.querySelector('.tickets__btn').classList.add('click');
      const formData = new FormData(form);
      const obj = Object.fromEntries(formData);
      renderTickets(obj);
    }
  });

  //readerForm

  form.addEventListener('input', function (e) {
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    renderTickets(obj);
  });

  //render tickets

  async function renderTickets(obj) {
    const file = '../json/flights.json';
    const padsedJson = await parsedJson(file);
    const filightsList = padsedJson.result.flights;
    addTickets(filightsList, obj);
    //return await filightsList;
  }

  function addTickets(filightsList, obj) {
    let ticketsListLength =
      document.querySelectorAll('.tickets__ticket').length;
    if (ticketsListLength > 1) {
      delAllCards(document.querySelectorAll('.tickets__ticket'));
    } else if (ticketsListLength === 0) {
      ticketsListLength += 2;
    }

    if (document.querySelector('.tickets__btn').classList.contains('click')) {
      ticketsListLength += 2;
      document.querySelector('.tickets__btn').classList.remove('click');
    }

    if (obj) {
      if (obj.sort === 'maxPrice') {
        filightsList = maxPriceSort(filightsList);
      } else if (obj.sort === 'minPrice') {
        filightsList = minPriceSort(filightsList);
      } else if (obj.sort === 'bestTime') {
        filightsList = bestTimeFlySort(filightsList);
      }
      if (obj.transfer) {
        filightsList = transferFilter(filightsList, obj.transfer);
      }

      if (obj.afterPrice) {
        filightsList = afterPriceFilter(filightsList, obj.afterPrice);
      }
      if (obj.beforePrice) {
        filightsList = beforPriceFilter(filightsList, obj.beforePrice);
      }
      if (obj.aircompany) {
        filightsList = aircompanyFilter(filightsList, obj.aircompany);
      }
      delAllCards(document.querySelectorAll('.tickets__ticket'));
      renderCard(
        filightsList.filter(
          (el) => filightsList.indexOf(el) < ticketsListLength
        )
      );
    } else {
      renderCard(
        filightsList.filter(
          (el) => filightsList.indexOf(el) < ticketsListLength
        )
      );
    }
  }

  //parsed Json

  async function parsedJson(file) {
    try {
      const response = await fetch(file, {
        metod: 'GET',
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  //render flights card

  function renderCard(filightsList) {
    const tickets = document.querySelector('.tickets__list');
    filightsList.forEach((el) => {
      // THERE
      const departureAirport =
        el.flight.legs[0].segments[0].departureAirport.caption;
      const departureAirportUid =
        el.flight.legs[0].segments[0].departureAirport.uid;
      const departureCity = el.flight.legs[0].segments[0].departureCity.caption;

      const arrivalAirport =
        el.flight.legs[0].segments[0].arrivalAirport.caption;
      const arrivalAirportUid =
        el.flight.legs[0].segments[0].arrivalAirport.uid;
      const arrivalCity = el.flight.legs[0].segments[0].arrivalCity.caption;

      const departureLength = el.flight.legs[0].segments.length - 1;

      const departureData = el.flight.legs[0].segments[0].departureDate;
      const departureTime = backTime(departureData);
      const [dayDep, fullDateDep] = backDate(departureData);

      const arrivalData =
        el.flight.legs[0].segments[el.flight.legs[0].segments.length - 1]
          .arrivalDate;
      const arrivalTime = backTime(arrivalData);
      const [dayArr, fullDateArr] = backDate(arrivalData);

      // GENERAL

      const price = el.flight.price.total.amount;
      const airlines = el.flight.carrier.caption;
      const airlinesCode = el.flight.carrier.airlineCode;

      // BACK

      const departureAirportBack =
        el.flight.legs[1].segments[0].departureAirport.caption;
      const departureAirportUidBack =
        el.flight.legs[1].segments[0].departureAirport.uid;
      const departureCityBack =
        el.flight.legs[1].segments[0].departureCity.caption;

      const arrivalAirportBack =
        el.flight.legs[1].segments[0].arrivalAirport.caption;
      const arrivalAirportUidBack =
        el.flight.legs[1].segments[0].arrivalAirport.uid;
      const arrivalCityBack = el.flight.legs[1].segments[0].arrivalCity.caption;

      const arrivalLengthBack = el.flight.legs[1].segments.length - 1;

      const departureDateBack = el.flight.legs[1].segments[0].departureDate;
      const departureTimeBack = backTime(departureDateBack);
      const [dayDepBack, fullDateDepBack] = backDate(departureDateBack);
      const arrivalDateBack =
        el.flight.legs[1].segments[el.flight.legs[1].segments.length - 1]
          .arrivalDate;
      const arrivalTimeBack = backTime(arrivalDateBack);
      const [dayArrBack, fullDateArrBack] = backDate(arrivalDateBack);

      let template = `
			<div class="tickets__ticket ticket">
				<div class="ticket__header header-ticket">
					<div class="header-ticket__logo"> <img src="/images/${airlinesCode}.svg" alt="logo"></div>
					<div class="header-ticket__body"> 
						<div class="header-ticket__price">${price} &#8381</div>
						<div class="header-ticket__text">Стоимость для одного взрослого пассажира</div>
					</div>
				</div>
				<div class="ticket__body body-ticket">
					<div class="body-ticket__header"> 
						<div class="body-ticket__left-header">${departureCity}, ${departureAirport}<span>(${departureAirportUid})</span></div>
						<div class="body-ticket__center-header">&rarr;</div>
						<div class="body-ticket__right-header">${arrivalCity}, ${arrivalAirport}<span>(${arrivalAirportUid})</span></div>
					</div>
					<div class="body-ticket__times"> 
						<div class="body-ticket__left-times">${departureTime}<span>${dayArr} ${makeDate(
        fullDateDep
      )}</span></div>
						<div class="body-ticket__center-times">${backTimeDiff(
              departureTime,
              arrivalTime,
              dayDep,
              dayArr
            )}</div>
						<div class="body-ticket__right-times">${arrivalTime}<span>${dayDep} ${makeDate(
        fullDateArr
      )}</span></div>
					</div>
					<div class="body-ticket__transfer">${departureLength} пересадка</div>
					<div class="body-ticket__footer">Рейс выполняет: ${airlinesCode} ${airlines}</div>
				</div>
				<div class="ticket__line"> </div>
				<div class="ticket__body body-ticket">
					<div class="body-ticket__header"> 
						<div class="body-ticket__left-header">${departureCityBack}, ${departureAirportBack}<span>(${departureAirportUidBack})</span></div>
						<div class="body-ticket__center-header">&rarr;</div>
						<div class="body-ticket__right-header">${arrivalCityBack}, ${arrivalAirportBack}<span>(${arrivalAirportUidBack})</span></div>
					</div>
					<div class="body-ticket__times"> 
						<div class="body-ticket__left-times">${departureTimeBack}<span>${dayDepBack} ${makeDate(
        fullDateDepBack
      )}</span></div>
						<div class="body-ticket__center-times">${backTimeDiff(
              departureTimeBack,
              arrivalTimeBack,
              dayDepBack,
              dayArrBack
            )}</div>
						<div class="body-ticket__right-times">${arrivalTimeBack}<span>${dayArrBack} ${makeDate(
        fullDateArrBack
      )}</span></div>
					</div>
					<div class="body-ticket__transfer">${
            arrivalLengthBack === 0 ? 'без' : arrivalLengthBack
          } пересадок</div>
					<div class="body-ticket__footer">Рейс выполняет: ${airlinesCode} ${airlines}</div>
				</div>
				<button class="ticket__btn">ВЫБРАТЬ</button>
			</div>
		`;
      tickets.insertAdjacentHTML('beforeend', template);
    });
  }

  function backTime(data) {
    return data.substr(11, 5);
  }

  function backTimeDiff(timeDep, timeArr, dayDep, dayArr) {
    const deyDiff = dayArr - dayDep;
    const secsDep = toSeconds(timeDep);
    const secsArr = toSeconds(timeArr, deyDiff);
    const resultSecs = secsArr - secsDep;

    let hours = Math.floor(resultSecs / 60 / 60);
    let mins = Math.floor(resultSecs / 60) - hours * 60;

    return `${hours} ч ${mins} мин`;
  }
  function toSeconds(time, day = 0) {
    let [hoursStr, minsStr] = time.split(':');
    let hours = Number(hoursStr);
    let mins = Number(minsStr);
    let secs = 0;
    hours += day * 24;
    mins += hours * 60;
    secs += mins * 60;

    return secs;
  }

  function backDate(data) {
    const fullDate = data.substr(0, 10);
    const day = data.substr(8, 2);
    return [day, fullDate];
  }

  function makeDate(data) {
    const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const mounts = {
      '01': 'янв',
      '02': 'фев',
      '03': 'мрт',
      '04': 'апр',
      '05': 'май',
      '06': 'июн',
      '07': 'июл',
      '08': 'авг',
      '09': 'сен',
      10: 'окт',
      11: 'ноя',
      12: 'дек',
    };
    const [year, mount, day] = data.split('-');
    let date = new Date(year, mount, day);
    return `${mounts[String(mount)]}. ${days[date.getDay()]}`;
  }
  function delAllCards(cardsList) {
    return cardsList.forEach((el) => el.remove());
  }

  // sorts functions

  function maxPriceSort(list) {
    return list.sort((a, b) =>
      Number(a.flight.price.total.amount) > Number(b.flight.price.total.amount)
        ? -1
        : 1
    );
  }
  function minPriceSort(list) {
    return list.sort((a, b) =>
      Number(a.flight.price.total.amount) > Number(b.flight.price.total.amount)
        ? 1
        : -1
    );
  }
  function bestTimeFlySort(list) {
    return list.sort((a, b) => {
      const aTimeDep = backTime(a.flight.legs[0].segments[0].departureDate);
      const aTimeArr = backTime(
        a.flight.legs[0].segments[a.flight.legs[0].segments.length - 1]
          .arrivalDate
      );
      const aTimeDepBack = backTime(a.flight.legs[1].segments[0].departureDate);
      const aTimeArrBack = backTime(
        a.flight.legs[1].segments[a.flight.legs[1].segments.length - 1]
          .arrivalDate
      );

      const bTimeDep = backTime(b.flight.legs[0].segments[0].departureDate);
      const bTimeArr = backTime(
        b.flight.legs[0].segments[b.flight.legs[0].segments.length - 1]
          .arrivalDate
      );
      const bTimeDepBack = backTime(b.flight.legs[1].segments[0].departureDate);
      const bTimeArrBack = backTime(
        b.flight.legs[1].segments[b.flight.legs[1].segments.length - 1]
          .arrivalDate
      );

      const aDiff = toSeconds(aTimeArr) - toSeconds(aTimeDep);
      const aDiffBack = toSeconds(aTimeArrBack) - toSeconds(aTimeDepBack);
      const bDiff = toSeconds(bTimeArr) - toSeconds(bTimeDep);
      const bDiffBack = toSeconds(bTimeArrBack) - toSeconds(bTimeDepBack);

      return Math.abs(aDiff) + Math.abs(aDiffBack) >
        Math.abs(bDiff) + Math.abs(bDiffBack)
        ? 1
        : -1;
    });
  }
  function transferFilter(list, transfer) {
    return list.filter(
      (el) =>
        el.flight.legs[0].segments.length - 1 === Number(transfer) ||
        el.flight.legs[1].segments.length - 1 === Number(transfer)
    );
  }
  function afterPriceFilter(list, afterPrice) {
    return list.filter(
      (el) => Number(el.flight.price.total.amount) > Number(afterPrice)
    );
  }
  function beforPriceFilter(list, beforePrice) {
    return list.filter(
      (el) => Number(beforePrice) > Number(el.flight.price.total.amount)
    );
  }

  function aircompanyFilter(list, aircompany) {
    return list.filter((el) => el.flight.carrier.airlineCode === aircompany);
  }
};
