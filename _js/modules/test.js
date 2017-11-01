const test = 12345;

console.log(test);

var test2 = new Promise();

if (process.env.NODE_ENV === "development") {
  console.log('dev only');
}
