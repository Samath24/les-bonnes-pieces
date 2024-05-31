// Récupération des pièces depuis le fichier JSON
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

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

/* Premier jet d'insertion du résultat d'un filtre de prix dans le HTML au noeud ".fiches". Utilisation d'une fonction pour pouvoir être appelée depuis le template literal ( littéral de gabarit ), faisant éviter la syntaxe lourde et illisible basée sur createElement / appendChild */
/* 
  @param {array} array - contenant les données à parcourir
  @param {string} value - indiquant la valeur à afficher
*/
/* let fichesNode = document.querySelector(".fiches");

const afficherResultatFiltresAbordables = () => {
  try {
    let affichageComplet = ``;
    for (let i = 0; i < piecesFiltreesPrix.length; i++) {
      affichageComplet += 
      `
        <li>${piecesFiltreesPrix[i].nom}</li>
      `;
    }
    return affichageComplet;
  } catch (error) {
    return console.log(error);
  }
}

fichesNode.innerHTML += 
  `
  <div>
    <h3>Pièces abordables :</h3>
    <ul>
      ${afficherResultatFiltresAbordables()}
    </ul>
  </div>
  `
; */