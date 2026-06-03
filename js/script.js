//modulo 1
function resolverSistema() {
  let norte = parseFloat(document.getElementById("norte").value);

  let centro = parseFloat(document.getElementById("centro").value);

  let sur = parseFloat(document.getElementById("sur").value);

  let metodo = document.getElementById("metodoSistema").value;

  let bloqueo = document.getElementById("bloqueo").value;

  let nombreMetodo = "";

  if (metodo == "jacobi") {
    nombreMetodo = "Jacobi";
  }

  if (metodo == "seidel") {
    nombreMetodo = "Gauss-Seidel";
  }

  if (metodo == "sor") {
    nombreMetodo = "SOR";
  }

  if (metodo == "lu") {
    nombreMetodo = "LU";
  }

  let resultado = "<p><b>Método utilizado:</b> " + nombreMetodo + "</p>";

  resultado +=
    "<table class='table table-bordered'>" +
    "<tr>" +
    "<th>Zona</th>" +
    "<th>Abastecimiento</th>" +
    "</tr>" +
    "<tr>" +
    "<td>Norte</td>" +
    "<td>" +
    norte +
    " litros</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Centro</td>" +
    "<td>" +
    centro +
    " litros</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Sur</td>" +
    "<td>" +
    sur +
    " litros</td>" +
    "</tr>" +
    "</table>";

  document.getElementById("resultadoSistema").innerHTML = resultado;

  let texto = "";

  if (bloqueo == "ninguna") {
    texto =
      "Todas las rutas funcionan normalmente. " +
      "El sistema es estable y cubre la demanda.";
  }

  if (bloqueo == "norte") {
    texto =
      "La Zona Norte es la más afectada debido al bloqueo. " +
      "Se reduce el abastecimiento en esta región.";
  }

  if (bloqueo == "centro") {
    texto =
      "La Zona Centro presenta problemas de distribución. " +
      "El abastecimiento disminuye.";
  }

  if (bloqueo == "sur") {
    texto =
      "La Zona Sur es la más afectada por el bloqueo. " +
      "La demanda puede quedar insatisfecha.";
  }

  texto += "<br><br>";

  texto +=
    "Si la demanda aumenta, el sistema requerirá " +
    "mayor distribución de combustible.";

  document.getElementById("interpretacionSistema").innerHTML = texto;

  //grafica modulo 1
  let ctx = document.getElementById("graficoSistema").getContext("2d");

  if (window.miGraficoSistema) {
    window.miGraficoSistema.destroy();
  }

  window.miGraficoSistema = new Chart(ctx, {
    type: "bar",

    data: {
      labels: ["Norte", "Centro", "Sur"],

      datasets: [
        {
          label: "Litros",

          data: [norte, centro, sur],
        },
      ],
    },
  });
}

//modulo 2
let graficoRaiz = null;

function fRaiz(x) {
  return x * Math.exp(-x) - 0.2;
}

function derivadaRaiz(x) {
  return Math.exp(-x) * (1 - x);
}

function resolverRaiz() {
  let metodo = document.getElementById("metodoRaiz").value;
  let a = parseFloat(document.getElementById("valorA").value);
  let b = parseFloat(document.getElementById("valorB").value);
  let tol = parseFloat(document.getElementById("toleranciaRaiz").value);

  let raiz = 0;
  let iteraciones = [];

  if (metodo === "biseccion") {
    raiz = metodoBiseccion(a, b, tol, iteraciones);
  }

  if (metodo === "newton") {
    raiz = metodoNewton(a, tol, iteraciones);
  }

  if (metodo === "secante") {
    raiz = metodoSecante(a, b, tol, iteraciones);
  }

  mostrarTablaRaiz(iteraciones);
  mostrarResultadoRaiz(metodo, raiz, iteraciones.length);
  graficarRaiz(raiz);
}

