class HelloService {
  greet(name) {
    let x = 0;
    for (let i = 1; i < 300000000; i++) {
      x = 6123 * 3423 + i;
    }

    // throw new Error('Somethin fukd up');

    return `Hello ${name} ${x}!`;
  }
}

module.exports = HelloService;