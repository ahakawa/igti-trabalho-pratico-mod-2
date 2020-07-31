import { promises as fs } from "fs";

let citiesToState = [];
let UF = "";
let arrayCities = [];

init();

async function init() {
  await citiesStates();
  await qtyCities("AC");
  await statesWithMoreCities();
  await statesWithLessCities();
  await nameGreatThan();
  await nameLessThan();
  await bigger();
  await smaller();
}

/*  Atividade 1 - Função que cria os arquivos JSON tendo a UF como nome do Estado e coloca suas cidades como conteúdo */
async function citiesStates() {
  let statesJson = await fs.readFile("Estados.json", "utf-8");
  let states = JSON.parse(statesJson);
  // console.log(states, 'statesss')

  let citiesJson = await fs.readFile("Cidades.json", "utf-8");
  let cities = JSON.parse(citiesJson);

  for (let state of states) {
    let citiesToState = cities.filter((city) => city.Estado == state.ID);
    let stateJson = await fs.writeFile(`./States/${state.Sigla}.json`, JSON.stringify(citiesToState));
  }
}

/*  Atividade 2 - Função que retorna a quantidade de cidades do respectivo Estado  */
async function qtyCities(UF) {
  try {
    if (UF) {
      let stateJson = await fs.readFile(`./States/${UF}.json`, "utf-8");
      let countCities = JSON.parse(stateJson).length;
      return {
        UF: `${UF}`,
        Total: `${countCities}`,
      };
    }
  } catch (err) {
    console.log(err, "Verifique o UF escolhido");
  }
};

/*  Atividade 3 - Imprime o UF dos 5 Estados que mais possuem cidades, em ordem decrescente */
async function statesWithMoreCities() {
  let maxArray = [];
  let statesJson = await fs.readFile("Estados.json", "utf-8");
  let states = JSON.parse(statesJson);
  for (let state of states) {
    arrayCities.push(await qtyCities(state.Sigla));
    // console.log(countCities, 'countcitiesssssss')
    maxArray = arrayCities.sort(function (a, b) {
      return b.Total - a.Total;
    });
  }

  console.log(maxArray, "Array com os 27 Estados com total de cidades em ordem decrescente");

  let array5 = [];
  for (let i = 0; i < 5; i++) {
    array5.push(maxArray[i]);
  }
  console.log(array5, "5 Estados com mais cidades");
}

/*  Atividade 4 - Imprime o UF dos 5 Estados que menos possuem cidades, em ordem decrescente */
async function statesWithLessCities() {
  let statesJson = await fs.readFile("Estados.json", "utf-8");
  let states = JSON.parse(statesJson);
  let maxArrayReverse = [];
  let maxArrayLess = [];
  let array5min = [];

  for (let state of states) {
    arrayCities.push(await qtyCities(state.Sigla));
    // console.log(countCities, 'countcitiesssssss')
    maxArrayLess = arrayCities.sort(function (a, b) {
      return b.Total - a.Total;
    });
  }
  maxArrayReverse = maxArrayLess.reverse();
  console.log(maxArrayReverse, "Array com os 27 Estados com total de cidades em ordem crescente");

  for (let i = 0; i < 5; i++) {
    array5min.push(maxArrayReverse.shift());
  }
  console.log(array5min.reverse(), "5 Estados com menos cidades");
}

/*  Atividade 5 - Imprime um array com a cidade de maior nome de cada Estado, seguida de seu UF */
async function nameGreatThan() {
  let nome = [];
  let finalArray = [];
  let data = [];

  let dirStates = await fs.readdir(`./States`);
  for (let file of dirStates) {
    let UFJson = await fs.readFile(`./States/${file}`, "utf-8");
    let cityArray = JSON.parse(UFJson);

    for (let city of cityArray) {
      nome = cityArray.sort(function (a, b) {
        return b.Nome.length - a.Nome.length;
      });
    }
    nome = finalArray.push(nome.shift());
  }
  finalArray.push(nome);
  let statesJson = await fs.readFile("Estados.json", "utf-8");
  let states = JSON.parse(statesJson);

  const mapii = states.map((state) => {
    for (let item of finalArray) {
      if (item.Estado == state.ID) {
        data.push(item.Nome + "-" + state.Sigla);
      }
    }
  });
  return data;
  // return console.log(data, 'Imprime um array com a cidade de maior nome de cada Estado, seguida de seu UF');
}

/*  Atividade 6 - Imprime um array com a cidade de menor nome de cada Estado, seguida de seu UF */
async function nameLessThan() {
  let nome = [];
  let finalArray = [];
  let data = [];

  let dirStates = await fs.readdir(`./States`);
  for (let file of dirStates) {
    let UFJson = await fs.readFile(`./States/${file}`, "utf-8");
    let cityArray = JSON.parse(UFJson);
    for (let city of cityArray) {
      nome = cityArray.sort(function (a, b) {
        return a.Nome.length - b.Nome.length; //ordena em ordem crescente da cidade c/ menor nome p/ maior
      });
    }
    nome = finalArray.push(nome.shift()); // shift remove o primeiro elemento do array e push add no final do array
  }
  finalArray.push(nome);
  let statesJson = await fs.readFile("Estados.json", "utf-8");
  let states = JSON.parse(statesJson);

  const mapii = states.map((state) => {
    for (let item of finalArray) {
      if (item.Estado == state.ID) {
        data.push(item.Nome + "-" + state.Sigla);
      }
    }
  });
  return data;
  // return console.log(data, 'Imprime um array com a cidade de menor nome de cada Estado, seguida de seu UF');
}

/*  Atividade 7 - Imprime a cidade de maior nome entre todos os Estados, seguido do seu UF */
async function bigger() {
  let cityBig = [];
  let majorNameCity = [];
  let biggerCities = await nameGreatThan();

  for (let city of biggerCities) {
    cityBig = biggerCities.sort(function (a, b) {
      return a.length - b.length;
    });
  }
  majorNameCity.push(cityBig.pop());
  console.log(majorNameCity, "Imprime a cidade de maior nome entre todos os Estados, seguido do seu UF");
}

/*  Atividade 8 - Imprime a cidade de menor nome entre todos os Estados, seguido do seu UF */

async function smaller() {
  let cityBig = [];
  let smallCity = [];
  let smallerCity = await nameLessThan();

  let order = smallerCity.reduce((prev, curr) => {
    if (prev.length < curr.length) return prev;
    else if (prev.length > curr.length) return curr;
    else return prev.toLowerCase() < curr.toLowerCase() ? prev : curr;
  });
  console.log(order,"Imprime a cidade de menor nome entre todos os Estados, seguido do seu UF");
}
