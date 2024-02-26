var sum_to_n_a = function(n) {
    let ans = 0
    for (let i = 1; i <= n; i++) {
      ans += i
    }
    return ans
};

var sum_to_n_b = function(n) {
    let ans = (n * (n + 1)) / 2;
    return ans
};

var sum_to_n_c = function(n) {
    let array = []
    for (let i = 0; i < n; i++) {
      array[i] = i + 1
    }

    return array.reduce((a,b) => a + b)
};

console.log(sum_to_n_c(5))