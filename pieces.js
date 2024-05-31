/* Récupération des pièces depuis le fichier JSON */
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

/* 
  @param {array} array - contenant les données déjà filtrées des pièces à afficher
 */
function genererPieces(array) {
  const article = document.querySelector(".fiches");
  article.innerHTML = '';
  for (let i = 0; i < array.length; i++) {
    article.innerHTML += `
    <div class="piece-${array[i].id}">
      <img src=${array[i].image} />
      <h2>${array[i].nom}</h2>
      <p>
        Prix: ${array[i].prix} € (${array[i].prix < 35 ? "€" : "€€€"})
      </p>
      <p>
        ${array[i].categorie ?? "Aucune catégorie"}
      </p>
      <p>
        ${array[i].description ?? "Pas de description pour le moment"}
      </p>
      <p class="${array[i].disponibilite ? "en-stock" : "rupture"}">
        ${array[i].disponibilite ? "En stock" : "Rupture de stock"}
      </p>
    </div>
    `;
  }
}

/* Premier affichage, sans filtre */
try {
  genererPieces(pieces);
} catch (error) {
  console.log(error);
}

/* Bouton de tri par prix croissant */
const btnTrier = document.querySelector(".btn-trier");
btnTrier.addEventListener("click", () => {
  const piecesTriees = Array.from(pieces);
  piecesTriees.sort( (a,b) => a.prix - b.prix );
  try {
    genererPieces(piecesTriees);
  } catch (error) {
    console.log(error);
  }
});

/* Bouton de tri par prix décroissant */
const btnTrierDecroissant = document.querySelector(".btn-trier-decroissant");
btnTrierDecroissant.addEventListener("click", () => {
  const piecesTriees = Array.from(pieces);
  piecesTriees.sort( (a,b) => b.prix - a.prix );
  try {
    genererPieces(piecesTriees);
  } catch (error) {
    console.log(error);
  }
});

/* Bouton de filtre dont le prix est <= 35 */
const btnFiltrer = document.querySelector(".btn-filtrer");
btnFiltrer.addEventListener("click", () => {
  const piecesPrepFiltrage = Array.from(pieces);
  let piecesFiltrees = piecesPrepFiltrage.filter( (piece) => piece.prix <= 35 );
  try {
    genererPieces(piecesFiltrees);
  } catch (error) {
    console.log(error);
  }
});

/* Bouton de filtre excluant les éléments sans description */
const btnFiltrerDescription = document.querySelector(".btn-filtrer-description");
btnFiltrerDescription.addEventListener("click", () => {
  const piecesPrepFiltrage = Array.from(pieces);
  let piecesFiltrees = piecesPrepFiltrage.filter( (piece) => piece.description );
  try {
    genererPieces(piecesFiltrees);
  } catch (error) {
    console.log(error);
  }
});

/* Bouton de filtre excluant les éléments sans description */
const btnFiltrerOptiques = document.querySelector(".btn-filtrer-optiques");
btnFiltrerOptiques.addEventListener("click", () => {
  const piecesPrepFiltrage = Array.from(pieces);
  let piecesFiltrees = piecesPrepFiltrage.filter( (piece) => piece.categorie === "Optiques" );
  try {
    genererPieces(piecesFiltrees);
  } catch (error) {
    console.log(error);
  }
});

/* Méthode pour créer un objet ne conservant que les valeurs souhaitées ( ici, le nom des pièces ) */
const nomPieces = pieces.map( piece => piece.nom );

/* Suppression des éléments dont prix >= à 35. Tableau parcouru de la fin vers le début dans le cadre d'une suppression, pour éviter les décalages d'indices, faisant potentiellement échouer le test sur certains indices */
for (let i = pieces.length-1; i >= 0; i--) {
  if ( pieces[i].prix >= 35) {
    nomPieces.splice(i, 1);
  }
}

/* Ce qui revient au même qu'un filtrage, qui a l'avantage d'être plus facile à lire */
const prepPiecesFiltreesPrix = structuredClone(pieces);
const piecesFiltreesPrix = prepPiecesFiltreesPrix.filter( (piece) => !(piece.prix >= 35) );

/* Copie du tableau "pieces", multiplication par 2 des prix dans la copie créée, sans affecter le tableau original => nécessité d'une "deep copy" permise par la fonction structuredClone() */
const testDouble = structuredClone(pieces);
testDouble.forEach( (piece) => {
  piece.prix = piece.prix*2;
})

/* Affichage de la valeur de l'input range */
let inputValue = document.querySelector("#range-prix-input");
let inputAffichage = document.querySelector("#range-prix-affichage");
inputAffichage.innerHTML = `${inputValue.value} €`; // Donnée initiale, valeur par défaut
/* Modification de la valeur affichée du paramètre de prix dès que le slider bouge, pour plus de dynamisme, et une meilleure UX */
inputValue.addEventListener("input", () => {
  inputAffichage.innerHTML = `${inputValue.value} €`;
});
/* Modification de la valeur affichée du paramètre de prix lorsque le slider est relaché, pour une économie de requête et de bande passante */
inputValue.addEventListener("change", () => {
  const piecesPrepFiltrage = Array.from(pieces);
  let piecesFiltrees = piecesPrepFiltrage.filter( (piece) => piece.prix <= inputValue.value );
  try {
    genererPieces(piecesFiltrees);
  } catch (error) {
    console.log(error);
  }
});