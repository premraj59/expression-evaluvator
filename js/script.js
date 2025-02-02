$(document).ready(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/js/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    "use strict";
    
    // show the sidebar
    $('#menu').click(function () {
        $('.sidebar').addClass('sidebar-show');
    });
    // hide the sidebar
    $('#hide').click(function () {
        $('.sidebar').removeClass('sidebar-show');
    });

    // change theme
    // color-1
    $('#theme-purple').click(function () {
        $('#main').css({"background": "#4caf50"});
        $('.op').css({"color": "#4caf50"});
        $('.num-button').css({"color": "#4caf50"});
    });
    // color-2
    $('#theme-red').click(function () {
        $('#main').css({"background": "#f321a9"});
        $('.op').css({"color": "#f321a9"});
        $('.num-button').css({"color": "#f321a9"});
    });
    // color-3
    $('#theme-blue').click(function () {
        $('#main').css({"background": "#32d0d0"});
        $('.op').css({"color": "#32d0d0"});
        $('.num-button').css({"color": "#32d0d0"});
    });
    // color-4
    $('#theme-green').click(function () {
        $('#main').css({"background": "#b2da9d"});
        $('.op').css({"color": "#b2da9d"});
        $('.num-button').css({"color": "#b2da9d"});
    });
	// color-5
    $('#theme-bluegreen').click(function () {
        $('#main').css({"background": "#70b5fe"});
        $('.op').css({"color": "#70b5fe"});
        $('.num-button').css({"color": "#70b5fe"});
    });
    // color-6
    $('#theme-black').click(function () {
        $('#main').css({"background": "#ff5722"});
        $('.op').css({"color": "#ff5722"});
        $('.num-button').css({"color": "#ff5722"});
    });
});

// manages scaling
let siteWidth = 480;
let scale = screen.width/siteWidth

document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');

var dec = false;  // tracks if decimal has been entered
var operator = false;  // tracks if an operator has been entered 
var ansFound = false;  // tracks if ans has been calculated
var accuracy = 2;  // determines the number of decimal places to show
var ans = 0;  // the result
var mod = 1;

// automatically scrolls to the rightmost side of the result window
function autoScroll() {
    document.getElementById("result").scrollLeft = document.getElementById("result").scrollWidth;
}

// changes the number of decimal places to show
function changePrecision(val) {
    accuracy = val;
}

// insert a value to the result window
function insert(value) {
    // if last pressed button was equals
    if (ansFound) {
        // only allow operators
        if (value == '+' || value == '−' || value == '*' || value == '/') {
            operator = true;
            document.getElementById("result").value += value;
            autoScroll();
            dec = false;
            ansFound = false;
            return;
        } else {
            return;
        }
    }
    // allow only one decimal point per number
    if (value == '.') {
        if (dec || document.getElementById("result").value== '') {
            return;
        } else {
            dec = true; 
            document.getElementById("result").value += value;
        }
    // allow only one operator to be on the result window for every two numbers
    } /*else if (value == '+' || value == '−' || value == '*' || value == '/') {
        if (operator || document.getElementById("result").innerHTML== '') {
            return;
        } else {
            operator = true;
            document.getElementById("result").innerHTML += value;
            dec = false;
        }
    }*/ else {
        document.getElementById("result").value += value;
    }
    
    autoScroll();
}

// removes the last character
function backspace() {
    let string = document.getElementById("result").value + '';
    let lastChar = string.substr(string.length - 1);
    
    if (string) {
        if (lastChar == '.') {
            // allow decimal if the decimal point is deleted
            dec = false;
        } else if (lastChar == '+' || lastChar == '−' || lastChar == '*' || lastChar == '/') {
            // allow a operator if any one of them is deleted
            operator = false;
        }
        
        document.getElementById("result").value = string.substr(0, string.length - 1);
        
        // reset the calculator if backspace clears the result window
        if (document.getElementById("result").value == "") {
            c();
        }
    }
}