function metodoBiseccion(a, b, tol, iteraciones) {
  let fa = fRaiz(a);
  let fb = fRaiz(b);

  if (fa * fb > 0) {
    document.getElementById("resultadoRaiz").innerHTML =
      "<p class='text-danger'>No existe cambio de signo en el intervalo.</p>";
    return 0;
  }

  let m = 0;
  let error = Math.abs(b - a);
  let i = 0;

  while (error > tol && i < 100) {
    m = (a + b) / 2;
    let fm = fRaiz(m);

    iteraciones.push([i, a, m, fm, error]);

    if (fa * fm < 0) {
      b = m;
      fb = fm;
    } else {
      a = m;
      fa = fm;
    }

    error = Math.abs(b - a);
    i++;
  }

  return m;
}

function metodoNewton(x0, tol, iteraciones) {
  let x1 = x0;
  let error = 1;
  let i = 0;

  while (error > tol && i < 100) {
    let fx = fRaiz(x0);
    let dfx = derivadaRaiz(x0);

    if (dfx === 0) {
      break;
    }

    x1 = x0 - fx / dfx;
    error = Math.abs(x1 - x0);

    iteraciones.push([i, x0, x1, fRaiz(x1), error]);

    x0 = x1;
    i++;
  }

  return x1;
}

function metodoSecante(x0, x1, tol, iteraciones) {
  let x2 = x1;
  let error = 1;
  let i = 0;

  while (error > tol && i < 100) {
    let f0 = fRaiz(x0);
    let f1 = fRaiz(x1);

    if (f1 - f0 === 0) {
      break;
    }

    x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
    error = Math.abs(x2 - x1);

    iteraciones.push([i, x0, x2, fRaiz(x2), error]);

    x0 = x1;
    x1 = x2;
    i++;
  }

  return x2;
}

function mostrarTablaRaiz(iteraciones) {
  let tabla = "";

  for (let i = 0; i < iteraciones.length; i++) {
    tabla += `
            <tr>
                <td>${iteraciones[i][0]}</td>
                <td>${iteraciones[i][1].toFixed(6)}</td>
                <td>${iteraciones[i][2].toFixed(6)}</td>
                <td>${iteraciones[i][3].toFixed(6)}</td>
                <td>${iteraciones[i][4].toFixed(6)}</td>
            </tr>
        `;
  }

  document.getElementById("tablaRaiz").innerHTML = tabla;
}

function mostrarResultadoRaiz(metodo, raiz, iter) {
  let nombre = "";

  if (metodo === "biseccion") nombre = "Bisección";
  if (metodo === "newton") nombre = "Newton-Raphson";
  if (metodo === "secante") nombre = "Secante";

  document.getElementById("resultadoRaiz").innerHTML = `
        <p><b>Método utilizado:</b> ${nombre}</p>
        <p><b>Raíz aproximada:</b> ${raiz.toFixed(6)}</p>
        <p><b>Número de iteraciones:</b> ${iter}</p>
        <p>
    Interpretación: este valor representa un punto crítico o equilibrio
    del modelo, donde la función se aproxima a cero.
</p>

<p>
    <b>Comparación de convergencia:</b><br>

    Newton-Raphson suele converger más rápido porque utiliza la derivada
    de la función.<br>

    El método de la Secante presenta una velocidad intermedia y no requiere
    derivadas.<br>

    Bisección es el más robusto y seguro, aunque normalmente necesita más
    iteraciones para alcanzar la misma precisión.
</p>

<p>
    <b>Sensibilidad a la condición inicial:</b><br>

    Los métodos Newton-Raphson y Secante dependen de los valores iniciales
    elegidos por el usuario. Si estos valores están muy alejados de la raíz,
    la convergencia puede ser más lenta o incluso fallar.<br>

    El método de Bisección es menos sensible, siempre que exista un cambio
    de signo en el intervalo seleccionado.
</p>
    `;
}

