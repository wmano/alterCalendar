<script>
export default {
  data() {
    return {
      date: new Date(),
      oldDate: new Date().getFullYear(),
      weeks: [],
      monthNumber: 0,
      monthName: '',
      year: '',
      feastDays: {},
      easterDate: new Date(),
      months: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ]
    };
  },

  methods: {
    dateDiffInDays(date1, date2) {
      const timeDiff = date2.getTime() - date1.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },
    getApostlesFastDuration(year) {
      const orthodoxEasterDate = new Date(this.easterDate);
      const apostlesFastStartDate = new Date(orthodoxEasterDate);
      apostlesFastStartDate.setDate(apostlesFastStartDate.getDate() + 8 * 7);
      return this.dateDiffInDays(apostlesFastStartDate, new Date(`${year}-06-28`)) - 1
    },
    greekEaster(year) {
      let a = year % 19;
      let b = year % 7;
      let c = year % 4;
      let d = (19 * a + 16) % 30;
      let e = (2 * c + 4 * b + 6 * d) % 7;
      let f = d + e + 3;
      let month = (f > 30) ? 5 : 4;
      f = (f > 30) ? f - 30 : f;
      return new Date(`${year}-${month}-${f}`)
    },
    getFestDates(year){
      // Erzeugt alle Fastentage und noch mehr die dann bereinigt werden müssen
      let extraDays = [new Date(`${year}-01-05`), new Date(`${year}-09-14`), new Date(`${year}-08-29`)]
      for (const day of extraDays){
        this.feastDays[`${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`] = "full"
      }
      //Osterfastenzeit
      let easterDate = new Date(this.easterDate)
      for (let i = 0; i < 48; i++){
        easterDate.setDate(easterDate.getDate() - 1);
        this.feastDays[`${easterDate.getFullYear()}-${easterDate.getMonth()+1}-${easterDate.getDate()}`] = "full"
      }

      const EndCheeseFeast = new Date(easterDate)

      //Vor der Osterfastenzeit wird nur auf Fleisch verzichtet
      for (let i = 0; i < 7; i++){
        easterDate.setDate(easterDate.getDate() - 1);
        this.feastDays[`${easterDate.getFullYear()}-${easterDate.getMonth()+1}-${easterDate.getDate()}`] = "cheese"
      }

      const StartCheeseFeast = new Date(easterDate)

      //Fastenzeit für die Theotokos
      let dekapentavgoustos = new Date(`${year}-08-15`)
      for (let i = 0; i < 14; i++){
        dekapentavgoustos.setDate(dekapentavgoustos.getDate() - 1);
        if (i === 8) {
          this.feastDays[`${dekapentavgoustos.getFullYear()}-${dekapentavgoustos.getMonth() + 1}-${dekapentavgoustos.getDate()}`] = "fish"
        } else {
          this.feastDays[`${dekapentavgoustos.getFullYear()}-${dekapentavgoustos.getMonth() + 1}-${dekapentavgoustos.getDate()}`] = "wine"
        }
      }
      //Fastenzeit für die Apostel wird berechnet.
      //Ist immer am selben Tag aber die dauer Variiert
      let apostelFestDate = new Date(`${year}-06-29`)
      for (let i=0; i < this.getApostlesFastDuration(year); i++){
        apostelFestDate.setDate(apostelFestDate.getDate() - 1);
        this.feastDays[`${apostelFestDate.getFullYear()}-${apostelFestDate.getMonth()+1}-${apostelFestDate.getDate()}`] = "fish"
      }
      //Letzte Woche der Weihnachtsfastenzeit wird richtig gefastet
      let christmaxDay = new Date(`${year}-12-25`)
      for (let i = 0; i < 7; i++){
        christmaxDay.setDate(christmaxDay.getDate() - 1);
        this.feastDays[`${christmaxDay.getFullYear()}-${christmaxDay.getMonth()+1}-${christmaxDay.getDate()}`] = "wine"
      }
      //Die Wochen davor wird nur auf Fisch gefastet
      for (let i = 0; i < 33; i++){
        christmaxDay.setDate(christmaxDay.getDate() - 1);
        this.feastDays[`${christmaxDay.getFullYear()}-${christmaxDay.getMonth()+1}-${christmaxDay.getDate()}`] = "fish"
      }

      //Der Teil wird genutzt um alle Mittwoche und Freitage zu berechnen und die zu überspringen an denen man nicht fastet
      const Christmas = new Date(`${this.date.getFullYear()}-12-25`)
      const Jan4 = new Date(`${this.date.getFullYear()}-01-04`)

      //Muss nochmal neu berechnet werden, da die vorherige Variable mit dem loop verändert wurde
      easterDate = new Date(this.easterDate)
      const FirstWeekAfterEaster = new Date(easterDate)
      FirstWeekAfterEaster.setDate(FirstWeekAfterEaster.getDate() + 7)

      //Die Variable ist schon auf den Anfang der Fastenzeit gestellt
      const WeekBeforeApostleFeastStart = new Date(apostelFestDate)
      WeekBeforeApostleFeastStart.setDate(WeekBeforeApostleFeastStart.getDate() - 7)

      const daysInYear = year % 4 === 0 ? 366 : 365;
      let endDate = new Date(`${year}-12-31`)
      for (let i = 0; i < daysInYear; i++){
        if ((endDate >= Christmas || endDate <= Jan4) ||
            (endDate >= easterDate && endDate <= FirstWeekAfterEaster) ||
            (WeekBeforeApostleFeastStart <= endDate && endDate <= apostelFestDate) ||
            (StartCheeseFeast <= endDate && endDate <= EndCheeseFeast)){
          endDate.setDate(endDate.getDate() - 1);
          continue
        }
        if ((endDate.getDay() === 3 || endDate.getDay() === 5) &&
            (this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] !== "full")){
          this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] = "full"
        }
        endDate.setDate(endDate.getDate() - 1);
      }
      this.correctFeastDays(easterDate)
    },
    correctFeastDays(easterDate){
      const DayBeforeEaster = new Date(easterDate)
      DayBeforeEaster.setDate(DayBeforeEaster.getDate() - 1)

      const FridayBeforeEaster = new Date(easterDate)
      FridayBeforeEaster.setDate(FridayBeforeEaster.getDate() - 2)

      const year = easterDate.getFullYear()
      const daysInYear = year % 4 === 0 ? 366 : 365;
      let endDate = new Date(`${year}-12-31`)
      for (let i = 0; i < daysInYear; i++){
        if (!(`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}` in this.feastDays)){
          this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] = "-"
        }
        // Datentypen sind nicht komplett gleich, deshalb ist dieser vergleich notwendig
        if (this.dateDiffInDays(endDate, easterDate) === 0){
          this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] = "easter"
          endDate.setDate(endDate.getDate() - 1);
          continue
        }
        if (this.dateDiffInDays(endDate, DayBeforeEaster) === 0){
          this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] = "full"
          endDate.setDate(endDate.getDate() - 1);
          continue
        }
        if (this.dateDiffInDays(endDate, FridayBeforeEaster) === 0){
          this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] = "full"
          endDate.setDate(endDate.getDate() - 1);
          continue
        }
        if ((endDate.getDay() === 0 || endDate.getDay() === 6) &&
            (this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] !== "-")
            && (this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] !== "cheese")){
          this.feastDays[`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`] = "wine"
        }
        endDate.setDate(endDate.getDate() - 1);
      }

      const OneWeekBeforeEaster = new Date(easterDate)
      OneWeekBeforeEaster.setDate(OneWeekBeforeEaster.getDate() - 7)
      this.feastDays[`${OneWeekBeforeEaster.getFullYear()}-${OneWeekBeforeEaster.getMonth()+1}-${OneWeekBeforeEaster.getDate()}`] = "fish"
      this.feastDays[`${easterDate.getFullYear()}-3-25`] = "fish"
    },
    calcMonth(year, month){
      //Berechnet die Tage des Monats und zeigt das heutige Datum an
      const todayDate = new Date()
      const todayDay = todayDate.getDate()
      this.weeks = [];

      const numDays = new Date(year, month+1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month+1, 0).getDay();
      let allDays = [];
      allDays = allDays.concat(Array(firstDay).fill("-"))
      for (let day = 1; day <= numDays; day ++){
        if (day !== todayDay){
          allDays.push({date: day, isToday: false})
        } else {
          if (todayDate.getFullYear() === year && todayDate.getMonth() === month){
            allDays.push({date: day, isToday: true})
          } else{
            allDays.push({date: day, isToday: false})
          }
        }
      }
      allDays = allDays.concat(Array(6 - lastDay).fill("-"))

      for (let i = 0; i < Math.ceil(allDays.length/7); i++){
        this.weeks.push(allDays.slice(7*i, 7*(i+1)))
      }
    },
    setTitle(){
      const months = [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ]
      this.monthNumber = this.date.getMonth() + 1
      this.monthName = months[this.monthNumber - 1]
      this.year = this.date.getFullYear()
    },
    prevMonth(){
      this.date.setDate(1)
      this.date.setMonth(this.date.getMonth() - 1)
      this.setTitle()
      this.calcMonth(this.date.getFullYear(), this.date.getMonth());
      if (this.date.getFullYear() !== this.oldDate){
        this.oldDate = this.date.getFullYear()
        this.easterDate = this.greekEaster(this.date.getFullYear())
        this.getFestDates(this.date.getFullYear())
      }
    },
    nextMonth(){
      this.date.setDate(1)
      this.date.setMonth(this.date.getMonth() + 1)
      this.setTitle()
      this.calcMonth(this.date.getFullYear(), this.date.getMonth());
      if (this.date.getFullYear() !== this.oldDate){
        this.oldDate = this.date.getFullYear()
        this.easterDate = this.greekEaster(this.date.getFullYear())
        this.getFestDates(this.date.getFullYear())
      }
    }
  },
  mounted() {
    this.easterDate = this.greekEaster(this.date.getFullYear())
    this.getFestDates(this.date.getFullYear())
    this.setTitle()
    this.calcMonth(this.date.getFullYear(), this.date.getMonth());
  },
};
</script>

