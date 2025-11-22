//Sum of an integer practice project
document.querySelector(".my-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the page from refreshing
  
    // Code to get the number and show result will go here
    var num = parseInt(document.querySelector("#enterNumber").value);
    document.querySelector("#numberResult").textContent = "The sum of all integers from 0 to " + num + " is: " + totalSum(num);
});
var totalSum = function (num) {
    var sum = 0;
    for (var i = 0; i <= num; i++) {
        sum += i;
    }
    return sum;
}