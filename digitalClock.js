(() => {
  // map of which block indices are activated for digit
  const DIGIT_MAP = {
    1: [3, 6],
    2: [1, 3, 4, 5, 7],
    3: [1, 3, 4, 6, 7],
    4: [2, 3, 4, 6],
    5: [1, 2, 4, 6, 7],
    6: [2, 4, 5, 6, 7],
    7: [1, 3, 6],
    8: [1, 2, 3, 4, 5, 6, 7],
    9: [1, 2, 3, 4, 6],
    0: [1, 2, 3, 5, 6, 7]
  };

  // ==============
  // Base Digit
  // ==============
  class Digit {
    constructor(containerSelector, num) {
      this.blocks = document.querySelectorAll(`${containerSelector} .digit .block`);

      if (num !== undefined) this.activate(num);
    }

    clear() {
      for (let i = 0; i < this.blocks.length; i++) {
        this.blocks[i].classList.remove('active');
      }
    }

    activate(num) {
      this.clear();
      const ids = DIGIT_MAP[num];
      if (!ids) return;

      ids.forEach(id => {
        this.blocks[id-1].classList.add('active');
      })
    }
  }

  // ==============
  // Digital Clock
  // ==============
  class DigitalClock {
    constructor() {
      // DOM elements
      this.digitTemplate = document.getElementById('digit-template');
      this.digitalClockEl = document.querySelector('.digital-clock');
      this.digitEls = document.querySelectorAll('.digital-clock .clock-digit');
      this.startBtn = document.querySelector('.digital-clock .start');
      this.stopBtn = document.querySelector('.digital-clock .stop');
      // arrays to hold digit instances
      this.hourInstances = [];
      this.minuteInstances = [];
      this.secondInstances = [];

      this.intervalId = null;

      // Initial Setup
      this.mountDigits();
      this.startBtn.addEventListener('click', this.startClock.bind(this));
      this.stopBtn.addEventListener('click', this.stopClock.bind(this));
    }

    mountDigits() {
      Array.from(this.digitEls).forEach((el, index) => {
        el.appendChild(this.digitTemplate.content.cloneNode(true));
        let digitName = el.classList[1];

        switch (index) {
          case 0:
          case 1:
            this.hourInstances.push(new Digit(`.${digitName}`));
            break;
          case 2:
          case 3:
            this.minuteInstances.push(new Digit(`.${digitName}`));
            break;
          case 4:
          case 5:
            this.secondInstances.push(new Digit(`.${digitName}`));
            break;
        }
      })
    }

    startClock() {
      if (this.intervalId) return;

      this.intervalId = setInterval(() => {
        let now = new Date();

        this.displayTime(now.getHours(), this.hourInstances);
        this.displayTime(now.getMinutes(), this.minuteInstances);
        this.displayTime(now.getSeconds(), this.secondInstances);
      }, 1000);
    }

    stopClock() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.hourInstances.forEach(item => item.clear());
      this.minuteInstances.forEach(item => item.clear());
      this.secondInstances.forEach(item => item.clear());
    }

    displayTime(timeNow, digitInstances) {
      let stringTime = timeNow.toString();

      if (stringTime.length < 2) {
        digitInstances[0].activate(0);
        digitInstances[1].activate(stringTime[0]);
      } else {
        digitInstances[0].activate(stringTime[0]);
        digitInstances[1].activate(stringTime[1]);
      }
    }
  }

  // ==============
  // Counter
  // ==============
  class Counter {
    constructor() {
      this.digitTemplate = document.getElementById('digit-template');
      this.counterEl = document.querySelector('.counter');
      this.startBtn = document.querySelector('.counter .start');
      this.stopBtn = document.querySelector('.counter .stop');
      this.count = 1;
      this.digit;
      this.intervalId = null;

      // Initial setup
      this.mountDigit();
      this.startBtn.addEventListener('click', this.startInterval.bind(this));
      this.stopBtn.addEventListener('click', this.stopInterval.bind(this));
    }

    mountDigit() {
      this.counterEl.appendChild(this.digitTemplate.content.cloneNode(true));
      this.digit = new Digit('.counter');
    }

    startInterval() {
      if (this.intervalId) return;

      this.intervalId = setInterval(() => {
        this.digit.activate(this.count % 10);
        this.count += 1;
      }, 1000);
    }

    stopInterval() {
      clearInterval(this.intervalId);
      // reset
      this.digit.clear();
      this.count = 0;
      this.intervalId = null;
    }
  }

  let counter = new Counter();
  let digitalClock = new DigitalClock();
})();