<template>
  <div class="page-start">
    <div class="calendar-header">
      <button @click="prevMonth" class="calendar-button"><font-awesome-icon icon="arrow-left" /></button>
      <h2 class="calendar-date-title">{{ monthName }} {{ year }}</h2>
      <button @click="nextMonth" class="calendar-button"><font-awesome-icon icon="arrow-right" /></button>
    </div>
    <table class="calendar-table">
      <thead>
      <tr>
        <th class="calendar-week-day">
          <span class="full">Sonntag</span>
          <span class="abbreviated">So</span>
        </th>
        <th class="calendar-week-day">
          <span class="full">Montag</span>
          <span class="abbreviated">Mo</span>
        </th>
        <th class="calendar-week-day">
          <span class="full">Dienstag</span>
          <span class="abbreviated">Di</span>
        </th>
        <th class="calendar-week-day">
          <span class="full">Mittwoch</span>
          <span class="abbreviated">Mi</span>
        </th>
        <th class="calendar-week-day">
          <span class="full">Donnerstag</span>
          <span class="abbreviated">Do</span>
        </th>
        <th class="calendar-week-day">
          <span class="full">Freitag</span>
          <span class="abbreviated">Fr</span>
        </th>
        <th class="calendar-week-day">
          <span class="full">Samstag</span>
          <span class="abbreviated">Sa</span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="week in weeks" :key="week">
        <td v-for="day in week" :class="{ 'today': day.isToday, 'not-today': !day.isToday }">
          <div class="calendar-day-box">
            <p class="calendar-day-text">{{ day.date }}</p>
            <p v-if="this.feastDays[`${year}-${monthNumber}-${day.date}`] === 'fish'" style="color:#04affa" class="calendar-feast-symbol"><font-awesome-icon icon="fa-solid fa-fish" /></p>
            <p v-else-if="this.feastDays[`${year}-${monthNumber}-${day.date}`] === 'cheese'" style="color:#ffb700" class="calendar-feast-symbol"><font-awesome-icon icon="fa-solid fa-cheese" /></p>
            <p v-else-if="this.feastDays[`${year}-${monthNumber}-${day.date}`] === 'wine'" style="color:purple" class="calendar-feast-symbol"><font-awesome-icon icon="fa-solid fa-wine-bottle" /></p>
            <p v-else-if="this.feastDays[`${year}-${monthNumber}-${day.date}`] === 'full'" style="color:#b41212" class="calendar-feast-symbol"><font-awesome-icon icon="fa-solid fa-cross" /></p>
            <p v-else-if="this.feastDays[`${year}-${monthNumber}-${day.date}`] === 'easter'" style="color:#b41212" class="calendar-feast-symbol"><font-awesome-icon icon="fa-solid fa-egg" /></p>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <p class="calendar-easter-date">Ostern am: {{this.easterDate.getDate()}}. {{this.months[this.easterDate.getMonth()]}} {{this.easterDate.getFullYear()}}</p>
  <h1 class="calendar-legende-header">Fastenkalender Legende</h1>
  <div class="calendar-legende">

    <div class="calendar-legende-eintrag">
      <p style="color:#b41212" class="calendar-legende-text"><font-awesome-icon icon="fa-solid fa-cross" /></p><p class="calendar-legende-text"><b>Strenges Fasten:</b> Verzichten Sie auf Fleisch, Fisch, Öl, Wein, Milchprodukte und Eier.</p>
    </div>
    <div class="calendar-legende-eintrag">
      <p style="color:purple" class="calendar-legende-text"><font-awesome-icon icon="fa-solid fa-wine-bottle" /></p><p class="calendar-legende-text"><b>Wein und Öl:</b> Wein und Öl sind erlaubt. Verzichten Sie auf Fleisch, Fisch, Milchprodukte und Eier.</p>
    </div>
    <div class="calendar-legende-eintrag">
      <p style="color:#04affa" class="calendar-legende-text"><font-awesome-icon icon="fa-solid fa-fish" /></p><p class="calendar-legende-text"><b>Fisch, Öl und Wein sind erlaubt:</b> Verzichten Sie auf Fleisch, Milchprodukte und Eier.</p>
    </div>
    <div class="calendar-legende-eintrag">
      <p style="color:#ffcc00" class="calendar-legende-text"><font-awesome-icon icon="fa-solid fa-cheese" /></p><p class="calendar-legende-text"><b>Molkereiprodukte sind erlaubt:</b> Molkereiprodukte, Eier, Fisch, Öl und Wein sind erlaubt. Verzichten Sie auf Fleisch.</p>
    </div>
  </div>