function graficarRaiz(raiz) {
  let xs = [];
  let ys = [];

  for (let x = 0; x <= 3; x += 0.05) {
    xs.push(x.toFixed(2));
    ys.push(fRaiz(x));
  }

  let ctx = document.getElementById("graficoRaiz").getContext("2d");

  if (graficoRaiz !== null) {
    graficoRaiz.destroy();
  }

  graficoRaiz = new Chart(ctx, {
    type: "line",
    data: {
      labels: xs,
      datasets: [
        {
          label: "f(x)=x·e^(-x)-0.2",
          data: ys,
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Raíz aproximada",
          data: xs.map((x) =>
            Math.abs(parseFloat(x) - raiz) < 0.03 ? 0 : null,
          ),
          type: "scatter",
          pointRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

//modulo 3
let graficoInterpolacion = null;

function resolverInterpolacion() {
  //alert("funciona");
  let metodo = document.getElementById("metodoInterpolacion").value;

  let x = parseFloat(document.getElementById("diaInterpolar").value);

  let dias = [
    parseFloat(document.getElementById("x1").value),
    parseFloat(document.getElementById("x2").value),
    parseFloat(document.getElementById("x3").value),
    parseFloat(document.getElementById("x4").value),
    parseFloat(document.getElementById("x5").value),
    parseFloat(document.getElementById("x6").value),
  ];

  let precios = [
    parseFloat(document.getElementById("y1").value),
    parseFloat(document.getElementById("y2").value),
    parseFloat(document.getElementById("y3").value),
    parseFloat(document.getElementById("y4").value),
    parseFloat(document.getElementById("y5").value),
    parseFloat(document.getElementById("y6").value),
  ];

  let precioEstimado = 0;

  if (metodo == "lagrange") {
    precioEstimado = interpolacionLagrange(dias, precios, x);
  }

  if (metodo == "newton") {
    precioEstimado = interpolacionNewton(dias, precios, x);
  }

  if (metodo == "spline") {
    precioEstimado = interpolacionNewton(dias, precios, x);
  }

  mostrarResultadoInterpolacion(metodo, x, precioEstimado);

  mostrarInterpretacionInterpolacion(metodo, precioEstimado);

  graficarInterpolacion(dias, precios, x, precioEstimado);
}

function interpolacionLagrange(xValores, yValores, x) {
  let resultado = 0;

  for (let i = 0; i < xValores.length; i++) {
    let termino = yValores[i];

    for (let j = 0; j < xValores.length; j++) {
      if (i != j) {
        termino = termino * ((x - xValores[j]) / (xValores[i] - xValores[j]));
      }
    }

    resultado = resultado + termino;
  }

  return resultado;
}

function interpolacionNewton(xValores, yValores, x) {
  let n = xValores.length;

  let tabla = [];

  for (let i = 0; i < n; i++) {
    tabla[i] = [];
    tabla[i][0] = yValores[i];
  }

  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      tabla[i][j] =
        (tabla[i + 1][j - 1] - tabla[i][j - 1]) /
        (xValores[i + j] - xValores[i]);
    }
  }

  let resultado = tabla[0][0];

  let producto = 1;

  for (let i = 1; i < n; i++) {
    producto = producto * (x - xValores[i - 1]);

    resultado = resultado + tabla[0][i] * producto;
  }

  return resultado;
}

function mostrarResultadoInterpolacion(metodo, dia, precio) {
  let nombreMetodo = "";

  if (metodo == "lagrange") {
    nombreMetodo = "Lagrange";
  }

  if (metodo == "newton") {
    nombreMetodo = "Newton";
  }

  if (metodo == "spline") {
    nombreMetodo = "Spline Cúbico";
  }

  document.getElementById("resultadoInterpolacion").innerHTML = `
    <p>
    <b>Método utilizado:</b>
    ${nombreMetodo}
    </p>

    <p>
    <b>Día estimado:</b>
    ${dia}
    </p>

    <p>
    <b>Precio aproximado:</b>
    ${precio.toFixed(2)}
    Bs
    </p>
    `;
}

function mostrarInterpretacionInterpolacion(metodo, precio) {
  let texto = `
    <p>

    El precio estimado para el día
    solicitado es de
    <b>${precio.toFixed(2)} Bs</b>.

    </p>

    <p>

    La curva muestra una tendencia
    creciente de precios.

    </p>

    <p>

    La interpolación permite estimar
    datos faltantes entre valores
    conocidos.

    </p>

    <p>

    Mientras más cercanos y numerosos
    sean los datos, mayor será la
    confiabilidad del resultado.

    </p>

    <p>

    Si los datos son muy dispersos,
    la precisión disminuye y la
    estimación puede alejarse del
    comportamiento real.

    </p>
    `;

  document.getElementById("interpretacionInterpolacion").innerHTML = texto;
}

function graficarInterpolacion(dias, precios, diaEstimado, precioEstimado) {
  let ctx = document.getElementById("graficoInterpolacion").getContext("2d");

  if (graficoInterpolacion != null) {
    graficoInterpolacion.destroy();
  }

  graficoInterpolacion = new Chart(ctx, {
    type: "line",

    data: {
      labels: dias,

      datasets: [
        {
          label: "Datos Reales",

          data: precios,

          borderWidth: 3,

          tension: 0.3,
        },

        {
          label: "Precio Estimado",

          data: dias.map((d) => (d == diaEstimado ? precioEstimado : null)),

          type: "scatter",

          pointRadius: 8,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

//modulo 4

let graficoIntegracion = null;

function fIntegracion(x) {
  return x * x + 2 * x + 1;
}

function resolverIntegracion() {
  //alert("paso 1");
  let a = parseFloat(document.getElementById("limiteA").value);

  //alert("paso 2");
  let b = parseFloat(document.getElementById("limiteB").value);

  let n = parseInt(document.getElementById("intervalos").value);

  let trapecio = metodoTrapecio(a, b, n);

  let simpson13 = metodoSimpson13(a, b, n);

  let simpson38 = metodoSimpson38(a, b, n);

  mostrarResultadoIntegracion(trapecio, simpson13, simpson38);

  mostrarTablaIntegracion(trapecio, simpson13, simpson38);

  mostrarInterpretacionIntegracion(trapecio, simpson13, simpson38);

  graficarIntegracion(a, b);
}

function metodoTrapecio(a, b, n) {
  let h = (b - a) / n;

  let suma = fIntegracion(a) + fIntegracion(b);

  for (let i = 1; i < n; i++) {
    suma = suma + 2 * fIntegracion(a + i * h);
  }

  return (h / 2) * suma;
}

function metodoSimpson13(a, b, n) {
  if (n % 2 != 0) {
    n++;
  }

  let h = (b - a) / n;

  let suma = fIntegracion(a) + fIntegracion(b);

  for (let i = 1; i < n; i++) {
    if (i % 2 == 0) {
      suma = suma + 2 * fIntegracion(a + i * h);
    } else {
      suma = suma + 4 * fIntegracion(a + i * h);
    }
  }

  return (h / 3) * suma;
}

function metodoSimpson38(a, b, n) {
  while (n % 3 != 0) {
    n++;
  }

  let h = (b - a) / n;

  let suma = fIntegracion(a) + fIntegracion(b);

  for (let i = 1; i < n; i++) {
    if (i % 3 == 0) {
      suma = suma + 2 * fIntegracion(a + i * h);
    } else {
      suma = suma + 3 * fIntegracion(a + i * h);
    }
  }

  return ((3 * h) / 8) * suma;
}

function mostrarResultadoIntegracion(trapecio, simpson13, simpson38) {
  document.getElementById("resultadoIntegracion").innerHTML = `
    <p>

    <b>Trapecio:</b>
    ${trapecio.toFixed(4)}

    </p>

    <p>

    <b>Simpson 1/3:</b>
    ${simpson13.toFixed(4)}

    </p>

    <p>

    <b>Simpson 3/8:</b>
    ${simpson38.toFixed(4)}

    </p>
    `;
}

function mostrarTablaIntegracion(trapecio, simpson13, simpson38) {
  document.getElementById("tablaIntegracion").innerHTML = `
    <tr>
        <td>Trapecio</td>
        <td>${trapecio.toFixed(4)}</td>
    </tr>

    <tr>
        <td>Simpson 1/3</td>
        <td>${simpson13.toFixed(4)}</td>
    </tr>

    <tr>
        <td>Simpson 3/8</td>
        <td>${simpson38.toFixed(4)}</td>
    </tr>
    `;
}

function mostrarInterpretacionIntegracion(trapecio, simpson13, simpson38) {
  let texto = `
    <p>

    Los tres métodos permiten
    aproximar el área bajo la curva.

    </p>

    <p>

    El método del Trapecio es
    sencillo pero puede introducir
    mayor error.

    </p>

    <p>

    Simpson 1/3 y Simpson 3/8
    suelen proporcionar una mejor
    aproximación.

    </p>

    <p>

    La diferencia entre los
    resultados permite analizar
    la precisión de cada método.

    </p>
    `;

  document.getElementById("interpretacionIntegracion").innerHTML = texto;
}

function graficarIntegracion(a, b) {
  let xs = [];
  let ys = [];

  for (let x = a; x <= b; x = x + 0.1) {
    xs.push(x.toFixed(2));

    ys.push(fIntegracion(x));
  }

  let ctx = document.getElementById("graficoIntegracion").getContext("2d");

  if (graficoIntegracion != null) {
    graficoIntegracion.destroy();
  }

  graficoIntegracion = new Chart(ctx, {
    type: "line",

    data: {
      labels: xs,

      datasets: [
        {
          label: "f(x)=x²+2x+1",

          data: ys,

          borderWidth: 3,

          tension: 0.3,

          fill: true,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

//modulo 5
let graficoEDO = null;

function fEDO(x, y) {
  return x + y;
}

function resolverEDO() {
  let metodo = document.getElementById("metodoEDO").value;

  let x0 = parseFloat(document.getElementById("x0").value);

  let y0 = parseFloat(document.getElementById("y0").value);

  let h = parseFloat(document.getElementById("h").value);

  let xf = parseFloat(document.getElementById("xf").value);

  let xs = [];
  let ys = [];

  xs.push(x0);
  ys.push(y0);

  let x = x0;
  let y = y0;

  while (x < xf) {
    if (metodo == "euler") {
      y = y + h * fEDO(x, y);
    } else if (metodo == "heun") {
      let k1 = fEDO(x, y);

      let k2 = fEDO(x + h, y + h * k1);

      y = y + (h / 2) * (k1 + k2);
    } else if (metodo == "rk4") {
      let k1 = fEDO(x, y);

      let k2 = fEDO(x + h / 2, y + (h / 2) * k1);

      let k3 = fEDO(x + h / 2, y + (h / 2) * k2);

      let k4 = fEDO(x + h, y + h * k3);

      y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    }

    x = x + h;

    xs.push(parseFloat(x.toFixed(4)));

    ys.push(parseFloat(y.toFixed(4)));
  }

  mostrarResultadoEDO(metodo, y);

  mostrarTablaEDO(xs, ys);

  mostrarInterpretacionEDO(metodo, h);

  graficarEDO(xs, ys);
}

function mostrarResultadoEDO(metodo, resultado) {
  let nombre = "";

  if (metodo == "euler") {
    nombre = "Euler";
  }

  if (metodo == "heun") {
    nombre = "Heun";
  }

  if (metodo == "rk4") {
    nombre = "Runge-Kutta 4";
  }

  document.getElementById("resultadoEDO").innerHTML = `
    <p>

    <b>Método utilizado:</b>
    ${nombre}

    </p>

    <p>

    <b>Valor aproximado final:</b>
    ${resultado.toFixed(4)}

    </p>
    `;
}

function mostrarTablaEDO(xs, ys) {
  let tabla = "";

  for (let i = 0; i < xs.length; i++) {
    tabla += `
        <tr>

        <td>
        ${xs[i]}
        </td>

        <td>
        ${ys[i]}
        </td>

        </tr>
        `;
  }

  document.getElementById("tablaEDO").innerHTML = tabla;
}

function mostrarInterpretacionEDO(metodo, h) {
  let texto = "";

  texto += `
    <p>

    La solución muestra cómo
    evoluciona la variable en
    función del tiempo.

    </p>
    `;

  if (metodo == "euler") {
    texto += `
        <p>

        Euler es el método más simple,
        aunque también el menos preciso.

        </p>
        `;
  }

  if (metodo == "heun") {
    texto += `
        <p>

        Heun mejora la precisión de
        Euler utilizando una corrección
        basada en una pendiente promedio.

        </p>
        `;
  }

  if (metodo == "rk4") {
    texto += `
        <p>

        Runge-Kutta 4 proporciona una
        aproximación mucho más precisa.

        </p>
        `;
  }

  texto += `
    <p>

    Un tamaño de paso h = ${h}
    pequeño produce resultados más
    precisos, aunque requiere más
    iteraciones.

    </p>
    `;

  document.getElementById("interpretacionEDO").innerHTML = texto;
}

function graficarEDO(xs, ys) {
  let ctx = document.getElementById("graficoEDO").getContext("2d");

  if (graficoEDO != null) {
    graficoEDO.destroy();
  }

  graficoEDO = new Chart(ctx, {
    type: "line",

    data: {
      labels: xs,

      datasets: [
        {
          label: "Solución aproximada",

          data: ys,

          borderWidth: 3,

          tension: 0.3,

          fill: false,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

//modulo 6

let graficoRumor = null;

function simularRumor() {
  let norte = parseFloat(document.getElementById("norteRumor").value);

  let centro = parseFloat(document.getElementById("centroRumor").value);

  let sur = parseFloat(document.getElementById("surRumor").value);

  let incremento = parseFloat(document.getElementById("incrementoRumor").value);

  let norteNuevo = norte + (norte * incremento) / 100;

  let centroNuevo = centro + (centro * incremento) / 100;

  let surNuevo = sur + (sur * incremento) / 100;

  mostrarResultadoRumor(norte, centro, sur, norteNuevo, centroNuevo, surNuevo);

  mostrarInterpretacionRumor(norteNuevo, centroNuevo, surNuevo, incremento);

  graficarRumor(norte, centro, sur, norteNuevo, centroNuevo, surNuevo);
}

function mostrarResultadoRumor(
  norte,
  centro,
  sur,
  norteNuevo,
  centroNuevo,
  surNuevo,
) {
  document.getElementById("resultadoRumor").innerHTML = `
    <table class="table table-bordered">

        <tr>
            <th>Zona</th>
            <th>Antes</th>
            <th>Después</th>
        </tr>

        <tr>
            <td>Norte</td>
            <td>${norte.toFixed(2)}</td>
            <td>${norteNuevo.toFixed(2)}</td>
        </tr>

        <tr>
            <td>Centro</td>
            <td>${centro.toFixed(2)}</td>
            <td>${centroNuevo.toFixed(2)}</td>
        </tr>

        <tr>
            <td>Sur</td>
            <td>${sur.toFixed(2)}</td>
            <td>${surNuevo.toFixed(2)}</td>
        </tr>

    </table>
    `;
}

function mostrarInterpretacionRumor(norte, centro, sur, incremento) {
  let mayor = Math.max(norte, centro, sur);

  let zona = "";

  if (mayor == norte) {
    zona = "Norte";
  }

  if (mayor == centro) {
    zona = "Centro";
  }

  if (mayor == sur) {
    zona = "Sur";
  }

  let texto = `
    <p>

    El rumor provoca un incremento
    del ${incremento}% en la demanda.

    </p>

    <p>

    La zona más afectada es:
    <b>${zona}</b>

    </p>

    <p>

    A medida que aumenta la demanda,
    el sistema requiere una mayor
    capacidad de abastecimiento.

    </p>

    <p>

    Si el incremento continúa,
    podrían producirse problemas
    de distribución y escasez.

    </p>
    `;

  document.getElementById("interpretacionRumor").innerHTML = texto;
}

function graficarRumor(norte, centro, sur, norteNuevo, centroNuevo, surNuevo) {
  let ctx = document.getElementById("graficoRumor").getContext("2d");

  if (graficoRumor != null) {
    graficoRumor.destroy();
  }

  graficoRumor = new Chart(ctx, {
    type: "bar",

    data: {
      labels: ["Norte", "Centro", "Sur"],

      datasets: [
        {
          label: "Demanda Inicial",

          data: [norte, centro, sur],
        },

        {
          label: "Demanda con Rumor",

          data: [norteNuevo, centroNuevo, surNuevo],
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

//modulo 7
let graficoDifusion = null;

function simularDifusion() {
  let poblacion = parseInt(document.getElementById("poblacionTotal").value);

  let informados = parseInt(document.getElementById("informadosInicial").value);

  let tasa = parseFloat(document.getElementById("tasaDifusion").value);

  let periodos = parseInt(document.getElementById("periodosDifusion").value);

  let datosPeriodo = [];
  let datosInformados = [];

  let tabla = "";

  datosPeriodo.push(0);
  datosInformados.push(informados);

  tabla += `
    <tr>
        <td>0</td>
        <td>${informados}</td>
    </tr>
    `;

  for (let i = 1; i <= periodos; i++) {
    let nuevos = informados * (tasa / 100);

    informados = informados + nuevos;

    if (informados > poblacion) {
      informados = poblacion;
    }

    datosPeriodo.push(i);

    datosInformados.push(parseFloat(informados.toFixed(0)));

    tabla += `
        <tr>

            <td>${i}</td>

            <td>
            ${informados.toFixed(0)}
            </td>

        </tr>
        `;
  }

  document.getElementById("tablaDifusion").innerHTML = tabla;

  mostrarResultadoDifusion(informados, poblacion);

  mostrarInterpretacionDifusion(informados, poblacion, tasa);

  graficarDifusion(datosPeriodo, datosInformados);
}

function mostrarResultadoDifusion(informados, poblacion) {
  let porcentaje = (informados / poblacion) * 100;

  document.getElementById("resultadoDifusion").innerHTML = `
    <p>

    <b>Personas informadas:</b>

    ${informados.toFixed(0)}

    </p>

    <p>

    <b>Porcentaje alcanzado:</b>

    ${porcentaje.toFixed(2)} %

    </p>
    `;
}

function mostrarInterpretacionDifusion(informados, poblacion, tasa) {
  let porcentaje = (informados / poblacion) * 100;

  let texto = `
    <p>

    La difusión crece a una tasa
    aproximada del ${tasa}% por período.

    </p>
    `;

  if (porcentaje >= 90) {
    texto += `
        <p>

        La información se ha difundido
        prácticamente a toda la población.

        </p>
        `;
  } else if (porcentaje >= 50) {
    texto += `
        <p>

        La información alcanzó una parte
        importante de la población.

        </p>
        `;
  } else {
    texto += `
        <p>

        La difusión aún es limitada
        y no alcanza a la mayoría.

        </p>
        `;
  }

  texto += `
    <p>

    A medida que aumentan los períodos,
    la cantidad de personas informadas
    tiende a crecer hasta estabilizarse.

    </p>
    `;

  document.getElementById("interpretacionDifusion").innerHTML = texto;
}

function graficarDifusion(periodos, informados) {
  let ctx = document.getElementById("graficoDifusion").getContext("2d");

  if (graficoDifusion != null) {
    graficoDifusion.destroy();
  }

  graficoDifusion = new Chart(ctx, {
    type: "line",

    data: {
      labels: periodos,

      datasets: [
        {
          label: "Personas informadas",

          data: informados,

          borderWidth: 3,

          tension: 0.3,

          fill: false,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
