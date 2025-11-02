const input = document.getElementById("display")
const otvet = document.getElementById("otvet")
const canv = document.getElementById("cirCanv")     // достаём наш холст из HTML
const r = 150       // радиус окружности
const cont = canv.getContext("2d")      // контекст отрисовки (нам нужна фигура в 2d формате)
const centX = canv.width/2      // центр по оси Х
const centY = canv.height/2     // центр по оси Y

function drawCirc() {
    cont.lineWidth = 1.5;       // толщина линии 
    cont.strokeStyle = '#000';      // цвет контура окружности
    cont.clearRect(0, 0, canv.width, canv.height);      // очистка холста
    cont.beginPath();       // начало пути
    cont.arc(centX, centY, r, 0, 2 * Math.PI);      // окружность
    cont.stroke();      // нарисовать

    // рисуем оси
    cont.beginPath();
    cont.strokeStyle = "#999";
    cont.lineWidth = 1;
    cont.moveTo(centX - r, centY); // отрисовка линии по оси X
    cont.lineTo(centX + r, centY);
    cont.moveTo(centX, centY - r); // отрисовка линии по оси Y
    cont.lineTo(centX, centY + r);
    cont.stroke();

    // метки на окружности
    const angles = {
        "0": 0,
        "π/6": Math.PI / 6,
        "π/4": Math.PI / 4,
        "π/3": Math.PI / 3,
        "π/2": Math.PI / 2,
        "2π/3": 2 * Math.PI / 3,
        "3π/4": 3 * Math.PI / 4,
        "5π/6": 5 * Math.PI / 6,
        "π": Math.PI,
        "7π/6": 7 * Math.PI / 6,
        "5π/4": 5 * Math.PI / 4,
        "4π/3": 4 * Math.PI / 3,
        "3π/2": 3 * Math.PI / 2,
        "5π/3": 5 * Math.PI / 3,
        "7π/4": 7 * Math.PI / 4,
        "11π/6": 11 * Math.PI / 6,
    };

    for (let label in angles) {
        drawLab(label, angles[label]);      // вызываем отрисовку наших меток
    }
}

function drawLab(text, angle) {     // рисует метки около окружности с отступом в 20px от неё
    const x = centX + (r + 20) * Math.cos(angle);
    const y = centY - (r + 20) * Math.sin(angle);
    cont.font = "12px Arial";       // стиль текста
    cont.fillStyle = "#000"     // цвет заливки текста
    cont.textAlign = "center"       // выранивание по горизонтали
    cont.textBaseline = "middle"        // выравнивание по вертикали
    cont.fillText(text, x, y);      // команда по рисовке меток с заданными отступами 
}

function drawPoint(angle, label="") {      // рисуем точки
    const x = centX + r * Math.cos(angle);
    const y = centY - r * Math.sin(angle);
    cont.beginPath();
    cont.arc(x, y, 5, 0, 2 * Math.PI);
    cont.fillStyle = "red";
    cont.fill();
    cont.fillStyle = "black";
    cont.fillText(label, x, y);
}

function convertSqrt(str) {      // преобразовываем корень в Math.sqrt
    str = str.replace(/sqrt/g, "Math.sqrt");
    try {
    return Function(`return ${str}`)();
  } catch {
    return NaN;
  }
}

function isTab(v) {     // проверяем, табличное ли значение или нет
    const tab = [0, 0.5, 1, Math.sqrt(2)/2, Math.sqrt(3)/2, Math.sqrt(3)/3, Math.sqrt(3)];
    return tab.includes(Math.abs(v));       // игнорируем знак минуса
}

function formAng(angle) {
    const tab = {
        [Math.PI/6]: "π/6",
        [Math.PI/4]: "π/4",
        [Math.PI/3]: "π/3",
        [Math.PI/2]: "π/2",
        [2*Math.PI/3]: "2π/3",
        [3*Math.PI/4]: "3π/4",
        [5*Math.PI/6]: "5π/6",
        [Math.PI]: "π",
        [7*Math.PI/6]: "7π/6",
        [5*Math.PI/4]: "5π/4",
        [4*Math.PI/3]: "4π/3",
        [3*Math.PI/2]: "3π/2",
        [5*Math.PI/3]: "5π/3",
        [7*Math.PI/4]:"7π/4",
        [11*Math.PI/6]: "11π/6"
    };
    for (let key in tab) {
        if (Math.abs(angle - key) < 0.001) return tab[key];
    }
    return angle.toFixed(3);        // если значение нетабличное, то выводим ответ в десятичой дроби с округлением до 3 знаков после запятой
}

