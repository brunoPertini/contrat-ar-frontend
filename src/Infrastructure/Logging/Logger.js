export default class Logger {
  static log(message) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ERROR MESSAGE: ', message);
    }
  }
}
