module.exports = {
  toExist: (received) => {
    const pass = received !== null;

    if (pass) {
      return {
        message: () => 'Expected element not to exist, but it does.',
        pass: true,
      };
    }

    return {
      message: () => 'Expected element to exist, but it does not.',
      pass: false,
    };
  },
};