// уравнения
function solveEq(func, ang, k = 1, origRight = null) {
    const res = [];
    const twopi = 2 * Math.PI;
    const pi = Math.PI;

// определяем период функции
    const isTgOrCtg = func === "tg" || func === "ctg";
    const basePeriod = isTgOrCtg ? pi : twopi;
    const fullPeriod = basePeriod / k;

// корректируем угол, чтобы всегда был в диапазоне [0;2π)
    const normalize = (a) => {
        let x = a % twopi;
        if (x < 0) x += twopi;
        return x;
    };

// вспомогательная функция для добавления всех сдвигов n
    function addPeriod(baseAngles, labelFunc) {
        const numPeriods = Math.ceil(k);
        for (let n = 0; n < numPeriods; n++) {
            for (const base of baseAngles) {
                const x = base + n * fullPeriod;
                const val = normalize(x);
                const label = labelFunc(base, n);
                res.push({ value: val, label });
            }
        }
    }

    if (func === "sin") {
        const baseAngles = [ang, pi - ang];
        addPeriod(baseAngles, (base) => {
            let periodTxt;
            if (k === 1) {
              periodTxt = "2πn";
            }
            if (k === 2) {
              periodTxt = "πn";
            } 
            if (k > 2) {
              periodTxt = `2πn/${(k)}`;
            }
            let text;
            if (text = isTab(origRight)) {
              if (k === 1) {
                text = `x=${formAng(base)}+${periodTxt}`;
              }
              if (k > 1) {
                text = `x=${formAng(base / k)}+${periodTxt}`;
              }
            } else {
              if (k === 1) {
                text = `x=arcsin(${origRight.toFixed(3)})+${periodTxt}`;
              }
              if (k > 1) {
                text = `x=arcsin(${origRight.toFixed(3)})/${k}+${periodTxt}`;
              }
            }
            return text;
        });
    }

    if (func === "cos") {
        const baseAngles = [ang, twopi - ang];
        addPeriod(baseAngles, (base) => {
            let periodTxt;
            if (k === 1) {
              periodTxt = "2πn";
            }
            if (k === 2) {
              periodTxt = "πn";
            } 
            if (k > 2) {
              periodTxt = `2πn/${(k)}`;
            }
            let text;
            if (text = isTab(origRight)) {
              if (k === 1) {
                text = `x=${formAng(base)}+${periodTxt}`;
              }
              if (k > 1) {
                text = `x=${formAng(base / k)}+${periodTxt}`;
              }
            } else {
              if (k === 1) {
                text = `x=arccos(${origRight.toFixed(3)})+${periodTxt}`;
              }
              if (k > 1) {
                text = `x=arccos(${origRight.toFixed(3)})/${k}+${periodTxt}`;
              }
            }
            return text;
        });
    }

    if (func === "tg") {
        const baseAngles = [ang, ang + pi];
        addPeriod(baseAngles, (base) => {
            let periodTxt;
            if (k === 1) {
              periodTxt = "πn";
            }
            if (k > 1) {
              periodTxt = `πn/${(k)}`;
            }
            let text;
            if (text = isTab(origRight)) {
              if (k === 1) {
                text = `x=${formAng(base)}+${periodTxt}`;
              }
              if (k > 1) {
                text = `x=${formAng(base / k)}+${periodTxt}`;
              }
            } else {
              if (k === 1) {
                text = `x=arctg(${origRight.toFixed(3)})+${periodTxt}`;
              }
              if (k > 1) {
                text = `x=arctg(${origRight.toFixed(3)})/${k}+${periodTxt}`;
              }
            }
            return text;
        });
    }

    if (func === "ctg") {
        const baseAngles = [ang, ang + pi];
        addPeriod(baseAngles, (base) => {
            let periodTxt;
            if (k === 1) {
              periodTxt = "πn";
            }
            if (k > 1) {
              periodTxt = `πn/${(k)}`;
            }
            let text;
            if (text = isTab(origRight)) {
              if (k === 1) {
                text = `x=${formAng(base)}+${periodTxt}`;
              }
              if (k > 1) {
                text = `x=${formAng(base / k)}+${periodTxt}`;
              }
            } else {
              if (k === 1) {
                text = `x=arcctg(${origRight.toFixed(3)})+${periodTxt}`;
              }
              if (k > 1) {
                text = `x=arcctg(${origRight.toFixed(3)})/${k}+${periodTxt}`;
              }
            }
            return text;
        });
    }

    return res;
}

function parseEquation(eq) {
  try {
    cont.clearRect(0, 0, canv.width, canv.height);
    drawCirc();

    // убираем пробелы
    eq = eq.replace(/\s+/g, "");

    // разбиваем по "="
    const parts = eq.split("=");
    if (parts.length !== 2) throw "уравнение должно содержать знак '='";

    const left = parts[0];
    const right = parts[1];

    // левая часть
    const leftExp = /^(sin|cos|tg|ctg)\(([+-]?\d*)x\)$/;
    const match = left.match(leftExp);
    if (!match) {
      throw "левая часть не распознана";
    }

    let [, func, kx] = match;
    let coef;
    if (kx === "" || kx === "+") {
      coef = 1;
    } else if (kx === "-") {
      coef = -1;
    } else {
      coef = parseFloat(kx);
      if (isNaN(coef)) throw "коэффициент перед x некорректный";
    }

    // правая часть
    const rightVal = convertSqrt(right);
    if (isNaN(rightVal)) throw "не удалось вычислить правую часть";

    let inverse;
    if (func === "sin") {
      if (Math.abs(rightVal) > 1) throw "значение вне области значений sin";
      inverse = Math.asin;
    } else if (func === "cos") {
      if (Math.abs(rightVal) > 1) throw "значение вне области значений cos";
      inverse = Math.acos;
    } else if (func === "tg") {
      inverse = Math.atan;
    } else if (func === "ctg") {
      inverse = (val) => Math.atan(1 / val);
    }

    const angle = +inverse(rightVal).toFixed(3);

    const sols = solveEq(func, angle, coef, rightVal);
    sols.forEach((s) => drawPoint(s.value));
    let output="Ответ: " + [...new Set(sols.map((s) => s.label))].join(", ");
    return output;

  } catch (e) {
    return "Ошибка: " + e;
  }
}

function solve() {
    drawCirc();
    const result = parseEquation(input.value);
    otvet.textContent = result;
}

function clearCanvas() {
    input.value = "";
    otvet.textContent = "Ответ:";
    cont.clearRect(0, 0, canv.width, canv.height);
    drawCirc();
}


drawCirc();