// resets the calculator
function c() {
    dec = false;
    operator = false;
    ansFound = false;
    ans = 0;
    document.getElementById("result").value = "";
    document.getElementById("result-convert").value = "";
}

// evaluates the answer using the string in the result window
function findAns() {
    if(mod == 1) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        
        if (str) {
            ans = eval(str);
        }
        
        document.getElementById("result-convert").value = parseFloat(ans).toFixed(accuracy);
        autoScroll();
        
        ansFound = true;
        document.getElementById("result").value = "";
    } else if(mod == 2) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        var ansReplace = 0;
        
        if (str) {
            var stack = [];
            for(i = 0; i < str.length; i++) {
                if(str[i] == "+" || str[i] == "-" || str[i] == "*" || str[i] == "/") {
                    if(stack.length == 0) {
                        ans = "";
                        ansReplace = 1;
                        break;
                    } else {
                        var b = stack[stack.length-1];
                        stack.pop();
                        var a = stack[stack.length-1];
                        stack.pop();
                        if(str[i] == "+") {
                            stack.push(parseFloat(a)+parseFloat(b));
                        } else if(str[i] == "-") {
                            stack.push(parseFloat(a)-parseFloat(b));
                        } else if(str[i] == "*") {
                            stack.push(parseFloat(a)*parseFloat(b));
                        } else if(str[i] == "/") {
                            stack.push(parseFloat(a)/parseFloat(b));
                        }
                    }
                } else {
                    stack.push(str[i]);
                }
            }
            if(stack.length != 0 && stack.length == 1) {
                ans = stack[0];
            } else if(stack.length > 1) {
                ans = "";
                document.getElementById("result").value = "Invalid Expression!!!";
            }
        }

        document.getElementById("result-convert").value = parseFloat(ans).toFixed(accuracy);
        autoScroll();
        
        ansFound = true;
        if(ansReplace != 1) {
            document.getElementById("result").value = "";
        }
    } else if(mod == 4) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        var ansReplace = 0;
        var ans = "";
        
        if (str) {
            var stack = [];
            for(i = 0; i < str.length; i++) {
                if(str[i] == "(") {
                      stack.push("(");  
                } else if(str[i] == ")") {
                    var j = stack.length;
                    while(stack[j-1] != "(") {
                        ans += stack[j-1];
                        stack.pop();
                        j--;
                    }
                    stack.pop();
                } else if(str[i] == "+" || str[i] == "-" || str[i] == "*" || str[i] == "/") {
                    if(str[i] == "+" || str[i] == "-") {
                        if(stack[stack.length-1] == "*" || stack[stack.length-1] == "/") {
                            ans += strstack[stack.length-1];
                            stack.pop();
                            stack.push(str[i]);
                        } else {
                            stack.push(str[i]);
                        }
                    } else {
                        if(stack[stack.length-1] == "*" || stack[stack.length-1] == "/") {
                            ans += stack[stack.length-1];
                            stack.pop();
                            stack.push(str[i]);
                        } else {
                            stack.push(str[i]);
                        }
                    }
                } else {
                    ans += str[i];
                }
            }
            if(stack.length > 1) {
                ans = "";
                document.getElementById("result").value = "Invalid Expression!!!";
            }
        }

        document.getElementById("result-convert").value = ans;
        autoScroll();
        
        ansFound = true;
    } else if(mod == 3) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        var ansReplace = 0;
        
        if (str) {
            var stack = [];
            for(i = str.length-1; i >= 0; i--) {
                if(str[i] == "+" || str[i] == "-" || str[i] == "*" || str[i] == "/") {
                    if(stack.length == 0) {
                        ans = "";
                        ansReplace = 1;
                        break;
                    } else {
                        var b = stack[stack.length-1];
                        stack.pop();
                        var a = stack[stack.length-1];
                        stack.pop();
                        if(str[i] == "+") {
                            stack.push(parseFloat(a)+parseFloat(b));
                        } else if(str[i] == "-") {
                            stack.push(parseFloat(a)-parseFloat(b));
                        } else if(str[i] == "*") {
                            stack.push(parseFloat(a)*parseFloat(b));
                        } else if(str[i] == "/") {
                            stack.push(parseFloat(a)/parseFloat(b));
                        }
                    }
                } else {
                    stack.push(str[i]);
                }
            }
            if(stack.length != 0 && stack.length == 1) {
                ans = stack[0];
            } else if(stack.length > 1) {
                ans = "";
                document.getElementById("result").value = "Invalid Expression!!!";
            }
        }

        document.getElementById("result-convert").value = parseFloat(ans).toFixed(accuracy);
        autoScroll();
        
        ansFound = true;
        if(ansReplace != 1) {
            document.getElementById("result").value = "";
        }
    } else if(mod == 5) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        var ansReplace = 0;
        var ans = "";
        var string = "";

        for(i = str.length-1; i >= 0; i--) {
            if(str[i] == "(") {
                string += ")";
            } else if(str[i] == ")") {
                string += "(";
            } else {
                string += str[i];
            }
        }
        
        if (string) {
            var stack = [];
            for(i = 0; i < string.length; i++) {
                if(string[i] == "(") {
                      stack.push("(");  
                } else if(string[i] == ")") {
                    var j = stack.length;
                    while(stack[j-1] != "(") {
                        ans += stack[j-1];
                        stack.pop();
                        j--;
                    }
                    stack.pop();
                } else if(string[i] == "+" || string[i] == "-" || string[i] == "*" || string[i] == "/") {
                    if(string[i] == "+" || string[i] == "-") {
                        if(stack[stack.length-1] == "*" || stack[stack.length-1] == "/") {
                            ans += stringstack[stack.length-1];
                            stack.pop();
                            stack.push(string[i]);
                        } else {
                            stack.push(string[i]);
                        }
                    } else {
                        if(stack[stack.length-1] == "*" || stack[stack.length-1] == "/") {
                            ans += stack[stack.length-1];
                            stack.pop();
                            stack.push(string[i]);
                        } else {
                            stack.push(string[i]);
                        }
                    }
                } else {
                    ans += string[i];
                }
            }
            if(stack.length > 1) {
                ans = "";
                document.getElementById("result").value = "Invalid Expression!!!";
            }
        }

        var prefixAns = "";

        for(i = ans.length-1; i >= 0; i--) {
            prefixAns += ans[i];
        }

        document.getElementById("result-convert").value = prefixAns;
        autoScroll();
        
        ansFound = true;
    } else if(mod == 6) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        var ansReplace = 0;
        var ans = "";
        var string = "";

        for(i = str.length-1; i >= 0; i--) {
            string += str[i];
        }
        
        if (string) {
            var stack = [];
            var stringConcat = "";
            for(i = 0; i < string.length; i++) {
                if(string[i] == "+" || string[i] == "-" || string[i] == "*" || string[i] == "/") {
                    if(stack.length < 2) {
                        ans = "";
                        ansReplace = 1;
                        break;
                    } else {
                        stringConcat = "(" + stack[stack.length-1] + string[i] + stack[stack.length-2] + ")";
                        stack.pop();
                        stack.pop();
                        stack.push(stringConcat);
                    }
                } else {
                    stack.push(string[i]);
                }
            }
            if(stack.length != 1) {
                ans = "";
                document.getElementById("result").value = "Invalid Expression!!!";
            } else {
                ans = stack[0];
            }
        }

        document.getElementById("result-convert").value = ans;
        autoScroll();
        
        ansFound = true;
    } else if(mod == 7) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        var ansReplace = 0;
        var ans = "";
        var string = "";

        for(i = str.length-1; i >= 0; i--) {
            string += str[i];
        }
        
        if (string) {
            var stack = [];
            var stringConcat = "";
            for(i = 0; i < string.length; i++) {
                if(string[i] == "+" || string[i] == "-" || string[i] == "*" || string[i] == "/") {
                    if(stack.length < 2) {
                        ans = "";
                        ansReplace = 1;
                        break;
                    } else {
                        stringConcat = stack[stack.length-1] + stack[stack.length-2] + string[i];
                        stack.pop();
                        stack.pop();
                        stack.push(stringConcat);
                    }
                } else {
                    stack.push(string[i]);
                }
            }
            if(stack.length != 1) {
                ans = "";
                document.getElementById("result").value = "Invalid Expression!!!";
            } else {
                ans = stack[0];
            }
        }

        document.getElementById("result-convert").value = ans;
        autoScroll();
        
        ansFound = true;
    } else if(mod == 8) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        var ansReplace = 0;
        var ans = "";
        var string = str;
        
        if (string) {
            var stack = [];
            var stringConcat = "";
            for(i = 0; i < string.length; i++) {
                if(string[i] == "+" || string[i] == "-" || string[i] == "*" || string[i] == "/") {
                    if(stack.length < 2) {
                        ans = "";
                        ansReplace = 1;
                        break;
                    } else {
                        stringConcat = "(" + stack[stack.length-1] + string[i] + stack[stack.length-2] + ")";
                        stack.pop();
                        stack.pop();
                        stack.push(stringConcat);
                    }
                } else {
                    stack.push(string[i]);
                }
            }
            if(stack.length != 1) {
                ans = "";
                document.getElementById("result").value = "Invalid Expression!!!";
            } else {
                ans = stack[0];
            }
        }

        document.getElementById("result-convert").value = ans;
        autoScroll();
        
        ansFound = true;
    } else if(mod == 9) {
        let str = document.getElementById("result").value + '';
        str = str.replace('−', '-'); // change MINUS SIGN “−” U+2212 with HYPHEN-MINUS, “-”, U+002D 
        var ansReplace = 0;
        var ans = "";
        var string = str;
        
        if (string) {
            var stack = [];
            var stringConcat = "";
            for(i = 0; i < string.length; i++) {
                if(string[i] == "+" || string[i] == "-" || string[i] == "*" || string[i] == "/") {
                    if(stack.length < 2) {
                        ans = "";
                        ansReplace = 1;
                        break;
                    } else {
                        stringConcat = string[i] + stack[stack.length-1] + stack[stack.length-2];
                        stack.pop();
                        stack.pop();
                        stack.push(stringConcat);
                    }
                } else {
                    stack.push(string[i]);
                }
            }
            if(stack.length != 1) {
                ans = "";
                document.getElementById("result").value = "Invalid Expression!!!";
            } else {
                ans = stack[0];
            }
        }

        document.getElementById("result-convert").value = ans;
        autoScroll();
        
        ansFound = true;
    } else {
        document.getElementById("result-convert").value = "Invalid Expression!!!";
    }
}

function changeMod(value) {
    mod = value;
    if(value == 1) {
        document.getElementById("selected-mode").innerHTML = "Infix Expression Evaluvation";
    } else if(value == 2) {
        document.getElementById("selected-mode").innerHTML = "Postfix Expression Evaluvation";
    } else if(value == 3) {
        document.getElementById("selected-mode").innerHTML = "Prefix Expression Evaluvation";
    } else if(value == 4) {
        document.getElementById("selected-mode").innerHTML = "Infix to Postfix";
    } else if(value == 5) {
        document.getElementById("selected-mode").innerHTML = "Infix to Prefix";
    } else if(value == 6) {
        document.getElementById("selected-mode").innerHTML = "Prefix to Infix";
    } else if(value == 7) {
        document.getElementById("selected-mode").innerHTML = "Prefix to Postfix";
    } else if(value == 8) {
        document.getElementById("selected-mode").innerHTML = "Postfix to Infix";
    } else if(value == 9) {
        document.getElementById("selected-mode").innerHTML = "Postfix to Prefix";
    } else {
        document.getElementById("selected-mode").innerHTML = "Unknown Mode!!!";
    }
}