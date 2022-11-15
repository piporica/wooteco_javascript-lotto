const { Console, Random } = require("@woowacourse/mission-utils");
const { MESSAGES, WIN_CONDITIONS, RESULT_MESSAGE } = require("./lib/constant");
const Lotto = require("./Lotto");

class App {
  async play() {
    let lottoCount = await this.getAmountPaid();
    let lottos = this.issueLottos(lottoCount);
    this.printLottos(lottos, lottoCount);
    let winningNumbers = await this.getWinningNumbers();
    let bonusNumber = await this.getBonusNumbers();

    this.countWinLottos(lottos, winningNumbers, bonusNumber);
    this.printResult();
    this.printRevenue(lottoCount);
    this.appClose();
  }

  getAmountPaid() {
    return new Promise((resolve) => {
      Console.readLine(MESSAGES.TAKE_MONEY, (input) => {
        resolve(input / 1000);
      });
    });
  }

  issueLottos(count) {
    let lottos = [];
    for (let i = 0; i < count; i++) {
      let randomNums = Random.pickUniqueNumbersInRange(1, 45, 6);
      randomNums = randomNums.sort((a, b) => a - b);
      let lotto = new Lotto(randomNums);
      lottos.push(lotto);
    }
    return lottos;
  }

  getWinningNumbers() {
    return new Promise((resolve) => {
      Console.readLine(MESSAGES.TAKE_WINNING_NUMBERS, (input) => {
        let winnigNumbers = input.split(",").map((x) => Number(x));
        resolve(winnigNumbers);
      });
    });
  }

  getBonusNumbers() {
    return new Promise((resolve) => {
      Console.readLine(MESSAGES.TAKE_BONUS_NUMBERS, (input) => {
        resolve(Number(input));
      });
    });
  }

  countWinLottos(lottos, winnigNumbers, bonusNumber) {
    lottos.forEach((lotto) => {
      let winNumbers = lotto.countWinNumbers(winnigNumbers, bonusNumber);
      this.findConditions(winNumbers);
    });
  }

  getRevenue() {
    let revenue = 0;
    WIN_CONDITIONS.forEach((condition) => {
      revenue += condition.winPrice * condition.count;
    });

    return revenue;
  }

  findConditions(winNumbers) {
    WIN_CONDITIONS.forEach((condition) => {
      if (condition.winCount == winNumbers.winCount && !condition.checkBonus) {
        condition.count += 1;
      }
      if (
        condition.winCount == winNumbers.winCount &&
        condition.checkBonus &&
        condition.isBonus == winNumbers.isBonus
      ) {
        condition.count += 1;
      }
    });
  }

  printLottos(lottos, count) {
    Console.print(RESULT_MESSAGE.COUNT_MESSAGE(count));
    lottos.forEach((lotto) => {
      Console.print(lotto.getNumbers());
    });
  }

  printResult() {
    Console.print(MESSAGES.RESULT_TITLE);
    Console.print(MESSAGES.RESULT_LINE);
    WIN_CONDITIONS.forEach((condition) => {
      Console.print(
        RESULT_MESSAGE.WIN_MESSAGES(
          condition.winCount,
          condition.winPrice,
          condition.count,
          condition.isBonus
        )
      );
    });
  }

  printRevenue(lottoCount) {
    let revenue = this.getRevenue();
    let revenueRate = (revenue / (lottoCount * 1000)) * 100;
    Console.print(RESULT_MESSAGE.REVENUE_MESSAGE(revenueRate));
  }
  appClose() {
    Console.close();
  }
}

module.exports = App;

let app = new App();
app.play();