</template>

<style>
.wann-fasten-wir{
  text-align: left;
  padding: 20px;
  font-size: 25px;
  margin-left: 10vw;
  margin-right: 10vw;
}

.calendar-easter-date{
  text-align: center;
  padding: 20px;
  font-size: 25px;
}

.calendar-legende{
  padding: 15px;
  margin-left: 10vw;
  margin-right: 10vw;
}

.calendar-legende-header{
  text-align: center;
  margin-top: 20px;
}

.calendar-legende-eintrag{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

b {
  font-weight: bold;
}

.calendar-legende-text{
  padding: 10px;
}

.calendar-date-title{
  width: 200px;
  text-align: center;
}

table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid black;
  padding: 5px;
}

.today, .not-today{
  height: 80px;
  width: 90px;
}

.calendar-day-text{
  margin-top: -35px;
  text-align: left;
}

.today {
  background-color: rgba(162, 255, 0, 0.5);
}

.calendar-header {
  margin-bottom: 20px;
  align-self: center;
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
 }

.calendar-button{
  padding: 2px 10px;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
}

.calendar-table{
  height: 100%;
  width: 100%;
  min-width: 630px;
  min-height: 480px;
  max-width: 1000px;
}

.calendar-feast-symbol{
  margin-top: -20px;
  text-align: right;
  font-size: 30px;
}

.calendar-week-day .abbreviated {
  display: none;
}

@media screen and (max-width: 800px){
  .calendar-week-day .abbreviated {
    display: inline;
  }
  .calendar-week-day .full {
    display: none;
  }

  .calendar-legende{
    padding: 15px;
    margin-left: 0;
    margin-right: 0;
  }

  th,
  td {
    border: 1px solid black;
  }

  .today, .not-today{
    height: 80px;
    max-width: 30px;
  }

  .calendar-day-text{
    margin-top: 0;
    text-align: center;
  }

  .calendar-feast-symbol{
    margin-top: 10px;
    margin-bottom: 0;
    text-align: center;
    font-size: 20px;
  }

  .today {
    background-color: rgba(162, 255, 0, 0.5);
  }

  .calendar-table{
    height: 100%;
    width: 100%;
    max-width: 800px;
    min-width: 250px;
  }
}

</style>
